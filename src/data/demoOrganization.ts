// Demo Organization Data - Hardcoded for Enterprise Demo
export const DEMO_ORG = {
  id: "org_demo_001",
  name: "Meridian Health Systems",
  ein: "84-2847591",
  industry: "Healthcare",
  jurisdictions: ["US", "EU"],
  usStates: ["Colorado", "California", "New York", "Illinois"],
  euCountries: ["Germany", "France", "Netherlands"],
};

export const DEMO_AI_SYSTEMS = [
  { id: "sys_001", name: "DiagnosticAI Pro", type: "Classification Model", riskLevel: "High-Risk", status: "Production", lastAssessment: "2026-01-15", score: 743 },
  { id: "sys_002", name: "PatientChat Assistant", type: "Generative AI / LLM", riskLevel: "High-Risk", status: "Production", lastAssessment: "2026-01-14", score: 687 },
  { id: "sys_003", name: "ClaimsProcessor ML", type: "Classification Model", riskLevel: "Limited Risk", status: "Production", lastAssessment: "2026-01-10", score: 812 },
];
