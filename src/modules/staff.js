export class StaffModule {
  constructor({ drivers = [], engineers = [], shifts = [] } = {}) {
    this.drivers = drivers;
    this.engineers = engineers;
    this.shifts = shifts;
  }

  planShift({ line, driverId, engineerId, trainId, slot }) {
    this.shifts.push({ line, driverId, engineerId, trainId, slot });
  }

  getTeamAssignments() {
    return this.shifts.map((shift) => {
      const driver = this.drivers.find((item) => item.id === shift.driverId);
      const engineer = this.engineers.find((item) => item.id === shift.engineerId);
      return {
        ...shift,
        driver: driver?.name ?? "Inconnu",
        engineer: engineer?.name ?? "Inconnu",
      };
    });
  }
}
