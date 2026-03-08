export class MaintenanceModule {
  constructor({ assets = [], workshopSlots = 2 } = {}) {
    this.assets = assets;
    this.workshopSlots = workshopSlots;
  }

  registerWear(trainId, amount) {
    this.assets = this.assets.map((asset) =>
      asset.id === trainId
        ? { ...asset, wear: Math.min(100, (asset.wear ?? 0) + amount) }
        : asset,
    );
  }

  enqueueWorkshop(trainId, reason) {
    this.assets = this.assets.map((asset) =>
      asset.id === trainId
        ? {
            ...asset,
            inWorkshop: true,
            immobilized: true,
            workshopReason: reason,
          }
        : asset,
    );
  }

  getCriticalBreakdowns() {
    return this.assets.filter((asset) => asset.wear >= 80 || asset.breakdown === true);
  }

  getWorkshopLoad() {
    const active = this.assets.filter((asset) => asset.inWorkshop).length;
    return {
      active,
      capacity: this.workshopSlots,
      saturation: this.workshopSlots ? (active / this.workshopSlots) * 100 : 100,
    };
  }
}
