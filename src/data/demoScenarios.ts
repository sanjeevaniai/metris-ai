// What-If Scenarios - Hardcoded for Enterprise Demo
export interface Scenario {
  id: string;
  name: string;
  description: string;
  inputs: {
    checkpointsToFix: string[] | number;
  };
  projectedOutcomes: {
    scoreChange: { from: number; to: number; delta: number };
    exposureChange: { from: number; to: number; delta: number };
    var95Change?: { from: number; to: number; delta: number };
    auditProbabilityChange?: { from: number; to: number; delta: number };
    frameworkCoverage?: { from: number; to: number; delta: number };
    securityScoreChange?: { from: number; to: number; delta: number };
  };
  implementation: {
    cost: number;
    time: string;
    roi: number;
  };
}

export const DEMO_SCENARIOS: Scenario[] = [
  {
    id: "scenario_quickwins",
    name: "Fix Top 5 Quick Wins",
    description: "Implement the 5 highest-ROI remediation items",
    inputs: {
      checkpointsToFix: ["CP-0024", "CP-0025", "CP-0056", "CP-0029", "CP-0034"],
    },
    projectedOutcomes: {
      scoreChange: { from: 743, to: 821, delta: 78 },
      exposureChange: { from: 847293, to: 451293, delta: -396000 },
      var95Change: { from: 2145000, to: 1423000, delta: -722000 },
      auditProbabilityChange: { from: 0.42, to: 0.28, delta: -0.14 },
    },
    implementation: { cost: 28500, time: "3 weeks", roi: 13.9 },
  },
  {
    id: "scenario_eu_compliance",
    name: "EU AI Act Full Compliance",
    description: "Close all EU AI Act gaps before August 2026 deadline",
    inputs: { checkpointsToFix: 44 },
    projectedOutcomes: {
      scoreChange: { from: 743, to: 872, delta: 129 },
      exposureChange: { from: 847293, to: 324293, delta: -523000 },
      frameworkCoverage: { from: 0.78, to: 1.0, delta: 0.22 },
    },
    implementation: { cost: 125000, time: "12 weeks", roi: 4.2 },
  },
  {
    id: "scenario_security_hardening",
    name: "Security Hardening",
    description: "Address all critical and high security findings",
    inputs: { checkpointsToFix: 36 },
    projectedOutcomes: {
      scoreChange: { from: 743, to: 798, delta: 55 },
      securityScoreChange: { from: 623, to: 845, delta: 222 },
      exposureChange: { from: 847293, to: 547293, delta: -300000 },
    },
    implementation: { cost: 95000, time: "8 weeks", roi: 3.2 },
  },
];
