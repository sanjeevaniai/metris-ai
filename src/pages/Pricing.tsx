import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { 
  Check, 
  ArrowRight, 
  BarChart3, 
  DollarSign, 
  Users, 
  ListChecks,
  Zap,
  RefreshCw,
  Sparkles
} from 'lucide-react';

// What every tier includes
const coreFeatures = [
  { icon: BarChart3, label: 'NUMBERS', description: 'Governance score (0-1000) with confidence intervals' },
  { icon: DollarSign, label: 'DOLLARS', description: 'Risk exposure in real dollars (VaR, CVaR, Expected Loss)' },
  { icon: Users, label: 'HUMANS', description: 'Traceability to humans affected by AI decisions' },
  { icon: ListChecks, label: 'RECOMMENDATIONS', description: 'ROI-prioritized fixes — what to fix first and why' },
];

// Pricing tiers
const tiers = [
  {
    id: 'starter',
    name: 'STARTER',
    price: '$25,000',
    period: ' onwards',
    description: 'Know where you stand. Get your baseline.',
    highlight: false,
    cta: 'Get Started',
    ctaVariant: 'outline' as const,
    href: '/assess',
    features: [
      { text: 'Full METRIS assessment', included: true },
      { text: 'Score (0-1000) with 95% confidence interval', included: true },
      { text: 'Risk exposure: VaR, CVaR, Expected Loss', included: true },
      { text: 'Humans affected calculation', included: true },
      { text: 'ROI-prioritized recommendations', included: true },
      { text: '1,900+ checkpoints evaluated', included: true },
      { text: '50+ jurisdictions covered', included: true },
      { text: 'Audit-ready PDF report', included: true },
      { text: 'Scout AI conversation', included: true },
      { text: 'CI/CD continuous monitoring', included: false },
      { text: 'Real-time alerts', included: false },
      { text: 'Unlimited re-assessments', included: false },
    ],
    bestFor: 'First-time assessment, due diligence, point-in-time snapshot',
  },
  {
    id: 'professional',
    name: 'PROFESSIONAL',
    price: '$50,000',
    period: '/year',
    description: 'Stay audit-ready. Continuously.',
    highlight: true,
    badge: 'MOST POPULAR',
    cta: 'Start Free Trial',
    ctaVariant: 'default' as const,
    href: '/contact',
    features: [
      { text: 'Everything in Starter', included: true, bold: true },
      { text: 'CI/CD continuous monitoring', included: true },
      { text: 'Real-time score updates', included: true },
      { text: 'Drift detection & alerts', included: true },
      { text: 'Slack & Email notifications', included: true },
      { text: 'Unlimited re-assessments', included: true },
      { text: 'GitHub Actions integration', included: true },
      { text: 'Trend tracking & forecasting', included: true },
      { text: 'Quarterly executive reports', included: true },
      { text: 'Jira integration for remediation', included: true },
      { text: 'Custom integrations', included: false },
      { text: 'Dedicated success manager', included: false },
    ],
    bestFor: 'Ongoing compliance, EU AI Act preparation, continuous improvement',
  },
  {
    id: 'enterprise',
    name: 'ENTERPRISE',
    price: 'Custom',
    period: '',
    description: 'Governance at scale. Your way.',
    highlight: false,
    cta: 'Contact Sales',
    ctaVariant: 'outline' as const,
    href: '/contact',
    features: [
      { text: 'Everything in Professional', included: true, bold: true },
      { text: 'Custom integrations', included: true },
      { text: 'Dedicated success manager', included: true },
      { text: 'SLA guarantees', included: true },
      { text: 'On-premise deployment option', included: true },
      { text: 'Custom checkpoint development', included: true },
      { text: 'Multi-system governance', included: true },
      { text: 'Board-ready reporting', included: true },
      { text: 'Partner ecosystem access', included: true },
      { text: 'Volume discounts', included: true },
      { text: 'Custom training', included: true },
      { text: 'Audit liaison support', included: true },
    ],
    bestFor: 'Large enterprises, regulated industries, multiple AI systems',
  },
];

