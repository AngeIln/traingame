const crypto = require('crypto');
const { TickScheduler } = require('./scheduler');
const { defaultIncidentProbabilities, defaultEconomyConfig } = require('./config');
const { StateRepository } = require('./stateRepository');

function id(prefix) {
  return `${prefix}_${crypto.randomUUID().slice(0, 8)}`;
}

class SimulationEngine {
  constructor({ repository = new StateRepository(), snapshotIntervalTicks = 30 } = {}) {
    this.repository = repository;
    this.snapshotIntervalTicks = snapshotIntervalTicks;
    this.state = this.repository.load(this.createDefaultState());
    this.scheduler = new TickScheduler({ tickDurationMs: 1000, onTick: () => this.tick() });
  }

  createDefaultState() {
    return {
      meta: {
        tick: 0,
        running: false,
        lastSnapshotTick: 0,
        incidentProbabilities: { ...defaultIncidentProbabilities },
        economyConfig: { ...defaultEconomyConfig },
      },
      finance: {
        cash: 10_000_000,
        debt: 2_000_000,
        revenueTickets: 0,
        revenueCargo: 0,
        expensesSalaries: 0,
        expensesEnergy: 0,
        expensesMaintenance: 0,
        expensesDebt: 0,
      },
      entities: {
        cities: [],
        stations: [],
        trackSegments: [],
        trains: [],
        lines: [],
        cargoContracts: [],
      },
      demand: {
        passengerByCityPair: {},
        cargoByCityPair: {},
      },
      incidents: [],
    };
  }

  save() {
    this.repository.save(this.state);
  }

  pause() {
    this.state.meta.running = false;
    this.scheduler.stop();
    this.save();
  }

  resume() {
    this.state.meta.running = true;
    this.scheduler.start();
    this.save();
  }

  setIncidentProbabilities(probabilities) {
    this.state.meta.incidentProbabilities = {
      ...this.state.meta.incidentProbabilities,
      ...probabilities,
    };
    this.save();
  }

  createLine({ name, stationIds, ticketPrice, cargoPricePerTon }) {
    const line = {
      id: id('line'),
      name,
      stationIds,
      trainIds: [],
      ticketPrice,
      cargoPricePerTon,
      paused: false,
    };
    this.state.entities.lines.push(line);
    this.save();
    return line;
  }

  buyTrain(payload) {
    const train = {
      id: id('train'),
      status: 'idle',
      ticksOutOfService: 0,
      ...payload,
    };

    this.state.entities.trains.push(train);
    this.state.finance.cash -= train.purchasePrice || 0;

    if (train.lineId) {
      const line = this.state.entities.lines.find((l) => l.id === train.lineId);
      if (line) line.trainIds.push(train.id);
    }

    this.save();
    return train;
  }

  updateLinePricing(lineId, { ticketPrice, cargoPricePerTon }) {
    const line = this.state.entities.lines.find((l) => l.id === lineId);
    if (!line) throw new Error('Line not found');
    if (typeof ticketPrice === 'number') line.ticketPrice = ticketPrice;
    if (typeof cargoPricePerTon === 'number') line.cargoPricePerTon = cargoPricePerTon;
    this.save();
    return line;
  }

  tick() {
    this.state.meta.tick += 1;
    this.processRepairs();
    this.computeDemand();
    this.generateIncidents();
    this.processTrafficAndEconomy();

    if (this.state.meta.tick - this.state.meta.lastSnapshotTick >= this.snapshotIntervalTicks) {
      this.repository.createSnapshot(this.state, this.state.meta.tick);
      this.state.meta.lastSnapshotTick = this.state.meta.tick;
    }

    this.save();
  }

  processRepairs() {
    for (const train of this.state.entities.trains) {
      if (train.status === 'broken') {
        train.ticksOutOfService -= 1;
        if (train.ticksOutOfService <= 0) {
          train.status = 'idle';
          train.ticksOutOfService = 0;
        }
      }
    }
  }

  computeDemand() {
    const cities = this.state.entities.cities;
    const passengerByCityPair = {};
    const cargoByCityPair = {};

    for (let i = 0; i < cities.length; i += 1) {
      for (let j = i + 1; j < cities.length; j += 1) {
        const a = cities[i];
        const b = cities[j];
        const key = `${a.id}:${b.id}`;
        const popFactor = Math.sqrt(a.population * b.population);
        passengerByCityPair[key] = Math.round(popFactor * 0.0008 * a.passengerDemand * b.passengerDemand);
        cargoByCityPair[key] = Math.round(popFactor * 0.00015 * a.cargoDemand * b.cargoDemand);
      }
    }

    for (const contract of this.state.entities.cargoContracts) {
      if (!contract.active) continue;
      const key = [contract.fromCityId, contract.toCityId].sort().join(':');
      cargoByCityPair[key] = (cargoByCityPair[key] || 0) + contract.tonsPerTick;
    }

    this.state.demand.passengerByCityPair = passengerByCityPair;
    this.state.demand.cargoByCityPair = cargoByCityPair;
  }

