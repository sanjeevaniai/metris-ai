// Decision Volume Card Component

import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { DEMO_TRIPLE_METRICS, formatDecisionVolume } from '@/data/demoHumanImpact';

export function DecisionVolumeCard() {
  const volume = DEMO_TRIPLE_METRICS.humans.decisionVolume;
  
  if (!volume) return null;

  const stats = [
    { label: 'TOTAL', value: volume.total, sublabel: 'all time' },
    { label: 'QUARTER', value: volume.quarterly, sublabel: 'this quarter' },
    { label: 'MONTH', value: volume.monthly, sublabel: 'this month' },
    { label: 'TODAY', value: volume.daily, sublabel: 'today' },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          {stats.map((stat) => (
            <div 
              key={stat.label}
              className="text-center p-4 rounded-lg bg-muted/30 border border-border/50"
            >
              <div className="text-3xl font-bold font-mono text-foreground">
                {formatDecisionVolume(stat.value)}
              </div>
              <div className="text-xs font-mono uppercase tracking-wider text-muted-foreground mt-1">
                {stat.label}
              </div>
              <div className="text-[10px] text-muted-foreground/60 mt-0.5">
                {stat.sublabel}
              </div>
            </div>
          ))}
        </div>

        {/* Trend indicator */}
        <div className="flex items-center justify-between pt-4 border-t border-border/50">
          <span className="text-sm text-muted-foreground">
            Decision Trend (90 days)
          </span>
          <div className="flex items-center gap-2 text-status-good">
            <TrendingUp className="h-4 w-4" />
            <span className="text-sm font-medium">+12% vs previous quarter</span>
          </div>
        </div>

        {/* Visual trend bar */}
        <div className="mt-3 h-2 bg-muted rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full transition-all duration-1000"
            style={{ width: '78%' }}
          />
        </div>
      </CardContent>
    </Card>
  );
}
