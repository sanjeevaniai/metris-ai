import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Info } from 'lucide-react';

interface LegendItem {
  color: string;
  label: string;
  range?: string;
  description: string;
}

export function ColorLegend() {
  const scoreTiers: LegendItem[] = [
    { color: 'bg-score-critical', label: 'Critical', range: '0-200', description: 'Immediate action required' },
    { color: 'bg-score-poor', label: 'Poor', range: '201-400', description: 'High priority remediation' },
    { color: 'bg-score-fair', label: 'Fair', range: '401-600', description: 'Needs improvement' },
    { color: 'bg-score-good', label: 'Good', range: '601-800', description: 'Healthy compliance' },
    { color: 'bg-score-excellent', label: 'Excellent', range: '801-1000', description: 'Best-in-class' },
  ];

  const riskLevels: LegendItem[] = [
    { color: 'bg-risk-critical', label: 'Critical', description: 'Requires immediate attention' },
    { color: 'bg-risk-high', label: 'High', description: 'Escalate within 24-48 hours' },
    { color: 'bg-risk-medium', label: 'Medium', description: 'Schedule for review' },
    { color: 'bg-risk-low', label: 'Low', description: 'Monitor periodically' },
    { color: 'bg-risk-info', label: 'Info', description: 'Informational only' },
  ];

  const statusIndicators: LegendItem[] = [
    { color: 'bg-status-success', label: 'Success', description: 'Complete/Passed' },
    { color: 'bg-status-warning', label: 'Warning', description: 'Attention needed' },
    { color: 'bg-status-error', label: 'Error', description: 'Failed/Blocked' },
    { color: 'bg-status-pending', label: 'Pending', description: 'In progress' },
    { color: 'bg-status-inactive', label: 'Inactive', description: 'Disabled/Paused' },
  ];

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-sm font-light flex items-center gap-2">
          <Info className="h-4 w-4 text-muted-foreground" />
          Color Legend
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Score Tiers */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Score Tiers (0-1000)
          </h4>
          <div className="flex flex-wrap gap-2">
            {scoreTiers.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 text-xs"
                title={item.description}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="text-muted-foreground">{item.range}</span>
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Risk Levels */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Risk Severity
          </h4>
          <div className="flex flex-wrap gap-2">
            {riskLevels.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 text-xs"
                title={item.description}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Status */}
        <div>
          <h4 className="text-xs font-medium text-muted-foreground mb-2 uppercase tracking-wide">
            Status Indicators
          </h4>
          <div className="flex flex-wrap gap-2">
            {statusIndicators.map((item) => (
              <div
                key={item.label}
                className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/30 text-xs"
                title={item.description}
              >
                <span className={`w-2.5 h-2.5 rounded-full ${item.color}`} />
                <span className="font-medium">{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
