// Security Dashboard Data (MITRE ATLAS) - Hardcoded for Enterprise Demo
export const DEMO_SECURITY = {
  score: 623,
  overallScore: 623,
  findings: [
    { id: "SEC-001", title: "Direct Prompt Injection Vulnerability", severity: "critical", category: "LLM Security" },
    { id: "SEC-002", title: "Indirect Prompt Injection Detection Missing", severity: "critical", category: "LLM Security" },
    { id: "SEC-003", title: "Jailbreak Prevention Incomplete", severity: "critical", category: "LLM Security" },
    { id: "SEC-004", title: "Data Exfiltration Risk", severity: "critical", category: "Data Protection" },
    { id: "SEC-005", title: "Model Inversion Attack Surface", severity: "high", category: "Adversarial Attacks" },
    { id: "SEC-006", title: "Membership Inference Vulnerability", severity: "high", category: "Privacy" },
    { id: "SEC-007", title: "Training Data Poisoning Risk", severity: "high", category: "Data Integrity" },
    { id: "SEC-008", title: "Model Theft Prevention Gaps", severity: "high", category: "IP Protection" },
    { id: "SEC-009", title: "Backdoor Detection Missing", severity: "medium", category: "Model Security" },
    { id: "SEC-010", title: "Output Filtering Incomplete", severity: "medium", category: "LLM Security" },
  ],
  mitreMapping: [
    { id: "AML.T0000", technique: "ML Supply Chain Compromise", status: "partial", coverage: 65 },
    { id: "AML.T0001", technique: "Model Inversion", status: "vulnerable", coverage: 30 },
    { id: "AML.T0002", technique: "Prompt Injection", status: "vulnerable", coverage: 25 },
    { id: "AML.T0003", technique: "Data Poisoning", status: "mitigated", coverage: 80 },
    { id: "AML.T0004", technique: "Model Theft", status: "partial", coverage: 55 },
    { id: "AML.T0005", technique: "Evasion Attack", status: "mitigated", coverage: 85 },
    { id: "AML.T0006", technique: "Membership Inference", status: "partial", coverage: 45 },
  ],
  vulnerabilities: {
    total: 47,
    bySeverity: {
      critical: 4,
      high: 12,
      medium: 18,
      low: 13,
    }
  },
  controls: {
    implemented: 67,
    categories: [
      { name: "Access Control", score: 78, implemented: 12, total: 15 },
      { name: "Data Protection", score: 62, implemented: 8, total: 12 },
      { name: "Model Security", score: 55, implemented: 6, total: 10 },
      { name: "Monitoring", score: 72, implemented: 9, total: 12 },
    ]
  },
  mitreAtlas: {
    coverage: 0.67,
    techniquesAssessed: 89,
    techniquesTotal: 149,
    criticalGaps: 12,
    highGaps: 24,
  },
};

export const SECURITY_CATEGORIES = [
  { name: "Adversarial Attacks", score: 612, checks: 30, passed: 18 },
  { name: "Backdoor Attacks", score: 645, checks: 15, passed: 10 },
  { name: "ML Supply Chain", score: 720, checks: 18, passed: 13 },
  { name: "LLM Security", score: 534, checks: 30, passed: 16, critical: true },
  { name: "Hardware Security", score: 756, checks: 12, passed: 9 },
  { name: "Data Poisoning", score: 678, checks: 20, passed: 14 },
  { name: "Model Theft", score: 712, checks: 24, passed: 17 },
];

export const LLM_SECURITY_DETAILS = [
  { name: "Prompt Injection", status: "Vulnerable", risk: "Critical" },
  { name: "Jailbreak Prevention", status: "Partial", risk: "High" },
  { name: "Output Filtering", status: "Implemented", risk: "Medium" },
  { name: "Data Exfiltration", status: "Vulnerable", risk: "Critical" },
  { name: "Hallucination Detection", status: "Partial", risk: "High" },
];

export const CRITICAL_SECURITY_FINDINGS = [
  { id: "SEC-021", name: "Direct Prompt Injection Prevention", severity: "Critical" },
  { id: "SEC-022", name: "Indirect Prompt Injection Detection", severity: "Critical" },
  { id: "SEC-023", name: "Jailbreak Prevention", severity: "Critical" },
  { id: "SEC-025", name: "Data Exfiltration Prevention", severity: "Critical" },
];