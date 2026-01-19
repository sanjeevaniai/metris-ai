// Demo Verification Data - Hardcoded for Public Verification Demo

export interface VerifiedOrganization {
  ein: string;
  name: string;
  industry: string;
  jurisdictions: { code: string; name: string; flag: string }[];
  verifiedSince: string;
  totalAssessments: number;
  currentScore: {
    value: number;
    confidence: number;
    status: string;
    statusLabel: string;
    lastAssessment: string;
    validUntil: string;
    confidenceLevel: number;
  };
  scoreHistory: {
    date: string;
    score: number;
    confidence: number;
    change?: number;
    label?: string;
  }[];
  frameworks: {
    name: string;
    icon: string;
    score: number;
    status: 'pass' | 'gaps' | 'fail';
    deadline?: string;
  }[];
  financialRisk: {
    rangeMin: string;
    rangeMax: string;
    expectedLoss: string;
    var95: string;
  };
  verification: {
    assessmentId: string;
    issued: string;
    hashAlgorithm: string;
    documentHash: string;
    hashMatches: boolean;
    timestampVerified: boolean;
    noModifications: boolean;
  };
  gaps?: {
    major: { count: number; impact: string };
    minor: { count: number; impact: string };
    ofi: { count: number; impact: string };
  };
  majorGaps?: {
    id: string;
    checkpoint: string;
    title: string;
    framework: string;
    finding: string;
    evidenceGap: string;
    remediation: string;
    riskImpact: string;
  }[];
  evidenceInventory?: {
    source: string;
    type: string;
    checkpoints: number;
    coverage: string;
  }[];
}

