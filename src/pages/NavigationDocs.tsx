import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Book, 
  Zap, 
  BarChart3, 
  FileText, 
  Calculator, 
  MessageSquare,
  Keyboard,
  Download,
  Shield,
  TrendingUp,
  Target,
  HelpCircle,
  Lightbulb,
  Wrench,
  Users,
  Bot,
  CheckCircle2,
  AlertTriangle,
  LineChart,
  Layers,
  Globe
} from 'lucide-react';
import { NavigationDocsSEO } from '@/components/seo/PageSEO';

const NavigationDocs = () => {
  const platformFeatures = [
    {
      id: 'dashboard',
      name: 'Dashboard',
      icon: BarChart3,
      what: 'A centralized command center displaying your entire AI portfolio with real-time risk scores, financial exposure metrics, and compliance status across all monitored systems.',
      why: 'Enterprise AI deployments often span dozens of systems. Without unified visibility, governance gaps go unnoticed until they become costly incidents. The dashboard surfaces the 20% of issues causing 80% of risk.',
      how: [
        'Navigate to /dashboard or click "Dashboard" in the sidebar',
        'View aggregate risk scores and trend indicators',
        'Filter by risk tier, framework, or system type',
        'Click any system card to drill into detailed findings',
        'Use the financial risk widgets to understand potential exposure'
      ],
      path: '/dashboard'
    },
    {
      id: 'agents',
      name: 'AI Agents Registry',
      icon: Bot,
      what: 'A comprehensive inventory of all 25 governance agents with their operational status, checkpoint assignments, and performance metrics organized by tier (Enterprise, Business, Consumer) and stage (Development, Staging, Production).',
      why: 'Each AI agent has unique risk profiles and governance requirements. Tracking agents by tier ensures proportional oversight—enterprise agents get deeper scrutiny while consumer agents follow streamlined checks.',
      how: [
        'Access via /agents or sidebar navigation',
        'View agents grouped by tier with color-coded status indicators',
        'Check checkpoint counts to understand governance coverage',
        'Filter by stage to focus on production vs development systems',
        'Click any agent for detailed checkpoint breakdown'
      ],
      path: '/agents'
    },
    {
      id: 'checkpoints',
      name: 'Governance Checkpoints',
      icon: CheckCircle2,
      what: 'A library of 146 governance checkpoints spanning 8 pillars: Transparency, Fairness, Security, Privacy, Accountability, Robustness, Human Oversight, and Environmental Impact.',
      why: 'Consistent governance requires standardized evaluation criteria. Checkpoints translate abstract principles into measurable, auditable requirements that teams can implement and verify.',
      how: [
        'Browse checkpoints at /checkpoints',
        'Filter by pillar to focus on specific governance dimensions',
        'View checkpoint severity and remediation effort estimates',
        'See which checkpoints map to which regulatory frameworks',
        'Export checkpoint lists for audit documentation'
      ],
      path: '/checkpoints'
    },
    {
      id: 'security',
      name: 'Security Dashboard',
      icon: Shield,
      what: 'Dedicated security posture view showing vulnerability assessments, threat modeling results, and security-specific checkpoint compliance for AI systems.',
      why: 'AI systems face unique security threats—adversarial inputs, model extraction, data poisoning. Traditional security tools miss these AI-specific attack vectors that require specialized assessment.',
      how: [
        'Navigate to /security from the sidebar',
        'Review overall security score and trend',
        'Examine vulnerability breakdown by category',
        'Track remediation progress on security findings',
        'Generate security-focused compliance reports'
      ],
      path: '/security'
    },
    {
      id: 'maturity',
      name: 'Digital Maturity Assessment',
      icon: Layers,
      what: 'Organizational AI governance maturity scoring across 5 dimensions: Strategy, Data, Technology, People, and Process—with benchmarking against industry peers.',
      why: 'Point-in-time system assessments miss organizational capability gaps. Maturity assessment reveals whether your organization can sustain governance improvements long-term.',
      how: [
        'Access at /maturity',
        'Complete the maturity questionnaire for each dimension',
        'View radar chart comparing your scores to industry benchmarks',
        'Identify capability gaps requiring investment',
        'Track maturity progression over quarterly assessments'
      ],
      path: '/maturity'
    },
    {
      id: 'simulate',
      name: 'What-If Simulator',
      icon: LineChart,
      what: 'Monte Carlo simulation engine that models the financial impact of remediation decisions, showing probability distributions for fines, audit costs, and reputation damage.',
      why: 'Governance investments compete with feature development. Simulation quantifies the ROI of compliance work, enabling data-driven prioritization and executive-level business cases.',
      how: [
        'Open simulator at /simulate',
        'Select baseline scenario and remediation options',
        'Run 10,000 Monte Carlo iterations',
        'Analyze probability distributions for each outcome',
        'Compare scenarios to find optimal remediation strategy'
      ],
      path: '/simulate'
    }
  ];

  const tools = [
    {
      id: 'scout',
      name: 'Scout AI Assistant',
      icon: MessageSquare,
      shortcut: '⌘ + K',
      what: 'An AI-powered governance advisor that answers questions about regulations, interprets scan results, and provides remediation guidance in natural language.',
      why: 'Governance expertise is scarce and expensive. Scout democratizes access to regulatory knowledge, helping teams resolve issues without waiting for legal or compliance review.',
      how: [
        'Press ⌘+K anywhere in the platform',
        'Ask questions in natural language',
        'Get context-aware answers based on your current view',
        'Request specific remediation steps for findings',
        'Ask Scout to explain regulatory requirements'
      ]
    },
    {
      id: 'calculator',
      name: 'ROI Calculator',
      icon: Calculator,
      shortcut: '⌘ + R',
      what: 'Financial modeling tool that calculates return on governance investment by comparing remediation costs against expected fine reduction and risk mitigation.',
      why: 'Budget holders need concrete numbers. The calculator translates technical governance improvements into dollar-denominated business value that executives understand.',
      how: [
        'Press ⌘+R to open the calculator',
        'Input your organization size and industry',
        'Specify planned remediation investments',
        'View projected ROI and payback period',
        'Export financial projections for budget requests'
      ]
    },
    {
      id: 'export',
      name: 'PDF Export',
      icon: Download,
      shortcut: '⌘ + P',
      what: 'One-click report generation that exports dashboards, scan results, and compliance documentation as professionally formatted PDF files.',
      why: 'Auditors and executives need offline documentation. PDF export creates audit-ready artifacts without manual report assembly.',
      how: [
        'Press ⌘+P on any page',
        'Select report sections to include',
        'Choose formatting options',
        'Download the generated PDF',
        'Share with stakeholders or archive for compliance'
      ]
    }
  ];

  const apiEndpoints = [
    { 
      method: 'POST', 
      path: '/v1/scan', 
      description: 'Initiate a new AI system scan',
      what: 'Triggers a comprehensive governance assessment for a specified AI system, evaluating all 146 checkpoints.',
      params: 'system_id, scan_depth (quick|standard|deep), notify_on_complete'
    },
    { 
      method: 'GET', 
      path: '/v1/systems', 
      description: 'List all monitored systems',
      what: 'Returns paginated list of all AI systems in your organization with summary scores and status.',
      params: 'page, limit, tier, stage, min_score'
    },
    { 
      method: 'GET', 
      path: '/v1/systems/:id/score', 
      description: 'Get system risk score',
      what: 'Retrieves current risk score with breakdown by pillar and historical trend data.',
      params: 'include_history, history_days'
    },
    { 
      method: 'GET', 
      path: '/v1/reports/:id', 
      description: 'Download scan report',
      what: 'Generates and returns a PDF or JSON report for a completed scan.',
      params: 'format (pdf|json), sections[]'
    },
    { 
      method: 'POST', 
      path: '/v1/simulate', 
      description: 'Run remediation simulation',
      what: 'Executes Monte Carlo simulation with specified remediation parameters.',
      params: 'scenario_id, iterations, remediation_items[]'
    },
  ];

  const shortcuts = [
    { key: '⌘ + K', action: 'Open Scout AI', description: 'Launch the AI governance assistant for instant help' },
    { key: '⌘ + R', action: 'ROI Calculator', description: 'Open financial ROI calculator for governance investments' },
    { key: '⌘ + P', action: 'PDF Export', description: 'Export current view as a formatted PDF report' },
    { key: 'Esc', action: 'Close Dialog', description: 'Dismiss any open modal, dialog, or overlay' },
  ];

  return (
    <Layout>
      <NavigationDocsSEO />
      <div className="container py-8 space-y-8 max-w-5xl">
        {/* Header */}
        <div className="space-y-4">
          <h1 className="text-3xl font-light tracking-tight">METRIS Platform Documentation</h1>
          <p className="text-muted-foreground font-light text-lg leading-relaxed max-w-3xl">
            Complete guide to understanding and using the METRIS AI Governance Platform. 
            Each section explains <strong>what</strong> a feature does, <strong>why</strong> it matters for your organization, 
            and <strong>how</strong> to use it effectively.
          </p>
        </div>

        {/* Quick Reference Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-primary/10 shrink-0">
                <Target className="h-5 w-5 text-primary" />
              </div>
              <div>
                <p className="font-medium text-sm">What</p>
                <p className="text-xs text-muted-foreground font-light mt-1">
                  Clear description of feature capabilities and scope
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-secondary/20 bg-secondary/5">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-secondary/10 shrink-0">
                <Lightbulb className="h-5 w-5 text-secondary" />
              </div>
              <div>
                <p className="font-medium text-sm">Why</p>
                <p className="text-xs text-muted-foreground font-light mt-1">
                  Business value and problem it solves for governance teams
                </p>
              </div>
            </CardContent>
          </Card>
          <Card className="border-gold/20 bg-gold/5">
            <CardContent className="p-5 flex items-start gap-4">
              <div className="p-2.5 rounded-lg bg-gold/10 shrink-0">
                <Wrench className="h-5 w-5 text-gold" />
              </div>
              <div>
                <p className="font-medium text-sm">How</p>
                <p className="text-xs text-muted-foreground font-light mt-1">
                  Step-by-step instructions to get started immediately
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Tabs */}
        <Tabs defaultValue="getting-started" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 h-11">
            <TabsTrigger value="getting-started" className="font-light">Getting Started</TabsTrigger>
            <TabsTrigger value="features" className="font-light">Platform Features</TabsTrigger>
            <TabsTrigger value="tools" className="font-light">Tools & Shortcuts</TabsTrigger>
            <TabsTrigger value="api" className="font-light">API Reference</TabsTrigger>
          </TabsList>

          {/* Platform Features Tab */}
          <TabsContent value="features" className="space-y-4">
            <Accordion type="single" collapsible className="space-y-3">
              {platformFeatures.map((feature) => {
                const Icon = feature.icon;
                return (
                  <AccordionItem key={feature.id} value={feature.id} className="border rounded-lg px-4">
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-4 w-4 text-primary" />
                        </div>
                        <div className="text-left">
                          <p className="font-medium text-sm">{feature.name}</p>
                          <p className="text-xs text-muted-foreground font-light">{feature.path}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 space-y-4">
                      {/* What */}
                      <div className="p-4 rounded-lg bg-primary/5 border border-primary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Target className="h-4 w-4 text-primary" />
                          <span className="font-medium text-sm text-primary">What</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{feature.what}</p>
                      </div>
                      
                      {/* Why */}
                      <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Lightbulb className="h-4 w-4 text-secondary" />
                          <span className="font-medium text-sm text-secondary">Why</span>
                        </div>
                        <p className="text-sm text-foreground/80 leading-relaxed">{feature.why}</p>
                      </div>
                      
                      {/* How */}
                      <div className="p-4 rounded-lg bg-gold/5 border border-gold/10">
                        <div className="flex items-center gap-2 mb-2">
                          <Wrench className="h-4 w-4 text-gold" />
                          <span className="font-medium text-sm text-gold">How</span>
                        </div>
                        <ol className="text-sm text-foreground/80 space-y-1.5">
                          {feature.how.map((step, idx) => (
                            <li key={idx} className="flex items-start gap-2">
                              <span className="text-muted-foreground font-mono text-xs mt-0.5">{idx + 1}.</span>
                              <span>{step}</span>
                            </li>
                          ))}
                        </ol>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                );
              })}
            </Accordion>
          </TabsContent>

          {/* Tools & Shortcuts Tab */}
          <TabsContent value="tools" className="space-y-6">
            {/* Keyboard Shortcuts */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-light flex items-center gap-2">
                  <Keyboard className="h-5 w-5 text-primary" />
                  Keyboard Shortcuts
                </CardTitle>
                <CardDescription className="font-light">
                  Quick access to platform tools from anywhere
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {shortcuts.map((shortcut, idx) => (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-lg bg-muted/30">
                      <Badge variant="outline" className="font-mono text-xs px-3 py-1.5 shrink-0">
                        {shortcut.key}
                      </Badge>
                      <div>
                        <p className="font-medium text-sm">{shortcut.action}</p>
                        <p className="text-xs text-muted-foreground font-light">{shortcut.description}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Tools Detail */}
            <div className="space-y-4">
              {tools.map((tool) => {
                const Icon = tool.icon;
                return (
                  <Card key={tool.id}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-base font-light flex items-center gap-2">
                          <Icon className="h-5 w-5 text-primary" />
                          {tool.name}
                        </CardTitle>
                        <Badge variant="secondary" className="font-mono text-xs">
                          {tool.shortcut}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Target className="h-3.5 w-3.5 text-primary" />
                            <span className="font-medium text-xs text-primary">What</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">{tool.what}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Lightbulb className="h-3.5 w-3.5 text-secondary" />
                            <span className="font-medium text-xs text-secondary">Why</span>
                          </div>
                          <p className="text-xs text-foreground/80 leading-relaxed">{tool.why}</p>
                        </div>
                        <div className="p-3 rounded-lg bg-gold/5 border border-gold/10">
                          <div className="flex items-center gap-2 mb-1.5">
                            <Wrench className="h-3.5 w-3.5 text-gold" />
                            <span className="font-medium text-xs text-gold">How</span>
                          </div>
                          <ol className="text-xs text-foreground/80 space-y-0.5">
                            {tool.how.slice(0, 3).map((step, idx) => (
                              <li key={idx}>{idx + 1}. {step}</li>
                            ))}
                          </ol>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          {/* API Reference Tab */}
          <TabsContent value="api" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-light flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  REST API Reference
                </CardTitle>
                <CardDescription className="font-light">
                  Integrate METRIS governance data into your CI/CD pipelines and internal tools
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {apiEndpoints.map((endpoint, idx) => (
                  <div key={idx} className="p-4 rounded-lg border border-border/50 space-y-3">
                    <div className="flex items-center gap-3">
                      <Badge 
                        variant="outline" 
                        className={`font-mono text-xs w-16 justify-center ${
                          endpoint.method === 'POST' ? 'text-primary border-primary/30 bg-primary/5' : 'text-secondary border-secondary/30 bg-secondary/5'
                        }`}
                      >
                        {endpoint.method}
                      </Badge>
                      <code className="text-sm font-mono text-foreground">{endpoint.path}</code>
                    </div>
                    <p className="text-sm text-foreground/80">{endpoint.what}</p>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-muted-foreground">Parameters:</span>
                      <code className="text-xs font-mono text-muted-foreground bg-muted/50 px-2 py-0.5 rounded">
                        {endpoint.params}
                      </code>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* API Authentication */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-light flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Authentication
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="p-3 rounded-lg bg-muted/30">
                  <p className="text-sm font-light">All API requests require Bearer token authentication:</p>
                  <code className="block mt-2 text-xs font-mono bg-background p-2 rounded border">
                    Authorization: Bearer YOUR_API_KEY
                  </code>
                </div>
                <p className="text-xs text-muted-foreground font-light">
                  Generate API keys in your organization settings. Keys inherit the permissions of the creating user.
                </p>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Getting Started Tab */}
          <TabsContent value="getting-started" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-light flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  Quick Start Guide
                </CardTitle>
                <CardDescription className="font-light">
                  Get value from METRIS in under 30 minutes
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Step 1 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
                    1
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="font-medium">Register Your AI Systems</p>
                    <p className="text-sm text-muted-foreground font-light">
                      Add your AI systems to METRIS by providing basic metadata: name, description, deployment stage, and tier classification. 
                      This creates your governance inventory.
                    </p>
                    <div className="p-3 rounded-lg bg-primary/5 border border-primary/10">
                      <p className="text-xs font-medium text-primary mb-1">What you need:</p>
                      <ul className="text-xs text-foreground/80 space-y-0.5">
                        <li>• System name and description</li>
                        <li>• Deployment stage (Development, Staging, Production)</li>
                        <li>• Business tier (Enterprise, Business, Consumer)</li>
                        <li>• Primary use case and data types processed</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 2 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
                    2
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="font-medium">Run Your First Governance Scan</p>
                    <p className="text-sm text-muted-foreground font-light">
                      Initiate a baseline scan to evaluate your system against all 146 governance checkpoints. 
                      The scan takes 2-5 minutes and produces a comprehensive risk score.
                    </p>
                    <div className="p-3 rounded-lg bg-secondary/5 border border-secondary/10">
                      <p className="text-xs font-medium text-secondary mb-1">Scan outputs include:</p>
                      <ul className="text-xs text-foreground/80 space-y-0.5">
                        <li>• Overall risk score (0-1000 scale)</li>
                        <li>• Pillar-by-pillar breakdown</li>
                        <li>• Specific checkpoint findings</li>
                        <li>• Remediation priority ranking</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 3 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
                    3
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="font-medium">Review Findings & Prioritize</p>
                    <p className="text-sm text-muted-foreground font-light">
                      Use the Dashboard to review findings across your portfolio. Focus on high-severity items first, 
                      using the What-If Simulator to model financial impact of remediation options.
                    </p>
                    <div className="p-3 rounded-lg bg-gold/5 border border-gold/10">
                      <p className="text-xs font-medium text-gold mb-1">Pro tips:</p>
                      <ul className="text-xs text-foreground/80 space-y-0.5">
                        <li>• Press ⌘+K to ask Scout AI for remediation guidance</li>
                        <li>• Use ⌘+R to calculate ROI before prioritizing fixes</li>
                        <li>• Export findings with ⌘+P for team discussion</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Step 4 */}
                <div className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium shrink-0">
                    4
                  </div>
                  <div className="space-y-2 flex-1">
                    <p className="font-medium">Implement & Re-scan</p>
                    <p className="text-sm text-muted-foreground font-light">
                      Address prioritized findings and run follow-up scans to verify improvements. 
                      Track score progression over time to demonstrate governance ROI to stakeholders.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="text-base font-light flex items-center gap-2">
                  <HelpCircle className="h-5 w-5 text-primary" />
                  Frequently Asked Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="faq-1" className="border-none">
                    <AccordionTrigger className="text-sm font-normal hover:no-underline py-3 px-3 rounded-lg bg-muted/30">
                      How long does a governance scan take?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light px-3 pt-2">
                      Quick scans complete in 1-2 minutes, standard scans in 3-5 minutes, and deep scans in 10-15 minutes. 
                      Scan depth affects the number of checkpoints evaluated and evidence collection depth.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-2" className="border-none">
                    <AccordionTrigger className="text-sm font-normal hover:no-underline py-3 px-3 rounded-lg bg-muted/30">
                      What regulatory frameworks does METRIS support?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light px-3 pt-2">
                      METRIS maps findings to EU AI Act, NIST AI RMF, ISO 42001, SOC 2 Type II, and GDPR. 
                      Framework mapping is automatic based on checkpoint categories.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-3" className="border-none">
                    <AccordionTrigger className="text-sm font-normal hover:no-underline py-3 px-3 rounded-lg bg-muted/30">
                      Can I integrate METRIS with my CI/CD pipeline?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light px-3 pt-2">
                      Yes! Use the REST API to trigger scans on deployment, gate releases based on score thresholds, 
                      and track governance metrics alongside code quality.
                    </AccordionContent>
                  </AccordionItem>
                  <AccordionItem value="faq-4" className="border-none">
                    <AccordionTrigger className="text-sm font-normal hover:no-underline py-3 px-3 rounded-lg bg-muted/30">
                      How are risk scores calculated?
                    </AccordionTrigger>
                    <AccordionContent className="text-sm text-muted-foreground font-light px-3 pt-2">
                      Scores are weighted averages across 8 governance pillars, with weights adjusted based on system tier 
                      and regulatory requirements. Higher scores indicate lower risk (1000 = fully compliant).
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </Layout>
  );
};

export default NavigationDocs;
