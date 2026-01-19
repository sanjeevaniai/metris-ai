import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileCheck, ArrowRight, TrendingUp, TrendingDown } from 'lucide-react';
import { DEMO_CHECKPOINT_CHANGES, DEMO_AT_RISK_CHECKPOINTS, CheckpointChange, AtRiskCheckpoint } from '@/data/demoMonitoring';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHrs < 24) return `${diffHrs} hours ago`;
  return `${Math.floor(diffHrs / 24)} days ago`;
}

// Status styles - NO BINARY PASS/FAIL
const statusStyles = {
  pass: { label: 'Strong', icon: '●', color: 'text-risk-low', bg: 'bg-risk-low/20' },
  warning: { label: 'At Risk', icon: '◑', color: 'text-risk-medium', bg: 'bg-risk-medium/20' },
  fail: { label: 'Gap', icon: '◐', color: 'text-risk-critical', bg: 'bg-risk-critical/20' },
};

const riskLevelStyles = {
  low: { label: 'Low', icon: '🟢', color: 'text-risk-low', bg: 'bg-risk-low/20' },
  medium: { label: 'Medium', icon: '🟡', color: 'text-risk-medium', bg: 'bg-risk-medium/20' },
  high: { label: 'High', icon: '🔴', color: 'text-risk-high', bg: 'bg-risk-high/20' },
};

function ChangeItem({ change }: { change: CheckpointChange }) {
  const prevStyle = statusStyles[change.previousStatus];
  const currStyle = statusStyles[change.currentStatus];
  const isPositive = change.impact > 0;

  return (
    <div className="py-3 border-b border-border/30 last:border-0">
      <div className="flex items-start justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-mono text-xs text-muted-foreground">{change.checkpointId}</span>
            <span className="font-medium text-sm">{change.name}</span>
          </div>
          <div className="flex items-center gap-2 text-xs mb-1">
            <span>Status: {prevStyle.icon} {prevStyle.label}</span>
            <span>→</span>
            <span>{currStyle.icon} {currStyle.label}</span>
          </div>
          <p className="text-xs text-muted-foreground">
            Changed: {formatTimeAgo(change.changedAt)} • Trigger: {change.trigger}
          </p>
          <p className={`text-xs flex items-center gap-1 mt-1 ${isPositive ? 'text-risk-low' : 'text-risk-high'}`}>
            {isPositive ? <TrendingUp className="h-3 w-3" /> : <TrendingDown className="h-3 w-3" />}
            Impact: {isPositive ? '+' : ''}{change.impact} points
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="sm" className="text-xs h-6">View</Button>
          {!isPositive && (
            <Button variant="outline" size="sm" className="text-xs h-6 text-primary border-primary/30">Start Fix</Button>
          )}
        </div>
      </div>
    </div>
  );
}

function AtRiskItem({ checkpoint }: { checkpoint: AtRiskCheckpoint }) {
  const riskStyle = riskLevelStyles[checkpoint.riskLevel];
  const currentStyle = statusStyles[checkpoint.currentStatus];

  return (
    <tr className="text-xs">
      <td className="py-2 font-mono text-muted-foreground">{checkpoint.checkpointId}</td>
      <td className="py-2">{checkpoint.name}</td>
      <td className="py-2">
        <span className={currentStyle.color}>{currentStyle.icon} {currentStyle.label}</span>
      </td>
      <td className="py-2">
        <Badge className={`${riskStyle.bg} ${riskStyle.color} text-xs`}>
          {riskStyle.icon} {riskStyle.label}
        </Badge>
      </td>
      <td className="py-2 text-muted-foreground">~{checkpoint.daysUntilChange} days</td>
    </tr>
  );
}

export function CheckpointStatusMonitor() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <FileCheck className="h-4 w-4 text-primary" />
          Checkpoint Status Monitor
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Track checkpoints that change status based on real-time data
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Recently Changed */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/10">
          <h4 className="text-sm font-medium mb-3">Recently Changed (Last 7 days)</h4>
          <div className="divide-y divide-border/30">
            {DEMO_CHECKPOINT_CHANGES.map((change) => (
              <ChangeItem key={change.id} change={change} />
            ))}
          </div>
        </div>

        {/* At Risk */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/10">
          <h4 className="text-sm font-medium mb-3">At Risk (May change soon)</h4>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="text-xs text-muted-foreground border-b border-border/30">
                  <th className="py-2 text-left font-normal">Checkpoint</th>
                  <th className="py-2 text-left font-normal">Name</th>
                  <th className="py-2 text-left font-normal">Current</th>
                  <th className="py-2 text-left font-normal">Risk Level</th>
                  <th className="py-2 text-left font-normal">Days Until Change</th>
                </tr>
              </thead>
              <tbody>
                {DEMO_AT_RISK_CHECKPOINTS.map((checkpoint) => (
                  <AtRiskItem key={checkpoint.checkpointId} checkpoint={checkpoint} />
                ))}
              </tbody>
            </table>
          </div>
          <Button variant="ghost" className="w-full mt-3 text-xs text-primary">
            View All At-Risk Checkpoints <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
