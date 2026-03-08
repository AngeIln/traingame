export class FinanceModule {
  constructor({ loans = [], bonds = [], plHistory = [] } = {}) {
    this.loans = loans;
    this.bonds = bonds;
    this.plHistory = plHistory;
  }

  get totalDebt() {
    const loanDebt = this.loans.reduce((sum, loan) => sum + loan.principal, 0);
    const bondDebt = this.bonds.reduce((sum, bond) => sum + bond.faceValue, 0);
    return loanDebt + bondDebt;
  }

  get monthlyInterest() {
    const loanInterest = this.loans.reduce(
      (sum, loan) => sum + (loan.principal * loan.rate) / 12,
      0,
    );
    const bondCoupons = this.bonds.reduce(
      (sum, bond) => sum + (bond.faceValue * bond.couponRate) / 12,
      0,
    );
    return loanInterest + bondCoupons;
  }

  get latestPnL() {
    return this.plHistory[this.plHistory.length - 1] ?? { revenue: 0, costs: 0 };
  }

  get cashflow() {
    const latest = this.latestPnL;
    return latest.revenue - latest.costs - this.monthlyInterest;
  }

  get margin() {
    const latest = this.latestPnL;
    if (!latest.revenue) return 0;
    return ((latest.revenue - latest.costs) / latest.revenue) * 100;
  }
}
