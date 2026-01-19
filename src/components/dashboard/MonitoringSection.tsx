import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Activity, Eye, Clock, AlertTriangle, CheckCircle2, TrendingUp } from 'lucide-react';

interface MonitoringAlert {
  id: string;
  system: string;
  type: 'drift' | 'anomaly' | 'threshold' | 'compliance';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

const mockAlerts: MonitoringAlert[] = [
  {
    id: '1',
    system: 'Credit Scoring Model',
    type: 'drift',
    message: 'Feature drift detected in income_level variable (3.2% shift)',
    severity: 'medium',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
    resolved: false,
  },
  {
    id: '2',
    system: 'Fraud Detection Engine',
    type: 'threshold',
    message: 'False positive rate exceeded 5% threshold',
    severity: 'high',
    timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000),
    resolved: false,
  },
  {
    id: '3',
    system: 'Customer Churn Predictor',
    type: 'compliance',
    message: 'Model card updated - re-validation required',
    severity: 'low',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000),
    resolved: true,
  },
];

const getSeverityColor = (severity: string) => {
  switch (severity) {
    case 'critical': return 'bg-risk-critical/20 text-risk-critical border-risk-critical/30';
    case 'high': return 'bg-risk-high/20 text-risk-high border-risk-high/30';
    case 'medium': return 'bg-risk-medium/20 text-risk-medium border-risk-medium/30';
    case 'low': return 'bg-risk-low/20 text-risk-low border-risk-low/30';
    default: return 'bg-muted text-muted-foreground';
  }
};

const getTypeIcon = (type: string) => {
  switch (type) {
    case 'drift': return <TrendingUp className="h-4 w-4" />;
    case 'anomaly': return <AlertTriangle className="h-4 w-4" />;
    case 'threshold': return <Activity className="h-4 w-4" />;
    case 'compliance': return <Eye className="h-4 w-4" />;
    default: return <Activity className="h-4 w-4" />;
  }
};

export function MonitoringSection() {
  const activeAlerts = mockAlerts.filter(a => !a.resolved).length;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
      {/* Monitoring Status */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-light flex items-center gap-2">
            <Eye className="h-5 w-5 text-primary" />
            Monitoring Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-light text-primary">12</p>
              <p className="text-xs text-muted-foreground">Systems Monitored</p>
            </div>
            <div className="p-3 rounded-lg bg-muted/50 text-center">
              <p className="text-2xl font-light text-risk-high">{activeAlerts}</p>
              <p className="text-xs text-muted-foreground">Active Alerts</p>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Model Drift Detection</span>
              <span className="text-primary">Active</span>
            </div>
            <Progress value={100} className="h-1.5" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Bias Monitoring</span>
              <span className="text-primary">Active</span>
            </div>
            <Progress value={100} className="h-1.5" />
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Compliance Tracking</span>
              <span className="text-primary">Active</span>
            </div>
            <Progress value={100} className="h-1.5" />
          </div>
        </CardContent>
      </Card>

      {/* Recent Alerts */}
      <Card className="lg:col-span-2">
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-light flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-risk-high" />
            Recent Alerts
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockAlerts.map((alert) => (
              <div
                key={alert.id}
                className={`p-3 rounded-lg border ${alert.resolved ? 'opacity-60' : ''} bg-muted/30`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded ${getSeverityColor(alert.severity)}`}>
                      {getTypeIcon(alert.type)}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">{alert.system}</span>
                        <Badge className={`text-xs ${getSeverityColor(alert.severity)}`}>
                          {alert.severity.toUpperCase()}
                        </Badge>
                        {alert.resolved && (
                          <Badge variant="outline" className="text-xs text-primary border-primary/30">
                            <CheckCircle2 className="h-3 w-3 mr-1" />
                            Resolved
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{alert.message}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground whitespace-nowrap">
                    <Clock className="h-3 w-3" />
                    {formatTimeAgo(alert.timestamp)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffHrs = Math.floor(diffMs / (1000 * 60 * 60));
  
  if (diffHrs < 1) return 'Just now';
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return `${Math.floor(diffHrs / 24)}d ago`;
}
