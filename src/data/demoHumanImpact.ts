// Human Impact & Traceability Data - METRIS v5
// "Governance in numbers. Risk in dollars. Traceability to the Human."

import { DEMO_SCORE } from './demoScore';
import { DEMO_FINANCIAL_RISK } from './demoFinancialRisk';

// ============================================
// INDUSTRY BENCHMARKS FOR DECISION VOLUME
// ============================================

export const INDUSTRY_BENCHMARKS = {
  healthcare: {
    name: "Healthcare",
    useCases: {
      diagnostic_ai: { daily: 2500, label: "Diagnostic/Screening AI" },
      claims_processing: { daily: 15000, label: "Claims Adjudication" },
      patient_risk: { daily: 800, label: "Patient Risk Stratification" },
      treatment_recommendation: { daily: 1200, label: "Treatment Recommendations" },
    }
  },
  financial_services: {
    name: "Financial Services",
    useCases: {
      credit_scoring: { daily: 50000, label: "Credit Scoring" },
      fraud_detection: { daily: 500000, label: "Fraud Detection" },
      loan_approval: { daily: 5000, label: "Loan/Mortgage Approval" },
      trading: { daily: 1000000, label: "Algorithmic Trading" },
    }
  },
  insurance: {
    name: "Insurance",
    useCases: {
      underwriting: { daily: 3000, label: "Underwriting" },
      claims: { daily: 8000, label: "Claims Processing" },
      pricing: { daily: 12000, label: "Premium Pricing" },
      fraud: { daily: 25000, label: "Fraud Detection" },
    }
  },
  hr_recruiting: {
    name: "HR & Recruiting",
    useCases: {
      resume_screening: { daily: 1000, label: "Resume Screening" },
      candidate_ranking: { daily: 500, label: "Candidate Ranking" },
      performance: { daily: 200, label: "Performance Evaluation" },
    }
  },
  retail_ecommerce: {
    name: "Retail & E-Commerce",
    useCases: {
      recommendation: { daily: 1000000, label: "Product Recommendations" },
      pricing: { daily: 100000, label: "Dynamic Pricing" },
      fraud: { daily: 200000, label: "Transaction Fraud" },
      inventory: { daily: 50000, label: "Inventory Optimization" },
    }
  },
};

// ============================================
// DEMO TRIPLE METRICS (NUMBERS, DOLLARS, HUMANS)
// ============================================

export const DEMO_TRIPLE_METRICS = {
  score: {
    value: DEMO_SCORE.overall,
    change: DEMO_SCORE.trend.change,
    changePeriod: DEMO_SCORE.trend.period,
    confidence: {
      low: DEMO_SCORE.confidenceInterval.low,
      high: DEMO_SCORE.confidenceInterval.high,
    }
  },
  risk: {
    value: DEMO_FINANCIAL_RISK.var95,
    change: -400000,
    changePeriod: "30d",
    var95: DEMO_FINANCIAL_RISK.var95,
    var99: DEMO_FINANCIAL_RISK.var99,
  },
  humans: {
    affected: 3247,
    change: 847,
    changePeriod: "30d",
    decisionVolume: {
      total: 2400000,
      quarterly: 847000,
      monthly: 285000,
      daily: 23400
    }
  }
};

// ============================================
// DECISION VOLUME DATA
// ============================================

export interface DecisionVolume {
  id: string;
  systemId: string;
  inputMethod: 'manual' | 'estimated' | 'integrated';
  manualInput?: {
    frequency: 'daily' | 'monthly' | 'yearly';
    value: number;
  };
  estimate?: {
    industry: string;
    useCase: string;
    estimatedDaily: number;
  };
  integrated?: {
    source: 'datadog' | 'mlflow' | 'custom';
    lastSync: string;
  };
  daily: number;
  monthly: number;
  quarterly: number;
  yearly: number;
  createdAt: string;
  updatedAt: string;
}

export const DEMO_DECISION_VOLUME: DecisionVolume = {
  id: "dv-001",
  systemId: "sys-diagnosticai",
  inputMethod: 'manual',
  manualInput: {
    frequency: 'daily',
    value: 23400,
  },
  daily: 23400,
  monthly: 285000,
  quarterly: 847000,
  yearly: 2400000,
  createdAt: "2025-10-01T00:00:00Z",
  updatedAt: "2026-01-15T14:32:00Z",
};

// ============================================
// AFFECTED POPULATIONS BY PILLAR
// ============================================