  randomIncident(type, probability, details) {
    if (Math.random() < probability) {
      const incident = {
        id: id('incident'),
        tick: this.state.meta.tick,
        type,
        ...details,
      };
      this.state.incidents.push(incident);
      return incident;
    }
    return null;
  }

  generateIncidents() {
    const p = this.state.meta.incidentProbabilities;

    const activeTrains = this.state.entities.trains.filter((t) => t.status !== 'broken');
    if (activeTrains.length > 0) {
      const train = activeTrains[Math.floor(Math.random() * activeTrains.length)];
      const adjustedBreakdown = p.trainBreakdown + (1 - (train.reliability || 0.95)) * 0.1;
      const incident = this.randomIncident('train_breakdown', adjustedBreakdown, { trainId: train.id });
      if (incident) {
        train.status = 'broken';
        train.ticksOutOfService = 3;
      }
    }

    this.randomIncident('congestion', p.congestion, {});
    this.randomIncident('weather', p.weather, {});

    const retentionTicks = 200;
    this.state.incidents = this.state.incidents.filter((i) => this.state.meta.tick - i.tick <= retentionTicks);
  }

  processTrafficAndEconomy() {
    const latestIncidents = this.state.incidents.filter((i) => i.tick === this.state.meta.tick);
    const weatherPenalty = latestIncidents.some((i) => i.type === 'weather') ? 0.8 : 1;
    const congestionPenalty = latestIncidents.some((i) => i.type === 'congestion') ? 0.75 : 1;

    let soldTickets = 0;
    let movedCargo = 0;

    for (const line of this.state.entities.lines) {
      if (line.paused) continue;
      const lineTrains = this.state.entities.trains.filter((t) => t.lineId === line.id && t.status !== 'broken');
      const capacityPassengers = lineTrains.reduce((acc, t) => acc + (t.passengerCapacity || 0), 0);
      const capacityCargo = lineTrains.reduce((acc, t) => acc + (t.cargoCapacityTons || 0), 0);
      const effectivePassenger = Math.round(capacityPassengers * weatherPenalty * congestionPenalty);
      const effectiveCargo = Math.round(capacityCargo * weatherPenalty * congestionPenalty);

      const lineDemand = this.estimateLineDemand(line);
      soldTickets += Math.min(effectivePassenger, lineDemand.passengers);
      movedCargo += Math.min(effectiveCargo, lineDemand.cargo);

      for (const train of lineTrains) {
        this.state.finance.expensesSalaries += train.crewSalaryPerTick || 0;
        this.state.finance.expensesMaintenance += train.maintenancePerTick || 0;
        const energyBase = train.energyType === 'electric'
          ? this.state.meta.economyConfig.electricCostPerTrainTick
          : this.state.meta.economyConfig.dieselCostPerTrainTick;
        this.state.finance.expensesEnergy += energyBase + (train.operatingCostPerTick || 0);
      }
    }

    const avgTicketPrice = this.average(this.state.entities.lines.map((l) => l.ticketPrice), 20);
    const avgCargoPrice = this.average(this.state.entities.lines.map((l) => l.cargoPricePerTon), 35);

    this.state.finance.revenueTickets += soldTickets * avgTicketPrice;
    this.state.finance.revenueCargo += movedCargo * avgCargoPrice;

    const debtPayment = Math.min(
      this.state.finance.debt,
      this.state.meta.economyConfig.debtRepaymentPerTick,
    );
    this.state.finance.debt -= debtPayment;
    this.state.finance.expensesDebt += debtPayment;

    const totalRevenue = this.state.finance.revenueTickets + this.state.finance.revenueCargo;
    const totalExpenses =
      this.state.finance.expensesSalaries
      + this.state.finance.expensesEnergy
      + this.state.finance.expensesMaintenance
      + this.state.finance.expensesDebt;
    this.state.finance.cash = 10_000_000 + totalRevenue - totalExpenses;
  }

  estimateLineDemand(line) {
    const stationToCity = new Map(this.state.entities.stations.map((s) => [s.id, s.cityId]));
    const cityIds = line.stationIds.map((sid) => stationToCity.get(sid)).filter(Boolean);

    let passengers = 0;
    let cargo = 0;
    for (let i = 0; i < cityIds.length; i += 1) {
      for (let j = i + 1; j < cityIds.length; j += 1) {
        const key = [cityIds[i], cityIds[j]].sort().join(':');
        passengers += this.state.demand.passengerByCityPair[key] || 0;
        cargo += this.state.demand.cargoByCityPair[key] || 0;
      }
    }

    return { passengers, cargo };
  }

  average(values, fallback) {
    if (!values.length) return fallback;
    return values.reduce((a, b) => a + b, 0) / values.length;
  }

  getState() {
    return this.state;
  }
}

module.exports = {
  SimulationEngine,
};
