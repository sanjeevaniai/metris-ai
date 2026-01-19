import { Layout } from '@/components/layout/Layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowRight, 
  BarChart3, 
  DollarSign, 
  Users, 
  ListChecks,
  Shield,
  Wrench,
  GraduationCap,
  Scale,
  Building2,
  Handshake,
  CheckCircle2,
  XCircle
} from 'lucide-react';

// Partner categories with descriptions
const partnerCategories = [
  {
    id: 'implementation',
    title: 'Implementation Partners',
    icon: Wrench,
    tagline: 'METRIS identifies gaps. You help fix them.',
    description: 'We score and recommend. Your team implements the fixes. Together, we get clients to audit-ready faster.',
    valueToPartner: [
      'Qualified leads with quantified gaps',
      'Clear scope of work from METRIS recommendations',
      'Continuous verification of your implementation work',
      'Co-branded audit-ready reports',
    ],
    valueToClient: [
      'Vetted implementation experts',
      'Faster time to compliance',
      'Verified fixes via CI/CD',
      'Single source of truth for progress',
    ],
    partnerTypes: [
      'GRC Consulting Firms',
      'AI Safety Companies',
      'MLOps Consultants',
      'Policy & Compliance Specialists',
    ],
  },
  {
    id: 'audit',
    title: 'Audit & Certification Partners',
    icon: Shield,
    tagline: 'METRIS provides evidence. You certify.',
    description: 'We generate audit-ready evidence packages. You conduct the formal assessment and issue certifications.',
    valueToPartner: [
      'Pre-organized evidence packages',
      'Continuous compliance tracking',
      'Reduced audit preparation time',
      'Quantified risk documentation',
    ],
    valueToClient: [
      'Faster certification process',
      'Lower audit costs',
      'Continuous readiness monitoring',
      'No last-minute scrambles',
    ],
    partnerTypes: [
      'ISO 42001 Certification Bodies',
      'EU AI Act Notified Bodies',
      'SOC 2 Auditors',
      'GDPR Assessors',
    ],
  },
  {
    id: 'insurance',
    title: 'Insurance Partners',
    icon: Scale,
    tagline: 'METRIS quantifies risk. You underwrite it.',
    description: 'We provide quantified AI risk exposure in dollars. You use it for better pricing, underwriting, and portfolio management.',
    valueToPartner: [
      'Quantified risk metrics (VaR, CVaR)',
      'Continuous risk monitoring',
      'Standardized risk taxonomy',
      'Historical risk trend data',
    ],
    valueToClient: [
      'Better premium pricing',
      'Faster underwriting',
      'Risk reduction incentives',
      'Continuous coverage optimization',
    ],
    partnerTypes: [
      'AI Liability Insurers',
      'Cyber Insurance Providers',
      'Tech E&O Carriers',
      'Reinsurers',
    ],
  },
  {
    id: 'technology',
    title: 'Technology Partners',
    icon: Building2,
    tagline: 'METRIS integrates. You enable.',
    description: 'We connect to your platform to pull governance data. Together, we give clients a complete AI governance picture.',
    valueToPartner: [
      'Governance layer for your platform',
      'Differentiated compliance offering',
      'Joint go-to-market opportunities',
      'API-first integration',
    ],
    valueToClient: [
      'Unified governance view',
      'No context switching',
      'Automated evidence collection',
      'Single pane of glass',
    ],
    partnerTypes: [
      'Cloud AI Platforms (AWS, Azure, GCP)',
      'MLOps Platforms',
      'Data Platforms',
      'DevOps & CI/CD Tools',
    ],
  },
  {
    id: 'training',
    title: 'Training & Education Partners',
    icon: GraduationCap,
    tagline: 'You train. METRIS measures progress.',
    description: 'You deliver AI governance training. We measure the before/after impact on organizational governance maturity.',
    valueToPartner: [
      'Quantified training ROI',
      'Before/after score comparisons',
      'Certification pathway integration',
      'Continuous skills tracking',
    ],
    valueToClient: [
      'Measurable training outcomes',
      'Targeted skill gaps',
      'Progress tracking',
      'Certification preparation',
    ],
    partnerTypes: [
      'AI Governance Training Providers',
      'Corporate Learning Platforms',
      'University Programs',
      'Professional Certification Bodies',
    ],
  },
];