// FAQ items
const faqs = [
  {
    question: 'What do I get with every tier?',
    answer: 'Every tier includes: your governance SCORE (0-1000), RISK in dollars (VaR, CVaR), HUMANS affected traceability, and prioritized RECOMMENDATIONS. The difference is frequency — Starter is one-time, Professional is continuous.',
  },
  {
    question: 'Does METRIS implement the fixes?',
    answer: 'No. METRIS assesses, scores, and recommends. Your team (or our implementation partners) implements the fixes. Then METRIS verifies via CI/CD and re-scores automatically. We assess. You fix. We verify.',
  },
  {
    question: 'How does continuous monitoring work?',
    answer: 'Connect your GitHub, documents, or AI platforms. METRIS monitors for changes and automatically re-scores when something changes. You get alerts when your score drops or drift is detected.',
  },
  {
    question: 'What frameworks do you cover?',
    answer: 'EU AI Act, ISO 42001, NIST AI RMF, GDPR (AI provisions), SOC 2 (AI controls), HIPAA (AI), NYC Local Law 144, Colorado SB24-205, and 50+ other jurisdictions. 1,900+ checkpoints total.',
  },
  {
    question: 'Can I try before I buy?',
    answer: 'Yes. Start a free conversation with Scout AI to see how the assessment works. Professional tier includes a 14-day free trial with full CI/CD monitoring.',
  },
  {
    question: 'What if I need help implementing?',
    answer: 'We have a network of implementation partners who can help. Visit our Partnerships page to find certified consultants who specialize in AI governance implementation.',
  },
];

