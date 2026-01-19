export interface AnalysisAgent {
  id: string;
  name: string;
  displayName: string;
  description: string;
  checkpoints: number;
  frameworks: string[];
}

export const ANALYSIS_AGENTS: AnalysisAgent[] = [
  {
    id: 'policy',
    name: 'Agent_Policy',
    displayName: 'Policy & Governance Expert',
    description: 'Examining governance documentation',
    checkpoints: 87,
    frameworks: ['ISO 42001 Section 5', 'NIST AI RMF - Govern'],
  },
  {
    id: 'risk',
    name: 'Agent_Risk',
    displayName: 'Risk Assessment Expert',
    description: 'Analyzing risk management practices',
    checkpoints: 94,
    frameworks: ['ISO 42001 Section 6.1', 'EU AI Act Article 9', 'NIST AI RMF - Map'],
  },
  {
    id: 'data',
    name: 'Agent_Data',
    displayName: 'Data Governance Expert',
    description: 'Reviewing data handling practices',
    checkpoints: 82,
    frameworks: ['ISO 42001 Section 7.2', 'EU AI Act Article 10'],
  },
  {
    id: 'aims',
    name: 'Agent_AIMS',
    displayName: 'AI Management System Expert',
    description: 'Evaluating management system maturity',
    checkpoints: 76,
    frameworks: ['ISO 42001 Section 4', 'NIST AI RMF - Govern'],
  },
  {
    id: 'ethics',
    name: 'Agent_Ethics',
    displayName: 'Ethics & Responsible AI Expert',
    description: 'Assessing ethical AI practices',
    checkpoints: 68,
    frameworks: ['IEEE 7000', 'OECD AI Principles'],
  },
  {
    id: 'human',
    name: 'Agent_Human',
    displayName: 'Human Oversight Expert',
    description: 'Checking human-in-the-loop controls',
    checkpoints: 71,
    frameworks: ['EU AI Act Article 14', 'ISO 42001 Section 8.4'],
  },
  {
    id: 'model',
    name: 'Agent_Model',
    displayName: 'Model Documentation Expert',
    description: 'Reviewing model cards and documentation',
    checkpoints: 89,
    frameworks: ['Model Cards for ML', 'ISO 42001 Section 7.5'],
  },
  {
    id: 'trans',
    name: 'Agent_Trans',
    displayName: 'Transparency Expert',
    description: 'Evaluating transparency measures',
    checkpoints: 73,
    frameworks: ['EU AI Act Article 13', 'NIST AI RMF - Map'],
  },
  {
    id: 'bias',
    name: 'Agent_Bias',
    displayName: 'Fairness & Bias Expert',
    description: 'Analyzing fairness and bias controls',
    checkpoints: 85,
    frameworks: ['EU AI Act Article 10', 'NIST AI RMF - Measure'],
  },
  {
    id: 'privacy',
    name: 'Agent_Privacy',
    displayName: 'Privacy Protection Expert',
    description: 'Checking privacy safeguards',
    checkpoints: 79,
    frameworks: ['GDPR', 'ISO 42001 Section 6.1.4'],
  },
  {
    id: 'security',
    name: 'Agent_Security',
    displayName: 'Security Controls Expert',
    description: 'Evaluating security measures',
    checkpoints: 91,
    frameworks: ['ISO 27001', 'NIST CSF', 'EU AI Act Article 15'],
  },
  {
    id: 'monitor',
    name: 'Agent_Monitor',
    displayName: 'Monitoring Systems Expert',
    description: 'Reviewing monitoring capabilities',
    checkpoints: 67,
    frameworks: ['ISO 42001 Section 9.1', 'NIST AI RMF - Manage'],
  },
  {
    id: 'incident',
    name: 'Agent_Incident',
    displayName: 'Incident Response Expert',
    description: 'Assessing incident management',
    checkpoints: 58,
    frameworks: ['EU AI Act Article 62', 'ISO 42001 Section 10.2'],
  },
  {
    id: 'training',
    name: 'Agent_Training',
    displayName: 'Training & Competency Expert',
    description: 'Checking training programs',
    checkpoints: 64,
    frameworks: ['ISO 42001 Section 7.2', 'EU AI Act Article 4'],
  },
  {
    id: 'audit',
    name: 'Agent_Audit',
    displayName: 'Audit Readiness Expert',
    description: 'Evaluating audit preparedness',
    checkpoints: 72,
    frameworks: ['ISO 42001 Section 9.2', 'SOC 2'],
  },
  {
    id: 'supply',
    name: 'Agent_Supply',
    displayName: 'Supply Chain Expert',
    description: 'Reviewing vendor management',
    checkpoints: 55,
    frameworks: ['ISO 42001 Section 8.1.3', 'EU AI Act Article 28'],
  },
  {
    id: 'deploy',
    name: 'Agent_Deploy',
    displayName: 'Deployment Controls Expert',
    description: 'Checking deployment practices',
    checkpoints: 69,
    frameworks: ['ISO 42001 Section 8.2', 'NIST AI RMF - Manage'],
  },
  {
    id: 'change',
    name: 'Agent_Change',
    displayName: 'Change Management Expert',
    description: 'Evaluating change control processes',
    checkpoints: 61,
    frameworks: ['ISO 42001 Section 8.1', 'ITIL'],
  },
  {
    id: 'legal',
    name: 'Agent_Legal',
    displayName: 'Legal Compliance Expert',
    description: 'Assessing regulatory compliance',
    checkpoints: 88,
    frameworks: ['EU AI Act', 'GDPR', 'Sector Regulations'],
  },
  {
    id: 'industry',
    name: 'Agent_Industry',
    displayName: 'Industry Standards Expert',
    description: 'Checking industry-specific requirements',
    checkpoints: 74,
    frameworks: ['FDA AI/ML', 'FCA AI Guidelines', 'EEOC AI'],
  },
  {
    id: 'rigor',
    name: 'Agent_Rigor',
    displayName: 'Statistical Rigor Expert',
    description: 'Validating statistical methodology',
    checkpoints: 53,
    frameworks: ['Statistical Best Practices', 'ISO 42001 Annex A'],
  },
  {
    id: 'statsig',
    name: 'Agent_StatSig',
    displayName: 'Statistical Significance Expert',
    description: 'Calculating confidence intervals',
    checkpoints: 47,
    frameworks: ['Bayesian Inference', 'Monte Carlo Methods'],
  },
  {
    id: 'prognosis',
    name: 'Agent_Prognosis',
    displayName: 'Risk Prognosis Expert',
    description: 'Projecting risk trajectories',
    checkpoints: 51,
    frameworks: ['Risk Modeling', 'Scenario Analysis'],
  },
  {
    id: 'context',
    name: 'Agent_Context',
    displayName: 'Contextual Analysis Expert',
    description: 'Applying organizational context',
    checkpoints: 44,
    frameworks: ['ISO 42001 Section 4.1', 'Industry Context'],
  },
  {
    id: 'synthesis',
    name: 'Agent_Synthesis',
    displayName: 'Score Synthesis Expert',
    description: 'Calculating your METRIS Score',
    checkpoints: 42,
    frameworks: ['METRIS Scoring Model', 'Weighted Aggregation'],
  },
];

