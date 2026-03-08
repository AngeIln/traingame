import { FinanceModule } from "./modules/finance.js";
import { FleetModule } from "./modules/fleet.js";
import { StaffModule } from "./modules/staff.js";
import { MaintenanceModule } from "./modules/maintenance.js";

const finance = new FinanceModule({
  loans: [
    { principal: 4200000, rate: 0.045 },
    { principal: 1500000, rate: 0.038 },
  ],
  bonds: [{ faceValue: 3000000, couponRate: 0.03 }],
  plHistory: [
    { period: "T1", revenue: 6200000, costs: 5000000 },
    { period: "T2", revenue: 6600000, costs: 5300000 },
    { period: "T3", revenue: 7000000, costs: 5700000 },
    { period: "T4", revenue: 7350000, costs: 5900000 },
  ],
});

const fleet = new FleetModule({
  locomotives: [
    { id: "L-101", name: "Aquila", type: "Fret", state: "Opérationnel", line: "Nord" },
    { id: "L-204", name: "Ventoux", type: "Mixte", state: "Surveillance", line: "Est" },
    { id: "L-309", name: "Mistral", type: "Passagers", state: "Immobilisé", line: "Sud" },
  ],
  wagons: [
    { id: "W-01", locoId: "L-101", capacity: 110 },
    { id: "W-02", locoId: "L-101", capacity: 90 },
    { id: "W-03", locoId: "L-204", capacity: 130 },
    { id: "W-04", locoId: "L-309", capacity: 80 },
  ],
});

const staff = new StaffModule({
  drivers: [
    { id: "D1", name: "M. Lebrun" },
    { id: "D2", name: "S. Diallo" },
  ],
  engineers: [
    { id: "E1", name: "C. Martin" },
    { id: "E2", name: "R. Zhang" },
  ],
});
staff.planShift({
  line: "Nord",
  driverId: "D1",
  engineerId: "E2",
  trainId: "L-101",
  slot: "06:00-14:00",
});
staff.planShift({
  line: "Est",
  driverId: "D2",
  engineerId: "E1",
  trainId: "L-204",
  slot: "14:00-22:00",
});

const maintenance = new MaintenanceModule({
  assets: [
    { id: "L-101", wear: 22, breakdown: false, inWorkshop: false },
    { id: "L-204", wear: 81, breakdown: false, inWorkshop: true },
    { id: "L-309", wear: 67, breakdown: true, inWorkshop: false },
  ],
  workshopSlots: 2,
});

function formatCurrency(value) {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value);
}

function renderCfoDashboard() {
  document.getElementById("cashflow-kpi").textContent = formatCurrency(finance.cashflow);
  document.getElementById("margin-kpi").textContent = `${finance.margin.toFixed(1)} %`;
  document.getElementById("debt-kpi").textContent = formatCurrency(finance.totalDebt);

  const list = document.getElementById("pl-history");
  list.innerHTML = "";
  finance.plHistory.forEach((entry) => {
    const line = document.createElement("li");
    line.textContent = `${entry.period} · Revenus ${formatCurrency(entry.revenue)} · Coûts ${formatCurrency(entry.costs)}`;
    list.appendChild(line);
  });
}

function renderFleet() {
  const body = document.getElementById("fleet-table-body");
  body.innerHTML = "";

  fleet.getFleetStatus().forEach((train) => {
    const tr = document.createElement("tr");
    tr.innerHTML = `
      <td>${train.name}</td>
      <td>${train.type}</td>
      <td>${train.state}</td>
      <td>${train.line}</td>
      <td>${train.capacity}</td>
    `;
    body.appendChild(tr);
  });
}

function renderAlerts() {
  const criticalBreakdowns = maintenance.getCriticalBreakdowns().map(
    (asset) => `⚠️ Panne critique ou usure élevée: ${asset.id}`,
  );

  const lossMakingLine = finance.margin < 15 ? ["📉 Ligne Est déficitaire (marge faible)"] : [];
  const workshop = maintenance.getWorkshopLoad();
  const saturatedWorkshop = workshop.saturation >= 100 ? ["🛠️ Atelier saturé"] : [];

  const alerts = [...criticalBreakdowns, ...lossMakingLine, ...saturatedWorkshop];
  const list = document.getElementById("priority-alerts");
  list.innerHTML = "";

  alerts.forEach((alert) => {
    const li = document.createElement("li");
    li.textContent = alert;
    list.appendChild(li);
  });
}

function renderStaff() {
  const list = document.getElementById("staff-list");
  list.innerHTML = "";

  staff.getTeamAssignments().forEach((assignment) => {
    const li = document.createElement("li");
    li.textContent = `${assignment.slot} · Ligne ${assignment.line} · Train ${assignment.trainId} · Conducteur ${assignment.driver} · Ingénieur ${assignment.engineer}`;
    list.appendChild(li);
  });
}

renderCfoDashboard();
renderFleet();
renderAlerts();
renderStaff();
