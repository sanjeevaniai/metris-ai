// Demo METRIS Score - Hardcoded for Enterprise Demo
import { getTier, getTierName, type ScoreTier } from './scoreTiers';

export const DEMO_SCORE = {
  overall: 743,
  confidenceInterval: {
    low: 695,
    high: 791,
  },
  confidenceLevel: 0.95,
  tier: "Moderate",
  trend: {
    direction: "up" as const,
    change: 23,
    period: "30d",
  },
  lastUpdated: "2026-01-15T14:32:00Z",
  assessmentId: "A-2847",
  bayesian: {
    alpha: 615.8,
    beta: 237.2,
    priorAlpha: 2,
    priorBeta: 2,
  },
  checkpointsEvaluated: 847,
  checkpointsAddressed: 612,
  checkpointsWithGaps: 235,
  conformanceRate: 0.743,
};

// Re-export from scoreTiers for backward compatibility
export { getTier, getTierName, type ScoreTier };

// Score tiers with tier names and colors
export const SCORE_TIERS = [
  { min: 0, max: 199, name: "Minimal", color: "text-tier-minimal", bgColor: "bg-tier-minimal" },
  { min: 200, max: 399, name: "Critical", color: "text-status-critical", bgColor: "bg-status-critical" },
  { min: 400, max: 599, name: "Weak", color: "text-status-warning", bgColor: "bg-status-warning" },
  { min: 600, max: 749, name: "Moderate", color: "text-tier-moderate", bgColor: "bg-tier-moderate" },
  { min: 750, max: 899, name: "Strong", color: "text-status-good", bgColor: "bg-status-good" },
  { min: 900, max: 1000, name: "Exemplary", color: "text-status-excellent", bgColor: "bg-status-excellent" },
];

export function getScoreTier(score: number) {
  return SCORE_TIERS.find(t => score >= t.min && score <= t.max) || SCORE_TIERS[0];
}

// Format score with confidence interval
export function formatScoreWithCI(score: number, low: number, high: number): string {
  return `${score} (${low}–${high})`;
}
