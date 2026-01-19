// Agent colors for the visualization suite (25 distinct colors)
export const AGENT_COLORS: Record<string, string> = {
  // Tier 1 - Foundation (Blues)
  'Agent_Policy': '#3B82F6',    // Blue
  'Agent_Risk': '#1D4ED8',      // Dark Blue
  'Agent_Data': '#60A5FA',      // Light Blue
  
  // Tier 2 - Technical (Greens)
  'Agent_AIMS': '#10B981',      // Emerald
  'Agent_Ethics': '#059669',    // Green
  'Agent_Human': '#34D399',     // Light Green
  'Agent_Model': '#6EE7B7',     // Mint
  
  // Tier 3 - Compliance (Purples)
  'Agent_Trans': '#8B5CF6',     // Purple
  'Agent_Bias': '#7C3AED',      // Violet
  'Agent_Privacy': '#A78BFA',   // Light Purple
  'Agent_Security': '#C4B5FD',  // Lavender
  
  // Tier 4 - Operations (Oranges)
  'Agent_Monitor': '#F59E0B',   // Amber
  'Agent_Incident': '#D97706',  // Orange
  'Agent_Training': '#FBBF24',  // Yellow
  'Agent_Audit': '#FCD34D',     // Light Yellow
  
  // Tier 5 - External (Pinks/Reds)
  'Agent_Supply': '#EC4899',    // Pink
  'Agent_Deploy': '#DB2777',    // Dark Pink
  'Agent_Change': '#F472B6',    // Light Pink
  'Agent_Legal': '#FB7185',     // Rose
  
  // Tier 6 - Analysis (Teals)
  'Agent_Industry': '#14B8A6',  // Teal
  'Agent_Rigor': '#0D9488',     // Dark Teal
  'Agent_StatSig': '#2DD4BF',   // Light Teal
  'Agent_Prognosis': '#5EEAD4', // Cyan
  
  // Tier 7 - Synthesis (Gold)
  'Agent_Context': '#EAB308',   // Gold
  'Agent_Synthesis': '#CA8A04', // Dark Gold
};

// Map agent IDs to their positions on the bubble chart
export const AGENT_POSITIONS: Record<string, { x: number; y: number }> = {
  // Foundation agents - lower complexity, moderate risk
  'policy': { x: 2, y: 0.8 },
  'risk': { x: 3, y: 2.5 },
  'data': { x: 4, y: 1.8 },
  
  // Technical agents - higher complexity
  'aims': { x: 5, y: 1.2 },
  'ethics': { x: 3, y: 1.5 },
  'human': { x: 4, y: 2.2 },
  'model': { x: 6, y: 1.4 },
  
  // Compliance agents - high risk exposure
  'trans': { x: 5, y: 2.8 },
  'bias': { x: 6, y: 3.5 },
  'privacy': { x: 7, y: 2.5 },
  'security': { x: 8, y: 2.0 },
  
  // Operations agents - moderate complexity
  'monitor': { x: 7, y: 1.6 },
  'incident': { x: 6, y: 2.0 },
  'training': { x: 4, y: 0.9 },
  'audit': { x: 5, y: 1.0 },
  
  // External agents - varied exposure
  'supply': { x: 7, y: 3.0 },
  'deploy': { x: 8, y: 1.2 },
  'change': { x: 6, y: 0.8 },
  'legal': { x: 9, y: 3.8 },
  
  // Analysis agents - high complexity
  'industry': { x: 8, y: 1.5 },
  'rigor': { x: 9, y: 0.6 },
  'statsig': { x: 9, y: 1.0 },
  'prognosis': { x: 8, y: 2.5 },
  
  // Synthesis - final processing
  'context': { x: 10, y: 1.8 },
  'synthesis': { x: 10, y: 2.2 },
};

// Evidence flow data for Sankey diagram
export interface SankeyNode {
  id: string;
  name: string;
  value: number;
  color: string;
  category: 'evidence' | 'agent' | 'finding';
}

export interface SankeyLink {
  source: string;
  target: string;
  value: number;
}

export const EVIDENCE_SOURCES = [
  { id: 'doc-policy', name: 'AI_Policy.pdf', category: 'evidence' as const, color: '#3B82F6' },
  { id: 'doc-risk', name: 'Risk_Assessment.pdf', category: 'evidence' as const, color: '#3B82F6' },
  { id: 'github', name: 'github.com/acme/ml', category: 'evidence' as const, color: '#6B7280' },
  { id: 'doc-training', name: 'Training_Records.xlsx', category: 'evidence' as const, color: '#10B981' },
  { id: 'datadog', name: 'Datadog Metrics', category: 'evidence' as const, color: '#8B5CF6' },
];

