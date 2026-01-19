// Quick Actions & ROI Summary Panel
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DEMO_QUICK_WINS, calculateTotalQuickWinROI } from "@/data/demoQuickWins";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { formatCurrency } from "@/data/demoFinancialRisk";
import { cn } from "@/lib/utils";
import { 
  Zap, 
  Plus, 
  TrendingUp,
  DollarSign,
  Clock,
  ArrowRight,
  MessageSquare,
  FileText,
  Sparkles
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface QuickWinCardProps {
  win: typeof DEMO_QUICK_WINS[0];
  onFix: () => void;
  onAddToRoadmap: () => void;
}

function QuickWinCard({ win, onFix, onAddToRoadmap }: QuickWinCardProps) {
  const maxROI = Math.max(...DEMO_QUICK_WINS.map(w => w.roi));
  const roiPercentage = (win.roi / maxROI) * 100;

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      'Fairness': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
      'Robustness': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
      'Transparency': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
      'Data Integrity': 'bg-green-500/20 text-green-400 border-green-500/30',
      'Explainability': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
      'Security': 'bg-red-500/20 text-red-400 border-red-500/30',
      'Governance': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    };
    return colors[category] || 'bg-muted text-muted-foreground';
  };

  return (
    <Card className="bg-card-elevated border-border hover:border-primary/30 transition-all">
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <span className="text-lg font-bold text-primary">{win.rank}.</span>
            <h4 className="font-medium text-foreground">{win.name}</h4>
          </div>
          <Badge variant="outline" className={cn("text-xs", getCategoryColor(win.category))}>
            {win.category}
          </Badge>
        </div>

        {/* Metrics Row */}
        <div className="flex items-center gap-4 text-sm mb-3">
          <div className="flex items-center gap-1 text-status-good">
            <TrendingUp className="h-3 w-3" />
            <span className="font-mono">+{win.pointGain} pts</span>
          </div>
          <div className="flex items-center gap-1 text-status-good">
            <DollarSign className="h-3 w-3" />
            <span className="font-mono">-{formatCurrency(win.exposureReduction)}</span>
          </div>
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-3 w-3" />
            <span>{win.timeEstimate}</span>
          </div>
        </div>

        {/* ROI Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm mb-1">
            <span className="text-muted-foreground">ROI</span>
            <span className="font-mono font-bold text-primary">{win.roi.toFixed(1)}x</span>
          </div>
          <Progress 
            value={roiPercentage} 
            className="h-2"
            indicatorClassName="bg-gradient-to-r from-primary to-[hsl(var(--brand-secondary))]"
          />
        </div>

        {/* Cost */}
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
          <span>Estimated Cost</span>
          <span className="font-mono">{formatCurrency(win.estimatedCost)}</span>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <Button 
            size="sm" 
            className="flex-1 bg-primary hover:bg-primary/90"
            onClick={onFix}
          >
            <Zap className="h-3 w-3 mr-1" />
            Fix Now
          </Button>
          <Button 
            size="sm" 
            variant="outline"
            className="flex-1"
            onClick={onAddToRoadmap}
          >
            <Plus className="h-3 w-3 mr-1" />
            Add to Roadmap
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export function QuickActionsPanel() {
  const navigate = useNavigate();
  const { metrics, addSimulatedFix } = useVisualizationStore();
  
  const topWins = DEMO_QUICK_WINS.slice(0, 5);
  const totals = calculateTotalQuickWinROI(topWins);

  const handleFix = (win: typeof DEMO_QUICK_WINS[0]) => {
    addSimulatedFix({
      checkpointId: win.checkpointId,
      status: 'pending',
      pointsGain: win.pointGain,
      exposureReduction: win.exposureReduction,
    });
  };

  const handleAddToRoadmap = (win: typeof DEMO_QUICK_WINS[0]) => {
    // Navigate to roadmap builder with this item
    navigate(`/remediation#roadmap?add=${win.checkpointId}`);
  };

  return (
    <div className="space-y-6">
      {/* Quick Wins Section */}
      <Card className="bg-card border-border">
        <CardHeader className="pb-4">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <Zap className="h-5 w-5 text-primary" />
                Top Quick Wins by ROI
              </CardTitle>
              <p className="text-sm text-muted-foreground mt-1">
                Highest impact fixes you can make now
              </p>
            </div>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => navigate('/remediation')}
            >
              View All
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {topWins.map((win) => (
            <QuickWinCard
              key={win.checkpointId}
              win={win}
              onFix={() => handleFix(win)}
              onAddToRoadmap={() => handleAddToRoadmap(win)}
            />
          ))}
        </CardContent>
      </Card>

      {/* ROI Summary Card */}
      <Card className="bg-gradient-to-br from-primary/10 to-[hsl(var(--brand-secondary)/0.1)] border-primary/20">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-semibold">Total Remediation Potential</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Current Exposure</p>
              <p className="text-xl font-mono font-bold text-status-warning">
                {formatCurrency(metrics.currentExposure)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">After Top 5 Fixes</p>
              <p className="text-xl font-mono font-bold text-status-good">
                {formatCurrency(metrics.currentExposure - totals.totalExposureReduction)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Investment Required</p>
              <p className="text-xl font-mono font-bold text-foreground">
                {formatCurrency(totals.totalCost)}
              </p>
            </div>
            <div>
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Total ROI</p>
              <p className="text-xl font-mono font-bold text-primary">
                {totals.overallROI.toFixed(1)}x
              </p>
            </div>
          </div>

          <div className="pt-2 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Payback Period</span>
              <span className="font-mono font-bold text-foreground">22 days</span>
            </div>
          </div>

          <Button 
            className="w-full bg-primary hover:bg-primary/90"
            onClick={() => navigate('/remediation#roadmap')}
          >
            View Full Roadmap
            <ArrowRight className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>

      {/* Contact/Support Card */}
      <Card className="bg-card border-border">
        <CardContent className="p-6">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary/20 flex items-center justify-center">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h3 className="font-semibold text-foreground">Need Help?</h3>
              <p className="text-sm text-muted-foreground">SANJEEVANI AI is here for you</p>
            </div>
          </div>

          <div className="space-y-2">
            <Button 
              variant="outline" 
              className="w-full justify-start"
              onClick={() => navigate('/contact')}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Schedule Consultation
            </Button>
            <Button 
              variant="ghost" 
              className="w-full justify-start text-muted-foreground"
              onClick={() => navigate('/docs')}
            >
              <FileText className="h-4 w-4 mr-2" />
              View Documentation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
