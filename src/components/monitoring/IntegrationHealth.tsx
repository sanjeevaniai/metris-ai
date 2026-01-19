import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plug, Github, Activity, Brain, FileText, Database, ArrowRight } from 'lucide-react';
import { DEMO_INTEGRATIONS } from '@/data/demoMonitoring';

function formatTimeAgo(date: Date): string {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  
  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHrs = Math.floor(diffMins / 60);
  if (diffHrs < 24) return `${diffHrs}h ago`;
  return 'Never';
}

const iconMap: Record<string, React.ReactNode> = {
  github: <Github className="h-4 w-4" />,
  activity: <Activity className="h-4 w-4" />,
  brain: <Brain className="h-4 w-4" />,
  'file-text': <FileText className="h-4 w-4" />,
  database: <Database className="h-4 w-4" />,
};

const statusColors = {
  connected: 'text-risk-low',
  warning: 'text-risk-medium',
  disconnected: 'text-muted-foreground',
};

const statusDots = {
  connected: '🟢',
  warning: '🟡',
  disconnected: '⚪',
};

export function IntegrationHealth() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <Plug className="h-4 w-4 text-primary" />
          Integration Health
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {DEMO_INTEGRATIONS.map((integration) => (
            <div
              key={integration.id}
              className="flex items-center justify-between py-2 border-b border-border/30 last:border-0"
            >
              <div className="flex items-center gap-3">
                <span>{statusDots[integration.status]}</span>
                <div className={statusColors[integration.status]}>
                  {iconMap[integration.icon]}
                </div>
                <span className="text-sm font-medium">{integration.name}</span>
              </div>
              <span className="text-xs text-muted-foreground">
                {integration.status === 'disconnected' 
                  ? 'Not connected' 
                  : `Last: ${formatTimeAgo(integration.lastSync)}`
                }
              </span>
            </div>
          ))}
        </div>
        <Button variant="ghost" className="w-full mt-4 text-sm text-primary hover:text-primary">
          Manage Integrations
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      </CardContent>
    </Card>
  );
}
