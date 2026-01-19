// Forecasting Data (7-Model Ensemble) - Hardcoded for Enterprise Demo
export const ENSEMBLE_MODELS = [
  { name: "ARIMA", weight: 0.15, mape: 4.2 },
  { name: "Prophet", weight: 0.15, mape: 3.8 },
  { name: "Exponential Smoothing", weight: 0.10, mape: 5.1 },
  { name: "Temporal Fusion Transformer", weight: 0.20, mape: 2.9 },
  { name: "N-BEATS", weight: 0.15, mape: 3.2 },
  { name: "xLSTM", weight: 0.15, mape: 3.5 },
  { name: "TimeXer", weight: 0.10, mape: 4.0 },
];

export const ENSEMBLE_METRICS = {
  mae: 28,
  directionalAccuracy: 0.78,
  validationPeriod: 90,
};

export const THRESHOLD_ALERTS = [
  { type: "warning", threshold: 750, thresholdName: "Audit Risk", projectedBreachDate: "2026-03-03", daysUntilBreach: 47, confidence: 0.73, message: "Score projected to drop below 750 in 47 days" },
  { type: "critical", threshold: 600, thresholdName: "Critical", projectedBreachDate: null, daysUntilBreach: null, confidence: 0.12, message: "Low probability of reaching critical threshold" },
];

export const CHANGE_DRIVERS = [
  { factor: "Model drift in DiagnosticAI", impact: -8, unit: "pts/month" },
  { factor: "Expiring certifications", impact: -15, unit: "pts in 60 days" },
  { factor: "Technical debt accumulation", impact: -3, unit: "pts/month" },
];

// Generate forecast data points
export function generateForecastPath(startScore: number, dailyDelta: number, days: number): { day: number; score: number }[] {
  const path = [];
  for (let i = 0; i <= days; i++) {
    const score = Math.max(0, Math.min(1000, startScore + (dailyDelta * i)));
    path.push({ day: i, score: Math.round(score) });
  }
  return path;
}

export const DEMO_FORECAST = {
  currentPath: generateForecastPath(743, -0.5, 90),
  improvingPath: generateForecastPath(743, 1.2, 90),
  decliningPath: generateForecastPath(743, -1.5, 90),
  confidenceBandUpper: 45,
  confidenceBandLower: 45,
};
