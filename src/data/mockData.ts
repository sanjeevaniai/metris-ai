// METRIS Platform - Mock Data for Demo
// Matches SANJEEVANI AI API schemas

export interface AISystem {
  id: string;
  name: string;
  description: string;
  riskLevel: 'critical' | 'high' | 'medium' | 'low';
  overallScore: number;
  lastScanned: string;
  status: 'active' | 'scanning' | 'pending';
}

export interface Finding {
  id: string;
  title: string;
  description: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  category: string;
  pillar: string;
  recommendation: string;
  estimatedEffort: 'quick' | 'medium' | 'significant';
  roiImpact: number;
}

export interface Dimension {
  id: string;
  name: string;
  score: number;
  weight: number;
  description: string;
}

export interface Pillar {
  id: string;
  name: string;
  dimensionId: string;
  score: number;
  weight: number;
  findings: number;
}

export interface SimulationResult {
  iteration: number;
  value: number;
  scenario: 'best' | 'likely' | 'worst';
}

export interface Agent {
  id: string;
  name: string;
  status: 'active' | 'idle' | 'processing' | 'complete';
  stage: number;
  findings: number;
}

// Demo AI Systems
export const mockAISystems: AISystem[] = [
  {
    id: 'sys-001',
    name: 'Customer Service Chatbot',
    description: 'AI-powered customer support system handling 10K+ daily interactions',
    riskLevel: 'medium',
    overallScore: 720,
    lastScanned: '2024-01-15T10:30:00Z',
    status: 'active'
  },
  {
    id: 'sys-002',
    name: 'Credit Scoring Model',
    description: 'ML model for automated credit decisions affecting loan approvals',
    riskLevel: 'high',
    overallScore: 580,
    lastScanned: '2024-01-14T15:45:00Z',
    status: 'active'
  },
  {
    id: 'sys-003',
    name: 'Fraud Detection Engine',
    description: 'Real-time transaction monitoring and fraud prevention system',
    riskLevel: 'critical',
    overallScore: 450,
    lastScanned: '2024-01-13T09:00:00Z',
    status: 'active'
  },
  {
    id: 'sys-004',
    name: 'HR Resume Screener',
    description: 'Automated candidate screening and ranking system',
    riskLevel: 'high',
    overallScore: 620,
    lastScanned: '2024-01-12T14:20:00Z',
    status: 'pending'
  },
  {
    id: 'sys-005',
    name: 'Product Recommendation',
    description: 'Personalized product suggestions based on user behavior',
    riskLevel: 'low',
    overallScore: 850,
    lastScanned: '2024-01-11T11:15:00Z',
    status: 'active'
  },
];

// 4 Core Dimensions
export const mockDimensions: Dimension[] = [
  {
    id: 'dim-1',
    name: 'AI Governance Readiness',
    score: 72,
    weight: 0.30,
    description: 'Organizational policies, oversight structures, and governance frameworks for AI'
  },
  {
    id: 'dim-2',
    name: 'Digital & AI Maturity',
    score: 68,
    weight: 0.25,
    description: 'Technical infrastructure, MLOps practices, and operational excellence'
  },
  {
    id: 'dim-3',
    name: 'Regulatory Alignment',
    score: 55,
    weight: 0.25,
    description: 'Compliance with EU AI Act, GDPR, industry-specific regulations'
  },
  {
    id: 'dim-4',
    name: 'Quantified AI Risk',
    score: 62,
    weight: 0.20,
    description: 'Financial exposure, model risk, and potential impact quantification'
  },
];