export const FINDING_CATEGORIES = [
  { id: 'conforming', name: 'Conforming', count: 1887, color: '#10B981' },
  { id: 'major-gaps', name: 'Major Gaps', count: 6, color: '#EF4444' },
  { id: 'minor-gaps', name: 'Minor Gaps', count: 14, color: '#F59E0B' },
  { id: 'ofi', name: 'OFI', count: 8, color: '#3B82F6' },
];

// Risk flow data for second Sankey
export const RISK_DOMAINS = [
  { id: 'risk-mgmt', name: 'Risk Management', gaps: 3, exposure: 1800000, color: '#EF4444' },
  { id: 'human-oversight', name: 'Human Oversight', gaps: 2, exposure: 890000, color: '#F59E0B' },
  { id: 'bias-fairness', name: 'Bias & Fairness', gaps: 2, exposure: 620000, color: '#8B5CF6' },
  { id: 'other', name: 'Other Gaps', gaps: 7, exposure: 890000, color: '#6B7280' },
];

export const JURISDICTIONS = [
  { id: 'eu-ai-act', name: 'EU AI Act', exposure: 3200000, color: '#3B82F6' },
  { id: 'gdpr', name: 'GDPR', exposure: 890000, color: '#10B981' },
  { id: 'colorado', name: 'Colorado SB 205', exposure: 180000, color: '#F59E0B' },
];

export const COST_CATEGORIES = [
  { id: 'regulatory-fines', name: 'Regulatory Fines', amount: 2100000, color: '#EF4444' },
  { id: 'reputational', name: 'Reputational Damage', amount: 1260000, color: '#F59E0B' },
  { id: 'operational', name: 'Operational Costs', amount: 630000, color: '#8B5CF6' },
  { id: 'legal', name: 'Legal/Defense', amount: 210000, color: '#6B7280' },
];

// Remediation ROI flow data
export const INVESTMENT_PHASES = [
  { id: 'week1-2', name: 'Week 1-2', cost: 15000, color: '#10B981' },
  { id: 'week3-4', name: 'Week 3-4', cost: 18000, color: '#3B82F6' },
  { id: 'month2', name: 'Month 2', cost: 12000, color: '#8B5CF6' },
];

export const FIX_PRIORITIES = [
  { id: 'risk-scoring', name: 'Risk Scoring', points: 45, exposure: 1200000, color: '#EF4444' },
  { id: 'human-oversight', name: 'Human Oversight', points: 38, exposure: 890000, color: '#F59E0B' },
  { id: 'bias-testing', name: 'Bias Testing', points: 35, exposure: 420000, color: '#8B5CF6' },
  { id: 'minor-gaps', name: 'Minor Gaps', points: 52, exposure: 340000, color: '#3B82F6' },
  { id: 'ofis', name: 'OFIs', points: 33, exposure: 190000, color: '#6B7280' },
];

export const OUTCOMES = [
  { id: 'points', name: '+203 Points', color: '#10B981' },
  { id: 'risk-reduction', name: '$2.8M Risk Reduction', color: '#3B82F6' },
  { id: 'strong-tier', name: 'Strong Tier (750+)', color: '#8B5CF6' },
  { id: 'eu-ready', name: 'EU AI Act Ready', color: '#F59E0B' },
];

// Agent bubble state interface
export interface AgentBubble {
  id: string;
  name: string;
  displayName: string;
  color: string;
  x: number;
  y: number;
  checkpointCount: number;
  baseRadius: number;
  status: 'queued' | 'active' | 'complete';
  progress: number;
  evaluated: number;
  gapsFound: number;
  exposure: number;
  currentCheckpoint?: string;
}

// Helper to get exposure amount for an agent based on gaps
export function getAgentExposure(gapsFound: number): number {
  // Rough estimate: each gap averages $100-200K in exposure
  const avgExposurePerGap = 150000;
  return gapsFound * avgExposurePerGap;
}

// Helper to calculate bubble radius based on checkpoint count
export function getBubbleRadius(checkpoints: number): number {
  // Min radius 20, max 60, scaled logarithmically
  const minRadius = 15;
  const maxRadius = 45;
  const scale = Math.log(checkpoints + 1) / Math.log(100);
  return minRadius + scale * (maxRadius - minRadius);
}