export default function Pricing() {
  return (
    <div className="min-h-screen bg-background pt-2">
      <PublicHeader />
      
      <div className="container py-12">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Simple Pricing
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Pricing
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-6">
            One assessment. Three answers. Clear pricing.
          </p>
          <p className="text-lg text-primary font-medium">
            NUMBERS · DOLLARS · HUMANS — included in every tier.
          </p>
        </div>

        {/* Core Features Banner */}
        <div className="mb-12">
          <Card className="bg-primary/5 border-primary/20">
            <CardContent className="p-6">
              <p className="text-center text-sm text-muted-foreground mb-4">
                EVERY TIER INCLUDES
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {coreFeatures.map((feature) => {
                  const IconComponent = feature.icon;
                  return (
                    <div key={feature.label} className="text-center">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <p className="font-semibold text-sm">{feature.label}</p>
                      <p className="text-xs text-muted-foreground">{feature.description}</p>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-16">
          {tiers.map((tier) => (
            <Card 
              key={tier.id}
              className={`relative flex flex-col ${
                tier.highlight 
                  ? 'border-primary shadow-lg shadow-primary/10 md:scale-105' 
                  : 'border-border'
              }`}
            >
              {tier.badge && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary">
                  {tier.badge}
                </Badge>
              )}
              
              <CardHeader className="text-center pb-4">
                <p className="text-sm font-semibold text-primary tracking-wider mb-2">
                  {tier.name}
                </p>
                <div className="mb-2">
                  <span className="text-4xl font-bold">{tier.price}</span>
                  <span className="text-muted-foreground">{tier.period}</span>
                </div>
                <p className="text-muted-foreground text-sm">
                  {tier.description}
                </p>
              </CardHeader>
              
              <CardContent className="flex-1 flex flex-col">
                <ul className="space-y-3 mb-6 flex-1">
                  {tier.features.map((feature, i) => (
                    <li key={i} className="flex items-start gap-2">
                      {feature.included ? (
                        <Check className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                      ) : (
                        <div className="h-5 w-5 flex-shrink-0" />
                      )}
                      <span className={`text-sm ${
                        !feature.included 
                          ? 'text-muted-foreground/50 line-through' 
                          : feature.bold 
                          ? 'font-semibold' 
                          : ''
                      }`}>
                        {feature.text}
                      </span>
                    </li>
                  ))}
                </ul>
                
                <div className="mt-auto">
                  <Link to={tier.href}>
                    <Button 
                      className="w-full mb-3" 
                      variant={tier.ctaVariant}
                      size="lg"
                    >
                      {tier.cta}
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </Link>
                  <p className="text-xs text-center text-muted-foreground">
                    Best for: {tier.bestFor}
                  </p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* The Loop Reminder */}
        <div className="mb-16">
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-8 text-center">
              <h3 className="text-xl font-semibold mb-4">
                We Assess. You Implement. We Verify.
              </h3>
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8 mb-6">
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <BarChart3 className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-medium">METRIS Scores</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-muted border-2 border-primary flex items-center justify-center">
                    <Zap className="h-5 w-5 text-primary" />
                  </div>
                  <span className="font-medium">You Fix</span>
                </div>
                <ArrowRight className="h-5 w-5 text-muted-foreground hidden md:block" />
                <div className="flex items-center gap-2">
                  <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center">
                    <RefreshCw className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <span className="font-medium">METRIS Re-scores</span>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Professional and Enterprise tiers include CI/CD integration for automatic re-scoring.
                <br />
                Need help implementing? Check out our <Link to="/partners" className="text-primary underline">Implementation Partners</Link>.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Compare Features Table */}
        <div className="mb-16 overflow-x-auto">
          <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-border">
                <th className="text-left p-4 font-medium">Feature</th>
                <th className="text-center p-4 font-medium">Starter</th>
                <th className="text-center p-4 font-medium bg-primary/5">Professional</th>
                <th className="text-center p-4 font-medium">Enterprise</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Governance Score (0-1000)</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Risk Exposure ($)</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Humans Affected</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">ROI Recommendations</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">PDF Report</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Checkpoints Evaluated</td>
                <td className="text-center p-4">1,900+</td>
                <td className="text-center p-4 bg-primary/5">1,900+</td>
                <td className="text-center p-4">Custom</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Assessments</td>
                <td className="text-center p-4">1</td>
                <td className="text-center p-4 bg-primary/5">Unlimited</td>
                <td className="text-center p-4">Unlimited</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">CI/CD Monitoring</td>
                <td className="text-center p-4 text-muted-foreground">—</td>
                <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Real-time Alerts</td>
                <td className="text-center p-4 text-muted-foreground">—</td>
                <td className="text-center p-4 bg-primary/5"><Check className="h-5 w-5 text-primary mx-auto" /></td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Integrations</td>
                <td className="text-center p-4">Basic</td>
                <td className="text-center p-4 bg-primary/5">Standard</td>
                <td className="text-center p-4">Custom</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">Support</td>
                <td className="text-center p-4">Email</td>
                <td className="text-center p-4 bg-primary/5">Priority</td>
                <td className="text-center p-4">Dedicated</td>
              </tr>
              <tr className="border-b border-border/50">
                <td className="p-4 font-medium">SLA</td>
                <td className="text-center p-4 text-muted-foreground">—</td>
                <td className="text-center p-4 bg-primary/5 text-muted-foreground">—</td>
                <td className="text-center p-4"><Check className="h-5 w-5 text-primary mx-auto" /></td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* FAQ Section */}
        <div className="mb-16">
          <h2 className="text-2xl font-bold text-center mb-8">Frequently Asked Questions</h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {faqs.map((faq, i) => (
              <Card key={i}>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom CTA */}
        <div className="text-center">
          <Card className="inline-block max-w-xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="p-8">
              <Sparkles className="h-10 w-10 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Not sure which plan?</h2>
              <p className="text-muted-foreground mb-6">
                Start a free conversation with Scout AI. See your risk tier 
                and sample recommendations before you commit.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link to="/assess">
                  <Button size="lg" className="gap-2">
                    Talk to Scout — Free
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link to="/contact">
                  <Button size="lg" variant="outline">
                    Schedule a Demo
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-12 text-center">
          <p className="text-xs text-muted-foreground max-w-2xl mx-auto">
            * METRIS provides assessment, scoring, and recommendations. Implementation 
            is done by your team or our <Link to="/partners" className="text-primary underline">implementation partners</Link>. 
            All prices in USD. Enterprise pricing based on scope and requirements.
          </p>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="container flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-primary flex items-center justify-center">
              <span className="text-primary-foreground font-bold text-xs">M</span>
            </div>
            <span className="text-sm text-muted-foreground">METRIS by SANJEEVANI AI</span>
          </div>
          <p className="text-sm text-muted-foreground">
            We score. You fix. Come back when ready.
          </p>
        </div>
      </footer>
    </div>
  );
}
