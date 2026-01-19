// Network graph demo data for checkpoint dependencies

export interface NetworkNode {
  id: string;
  label: string;
  pillar: string;
  importance: number; // 0-1 scale
  exposure: number;
  status: 'pass' | 'fail' | 'partial';
  description?: string;
}

export interface NetworkEdge {
  source: string;
  target: string;
  weight?: number;
}

export interface NetworkData {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
}

// 50 sample checkpoint nodes
export const DEMO_NETWORK_NODES: NetworkNode[] = [
  // Keystone checkpoints (high importance)
  { id: 'CP-0001', label: 'AI Policy Framework', pillar: 'accountability', importance: 0.95, exposure: 890000, status: 'pass', description: 'Foundational policy document' },
  { id: 'CP-0002', label: 'Risk Classification System', pillar: 'security', importance: 0.92, exposure: 1200000, status: 'partial', description: 'Risk assessment methodology' },
  { id: 'CP-0003', label: 'Data Governance Framework', pillar: 'privacy', importance: 0.90, exposure: 980000, status: 'pass', description: 'Data handling policies' },
  { id: 'CP-0004', label: 'Model Validation Protocol', pillar: 'reliability', importance: 0.88, exposure: 1450000, status: 'fail', description: 'Core validation procedures' },
  { id: 'CP-0005', label: 'Bias Detection Framework', pillar: 'fairness', importance: 0.85, exposure: 2100000, status: 'fail', description: 'Fairness testing infrastructure' },
  
  // High importance checkpoints
  { id: 'CP-0010', label: 'Model Documentation', pillar: 'transparency', importance: 0.78, exposure: 450000, status: 'pass' },
  { id: 'CP-0011', label: 'Training Data Audit', pillar: 'privacy', importance: 0.75, exposure: 680000, status: 'partial' },
  { id: 'CP-0012', label: 'Explainability Report', pillar: 'explainability', importance: 0.72, exposure: 520000, status: 'fail' },
  { id: 'CP-0013', label: 'Human Override Controls', pillar: 'human_oversight', importance: 0.70, exposure: 780000, status: 'pass' },
  { id: 'CP-0014', label: 'Incident Response Plan', pillar: 'incident_response', importance: 0.68, exposure: 920000, status: 'partial' },
  
  // Medium importance checkpoints
  { id: 'CP-0020', label: 'Access Control Matrix', pillar: 'security', importance: 0.65, exposure: 380000, status: 'pass' },
  { id: 'CP-0021', label: 'Version Control System', pillar: 'accountability', importance: 0.62, exposure: 290000, status: 'pass' },
  { id: 'CP-0022', label: 'Audit Trail Logging', pillar: 'transparency', importance: 0.60, exposure: 410000, status: 'pass' },
  { id: 'CP-0023', label: 'Performance Monitoring', pillar: 'reliability', importance: 0.58, exposure: 340000, status: 'partial' },
  { id: 'CP-0024', label: 'Bias Testing Suite', pillar: 'fairness', importance: 0.56, exposure: 420000, status: 'fail' },
  { id: 'CP-0025', label: 'Demographic Parity Check', pillar: 'fairness', importance: 0.54, exposure: 336000, status: 'fail' },
  { id: 'CP-0026', label: 'Data Encryption Standards', pillar: 'security', importance: 0.52, exposure: 560000, status: 'pass' },
  { id: 'CP-0027', label: 'Model Update Protocol', pillar: 'reliability', importance: 0.50, exposure: 380000, status: 'partial' },
  { id: 'CP-0028', label: 'Stakeholder Communication', pillar: 'transparency', importance: 0.48, exposure: 210000, status: 'pass' },
  { id: 'CP-0029', label: 'Model Card Documentation', pillar: 'transparency', importance: 0.46, exposure: 280000, status: 'fail' },
  
  // Lower importance checkpoints
  { id: 'CP-0030', label: 'Feature Importance Analysis', pillar: 'explainability', importance: 0.44, exposure: 190000, status: 'pass' },
  { id: 'CP-0031', label: 'Third-Party Audit', pillar: 'accountability', importance: 0.42, exposure: 350000, status: 'partial' },
  { id: 'CP-0032', label: 'Consent Management', pillar: 'privacy', importance: 0.40, exposure: 420000, status: 'pass' },
  { id: 'CP-0033', label: 'Escalation Procedures', pillar: 'human_oversight', importance: 0.38, exposure: 280000, status: 'pass' },
  { id: 'CP-0034', label: 'Data Lineage Mapping', pillar: 'privacy', importance: 0.36, exposure: 185000, status: 'fail' },
  { id: 'CP-0035', label: 'Model Drift Detection', pillar: 'reliability', importance: 0.34, exposure: 290000, status: 'partial' },
  { id: 'CP-0036', label: 'Supplier Due Diligence', pillar: 'supply_chain', importance: 0.32, exposure: 340000, status: 'partial' },
  { id: 'CP-0037', label: 'Recovery Procedures', pillar: 'incident_response', importance: 0.30, exposure: 450000, status: 'pass' },
  { id: 'CP-0038', label: 'Ethics Review Board', pillar: 'ethics', importance: 0.28, exposure: 180000, status: 'pass' },
  { id: 'CP-0039', label: 'Cultural Sensitivity Check', pillar: 'ethics', importance: 0.26, exposure: 220000, status: 'partial' },
  
  // Additional checkpoints
  { id: 'CP-0040', label: 'API Security Testing', pillar: 'security', importance: 0.24, exposure: 310000, status: 'pass' },
  { id: 'CP-0041', label: 'Load Testing Results', pillar: 'reliability', importance: 0.22, exposure: 180000, status: 'pass' },
  { id: 'CP-0042', label: 'User Feedback System', pillar: 'human_oversight', importance: 0.20, exposure: 120000, status: 'pass' },
  { id: 'CP-0043', label: 'Regulatory Mapping', pillar: 'accountability', importance: 0.18, exposure: 280000, status: 'partial' },
  { id: 'CP-0044', label: 'Training Records', pillar: 'digital_maturity', importance: 0.16, exposure: 90000, status: 'pass' },
  { id: 'CP-0045', label: 'Component Inventory', pillar: 'supply_chain', importance: 0.14, exposure: 150000, status: 'pass' },
  { id: 'CP-0046', label: 'Change Management Log', pillar: 'accountability', importance: 0.12, exposure: 110000, status: 'pass' },
  { id: 'CP-0047', label: 'Decision Boundary Analysis', pillar: 'explainability', importance: 0.10, exposure: 140000, status: 'partial' },
  { id: 'CP-0048', label: 'Confidence Calibration', pillar: 'reliability', importance: 0.08, exposure: 160000, status: 'pass' },
  { id: 'CP-0049', label: 'Output Validation Rules', pillar: 'reliability', importance: 0.06, exposure: 120000, status: 'pass' },
  { id: 'CP-0050', label: 'Backup Procedures', pillar: 'incident_response', importance: 0.04, exposure: 200000, status: 'pass' },
  
  // More for variety
  { id: 'CP-0051', label: 'Penetration Testing', pillar: 'security', importance: 0.55, exposure: 480000, status: 'partial' },
  { id: 'CP-0052', label: 'Equal Opportunity Analysis', pillar: 'fairness', importance: 0.53, exposure: 390000, status: 'fail' },
  { id: 'CP-0053', label: 'SHAP Value Documentation', pillar: 'explainability', importance: 0.51, exposure: 210000, status: 'partial' },
  { id: 'CP-0054', label: 'Vendor Risk Assessment', pillar: 'supply_chain', importance: 0.49, exposure: 420000, status: 'fail' },
  { id: 'CP-0055', label: 'SLA Compliance', pillar: 'reliability', importance: 0.47, exposure: 280000, status: 'pass' },
  { id: 'CP-0056', label: 'Adversarial Testing', pillar: 'security', importance: 0.45, exposure: 380000, status: 'fail' },
  { id: 'CP-0057', label: 'Data Minimization Check', pillar: 'privacy', importance: 0.43, exposure: 290000, status: 'pass' },
  { id: 'CP-0058', label: 'Notification Procedures', pillar: 'incident_response', importance: 0.41, exposure: 320000, status: 'partial' },
  { id: 'CP-0059', label: 'Stakeholder Training', pillar: 'digital_maturity', importance: 0.39, exposure: 180000, status: 'partial' },
];

