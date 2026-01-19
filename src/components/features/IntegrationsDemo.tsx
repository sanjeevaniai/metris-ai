import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Plug, GitBranch, Terminal, Webhook, CheckCircle2, Clock, Database, Cpu, Activity, Eye } from 'lucide-react';

const mlRegistries = [
  { name: 'MLflow', status: 'connected', models: 12, icon: '🔬' },
  { name: 'Hugging Face Hub', status: 'connected', models: 8, icon: '🤗' },
  { name: 'Weights & Biases', status: 'connected', models: 5, icon: '📊' },
  { name: 'SageMaker Registry', status: 'pending', models: 0, icon: '☁️' },
];

const mlOpsPipelines = [
  { name: 'Credit Risk Model Training', status: 'healthy', lastRun: '2h ago', checks: 8, passed: 8 },
  { name: 'Fraud Detection Inference', status: 'warning', lastRun: '15m ago', checks: 8, passed: 6 },
  { name: 'Customer Churn Retraining', status: 'healthy', lastRun: '1d ago', checks: 8, passed: 8 },
  { name: 'NLP Sentiment Pipeline', status: 'error', lastRun: '4h ago', checks: 8, passed: 3 },
];

const aiOpsTools = [
  { name: 'Datadog', category: 'Monitoring', status: 'connected' },
  { name: 'Prometheus', category: 'Metrics', status: 'connected' },
  { name: 'Grafana', category: 'Visualization', status: 'connected' },
  { name: 'Arize AI', category: 'ML Observability', status: 'connected' },
  { name: 'WhyLabs', category: 'Data Quality', status: 'pending' },
  { name: 'Evidently', category: 'ML Monitoring', status: 'pending' },
];

const cicdIntegrations = [
  { 
    name: 'GitHub Actions', 
    status: 'active',
    lastRun: 'PR #847 - Model card update',
    result: 'passed',
    checks: ['METRIS Score ≥ 750', 'No critical findings', 'Bias tests pass']
  },
  { 
    name: 'GitLab CI', 
    status: 'active',
    lastRun: 'Pipeline #2341',
    result: 'failed',
    checks: ['METRIS Score ≥ 750', 'Fairness threshold failed', 'Documentation gap']
  },
];

const apiEndpoints = [
  { method: 'POST', path: '/api/v1/scan', description: 'Initiate governance scan' },
  { method: 'GET', path: '/api/v1/score/{ein}', description: 'Get METRIS score' },
  { method: 'GET', path: '/api/v1/report/{id}', description: 'Retrieve governance report' },
  { method: 'POST', path: '/api/v1/webhook', description: 'Register event webhook' },
];

export function IntegrationsDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-blue-500/10 text-blue-500 border-blue-500/20">
          <Plug className="h-3 w-3 mr-1" />
          Integrations & MLOps/AIOps
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">Enterprise Integration Suite</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Connect to ML registries, CI/CD pipelines, and observability platforms
        </p>
      </div>

      {/* ML Registries */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-primary" />
            ML Registry Connectors (Agent 22)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mlRegistries.map((reg) => (
              <div 
                key={reg.name}
                className={`p-4 rounded-lg border text-center ${
                  reg.status === 'connected' ? 'bg-green-500/5 border-green-500/20' : 
                  'bg-muted/30 border-border/50'
                }`}
              >
                <div className="text-2xl mb-2">{reg.icon}</div>
                <div className="text-sm font-medium">{reg.name}</div>
                <div className="text-xs text-muted-foreground mb-2">
                  {reg.models > 0 ? `${reg.models} models` : 'Not connected'}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs ${
                    reg.status === 'connected' ? 'text-green-500 border-green-500/30' : 
                    'text-yellow-500 border-yellow-500/30'
                  }`}
                >
                  {reg.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* MLOps Pipeline Analyzer */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Cpu className="h-4 w-4 text-purple-500" />
            MLOps Pipeline Analyzer (Agent 23)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mlOpsPipelines.map((pipeline) => (
              <div 
                key={pipeline.name}
                className={`p-4 rounded-lg border flex items-center gap-4 ${
                  pipeline.status === 'healthy' ? 'bg-green-500/5 border-green-500/20' :
                  pipeline.status === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' :
                  'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className={`w-3 h-3 rounded-full ${
                  pipeline.status === 'healthy' ? 'bg-green-500' :
                  pipeline.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                }`} />
                <div className="flex-1">
                  <div className="font-medium text-sm">{pipeline.name}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    {pipeline.lastRun}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm font-medium">{pipeline.passed}/{pipeline.checks}</div>
                  <div className="text-xs text-muted-foreground">governance checks</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* AIOps Observability */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Activity className="h-4 w-4 text-orange-500" />
            AIOps Observability (Agent 24)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {aiOpsTools.map((tool) => (
              <div 
                key={tool.name}
                className={`p-3 rounded-lg border text-center ${
                  tool.status === 'connected' ? 'bg-green-500/5 border-green-500/20' : 
                  'bg-muted/30 border-border/50'
                }`}
              >
                <div className="text-sm font-medium">{tool.name}</div>
                <div className="text-xs text-muted-foreground">{tool.category}</div>
                {tool.status === 'connected' && (
                  <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mt-2" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CI/CD Integration */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-gray-500" />
            CI/CD Pipeline Gates
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {cicdIntegrations.map((ci) => (
              <div key={ci.name} className="p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{ci.name}</span>
                    <Badge variant="outline" className="text-xs">{ci.status}</Badge>
                  </div>
                  <Badge 
                    className={`${
                      ci.result === 'passed' ? 'bg-green-500/20 text-green-500' : 'bg-red-500/20 text-red-500'
                    }`}
                  >
                    {ci.result}
                  </Badge>
                </div>
                <div className="text-sm text-muted-foreground mb-2">{ci.lastRun}</div>
                <div className="flex flex-wrap gap-2">
                  {ci.checks.map((check, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {check}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* API & Webhooks */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Terminal className="h-4 w-4 text-green-500" />
              REST API
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 font-mono text-xs">
              {apiEndpoints.map((ep, i) => (
                <div key={i} className="flex items-center gap-2 p-2 bg-muted/50 rounded">
                  <Badge 
                    variant="outline" 
                    className={`text-xs ${ep.method === 'POST' ? 'text-yellow-500' : 'text-green-500'}`}
                  >
                    {ep.method}
                  </Badge>
                  <code className="flex-1">{ep.path}</code>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Webhook className="h-4 w-4 text-purple-500" />
              SDKs & Tools
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-3">
              {['Python SDK', 'JavaScript SDK', 'CLI Tool', 'Webhooks'].map((sdk) => (
                <div key={sdk} className="p-3 rounded-lg bg-muted/30 border border-border/50 text-center">
                  <div className="text-sm font-medium">{sdk}</div>
                  <Badge variant="outline" className="text-xs mt-1 text-green-500 border-green-500/30">
                    Available
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
