import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ListTodo, Circle, Loader2, CheckCircle2, TrendingUp, DollarSign } from 'lucide-react';
import { DEMO_REMEDIATION_SUMMARY } from '@/data/demoRemediation';

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

export function RemediationSummary() {
  const summary = DEMO_REMEDIATION_SUMMARY;
  const riskReductionPercent = Math.round((summary.riskReductionAchieved / summary.potentialRiskReduction) * 100);

  return (
    <div className="space-y-6">
      {/* Status Cards */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Remediation Summary</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 border border-border/50">
              <ListTodo className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-2xl font-light text-foreground">{summary.totalItems}</span>
              <span className="text-xs text-muted-foreground">Total Items</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-muted/30 border border-border/50">
              <Circle className="h-5 w-5 text-muted-foreground mb-2" />
              <span className="text-2xl font-light text-foreground">{summary.open}</span>
              <span className="text-xs text-muted-foreground">Open ⚪</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-primary/20 border border-primary/30">
              <Loader2 className="h-5 w-5 text-primary mb-2" />
              <span className="text-2xl font-light text-foreground">{summary.inProgress}</span>
              <span className="text-xs text-muted-foreground">In Progress 🔵</span>
            </div>
            <div className="flex flex-col items-center justify-center p-4 rounded-lg bg-risk-low/20 border border-risk-low/30">
              <CheckCircle2 className="h-5 w-5 text-risk-low mb-2" />
              <span className="text-2xl font-light text-foreground">{summary.complete}</span>
              <span className="text-xs text-muted-foreground">Complete ✅</span>
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Overall Progress</span>
              <span className="font-medium">{summary.overallProgress}%</span>
            </div>
            <Progress value={summary.overallProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Impact Projection */}
      <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
        <CardContent className="p-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">Impact Projection</h3>
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted/30 border border-border/50">
              <p className="text-2xl font-light text-foreground">{summary.currentScore}</p>
              <p className="text-xs text-muted-foreground">± {summary.scoreVariance}</p>
              <p className="text-xs text-muted-foreground mt-1">Current Score</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-primary/20 border border-primary/30">
              <p className="text-2xl font-light text-primary">{summary.targetScore}</p>
              <p className="text-xs text-muted-foreground">(target)</p>
              <p className="text-xs text-muted-foreground mt-1">If All Complete</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-risk-low/20 border border-risk-low/30">
              <p className="text-2xl font-light text-risk-low">+{summary.progressImpact}</p>
              <p className="text-xs text-muted-foreground">(so far)</p>
              <p className="text-xs text-muted-foreground mt-1">Progress Impact</p>
            </div>
          </div>
          <div className="p-4 rounded-lg bg-muted/20 border border-border/30 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <DollarSign className="h-4 w-4 text-risk-low" />
                Risk Reduction Achieved
              </span>
              <span className="font-medium">
                {formatCurrency(summary.riskReductionAchieved)} of {formatCurrency(summary.potentialRiskReduction)} ({riskReductionPercent}%)
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-primary" />
                Investment So Far
              </span>
              <span className="font-medium">
                {formatCurrency(summary.investmentSoFar)} • ROI: {summary.roiRealized}x
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
