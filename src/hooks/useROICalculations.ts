import { useMemo } from "react";

export interface ROIInputs {
  teamSize: number;
  avgSalary: number;
  projectBudget: number;
  wastePercent: number;
  errorCost: number;
  decisionsPerYear: number;
}

export interface ROICalculations {
  laborLeak: number;
  opportunityDrain: number;
  strategicRisk: number;
  totalCopq: number;
  metrisInvestment: number;
  postMetrisCost: number;
  lossAvoided: number;
  roi: number;
  paybackMonths: number;
}

export const DEFAULT_ROI_INPUTS: ROIInputs = {
  teamSize: 25,
  avgSalary: 95000,
  projectBudget: 500000,
  wastePercent: 50,
  errorCost: 50000,
  decisionsPerYear: 12,
};

export function calculateROI(inputs: ROIInputs): ROICalculations {
  const { teamSize, avgSalary, projectBudget, wastePercent, errorCost, decisionsPerYear } = inputs;

  // 1. THE LABOR LEAK (Rework)
  const laborLeak = teamSize * avgSalary * (wastePercent / 100);

  // 2. THE OPPORTUNITY DRAIN (Failed Projects) - Industry failure rate = 80%
  const opportunityDrain = projectBudget * 0.80;

  // 3. THE STRATEGIC RISK (Bad Decisions) - 20% affected by bad data
  const strategicRisk = decisionsPerYear * errorCost * 0.20;

  // TOTAL COST OF POOR QUALITY
  const totalCopq = laborLeak + opportunityDrain + strategicRisk;

  // METRIS INVESTMENT (based on team size)
  const metrisInvestment = teamSize <= 10 ? 25000 :
                           teamSize <= 50 ? 75000 :
                           teamSize <= 200 ? 150000 : 300000;

  // POST-METRIS (62% risk reduction)
  const riskReduction = 0.62;
  const postMetrisCost = totalCopq * (1 - riskReduction);

  // NET BENEFIT
  const lossAvoided = totalCopq - postMetrisCost;

  // ROI
  const roi = metrisInvestment > 0 ? (totalCopq - metrisInvestment) / metrisInvestment : 0;

  // PAYBACK (months)
  const monthlySavings = lossAvoided / 12;
  const paybackMonths = monthlySavings > 0 ? metrisInvestment / monthlySavings : 0;

  return {
    laborLeak,
    opportunityDrain,
    strategicRisk,
    totalCopq,
    metrisInvestment,
    postMetrisCost,
    lossAvoided,
    roi,
    paybackMonths,
  };
}

export function useROICalculations(inputs: ROIInputs): ROICalculations {
  return useMemo(() => calculateROI(inputs), [
    inputs.teamSize,
    inputs.avgSalary,
    inputs.projectBudget,
    inputs.wastePercent,
    inputs.errorCost,
    inputs.decisionsPerYear,
  ]);
}

// Formatting utilities
export const formatCurrency = (value: number): string => {
  if (value >= 1_000_000) {
    return `$${(value / 1_000_000).toFixed(1)}M`;
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatFullCurrency = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

export const formatMultiplier = (value: number): string => {
  return `${value.toFixed(1)}x`;
};

export const formatMonths = (value: number): string => {
  if (value < 1) return "< 1 mo";
  return `${Math.ceil(value)} mo`;
};
