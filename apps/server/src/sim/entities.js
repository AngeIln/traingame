class City {
  constructor({ id, name, population, passengerDemand = 1, cargoDemand = 1 }) {
    this.id = id;
    this.name = name;
    this.population = population;
    this.passengerDemand = passengerDemand;
    this.cargoDemand = cargoDemand;
  }
}

class Station {
  constructor({ id, cityId, name, platformCapacity = 2 }) {
    this.id = id;
    this.cityId = cityId;
    this.name = name;
    this.platformCapacity = platformCapacity;
  }
}

class TrackSegment {
  constructor({ id, fromStationId, toStationId, distanceKm, maxTrains = 2, electrified = false }) {
    this.id = id;
    this.fromStationId = fromStationId;
    this.toStationId = toStationId;
    this.distanceKm = distanceKm;
    this.maxTrains = maxTrains;
    this.electrified = electrified;
  }
}

class Train {
  constructor({
    id,
    name,
    lineId = null,
    passengerCapacity = 0,
    cargoCapacityTons = 0,
    speedKmH = 100,
    reliability = 0.95,
    energyType = 'diesel',
    purchasePrice = 1_000_000,
    operatingCostPerTick = 200,
    maintenancePerTick = 100,
    crewSalaryPerTick = 150,
  }) {
    this.id = id;
    this.name = name;
    this.lineId = lineId;
    this.passengerCapacity = passengerCapacity;
    this.cargoCapacityTons = cargoCapacityTons;
    this.speedKmH = speedKmH;
    this.reliability = reliability;
    this.energyType = energyType;
    this.purchasePrice = purchasePrice;
    this.operatingCostPerTick = operatingCostPerTick;
    this.maintenancePerTick = maintenancePerTick;
    this.crewSalaryPerTick = crewSalaryPerTick;
    this.status = 'idle';
    this.ticksOutOfService = 0;
  }
}

class Line {
  constructor({ id, name, stationIds = [], trainIds = [], ticketPrice = 20, cargoPricePerTon = 35 }) {
    this.id = id;
    this.name = name;
    this.stationIds = stationIds;
    this.trainIds = trainIds;
    this.ticketPrice = ticketPrice;
    this.cargoPricePerTon = cargoPricePerTon;
    this.paused = false;
  }
}

class CargoContract {
  constructor({
    id,
    fromCityId,
    toCityId,
    tonsPerTick,
    pricePerTon,
    priority = 1,
    active = true,
  }) {
    this.id = id;
    this.fromCityId = fromCityId;
    this.toCityId = toCityId;
    this.tonsPerTick = tonsPerTick;
    this.pricePerTon = pricePerTon;
    this.priority = priority;
    this.active = active;
  }
}

module.exports = {
  City,
  Station,
  TrackSegment,
  Train,
  Line,
  CargoContract,
};
