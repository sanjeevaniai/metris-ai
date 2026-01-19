import { Layout } from '@/components/layout/Layout';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Sparkles, TrendingUp, Shield, Scale, Globe, FileText, Plug, Leaf, Lightbulb } from 'lucide-react';
import { ForecastingDemo } from '@/components/features/ForecastingDemo';
import { SecurityDemo } from '@/components/features/SecurityDemo';
import { FairnessDemo } from '@/components/features/FairnessDemo';
import { JurisdictionDemo } from '@/components/features/JurisdictionDemo';
import { EvidenceDemo } from '@/components/features/EvidenceDemo';
import { EnvironmentalDemo } from '@/components/features/EnvironmentalDemo';
import { IntegrationsDemo } from '@/components/features/IntegrationsDemo';
import { DigitalMaturityDemo } from '@/components/features/DigitalMaturityDemo';
import { platformStats } from '@/data/features';

const Features = () => {
  return (
    <Layout>
      <section className="relative py-16 overflow-hidden">
        <div className="absolute inset-0 gradient-primary opacity-5 animate-gradient-shift" />
        
        <div className="container relative">
          <div className="text-center max-w-4xl mx-auto mb-12">
            <Badge className="mb-4 gradient-primary text-primary-foreground">
              <Sparkles className="h-3 w-3 mr-1" />
              Platform Capabilities
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="text-gradient">METRIS<sup className="text-xl">™</sup> Features</span>
            </h1>
            <p className="text-xl text-muted-foreground">
              63 features across 11 categories powering enterprise AI governance
            </p>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mb-12">
            {[
              { label: 'Agents', value: platformStats.agents },
              { label: 'Checkpoints', value: `${platformStats.checkpoints}+` },
              { label: 'Frameworks', value: platformStats.frameworks },
              { label: 'Jurisdictions', value: `${platformStats.jurisdictions}+` },
              { label: 'Accuracy', value: `${platformStats.accuracy}%` },
              { label: 'Time Saved', value: `${platformStats.timeReduction}%` },
            ].map((stat) => (
              <div key={stat.label} className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
                <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>

          {/* Feature Tabs */}
          <Tabs defaultValue="forecasting" className="w-full">
            <TabsList className="grid w-full grid-cols-4 md:grid-cols-8 mb-8 h-auto gap-1">
              <TabsTrigger value="forecasting" className="text-xs py-2 px-2">
                <TrendingUp className="h-3 w-3 mr-1 hidden md:inline" />
                Forecasting
              </TabsTrigger>
              <TabsTrigger value="security" className="text-xs py-2 px-2">
                <Shield className="h-3 w-3 mr-1 hidden md:inline" />
                Security
              </TabsTrigger>
              <TabsTrigger value="fairness" className="text-xs py-2 px-2">
                <Scale className="h-3 w-3 mr-1 hidden md:inline" />
                Fairness
              </TabsTrigger>
              <TabsTrigger value="jurisdiction" className="text-xs py-2 px-2">
                <Globe className="h-3 w-3 mr-1 hidden md:inline" />
                Jurisdictions
              </TabsTrigger>
              <TabsTrigger value="evidence" className="text-xs py-2 px-2">
                <FileText className="h-3 w-3 mr-1 hidden md:inline" />
                Evidence
              </TabsTrigger>
              <TabsTrigger value="integrations" className="text-xs py-2 px-2">
                <Plug className="h-3 w-3 mr-1 hidden md:inline" />
                Integrations
              </TabsTrigger>
              <TabsTrigger value="environmental" className="text-xs py-2 px-2">
                <Leaf className="h-3 w-3 mr-1 hidden md:inline" />
                Environmental
              </TabsTrigger>
              <TabsTrigger value="maturity" className="text-xs py-2 px-2">
                <Lightbulb className="h-3 w-3 mr-1 hidden md:inline" />
                Maturity
              </TabsTrigger>
            </TabsList>

            <TabsContent value="forecasting"><ForecastingDemo /></TabsContent>
            <TabsContent value="security"><SecurityDemo /></TabsContent>
            <TabsContent value="fairness"><FairnessDemo /></TabsContent>
            <TabsContent value="jurisdiction"><JurisdictionDemo /></TabsContent>
            <TabsContent value="evidence"><EvidenceDemo /></TabsContent>
            <TabsContent value="integrations"><IntegrationsDemo /></TabsContent>
            <TabsContent value="environmental"><EnvironmentalDemo /></TabsContent>
            <TabsContent value="maturity"><DigitalMaturityDemo /></TabsContent>
          </Tabs>
        </div>
      </section>
    </Layout>
  );
};

export default Features;
