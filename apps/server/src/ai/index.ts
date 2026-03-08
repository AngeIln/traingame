export type AiProfile = 'aggressive' | 'defensive' | 'opportunistic';

export interface AiCompany {
  id: string;
  name: string;
  profile: AiProfile;
  cash: number;
  debt: number;
  passengerVolume: number;
  freightVolume: number;
  punctuality: number; // 0-100
  customerSatisfaction: number; // 0-100
  fleetAverageAge: number; // years
  networkCoverage: number; // 0-100
  pricingIndex: number; // 100 baseline
  isPlayer?: boolean;
}

export interface SimulationCycleContext {
  cycle: number;
  marketGrowth: number; // -1 to 1
  competitionPressure: number; // 0 to 1
  eventModifiers: EventModifiers;
  phase: 'early' | 'mid' | 'late';
}

export interface EventModifiers {
  revenueFactor: number;
  costFactor: number;
  punctualityDelta: number;
  modernizationBonus: number;
}

export interface AiDecision {
  companyId: string;
  expandLineBudget: number;
  priceWarIntensity: number; // 0 to 1
  fleetModernizationBudget: number;
  notes: string[];
}

export interface MacroEvent {
  id: 'subsidies' | 'fuel_crisis' | 'strike';
  label: string;
  durationCycles: number;
  modifiers: EventModifiers;
  description: string;
}

export interface LateGameAction {
  type: 'acquisition' | 'merger' | 'regulation_response' | 'national_objective';
  actorId: string;
  targetId?: string;
  details: string;
}

export interface ComparisonMetrics {
  companyId: string;
  passengerMarketShare: number;
  freightMarketShare: number;
  punctuality: number;
  customerSatisfaction: number;
  profitability: number;
}

const COMPANY_NAMES = [
  'NordRail Dynamics',
  'Hexa Transit Group',
  'CargoVelocity Rail',
  'Atlas Lignes Unifiées',
  'BlueTrack Logistics',
];