// 9 Pillars
export const mockPillars: Pillar[] = [
  { id: 'pil-1', name: 'AI Strategy & Vision', dimensionId: 'dim-1', score: 78, weight: 0.12, findings: 3 },
  { id: 'pil-2', name: 'Ethics & Principles', dimensionId: 'dim-1', score: 65, weight: 0.10, findings: 5 },
  { id: 'pil-3', name: 'Data Governance', dimensionId: 'dim-2', score: 70, weight: 0.12, findings: 4 },
  { id: 'pil-4', name: 'Model Lifecycle', dimensionId: 'dim-2', score: 62, weight: 0.11, findings: 6 },
  { id: 'pil-5', name: 'Technical Security', dimensionId: 'dim-2', score: 75, weight: 0.10, findings: 2 },
  { id: 'pil-6', name: 'EU AI Act Compliance', dimensionId: 'dim-3', score: 48, weight: 0.12, findings: 8 },
  { id: 'pil-7', name: 'Privacy & GDPR', dimensionId: 'dim-3', score: 58, weight: 0.11, findings: 5 },
  { id: 'pil-8', name: 'Financial Exposure', dimensionId: 'dim-4', score: 55, weight: 0.11, findings: 4 },
  { id: 'pil-9', name: 'Operational Risk', dimensionId: 'dim-4', score: 68, weight: 0.11, findings: 3 },
];

// Demo Findings
export const mockFindings: Finding[] = [
  {
    id: 'find-001',
    title: 'Missing AI System Registration for EU AI Act',
    description: 'High-risk AI systems must be registered in the EU database before deployment',
    severity: 'critical',
    category: 'Regulatory',
    pillar: 'EU AI Act Compliance',
    recommendation: 'Complete AI system registration documentation and submit to EU database',
    estimatedEffort: 'medium',
    roiImpact: 2500000
  },
  {
    id: 'find-002',
    title: 'Inadequate Human Oversight Mechanisms',
    description: 'Credit scoring model lacks sufficient human-in-the-loop controls',
    severity: 'high',
    category: 'Governance',
    pillar: 'Ethics & Principles',
    recommendation: 'Implement mandatory human review for decisions above threshold',
    estimatedEffort: 'significant',
    roiImpact: 1800000
  },
  {
    id: 'find-003',
    title: 'Model Drift Detection Not Implemented',
    description: 'No automated monitoring for model performance degradation',
    severity: 'high',
    category: 'Technical',
    pillar: 'Model Lifecycle',
    recommendation: 'Deploy real-time drift detection with automated alerts',
    estimatedEffort: 'medium',
    roiImpact: 950000
  },
  {
    id: 'find-004',
    title: 'Training Data Lineage Incomplete',
    description: 'Unable to trace origin of 23% of training data samples',
    severity: 'medium',
    category: 'Data',
    pillar: 'Data Governance',
    recommendation: 'Implement data cataloging and lineage tracking solution',
    estimatedEffort: 'significant',
    roiImpact: 720000
  },
  {
    id: 'find-005',
    title: 'Missing Bias Audit Documentation',
    description: 'No documented bias testing for protected characteristics',
    severity: 'critical',
    category: 'Ethics',
    pillar: 'Ethics & Principles',
    recommendation: 'Conduct comprehensive fairness audit across all protected groups',
    estimatedEffort: 'medium',
    roiImpact: 3200000
  },
  {
    id: 'find-006',
    title: 'Insufficient Explainability for End Users',
    description: 'Model decisions lack user-facing explanations required by transparency rules',
    severity: 'medium',
    category: 'Transparency',
    pillar: 'EU AI Act Compliance',
    recommendation: 'Implement SHAP-based explanation layer for customer-facing decisions',
    estimatedEffort: 'medium',
    roiImpact: 450000
  },
];