export const DEMO_ORGANIZATIONS: Record<string, VerifiedOrganization> = {
  "84-2847591": {
    ein: "84-2847591",
    name: "Meridian Health Systems",
    industry: "Healthcare Technology",
    jurisdictions: [
      { code: "US", name: "United States", flag: "🇺🇸" },
      { code: "EU", name: "European Union", flag: "🇪🇺" },
    ],
    verifiedSince: "March 15, 2024",
    totalAssessments: 4,
    currentScore: {
      value: 687,
      confidence: 34,
      status: "conditional",
      statusLabel: "CONDITIONAL PASS",
      lastAssessment: "January 16, 2026",
      validUntil: "April 16, 2026",
      confidenceLevel: 87,
    },
    scoreHistory: [
      { date: "Jan 16, 2026", score: 687, confidence: 34, label: "Current" },
      { date: "Oct 12, 2025", score: 712, confidence: 31, change: -25 },
      { date: "Jul 08, 2025", score: 756, confidence: 28, change: -44 },
      { date: "Mar 15, 2025", score: 743, confidence: 33, label: "Initial Assessment" },
    ],
    frameworks: [
      { name: "EU AI Act", icon: "🇪🇺", score: 621, status: "gaps", deadline: "Aug 2, 2026" },
      { name: "ISO 42001", icon: "📋", score: 734, status: "gaps" },
      { name: "NIST AI RMF", icon: "🇺🇸", score: 712, status: "gaps" },
      { name: "GDPR (AI)", icon: "🔒", score: 856, status: "pass" },
      { name: "HIPAA (AI)", icon: "🏥", score: 798, status: "pass" },
    ],
    financialRisk: {
      rangeMin: "$1.8M",
      rangeMax: "$9.2M",
      expectedLoss: "$2.1M",
      var95: "$4.2M",
    },
    verification: {
      assessmentId: "MTR-2026-0847",
      issued: "January 16, 2026 at 14:32:17 UTC",
      hashAlgorithm: "SHA-256",
      documentHash: "a7f3b2c9d8e4f1a0b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8",
      hashMatches: true,
      timestampVerified: true,
      noModifications: true,
    },
    gaps: {
      major: { count: 6, impact: "$2.8M" },
      minor: { count: 14, impact: "$890K" },
      ofi: { count: 8, impact: "$210K" },
    },
    majorGaps: [
      {
        id: "1",
        checkpoint: "CP-0892",
        title: "Quantitative Risk Scoring",
        framework: "EU AI Act Art. 9, ISO 42001 6.1.2",
        finding: "No numerical risk scoring methodology found",
        evidenceGap: "Missing risk scoring matrix with probability values",
        remediation: "Implement quantitative risk framework",
        riskImpact: "$1.2M",
      },
      {
        id: "2",
        checkpoint: "CP-0456",
        title: "Human Oversight Documentation",
        framework: "EU AI Act Art. 14, ISO 42001 8.4",
        finding: "Insufficient human-in-the-loop procedures",
        evidenceGap: "No documented override procedures",
        remediation: "Document human oversight workflows",
        riskImpact: "$890K",
      },
      {
        id: "3",
        checkpoint: "CP-0234",
        title: "Risk Appetite Statement",
        framework: "ISO 42001 5.2, NIST AI RMF Govern",
        finding: "No formal risk appetite documentation",
        evidenceGap: "Missing board-approved risk tolerance",
        remediation: "Establish and publish risk appetite statement",
        riskImpact: "$650K",
      },
      {
        id: "4",
        checkpoint: "CP-0567",
        title: "AI System Inventory",
        framework: "EU AI Act Art. 6, ISO 42001 4.3",
        finding: "Incomplete AI system classification",
        evidenceGap: "Missing risk level assignments",
        remediation: "Create comprehensive AI inventory",
        riskImpact: "$580K",
      },
      {
        id: "5",
        checkpoint: "CP-0789",
        title: "Incident Response Procedures",
        framework: "ISO 42001 10.2, NIST AI RMF Manage",
        finding: "No AI-specific incident response plan",
        evidenceGap: "Missing escalation procedures",
        remediation: "Develop AI incident response procedures",
        riskImpact: "$420K",
      },
      {
        id: "6",
        checkpoint: "CP-0345",
        title: "Bias Testing Framework",
        framework: "EU AI Act Art. 10, ISO 42001 6.2",
        finding: "Insufficient fairness testing evidence",
        evidenceGap: "No documented bias metrics",
        remediation: "Implement bias testing for ML models",
        riskImpact: "$380K",
      },
    ],
    evidenceInventory: [
      { source: "AI_Governance_Policy.pdf", type: "Document", checkpoints: 156, coverage: "89%" },
      { source: "Risk_Assessment_2024.pdf", type: "Document", checkpoints: 98, coverage: "72%" },
      { source: "Ethics_Guidelines.docx", type: "Document", checkpoints: 45, coverage: "95%" },
      { source: "Training_Records.xlsx", type: "Data", checkpoints: 34, coverage: "100%" },
      { source: "https://meridian.com/ai-principles", type: "Website", checkpoints: 28, coverage: "85%" },
      { source: "github.com/meridian/ml-platform", type: "Repository", checkpoints: 67, coverage: "78%" },
    ],
  },
  "12-3456789": {
    ein: "12-3456789",
    name: "ACME Corporation",
    industry: "Financial Services",
    jurisdictions: [
      { code: "US", name: "United States", flag: "🇺🇸" },
      { code: "UK", name: "United Kingdom", flag: "🇬🇧" },
    ],
    verifiedSince: "June 20, 2024",
    totalAssessments: 3,
    currentScore: {
      value: 812,
      confidence: 28,
      status: "pass",
      statusLabel: "PASS",
      lastAssessment: "January 10, 2026",
      validUntil: "April 10, 2026",
      confidenceLevel: 92,
    },
    scoreHistory: [
      { date: "Jan 10, 2026", score: 812, confidence: 28, label: "Current" },
      { date: "Sep 15, 2025", score: 778, confidence: 32, change: 34 },
      { date: "Jun 20, 2025", score: 734, confidence: 35, label: "Initial Assessment" },
    ],
    frameworks: [
      { name: "EU AI Act", icon: "🇪🇺", score: 798, status: "pass", deadline: "Aug 2, 2026" },
      { name: "ISO 42001", icon: "📋", score: 834, status: "pass" },
      { name: "NIST AI RMF", icon: "🇺🇸", score: 821, status: "pass" },
      { name: "GDPR (AI)", icon: "🔒", score: 892, status: "pass" },
      { name: "SOC 2 (AI)", icon: "🔐", score: 856, status: "pass" },
    ],
    financialRisk: {
      rangeMin: "$420K",
      rangeMax: "$2.1M",
      expectedLoss: "$680K",
      var95: "$1.4M",
    },
    verification: {
      assessmentId: "MTR-2026-0612",
      issued: "January 10, 2026 at 09:15:42 UTC",
      hashAlgorithm: "SHA-256",
      documentHash: "b8c4d3e2f1a0c9b8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f7a6b5c4",
      hashMatches: true,
      timestampVerified: true,
      noModifications: true,
    },
    gaps: {
      major: { count: 0, impact: "$0" },
      minor: { count: 4, impact: "$280K" },
      ofi: { count: 6, impact: "$120K" },
    },
    majorGaps: [],
    evidenceInventory: [
      { source: "AI_Policy_Framework.pdf", type: "Document", checkpoints: 189, coverage: "94%" },
      { source: "Risk_Management_System.pdf", type: "Document", checkpoints: 112, coverage: "88%" },
      { source: "Compliance_Records.xlsx", type: "Data", checkpoints: 67, coverage: "100%" },
      { source: "https://acme.com/ai-governance", type: "Website", checkpoints: 45, coverage: "91%" },
    ],
  },
};

export const VALID_AUDITOR_CODES: Record<string, { ein: string; validUntil: string; issuedTo: string }> = {
  "MERIDIAN-2026-GAMMA": {
    ein: "84-2847591",
    validUntil: "February 15, 2026",
    issuedTo: "External Audit",
  },
  "ACME-2026-ALPHA": {
    ein: "12-3456789",
    validUntil: "February 10, 2026",
    issuedTo: "Board Review",
  },
};

export function validateEIN(ein: string): boolean {
  // Format: XX-XXXXXXX (2 digits, dash, 7 digits)
  const einRegex = /^\d{2}-\d{7}$/;
  return einRegex.test(ein);
}

export function formatEIN(part1: string, part2: string): string {
  return `${part1}-${part2}`;
}

export function lookupOrganization(ein: string): VerifiedOrganization | null {
  return DEMO_ORGANIZATIONS[ein] || null;
}

export function validateAuditorCode(code: string): { valid: boolean; ein?: string; validUntil?: string; issuedTo?: string } {
  const auditorInfo = VALID_AUDITOR_CODES[code.toUpperCase()];
  if (auditorInfo) {
    return { valid: true, ...auditorInfo };
  }
  return { valid: false };
}
