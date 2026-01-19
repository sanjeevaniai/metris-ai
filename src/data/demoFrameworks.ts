// Regulatory Frameworks - Hardcoded for Enterprise Demo
// NO BINARY PASS/FAIL - Use checkpointsAddressed/checkpointsWithGaps

export interface Framework {
  id: string;
  name: string;
  shortName: string;
  coverage: number;
  checkpointsTotal: number;
  checkpointsAddressed: number;
  deadline?: string;
  daysRemaining?: number;
  critical?: boolean;
}

export const DEMO_FRAMEWORKS: Framework[] = [
  { id: "eu_ai_act", name: "EU AI Act", shortName: "EU AI Act", coverage: 0.78, checkpointsTotal: 200, checkpointsAddressed: 156, deadline: "2026-08-02", daysRemaining: 199 },
  { id: "nist_ai_rmf", name: "NIST AI RMF", shortName: "NIST RMF", coverage: 0.84, checkpointsTotal: 200, checkpointsAddressed: 168 },
  { id: "iso_42001", name: "ISO/IEC 42001", shortName: "ISO 42001", coverage: 0.76, checkpointsTotal: 137, checkpointsAddressed: 104 },
  { id: "colorado_sb205", name: "Colorado SB24-205", shortName: "CO SB 21-169", coverage: 0.62, checkpointsTotal: 51, checkpointsAddressed: 32, deadline: "2026-06-01", daysRemaining: 137, critical: true },
  { id: "ca_ab2013", name: "California AB 2013", shortName: "CA AB 2013", coverage: 0.71, checkpointsTotal: 38, checkpointsAddressed: 27 },
  { id: "nyc_ll144", name: "NYC Local Law 144", shortName: "NYC LL144", coverage: 0.68, checkpointsTotal: 25, checkpointsAddressed: 17 },
  { id: "il_hb3773", name: "Illinois HB 3773", shortName: "IL HB 3773", coverage: 0.59, checkpointsTotal: 32, checkpointsAddressed: 19 },
  { id: "gdpr_ai", name: "GDPR AI Provisions", shortName: "GDPR AI", coverage: 0.82, checkpointsTotal: 45, checkpointsAddressed: 37 },
  { id: "soc2_ai", name: "SOC 2 AI Controls", shortName: "SOC 2 AI", coverage: 0.74, checkpointsTotal: 60, checkpointsAddressed: 44 },
];

// EU AI Act Articles
export const EU_AI_ACT_ARTICLES = [
  { id: "art9", name: "Risk Management", coverage: 0.78, checks: 25, addressed: 19 },
  { id: "art10", name: "Data Governance", coverage: 0.62, checks: 32, addressed: 20 },
  { id: "art11", name: "Technical Documentation", coverage: 0.31, checks: 28, addressed: 9, critical: true },
  { id: "art13", name: "Transparency", coverage: 0.89, checks: 18, addressed: 16 },
  { id: "art14", name: "Human Oversight", coverage: 0.72, checks: 22, addressed: 16 },
  { id: "art15", name: "Accuracy & Robustness", coverage: 0.68, checks: 35, addressed: 24 },
];

// NIST AI RMF Functions
export const NIST_FUNCTIONS = [
  { function: "GOVERN", coverage: 0.85 },
  { function: "MAP", coverage: 0.79 },
  { function: "MEASURE", coverage: 0.81 },
  { function: "MANAGE", coverage: 0.83 },
];

// Get frameworks sorted by coverage
export const getFrameworksByCoverage = (): Framework[] => {
  return [...DEMO_FRAMEWORKS].sort((a, b) => b.coverage - a.coverage);
};

// Get critical frameworks (with deadlines)
export const getCriticalFrameworks = (): Framework[] => {
  return DEMO_FRAMEWORKS.filter(f => f.deadline || f.critical);
};
