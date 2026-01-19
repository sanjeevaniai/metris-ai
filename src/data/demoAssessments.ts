// Assessment History Demo Data - 6 months of progressive improvement

export interface AssessmentFinding {
  id: string;
  type: 'critical' | 'high' | 'medium' | 'low';
  status: 'new' | 'resolved' | 'ongoing';
  pillar: string;
  description: string;
  exposure: number;
}

export interface Assessment {
  id: string;
  date: string;
  displayDate: string;
  overallScore: number;
  previousScore: number | null;
  scoreChange: number;
  tier: string;
  systemsAssessed: string[];
  checkpointsEvaluated: number;
  checkpointsPassed: number;
  checkpointsFailed: number;
  findings: AssessmentFinding[];
  pillarScores: Record<string, number>;
  frameworkCoverage: Record<string, number>;
  totalExposure: number;
  keyHighlights: string[];
}

// Generate 6 assessments showing progressive improvement
export const DEMO_ASSESSMENTS: Assessment[] = [
  {
    id: 'A-2842',
    date: '2025-07-15',
    displayDate: 'July 15, 2025',
    overallScore: 620,
    previousScore: null,
    scoreChange: 0,
    tier: 'Critical',
    systemsAssessed: ['DiagnosticAI Pro'],
    checkpointsEvaluated: 720,
    checkpointsPassed: 432,
    checkpointsFailed: 288,
    findings: [
      { id: 'F-001', type: 'critical', status: 'resolved', pillar: 'Fairness & Bias', description: 'No bias testing framework in place', exposure: 2800000 },
      { id: 'F-002', type: 'critical', status: 'resolved', pillar: 'Security', description: 'Missing encryption at rest', exposure: 1500000 },
      { id: 'F-003', type: 'high', status: 'resolved', pillar: 'Transparency', description: 'Incomplete model documentation', exposure: 450000 },
      { id: 'F-004', type: 'high', status: 'ongoing', pillar: 'Privacy', description: 'Data retention policy gaps', exposure: 680000 },
      { id: 'F-005', type: 'critical', status: 'ongoing', pillar: 'Human Oversight', description: 'No human-in-the-loop process', exposure: 920000 },
    ],
    pillarScores: {
      transparency: 680, reliability: 590, security: 520, privacy: 640,
      fairness: 380, ethics: 780, accountability: 620, explainability: 650,
      human_oversight: 540, supply_chain: 600, incident_response: 580, digital_maturity: 590,
    },
    frameworkCoverage: {
      eu_ai_act: 52, nist_ai_rmf: 58, iso_42001: 48, colorado_sb205: 35,
      ca_ab2013: 45, nyc_ll144: 42, il_hb3773: 38, gdpr_ai: 62, soc2_ai: 55,
    },
    totalExposure: 18500000,
    keyHighlights: [
      'Initial baseline assessment completed',
      '12 critical findings identified',
      'Fairness pillar requires immediate attention',
      'Security infrastructure gaps documented',
    ],
  },
  {
    id: 'A-2843',
    date: '2025-08-15',
    displayDate: 'August 15, 2025',
    overallScore: 645,
    previousScore: 620,
    scoreChange: 25,
    tier: 'Critical',
    systemsAssessed: ['DiagnosticAI Pro', 'PatientChat Assistant'],
    checkpointsEvaluated: 785,
    checkpointsPassed: 489,
    checkpointsFailed: 296,
    findings: [
      { id: 'F-006', type: 'high', status: 'new', pillar: 'Reliability', description: 'Performance monitoring gaps', exposure: 380000 },
      { id: 'F-007', type: 'critical', status: 'resolved', pillar: 'Security', description: 'Encryption implemented', exposure: 0 },
      { id: 'F-008', type: 'high', status: 'ongoing', pillar: 'Fairness & Bias', description: 'Bias testing partially implemented', exposure: 1200000 },
    ],
    pillarScores: {
      transparency: 710, reliability: 620, security: 620, privacy: 680,
      fairness: 420, ethics: 810, accountability: 660, explainability: 680,
      human_oversight: 580, supply_chain: 630, incident_response: 610, digital_maturity: 620,
    },
    frameworkCoverage: {
      eu_ai_act: 58, nist_ai_rmf: 64, iso_42001: 54, colorado_sb205: 42,
      ca_ab2013: 52, nyc_ll144: 48, il_hb3773: 44, gdpr_ai: 68, soc2_ai: 60,
    },
    totalExposure: 16200000,
    keyHighlights: [
      'Security score improved +100 points',
      '2 critical findings resolved',
      'Added PatientChat Assistant to assessment scope',
      'Bias testing framework initiated',
    ],
  },
  {
    id: 'A-2844',
    date: '2025-09-15',
    displayDate: 'September 15, 2025',
    overallScore: 678,
    previousScore: 645,
    scoreChange: 33,
    tier: 'Developing',
    systemsAssessed: ['DiagnosticAI Pro', 'PatientChat Assistant'],
    checkpointsEvaluated: 812,
    checkpointsPassed: 536,
    checkpointsFailed: 276,
    findings: [
      { id: 'F-009', type: 'high', status: 'resolved', pillar: 'Transparency', description: 'Model cards completed', exposure: 0 },
      { id: 'F-010', type: 'medium', status: 'new', pillar: 'Supply Chain', description: 'Third-party component tracking needed', exposure: 280000 },
      { id: 'F-011', type: 'high', status: 'ongoing', pillar: 'Human Oversight', description: 'Escalation procedures incomplete', exposure: 520000 },
    ],
    pillarScores: {
      transparency: 760, reliability: 680, security: 680, privacy: 720,
      fairness: 480, ethics: 840, accountability: 700, explainability: 720,
      human_oversight: 640, supply_chain: 660, incident_response: 650, digital_maturity: 660,
    },
    frameworkCoverage: {
      eu_ai_act: 65, nist_ai_rmf: 72, iso_42001: 62, colorado_sb205: 50,
      ca_ab2013: 60, nyc_ll144: 55, il_hb3773: 50, gdpr_ai: 74, soc2_ai: 66,
    },
    totalExposure: 14800000,
    keyHighlights: [
      'Achieved Developing tier status',
      'Transparency pillar now above threshold',
      'Documentation gaps addressed',
      '33 point improvement from previous',
    ],
  },
  {
    id: 'A-2845',
    date: '2025-10-15',
    displayDate: 'October 15, 2025',
    overallScore: 695,
    previousScore: 678,
    scoreChange: 17,
    tier: 'Developing',
    systemsAssessed: ['DiagnosticAI Pro', 'PatientChat Assistant', 'ClaimsProcessor ML'],
    checkpointsEvaluated: 835,
    checkpointsPassed: 568,
    checkpointsFailed: 267,
    findings: [
      { id: 'F-012', type: 'critical', status: 'resolved', pillar: 'Fairness & Bias', description: 'Bias testing now operational', exposure: 0 },
      { id: 'F-013', type: 'high', status: 'new', pillar: 'Incident Response', description: 'Response time SLAs not defined', exposure: 420000 },
      { id: 'F-014', type: 'medium', status: 'ongoing', pillar: 'Privacy', description: 'Cross-border data flow documentation', exposure: 180000 },
    ],
    pillarScores: {
      transparency: 780, reliability: 700, security: 700, privacy: 740,
      fairness: 510, ethics: 860, accountability: 720, explainability: 750,
      human_oversight: 680, supply_chain: 680, incident_response: 670, digital_maturity: 680,
    },
    frameworkCoverage: {
      eu_ai_act: 70, nist_ai_rmf: 78, iso_42001: 68, colorado_sb205: 55,
      ca_ab2013: 65, nyc_ll144: 60, il_hb3773: 54, gdpr_ai: 78, soc2_ai: 70,
    },
    totalExposure: 13800000,
    keyHighlights: [
      'Added ClaimsProcessor ML to scope',
      'Fairness bias testing now operational',
      '1 critical finding resolved',
      'Privacy pillar improvements ongoing',
    ],
  },
  {
    id: 'A-2846',
    date: '2025-11-15',
    displayDate: 'November 15, 2025',
    overallScore: 720,
    previousScore: 695,
    scoreChange: 25,
    tier: 'Developing',
    systemsAssessed: ['DiagnosticAI Pro', 'PatientChat Assistant', 'ClaimsProcessor ML'],
    checkpointsEvaluated: 847,
    checkpointsPassed: 594,
    checkpointsFailed: 253,
    findings: [
      { id: 'F-015', type: 'high', status: 'resolved', pillar: 'Human Oversight', description: 'Human-in-the-loop implemented', exposure: 0 },
      { id: 'F-016', type: 'high', status: 'resolved', pillar: 'Incident Response', description: 'SLAs now defined', exposure: 0 },
      { id: 'F-017', type: 'medium', status: 'new', pillar: 'Digital Maturity', description: 'MLOps pipeline standardization needed', exposure: 190000 },
    ],
    pillarScores: {
      transparency: 800, reliability: 715, security: 715, privacy: 750,
      fairness: 525, ethics: 880, accountability: 730, explainability: 770,
      human_oversight: 750, supply_chain: 690, incident_response: 680, digital_maturity: 695,
    },
    frameworkCoverage: {
      eu_ai_act: 75, nist_ai_rmf: 82, iso_42001: 74, colorado_sb205: 60,
      ca_ab2013: 69, nyc_ll144: 65, il_hb3773: 57, gdpr_ai: 80, soc2_ai: 72,
    },
    totalExposure: 13200000,
    keyHighlights: [
      '2 high-priority findings resolved',
      'Human oversight significantly improved',
      'Approaching Moderate tier threshold',
      'EU AI Act coverage at 75%',
    ],
  },
  {
    id: 'A-2847',
    date: '2025-12-15',
    displayDate: 'December 15, 2025',
    overallScore: 743,
    previousScore: 720,
    scoreChange: 23,
    tier: 'Developing',
    systemsAssessed: ['DiagnosticAI Pro', 'PatientChat Assistant', 'ClaimsProcessor ML'],
    checkpointsEvaluated: 847,
    checkpointsPassed: 612,
    checkpointsFailed: 235,
    findings: [
      { id: 'F-018', type: 'critical', status: 'ongoing', pillar: 'Fairness & Bias', description: 'Demographic parity gaps in subset', exposure: 890000 },
      { id: 'F-019', type: 'high', status: 'ongoing', pillar: 'Security', description: 'Adversarial testing coverage incomplete', exposure: 420000 },
      { id: 'F-020', type: 'high', status: 'new', pillar: 'Explainability', description: 'SHAP values not documented', exposure: 180000 },
    ],
    pillarScores: {
      transparency: 812, reliability: 724, security: 623, privacy: 756,
      fairness: 534, ethics: 891, accountability: 734, explainability: 778,
      human_oversight: 765, supply_chain: 698, incident_response: 684, digital_maturity: 702,
    },
    frameworkCoverage: {
      eu_ai_act: 78, nist_ai_rmf: 84, iso_42001: 76, colorado_sb205: 62,
      ca_ab2013: 71, nyc_ll144: 68, il_hb3773: 59, gdpr_ai: 82, soc2_ai: 74,
    },
    totalExposure: 12800000,
    keyHighlights: [
      'Score improved 123 points since baseline',
      '47 checkpoints improved this cycle',
      'Near Moderate tier (7 points away)',
      'Total exposure reduced by $5.7M',
    ],
  },
];

// Helper to get assessment by ID
export function getAssessmentById(id: string): Assessment | undefined {
  return DEMO_ASSESSMENTS.find(a => a.id === id);
}

// Helper to compare two assessments
export function compareAssessments(id1: string, id2: string) {
  const a1 = getAssessmentById(id1);
  const a2 = getAssessmentById(id2);
  
  if (!a1 || !a2) return null;
  
  const pillarChanges: Record<string, number> = {};
  Object.keys(a2.pillarScores).forEach(pillar => {
    pillarChanges[pillar] = a2.pillarScores[pillar] - (a1.pillarScores[pillar] || 0);
  });
  
  return {
    scoreChange: a2.overallScore - a1.overallScore,
    exposureChange: a2.totalExposure - a1.totalExposure,
    pillarChanges,
    newFindings: a2.findings.filter(f => f.status === 'new').length,
    resolvedFindings: a2.findings.filter(f => f.status === 'resolved').length,
  };
}

// Get trend data for chart
export function getScoreTrend() {
  return DEMO_ASSESSMENTS.map(a => ({
    date: a.displayDate,
    score: a.overallScore,
    exposure: a.totalExposure,
    tier: a.tier,
  }));
}
