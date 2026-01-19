// Demo data for Live Tracker

export interface TaskStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'current' | 'complete';
  completedAt?: Date;
  completedBy?: string;
  template?: string;
  codeSnippet?: boolean;
}

export interface Evidence {
  id: string;
  filename: string;
  uploadedAt: Date;
  uploadedBy: string;
}

export interface ActivityEntry {
  id: string;
  action: string;
  user: string;
  timestamp: Date;
}

export interface RemediationTask {
  id: string;
  checkpointId: string;
  title: string;
  description: string;
  status: 'open' | 'in_progress' | 'in_review' | 'complete' | 'verified';
  priority: 'critical' | 'high' | 'medium' | 'low';
  assigneeId?: string;
  assigneeName?: string;
  dueDate?: Date;
  completedDate?: Date;
  estimatedHours: number;
  actualHours: number;
  scoreImpact: number;
  riskReduction: number;
  estimatedCost: number;
  roi: number;
  frameworks: string[];
  steps: TaskStep[];
  evidence: Evidence[];
  activityLog: ActivityEntry[];
  jiraTicketId?: string;
  progress: number;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar?: string;
  assigned: number;
  inProgress: number;
  completed: number;
  loadLevel: 'light' | 'normal' | 'high' | 'overloaded';
  estimatedCompletion: Date;
}

export const DEMO_REMEDIATION_SUMMARY = {
  totalItems: 28,
  open: 12,
  inProgress: 8,
  inReview: 3,
  complete: 5,
  overallProgress: 29,
  currentScore: 687,
  scoreVariance: 34,
  targetScore: 867,
  progressImpact: 52,
  riskReductionAchieved: 890000,
  potentialRiskReduction: 3860000,
  investmentSoFar: 18500,
  roiRealized: 48,
};

