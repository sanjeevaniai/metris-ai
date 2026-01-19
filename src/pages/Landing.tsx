import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { FrameworksSection } from '@/components/landing/FrameworksSection';
import { HowItWorks } from '@/components/landing/HowItWorks';
import { ScoreCards } from '@/components/hero/ScoreCards';
import { PublicHeader } from '@/components/layout/PublicHeader';

const stats = [
  { value: '0.89', label: 'Correlation with human auditor' },
  { value: '82.8%', label: 'Accuracy vs expert judgment' },
  { value: '1,902', label: 'Checkpoints mapped' },
];

export default function Landing() {
  return (
    <div className="min-h-screen bg-background pt-2">
      <PublicHeader />

      {/* Hero Section - New Brand */}
      <ScoreCards />

      {/* How It Works - Full positioning section */}
      <HowItWorks />

      {/* What You Get Section */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-4 drop-shadow-[0_2px_10px_hsl(0_0%_0%/0.3)]">
            Three Answers. One Assessment.
          </h2>
          <p className="text-center text-muted-foreground mb-16 max-w-2xl mx-auto">
            METRIS gives you the complete picture of your AI governance posture
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              {
                label: 'NUMBERS',
                title: 'Your Governance Score',
                desc: 'A 0-1000 Bayesian score showing exactly where you stand against 1,902 checkpoints across 7 frameworks.',
                example: '743 ± 34 (95% CI)',
              },
              {
                label: 'DOLLARS',
                title: 'Your Risk Exposure',
                desc: 'Monte Carlo simulation calculates your VaR — the financial exposure from governance gaps.',
                example: '$2.3M VaR (95%)',
              },
              {
                label: 'HUMANS',
                title: 'Who\'s Affected',
                desc: 'Traceability to the Human — how many people are impacted by your AI decisions and governance gaps.',
                example: '3,247 affected',
              },
            ].map((item) => (
              <div key={item.label} className="card-terminal p-8 rounded-lg hover:-translate-y-1 transition-transform shadow-card hover:shadow-card-hover">
                <p className="text-primary text-xs font-semibold tracking-wider mb-3">{item.label}</p>
                <h3 className="font-semibold text-xl text-foreground mb-3">{item.title}</h3>
                <p className="text-muted-foreground mb-4 text-sm">{item.desc}</p>
                <p className="text-primary font-mono text-sm">{item.example}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frameworks */}
      <FrameworksSection />

      {/* Credibility */}
      <section className="py-24 border-t border-border">
        <div className="container">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 drop-shadow-[0_2px_10px_hsl(0_0%_0%/0.3)]">
            Auditor-Grade Accuracy
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="card-terminal p-8 rounded-lg text-center hover:-translate-y-1 transition-transform shadow-card hover:shadow-card-hover">
                <div className="font-mono text-4xl font-bold text-primary mb-2">
                  {stat.value}
                </div>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          <p className="text-center text-muted-foreground mt-8">
            Built by an ISO/IEC 42001 Lead Auditor
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 border-t border-border">
        <div className="container text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4 drop-shadow-[0_2px_10px_hsl(0_0%_0%/0.3)]">
            Know Before You Go
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            Get your governance score in a 2-minute conversation.
            Text or voice — your choice.
          </p>

          <Link to="/assess">
            <Button size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground text-lg px-8 py-6 shadow-[0_0_20px_-5px_hsl(var(--primary)/0.5),0_4px_16px_-4px_hsl(var(--primary)/0.4)] hover:shadow-[0_0_30px_-5px_hsl(var(--primary)/0.6),0_8px_24px_-4px_hsl(var(--primary)/0.5)] transition-all hover:-translate-y-1">
              Get Your Free Score
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

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
            Governance in numbers. Risk in dollars. Traceability to the Human.
          </p>
        </div>
      </footer>
    </div>
  );
}
