// Framework × Pillar coverage matrix data

export interface HeatmapCell {
  frameworkId: string;
  pillarId: string;
  coverage: number; // 0-100
  checkpointsPassed: number;
  checkpointsTotal: number;
  exposure: number;
}

// Generate realistic coverage data for the heatmap
// 9 frameworks × 12 pillars = 108 cells
export const DEMO_HEATMAP_DATA: HeatmapCell[] = [
  // EU AI Act coverage
  { frameworkId: 'eu_ai_act', pillarId: 'transparency', coverage: 85, checkpointsPassed: 17, checkpointsTotal: 20, exposure: 120000 },
  { frameworkId: 'eu_ai_act', pillarId: 'reliability', coverage: 72, checkpointsPassed: 18, checkpointsTotal: 25, exposure: 280000 },
  { frameworkId: 'eu_ai_act', pillarId: 'security', coverage: 68, checkpointsPassed: 17, checkpointsTotal: 25, exposure: 420000 },
  { frameworkId: 'eu_ai_act', pillarId: 'privacy', coverage: 82, checkpointsPassed: 18, checkpointsTotal: 22, exposure: 180000 },
  { frameworkId: 'eu_ai_act', pillarId: 'fairness', coverage: 45, checkpointsPassed: 9, checkpointsTotal: 20, exposure: 890000 },
  { frameworkId: 'eu_ai_act', pillarId: 'ethics', coverage: 88, checkpointsPassed: 15, checkpointsTotal: 17, exposure: 80000 },
  { frameworkId: 'eu_ai_act', pillarId: 'accountability', coverage: 76, checkpointsPassed: 13, checkpointsTotal: 17, exposure: 210000 },
  { frameworkId: 'eu_ai_act', pillarId: 'explainability', coverage: 78, checkpointsPassed: 14, checkpointsTotal: 18, exposure: 180000 },
  { frameworkId: 'eu_ai_act', pillarId: 'human_oversight', coverage: 82, checkpointsPassed: 14, checkpointsTotal: 17, exposure: 150000 },
  { frameworkId: 'eu_ai_act', pillarId: 'supply_chain', coverage: 65, checkpointsPassed: 8, checkpointsTotal: 12, exposure: 280000 },
  { frameworkId: 'eu_ai_act', pillarId: 'incident_response', coverage: 70, checkpointsPassed: 7, checkpointsTotal: 10, exposure: 320000 },
  { frameworkId: 'eu_ai_act', pillarId: 'digital_maturity', coverage: 75, checkpointsPassed: 6, checkpointsTotal: 8, exposure: 90000 },

  // NIST AI RMF coverage
  { frameworkId: 'nist_ai_rmf', pillarId: 'transparency', coverage: 88, checkpointsPassed: 22, checkpointsTotal: 25, exposure: 80000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'reliability', coverage: 85, checkpointsPassed: 17, checkpointsTotal: 20, exposure: 180000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'security', coverage: 78, checkpointsPassed: 18, checkpointsTotal: 23, exposure: 320000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'privacy', coverage: 80, checkpointsPassed: 16, checkpointsTotal: 20, exposure: 200000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'fairness', coverage: 52, checkpointsPassed: 11, checkpointsTotal: 21, exposure: 780000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'ethics', coverage: 90, checkpointsPassed: 18, checkpointsTotal: 20, exposure: 60000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'accountability', coverage: 86, checkpointsPassed: 19, checkpointsTotal: 22, exposure: 120000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'explainability', coverage: 82, checkpointsPassed: 16, checkpointsTotal: 20, exposure: 140000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'human_oversight', coverage: 88, checkpointsPassed: 14, checkpointsTotal: 16, exposure: 100000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'supply_chain', coverage: 72, checkpointsPassed: 8, checkpointsTotal: 11, exposure: 180000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'incident_response', coverage: 85, checkpointsPassed: 11, checkpointsTotal: 13, exposure: 150000 },
  { frameworkId: 'nist_ai_rmf', pillarId: 'digital_maturity', coverage: 78, checkpointsPassed: 7, checkpointsTotal: 9, exposure: 90000 },

  // ISO 42001 coverage
  { frameworkId: 'iso_42001', pillarId: 'transparency', coverage: 80, checkpointsPassed: 12, checkpointsTotal: 15, exposure: 140000 },
  { frameworkId: 'iso_42001', pillarId: 'reliability', coverage: 75, checkpointsPassed: 12, checkpointsTotal: 16, exposure: 250000 },
  { frameworkId: 'iso_42001', pillarId: 'security', coverage: 82, checkpointsPassed: 14, checkpointsTotal: 17, exposure: 280000 },
  { frameworkId: 'iso_42001', pillarId: 'privacy', coverage: 78, checkpointsPassed: 11, checkpointsTotal: 14, exposure: 180000 },
  { frameworkId: 'iso_42001', pillarId: 'fairness', coverage: 48, checkpointsPassed: 6, checkpointsTotal: 12, exposure: 680000 },
  { frameworkId: 'iso_42001', pillarId: 'ethics', coverage: 85, checkpointsPassed: 11, checkpointsTotal: 13, exposure: 90000 },
  { frameworkId: 'iso_42001', pillarId: 'accountability', coverage: 88, checkpointsPassed: 14, checkpointsTotal: 16, exposure: 100000 },
  { frameworkId: 'iso_42001', pillarId: 'explainability', coverage: 72, checkpointsPassed: 8, checkpointsTotal: 11, exposure: 180000 },
  { frameworkId: 'iso_42001', pillarId: 'human_oversight', coverage: 76, checkpointsPassed: 8, checkpointsTotal: 11, exposure: 170000 },
  { frameworkId: 'iso_42001', pillarId: 'supply_chain', coverage: 68, checkpointsPassed: 6, checkpointsTotal: 9, exposure: 220000 },
  { frameworkId: 'iso_42001', pillarId: 'incident_response', coverage: 72, checkpointsPassed: 5, checkpointsTotal: 7, exposure: 240000 },
  { frameworkId: 'iso_42001', pillarId: 'digital_maturity', coverage: 70, checkpointsPassed: 4, checkpointsTotal: 6, exposure: 110000 },

  // Colorado SB24-205 coverage
  { frameworkId: 'colorado_sb205', pillarId: 'transparency', coverage: 70, checkpointsPassed: 7, checkpointsTotal: 10, exposure: 80000 },
  { frameworkId: 'colorado_sb205', pillarId: 'reliability', coverage: 55, checkpointsPassed: 4, checkpointsTotal: 7, exposure: 180000 },
  { frameworkId: 'colorado_sb205', pillarId: 'security', coverage: 58, checkpointsPassed: 4, checkpointsTotal: 7, exposure: 220000 },
  { frameworkId: 'colorado_sb205', pillarId: 'privacy', coverage: 72, checkpointsPassed: 5, checkpointsTotal: 7, exposure: 90000 },
  { frameworkId: 'colorado_sb205', pillarId: 'fairness', coverage: 38, checkpointsPassed: 3, checkpointsTotal: 8, exposure: 420000 },
  { frameworkId: 'colorado_sb205', pillarId: 'ethics', coverage: 75, checkpointsPassed: 3, checkpointsTotal: 4, exposure: 40000 },
  { frameworkId: 'colorado_sb205', pillarId: 'accountability', coverage: 65, checkpointsPassed: 4, checkpointsTotal: 6, exposure: 80000 },
  { frameworkId: 'colorado_sb205', pillarId: 'explainability', coverage: 60, checkpointsPassed: 3, checkpointsTotal: 5, exposure: 120000 },
  { frameworkId: 'colorado_sb205', pillarId: 'human_oversight', coverage: 55, checkpointsPassed: 2, checkpointsTotal: 4, exposure: 110000 },
  { frameworkId: 'colorado_sb205', pillarId: 'supply_chain', coverage: 50, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 80000 },
  { frameworkId: 'colorado_sb205', pillarId: 'incident_response', coverage: 60, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 90000 },
  { frameworkId: 'colorado_sb205', pillarId: 'digital_maturity', coverage: 65, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 40000 },

  // California AB 2013 coverage
  { frameworkId: 'ca_ab2013', pillarId: 'transparency', coverage: 78, checkpointsPassed: 7, checkpointsTotal: 9, exposure: 60000 },
  { frameworkId: 'ca_ab2013', pillarId: 'reliability', coverage: 68, checkpointsPassed: 5, checkpointsTotal: 7, exposure: 120000 },
  { frameworkId: 'ca_ab2013', pillarId: 'security', coverage: 72, checkpointsPassed: 4, checkpointsTotal: 6, exposure: 150000 },
  { frameworkId: 'ca_ab2013', pillarId: 'privacy', coverage: 85, checkpointsPassed: 6, checkpointsTotal: 7, exposure: 50000 },
  { frameworkId: 'ca_ab2013', pillarId: 'fairness', coverage: 42, checkpointsPassed: 2, checkpointsTotal: 5, exposure: 280000 },
  { frameworkId: 'ca_ab2013', pillarId: 'ethics', coverage: 80, checkpointsPassed: 4, checkpointsTotal: 5, exposure: 40000 },
  { frameworkId: 'ca_ab2013', pillarId: 'accountability', coverage: 72, checkpointsPassed: 3, checkpointsTotal: 4, exposure: 60000 },
  { frameworkId: 'ca_ab2013', pillarId: 'explainability', coverage: 65, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 80000 },
  { frameworkId: 'ca_ab2013', pillarId: 'human_oversight', coverage: 70, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 60000 },
  { frameworkId: 'ca_ab2013', pillarId: 'supply_chain', coverage: 55, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 70000 },
  { frameworkId: 'ca_ab2013', pillarId: 'incident_response', coverage: 65, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 80000 },
  { frameworkId: 'ca_ab2013', pillarId: 'digital_maturity', coverage: 70, checkpointsPassed: 1, checkpointsTotal: 1, exposure: 30000 },

  // NYC Local Law 144 coverage
  { frameworkId: 'nyc_ll144', pillarId: 'transparency', coverage: 72, checkpointsPassed: 5, checkpointsTotal: 7, exposure: 50000 },
  { frameworkId: 'nyc_ll144', pillarId: 'reliability', coverage: 65, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 80000 },
  { frameworkId: 'nyc_ll144', pillarId: 'security', coverage: 68, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 70000 },
  { frameworkId: 'nyc_ll144', pillarId: 'privacy', coverage: 75, checkpointsPassed: 3, checkpointsTotal: 4, exposure: 50000 },
  { frameworkId: 'nyc_ll144', pillarId: 'fairness', coverage: 55, checkpointsPassed: 3, checkpointsTotal: 5, exposure: 180000 },
  { frameworkId: 'nyc_ll144', pillarId: 'ethics', coverage: 80, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 30000 },
  { frameworkId: 'nyc_ll144', pillarId: 'accountability', coverage: 70, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 50000 },
  { frameworkId: 'nyc_ll144', pillarId: 'explainability', coverage: 62, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 60000 },
  { frameworkId: 'nyc_ll144', pillarId: 'human_oversight', coverage: 72, checkpointsPassed: 1, checkpointsTotal: 1, exposure: 40000 },
  { frameworkId: 'nyc_ll144', pillarId: 'supply_chain', coverage: 60, checkpointsPassed: 1, checkpointsTotal: 1, exposure: 40000 },
  { frameworkId: 'nyc_ll144', pillarId: 'incident_response', coverage: 65, checkpointsPassed: 1, checkpointsTotal: 1, exposure: 50000 },
  { frameworkId: 'nyc_ll144', pillarId: 'digital_maturity', coverage: 70, checkpointsPassed: 1, checkpointsTotal: 1, exposure: 20000 },

  // Illinois HB 3773 coverage
  { frameworkId: 'il_hb3773', pillarId: 'transparency', coverage: 65, checkpointsPassed: 4, checkpointsTotal: 6, exposure: 70000 },
  { frameworkId: 'il_hb3773', pillarId: 'reliability', coverage: 52, checkpointsPassed: 3, checkpointsTotal: 6, exposure: 120000 },
  { frameworkId: 'il_hb3773', pillarId: 'security', coverage: 55, checkpointsPassed: 3, checkpointsTotal: 5, exposure: 150000 },
  { frameworkId: 'il_hb3773', pillarId: 'privacy', coverage: 68, checkpointsPassed: 4, checkpointsTotal: 6, exposure: 80000 },
  { frameworkId: 'il_hb3773', pillarId: 'fairness', coverage: 35, checkpointsPassed: 2, checkpointsTotal: 6, exposure: 320000 },
  { frameworkId: 'il_hb3773', pillarId: 'ethics', coverage: 72, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 40000 },
  { frameworkId: 'il_hb3773', pillarId: 'accountability', coverage: 58, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 70000 },
  { frameworkId: 'il_hb3773', pillarId: 'explainability', coverage: 55, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 80000 },
  { frameworkId: 'il_hb3773', pillarId: 'human_oversight', coverage: 60, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 60000 },
  { frameworkId: 'il_hb3773', pillarId: 'supply_chain', coverage: 48, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 70000 },
  { frameworkId: 'il_hb3773', pillarId: 'incident_response', coverage: 55, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 80000 },
  { frameworkId: 'il_hb3773', pillarId: 'digital_maturity', coverage: 60, checkpointsPassed: 1, checkpointsTotal: 1, exposure: 30000 },

  // GDPR AI Provisions coverage
  { frameworkId: 'gdpr_ai', pillarId: 'transparency', coverage: 88, checkpointsPassed: 7, checkpointsTotal: 8, exposure: 40000 },
  { frameworkId: 'gdpr_ai', pillarId: 'reliability', coverage: 78, checkpointsPassed: 4, checkpointsTotal: 5, exposure: 80000 },
  { frameworkId: 'gdpr_ai', pillarId: 'security', coverage: 85, checkpointsPassed: 6, checkpointsTotal: 7, exposure: 100000 },
  { frameworkId: 'gdpr_ai', pillarId: 'privacy', coverage: 92, checkpointsPassed: 11, checkpointsTotal: 12, exposure: 50000 },
  { frameworkId: 'gdpr_ai', pillarId: 'fairness', coverage: 58, checkpointsPassed: 3, checkpointsTotal: 5, exposure: 180000 },
  { frameworkId: 'gdpr_ai', pillarId: 'ethics', coverage: 85, checkpointsPassed: 3, checkpointsTotal: 4, exposure: 40000 },
  { frameworkId: 'gdpr_ai', pillarId: 'accountability', coverage: 82, checkpointsPassed: 4, checkpointsTotal: 5, exposure: 60000 },
  { frameworkId: 'gdpr_ai', pillarId: 'explainability', coverage: 78, checkpointsPassed: 3, checkpointsTotal: 4, exposure: 70000 },
  { frameworkId: 'gdpr_ai', pillarId: 'human_oversight', coverage: 80, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 50000 },
  { frameworkId: 'gdpr_ai', pillarId: 'supply_chain', coverage: 70, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 60000 },
  { frameworkId: 'gdpr_ai', pillarId: 'incident_response', coverage: 75, checkpointsPassed: 2, checkpointsTotal: 2, exposure: 70000 },
  { frameworkId: 'gdpr_ai', pillarId: 'digital_maturity', coverage: 72, checkpointsPassed: 1, checkpointsTotal: 1, exposure: 30000 },

  // SOC 2 AI Controls coverage
  { frameworkId: 'soc2_ai', pillarId: 'transparency', coverage: 75, checkpointsPassed: 6, checkpointsTotal: 8, exposure: 80000 },
  { frameworkId: 'soc2_ai', pillarId: 'reliability', coverage: 82, checkpointsPassed: 9, checkpointsTotal: 11, exposure: 120000 },
  { frameworkId: 'soc2_ai', pillarId: 'security', coverage: 88, checkpointsPassed: 14, checkpointsTotal: 16, exposure: 140000 },
  { frameworkId: 'soc2_ai', pillarId: 'privacy', coverage: 78, checkpointsPassed: 7, checkpointsTotal: 9, exposure: 100000 },
  { frameworkId: 'soc2_ai', pillarId: 'fairness', coverage: 48, checkpointsPassed: 2, checkpointsTotal: 4, exposure: 220000 },
  { frameworkId: 'soc2_ai', pillarId: 'ethics', coverage: 72, checkpointsPassed: 3, checkpointsTotal: 4, exposure: 60000 },
  { frameworkId: 'soc2_ai', pillarId: 'accountability', coverage: 80, checkpointsPassed: 4, checkpointsTotal: 5, exposure: 70000 },
  { frameworkId: 'soc2_ai', pillarId: 'explainability', coverage: 68, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 80000 },
  { frameworkId: 'soc2_ai', pillarId: 'human_oversight', coverage: 72, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 60000 },
  { frameworkId: 'soc2_ai', pillarId: 'supply_chain', coverage: 65, checkpointsPassed: 2, checkpointsTotal: 3, exposure: 80000 },
  { frameworkId: 'soc2_ai', pillarId: 'incident_response', coverage: 78, checkpointsPassed: 3, checkpointsTotal: 4, exposure: 90000 },
  { frameworkId: 'soc2_ai', pillarId: 'digital_maturity', coverage: 70, checkpointsPassed: 1, checkpointsTotal: 2, exposure: 40000 },
];

