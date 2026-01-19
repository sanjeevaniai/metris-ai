import { SankeyDiagram } from './SankeyDiagram';
import { AGENT_COLORS } from '@/data/agentVisualization';

export function EvidenceFlowSankey() {
  // Build nodes for evidence sources, agents, and findings
  const nodes = [
    // Evidence sources (left column)
    { id: 'doc-policy', name: 'AI_Policy.pdf', color: '#3B82F6' },
    { id: 'doc-risk', name: 'Risk_Assessment.pdf', color: '#3B82F6' },
    { id: 'github', name: 'github.com/acme/ml', color: '#6B7280' },
    { id: 'doc-training', name: 'Training_Records.xlsx', color: '#10B981' },
    { id: 'datadog', name: 'Datadog Metrics', color: '#8B5CF6' },
    
    // Agents (middle column)
    { id: 'agent-policy', name: 'Agent_Policy', color: AGENT_COLORS['Agent_Policy'] },
    { id: 'agent-risk', name: 'Agent_Risk', color: AGENT_COLORS['Agent_Risk'] },
    { id: 'agent-data', name: 'Agent_Data', color: AGENT_COLORS['Agent_Data'] },
    { id: 'agent-model', name: 'Agent_Model', color: AGENT_COLORS['Agent_Model'] },
    { id: 'agent-bias', name: 'Agent_Bias', color: AGENT_COLORS['Agent_Bias'] },
    { id: 'agent-security', name: 'Agent_Security', color: AGENT_COLORS['Agent_Security'] },
    { id: 'agent-synthesis', name: 'Agent_Synthesis', color: AGENT_COLORS['Agent_Synthesis'] },
    
    // Findings (right column)
    { id: 'conforming', name: 'Conforming (1,887)', color: '#10B981' },
    { id: 'major-gaps', name: 'Major Gaps (6)', color: '#EF4444' },
    { id: 'minor-gaps', name: 'Minor Gaps (14)', color: '#F59E0B' },
    { id: 'ofi', name: 'OFI (8)', color: '#3B82F6' },
  ];

  // Evidence flows to agents
  const links = [
    // Policy docs flow
    { source: 'doc-policy', target: 'agent-policy', value: 800000 },
    { source: 'doc-policy', target: 'agent-risk', value: 400000 },
    
    // Risk docs flow
    { source: 'doc-risk', target: 'agent-risk', value: 600000 },
    { source: 'doc-risk', target: 'agent-data', value: 300000 },
    
    // GitHub flow
    { source: 'github', target: 'agent-model', value: 700000 },
    { source: 'github', target: 'agent-security', value: 500000 },
    { source: 'github', target: 'agent-bias', value: 400000 },
    
    // Training docs flow
    { source: 'doc-training', target: 'agent-policy', value: 200000 },
    { source: 'doc-training', target: 'agent-data', value: 300000 },
    
    // Datadog flow
    { source: 'datadog', target: 'agent-security', value: 400000 },
    { source: 'datadog', target: 'agent-model', value: 300000 },
    
    // Agents to findings (all flow to synthesis first)
    { source: 'agent-policy', target: 'agent-synthesis', value: 1000000 },
    { source: 'agent-risk', target: 'agent-synthesis', value: 1000000 },
    { source: 'agent-data', target: 'agent-synthesis', value: 600000 },
    { source: 'agent-model', target: 'agent-synthesis', value: 1000000 },
    { source: 'agent-bias', target: 'agent-synthesis', value: 400000 },
    { source: 'agent-security', target: 'agent-synthesis', value: 900000 },
    
    // Synthesis to findings
    { source: 'agent-synthesis', target: 'conforming', value: 3800000 },
    { source: 'agent-synthesis', target: 'major-gaps', value: 600000 },
    { source: 'agent-synthesis', target: 'minor-gaps', value: 400000 },
    { source: 'agent-synthesis', target: 'ofi', value: 100000 },
  ];

  return (
    <div className="w-full">
      <SankeyDiagram
        nodes={nodes}
        links={links}
        width={900}
        height={450}
        title="Evidence Flow Analysis"
        subtitle="How your evidence was analyzed across agents"
      />
      
      <div className="grid grid-cols-3 gap-4 mt-6 text-xs">
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="font-semibold mb-1 text-muted-foreground">EVIDENCE SOURCES</div>
          <div className="text-foreground">5 sources ingested</div>
          <div className="text-muted-foreground">Documents, GitHub, Metrics</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="font-semibold mb-1 text-muted-foreground">AGENTS PROCESSING</div>
          <div className="text-foreground">25 specialized agents</div>
          <div className="text-muted-foreground">1,915 checkpoints evaluated</div>
        </div>
        <div className="p-3 bg-muted/30 rounded-lg">
          <div className="font-semibold mb-1 text-muted-foreground">FINDINGS OUTPUT</div>
          <div className="text-foreground">1,915 checkpoint results</div>
          <div className="text-muted-foreground">METRIS Score: 687</div>
        </div>
      </div>
    </div>
  );
}
