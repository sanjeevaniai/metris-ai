// Traceback Modal - Shows the chain from Checkpoint → Model → Decisions → Humans

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronRight, 
  AlertTriangle, 
  CheckCircle,
  Cpu,
  Users,
  Calendar,
  Wrench,
  DollarSign,
  TrendingUp,
  FileText,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  type AffectedPopulation, 
  DEMO_TRACEBACK,
  formatHumanCount,
  getSeverityColor
} from '@/data/demoHumanImpact';
import { formatCurrency } from '@/data/demoFinancialRisk';

interface TracebackModalProps {
  population: AffectedPopulation | null;
  onClose: () => void;
}

export function TracebackModal({ population, onClose }: TracebackModalProps) {
  if (!population) return null;

  const traceback = DEMO_TRACEBACK;

  return (
    <Dialog open={!!population} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <span>Traceback Chain</span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
            <span className="text-muted-foreground font-normal">
              {population.pillar} Gap → {formatHumanCount(population.estimatedAffected)} Humans Affected
            </span>
          </DialogTitle>
        </DialogHeader>

        {/* Chain Visualization */}
        <div className="grid grid-cols-3 gap-4 my-6">
          <ChainStep
            icon={<AlertTriangle className="h-5 w-5" />}
            title="CHECKPOINT FAILURE"
            color="text-status-critical"
          >
            <div className="text-lg font-mono font-bold">{traceback.checkpointId}</div>
            <div className="text-sm">{traceback.checkpointName}</div>
            <div className="mt-2 text-sm text-muted-foreground">
              Score: <span className="font-mono text-foreground">{traceback.score}</span>
            </div>
            <Badge variant="destructive" className="mt-2">FAILED</Badge>
          </ChainStep>

          <ChainStep
            icon={<Cpu className="h-5 w-5" />}
            title="MODEL VERSION"
            color="text-primary"
          >
            <div className="text-sm font-medium">{traceback.modelVersion}</div>
            <div className="mt-2 space-y-1 text-sm text-muted-foreground">
              <div>Deployed: {traceback.deployedDate}</div>
              <div>Training: {traceback.trainingCohort} cohort</div>
            </div>
          </ChainStep>

          <ChainStep
            icon={<Users className="h-5 w-5" />}
            title="DECISIONS AFFECTED"
            color="text-status-warning"
          >
            <div className="text-lg font-mono font-bold">
              {formatHumanCount(traceback.decisionsThisQuarter)}
            </div>
            <div className="text-sm text-muted-foreground">this quarter</div>
            <div className="mt-2 space-y-1 text-sm">
              <div>Disparity: <span className="text-status-critical font-mono">{Math.round(traceback.disparity * 100)}%</span></div>
              <div>Affected: <span className="font-mono font-bold">{formatHumanCount(traceback.humansAffected)}</span></div>
            </div>
          </ChainStep>
        </div>

        {/* Arrows between steps */}
        <div className="absolute top-[180px] left-[33%] transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
        </div>
        <div className="absolute top-[180px] left-[66%] transform -translate-x-1/2 -translate-y-1/2 hidden md:block">
          <ArrowRight className="h-6 w-6 text-muted-foreground/40" />
        </div>

        {/* Human Impact Calculation */}
        <Card className="bg-muted/30">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">
              Human Impact Calculation
            </h3>
            <div className="font-mono text-sm space-y-1">
              <div>{formatHumanCount(traceback.decisionsThisQuarter)} decisions this quarter</div>
              <div className="text-muted-foreground">× {Math.round(traceback.disparity * 100)}% approval disparity</div>
              <div className="text-muted-foreground">× {Math.round(traceback.confidence * 100)}% confidence</div>
              <div className="border-t border-border/50 mt-2 pt-2 text-lg font-bold text-foreground">
                = {formatHumanCount(traceback.humansAffected)} humans potentially affected by bias
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Projection if Not Fixed */}
        <div className="mt-6">
          <h3 className="text-sm font-medium uppercase tracking-wider text-muted-foreground mb-3">
            Projection if Not Fixed
          </h3>
          <div className="grid grid-cols-4 gap-3">
            {[
              { label: 'TODAY', ...traceback.projections.days30, affected: traceback.humansAffected, exposure: 0 },
              { label: '30 DAYS', ...traceback.projections.days30 },
              { label: '60 DAYS', ...traceback.projections.days60 },
              { label: '90 DAYS', ...traceback.projections.days90 },
            ].map((proj, i) => (
              <div 
                key={proj.label}
                className={cn(
                  "text-center p-3 rounded-lg border",
                  i === 0 ? "bg-muted/30 border-border/50" : "bg-status-critical/5 border-status-critical/20"
                )}
              >
                <div className="text-xs text-muted-foreground mb-1">{proj.label}</div>
                <div className={cn(
                  "text-lg font-mono font-bold",
                  i === 0 ? "text-foreground" : "text-status-critical"
                )}>
                  {formatHumanCount(proj.affected)}
                </div>
                <div className="text-xs text-muted-foreground">affected</div>
                {i > 0 && (
                  <div className="text-xs text-status-warning mt-1">
                    +{formatCurrency(proj.exposure)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Remediation Path */}
        <Card className="mt-6 border-primary/30 bg-primary/5">
          <CardContent className="p-4">
            <h3 className="text-sm font-medium uppercase tracking-wider text-primary mb-3 flex items-center gap-2">
              <Wrench className="h-4 w-4" />
              Remediation Path
            </h3>
            
            <p className="text-sm text-foreground mb-4">
              <span className="font-medium">Recommended Fix:</span> {traceback.remediation.recommendedFix}
            </p>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-center">
              <div>
                <div className="text-lg font-mono font-bold text-foreground">
                  {traceback.remediation.timeToFix} days
                </div>
                <div className="text-xs text-muted-foreground">Time to fix</div>
              </div>
              <div>
                <div className="text-lg font-mono font-bold text-foreground">
                  {formatCurrency(traceback.remediation.costToFix)}
                </div>
                <div className="text-xs text-muted-foreground">Cost to fix</div>
              </div>
              <div>
                <div className="text-lg font-mono font-bold text-status-good">
                  {formatHumanCount(traceback.remediation.humansProtected)}
                </div>
                <div className="text-xs text-muted-foreground">Humans protected</div>
              </div>
              <div>
                <div className="text-lg font-mono font-bold text-status-good">
                  {formatCurrency(traceback.remediation.riskAvoided)}
                </div>
                <div className="text-xs text-muted-foreground">Risk avoided</div>
              </div>
              <div>
                <div className="text-lg font-mono font-bold text-primary">
                  {traceback.remediation.roi}x
                </div>
                <div className="text-xs text-muted-foreground">ROI</div>
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button className="flex-1 gap-2">
                <Wrench className="h-4 w-4" />
                Start Remediation
              </Button>
              <Button variant="outline" className="gap-2">
                Add to Sprint
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Footer Actions */}
        <div className="flex justify-between mt-6 pt-4 border-t border-border/50">
          <Button variant="ghost" onClick={onClose}>
            ← Back to Human Impact
          </Button>
          <Button variant="outline" className="gap-2">
            <FileText className="h-4 w-4" />
            Export Traceback Report
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ChainStepProps {
  icon: React.ReactNode;
  title: string;
  color: string;
  children: React.ReactNode;
}

function ChainStep({ icon, title, color, children }: ChainStepProps) {
  return (
    <Card className="relative">
      <CardContent className="p-4">
        <div className={cn("flex items-center gap-2 mb-3", color)}>
          {icon}
          <span className="text-xs font-mono uppercase tracking-wider">{title}</span>
        </div>
        <div className="text-sm">
          {children}
        </div>
      </CardContent>
    </Card>
  );
}