// 80 edges showing dependencies
export const DEMO_NETWORK_EDGES: NetworkEdge[] = [
  // From AI Policy Framework (keystone)
  { source: 'CP-0001', target: 'CP-0002', weight: 0.9 },
  { source: 'CP-0001', target: 'CP-0003', weight: 0.85 },
  { source: 'CP-0001', target: 'CP-0010', weight: 0.7 },
  { source: 'CP-0001', target: 'CP-0021', weight: 0.6 },
  { source: 'CP-0001', target: 'CP-0038', weight: 0.75 },
  
  // From Risk Classification System (keystone)
  { source: 'CP-0002', target: 'CP-0004', weight: 0.88 },
  { source: 'CP-0002', target: 'CP-0005', weight: 0.82 },
  { source: 'CP-0002', target: 'CP-0014', weight: 0.7 },
  { source: 'CP-0002', target: 'CP-0020', weight: 0.65 },
  
  // From Data Governance Framework (keystone)
  { source: 'CP-0003', target: 'CP-0011', weight: 0.85 },
  { source: 'CP-0003', target: 'CP-0026', weight: 0.8 },
  { source: 'CP-0003', target: 'CP-0032', weight: 0.75 },
  { source: 'CP-0003', target: 'CP-0034', weight: 0.7 },
  { source: 'CP-0003', target: 'CP-0057', weight: 0.65 },
  
  // From Model Validation Protocol (keystone)
  { source: 'CP-0004', target: 'CP-0012', weight: 0.85 },
  { source: 'CP-0004', target: 'CP-0023', weight: 0.8 },
  { source: 'CP-0004', target: 'CP-0027', weight: 0.75 },
  { source: 'CP-0004', target: 'CP-0035', weight: 0.7 },
  { source: 'CP-0004', target: 'CP-0041', weight: 0.6 },
  { source: 'CP-0004', target: 'CP-0048', weight: 0.55 },
  { source: 'CP-0004', target: 'CP-0049', weight: 0.5 },
  
  // From Bias Detection Framework (keystone)
  { source: 'CP-0005', target: 'CP-0024', weight: 0.9 },
  { source: 'CP-0005', target: 'CP-0025', weight: 0.85 },
  { source: 'CP-0005', target: 'CP-0052', weight: 0.8 },
  { source: 'CP-0005', target: 'CP-0039', weight: 0.6 },
  
  // Additional dependency chains
  { source: 'CP-0010', target: 'CP-0022', weight: 0.7 },
  { source: 'CP-0010', target: 'CP-0028', weight: 0.65 },
  { source: 'CP-0010', target: 'CP-0029', weight: 0.8 },
  
  { source: 'CP-0011', target: 'CP-0024', weight: 0.6 },
  { source: 'CP-0011', target: 'CP-0034', weight: 0.75 },
  
  { source: 'CP-0012', target: 'CP-0030', weight: 0.8 },
  { source: 'CP-0012', target: 'CP-0047', weight: 0.75 },
  { source: 'CP-0012', target: 'CP-0053', weight: 0.85 },
  
  { source: 'CP-0013', target: 'CP-0033', weight: 0.8 },
  { source: 'CP-0013', target: 'CP-0042', weight: 0.7 },
  
  { source: 'CP-0014', target: 'CP-0037', weight: 0.85 },
  { source: 'CP-0014', target: 'CP-0050', weight: 0.7 },
  { source: 'CP-0014', target: 'CP-0058', weight: 0.75 },
  
  { source: 'CP-0020', target: 'CP-0026', weight: 0.7 },
  { source: 'CP-0020', target: 'CP-0040', weight: 0.75 },
  
  { source: 'CP-0021', target: 'CP-0022', weight: 0.6 },
  { source: 'CP-0021', target: 'CP-0046', weight: 0.8 },
  
  { source: 'CP-0023', target: 'CP-0035', weight: 0.85 },
  { source: 'CP-0023', target: 'CP-0041', weight: 0.7 },
  
  { source: 'CP-0024', target: 'CP-0025', weight: 0.9 },
  { source: 'CP-0024', target: 'CP-0052', weight: 0.85 },
  
  { source: 'CP-0026', target: 'CP-0040', weight: 0.8 },
  { source: 'CP-0026', target: 'CP-0051', weight: 0.75 },
  
  { source: 'CP-0027', target: 'CP-0035', weight: 0.8 },
  { source: 'CP-0027', target: 'CP-0046', weight: 0.6 },
  
  { source: 'CP-0031', target: 'CP-0043', weight: 0.7 },
  
  { source: 'CP-0036', target: 'CP-0045', weight: 0.8 },
  { source: 'CP-0036', target: 'CP-0054', weight: 0.85 },
  
  { source: 'CP-0038', target: 'CP-0039', weight: 0.85 },
  
  { source: 'CP-0040', target: 'CP-0051', weight: 0.8 },
  { source: 'CP-0040', target: 'CP-0056', weight: 0.75 },
  
  { source: 'CP-0043', target: 'CP-0044', weight: 0.6 },
  { source: 'CP-0043', target: 'CP-0059', weight: 0.65 },
  
  { source: 'CP-0044', target: 'CP-0059', weight: 0.7 },
  
  // Cross-pillar dependencies
  { source: 'CP-0020', target: 'CP-0014', weight: 0.55 },
  { source: 'CP-0026', target: 'CP-0003', weight: 0.5 },
  { source: 'CP-0022', target: 'CP-0031', weight: 0.6 },
  { source: 'CP-0041', target: 'CP-0055', weight: 0.7 },
  { source: 'CP-0051', target: 'CP-0056', weight: 0.85 },
  { source: 'CP-0032', target: 'CP-0028', weight: 0.6 },
  { source: 'CP-0037', target: 'CP-0050', weight: 0.75 },
  { source: 'CP-0033', target: 'CP-0058', weight: 0.65 },
  { source: 'CP-0035', target: 'CP-0023', weight: 0.6 },
  { source: 'CP-0053', target: 'CP-0029', weight: 0.7 },
  { source: 'CP-0054', target: 'CP-0036', weight: 0.75 },
  { source: 'CP-0055', target: 'CP-0027', weight: 0.5 },
  { source: 'CP-0057', target: 'CP-0032', weight: 0.65 },
  { source: 'CP-0058', target: 'CP-0037', weight: 0.7 },
  { source: 'CP-0047', target: 'CP-0030', weight: 0.75 },
  { source: 'CP-0048', target: 'CP-0049', weight: 0.8 },
  { source: 'CP-0052', target: 'CP-0039', weight: 0.7 },
];