export const TOTAL_CHECKPOINTS = ANALYSIS_AGENTS.reduce((sum, agent) => sum + agent.checkpoints, 0);

export interface Finding {
  type: 'pass' | 'gap-major' | 'gap-minor' | 'ofi' | 'examining';
  text: string;
}

export const SAMPLE_FINDINGS: Record<string, Finding[]> = {
  policy: [
    { type: 'pass', text: 'AI governance policy exists and is documented' },
    { type: 'pass', text: 'Policy ownership and accountability defined' },
    { type: 'gap-minor', text: 'GAP: Policy review cycle not specified' },
    { type: 'pass', text: 'Stakeholder roles clearly defined' },
  ],
  risk: [
    { type: 'pass', text: 'Risk register exists and is documented' },
    { type: 'pass', text: 'Risk categories align with ISO 42001' },
    { type: 'gap-major', text: 'GAP: No quantitative risk scoring methodology found' },
    { type: 'gap-minor', text: 'GAP: Missing risk appetite statement' },
    { type: 'pass', text: 'Annual risk review process documented' },
  ],
  data: [
    { type: 'pass', text: 'Data inventory maintained' },
    { type: 'gap-minor', text: 'GAP: Data lineage documentation incomplete' },
    { type: 'pass', text: 'Data quality metrics defined' },
    { type: 'ofi', text: 'OFI: Consider automated data validation' },
  ],
  aims: [
    { type: 'pass', text: 'Management system scope defined' },
    { type: 'pass', text: 'Leadership commitment documented' },
    { type: 'gap-minor', text: 'GAP: Resource allocation not formalized' },
  ],
  ethics: [
    { type: 'pass', text: 'Ethical AI principles documented' },
    { type: 'gap-major', text: 'GAP: No ethics review board established' },
    { type: 'ofi', text: 'OFI: Consider stakeholder impact assessments' },
  ],
  human: [
    { type: 'pass', text: 'Human oversight roles defined' },
    { type: 'pass', text: 'Override mechanisms documented' },
    { type: 'gap-minor', text: 'GAP: Escalation procedures incomplete' },
  ],
  model: [
    { type: 'pass', text: 'Model cards present for key systems' },
    { type: 'gap-minor', text: 'GAP: Performance metrics not standardized' },
    { type: 'pass', text: 'Version control in place' },
  ],
  trans: [
    { type: 'pass', text: 'AI disclosure statements found' },
    { type: 'gap-major', text: 'GAP: Technical documentation not user-accessible' },
    { type: 'ofi', text: 'OFI: Add explainability features' },
  ],
  bias: [
    { type: 'pass', text: 'Fairness testing documented' },
    { type: 'gap-minor', text: 'GAP: Protected class monitoring incomplete' },
    { type: 'pass', text: 'Bias mitigation strategies in place' },
  ],
  privacy: [
    { type: 'pass', text: 'Privacy impact assessments conducted' },
    { type: 'pass', text: 'Data minimization practices documented' },
    { type: 'ofi', text: 'OFI: Enhance consent management' },
  ],
  security: [
    { type: 'pass', text: 'Access controls implemented' },
    { type: 'pass', text: 'Encryption at rest and in transit' },
    { type: 'gap-minor', text: 'GAP: Penetration testing not regular' },
  ],
  monitor: [
    { type: 'pass', text: 'Performance monitoring active' },
    { type: 'gap-minor', text: 'GAP: Drift detection not automated' },
    { type: 'ofi', text: 'OFI: Add real-time alerting' },
  ],
  incident: [
    { type: 'pass', text: 'Incident response plan exists' },
    { type: 'gap-major', text: 'GAP: No AI-specific incident playbooks' },
  ],
  training: [
    { type: 'pass', text: 'AI training program exists' },
    { type: 'gap-minor', text: 'GAP: Training records incomplete' },
  ],
  audit: [
    { type: 'pass', text: 'Internal audit schedule defined' },
    { type: 'ofi', text: 'OFI: Consider third-party audits' },
  ],
  supply: [
    { type: 'gap-major', text: 'GAP: Vendor AI assessment not standardized' },
    { type: 'pass', text: 'Contract AI clauses present' },
  ],
  deploy: [
    { type: 'pass', text: 'Deployment procedures documented' },
    { type: 'pass', text: 'Rollback capabilities verified' },
  ],
  change: [
    { type: 'pass', text: 'Change management process defined' },
    { type: 'gap-minor', text: 'GAP: Impact assessment template missing' },
  ],
  legal: [
    { type: 'pass', text: 'Regulatory mapping completed' },
    { type: 'gap-minor', text: 'GAP: Compliance monitoring not automated' },
  ],
  industry: [
    { type: 'pass', text: 'Industry standards identified' },
    { type: 'ofi', text: 'OFI: Align with emerging sector guidance' },
  ],
  rigor: [
    { type: 'pass', text: 'Statistical methods documented' },
    { type: 'pass', text: 'Sample sizes appropriate' },
  ],
  statsig: [
    { type: 'pass', text: 'Confidence intervals calculated' },
    { type: 'pass', text: 'P-values properly interpreted' },
  ],
  prognosis: [
    { type: 'pass', text: 'Risk trajectories modeled' },
    { type: 'ofi', text: 'OFI: Add scenario planning' },
  ],
  context: [
    { type: 'pass', text: 'Organizational context documented' },
    { type: 'pass', text: 'Stakeholder needs identified' },
  ],
  synthesis: [
    { type: 'examining', text: 'Combining findings from 24 experts...' },
    { type: 'examining', text: 'Running Bayesian inference model...' },
    { type: 'examining', text: 'Calculating risk exposure range...' },
    { type: 'examining', text: 'Building confidence intervals...' },
    { type: 'examining', text: 'Generating remediation priorities...' },
  ],
};
