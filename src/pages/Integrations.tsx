import { useState } from 'react';
import { Layout } from '@/components/layout/Layout';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Check, ExternalLink, Lock, ArrowDownToLine, ArrowUpFromLine,
  Github, FileText, Database, Cloud, Key, Globe, Upload,
  Slack, Mail, Webhook, Bell, GitBranch, BarChart3, Activity
} from 'lucide-react';

// Integration data organized by category
const integrationCategories = [
  {
    id: 'code',
    title: 'Code',
    description: 'Import & scan your repositories for AI governance artifacts',
    direction: 'in',
    integrations: [
      {
        id: 'github',
        name: 'GitHub',
        icon: 'github',
        description: 'Scan repositories, model cards, README, SECURITY.md',
        scopes: ['Read repository contents', 'Read organization metadata', 'Access documentation files'],
        status: 'available' as const,
      },
      {
        id: 'gitlab',
        name: 'GitLab',
        icon: 'gitlab',
        description: 'Connect GitLab repos and CI/CD configs',
        scopes: ['Read repository contents', 'Read project metadata', 'Read CI configs'],
        status: 'coming_soon' as const,
      },
      {
        id: 'bitbucket',
        name: 'Bitbucket',
        icon: 'bitbucket',
        description: 'Analyze Bitbucket repositories and pipelines',
        scopes: ['Read repository contents', 'Read workspace info', 'Read pipelines'],
        status: 'coming_soon' as const,
      },
    ],
  },
  {
    id: 'documents',
    title: 'Documents',
    description: 'Import governance policies, procedures, and evidence',
    direction: 'in',
    integrations: [
      {
        id: 'google-drive',
        name: 'Google Drive',
        icon: 'drive',
        description: 'Import policies, assessments, and documentation',
        scopes: ['Read file contents', 'Read file metadata', 'Access shared drives'],
        status: 'available' as const,
      },
      {
        id: 'notion',
        name: 'Notion',
        icon: 'notion',
        description: 'Connect Notion workspaces and databases',
        scopes: ['Read pages', 'Read databases', 'Read comments'],
        status: 'available' as const,
      },
      {
        id: 'confluence',
        name: 'Confluence',
        icon: 'confluence',
        description: 'Import Confluence spaces and pages',
        scopes: ['Read spaces', 'Read pages', 'Read attachments'],
        status: 'coming_soon' as const,
      },
      {
        id: 'sharepoint',
        name: 'SharePoint',
        icon: 'sharepoint',
        description: 'Connect SharePoint sites and document libraries',
        scopes: ['Read sites', 'Read documents', 'Read lists'],
        status: 'coming_soon' as const,
      },
      {
        id: 'file-upload',
        name: 'File Upload',
        icon: 'upload',
        description: 'Upload governance documents directly',
        scopes: ['PDF, DOCX, TXT, MD supported', 'Max 50MB per file'],
        status: 'available' as const,
        action: 'upload' as const,
      },
    ],
  },
  {
    id: 'ai-platforms',
    title: 'AI Platforms',
    description: 'Monitor your ML infrastructure, models, and experiments',
    direction: 'in',
    integrations: [
      {
        id: 'aws-sagemaker',
        name: 'AWS SageMaker',
        icon: 'aws',
        description: 'Monitor SageMaker models and endpoints',
        scopes: ['Read model metadata', 'Read endpoint configs', 'Access model registry'],
        status: 'coming_soon' as const,
      },
      {
        id: 'azure-ml',
        name: 'Azure ML',
        icon: 'azure',
        description: 'Connect Azure Machine Learning workspaces',
        scopes: ['Read workspaces', 'Read models', 'Read experiments'],
        status: 'coming_soon' as const,
      },
      {
        id: 'gcp-vertex',
        name: 'GCP Vertex AI',
        icon: 'gcp',
        description: 'Monitor Vertex AI models and pipelines',
        scopes: ['Read models', 'Read pipelines', 'Read endpoints'],
        status: 'coming_soon' as const,
      },
      {
        id: 'huggingface',
        name: 'Hugging Face',
        icon: 'huggingface',
        description: 'Analyze models and datasets from HF Hub',
        scopes: ['Read model cards', 'Read datasets', 'Read spaces'],
        status: 'available' as const,
      },
      {
        id: 'mlflow',
        name: 'MLflow',
        icon: 'mlflow',
        description: 'Connect MLflow tracking server',
        scopes: ['Read experiments', 'Read runs', 'Read model registry'],
        status: 'coming_soon' as const,
      },
      {
        id: 'wandb',
        name: 'Weights & Biases',
        icon: 'wandb',
        description: 'Import W&B experiments and artifacts',
        scopes: ['Read projects', 'Read runs', 'Read artifacts'],
        status: 'coming_soon' as const,
      },
      {
        id: 'datadog',
        name: 'Datadog',
        icon: 'datadog',
        description: 'Import ML metrics and monitors',
        scopes: ['Read metrics', 'Read monitors', 'Read dashboards'],
        status: 'coming_soon' as const,
      },
    ],
  },
  {
    id: 'direct-access',
    title: 'Direct Access',
    description: 'Connect via URL scanning or API',
    direction: 'in',
    integrations: [
      {
        id: 'website',
        name: 'Website URL',
        icon: 'globe',
        description: 'Scan public-facing AI documentation and disclosures',
        scopes: ['Read public pages', 'Analyze AI disclosures', 'Check privacy policy'],
        status: 'available' as const,
        action: 'scan' as const,
      },
      {
        id: 'api',
        name: 'API Key',
        icon: 'key',
        description: 'Programmatic access to METRIS platform',
        scopes: ['Full API access', 'Webhook notifications', 'Batch operations'],
        status: 'available' as const,
        action: 'generate' as const,
      },
    ],
  },
  {
    id: 'continuous-monitoring',
    title: 'Continuous Monitoring',
    description: 'Get alerts, automate CI/CD gates, and sync with your workflow tools',
    direction: 'out',
    subsections: [
      {
        title: 'Alerts & Notifications',
        integrations: [
          {
            id: 'slack',
            name: 'Slack',
            icon: 'slack',
            description: 'Alert channels on score drops, drift, checkpoint failures',
            scopes: ['Post to channels', 'Send DMs', 'Create threads'],
            status: 'available' as const,
            action: 'configure' as const,
          },
          {
            id: 'email',
            name: 'Email',
            icon: 'mail',
            description: 'Weekly digests, critical alerts, audit reminders',
            scopes: ['Send alerts', 'Weekly summaries', 'Custom schedules'],
            status: 'available' as const,
            action: 'configure' as const,
          },
          {
            id: 'webhooks',
            name: 'Webhooks',
            icon: 'webhook',
            description: 'Push events to any system (Zapier, n8n, custom)',
            scopes: ['Score changes', 'Checkpoint failures', 'Drift alerts'],
            status: 'available' as const,
            action: 'configure' as const,
          },
          {
            id: 'pagerduty',
            name: 'PagerDuty',
            icon: 'pagerduty',
            description: 'Critical alerts for on-call teams',
            scopes: ['Create incidents', 'Set severity', 'Auto-resolve'],
            status: 'coming_soon' as const,
          },
        ],
      },
      {
        title: 'CI/CD Gates',
        integrations: [
          {
            id: 'github-actions',
            name: 'GitHub Actions',
            icon: 'github',
            description: 'Block PR merge if governance check fails',
            scopes: ['Status checks', 'PR comments', 'Workflow triggers'],
            status: 'available' as const,
            action: 'configure' as const,
          },
          {
            id: 'jenkins',
            name: 'Jenkins',
            icon: 'jenkins',
            description: 'Add governance gate to CI/CD pipeline',
            scopes: ['Pipeline step', 'Build status', 'Artifact scanning'],
            status: 'coming_soon' as const,
          },
          {
            id: 'gitlab-ci',
            name: 'GitLab CI',
            icon: 'gitlab',
            description: 'Integrate with GitLab CI/CD pipelines',
            scopes: ['Pipeline jobs', 'Merge request checks', 'Environment gates'],
            status: 'coming_soon' as const,
          },
        ],
      },
      {
        title: 'Ticketing & Workflows',
        integrations: [
          {
            id: 'jira',
            name: 'Jira',
            icon: 'jira',
            description: 'Auto-create tickets for remediation tasks',
            scopes: ['Create issues', 'Update status', 'Link to checkpoints'],
            status: 'available' as const,
            action: 'configure' as const,
          },
          {
            id: 'servicenow',
            name: 'ServiceNow',
            icon: 'servicenow',
            description: 'Sync with IT service management',
            scopes: ['Create incidents', 'Change requests', 'CMDB updates'],
            status: 'coming_soon' as const,
          },
          {
            id: 'asana',
            name: 'Asana',
            icon: 'asana',
            description: 'Create tasks and track remediation',
            scopes: ['Create tasks', 'Update projects', 'Assign owners'],
            status: 'coming_soon' as const,
          },
          {
            id: 'linear',
            name: 'Linear',
            icon: 'linear',
            description: 'Sync issues with Linear projects',
            scopes: ['Create issues', 'Update status', 'Link cycles'],
            status: 'coming_soon' as const,
          },
        ],
      },
    ],
  },
];