export const DEMO_REMEDIATION_TASKS: RemediationTask[] = [
  {
    id: 'task-1',
    checkpointId: 'CP-0892',
    title: 'Risk Scoring Methodology',
    description: 'No quantitative risk scoring methodology found in risk assessment documentation.',
    status: 'open',
    priority: 'critical',
    estimatedHours: 20,
    actualHours: 0,
    scoreImpact: 45,
    riskReduction: 1200000,
    estimatedCost: 15000,
    roi: 80,
    frameworks: ['EU AI Act Art. 9', 'ISO 42001 6.1.2', 'NIST AI RMF Map'],
    steps: [],
    evidence: [],
    activityLog: [],
    progress: 0,
  },
  {
    id: 'task-2',
    checkpointId: 'CP-0456',
    title: 'Human Oversight Procedures',
    description: 'Insufficient human-in-the-loop procedures documented for high-risk AI systems.',
    status: 'open',
    priority: 'critical',
    estimatedHours: 15,
    actualHours: 0,
    scoreImpact: 38,
    riskReduction: 890000,
    estimatedCost: 10000,
    roi: 89,
    frameworks: ['EU AI Act Art. 14', 'ISO 42001 8.4'],
    steps: [],
    evidence: [],
    activityLog: [],
    progress: 0,
  },
  {
    id: 'task-3',
    checkpointId: 'CP-024',
    title: 'Bias Testing Documentation',
    description: 'No documented bias testing procedures found. EU AI Act Article 10 requires systematic testing.',
    status: 'in_progress',
    priority: 'critical',
    assigneeId: 'user-1',
    assigneeName: 'Sarah K.',
    dueDate: new Date('2026-01-23'),
    estimatedHours: 5,
    actualHours: 3,
    scoreImpact: 35,
    riskReduction: 420000,
    estimatedCost: 2500,
    roi: 168,
    frameworks: ['EU AI Act Art. 10', 'ISO 42001 7.2', 'NIST AI RMF Measure'],
    steps: [
      { id: 's1', title: 'Generate Fairness Report', description: 'Run AIF360 analysis', status: 'complete', completedAt: new Date('2026-01-14'), completedBy: 'Sarah K.' },
      { id: 's2', title: 'Document Testing Methodology', description: 'Create formal bias testing procedure document', status: 'current', template: 'bias_testing_template.docx' },
      { id: 's3', title: 'Implement Monitoring', description: 'Set up automated bias monitoring in production', status: 'pending', codeSnippet: true },
      { id: 's4', title: 'METRIS Verification', description: 'Re-run assessment to verify checkpoint passes', status: 'pending' },
    ],
    evidence: [
      { id: 'e1', filename: 'fairness_report_diagnosticai_2026-01-14.pdf', uploadedAt: new Date('2026-01-14'), uploadedBy: 'Sarah K.' },
    ],
    activityLog: [
      { id: 'a1', action: 'marked Step 1 complete', user: 'Sarah K.', timestamp: new Date('2026-01-16T10:32:00') },
      { id: 'a2', action: 'uploaded fairness_report.pdf', user: 'Sarah K.', timestamp: new Date('2026-01-15T15:45:00') },
      { id: 'a3', action: 'started working on this task', user: 'Sarah K.', timestamp: new Date('2026-01-15T14:00:00') },
      { id: 'a4', action: 'Task created from assessment A-2847', user: 'System', timestamp: new Date('2026-01-14T09:00:00') },
    ],
    progress: 50,
  },
  {
    id: 'task-4',
    checkpointId: 'CP-034',
    title: 'Drift Monitoring Implementation',
    description: 'Model drift detection not configured for production AI systems.',
    status: 'in_progress',
    priority: 'critical',
    assigneeId: 'team-dev',
    assigneeName: 'Dev Team',
    dueDate: new Date('2026-01-25'),
    estimatedHours: 8,
    actualHours: 3,
    scoreImpact: 12,
    riskReduction: 145000,
    estimatedCost: 1000,
    roi: 145,
    frameworks: ['ISO 42001 9.1', 'NIST AI RMF Manage'],
    steps: [
      { id: 's1', title: 'Configure PSI monitoring', description: 'Set up drift detection alerts', status: 'current' },
      { id: 's2', title: 'Integrate with Datadog', description: 'Connect monitoring to alerting system', status: 'pending' },
      { id: 's3', title: 'Document thresholds', description: 'Define and document drift thresholds', status: 'pending' },
    ],
    evidence: [],
    activityLog: [],
    progress: 33,
  },
  {
    id: 'task-5',
    checkpointId: 'CP-067',
    title: 'ISO 42001 Certificate Renewal',
    description: 'ISO 42001 certification expiring. Renewal documentation required.',
    status: 'in_review',
    priority: 'medium',
    assigneeId: 'user-2',
    assigneeName: 'Mike R.',
    dueDate: new Date('2026-01-20'),
    estimatedHours: 4,
    actualHours: 3,
    scoreImpact: 15,
    riskReduction: 180000,
    estimatedCost: 5000,
    roi: 36,
    frameworks: ['ISO 42001'],
    steps: [
      { id: 's1', title: 'Complete audit prep', description: 'Prepare documentation for auditor', status: 'complete' },
      { id: 's2', title: 'Schedule audit', description: 'Coordinate with certification body', status: 'complete' },
      { id: 's3', title: 'Submit renewal', description: 'Upload certificate and evidence', status: 'current' },
    ],
    evidence: [
      { id: 'e1', filename: 'ISO_42001_Certificate_2026.pdf', uploadedAt: new Date('2026-01-18'), uploadedBy: 'Mike R.' },
    ],
    activityLog: [],
    progress: 85,
  },
  {
    id: 'task-6',
    checkpointId: 'CP-089',
    title: 'Incident Response Drill',
    description: 'Incident response procedures not tested in over 90 days.',
    status: 'in_review',
    priority: 'medium',
    assigneeId: 'team-ops',
    assigneeName: 'Ops Team',
    dueDate: new Date('2026-01-22'),
    estimatedHours: 6,
    actualHours: 5,
    scoreImpact: 10,
    riskReduction: 120000,
    estimatedCost: 3500,
    roi: 34,
    frameworks: ['NIST AI RMF Manage', 'ISO 42001 10.2'],
    steps: [
      { id: 's1', title: 'Plan drill scenario', description: 'Design realistic test case', status: 'complete' },
      { id: 's2', title: 'Execute drill', description: 'Run tabletop exercise', status: 'complete' },
      { id: 's3', title: 'Document results', description: 'Create after-action report', status: 'current' },
    ],
    evidence: [
      { id: 'e1', filename: 'IR_Drill_Report_Jan2026.pdf', uploadedAt: new Date('2026-01-19'), uploadedBy: 'Ops Team' },
    ],
    activityLog: [],
    progress: 90,
  },
  {
    id: 'task-7',
    checkpointId: 'CP-045',
    title: 'Privacy Controls Update',
    description: 'Privacy policy needs update for new AI data processing activities.',
    status: 'in_review',
    priority: 'medium',
    assigneeId: 'user-1',
    assigneeName: 'Sarah K.',
    dueDate: new Date('2026-01-21'),
    estimatedHours: 3,
    actualHours: 2,
    scoreImpact: 8,
    riskReduction: 95000,
    estimatedCost: 1500,
    roi: 63,
    frameworks: ['GDPR', 'EU AI Act Art. 13'],
    steps: [
      { id: 's1', title: 'Review current policy', description: 'Identify gaps', status: 'complete' },
      { id: 's2', title: 'Draft updates', description: 'Update policy language', status: 'complete' },
      { id: 's3', title: 'Legal review', description: 'Get approval from legal', status: 'current' },
    ],
    evidence: [
      { id: 'e1', filename: 'Privacy_Policy_v3.docx', uploadedAt: new Date('2026-01-18'), uploadedBy: 'Sarah K.' },
    ],
    activityLog: [],
    progress: 80,
  },
  {
    id: 'task-8',
    checkpointId: 'CP-112',
    title: 'Training Log Update',
    description: 'AI training records need to include new team members.',
    status: 'complete',
    priority: 'low',
    assigneeId: 'user-1',
    assigneeName: 'Sarah K.',
    dueDate: new Date('2026-01-14'),
    completedDate: new Date('2026-01-14'),
    estimatedHours: 2,
    actualHours: 2,
    scoreImpact: 8,
    riskReduction: 95000,
    estimatedCost: 2500,
    roi: 38,
    frameworks: ['ISO 42001 7.2'],
    steps: [
      { id: 's1', title: 'Update training records', description: 'Add new completions', status: 'complete' },
      { id: 's2', title: 'Verify records', description: 'Cross-check with HR', status: 'complete' },
    ],
    evidence: [
      { id: 'e1', filename: 'Training_Records_2026.xlsx', uploadedAt: new Date('2026-01-14'), uploadedBy: 'Sarah K.' },
    ],
    activityLog: [],
    progress: 100,
  },
  {
    id: 'task-9',
    checkpointId: 'CP-156',
    title: 'Audit Trail Configuration',
    description: 'Audit logging not capturing all required AI decision events.',
    status: 'complete',
    priority: 'medium',
    assigneeId: 'team-dev',
    assigneeName: 'Dev Team',
    dueDate: new Date('2026-01-10'),
    completedDate: new Date('2026-01-10'),
    estimatedHours: 4,
    actualHours: 5,
    scoreImpact: 12,
    riskReduction: 140000,
    estimatedCost: 5000,
    roi: 28,
    frameworks: ['EU AI Act Art. 12', 'ISO 42001 9.2'],
    steps: [
      { id: 's1', title: 'Configure logging', description: 'Add decision event capture', status: 'complete' },
      { id: 's2', title: 'Test logging', description: 'Verify all events captured', status: 'complete' },
    ],
    evidence: [],
    activityLog: [],
    progress: 100,
  },
  {
    id: 'task-10',
    checkpointId: 'CP-078',
    title: 'Data Quality Framework',
    description: 'Data quality monitoring not in place for training data.',
    status: 'open',
    priority: 'medium',
    estimatedHours: 10,
    actualHours: 0,
    scoreImpact: 12,
    riskReduction: 150000,
    estimatedCost: 8000,
    roi: 19,
    frameworks: ['EU AI Act Art. 10', 'ISO 42001 7.1'],
    steps: [],
    evidence: [],
    activityLog: [],
    progress: 0,
  },
];

