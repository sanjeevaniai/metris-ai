import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Activity, TrendingUp, DollarSign, Bell } from 'lucide-react';
import { DEMO_GOVERNANCE_STATUS } from '@/data/demoMonitoring';

function formatCurrency(value: number): string {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  return `$${(value / 1000).toFixed(0)}K`;
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  const diffHrs = Math.floor(diffMins / 60);
  return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
}

function formatTimeUntil(date: Date): string {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Now';
  return `${diffMins} minute${diffMins > 1 ? 's' : ''}`;
}

export function GovernanceHealthStatus() {
  const { status, currentScore, scoreVariance, riskExposure, activeAlerts, lastUpdated, nextSync } = DEMO_GOVERNANCE_STATUS;
  
  const statusColors = {
    stable: 'bg-risk-low/20 text-risk-low border-risk-low/30',
    degraded: 'bg-risk-medium/20 text-risk-medium border-risk-medium/30',
    critical: 'bg-risk-critical/20 text-risk-critical border-risk-critical/30',
  };

  const statusIcons = {
    stable: '🟢',
    degraded: '🟡',
    critical: '🔴',
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {/* Status */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="text-2xl mb-1">{statusIcons[status]}</div>
            <Badge className={`${statusColors[status]} font-medium`}>
              {status.toUpperCase()}
            </Badge>
            <p className="text-xs text-muted-foreground mt-2">Governance Status</p>
          </div>

          {/* Current Score */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-1">
              <TrendingUp className="h-4 w-4 text-primary" />
              <span className="text-2xl font-light text-foreground">{currentScore}</span>
            </div>
            <p className="text-xs text-muted-foreground">± {scoreVariance}</p>
            <p className="text-xs text-muted-foreground mt-1">Current Score</p>
          </div>

          {/* Risk Exposure */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-1">
              <DollarSign className="h-4 w-4 text-risk-high" />
              <span className="text-2xl font-light text-foreground">{formatCurrency(riskExposure)}</span>
            </div>
            <p className="text-xs text-muted-foreground">VaR 95%</p>
            <p className="text-xs text-muted-foreground mt-1">Risk Exposure</p>
          </div>

          {/* Active Alerts */}
          <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 border border-border/50">
            <div className="flex items-center gap-1">
              <Bell className="h-4 w-4 text-risk-medium" />
              <span className="text-2xl font-light text-foreground">{activeAlerts}</span>
              <span className="text-lg">🔔</span>
            </div>
            <p className="text-xs text-muted-foreground">Active</p>
            <p className="text-xs text-muted-foreground mt-1">Alerts</p>
          </div>
        </div>

        {/* Sync Status */}
        <div className="flex items-center justify-center gap-4 mt-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <Activity className="h-3 w-3 text-primary animate-pulse" />
            <span className="text-xs text-muted-foreground">
              Last updated: {formatTimeAgo(lastUpdated)}
            </span>
          </div>
          <span className="text-muted-foreground">•</span>
          <span className="text-xs text-muted-foreground">
            Next sync: {formatTimeUntil(nextSync)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
}