interface Integration {
  id: string;
  name: string;
  icon: string;
  description: string;
  scopes: string[];
  status: 'available' | 'coming_soon' | 'connected';
  action?: 'configure' | 'generate' | 'scan' | 'upload';
}

interface IntegrationModalProps {
  integration: Integration | null;
  isOpen: boolean;
  onClose: () => void;
}

function IntegrationModal({ integration, isOpen, onClose }: IntegrationModalProps) {
  if (!integration) return null;

  const isComingSoon = integration.status === 'coming_soon';
  const isConfigureAction = integration.action === 'configure';

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <span className="text-primary text-lg font-bold">
                {integration.name.charAt(0)}
              </span>
            </div>
            {isConfigureAction ? 'Configure' : 'Connect to'} {integration.name}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          {isComingSoon ? (
            <>
              <div className="text-center py-6">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Lock className="h-8 w-8 text-muted-foreground" />
                </div>
                <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
                <p className="text-muted-foreground text-sm">
                  {integration.name} integration is currently in development.
                  Join the waitlist to get notified when it's ready.
                </p>
              </div>
              <Button className="w-full" variant="outline">
                Join Waitlist
              </Button>
            </>
          ) : isConfigureAction ? (
            <>
              <p className="text-sm text-muted-foreground">
                Configure when METRIS sends alerts to {integration.name}:
              </p>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Score drops below threshold</Label>
                    <p className="text-xs text-muted-foreground">Alert when score falls below 600</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Drift detected</Label>
                    <p className="text-xs text-muted-foreground">Alert when PSI exceeds 0.20</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Checkpoint failure</Label>
                    <p className="text-xs text-muted-foreground">Alert on critical checkpoint failures</p>
                  </div>
                  <Switch defaultChecked />
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <Label>Weekly digest</Label>
                    <p className="text-xs text-muted-foreground">Summary every Monday at 9am</p>
                  </div>
                  <Switch />
                </div>
              </div>

              {integration.id === 'slack' && (
                <div className="space-y-2">
                  <Label>Slack Channel</Label>
                  <Input placeholder="#ai-governance" />
                </div>
              )}

              {integration.id === 'email' && (
                <div className="space-y-2">
                  <Label>Email Recipients</Label>
                  <Input placeholder="team@company.com, cto@company.com" />
                </div>
              )}

              {integration.id === 'webhooks' && (
                <div className="space-y-2">
                  <Label>Webhook URL</Label>
                  <Input placeholder="https://your-server.com/webhook" />
                </div>
              )}

              {integration.id === 'github-actions' && (
                <div className="space-y-2">
                  <Label>Repository</Label>
                  <Input placeholder="org/repo" />
                </div>
              )}

              {integration.id === 'jira' && (
                <div className="space-y-2">
                  <Label>Jira Project Key</Label>
                  <Input placeholder="GOV" />
                </div>
              )}

              <Button className="w-full">
                Save Configuration
              </Button>
            </>
          ) : (
            <>
              <p className="text-sm text-muted-foreground">
                METRIS will request the following permissions:
              </p>

              <div className="space-y-2">
                {integration.scopes.map((scope, index) => (
                  <div key={index} className="flex items-center gap-2 text-sm">
                    <Check className="h-4 w-4 text-primary" />
                    <span>{scope}</span>
                  </div>
                ))}
              </div>

              <div className="bg-muted/50 rounded-lg p-3 text-xs text-muted-foreground">
                <p>
                  Your data is encrypted in transit and at rest. METRIS only reads 
                  the data needed for governance analysis and never modifies your systems.
                </p>
              </div>

              <Button className="w-full gap-2">
                <ExternalLink className="h-4 w-4" />
                {integration.action === 'generate' ? 'Generate API Key' : 
                 integration.action === 'scan' ? 'Start Scan' :
                 integration.action === 'upload' ? 'Upload Files' :
                 `Authorize ${integration.name}`}
              </Button>

              <p className="text-xs text-center text-muted-foreground">
                You can revoke access at any time from Settings
              </p>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

function IntegrationCard({ 
  integration, 
  onConnect 
}: { 
  integration: Integration; 
  onConnect: (i: Integration) => void;
}) {
  return (
    <Card className="relative hover:border-primary/50 transition-colors">
      {integration.status === 'coming_soon' && (
        <Badge 
          variant="secondary" 
          className="absolute top-3 right-3 text-xs"
        >
          Coming Soon
        </Badge>
      )}
      {integration.status === 'connected' && (
        <Badge 
          className="absolute top-3 right-3 text-xs bg-emerald-500"
        >
          Connected
        </Badge>
      )}

      <CardContent className="p-5">
        <div className="flex items-start gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-bold">
              {integration.name.charAt(0)}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold">{integration.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {integration.description}
            </p>
          </div>
        </div>

        <Button
          className="w-full"
          variant={integration.status === 'connected' ? 'outline' : 'default'}
          size="sm"
          onClick={() => onConnect(integration)}
        >
          {integration.status === 'connected' 
            ? 'Manage' 
            : integration.action === 'generate'
            ? 'Generate Key'
            : integration.action === 'scan'
            ? 'Enter URL'
            : integration.action === 'upload'
            ? 'Upload Files'
            : integration.action === 'configure'
            ? 'Configure'
            : 'Connect'
          }
        </Button>
      </CardContent>
    </Card>
  );
}

export default function Integrations() {
  const [selectedIntegration, setSelectedIntegration] = useState<Integration | null>(null);
  const [modalOpen, setModalOpen] = useState(false);

  const handleConnect = (integration: Integration) => {
    setSelectedIntegration(integration);
    setModalOpen(true);
  };

  return (
    <Layout>
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Connect Your Ecosystem
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Integrations</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Connect your AI systems, documents, and infrastructure to METRIS 
            for comprehensive governance monitoring.
          </p>
        </div>

        {/* Integration Categories */}
        <div className="space-y-16">
          {integrationCategories.map((category) => (
            <div key={category.id}>
              {/* Category Header */}
              <div className="flex items-center gap-3 mb-6">
                <div className={`p-2 rounded-lg ${
                  category.direction === 'out' 
                    ? 'bg-amber-500/10' 
                    : 'bg-primary/10'
                }`}>
                  {category.direction === 'out' ? (
                    <ArrowUpFromLine className="h-5 w-5 text-amber-500" />
                  ) : (
                    <ArrowDownToLine className="h-5 w-5 text-primary" />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-semibold">{category.title}</h2>
                  <p className="text-muted-foreground">{category.description}</p>
                </div>
                <Badge variant="outline" className="ml-auto">
                  {category.direction === 'out' ? 'Alerts OUT' : 'Data IN'}
                </Badge>
              </div>

              {/* Regular integrations */}
              {'integrations' in category && category.integrations && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {category.integrations.map((integration) => (
                    <IntegrationCard
                      key={integration.id}
                      integration={integration}
                      onConnect={handleConnect}
                    />
                  ))}
                </div>
              )}

              {/* Subsections (for Continuous Monitoring) */}
              {'subsections' in category && category.subsections && (
                <div className="space-y-8">
                  {category.subsections.map((subsection) => (
                    <div key={subsection.title}>
                      <h3 className="text-lg font-medium text-muted-foreground mb-4 flex items-center gap-2">
                        <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                        {subsection.title}
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                        {subsection.integrations.map((integration) => (
                          <IntegrationCard
                            key={integration.id}
                            integration={integration}
                            onConnect={handleConnect}
                          />
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-16 text-center">
          <Card className="inline-block max-w-md">
            <CardContent className="p-8">
              <h3 className="text-xl font-semibold mb-2">Need a custom integration?</h3>
              <p className="text-muted-foreground mb-4">
                We can build custom connectors for your specific infrastructure.
              </p>
              <Button variant="outline">Contact Us</Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Integration Modal */}
      <IntegrationModal
        integration={selectedIntegration}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
      />
    </Layout>
  );
}
