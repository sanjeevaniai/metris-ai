import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Activity, ArrowRight, CheckCircle2, AlertTriangle, XCircle } from 'lucide-react';
import { DEMO_DRIFT_METRICS, DriftMetric } from '@/data/demoMonitoring';
import { Progress } from '@/components/ui/progress';

const statusConfig = {
  healthy: {
    label: 'Healthy',
    icon: '🟢',
    color: 'text-risk-low',
    bgColor: 'bg-risk-low/20',
  },
  watch: {
    label: 'Watch',
    icon: '🟡',
    color: 'text-risk-medium',
    bgColor: 'bg-risk-medium/20',
  },
  alert: {
    label: 'Alert',
    icon: '🔴',
    color: 'text-risk-critical',
    bgColor: 'bg-risk-critical/20',
  },
};

function getMetricIcon(value: number, threshold: number) {
  if (value > threshold) return <XCircle className="h-3 w-3 text-risk-critical" />;
  if (value > threshold * 0.8) return <AlertTriangle className="h-3 w-3 text-risk-medium" />;
  return <CheckCircle2 className="h-3 w-3 text-risk-low" />;
}

function getMetricLabel(value: number, threshold: number) {
  if (value > threshold) return '⚠️';
  return '✅';
}

function DriftSystemRow({ metric }: { metric: DriftMetric }) {
  const status = statusConfig[metric.status];
  const healthPercent = Math.min(100, Math.max(0, (1 - metric.psiScore / (metric.threshold * 1.5)) * 100));

  return (
    <div className="p-4 rounded-lg border border-border/50 bg-muted/10">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <span>{status.icon}</span>
          <span className="font-medium text-sm">{metric.systemName}</span>
          <Badge className={`${status.bgColor} ${status.color} text-xs`}>
            {status.label}
          </Badge>
        </div>
        <div className="flex items-center gap-4 text-xs">
          <span className="flex items-center gap-1">
            Data: {metric.dataDrift.toFixed(2)} {getMetricLabel(metric.dataDrift, metric.threshold)}
          </span>
          <span className="flex items-center gap-1">
            Model: {metric.modelDrift.toFixed(2)} {getMetricLabel(metric.modelDrift, metric.threshold)}
          </span>
          <span className="flex items-center gap-1">
            Concept: {metric.conceptDrift.toFixed(2)} {getMetricLabel(metric.conceptDrift, metric.threshold)}
          </span>
        </div>
      </div>
      
      <Progress 
        value={healthPercent} 
        className="h-2"
      />
      
      <p className="text-xs text-muted-foreground mt-2">
        {metric.status === 'alert' && `PSI: ${metric.psiScore.toFixed(2)} (threshold: ${metric.threshold.toFixed(2)})`}
        {metric.status === 'watch' && `Model drift approaching threshold (${metric.modelDrift.toFixed(2)}/${metric.threshold.toFixed(2)})`}
        {metric.status === 'healthy' && 'All metrics within normal range'}
      </p>
      
      <div className="flex justify-end mt-2">
        <Button variant="ghost" size="sm" className="text-xs text-primary h-6">
          Details <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function DriftDetectionDashboard() {
  const totalSystems = DEMO_DRIFT_METRICS.length;
  const totalIndicators = totalSystems * 3; // 3 drift types per system

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <Activity className="h-4 w-4 text-primary" />
          Drift Detection
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Monitoring {totalSystems} AI systems • {totalIndicators} drift indicators • Updated every 15 min
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-3">
          {DEMO_DRIFT_METRICS.map((metric) => (
            <DriftSystemRow key={metric.systemId} metric={metric} />
          ))}
        </div>

        <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
          <h4 className="text-sm font-medium mb-3">Drift Metrics Explained</h4>
          <div className="space-y-2 text-xs text-muted-foreground">
            <p>• <span className="text-foreground">Data Drift (PSI):</span> Input feature distribution shift</p>
            <p>• <span className="text-foreground">Model Drift:</span> Prediction behavior change</p>
            <p>• <span className="text-foreground">Concept Drift:</span> Target relationship evolution</p>
            <p className="pt-2 border-t border-border/50">
              Threshold: &lt; 0.10 = ✅ Healthy, 0.10-0.20 = ⚠️ Watch, &gt; 0.20 = 🔴 Alert
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
