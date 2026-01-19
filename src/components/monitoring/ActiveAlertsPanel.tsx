import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, AlertTriangle, ArrowRight } from 'lucide-react';
import { DEMO_ALERTS, MonitoringAlert } from '@/data/demoMonitoring';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 60) return `${diffMins} minutes ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  return `${Math.floor(diffHrs / 24)} day${Math.floor(diffHrs / 24) > 1 ? 's' : ''} ago`;
}

const typeStyles = {
  critical: {
    badge: 'bg-risk-critical/20 text-risk-critical border-risk-critical/30',
    icon: '🔴',
    label: 'CRITICAL',
  },
  warning: {
    badge: 'bg-risk-medium/20 text-risk-medium border-risk-medium/30',
    icon: '🟡',
    label: 'WARNING',
  },
  info: {
    badge: 'bg-primary/20 text-primary border-primary/30',
    icon: '🔵',
    label: 'INFO',
  },
};

function AlertItem({ alert }: { alert: MonitoringAlert }) {
  const styles = typeStyles[alert.type];

  return (
    <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span>{styles.icon}</span>
          <Badge className={styles.badge}>{styles.label}</Badge>
          <span className="text-xs text-muted-foreground">• {formatTimeAgo(alert.timestamp)}</span>
        </div>
      </div>
      
      <h4 className="font-medium text-sm mb-2">{alert.title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{alert.description}</p>
      
      <div className="space-y-1 mb-3 text-xs">
        <p className="text-foreground">
          <span className="text-muted-foreground">Impact:</span> {alert.impact}
        </p>
        {alert.checkpoint && (
          <p className="text-foreground">
            <span className="text-muted-foreground">Checkpoint:</span> {alert.checkpoint}
          </p>
        )}
        <p className="text-foreground">
          <span className="text-muted-foreground">Source:</span> {alert.source}
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {alert.actions.map((action, index) => (
          <Button
            key={index}
            variant={index === 0 ? 'default' : 'outline'}
            size="sm"
            className="text-xs h-7"
          >
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}

export function ActiveAlertsPanel() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-light flex items-center gap-2">
            <Bell className="h-4 w-4 text-risk-medium" />
            Active Alerts ({DEMO_ALERTS.length})
          </CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-primary">
            View All <ArrowRight className="h-3 w-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {DEMO_ALERTS.map((alert) => (
          <AlertItem key={alert.id} alert={alert} />
        ))}
      </CardContent>
    </Card>
  );
}
