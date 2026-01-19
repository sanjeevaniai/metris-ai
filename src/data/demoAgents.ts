// 25 METRIS Agents - Hardcoded for Enterprise Demo
export interface Agent {
  id: number;
  name: string;
  displayName: string;
  tier: number;
  stage: number;
  checkpoints: number;
  function: string;
  status: "completed" | "running" | "pending";
}

export const DEMO_AGENTS: Agent[] = [
  { id: 1, name: "Agent_Collector", displayName: "Evidence Collector", tier: 1, stage: 1, checkpoints: 0, function: "GitHub scanning, document OCR, API integrations", status: "completed" },
  { id: 2, name: "Agent_Shadefinder", displayName: "Shadow AI Detector", tier: 1, stage: 1, checkpoints: 20, function: "Discovers undocumented AI systems", status: "completed" },
  { id: 3, name: "Agent_DocProcessor", displayName: "Document Processor", tier: 1, stage: 1, checkpoints: 0, function: "OCR extraction, chunking, embeddings", status: "completed" },
  { id: 4, name: "Agent_Equinox", displayName: "Fairness Auditor", tier: 2, stage: 2, checkpoints: 15, function: "Demographic parity, disparate impact, AIF360", status: "completed" },
  { id: 5, name: "Agent_Ironveil", displayName: "Robustness Tester", tier: 2, stage: 2, checkpoints: 31, function: "Adversarial testing, perturbation analysis", status: "completed" },
  { id: 6, name: "Agent_Pixelbrew", displayName: "Data Quality Inspector", tier: 2, stage: 2, checkpoints: 20, function: "KL divergence, PSI, outlier analysis", status: "completed" },
  { id: 7, name: "Agent_Lantern", displayName: "Explainability Analyzer", tier: 2, stage: 3, checkpoints: 9, function: "SHAP, LIME, counterfactuals", status: "completed" },
  { id: 8, name: "Agent_Calibrator", displayName: "Uncertainty Quantifier", tier: 2, stage: 3, checkpoints: 0, function: "Bayesian estimation, calibration", status: "completed" },
  { id: 9, name: "Agent_Prompthex", displayName: "GenAI Risk Detector", tier: 2, stage: 3, checkpoints: 42, function: "Prompt injection, jailbreak, hallucination", status: "completed" },
  { id: 10, name: "Agent_Lexmap", displayName: "Regulatory Mapper", tier: 3, stage: 5, checkpoints: 1120, function: "EU AI Act, ISO 42001, NIST mapping", status: "completed" },
  { id: 11, name: "Agent_Matchmaker", displayName: "Evidence Matcher", tier: 3, stage: 5, checkpoints: 0, function: "Semantic similarity ≥0.7 matching", status: "completed" },
  { id: 12, name: "Agent_Borderlex", displayName: "Jurisdiction Filter", tier: 3, stage: 5, checkpoints: 51, function: "50+ jurisdictions, state-level compliance", status: "completed" },
  { id: 13, name: "Agent_Blindspot", displayName: "Documentation Auditor", tier: 3, stage: 5, checkpoints: 31, function: "Missing docs, template recommendations", status: "completed" },
  { id: 14, name: "Agent_VaRlock", displayName: "Risk Quantifier", tier: 4, stage: 6, checkpoints: 1, function: "Monte Carlo, VaR 95%/99%, CVaR", status: "completed" },
  { id: 15, name: "Agent_Prophet", displayName: "Forecaster", tier: 4, stage: 6, checkpoints: 0, function: "7-model ensemble, 90-day projections", status: "completed" },
  { id: 16, name: "Agent_Watchdog", displayName: "Drift Monitor", tier: 4, stage: 7, checkpoints: 15, function: "Model drift detection, PSI monitoring", status: "completed" },
  { id: 17, name: "Agent_Ecotrail", displayName: "Environmental Tracker", tier: 2, stage: 4, checkpoints: 18, function: "Carbon footprint, CodeCarbon integration", status: "completed" },
  { id: 18, name: "Agent_Redward", displayName: "Security Sentinel", tier: 2, stage: 4, checkpoints: 149, function: "MITRE ATLAS, adversarial defense, LLM security", status: "completed" },
  { id: 19, name: "Agent_Modeltap", displayName: "Performance Auditor", tier: 2, stage: 4, checkpoints: 12, function: "Latency, throughput, resource utilization", status: "completed" },
  { id: 20, name: "Agent_Chainlink", displayName: "Supply Chain Auditor", tier: 3, stage: 5, checkpoints: 18, function: "Third-party dependencies, SBOM analysis", status: "completed" },
  { id: 21, name: "Agent_Peerloom", displayName: "Benchmark Analyzer", tier: 3, stage: 6, checkpoints: 13, function: "Industry benchmarks, peer comparison", status: "completed" },
  { id: 22, name: "Agent_Flowgrid", displayName: "Lineage Tracker", tier: 3, stage: 5, checkpoints: 59, function: "Data lineage, model versioning", status: "completed" },
  { id: 23, name: "Agent_Watchtower", displayName: "Compliance Monitor", tier: 4, stage: 7, checkpoints: 15, function: "Continuous compliance monitoring", status: "completed" },
  { id: 24, name: "Agent_Doomscale", displayName: "Catastrophic Risk Assessor", tier: 4, stage: 6, checkpoints: 110, function: "Existential risk, societal impact", status: "completed" },
  { id: 25, name: "Agent_Pulsecheck", displayName: "Digital Maturity Assessor", tier: 2, stage: 4, checkpoints: 25, function: "Infrastructure, data, automation, workforce", status: "completed" },
];

export const AGENT_CHECKPOINT_COUNTS: Record<string, number> = {
  "Agent_Lexmap": 1120,
  "Agent_Redward": 149,
  "Agent_Doomscale": 110,
  "Agent_Flowgrid": 59,
  "Agent_Borderlex": 51,
  "Agent_Prompthex": 42,
  "Agent_Ironveil": 31,
  "Agent_Blindspot": 31,
  "Agent_Pulsecheck": 25,
  "Agent_Shadefinder": 20,
  "Agent_Pixelbrew": 20,
  "Agent_Chainlink": 18,
  "Agent_Ecotrail": 18,
  "Agent_Equinox": 15,
  "Agent_Watchtower": 15,
  "Agent_Watchdog": 15,
  "Agent_Peerloom": 13,
  "Agent_Modeltap": 12,
  "Agent_Lantern": 9,
  "Agent_VaRlock": 1,
};
