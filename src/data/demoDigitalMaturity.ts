// Digital Maturity (Agent 25) - Hardcoded for Enterprise Demo
export const DEMO_DIGITAL_MATURITY = {
  overallScore: 58,
  overallLevel: 3,
  tier: "Defined",
  currentLevel: 3,
  dimensions: [
    {
      name: "AI/ML Adoption",
      score: 62,
      level: 3,
      capabilities: [
        { name: "ML Pipeline Automation", status: "complete" },
        { name: "Model Monitoring", status: "in_progress" },
        { name: "Feature Store", status: "planned" },
        { name: "AutoML Integration", status: "planned" },
      ]
    },
    {
      name: "Data Infrastructure",
      score: 55,
      level: 3,
      capabilities: [
        { name: "Data Lake/Warehouse", status: "complete" },
        { name: "Data Governance", status: "in_progress" },
        { name: "Real-time Streaming", status: "planned" },
        { name: "Data Quality Automation", status: "in_progress" },
      ]
    },
    {
      name: "Cloud & DevOps",
      score: 68,
      level: 4,
      capabilities: [
        { name: "CI/CD Pipelines", status: "complete" },
        { name: "Infrastructure as Code", status: "complete" },
        { name: "Container Orchestration", status: "complete" },
        { name: "Multi-cloud Strategy", status: "in_progress" },
      ]
    },
    {
      name: "Talent & Culture",
      score: 48,
      level: 2,
      capabilities: [
        { name: "AI Literacy Program", status: "in_progress" },
        { name: "Cross-functional Teams", status: "planned" },
        { name: "Innovation Labs", status: "planned" },
        { name: "External Partnerships", status: "complete" },
      ]
    },
    {
      name: "Process & Governance",
      score: 58,
      level: 3,
      capabilities: [
        { name: "AI Ethics Framework", status: "complete" },
        { name: "Model Risk Management", status: "in_progress" },
        { name: "Regulatory Compliance", status: "in_progress" },
        { name: "Audit Trail", status: "complete" },
      ]
    },
  ],
  recommendations: [
    {
      title: "Implement Feature Store",
      description: "Centralize feature engineering to accelerate ML development and ensure consistency",
      dimension: "AI/ML Adoption",
      impact: 8,
    },
    {
      title: "Establish AI Literacy Program",
      description: "Train 80% of staff on AI fundamentals to improve adoption and reduce resistance",
      dimension: "Talent & Culture",
      impact: 12,
    },
    {
      title: "Deploy Real-time Streaming",
      description: "Enable real-time data processing for faster insights and model updates",
      dimension: "Data Infrastructure",
      impact: 6,
    },
    {
      title: "Formalize Model Risk Management",
      description: "Create comprehensive MRM framework aligned with SR 11-7 guidelines",
      dimension: "Process & Governance",
      impact: 10,
    },
  ],
  benchmarks: {
    industry: 52,
    topQuartile: 78,
    yourScore: 58,
  },
};

export interface MaturityDimension {
  id: string;
  name: string;
  score: number;
  weight: number;
  checkpoints: string[];
  passed: number;
  total: number;
  findings: string[];
}

export const MATURITY_DIMENSIONS: MaturityDimension[] = [
  { 
    id: "infrastructure", 
    name: "Infrastructure", 
    score: 745, 
    weight: 0.25, 
    checkpoints: ["DM-001", "DM-002", "DM-003", "DM-004", "DM-005"], 
    passed: 4, 
    total: 5,
    findings: ["DM-004: fail, Infrastructure as Code not fully implemented"]
  },
  { 
    id: "data_platform", 
    name: "Data Platform", 
    score: 680, 
    weight: 0.25, 
    checkpoints: ["DM-006", "DM-007", "DM-008", "DM-009", "DM-010"], 
    passed: 3, 
    total: 5,
    findings: ["DM-009: fail, No feature store implemented", "DM-010: fail, No real-time streaming capability"]
  },
  { 
    id: "automation", 
    name: "Automation", 
    score: 720, 
    weight: 0.20, 
    checkpoints: ["DM-011", "DM-012", "DM-013", "DM-014", "DM-015"], 
    passed: 4, 
    total: 5,
    findings: ["DM-015: fail, No auto-remediation capability"]
  },
  { 
    id: "workforce", 
    name: "Workforce", 
    score: 656, 
    weight: 0.15, 
    checkpoints: ["DM-016", "DM-017", "DM-018", "DM-019", "DM-020"], 
    passed: 3, 
    total: 5,
    findings: ["DM-019: fail, Limited cross-functional collaboration", "DM-020: fail, AI literacy below 50%"]
  },
  { 
    id: "integration", 
    name: "Integration", 
    score: 712, 
    weight: 0.15, 
    checkpoints: ["DM-021", "DM-022", "DM-023", "DM-024", "DM-025"], 
    passed: 4, 
    total: 5,
    findings: ["DM-024: fail, No third-party integration platform"]
  },
];

export const MATURITY_LEVELS = [
  { level: 1, name: "Initial", description: "Ad-hoc, reactive" },
  { level: 2, name: "Developing", description: "Basic processes" },
  { level: 3, name: "Defined", description: "Standardized processes" },
  { level: 4, name: "Managed", description: "Measured and controlled" },
  { level: 5, name: "Optimizing", description: "Continuous improvement" },
];