// 25 Scanning Agents (organized by tier)
export const mockAgents: Agent[] = [
  // Tier 1: Foundational Agents
  { id: 'agent-1', name: 'Evidence Collection', status: 'complete', stage: 1, findings: 2 },
  { id: 'agent-2', name: 'Shadow AI Detection', status: 'complete', stage: 1, findings: 3 },
  { id: 'agent-3', name: 'Document Processing', status: 'complete', stage: 1, findings: 1 },
  { id: 'agent-22', name: 'ML Registry Connector', status: 'complete', stage: 1, findings: 2 },
  
  // Tier 2: Technical Analysis Agents
  { id: 'agent-4', name: 'Fairness Audit', status: 'complete', stage: 2, findings: 4 },
  { id: 'agent-5', name: 'Robustness Testing', status: 'complete', stage: 2, findings: 2 },
  { id: 'agent-6', name: 'Data Quality', status: 'processing', stage: 3, findings: 5 },
  { id: 'agent-7', name: 'Explainability', status: 'processing', stage: 3, findings: 1 },
  { id: 'agent-8', name: 'Uncertainty Quantification', status: 'active', stage: 4, findings: 3 },
  { id: 'agent-9', name: 'Gen AI Risk Analyzer', status: 'active', stage: 4, findings: 6 },
  { id: 'agent-17', name: 'Environmental Impact', status: 'idle', stage: 5, findings: 0 },
  { id: 'agent-18', name: 'Security (MITRE ATLAS)', status: 'idle', stage: 5, findings: 0 },
  { id: 'agent-20', name: 'Third-Party Risk', status: 'idle', stage: 6, findings: 0 },
  { id: 'agent-23', name: 'MLOps Pipeline Analyzer', status: 'idle', stage: 6, findings: 0 },
  { id: 'agent-24', name: 'AIOps Observability', status: 'idle', stage: 6, findings: 0 },
  
  // Tier 3: Compliance Agents
  { id: 'agent-10', name: 'Regulatory Mapping', status: 'idle', stage: 7, findings: 0 },
  { id: 'agent-11', name: 'Evidence Matching', status: 'idle', stage: 7, findings: 0 },
  { id: 'agent-12', name: 'Jurisdiction Filter', status: 'idle', stage: 7, findings: 0 },
  { id: 'agent-13', name: 'Documentation Gap', status: 'idle', stage: 7, findings: 0 },
  { id: 'agent-21', name: 'Industry Benchmark', status: 'idle', stage: 7, findings: 0 },
  
  // Tier 4: Risk Forecasting Agents
  { id: 'agent-14', name: 'Risk Quantification', status: 'idle', stage: 8, findings: 0 },
  { id: 'agent-15', name: 'Forecasting', status: 'idle', stage: 8, findings: 0 },
  { id: 'agent-16', name: 'Remediation Planning', status: 'idle', stage: 8, findings: 0 },
  { id: 'agent-19', name: 'Catastrophic Risk', status: 'idle', stage: 8, findings: 0 },
  
  // Tier 5: Business Intelligence Agent
  { id: 'agent-25', name: 'Digitization Maturity', status: 'idle', stage: 8, findings: 0 },
];

// 16 Scanning Stages (comprehensive AI governance pillars)
export const scanningStages = [
  { id: 1, name: 'System Discovery', description: 'Identifying AI components and dependencies' },
  { id: 2, name: 'Data Governance', description: 'Examining data sources, quality, and lineage' },
  { id: 3, name: 'Model Analysis', description: 'Analyzing model architecture and behavior' },
  { id: 4, name: 'Fairness & Bias', description: 'Evaluating bias across protected groups' },
  { id: 5, name: 'Security Audit', description: 'Checking for vulnerabilities and attack vectors' },
  { id: 6, name: 'Privacy & GDPR', description: 'Data protection and privacy compliance' },
  { id: 7, name: 'Transparency', description: 'Explainability and disclosure requirements' },
  { id: 8, name: 'Human Oversight', description: 'Human-in-the-loop controls assessment' },
  { id: 9, name: 'Robustness', description: 'Testing model reliability and stability' },
  { id: 10, name: 'Ethics & Values', description: 'Alignment with ethical AI principles' },
  { id: 11, name: 'Compliance', description: 'Mapping to regulatory requirements' },
  { id: 12, name: 'Documentation', description: 'Technical and governance documentation' },
  { id: 13, name: 'Third-Party Risk', description: 'Vendor and supply chain assessment' },
  { id: 14, name: 'Environment', description: 'Carbon footprint and sustainability' },
  { id: 15, name: 'Risk Quantification', description: 'Calculating financial exposure' },
  { id: 16, name: 'Report', description: 'Compiling governance report' },
];

