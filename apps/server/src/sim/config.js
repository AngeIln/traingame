const defaultIncidentProbabilities = {
  trainBreakdown: 0.03,
  congestion: 0.05,
  weather: 0.02,
};

const defaultEconomyConfig = {
  dieselCostPerTrainTick: 110,
  electricCostPerTrainTick: 70,
  debtRepaymentPerTick: 500,
};

module.exports = {
  defaultIncidentProbabilities,
  defaultEconomyConfig,
};