export default function Partners() {
  return (
    <Layout>
      <div className="container py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            Partner Ecosystem
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Partnerships
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            METRIS scores, quantifies risk, and recommends. 
            Our partners help implement, certify, insure, and train.
            Together, we make AI governance actionable.
          </p>
        </div>

        {/* What METRIS Does vs Doesn't Do */}
        <div className="grid md:grid-cols-2 gap-6 mb-16 max-w-4xl mx-auto">
          <Card className="border-primary/30 bg-primary/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-primary">
                <CheckCircle2 className="h-5 w-5" />
                What METRIS Does
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <BarChart3 className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>SCORE</strong>
                    <p className="text-sm text-muted-foreground">Governance number (0-1000) with confidence intervals</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <DollarSign className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>RISK ($)</strong>
                    <p className="text-sm text-muted-foreground">Financial exposure in real dollars (VaR, CVaR)</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Users className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>HUMANS</strong>
                    <p className="text-sm text-muted-foreground">Traceability to humans affected by AI decisions</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <ListChecks className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <strong>RECOMMENDATIONS</strong>
                    <p className="text-sm text-muted-foreground">Prioritized fixes ranked by ROI</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-destructive/30 bg-destructive/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-destructive">
                <XCircle className="h-5 w-5" />
                What METRIS Doesn't Do
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3 text-muted-foreground">
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Implementation</strong>
                    <p className="text-sm">We don't fix gaps — we identify them</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Policy Writing</strong>
                    <p className="text-sm">We don't write policies — we identify policy gaps</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Certification</strong>
                    <p className="text-sm">We don't certify — we prepare evidence for auditors</p>
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <XCircle className="h-5 w-5 text-destructive/50 mt-0.5 flex-shrink-0" />
                  <div>
                    <strong className="text-foreground">Consulting</strong>
                    <p className="text-sm">We don't advise — we give you data to act on</p>
                  </div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* The Partnership Loop */}
        <div className="mb-16">
          <Card className="bg-muted/30 border-border">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold text-center mb-8">
                The Partnership Loop
              </h2>
              
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-2 max-w-4xl mx-auto">
                {/* Step 1 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
                    <BarChart3 className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-1">METRIS Scores</h4>
                  <p className="text-sm text-muted-foreground">
                    We assess and identify gaps with quantified risk
                  </p>
                </div>

                <ArrowRight className="h-8 w-8 text-primary hidden md:block flex-shrink-0" />
                <div className="h-8 w-8 md:hidden flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary rotate-90" />
                </div>

                {/* Step 2 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-amber-500 flex items-center justify-center mb-3">
                    <Handshake className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">Partner Implements</h4>
                  <p className="text-sm text-muted-foreground">
                    Implementation partners fix the gaps we identified
                  </p>
                </div>

                <ArrowRight className="h-8 w-8 text-primary hidden md:block flex-shrink-0" />
                <div className="h-8 w-8 md:hidden flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary rotate-90" />
                </div>

                {/* Step 3 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
                    <CheckCircle2 className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <h4 className="font-semibold mb-1">METRIS Verifies</h4>
                  <p className="text-sm text-muted-foreground">
                    CI/CD integration automatically re-scores
                  </p>
                </div>

                <ArrowRight className="h-8 w-8 text-primary hidden md:block flex-shrink-0" />
                <div className="h-8 w-8 md:hidden flex items-center justify-center">
                  <ArrowRight className="h-6 w-6 text-primary rotate-90" />
                </div>

                {/* Step 4 */}
                <div className="flex flex-col items-center text-center flex-1">
                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                    <Shield className="h-8 w-8 text-white" />
                  </div>
                  <h4 className="font-semibold mb-1">Partner Certifies</h4>
                  <p className="text-sm text-muted-foreground">
                    Audit partners certify with METRIS evidence
                  </p>
                </div>
              </div>

              <p className="text-center text-muted-foreground mt-8 text-sm">
                The loop continues. Continuously.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Partner Categories */}
        <div className="space-y-12 mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Partner Categories</h2>
          
          {partnerCategories.map((category) => {
            const IconComponent = category.icon;
            return (
              <Card key={category.id} className="overflow-hidden">
                <CardHeader className="bg-muted/30">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                      <IconComponent className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <CardTitle className="text-xl mb-1">{category.title}</CardTitle>
                      <p className="text-primary font-medium">{category.tagline}</p>
                      <p className="text-muted-foreground mt-2">{category.description}</p>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Value to Partner */}
                    <div>
                      <h4 className="font-semibold mb-3 text-primary">Value to Partners</h4>
                      <ul className="space-y-2">
                        {category.valueToPartner.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    {/* Value to Client */}
                    <div>
                      <h4 className="font-semibold mb-3 text-emerald-500">Value to Clients</h4>
                      <ul className="space-y-2">
                        {category.valueToClient.map((item, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm">
                            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
                            <span>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Partner Types */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {category.partnerTypes.map((type, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {type}
                      </Badge>
                    ))}
                  </div>

                  {/* CTA */}
                  <Button className="gap-2">
                    Become a {category.title.replace(' Partners', '')} Partner
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Why Partner With METRIS */}
        <div className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-8">Why Partner With METRIS?</h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <Card className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Quantified Leads</h3>
              <p className="text-sm text-muted-foreground">
                Every lead comes with a METRIS score, identified gaps, and quantified risk. 
                No guessing. Clear scope.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <CheckCircle2 className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Verified Results</h3>
              <p className="text-sm text-muted-foreground">
                When you implement, METRIS verifies. Your work is validated with 
                before/after scores. Proof of value.
              </p>
            </Card>

            <Card className="text-center p-6">
              <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold mb-2">Growing Market</h3>
              <p className="text-sm text-muted-foreground">
                EU AI Act enforcement starts August 2026. Every company with AI 
                needs governance. We're the scoring layer.
              </p>
            </Card>
          </div>
        </div>

        {/* Become a Partner CTA */}
        <div className="text-center">
          <Card className="inline-block max-w-2xl bg-gradient-to-br from-primary/10 to-primary/5 border-primary/30">
            <CardContent className="p-8">
              <Handshake className="h-12 w-12 text-primary mx-auto mb-4" />
              <h2 className="text-2xl font-bold mb-2">Become a Partner</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Join the METRIS partner ecosystem. Get qualified leads. 
                Deliver verified results. Grow together.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button size="lg" className="gap-2">
                  Apply to Partner Program
                  <ArrowRight className="h-4 w-4" />
                </Button>
                <Button size="lg" variant="outline">
                  Schedule a Call
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer Note */}
        <div className="mt-16 text-center">
          <p className="text-sm text-muted-foreground max-w-2xl mx-auto">
            <strong>METRIS</strong> by SANJEEVANI AI — Governance in numbers. Risk in dollars. 
            Traceability to the Human. We score and recommend. Partners help implement, 
            certify, insure, and train. Together, we make AI governance real.
          </p>
        </div>
      </div>
    </Layout>
  );
}
