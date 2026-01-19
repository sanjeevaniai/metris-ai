// Microsoft RAI Demo Data
// Based on: https://github.com/microsoft/responsible-ai-toolbox

export const microsoftRaiDemo = {
  organization: {
    name: "Microsoft Corporation",
    system: "Responsible AI Toolkit - Credit Scoring",
    url: "https://github.com/microsoft/responsible-ai-toolbox",
    industry: "Technology",
    ein: "123-456789",
  },
  
  scanResults: {
    overallScore: 912,
    dimensions: [
      { name: "Technical Robustness", score: 94, weight: 0.25 },
      { name: "Fairness & Non-Discrimination", score: 88, weight: 0.30 },
      { name: "Transparency & Explainability", score: 96, weight: 0.25 },
      { name: "Governance & Accountability", score: 91, weight: 0.20 },
    ],
    pillars: [
      { id: 1, name: "Model Documentation", score: 98, dimension: "Transparency", findings: 1 },
      { id: 2, name: "Bias Detection", score: 87, dimension: "Fairness", findings: 2 },
      { id: 3, name: "Explainability", score: 96, dimension: "Transparency", findings: 0 },
      { id: 4, name: "Error Analysis", score: 94, dimension: "Technical", findings: 1 },
      { id: 5, name: "Data Governance", score: 89, dimension: "Governance", findings: 1 },
      { id: 6, name: "Human Oversight", score: 93, dimension: "Governance", findings: 1 },
      { id: 7, name: "Risk Management", score: 91, dimension: "Technical", findings: 1 },
      { id: 8, name: "Monitoring & Drift", score: 95, dimension: "Technical", findings: 1 },
      { id: 9, name: "Regulatory Compliance", score: 88, dimension: "Governance", findings: 2 },
    ],
  },
  
  findings: [
    {
      id: "MSR-001",
      title: "Minor Geographic Variance Detected",
      severity: "low",
      pillar: "Bias Detection",
      description: "Demographic parity difference of 0.06 in Northeast region - within acceptable threshold",
      recommendation: "Continue monitoring with quarterly fairness audits",
      roiImpact: 150000,
      estimatedEffort: "quick",
      regulation: "EU AI Act Art. 10",
    },
    {
      id: "MSR-002",
      title: "Intersectional Analysis Enhancement",
      severity: "low",
      pillar: "Bias Detection",
      description: "Opportunity to add intersectional cohort monitoring for proactive compliance",
      recommendation: "Implement automated intersectional fairness dashboard",
      roiImpact: 100000,
      estimatedEffort: "medium",
      regulation: "EU AI Act Art. 10",
    },
    {
      id: "MSR-003",
      title: "Alternative Data Integration Opportunity",
      severity: "medium",
      pillar: "Error Analysis",
      description: "Could improve accuracy for thin-file applicants by incorporating utility payment data",
      recommendation: "Evaluate alternative credit data sources for edge cases",
      roiImpact: 250000,
      estimatedEffort: "medium",
      regulation: "NIST AI RMF MEASURE",
    },
    {
      id: "MSR-004",
      title: "Real-Time Drift Monitoring Enhancement",
      severity: "low",
      pillar: "Monitoring & Drift",
      description: "Current daily PSI monitoring could be upgraded to real-time for premium tier",
      recommendation: "Implement streaming drift detection with sub-hour latency",
      roiImpact: 120000,
      estimatedEffort: "medium",
      regulation: "EU AI Act Art. 9",
    },
    {
      id: "MSR-005",
      title: "Documentation Version Control",
      severity: "low",
      pillar: "Data Governance",
      description: "Model card versioning could be enhanced with automated changelog generation",
      recommendation: "Integrate with MLflow for automated documentation updates",
      roiImpact: 80000,
      estimatedEffort: "quick",
      regulation: "EU AI Act Art. 11",
    },
  ],
  
  financialMetrics: {
    totalExposure: 700000,
    remediationCost: 85000,
    netROI: 615000,
    roiMultiple: 7.2,
    paybackPeriod: 1.4,
  },
  
  regulatoryCompliance: [
    { regulation: "EU AI Act", compliance: 68, articles: ["Art. 9", "Art. 10", "Art. 13", "Art. 14"] },
    { regulation: "NIST AI RMF", compliance: 75, functions: ["GOVERN", "MAP", "MEASURE", "MANAGE"] },
    { regulation: "NYC LL144", compliance: 82, sections: ["Bias Audit", "Notice", "Disclosure"] },
    { regulation: "UK AI Code", compliance: 79, sections: ["Safety", "Transparency", "Fairness"] },
  ],
  
  sampleDocuments: [
    { name: "Model Card - Credit Scoring v2.1", type: "yaml", path: "/sample-docs/microsoft-rai-model-card.yaml" },
    { name: "Fairness Assessment Report", type: "json", path: "/sample-docs/microsoft-rai-fairness-report.json" },
    { name: "Error Analysis Report", type: "json", path: "/sample-docs/microsoft-rai-error-analysis.json" },
  ],
};

export type MicrosoftRaiDemo = typeof microsoftRaiDemo;
