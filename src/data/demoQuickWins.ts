// Quick Wins (ROI Ranked) - Hardcoded for Enterprise Demo
export interface QuickWin {
  rank: number;
  checkpointId: string;
  name: string;
  category: string;
  agent: string;
  pointGain: number;
  exposureReduction: number;
  estimatedCost: number;
  roi: number;
  timeEstimate: string;
  difficulty: "Low" | "Medium" | "High";
  frameworks: string[];
  status: "not_started" | "in_progress" | "completed";
}

export const DEMO_QUICK_WINS: QuickWin[] = [
  { rank: 1, checkpointId: "CP-0024", name: "Document Bias Testing", category: "Fairness", agent: "Agent_Equinox", pointGain: 35, exposureReduction: 420000, estimatedCost: 2500, roi: 168, timeEstimate: "5 hours", difficulty: "Low", frameworks: ["EU AI Act", "NIST AI RMF"], status: "not_started" },
  { rank: 2, checkpointId: "CP-0025", name: "Conduct Bias Testing", category: "Fairness", agent: "Agent_Equinox", pointGain: 28, exposureReduction: 336000, estimatedCost: 8000, roi: 42, timeEstimate: "12 hours", difficulty: "Medium", frameworks: ["EU AI Act", "NIST AI RMF"], status: "not_started" },
  { rank: 3, checkpointId: "CP-0056", name: "Implement Adversarial Testing", category: "Robustness", agent: "Agent_Ironveil", pointGain: 22, exposureReduction: 280000, estimatedCost: 8000, roi: 35, timeEstimate: "16 hours", difficulty: "Medium", frameworks: ["NIST AI RMF"], status: "not_started" },
  { rank: 4, checkpointId: "CP-0029", name: "Model Card Documentation", category: "Transparency", agent: "Agent_Blindspot", pointGain: 18, exposureReduction: 210000, estimatedCost: 4000, roi: 52.5, timeEstimate: "8 hours", difficulty: "Low", frameworks: ["EU AI Act", "ISO 42001"], status: "not_started" },
  { rank: 5, checkpointId: "CP-0034", name: "Data Lineage Mapping", category: "Data Integrity", agent: "Agent_Flowgrid", pointGain: 15, exposureReduction: 185000, estimatedCost: 6000, roi: 30.8, timeEstimate: "12 hours", difficulty: "Medium", frameworks: ["EU AI Act", "GDPR"], status: "not_started" },
  { rank: 6, checkpointId: "CP-0067", name: "Explainability Report", category: "Explainability", agent: "Agent_Lantern", pointGain: 12, exposureReduction: 145000, estimatedCost: 5000, roi: 29, timeEstimate: "10 hours", difficulty: "Medium", frameworks: ["EU AI Act"], status: "not_started" },
  { rank: 7, checkpointId: "CP-0089", name: "Security Hardening", category: "Security", agent: "Agent_Redward", pointGain: 10, exposureReduction: 125000, estimatedCost: 12000, roi: 10.4, timeEstimate: "20 hours", difficulty: "High", frameworks: ["NIST AI RMF", "ISO 42001"], status: "not_started" },
  { rank: 8, checkpointId: "CP-0102", name: "Human Oversight Protocol", category: "Governance", agent: "Agent_Blindspot", pointGain: 8, exposureReduction: 98000, estimatedCost: 3500, roi: 28, timeEstimate: "6 hours", difficulty: "Low", frameworks: ["EU AI Act"], status: "not_started" },
];

export const calculateTotalQuickWinROI = (wins: QuickWin[]): { totalPointGain: number; totalExposureReduction: number; totalCost: number; overallROI: number } => {
  const totalPointGain = wins.reduce((sum, w) => sum + w.pointGain, 0);
  const totalExposureReduction = wins.reduce((sum, w) => sum + w.exposureReduction, 0);
  const totalCost = wins.reduce((sum, w) => sum + w.estimatedCost, 0);
  const overallROI = totalExposureReduction / totalCost;
  return { totalPointGain, totalExposureReduction, totalCost, overallROI };
};
