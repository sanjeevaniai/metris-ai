// Monte Carlo Financial Risk Results - Hardcoded for Enterprise Demo
export const DEMO_FINANCIAL_RISK = {
  expectedLoss: 847293,
  var95: 2145000,
  var99: 3892000,
  cvar: 2567000,
  auditProbability: 0.42,
  fineProbability: 0.68,
  iterations: 10000,
  monteCarloResults: {
    expectedLoss: 847293,
    var95: 2145000,
    cvar95: 2567000,
    distribution: [
      { exposure: 0, probability: 0.05 },
      { exposure: 250000, probability: 0.12 },
      { exposure: 500000, probability: 0.18 },
      { exposure: 750000, probability: 0.22 },
      { exposure: 1000000, probability: 0.18 },
      { exposure: 1500000, probability: 0.12 },
      { exposure: 2000000, probability: 0.08 },
      { exposure: 2500000, probability: 0.03 },
      { exposure: 3000000, probability: 0.015 },
      { exposure: 4000000, probability: 0.005 },
    ],
  },
};

// Distribution data for histogram
export const DEMO_DISTRIBUTION = [
  { min: 0, max: 250000, count: 5823, percentage: 58.23 },
  { min: 250000, max: 500000, count: 1847, percentage: 18.47 },
  { min: 500000, max: 1000000, count: 1234, percentage: 12.34 },
  { min: 1000000, max: 2000000, count: 678, percentage: 6.78 },
  { min: 2000000, max: 3000000, count: 298, percentage: 2.98 },
  { min: 3000000, max: 5000000, count: 120, percentage: 1.20 },
];

// Cost breakdown
export const DEMO_COST_BREAKDOWN = [
  { category: "Regulatory Fines", percentage: 50, amount: 423647 },
  { category: "Reputational Damage", percentage: 30, amount: 254188 },
  { category: "Operational Costs", percentage: 20, amount: 169458 },
];

// Jurisdiction exposure
export const DEMO_JURISDICTION_EXPOSURE = [
  { jurisdiction: "EU", framework: "EU AI Act", maxPenalty: "€35M or 7% revenue", currentExposure: 1245000 },
  { jurisdiction: "US Federal", framework: "FTC Act", maxPenalty: "$50,000/violation", currentExposure: 456000 },
  { jurisdiction: "Colorado", framework: "SB24-205", maxPenalty: "$20,000/violation", currentExposure: 234000 },
  { jurisdiction: "NYC", framework: "LL144", maxPenalty: "$1,500/violation", currentExposure: 89000 },
];

export const formatCurrency = (value: number, currency = "USD"): string => {
  const formatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
  return formatter.format(value);
};