// Monte Carlo Simulation Data (10,000 iterations summary)
export const generateSimulationData = (): SimulationResult[] => {
  const results: SimulationResult[] = [];
  
  // Generate percentile distribution
  for (let i = 0; i <= 100; i += 2) {
    const baseValue = 2000000; // $2M base exposure
    const variance = 5000000; // Up to $5M variance
    
    // Best case (5th percentile)
    results.push({
      iteration: i,
      value: baseValue + (variance * 0.1 * (i / 100)),
      scenario: 'best'
    });
    
    // Likely case (50th percentile)
    results.push({
      iteration: i,
      value: baseValue + (variance * 0.5 * (i / 100)),
      scenario: 'likely'
    });
    
    // Worst case (95th percentile)
    results.push({
      iteration: i,
      value: baseValue + (variance * (i / 100)),
      scenario: 'worst'
    });
  }
  
  return results;
};

// Financial Metrics
export const mockFinancialMetrics = {
  totalExposure: 8500000,
  varP95: 6200000,
  cvarP99: 7800000,
  expectedLoss: 3400000,
  remediationCost: 850000,
  netROI: 5850000,
  roiMultiple: 7.9,
  paybackPeriod: 4.2, // months
};

// Regulatory Mappings
export const regulatoryMappings = [
  { regulation: 'EU AI Act', articles: ['Article 9', 'Article 10', 'Article 13', 'Article 14'], compliance: 48 },
  { regulation: 'GDPR', articles: ['Article 22', 'Article 35'], compliance: 72 },
  { regulation: 'ISO 42001', sections: ['5.1', '6.1', '7.1', '8.1'], compliance: 65 },
  { regulation: 'NIST AI RMF', functions: ['Govern', 'Map', 'Measure', 'Manage'], compliance: 58 },
];

// Terminal Log Messages for Demo
export const terminalLogs = [
  { timestamp: '10:32:01', level: 'info', message: 'Initializing METRIS scanning engine...' },
  { timestamp: '10:32:02', level: 'info', message: 'Connecting to GitHub repository: meridian-health/diagnostic-ai' },
  { timestamp: '10:32:03', level: 'success', message: 'Repository access granted - analyzing 847 files' },
  { timestamp: '10:32:05', level: 'info', message: 'Agent Evidence Collection activated - beginning system discovery' },
  { timestamp: '10:32:08', level: 'info', message: 'Detected 3 ML models: credit_scorer_v2.pkl, fraud_detector.h5, recommender.onnx' },
  { timestamp: '10:32:10', level: 'warning', message: 'Agent Shadow AI Detection: Missing model card for credit_scorer_v2.pkl' },
  { timestamp: '10:32:12', level: 'info', message: 'Agent Risk Quantification: Computing Value at Risk...' },
  { timestamp: '10:32:15', level: 'error', message: 'CRITICAL: No bias audit found for protected characteristics' },
  { timestamp: '10:32:18', level: 'info', message: 'Agent Fairness Audit: Initiating fairness analysis across 6 protected groups' },
  { timestamp: '10:32:22', level: 'warning', message: 'Training data lineage incomplete - 23% untracked samples' },
  { timestamp: '10:32:25', level: 'info', message: 'Agent Regulatory Mapping: Mapping to EU AI Act requirements...' },
  { timestamp: '10:32:28', level: 'error', message: 'HIGH RISK: AI system not registered in EU database' },
  { timestamp: '10:32:30', level: 'info', message: 'Agent Digitization Maturity: Assessing digital readiness and ROI correlation...' },
  { timestamp: '10:32:32', level: 'info', message: 'Digitization score: 62/100 - Estimated ROI multiplier: 1.4x' },
  { timestamp: '10:32:34', level: 'info', message: 'Calculating financial exposure: EUR 8.5M potential liability' },
  { timestamp: '10:32:36', level: 'success', message: 'Monte Carlo simulation complete: 10,000 iterations' },
  { timestamp: '10:32:38', level: 'info', message: 'Generating governance report...' },
  { timestamp: '10:32:40', level: 'success', message: 'METRIS scan complete - Overall Score: 648/1000' },
];
