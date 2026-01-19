// Demo data for Continuous Monitoring Dashboard

export interface MonitoringAlert {
  id: string;
  type: 'critical' | 'warning' | 'info';
  title: string;
  description: string;
  impact: string;
  checkpoint?: string;
  source: string;
  timestamp: Date;
  actions: { label: string; action: string }[];
}

export interface DriftMetric {
  systemId: string;
  systemName: string;
  status: 'healthy' | 'watch' | 'alert';
  dataDrift: number;
  modelDrift: number;
  conceptDrift: number;
  psiScore: number;
  threshold: number;
  lastUpdated: Date;
}

export interface IntegrationStatus {
  id: string;
  name: string;
  status: 'connected' | 'warning' | 'disconnected';
  lastSync: Date;
  icon: string;
}

export interface LiveEvent {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  timestamp: Date;
  title: string;
  details: string[];
}

export interface CheckpointChange {
  id: string;
  checkpointId: string;
  name: string;
  previousStatus: 'pass' | 'warning' | 'fail';
  currentStatus: 'pass' | 'warning' | 'fail';
  changedAt: Date;
  trigger: string;
  impact: number;
}

export interface AtRiskCheckpoint {
  checkpointId: string;
  name: string;
  currentStatus: 'pass' | 'warning';
  riskLevel: 'low' | 'medium' | 'high';
  daysUntilChange: number;
}

export const DEMO_GOVERNANCE_STATUS = {
  status: 'stable' as const,
  currentScore: 687,
  scoreVariance: 34,
  riskExposure: 4200000,
  activeAlerts: 3,
  lastUpdated: new Date(Date.now() - 2 * 60 * 1000), // 2 minutes ago
  nextSync: new Date(Date.now() + 13 * 60 * 1000), // 13 minutes from now
};

export const DEMO_SCORE_HISTORY = [
  { date: '2025-12-17', score: 692 },
  { date: '2025-12-24', score: 698 },
  { date: '2025-12-31', score: 705 },
  { date: '2026-01-03', score: 701 },
  { date: '2026-01-07', score: 695 },
  { date: '2026-01-10', score: 690 },
  { date: '2026-01-13', score: 687 },
  { date: '2026-01-16', score: 687 },
];

export const DEMO_INTEGRATIONS: IntegrationStatus[] = [
  { id: 'github', name: 'GitHub', status: 'connected', lastSync: new Date(Date.now() - 2 * 60 * 1000), icon: 'github' },
  { id: 'datadog', name: 'Datadog', status: 'connected', lastSync: new Date(Date.now() - 5 * 60 * 1000), icon: 'activity' },
  { id: 'mlflow', name: 'MLflow', status: 'connected', lastSync: new Date(Date.now() - 15 * 60 * 1000), icon: 'brain' },
  { id: 'confluence', name: 'Confluence', status: 'warning', lastSync: new Date(Date.now() - 2 * 60 * 60 * 1000), icon: 'file-text' },
  { id: 'prometheus', name: 'Prometheus', status: 'disconnected', lastSync: new Date(0), icon: 'database' },
];

export const DEMO_ALERTS: MonitoringAlert[] = [
  {
    id: 'alert-1',
    type: 'critical',
    title: 'Model Drift Detected: DiagnosticAI',
    description: 'PSI score exceeded threshold (0.25 > 0.20) indicating significant distribution shift in input features.',
    impact: '-12 points to METRIS Score if unaddressed',
    checkpoint: 'CP-034 (Model Monitoring)',
    source: 'Datadog ML Monitoring',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    actions: [
      { label: 'View Details', action: 'view' },
      { label: 'Start Remediation', action: 'remediate' },
      { label: 'Snooze 24h', action: 'snooze' },
      { label: 'Dismiss', action: 'dismiss' },
    ],
  },
  {
    id: 'alert-2',
    type: 'warning',
    title: 'Documentation Staleness: Risk Assessment Policy',
    description: 'Risk_Assessment_Policy.pdf has not been updated in 180 days. EU AI Act requires annual review minimum.',
    impact: '-8 points if not updated within 30 days',
    checkpoint: 'CP-0892 (Risk Documentation Currency)',
    source: 'Document Freshness Monitor',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
    actions: [
      { label: 'View Document', action: 'view' },
      { label: 'Schedule Review', action: 'schedule' },
      { label: 'Snooze 7d', action: 'snooze' },
      { label: 'Dismiss', action: 'dismiss' },
    ],
  },
  {
    id: 'alert-3',
    type: 'warning',
    title: 'Threshold Breach Predicted: Score < 650 in 47 days',
    description: 'Based on current trajectory, your score is projected to fall below the critical threshold of 650 by March 3, 2026.',
    impact: 'Would trigger audit risk classification',
    checkpoint: undefined,
    source: 'Ensemble Forecasting Agent',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    actions: [
      { label: 'View Forecast', action: 'forecast' },
      { label: 'See Prevention Plan', action: 'plan' },
      { label: 'Adjust Threshold', action: 'threshold' },
    ],
  },
];