const PROFILE_WEIGHTS: Record<AiProfile, { expansion: number; priceWar: number; modernization: number }> = {
  aggressive: { expansion: 0.5, priceWar: 0.35, modernization: 0.15 },
  defensive: { expansion: 0.2, priceWar: 0.15, modernization: 0.65 },
  opportunistic: { expansion: 0.35, priceWar: 0.3, modernization: 0.35 },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function randomBetween(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

/**
 * Crée entre 2 et 5 compagnies IA avec des profils variés.
 */
export function createAiCompanies(count = 4): AiCompany[] {
  const clampedCount = clamp(Math.round(count), 2, 5);
  const profiles: AiProfile[] = ['aggressive', 'defensive', 'opportunistic'];

  return Array.from({ length: clampedCount }).map((_, idx) => {
    const profile = profiles[idx % profiles.length];
    return {
      id: `ai_${idx + 1}`,
      name: COMPANY_NAMES[idx % COMPANY_NAMES.length],
      profile,
      cash: Math.round(randomBetween(40_000_000, 120_000_000)),
      debt: Math.round(randomBetween(10_000_000, 80_000_000)),
      passengerVolume: Math.round(randomBetween(300_000, 2_000_000)),
      freightVolume: Math.round(randomBetween(80_000, 900_000)),
      punctuality: Math.round(randomBetween(72, 96)),
      customerSatisfaction: Math.round(randomBetween(65, 92)),
      fleetAverageAge: Math.round(randomBetween(6, 26)),
      networkCoverage: Math.round(randomBetween(20, 75)),
      pricingIndex: Math.round(randomBetween(88, 116)),
    };
  });
}

/**
 * Décision IA par cycle: expansion, guerre des prix, modernisation de flotte.
 */
export function computeCycleDecision(company: AiCompany, ctx: SimulationCycleContext): AiDecision {
  const weights = PROFILE_WEIGHTS[company.profile];
  const liquidity = clamp(company.cash / Math.max(company.debt, 1), 0.2, 3);

  const expansionNeed = clamp((100 - company.networkCoverage) / 100, 0, 1);
  const modernizationNeed = clamp(company.fleetAverageAge / 30, 0, 1);
  const pricePressure = clamp(ctx.competitionPressure + (ctx.marketGrowth < 0 ? 0.2 : 0), 0, 1);

  const budgetBase = company.cash * 0.2 * ctx.eventModifiers.revenueFactor;

  const expandLineBudget =
    budgetBase * (weights.expansion * (0.6 + expansionNeed * 0.8) * (1 + Math.max(ctx.marketGrowth, 0)));

  const fleetModernizationBudget =
    budgetBase *
    (weights.modernization * (0.5 + modernizationNeed) * (1 + ctx.eventModifiers.modernizationBonus));

  const priceWarIntensity = clamp(
    weights.priceWar * (0.4 + pricePressure * 0.8) * (liquidity > 1 ? 1.15 : 0.85),
    0,
    1,
  );

  const notes: string[] = [];
  if (expandLineBudget > fleetModernizationBudget) notes.push('Focus sur l\'expansion du réseau');
  if (priceWarIntensity > 0.45) notes.push('Guerre des prix activée sur les corridors concurrentiels');
  if (fleetModernizationBudget > budgetBase * 0.35) notes.push('Renouvellement accéléré de la flotte');

  return {
    companyId: company.id,
    expandLineBudget: Math.round(expandLineBudget),
    priceWarIntensity: Number(priceWarIntensity.toFixed(2)),
    fleetModernizationBudget: Math.round(fleetModernizationBudget),
    notes,
  };
}

/**
 * Système d'événements macro: subventions, crise carburant, grève.
 */
export function rollMacroEvent(): MacroEvent {
  const pick = Math.random();

  if (pick < 0.34) {
    return {
      id: 'subsidies',
      label: 'Subventions à la mobilité',
      durationCycles: 3,
      modifiers: {
        revenueFactor: 1.15,
        costFactor: 0.95,
        punctualityDelta: 1,
        modernizationBonus: 0.2,
      },
      description: 'L\'État subventionne les lignes régionales et la modernisation du matériel.',
    };
  }

  if (pick < 0.68) {
    return {
      id: 'fuel_crisis',
      label: 'Crise énergétique',
      durationCycles: 4,
      modifiers: {
        revenueFactor: 0.92,
        costFactor: 1.25,
        punctualityDelta: -2,
        modernizationBonus: 0.15,
      },
      description: 'Hausse brutale du prix de l\'énergie, pression sur les marges et l\'offre.',
    };
  }

  return {
    id: 'strike',
    label: 'Grève sectorielle',
    durationCycles: 2,
    modifiers: {
      revenueFactor: 0.8,
      costFactor: 1.08,
      punctualityDelta: -8,
      modernizationBonus: 0,
    },
    description: 'Mouvement social perturbant fortement l\'exploitation.',
  };
}

/**
 * Late game: acquisitions/fusions, régulations et objectifs nationaux.
 */
export function resolveLateGameActions(companies: AiCompany[], ctx: SimulationCycleContext): LateGameAction[] {
  if (ctx.phase !== 'late') return [];

  const sortedByCash = [...companies].sort((a, b) => b.cash - a.cash);
  const richest = sortedByCash[0];
  const weakest = sortedByCash[sortedByCash.length - 1];

  const actions: LateGameAction[] = [];

  if (richest && weakest && richest.id !== weakest.id && richest.cash > weakest.cash * 1.8) {
    actions.push({
      type: 'acquisition',
      actorId: richest.id,
      targetId: weakest.id,
      details: `${richest.name} lance une offre de rachat sur ${weakest.name}.`,
    });
  }

  if (companies.length >= 4) {
    const mergeCandidates = sortedByCash.slice(1, 3);
    if (mergeCandidates.length === 2) {
      actions.push({
        type: 'merger',
        actorId: mergeCandidates[0].id,
        targetId: mergeCandidates[1].id,
        details: `Fusion défensive entre ${mergeCandidates[0].name} et ${mergeCandidates[1].name}.`,
      });
    }
  }

  actions.push({
    type: 'regulation_response',
    actorId: richest?.id ?? companies[0]?.id ?? 'unknown',
    details: 'Réponse à une régulation antitrust: cession de slots sur les hubs saturés.',
  });

  actions.push({
    type: 'national_objective',
    actorId: richest?.id ?? companies[0]?.id ?? 'unknown',
    details: 'Objectif national: 30% de report modal vers le rail sur 10 ans.',
  });

  return actions;
}

/**
 * Métriques de comparaison: parts de marché, ponctualité, satisfaction, rentabilité.
 */
export function computeComparisonMetrics(companies: AiCompany[]): ComparisonMetrics[] {
  const totalPassengers = companies.reduce((sum, c) => sum + c.passengerVolume, 0) || 1;
  const totalFreight = companies.reduce((sum, c) => sum + c.freightVolume, 0) || 1;

  return companies.map((company) => {
    const revenues =
      company.passengerVolume * (45 / company.pricingIndex) + company.freightVolume * (31 / company.pricingIndex);
    const costs =
      (company.passengerVolume * 16 + company.freightVolume * 21) * (1 + company.fleetAverageAge / 100);
    const profitability = ((revenues - costs) / Math.max(revenues, 1)) * 100;

    return {
      companyId: company.id,
      passengerMarketShare: Number(((company.passengerVolume / totalPassengers) * 100).toFixed(2)),
      freightMarketShare: Number(((company.freightVolume / totalFreight) * 100).toFixed(2)),
      punctuality: company.punctuality,
      customerSatisfaction: company.customerSatisfaction,
      profitability: Number(profitability.toFixed(2)),
    };
  });
}

export function runAiCycle(companies: AiCompany[], ctx: SimulationCycleContext) {
  const decisions = companies.map((company) => computeCycleDecision(company, ctx));
  const lateGameActions = resolveLateGameActions(companies, ctx);
  const comparison = computeComparisonMetrics(companies);

  return {
    decisions,
    lateGameActions,
    comparison,
  };
}
