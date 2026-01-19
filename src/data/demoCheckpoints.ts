// 1768 Checkpoints - Generated for Enterprise Demo
export interface Checkpoint {
  id: string;
  name: string;
  pillar: string;
  framework: string;
  severity: 'critical' | 'high' | 'medium' | 'low' | 'info';
  status: 'passed' | 'failed' | 'partial' | 'not_applicable';
  score: number;
  weight: number;
  evidence?: string;
  remediation?: string;
  lastChecked: string;
  agent: string;
}

const PILLARS = [
  'Transparency', 'Reliability & Performance', 'Security', 'Privacy',
  'Fairness & Bias', 'Ethics & Values', 'GenAI Integrity', 'Accountability',
  'Governance Maturity', 'Environmental Impact', 'Digital Maturity', 'MLOps & Operations'
];

const FRAMEWORKS = [
  'EU AI Act', 'NIST AI RMF', 'ISO 42001', 'IEEE 7000', 'SOC 2',
  'GDPR', 'CCPA', 'HIPAA', 'PCI DSS', 'FedRAMP', 'MITRE ATLAS'
];

const AGENTS = [
  'Transparency Agent', 'Bias Detection Agent', 'Security Agent', 'Privacy Agent',
  'Compliance Agent', 'Performance Agent', 'Ethics Agent', 'GenAI Agent',
  'Model Card Agent', 'Documentation Agent', 'Data Quality Agent', 'Drift Agent'
];

const CHECKPOINT_TEMPLATES = [
  { name: 'Model documentation completeness', severity: 'high' as const },
  { name: 'Training data lineage tracking', severity: 'critical' as const },
  { name: 'Bias testing coverage', severity: 'critical' as const },
  { name: 'Explainability mechanism present', severity: 'high' as const },
  { name: 'Human oversight integration', severity: 'high' as const },
  { name: 'Access control implementation', severity: 'critical' as const },
  { name: 'Encryption at rest enabled', severity: 'high' as const },
  { name: 'Audit logging active', severity: 'medium' as const },
  { name: 'Incident response plan documented', severity: 'high' as const },
  { name: 'Model versioning implemented', severity: 'medium' as const },
  { name: 'Data anonymization verification', severity: 'critical' as const },
  { name: 'Consent management tracking', severity: 'high' as const },
  { name: 'Right to explanation compliance', severity: 'high' as const },
  { name: 'Adversarial testing completed', severity: 'critical' as const },
  { name: 'Model performance monitoring', severity: 'medium' as const },
  { name: 'Drift detection configured', severity: 'high' as const },
  { name: 'Rollback capability verified', severity: 'high' as const },
  { name: 'API rate limiting enabled', severity: 'medium' as const },
  { name: 'Input validation present', severity: 'high' as const },
  { name: 'Output filtering configured', severity: 'high' as const },
  { name: 'Carbon footprint tracking', severity: 'low' as const },
  { name: 'Energy efficiency monitoring', severity: 'low' as const },
  { name: 'Third-party dependency audit', severity: 'medium' as const },
  { name: 'License compliance verified', severity: 'medium' as const },
  { name: 'PII detection scanning', severity: 'critical' as const },
  { name: 'Data retention policy enforcement', severity: 'high' as const },
  { name: 'Cross-border transfer compliance', severity: 'high' as const },
  { name: 'Prompt injection protection', severity: 'critical' as const },
  { name: 'Hallucination detection enabled', severity: 'high' as const },
  { name: 'Grounding verification active', severity: 'high' as const },
];

function generateCheckpoints(): Checkpoint[] {
  const checkpoints: Checkpoint[] = [];
  let cpIndex = 1;
  
  // Generate checkpoints to reach ~1768 total
  for (let round = 0; round < 59; round++) {
    for (const template of CHECKPOINT_TEMPLATES) {
      const pillar = PILLARS[cpIndex % PILLARS.length];
      const framework = FRAMEWORKS[cpIndex % FRAMEWORKS.length];
      const agent = AGENTS[cpIndex % AGENTS.length];
      
      // Distribute statuses based on demo score of 743
      const statusRand = Math.random();
      let status: Checkpoint['status'];
      let score: number;
      
      if (statusRand < 0.65) {
        status = 'passed';
        score = 850 + Math.floor(Math.random() * 150);
      } else if (statusRand < 0.85) {
        status = 'failed';
        score = 200 + Math.floor(Math.random() * 300);
      } else if (statusRand < 0.95) {
        status = 'partial';
        score = 500 + Math.floor(Math.random() * 200);
      } else {
        status = 'not_applicable';
        score = 0;
      }
      
      // Days ago for lastChecked
      const daysAgo = Math.floor(Math.random() * 30);
      const lastChecked = new Date(Date.now() - daysAgo * 24 * 60 * 60 * 1000).toISOString();
      
      checkpoints.push({
        id: `CP-${String(cpIndex).padStart(4, '0')}`,
        name: `${template.name} - ${pillar}`,
        pillar,
        framework,
        severity: template.severity,
        status,
        score,
        weight: [0.05, 0.1, 0.15, 0.2][Math.floor(Math.random() * 4)],
        evidence: status === 'passed' ? `Evidence collected by ${agent}` : undefined,
        remediation: status === 'failed' ? `Address ${template.name.toLowerCase()} requirements` : undefined,
        lastChecked,
        agent,
      });
      
      cpIndex++;
      if (cpIndex > 1768) break;
    }
    if (cpIndex > 1768) break;
  }
  
  return checkpoints;
}

export const DEMO_CHECKPOINTS: Checkpoint[] = generateCheckpoints();

// Summary stats
export const CHECKPOINT_STATS = {
  total: DEMO_CHECKPOINTS.length,
  passed: DEMO_CHECKPOINTS.filter(c => c.status === 'passed').length,
  failed: DEMO_CHECKPOINTS.filter(c => c.status === 'failed').length,
  partial: DEMO_CHECKPOINTS.filter(c => c.status === 'partial').length,
  notApplicable: DEMO_CHECKPOINTS.filter(c => c.status === 'not_applicable').length,
  byPillar: PILLARS.reduce((acc, pillar) => {
    acc[pillar] = DEMO_CHECKPOINTS.filter(c => c.pillar === pillar).length;
    return acc;
  }, {} as Record<string, number>),
  bySeverity: {
    critical: DEMO_CHECKPOINTS.filter(c => c.severity === 'critical').length,
    high: DEMO_CHECKPOINTS.filter(c => c.severity === 'high').length,
    medium: DEMO_CHECKPOINTS.filter(c => c.severity === 'medium').length,
    low: DEMO_CHECKPOINTS.filter(c => c.severity === 'low').length,
    info: DEMO_CHECKPOINTS.filter(c => c.severity === 'info').length,
  },
};
