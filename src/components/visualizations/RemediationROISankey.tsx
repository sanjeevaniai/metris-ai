import { SankeyDiagram } from './SankeyDiagram';

export function RemediationROISankey() {
  // Build nodes for investment, fixes, and outcomes
  const nodes = [
    // Investment phases (left column)
    { id: 'week1-2', name: 'Week 1-2 ($15K)', color: '#10B981' },
    { id: 'week3-4', name: 'Week 3-4 ($18K)', color: '#3B82F6' },
    { id: 'month2', name: 'Month 2 ($12K)', color: '#8B5CF6' },
    
    // Fix priorities (middle column)
    { id: 'risk-scoring', name: 'Risk Scoring (+45 pts)', color: '#EF4444' },
    { id: 'human-oversight', name: 'Human Oversight (+38 pts)', color: '#F59E0B' },
    { id: 'bias-testing', name: 'Bias Testing (+35 pts)', color: '#8B5CF6' },
    { id: 'minor-gaps', name: 'Minor Gaps (+52 pts)', color: '#3B82F6' },
    { id: 'ofis', name: 'OFIs (+33 pts)', color: '#6B7280' },
    
    // Outcomes (right column)
    { id: 'points', name: '+203 Points', color: '#10B981' },
    { id: 'risk-reduction', name: '$2.8M Risk Reduction', color: '#3B82F6' },
    { id: 'strong-tier', name: 'Strong Tier (750+)', color: '#8B5CF6' },
    { id: 'eu-ready', name: 'EU AI Act Ready', color: '#F59E0B' },
  ];

  // Investment flows through fixes to outcomes
  const links = [
    // Investment to fixes
    { source: 'week1-2', target: 'risk-scoring', value: 10000 },
    { source: 'week1-2', target: 'human-oversight', value: 5000 },
    
    { source: 'week3-4', target: 'human-oversight', value: 8000 },
    { source: 'week3-4', target: 'bias-testing', value: 10000 },
    
    { source: 'month2', target: 'minor-gaps', value: 8000 },
    { source: 'month2', target: 'ofis', value: 4000 },
    
    // Fixes to outcomes
    { source: 'risk-scoring', target: 'points', value: 4500 },
    { source: 'risk-scoring', target: 'risk-reduction', value: 4000 },
    { source: 'risk-scoring', target: 'strong-tier', value: 1500 },
    
    { source: 'human-oversight', target: 'points', value: 3800 },
    { source: 'human-oversight', target: 'risk-reduction', value: 4000 },
    { source: 'human-oversight', target: 'eu-ready', value: 5200 },
    
    { source: 'bias-testing', target: 'points', value: 3500 },
    { source: 'bias-testing', target: 'risk-reduction', value: 3000 },
    { source: 'bias-testing', target: 'eu-ready', value: 3500 },
    
    { source: 'minor-gaps', target: 'points', value: 5200 },
    { source: 'minor-gaps', target: 'strong-tier', value: 2800 },
    
    { source: 'ofis', target: 'points', value: 3300 },
    { source: 'ofis', target: 'strong-tier', value: 700 },
  ];

  return (
    <div className="w-full">
      <SankeyDiagram
        nodes={nodes}
        links={links}
        width={900}
        height={400}
        title="Remediation ROI Flow"
        subtitle="How fixing gaps improves your score and reduces risk"
      />
      
      <div className="grid grid-cols-2 gap-4 mt-6">
        <div className="p-4 bg-muted/30 border border-border rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Total Investment</div>
          <div className="text-3xl font-bold text-foreground">$45K</div>
          <div className="text-xs text-muted-foreground">Over 8 weeks</div>
        </div>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg">
          <div className="text-sm text-muted-foreground mb-2">Value Created</div>
          <div className="text-3xl font-bold text-emerald-400">$2.04M</div>
          <div className="text-xs text-emerald-400">ROI: 45.4x</div>
        </div>
      </div>
      
      <div className="mt-4 p-4 bg-gradient-to-r from-emerald-500/10 via-blue-500/10 to-purple-500/10 border border-border rounded-lg">
        <div className="text-center">
          <div className="text-lg font-semibold mb-1">Projected Improvement</div>
          <div className="flex items-center justify-center gap-4 text-sm">
            <span className="text-muted-foreground">Score: 687</span>
            <span className="text-muted-foreground">→</span>
            <span className="text-emerald-400 font-bold">890 (+203 pts)</span>
            <span className="px-2 py-0.5 bg-emerald-500/20 text-emerald-400 text-xs rounded">Strong Tier</span>
          </div>
        </div>
      </div>
    </div>
  );
}
