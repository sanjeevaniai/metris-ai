import { Layout } from '@/components/layout/Layout';
import { DemoFlow } from '@/components/demo/DemoFlow';
import { Badge } from '@/components/ui/badge';
import { Sparkles } from 'lucide-react';
import { HomeSEO } from '@/components/seo/PageSEO';
import { ScoreCards } from '@/components/hero/ScoreCards';

const Index = () => {

  return (
    <Layout>
      <HomeSEO />
      {/* Hero Section - vertically centered */}
      <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
        {/* Ambient background effects */}
        <div className="absolute inset-0 pointer-events-none">
          {/* Subtle gradient orbs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/5 rounded-full blur-3xl" />
          
          {/* Subtle grid pattern */}
          <div 
            className="absolute inset-0 opacity-[0.02]"
            style={{
              backgroundImage: `linear-gradient(hsl(var(--foreground)) 1px, transparent 1px),
                               linear-gradient(90deg, hsl(var(--foreground)) 1px, transparent 1px)`,
              backgroundSize: '64px 64px'
            }}
          />
        </div>
        
        <div className="container relative z-10">
          <div className="text-center max-w-4xl mx-auto">
            {/* Badge - 20% larger, more space below */}
            <Badge className="mb-10 px-5 py-2.5 text-base bg-primary/10 text-primary border-primary/20 shadow-glow-sm">
              <Sparkles className="h-4 w-4 mr-2" />
              Quantified AI Governance Platform
            </Badge>
            
            {/* Main title */}
            <h1 className="text-7xl md:text-8xl lg:text-9xl font-light mb-6 tracking-wide font-display">
              <span className="text-gradient">METRIS<sup className="text-3xl md:text-4xl lg:text-5xl">™</sup></span>
            </h1>
            
            {/* Subtitle - 30% larger */}
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground mb-6 tracking-tight">
              by <span className="text-gradient font-medium">SANJEEVANI AI</span>
            </p>
            
            {/* Description - 40-50% larger, reduced bottom margin */}
            <p className="text-xl md:text-2xl lg:text-3xl text-foreground max-w-3xl mx-auto mb-10 leading-relaxed font-light">
              Connect your AI systems. Watch <span className="text-gradient font-medium">25 agents</span> scan in <span className="text-gradient font-medium">real-time</span>. 
              Get a quantified governance score with financial risk exposure.
            </p>
            
            {/* Tagline pill - 25% larger */}
            <div className="inline-flex items-center px-8 py-4 rounded-full bg-muted/50 border border-border/50 backdrop-blur-sm mb-12">
              <span className="text-base md:text-lg lg:text-xl font-medium text-primary">
                Risk to ROI at Every Stage
              </span>
            </div>

            {/* Score Cards */}
            <ScoreCards />
          </div>
        </div>
      </section>

      {/* Demo Flow - reduced top spacing to connect with hero */}
      <section className="py-4 pb-24 relative z-10">
        <DemoFlow />
      </section>
    </Layout>
  );
};

export default Index;