export interface AffectedPopulation {
  checkpointId: string;
  pillar: string;
  pillarIcon: string;
  decisionVolume: number;
  impactRate: number;
  confidence: number;
  estimatedAffected: number;
  calculationBasis: string;
  severity: 'critical' | 'high' | 'medium' | 'good';
  score: number;
  projections: {
    days30: number;
    days60: number;
    days90: number;
  };
  modelVersion?: string;
  deployedDate?: string;
}

export const DEMO_AFFECTED_POPULATIONS: AffectedPopulation[] = [
  {
    checkpointId: "CP-024",
    pillar: "Fairness",
    pillarIcon: "⚖️",
    decisionVolume: 847000,
    impactRate: 0.23,
    confidence: 0.85,
    estimatedAffected: 3247,
    calculationBasis: "23% approval gap × 847K decisions × 85% confidence",
    severity: "critical",
    score: 534,
    projections: {
      days30: 7447,
      days60: 11647,
      days90: 15647,
    },
    modelVersion: "DiagnosticAI Pro v2.3",
    deployedDate: "2025-03-15",
  },
  {
    checkpointId: "CP-089",
    pillar: "Explainability",
    pillarIcon: "📖",
    decisionVolume: 847000,
    impactRate: 0.40,
    confidence: 0.92,
    estimatedAffected: 311696,
    calculationBasis: "40% decisions lack explanation × 847K × 92% confidence",
    severity: "high",
    score: 678,
    projections: {
      days30: 623392,
      days60: 935088,
      days90: 1246784,
    },
    modelVersion: "DiagnosticAI Pro v2.3",
    deployedDate: "2025-03-15",
  },
  {
    checkpointId: "CP-156",
    pillar: "Accountability",
    pillarIcon: "👥",
    decisionVolume: 847000,
    impactRate: 0.15,
    confidence: 0.78,
    estimatedAffected: 99099,
    calculationBasis: "15% lack oversight documentation × 847K × 78% confidence",
    severity: "medium",
    score: 734,
    projections: {
      days30: 198198,
      days60: 297297,
      days90: 396396,
    },
  },
  {
    checkpointId: "CP-201",
    pillar: "Privacy",
    pillarIcon: "🔒",
    decisionVolume: 847000,
    impactRate: 0.0,
    confidence: 0.95,
    estimatedAffected: 0,
    calculationBasis: "All PII properly handled",
    severity: "good",
    score: 812,
    projections: {
      days30: 0,
      days60: 0,
      days90: 0,
    },
  },
  {
    checkpointId: "CP-312",
    pillar: "Security",
    pillarIcon: "🛡️",
    decisionVolume: 847000,
    impactRate: 0.02,
    confidence: 0.88,
    estimatedAffected: 14907,
    calculationBasis: "2% vulnerability exposure × 847K × 88% confidence",
    severity: "medium",
    score: 756,
    projections: {
      days30: 29814,
      days60: 44721,
      days90: 59628,
    },
  },
];

// ============================================
// TRACEBACK CHAIN DATA
// ============================================

export interface TracebackChain {
  checkpointId: string;
  checkpointName: string;
  pillar: string;
  score: number;
  status: 'failed' | 'warning' | 'passed';
  modelVersion: string;
  deployedDate: string;
  trainingCohort: string;
  decisionsThisQuarter: number;
  disparity: number;
  confidence: number;
  humansAffected: number;
  projections: {
    days30: { affected: number; exposure: number };
    days60: { affected: number; exposure: number };
    days90: { affected: number; exposure: number };
  };
  remediation: {
    recommendedFix: string;
    timeToFix: number;
    costToFix: number;
    humansProtected: number;
    riskAvoided: number;
    roi: number;
  };
}

export const DEMO_TRACEBACK: TracebackChain = {
  checkpointId: "CP-024",
  checkpointName: "Demographic Parity Documentation",
  pillar: "Fairness",
  score: 534,
  status: 'failed',
  modelVersion: "DiagnosticAI Pro v2.3",
  deployedDate: "2025-03-15",
  trainingCohort: "Jan 2024",
  decisionsThisQuarter: 847000,
  disparity: 0.23,
  confidence: 0.85,
  humansAffected: 3247,
  projections: {
    days30: { affected: 7447, exposure: 1200000 },
    days60: { affected: 11647, exposure: 2400000 },
    days90: { affected: 15647, exposure: 3200000 },
  },
  remediation: {
    recommendedFix: "Update fairness documentation + retrain model with balanced cohort",
    timeToFix: 14,
    costToFix: 180000,
    humansProtected: 12400,
    riskAvoided: 2800000,
    roi: 15.5,
  },
};

// ============================================
// CONTINUOUS MONITORING EVENTS
// ============================================

