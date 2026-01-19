// METRIS Score Tiers - Quantitative Governance System
// NO BINARY PASS/FAIL - Only scores, tiers, and exposure

export interface ScoreTier {
  min: number;
  max: number;
  name: string;
  label: string;
  color: string;
  cssVar: string;
  bgClass: string;
  textClass: string;
  description: string;
}

export const SCORE_TIERS: Record<string, ScoreTier> = {
  EXEMPLARY: {
    min: 900,
    max: 1000,
    name: 'EXEMPLARY',
    label: 'Exemplary',
    color: '#8B5CF6',
    cssVar: 'hsl(var(--chart-purple))',
    bgClass: 'bg-purple-500/20',
    textClass: 'text-purple-400',
    description: 'Industry-leading governance',
  },
  STRONG: {
    min: 750,
    max: 899,
    name: 'STRONG',
    label: 'Strong',
    color: '#10B981',
    cssVar: 'hsl(var(--score-good))',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
    description: 'Audit-ready, low exposure',
  },
  MODERATE: {
    min: 600,
    max: 749,
    name: 'MODERATE',
    label: 'Moderate',
    color: '#F59E0B',
    cssVar: 'hsl(var(--score-fair))',
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
    description: 'Notable gaps, medium exposure',
  },
  WEAK: {
    min: 400,
    max: 599,
    name: 'WEAK',
    label: 'Weak',
    color: '#F97316',
    cssVar: 'hsl(var(--score-poor))',
    bgClass: 'bg-orange-500/20',
    textClass: 'text-orange-400',
    description: 'Significant gaps, high exposure',
  },
  CRITICAL: {
    min: 200,
    max: 399,
    name: 'CRITICAL',
    label: 'Critical',
    color: '#EF4444',
    cssVar: 'hsl(var(--risk-critical))',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
    description: 'Major gaps, severe exposure',
  },
  MINIMAL: {
    min: 0,
    max: 199,
    name: 'MINIMAL',
    label: 'Minimal',
    color: '#6B7280',
    cssVar: 'hsl(var(--muted-foreground))',
    bgClass: 'bg-gray-500/20',
    textClass: 'text-gray-400',
    description: 'Governance not established',
  },
};

// Ordered array for scale display (low to high)
export const SCORE_TIERS_ORDERED = [
  SCORE_TIERS.MINIMAL,
  SCORE_TIERS.CRITICAL,
  SCORE_TIERS.WEAK,
  SCORE_TIERS.MODERATE,
  SCORE_TIERS.STRONG,
  SCORE_TIERS.EXEMPLARY,
];

// Get tier from score
export function getTier(score: number): ScoreTier {
  if (score >= 900) return SCORE_TIERS.EXEMPLARY;
  if (score >= 750) return SCORE_TIERS.STRONG;
  if (score >= 600) return SCORE_TIERS.MODERATE;
  if (score >= 400) return SCORE_TIERS.WEAK;
  if (score >= 200) return SCORE_TIERS.CRITICAL;
  return SCORE_TIERS.MINIMAL;
}

// Get tier name (for display)
export function getTierName(score: number): string {
  return getTier(score).label;
}

// Get tier color class
export function getTierColorClass(score: number): string {
  return getTier(score).textClass;
}

// Get tier background class
export function getTierBgClass(score: number): string {
  return getTier(score).bgClass;
}

// Format score with confidence interval
export function formatScore(score: number, confidence?: number): string {
  if (confidence) {
    return `${score} (±${confidence})`;
  }
  return score.toString();
}

// Format score as fraction (for checkpoints)
export function formatCheckpointScore(score: number, max: number = 100): string {
  return `${score}/${max}`;
}

// Get exposure color based on amount
export function getExposureColor(amount: number): string {
  if (amount >= 1000000) return 'text-red-400';
  if (amount >= 500000) return 'text-orange-400';
  if (amount >= 100000) return 'text-amber-400';
  return 'text-muted-foreground';
}

// Format currency for exposure
export function formatExposure(amount: number): string {
  if (amount >= 1000000) {
    return `$${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `$${(amount / 1000).toFixed(0)}K`;
  }
  return `$${amount}`;
}

// Checkpoint status (replaces pass/fail)
export type CheckpointStatus = 'addressed' | 'gap' | 'at-risk' | 'not-evaluated';

export interface CheckpointStatusInfo {
  label: string;
  icon: string;
  color: string;
  bgClass: string;
  textClass: string;
}

export const CHECKPOINT_STATUS: Record<CheckpointStatus, CheckpointStatusInfo> = {
  addressed: {
    label: 'Addressed',
    icon: '●',
    color: '#10B981',
    bgClass: 'bg-emerald-500/20',
    textClass: 'text-emerald-400',
  },
  gap: {
    label: 'Gap',
    icon: '◐',
    color: '#EF4444',
    bgClass: 'bg-red-500/20',
    textClass: 'text-red-400',
  },
  'at-risk': {
    label: 'At Risk',
    icon: '◑',
    color: '#F59E0B',
    bgClass: 'bg-amber-500/20',
    textClass: 'text-amber-400',
  },
  'not-evaluated': {
    label: 'Not Evaluated',
    icon: '○',
    color: '#6B7280',
    bgClass: 'bg-gray-500/20',
    textClass: 'text-gray-400',
  },
};

// Get checkpoint status from score
export function getCheckpointStatus(score: number): CheckpointStatus {
  if (score >= 75) return 'addressed';
  if (score >= 50) return 'at-risk';
  if (score > 0) return 'gap';
  return 'not-evaluated';
}

// Framework status (replaces pass/gaps)
export type FrameworkStatus = 'strong' | 'moderate' | 'gaps' | 'critical';

export function getFrameworkStatus(score: number): FrameworkStatus {
  if (score >= 750) return 'strong';
  if (score >= 600) return 'moderate';
  if (score >= 400) return 'gaps';
  return 'critical';
}

export function getFrameworkStatusLabel(score: number): string {
  const status = getFrameworkStatus(score);
  switch (status) {
    case 'strong': return '🟢 Strong';
    case 'moderate': return '🟡 Moderate';
    case 'gaps': return '🟠 Gaps';
    case 'critical': return '🔴 Critical';
  }
}

// Verification result (replaces passed/failed)
export type VerificationResult = 'verified' | 'rework-needed' | 'pending';

export const VERIFICATION_RESULTS: Record<VerificationResult, { label: string; icon: string; color: string }> = {
  verified: { label: 'Verified', icon: '✓', color: 'text-emerald-400' },
  'rework-needed': { label: 'Rework Needed', icon: '↻', color: 'text-amber-400' },
  pending: { label: 'Pending', icon: '○', color: 'text-muted-foreground' },
};
