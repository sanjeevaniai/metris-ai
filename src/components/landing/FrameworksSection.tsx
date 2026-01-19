import { useState } from 'react';
import { ChevronDown, ChevronUp, ChevronRight, ArrowRight, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

const PRIMARY_FRAMEWORKS = [
  'ISO 42001',
  'EU AI Act',
  'NIST AI RMF',
  'SOC 2',
  'ISO 27001',
  'NIST CSF',
  'GDPR',
  'MITRE ATLAS',
];

const FRAMEWORK_CATEGORIES = [
  {
    id: 'ai-ml',
    title: 'AI & ML Governance',
    frameworks: [
      'ISO/IEC 42001',
      'EU AI Act',
      'NIST AI RMF',
      'IEEE 7000 Series',
      'Singapore AI Governance Framework',
      'Canada AIDA',
      'UK AI Regulation',
      'Colorado AI Act',
      'NYC Local Law 144',
      'Illinois BIPA',
      'Texas AI Law',
      'Connecticut AI Act',
    ],
  },
  {
    id: 'data-privacy',
    title: 'Data Privacy',
    frameworks: [
      'GDPR',
      'CCPA / CPRA',
      'LGPD (Brazil)',
      'PIPL (China)',
      'POPIA (South Africa)',
      'HIPAA',
      'FERPA',
      'Data Governance Act (EU)',
      'APPI (Japan)',
      'PDPA (Thailand)',
    ],
  },
  {
    id: 'cybersecurity',
    title: 'Cybersecurity',
    frameworks: [
      'NIST CSF 2.0',
      'ISO 27001',
      'ISO 27701',
      'ISO 27017',
      'ISO 27018',
      'CIS Controls v8',
      'CMMC 2.0',
      'FedRAMP',
      'PCI DSS 4.0',
      'DORA (EU)',
      'NIS2',
    ],
  },
  {
    id: 'security-trust',
    title: 'Security & Trust',
    frameworks: [
      'SOC 2 Type I & II',
      'MITRE ATLAS',
      'OWASP LLM Top 10',
      'OWASP ML Top 10',
      'CSA AI Safety Initiative',
      'ENISA AI Threat Landscape',
      'Cloud Security Alliance CAIQ',
      'Shared Assessments SIG',
    ],
  },
  {
    id: 'industry',
    title: 'Industry Specific',
    frameworks: [
      'SR 11-7 (Banking)',
      'OCC Model Risk Management',
      'FDA AI/ML (Medical Devices)',
      'EIOPA AI Guidelines (Insurance)',
      'MAS AI Guidelines (Singapore)',
      'OSFI B-13 (Canada Banking)',
      'EBA ML Guidelines',
      'FINRA AI Guidance',
      'NAIC AI Principles (Insurance)',
      '21 CFR Part 11 (Pharma)',
      'Annex 11 (EU Pharma)',
    ],
  },
  {
    id: 'emerging',
    title: 'Emerging Standards',
    frameworks: [
      'ISO/IEC 23894 (AI Risk Management)',
      'ISO/IEC 38507 (AI Governance)',
      'ISO/IEC 24028 (AI Trustworthiness)',
      'IEEE P2840 (AI Ethics)',
      'IEEE P7001-7014 Series',
      'OECD AI Principles',
      'UNESCO AI Ethics Recommendation',
      'WEF AI Governance Framework',
      'G7 Hiroshima AI Process',
      'GPAI Code of Conduct',
    ],
  },
];

const TOTAL_FRAMEWORKS = FRAMEWORK_CATEGORIES.reduce(
  (acc, cat) => acc + cat.frameworks.length,
  0
);
const ADDITIONAL_FRAMEWORKS = TOTAL_FRAMEWORKS - PRIMARY_FRAMEWORKS.length;

export function FrameworksSection() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    frameworkName: '',
    email: '',
    reason: '',
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In production, this would submit to Supabase
    setIsSubmitted(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setIsSubmitted(false);
      setFormData({ frameworkName: '', email: '', reason: '' });
    }, 2000);
  };

  return (
    <section className="py-24 border-t border-border">
      <div className="container text-center">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          One Score. Multiple Frameworks.
        </h2>

        {/* Primary Framework Badges */}
        <div className="flex flex-wrap justify-center gap-4 mt-12 max-w-3xl mx-auto">
          {PRIMARY_FRAMEWORKS.map((fw) => (
            <div
              key={fw}
              className="px-6 py-3 bg-secondary border border-border rounded-lg text-sm font-medium hover:border-primary/50 transition-colors"
            >
              {fw}
            </div>
          ))}
        </div>

        {/* Expand Trigger */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="flex items-center justify-center gap-2 mx-auto mt-8 text-primary hover:opacity-80 transition-opacity text-sm font-medium"
        >
          {isExpanded ? (
            <>
              Collapse
              <ChevronUp className="w-4 h-4" />
            </>
          ) : (
            <>
              + {ADDITIONAL_FRAMEWORKS} more frameworks
              <ChevronDown className="w-4 h-4" />
            </>
          )}
        </button>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-8 animate-fade-in">
            {/* Desktop Grid */}
            <div className="hidden md:block card-terminal p-8 rounded-lg max-w-5xl mx-auto">
              <div className="grid grid-cols-2 gap-6">
                {FRAMEWORK_CATEGORIES.map((category) => (
                  <div
                    key={category.id}
                    className="bg-background rounded-lg p-5 text-left"
                  >
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-primary mb-4">
                      {category.title}
                    </h3>
                    <ul className="space-y-2">
                      {category.frameworks.map((fw) => (
                        <li
                          key={fw}
                          className="text-sm text-muted-foreground py-1.5 border-b border-border/50 last:border-0"
                        >
                          {fw}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              {/* Request Framework CTA */}
              <div className="mt-8 pt-6 border-t border-border">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary transition-colors"
                >
                  Don't see your framework?
                  <span className="text-primary font-medium inline-flex items-center gap-1">
                    Request it <ArrowRight className="w-3 h-3" />
                  </span>
                </button>
              </div>
            </div>

            {/* Mobile Accordion */}
            <div className="md:hidden card-terminal p-4 rounded-lg">
              <Accordion type="single" collapsible className="w-full">
                {FRAMEWORK_CATEGORIES.map((category) => (
                  <AccordionItem key={category.id} value={category.id}>
                    <AccordionTrigger className="text-left text-sm hover:no-underline">
                      <span className="flex items-center gap-2">
                        <span className="text-primary font-semibold">
                          {category.title}
                        </span>
                        <span className="text-muted-foreground text-xs">
                          ({category.frameworks.length})
                        </span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent>
                      <ul className="space-y-2 pt-2">
                        {category.frameworks.map((fw) => (
                          <li
                            key={fw}
                            className="text-sm text-muted-foreground py-1.5 border-b border-border/50 last:border-0 flex items-center gap-2"
                          >
                            <span className="w-1 h-1 rounded-full bg-primary/50" />
                            {fw}
                          </li>
                        ))}
                      </ul>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>

              {/* Mobile Request CTA */}
              <div className="mt-6 pt-4 border-t border-border">
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="w-full py-3 text-sm bg-secondary rounded-lg hover:bg-secondary/80 transition-colors flex items-center justify-center gap-2"
                >
                  Don't see yours?{' '}
                  <span className="text-primary font-medium">Request →</span>
                </button>
              </div>
            </div>

            {/* Collapse Button */}
            <button
              onClick={() => setIsExpanded(false)}
              className="flex items-center justify-center gap-2 mx-auto mt-6 text-muted-foreground hover:text-foreground transition-colors text-sm"
            >
              Collapse
              <ChevronUp className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Checkpoint Count */}
        <p className="text-muted-foreground mt-8 font-mono text-sm">
          {isExpanded
            ? '1,902 checkpoints mapped across all frameworks.'
            : '1,902 checkpoints. One unified score.'}
        </p>
      </div>

      {/* Request Framework Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="sm:max-w-md bg-card border-border">
          <DialogHeader>
            <DialogTitle className="text-xl">Request a Framework</DialogTitle>
          </DialogHeader>

          {isSubmitted ? (
            <div className="py-8 text-center">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <ChevronRight className="w-8 h-8 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Request Submitted!</h3>
              <p className="text-sm text-muted-foreground">
                We'll review your request and get back to you.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 pt-4">
              <p className="text-sm text-muted-foreground">
                Don't see a framework you need? Let us know.
              </p>

              <div className="space-y-2">
                <Label htmlFor="frameworkName">Framework Name *</Label>
                <Input
                  id="frameworkName"
                  required
                  value={formData.frameworkName}
                  onChange={(e) =>
                    setFormData({ ...formData, frameworkName: e.target.value })
                  }
                  className="bg-background border-border"
                  placeholder="e.g., NIST Privacy Framework"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="requestEmail">Your Email *</Label>
                <Input
                  id="requestEmail"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="bg-background border-border"
                  placeholder="you@company.com"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">
                  Why do you need this framework? (optional)
                </Label>
                <Textarea
                  id="reason"
                  rows={3}
                  value={formData.reason}
                  onChange={(e) =>
                    setFormData({ ...formData, reason: e.target.value })
                  }
                  className="bg-background border-border resize-none"
                  placeholder="Tell us about your use case..."
                />
              </div>

              <Button
                type="submit"
                className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
              >
                Submit Request
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                We typically add new frameworks within 2-4 weeks.
              </p>
            </form>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
}