export const DEMO_TEAM_MEMBERS: TeamMember[] = [
  {
    id: 'user-1',
    name: 'Sarah K.',
    role: 'Compliance Lead',
    assigned: 4,
    inProgress: 2,
    completed: 3,
    loadLevel: 'normal',
    estimatedCompletion: new Date('2026-01-28'),
  },
  {
    id: 'user-2',
    name: 'Mike R.',
    role: 'Risk Manager',
    assigned: 2,
    inProgress: 1,
    completed: 1,
    loadLevel: 'high',
    estimatedCompletion: new Date('2026-01-25'),
  },
  {
    id: 'team-dev',
    name: 'Dev Team',
    role: 'Engineering',
    assigned: 3,
    inProgress: 2,
    completed: 2,
    loadLevel: 'normal',
    estimatedCompletion: new Date('2026-01-30'),
  },
  {
    id: 'team-ops',
    name: 'Ops Team',
    role: 'Operations',
    assigned: 2,
    inProgress: 1,
    completed: 0,
    loadLevel: 'light',
    estimatedCompletion: new Date('2026-01-26'),
  },
];

export const DEMO_VERIFICATION_READY = DEMO_REMEDIATION_TASKS.filter(t => t.status === 'in_review');
export const DEMO_RECENTLY_VERIFIED = [
  { checkpointId: 'CP-112', title: 'Training Logs', result: 'verified' as const, impact: 8, verifiedAt: new Date('2026-01-14') },
  { checkpointId: 'CP-156', title: 'Audit Trail', result: 'verified' as const, impact: 12, verifiedAt: new Date('2026-01-10') },
  { checkpointId: 'CP-078', title: 'Data Retention', result: 'verified' as const, impact: 6, verifiedAt: new Date('2026-01-08') },
  { checkpointId: 'CP-034', title: 'Drift Monitoring (prev)', result: 'rework-needed' as const, impact: 0, verifiedAt: new Date('2026-01-06'), reason: 'Missing automated alerts' },
  { checkpointId: 'CP-092', title: 'Access Controls', result: 'verified' as const, impact: 5, verifiedAt: new Date('2026-01-05') },
];