export const DEMO_DRIFT_METRICS: DriftMetric[] = [
  {
    systemId: 'diagnostic-ai',
    systemName: 'DiagnosticAI',
    status: 'alert',
    dataDrift: 0.25,
    modelDrift: 0.12,
    conceptDrift: 0.08,
    psiScore: 0.25,
    threshold: 0.20,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    systemId: 'patient-chat',
    systemName: 'PatientChat',
    status: 'healthy',
    dataDrift: 0.08,
    modelDrift: 0.05,
    conceptDrift: 0.03,
    psiScore: 0.08,
    threshold: 0.20,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    systemId: 'fraud-detector',
    systemName: 'FraudDetector',
    status: 'watch',
    dataDrift: 0.15,
    modelDrift: 0.18,
    conceptDrift: 0.06,
    psiScore: 0.18,
    threshold: 0.20,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
  },
  {
    systemId: 'recommender-v2',
    systemName: 'RecommenderV2',
    status: 'healthy',
    dataDrift: 0.04,
    modelDrift: 0.06,
    conceptDrift: 0.02,
    psiScore: 0.06,
    threshold: 0.20,
    lastUpdated: new Date(Date.now() - 15 * 60 * 1000),
  },
];

export const DEMO_LIVE_EVENTS: LiveEvent[] = [
  {
    id: 'event-1',
    type: 'success',
    timestamp: new Date(Date.now() - 12 * 60 * 1000),
    title: 'GitHub Sync Complete',
    details: ['acme-corp/diagnostic-ai • 3 new commits analyzed', 'Model card updated ✅ • No compliance impact'],
  },
  {
    id: 'event-2',
    type: 'error',
    timestamp: new Date(Date.now() - 16 * 60 * 1000),
    title: 'Drift Alert Triggered',
    details: ['DiagnosticAI • PSI exceeded threshold (0.25 > 0.20)', 'CP-034 status changed: PASS → FAIL', 'Score impact: -12 points (pending remediation)'],
  },
  {
    id: 'event-3',
    type: 'success',
    timestamp: new Date(Date.now() - 29 * 60 * 1000),
    title: 'Datadog Metrics Received',
    details: ['4 AI systems • 847 data points', 'All fairness metrics within bounds ✅'],
  },
  {
    id: 'event-4',
    type: 'warning',
    timestamp: new Date(Date.now() - 49 * 60 * 1000),
    title: 'Documentation Review Reminder',
    details: ['Risk_Assessment_Policy.pdf • 180 days since last update', 'Scheduled review: Not set'],
  },
  {
    id: 'event-5',
    type: 'success',
    timestamp: new Date(Date.now() - 64 * 60 * 1000),
    title: 'Scheduled Assessment Complete',
    details: ['Weekly compliance check • Score: 687 (no change)', '1,915 checkpoints evaluated • 28 gaps'],
  },
  {
    id: 'event-6',
    type: 'success',
    timestamp: new Date(Date.now() - 109 * 60 * 1000),
    title: 'MLflow Model Registered',
    details: ['PatientChat v2.3.1 • Compliance pre-check: PASS', 'Auto-scanned for bias metrics ✅'],
  },
];

export const DEMO_CHECKPOINT_CHANGES: CheckpointChange[] = [
  {
    id: 'change-1',
    checkpointId: 'CP-034',
    name: 'Model Drift Monitoring',
    previousStatus: 'pass',
    currentStatus: 'fail',
    changedAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    trigger: 'PSI threshold exceeded',
    impact: -12,
  },
  {
    id: 'change-2',
    checkpointId: 'CP-089',
    name: 'Bias Testing Frequency',
    previousStatus: 'warning',
    currentStatus: 'pass',
    changedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    trigger: 'Automated bias test completed',
    impact: 8,
  },
  {
    id: 'change-3',
    checkpointId: 'CP-156',
    name: 'Incident Response Test',
    previousStatus: 'pass',
    currentStatus: 'warning',
    changedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
    trigger: '90 days since last drill',
    impact: -5,
  },
];

export const DEMO_AT_RISK_CHECKPOINTS: AtRiskCheckpoint[] = [
  { checkpointId: 'CP-0892', name: 'Risk Docs', currentStatus: 'pass', riskLevel: 'medium', daysUntilChange: 30 },
  { checkpointId: 'CP-067', name: 'Cert Expiry', currentStatus: 'pass', riskLevel: 'high', daysUntilChange: 45 },
  { checkpointId: 'CP-112', name: 'Training Logs', currentStatus: 'pass', riskLevel: 'medium', daysUntilChange: 60 },
  { checkpointId: 'CP-045', name: 'Audit Trail', currentStatus: 'pass', riskLevel: 'low', daysUntilChange: 90 },
];

export const DEMO_COMPLIANCE_EVENTS = [
  { date: new Date('2026-02-01'), title: 'Quarterly Bias Audit', type: 'scheduled', framework: 'ISO 42001' },
  { date: new Date('2026-02-15'), title: 'Risk Assessment Review', type: 'due', framework: 'EU AI Act' },
  { date: new Date('2026-03-01'), title: 'Training Certification Renewal', type: 'deadline', framework: 'Internal' },
  { date: new Date('2026-03-15'), title: 'Incident Response Drill', type: 'scheduled', framework: 'NIST AI RMF' },
  { date: new Date('2026-08-02'), title: 'EU AI Act Enforcement', type: 'regulatory', framework: 'EU AI Act' },
];
