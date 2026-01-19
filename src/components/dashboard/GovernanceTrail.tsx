import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  History, 
  FileText, 
  CheckCircle2, 
  AlertCircle, 
  ArrowUpRight,
  Download,
  Filter,
  Clock,
  TrendingUp,
  Shield,
  Wrench
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface TrailEvent {
  id: string;
  type: 'scan' | 'remediation' | 'score_change' | 'alert' | 'export';
  timestamp: string;
  system: string;
  description: string;
  details?: string;
  scoreImpact?: number;
  user?: string;
}

const trailEvents: TrailEvent[] = [
  {
    id: '1',
    type: 'scan',
    timestamp: '2026-01-15T09:30:00',
    system: 'Credit Risk AI',
    description: 'Full governance scan completed',
    details: '25 agents, 127 checks, 4 findings',
    scoreImpact: 0,
    user: 'Automated'
  },
  {
    id: '2',
    type: 'remediation',
    timestamp: '2026-01-14T16:45:00',
    system: 'Fraud Detection Model',
    description: 'Data lineage documentation added',
    details: 'Resolved HIGH severity finding #F-2024-089',
    scoreImpact: 12,
    user: 'J. Schmidt'
  },
  {
    id: '3',
    type: 'score_change',
    timestamp: '2026-01-14T14:20:00',
    system: 'Customer Churn Predictor',
    description: 'Score improved after bias review',
    details: 'Fairness dimension: 58 → 72',
    scoreImpact: 28,
    user: 'System'
  },
  {
    id: '4',
    type: 'alert',
    timestamp: '2026-01-14T11:00:00',
    system: 'Portfolio Optimizer',
    description: 'Model drift detected',
    details: 'Performance degradation >15% threshold',
    scoreImpact: -8,
    user: 'Monitoring'
  },
  {
    id: '5',
    type: 'export',
    timestamp: '2026-01-13T17:30:00',
    system: 'All Systems',
    description: 'Executive report exported',
    details: 'PDF format, EU AI Act alignment',
    user: 'M. Weber'
  },
  {
    id: '6',
    type: 'remediation',
    timestamp: '2026-01-13T15:00:00',
    system: 'NLP Document Classifier',
    description: 'Explainability layer implemented',
    details: 'SHAP values now available for all predictions',
    scoreImpact: 18,
    user: 'A. Mueller'
  },
  {
    id: '7',
    type: 'scan',
    timestamp: '2026-01-12T09:30:00',
    system: 'Loan Approval Engine',
    description: 'Scheduled weekly scan',
    details: '25 agents, 127 checks, 2 new findings',
    scoreImpact: -3,
    user: 'Automated'
  },
  {
    id: '8',
    type: 'score_change',
    timestamp: '2026-01-11T14:15:00',
    system: 'Marketing Segmentation AI',
    description: 'Governance score updated',
    details: 'Overall: 612 → 648 (+36 points)',
    scoreImpact: 36,
    user: 'System'
  }
];

const getEventIcon = (type: TrailEvent['type']) => {
  switch (type) {
    case 'scan': return <Shield className="h-4 w-4" />;
    case 'remediation': return <Wrench className="h-4 w-4" />;
    case 'score_change': return <TrendingUp className="h-4 w-4" />;
    case 'alert': return <AlertCircle className="h-4 w-4" />;
    case 'export': return <FileText className="h-4 w-4" />;
  }
};

const getEventColor = (type: TrailEvent['type']) => {
  switch (type) {
    case 'scan': return 'bg-primary/10 text-primary border-primary/20';
    case 'remediation': return 'bg-secondary/10 text-secondary border-secondary/20';
    case 'score_change': return 'bg-primary/10 text-primary border-primary/20';
    case 'alert': return 'bg-risk-high/10 text-risk-high border-risk-high/20';
    case 'export': return 'bg-gold/10 text-gold border-gold/20';
  }
};

const formatTimeAgo = (timestamp: string) => {
  const diff = Date.now() - new Date(timestamp).getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  
  if (days > 0) return `${days}d ago`;
  if (hours > 0) return `${hours}h ago`;
  return 'Just now';
};

export function GovernanceTrail() {
  const totalRemediations = trailEvents.filter(e => e.type === 'remediation').length;
  const totalScoreGain = trailEvents
    .filter(e => e.scoreImpact && e.scoreImpact > 0)
    .reduce((sum, e) => sum + (e.scoreImpact || 0), 0);
  const totalScans = trailEvents.filter(e => e.type === 'scan').length;

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-secondary/10 flex items-center justify-center">
              <History className="h-5 w-5 text-secondary" />
            </div>
            <div>
              <CardTitle className="text-base font-light">Governance Trail</CardTitle>
              <p className="text-xs text-muted-foreground font-light">
                Complete audit history with scoring trail
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-4 text-center">
              <div className="px-3">
                <div className="text-lg font-light text-foreground">{totalScans}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Scans</div>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="px-3">
                <div className="text-lg font-light text-secondary">{totalRemediations}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Fixes</div>
              </div>
              <div className="h-6 w-px bg-border" />
              <div className="px-3">
                <div className="text-lg font-light text-primary">+{totalScoreGain}</div>
                <div className="text-[10px] text-muted-foreground uppercase">Score Δ</div>
              </div>
            </div>
            <Button variant="outline" size="sm" className="h-8 text-xs font-light gap-1">
              <Download className="h-3 w-3" />
              Export Log
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {trailEvents.map((event) => (
            <div 
              key={event.id}
              className="flex items-start gap-3 p-3 rounded-lg hover:bg-muted/30 transition-colors group"
            >
              {/* Icon */}
              <div className={cn(
                "h-8 w-8 rounded-lg flex items-center justify-center flex-shrink-0 border",
                getEventColor(event.type)
              )}>
                {getEventIcon(event.type)}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium">{event.description}</span>
                      {event.scoreImpact !== undefined && event.scoreImpact !== 0 && (
                        <Badge 
                          variant="outline" 
                          className={cn(
                            "text-[10px] py-0 h-5 font-normal",
                            event.scoreImpact > 0 ? 'text-primary border-primary/30' : 'text-risk-high border-risk-high/30'
                          )}
                        >
                          {event.scoreImpact > 0 ? '+' : ''}{event.scoreImpact} pts
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-0.5">
                      <span className="font-medium text-foreground/70">{event.system}</span>
                      <span>•</span>
                      <span>{event.details}</span>
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <div className="text-xs text-muted-foreground flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {formatTimeAgo(event.timestamp)}
                    </div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{event.user}</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* View More */}
        <div className="mt-4 pt-3 border-t border-border/50 flex items-center justify-between">
          <span className="text-xs text-muted-foreground">
            Showing last 7 days • 847 total events in audit log
          </span>
          <Button variant="ghost" size="sm" className="h-7 text-xs font-light gap-1">
            View Full History
            <ArrowUpRight className="h-3 w-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
