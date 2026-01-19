// Human Impact Page - Traceability to the Human
// "Understanding who is affected by your AI decisions"

import { useState } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { SEO } from '@/components/seo/SEO';
import { TripleMetricHeader } from '@/components/dashboard/TripleMetricHeader';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  TrendingUp, 
  Calendar, 
  ChevronRight, 
  ArrowRight,
  AlertTriangle,
  CheckCircle,
  FileText,
  Wrench,
  DollarSign
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  DEMO_AFFECTED_POPULATIONS, 
  DEMO_90_DAY_PROJECTIONS,
  DEMO_TRIPLE_METRICS,
  formatHumanCount,
  getSeverityColor,
  getSeverityBgColor,
  type AffectedPopulation
} from '@/data/demoHumanImpact';
import { formatCurrency } from '@/data/demoFinancialRisk';
import { TracebackModal } from '@/components/human-impact/TracebackModal';
import { DecisionVolumeCard } from '@/components/human-impact/DecisionVolumeCard';
import { ProjectionChart } from '@/components/human-impact/ProjectionChart';

function HumanImpactSEO() {
  return (
    <SEO
      title="Human Impact & Traceability | METRIS"
      description="Traceability to the Human - understand who is affected by your AI decisions. Connect governance gaps to real human impact."
    />
  );
}

export default function HumanImpact() {
  const [selectedPopulation, setSelectedPopulation] = useState<AffectedPopulation | null>(null);

  const totalAffected = DEMO_AFFECTED_POPULATIONS.reduce(
    (sum, pop) => sum + pop.estimatedAffected, 0
  );

  return (
    <SidebarLayout>
      <HumanImpactSEO />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl font-light text-foreground">
                Traceability to the Human
              </h1>
              <Badge variant="outline" className="border-primary/30 text-primary">
                <Users className="h-3 w-3 mr-1" />
                {formatHumanCount(totalAffected)} affected
              </Badge>
            </div>
            <p className="text-muted-foreground">
              Understanding who is affected by your AI decisions
            </p>
          </div>

          {/* Triple Metric Header */}
          <div className="mb-8">
            <TripleMetricHeader />
          </div>

          {/* Decision Volume Section */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              Decision Volume
            </h2>
            <DecisionVolumeCard />
          </div>

          {/* Affected Populations by Governance Gap */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-status-warning" />
              Affected Populations by Governance Gap
            </h2>
            <div className="space-y-3">
              {DEMO_AFFECTED_POPULATIONS.map((population) => (
                <AffectedPopulationCard
                  key={population.checkpointId}
                  population={population}
                  onViewTraceback={() => setSelectedPopulation(population)}
                />
              ))}
            </div>
          </div>

          {/* 90-Day Projection */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 text-foreground flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-status-critical" />
              90-Day Projection (If Not Remediated)
            </h2>
            <ProjectionChart />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4">
            <Button size="lg" className="gap-2">
              <Wrench className="h-4 w-4" />
              Create Remediation Plan
            </Button>
            <Button size="lg" variant="outline" className="gap-2">
              <FileText className="h-4 w-4" />
              Export Human Impact Report
            </Button>
          </div>
        </div>
      </div>

      {/* Traceback Modal */}
      <TracebackModal
        population={selectedPopulation}
        onClose={() => setSelectedPopulation(null)}
      />
    </SidebarLayout>
  );
}

interface AffectedPopulationCardProps {
  population: AffectedPopulation;
  onViewTraceback: () => void;
}

function AffectedPopulationCard({ population, onViewTraceback }: AffectedPopulationCardProps) {
  const StatusIcon = population.severity === 'good' ? CheckCircle : AlertTriangle;
  
  return (
    <Card className={cn(
      "transition-all hover:shadow-lg",
      getSeverityBgColor(population.severity)
    )}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-3 flex-1">
            <div className="text-2xl">{population.pillarIcon}</div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <StatusIcon className={cn("h-4 w-4", getSeverityColor(population.severity))} />
                <span className="font-medium text-foreground uppercase text-sm">
                  {population.pillar}
                </span>
                <Badge 
                  variant="outline" 
                  className={cn("text-xs", getSeverityColor(population.severity))}
                >
                  {population.severity}
                </Badge>
              </div>
              
              <div className="flex items-baseline gap-2 mb-1">
                <span className={cn(
                  "text-xl font-bold font-mono",
                  population.severity === 'good' ? 'text-status-good' : 'text-foreground'
                )}>
                  {population.estimatedAffected === 0 
                    ? 'No impact' 
                    : `${formatHumanCount(population.estimatedAffected)} affected`
                  }
                </span>
                {population.severity !== 'good' && (
                  <span className="text-xs text-muted-foreground">
                    in {formatHumanCount(population.decisionVolume)} decisions
                  </span>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                {population.calculationBasis}
              </p>
              
              {population.modelVersion && (
                <p className="text-xs text-muted-foreground/60 mt-1">
                  {population.modelVersion} • Deployed {population.deployedDate}
                </p>
              )}
            </div>
          </div>
          
          <div className="flex flex-col items-end gap-2">
            <div className="text-right">
              <div className="text-2xl font-mono font-bold text-foreground">
                {population.score}
              </div>
              <div className="text-xs text-muted-foreground">score</div>
            </div>
            
            {population.severity !== 'good' && (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-xs gap-1"
                onClick={onViewTraceback}
              >
                View Traceback
                <ChevronRight className="h-3 w-3" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
