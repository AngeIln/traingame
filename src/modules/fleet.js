export class FleetModule {
  constructor({ locomotives = [], wagons = [] } = {}) {
    this.locomotives = locomotives;
    this.wagons = wagons;
  }

  buyLocomotive(loco) {
    this.locomotives.push(loco);
  }

  sellLocomotive(id) {
    this.locomotives = this.locomotives.filter((loco) => loco.id !== id);
  }

  upgradeLocomotive(id, patch) {
    this.locomotives = this.locomotives.map((loco) =>
      loco.id === id ? { ...loco, ...patch, upgraded: true } : loco,
    );
  }

  assignLine(id, line) {
    this.locomotives = this.locomotives.map((loco) =>
      loco.id === id ? { ...loco, line } : loco,
    );
  }

  getFleetStatus() {
    return this.locomotives.map((loco) => {
      const matchedWagons = this.wagons.filter((wagon) => wagon.locoId === loco.id);
      return {
        ...loco,
        capacity: matchedWagons.reduce((sum, wagon) => sum + wagon.capacity, 0),
      };
    });
  }
}
