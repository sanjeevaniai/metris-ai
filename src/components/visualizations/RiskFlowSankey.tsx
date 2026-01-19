import { SankeyDiagram } from './SankeyDiagram';

export function RiskFlowSankey() {
  // Build nodes for risk domains, jurisdictions, and cost categories
  const nodes = [
    // Risk domains (left column)
    { id: 'risk-mgmt', name: 'Risk Management (3 gaps)', color: '#EF4444' },
    { id: 'human-oversight', name: 'Human Oversight (2 gaps)', color: '#F59E0B' },
    { id: 'bias-fairness', name: 'Bias & Fairness (2 gaps)', color: '#8B5CF6' },
    { id: 'other', name: 'Other Gaps (7 gaps)', color: '#6B7280' },
    
    // Jurisdictions (middle column)
    { id: 'eu-ai-act', name: 'EU AI Act ($3.2M)', color: '#3B82F6' },
    { id: 'gdpr', name: 'GDPR ($890K)', color: '#10B981' },
    { id: 'colorado', name: 'Colorado SB 205 ($180K)', color: '#F59E0B' },
    
    // Cost categories (right column)
    { id: 'regulatory-fines', name: 'Regulatory Fines ($2.1M)', color: '#EF4444' },
    { id: 'reputational', name: 'Reputational Damage ($1.26M)', color: '#F59E0B' },
    { id: 'operational', name: 'Operational Costs ($630K)', color: '#8B5CF6' },
    { id: 'legal', name: 'Legal/Defense ($210K)', color: '#6B7280' },
  ];

  // Risk flows through jurisdictions to costs
  const links = [
    // Risk domains to jurisdictions
    { source: 'risk-mgmt', target: 'eu-ai-act', value: 1500000 },
    { source: 'risk-mgmt', target: 'gdpr', value: 300000 },
    
    { source: 'human-oversight', target: 'eu-ai-act', value: 800000 },
    { source: 'human-oversight', target: 'colorado', value: 90000 },
    
    { source: 'bias-fairness', target: 'eu-ai-act', value: 500000 },
    { source: 'bias-fairness', target: 'colorado', value: 90000 },
    { source: 'bias-fairness', target: 'gdpr', value: 30000 },
    
    { source: 'other', target: 'eu-ai-act', value: 400000 },
    { source: 'other', target: 'gdpr', value: 460000 },
    { source: 'other', target: 'colorado', value: 30000 },
    
    // Jurisdictions to cost categories
    { source: 'eu-ai-act', target: 'regulatory-fines', value: 1600000 },
    { source: 'eu-ai-act', target: 'reputational', value: 960000 },
    { source: 'eu-ai-act', target: 'operational', value: 480000 },
    { source: 'eu-ai-act', target: 'legal', value: 160000 },
    
    { source: 'gdpr', target: 'regulatory-fines', value: 450000 },
    { source: 'gdpr', target: 'reputational', value: 270000 },
    { source: 'gdpr', target: 'operational', value: 130000 },
    { source: 'gdpr', target: 'legal', value: 40000 },
    
    { source: 'colorado', target: 'regulatory-fines', value: 50000 },
    { source: 'colorado', target: 'reputational', value: 30000 },
    { source: 'colorado', target: 'operational', value: 20000 },
    { source: 'colorado', target: 'legal', value: 10000 },
  ];

  return (
    <div className="w-full">
      <SankeyDiagram
        nodes={nodes}
        links={links}
        width={900}
        height={400}
        title="Risk Exposure Flow"
        subtitle="How governance gaps translate to financial risk"
      />
      
      <div className="flex items-center justify-between mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
        <div>
          <div className="text-sm text-muted-foreground">Total Exposure</div>
          <div className="text-3xl font-bold text-red-400">$4.2M</div>
          <div className="text-xs text-muted-foreground">VaR 95% confidence</div>
        </div>
        <div className="text-right">
          <div className="space-y-1">
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#EF4444]" />
              <span>Regulatory Fines: $2.1M</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#F59E0B]" />
              <span>Reputational: $1.26M</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#8B5CF6]" />
              <span>Operational: $630K</span>
            </div>
            <div className="flex items-center justify-end gap-2 text-sm">
              <span className="w-2 h-2 rounded-full bg-[#6B7280]" />
              <span>Legal: $210K</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