// Helper to get cell data
export function getHeatmapCell(frameworkId: string, pillarId: string): HeatmapCell | undefined {
  return DEMO_HEATMAP_DATA.find(
    cell => cell.frameworkId === frameworkId && cell.pillarId === pillarId
  );
}

// Helper to get coverage color
export function getCoverageColor(coverage: number): string {
  if (coverage >= 85) return 'hsl(var(--status-good))';
  if (coverage >= 65) return 'hsl(142, 71%, 45%)'; // Yellow-green
  if (coverage >= 45) return 'hsl(var(--status-warning))';
  return 'hsl(var(--status-critical))';
}

// Get aggregated stats for a framework
export function getFrameworkStats(frameworkId: string): {
  avgCoverage: number;
  totalExposure: number;
  lowestPillar: string;
} {
  const cells = DEMO_HEATMAP_DATA.filter(c => c.frameworkId === frameworkId);
  const avgCoverage = cells.reduce((sum, c) => sum + c.coverage, 0) / cells.length;
  const totalExposure = cells.reduce((sum, c) => sum + c.exposure, 0);
  const lowestCell = cells.reduce((min, c) => c.coverage < min.coverage ? c : min, cells[0]);
  
  return { avgCoverage, totalExposure, lowestPillar: lowestCell?.pillarId || '' };
}

// Get aggregated stats for a pillar
export function getPillarStats(pillarId: string): {
  avgCoverage: number;
  totalExposure: number;
  lowestFramework: string;
} {
  const cells = DEMO_HEATMAP_DATA.filter(c => c.pillarId === pillarId);
  const avgCoverage = cells.reduce((sum, c) => sum + c.coverage, 0) / cells.length;
  const totalExposure = cells.reduce((sum, c) => sum + c.exposure, 0);
  const lowestCell = cells.reduce((min, c) => c.coverage < min.coverage ? c : min, cells[0]);
  
  return { avgCoverage, totalExposure, lowestFramework: lowestCell?.frameworkId || '' };
}