export interface ContinuousMonitoringEvent {
  id: string;
  systemId: string;
  timestamp: string;
  type: 
    | 'scheduled_scan'
    | 'commit_detected'
    | 'model_update'
    | 'drift_detected'
    | 'threshold_alert'
    | 'remediation_completed';
  severity: 'info' | 'warning' | 'critical';
  details: {
    message: string;
    scoreImpact?: number;
    humanImpact?: number;
    source?: string;
    link?: string;
  };
}

export const DEMO_CONTINUOUS_EVENTS: ContinuousMonitoringEvent[] = [
  {
    id: "evt-001",
    systemId: "sys-diagnosticai",
    timestamp: "2026-01-18T14:30:00Z",
    type: 'scheduled_scan',
    severity: 'info',
    details: {
      message: "Scheduled scan completed — no changes detected",
    },
  },
  {
    id: "evt-002",
    systemId: "sys-diagnosticai",
    timestamp: "2026-01-18T14:15:00Z",
    type: 'commit_detected',
    severity: 'warning',
    details: {
      message: 'New commit detected: "Update model weights"',
      scoreImpact: -3,
      source: "GitHub",
    },
  },
  {
    id: "evt-003",
    systemId: "sys-diagnosticai",
    timestamp: "2026-01-18T13:32:00Z",
    type: 'remediation_completed',
    severity: 'info',
    details: {
      message: "Remediation completed: CP-018 (Documentation gap)",
      scoreImpact: 8,
      humanImpact: 420,
    },
  },
  {
    id: "evt-004",
    systemId: "sys-diagnosticai",
    timestamp: "2026-01-18T11:30:00Z",
    type: 'scheduled_scan',
    severity: 'info',
    details: {
      message: "Scheduled scan completed — 2 changes detected",
    },
  },
  {
    id: "evt-005",
    systemId: "sys-diagnosticai",
    timestamp: "2026-01-18T08:30:00Z",
    type: 'threshold_alert',
    severity: 'warning',
    details: {
      message: "Threshold alert: Fairness score dropped below 600",
      humanImpact: 847,
    },
  },
];

// ============================================
// MONITORING LOOP STATS
// ============================================

export const DEMO_LOOP_STATS = {
  last30Days: {
    commitsScanned: 847,
    scoreChanges: 23,
    humansTracked: 3247,
    fixesCompleted: 12,
  },
  status: {
    active: true,
    lastCheck: "2 minutes ago",
    nextCheck: "in 13 minutes",
  },
  sources: [
    { name: "GitHub Repository", connected: true, icon: "📂" },
    { name: "Model Registry (MLflow)", connected: true, icon: "🤖" },
    { name: "Decision Logs (Datadog)", connected: true, icon: "📊" },
    { name: "Documentation (Confluence)", connected: false, icon: "📝" },
  ],
};

// ============================================
// 90-DAY PROJECTIONS
// ============================================

export const DEMO_90_DAY_PROJECTIONS = {
  current: {
    affected: 3247,
    exposure: 0,
  },
  days30: {
    affected: 7447,
    additionalAffected: 4200,
    exposure: 1200000,
  },
  days60: {
    affected: 11647,
    additionalAffected: 8400,
    exposure: 2400000,
  },
  days90: {
    affected: 15647,
    additionalAffected: 12400,
    exposure: 3200000,
  },
};

// ============================================
// HELPER FUNCTIONS
// ============================================

export function formatHumanCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(0)}K`;
  }
  return count.toLocaleString();
}

export function formatDecisionVolume(volume: number): string {
  if (volume >= 1000000) {
    return `${(volume / 1000000).toFixed(1)}M`;
  }
  if (volume >= 1000) {
    return `${(volume / 1000).toFixed(0)}K`;
  }
  return volume.toLocaleString();
}

export function getSeverityColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'text-status-critical';
    case 'high': return 'text-status-warning';
    case 'medium': return 'text-tier-moderate';
    case 'good': return 'text-status-good';
    default: return 'text-muted-foreground';
  }
}

export function getSeverityBgColor(severity: string): string {
  switch (severity) {
    case 'critical': return 'bg-status-critical/10 border-status-critical/30';
    case 'high': return 'bg-status-warning/10 border-status-warning/30';
    case 'medium': return 'bg-tier-moderate/10 border-tier-moderate/30';
    case 'good': return 'bg-status-good/10 border-status-good/30';
    default: return 'bg-muted/10 border-muted/30';
  }
}

export function calculateHumanImpact(
  decisionVolume: number,
  impactRate: number,
  confidence: number
): number {
  return Math.round(decisionVolume * impactRate * confidence);
}