// Keystone checkpoints (top 5 by importance)
export const KEYSTONE_CHECKPOINTS = DEMO_NETWORK_NODES
  .filter(n => n.importance >= 0.85)
  .sort((a, b) => b.importance - a.importance);

// Helper to get pillar color
export const PILLAR_COLORS: Record<string, string> = {
  transparency: '#00d4aa',
  reliability: '#0ea5e9',
  security: '#ef4444',
  privacy: '#8b5cf6',
  fairness: '#f59e0b',
  ethics: '#22c55e',
  accountability: '#ec4899',
  explainability: '#06b6d4',
  human_oversight: '#f97316',
  supply_chain: '#84cc16',
  incident_response: '#eab308',
  digital_maturity: '#6366f1',
};

// Helper to get status color
export const STATUS_COLORS: Record<string, string> = {
  pass: '#22c55e',
  fail: '#ef4444',
  partial: '#f59e0b',
};

// Calculate cascade effect of fixing a checkpoint
export function calculateCascadeEffect(checkpointId: string): {
  unlockedCount: number;
  totalExposure: number;
  checkpoints: string[];
} {
  const edges = DEMO_NETWORK_EDGES.filter(e => e.source === checkpointId);
  const directDependents = edges.map(e => e.target);
  
  // Get all checkpoints that depend on this one (recursive would be better, but keeping simple)
  const dependentNodes = DEMO_NETWORK_NODES.filter(n => directDependents.includes(n.id));
  const totalExposure = dependentNodes.reduce((sum, n) => sum + n.exposure, 0);
  
  return {
    unlockedCount: directDependents.length,
    totalExposure,
    checkpoints: directDependents,
  };
}
