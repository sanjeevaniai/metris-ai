// 12 Governance Pillars - Hardcoded for Enterprise Demo
// NO BINARY PASS/FAIL - Use addressed/gaps terminology

export interface Pillar {
  id: string;
  name: string;
  score: number;
  weight: number;
  checks: number;
  addressed: number;
  gaps: number;
  exposure: number;        // Financial exposure in dollars
  remediationCost: number; // Cost to fix in dollars
  roi: number;             // Return on investment multiplier
  color: string;
}

export const DEMO_PILLARS: Pillar[] = [
  { id: "transparency", name: "Transparency", score: 812, weight: 0.12, checks: 67, addressed: 54, gaps: 13, exposure: 890000, remediationCost: 165000, roi: 5.4, color: "hsl(var(--status-good))" },
  { id: "reliability", name: "Reliability & Performance", score: 724, weight: 0.10, checks: 112, addressed: 81, gaps: 31, exposure: 1450000, remediationCost: 238000, roi: 6.1, color: "hsl(var(--tier-moderate))" },
  { id: "security", name: "Security", score: 623, weight: 0.15, checks: 149, addressed: 93, gaps: 56, exposure: 2800000, remediationCost: 424000, roi: 6.6, color: "hsl(var(--status-warning))" },
  { id: "privacy", name: "Privacy", score: 756, weight: 0.12, checks: 51, addressed: 39, gaps: 12, exposure: 1200000, remediationCost: 222000, roi: 5.4, color: "hsl(var(--status-good))" },
  { id: "fairness", name: "Fairness & Bias", score: 534, weight: 0.12, checks: 15, addressed: 8, gaps: 7, exposure: 3200000, remediationCost: 320000, roi: 10.0, color: "hsl(var(--status-critical))" },
  { id: "ethics", name: "Ethics & Values", score: 891, weight: 0.08, checks: 42, addressed: 37, gaps: 5, exposure: 450000, remediationCost: 112500, roi: 4.0, color: "hsl(var(--status-excellent))" },
  { id: "accountability", name: "Accountability", score: 734, weight: 0.08, checks: 31, addressed: 26, gaps: 5, exposure: 1100000, remediationCost: 203700, roi: 5.4, color: "hsl(var(--tier-moderate))" },
  { id: "explainability", name: "Explainability", score: 778, weight: 0.07, checks: 42, addressed: 28, gaps: 14, exposure: 780000, remediationCost: 147170, roi: 5.3, color: "hsl(var(--status-good))" },
  { id: "human_oversight", name: "Human Oversight", score: 765, weight: 0.06, checks: 38, addressed: 29, gaps: 9, exposure: 920000, remediationCost: 173585, roi: 5.3, color: "hsl(var(--status-good))" },
  { id: "supply_chain", name: "Supply Chain", score: 698, weight: 0.04, checks: 25, addressed: 18, gaps: 7, exposure: 1350000, remediationCost: 221311, roi: 6.1, color: "hsl(var(--tier-moderate))" },
  { id: "incident_response", name: "Incident Response", score: 684, weight: 0.04, checks: 45, addressed: 31, gaps: 14, exposure: 2100000, remediationCost: 259259, roi: 8.1, color: "hsl(var(--tier-moderate))" },
  { id: "digital_maturity", name: "Digital Maturity", score: 702, weight: 0.02, checks: 25, addressed: 18, gaps: 7, exposure: 890000, remediationCost: 234211, roi: 3.8, color: "hsl(var(--tier-moderate))" },
];

export const getPillarColor = (score: number): string => {
  if (score >= 900) return "hsl(var(--status-excellent))";
  if (score >= 750) return "hsl(var(--status-good))";
  if (score >= 600) return "hsl(var(--tier-moderate))";
  if (score >= 400) return "hsl(var(--status-warning))";
  return "hsl(var(--status-critical))";
};

// Calculate total exposure
export const getTotalExposure = (): number => {
  return DEMO_PILLARS.reduce((sum, p) => sum + p.exposure, 0);
};

// Get pillars sorted by ROI
export const getPillarsByROI = (): Pillar[] => {
  return [...DEMO_PILLARS].sort((a, b) => b.roi - a.roi);
};
