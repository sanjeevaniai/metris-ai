// CARFAX-style Score & Status Cards
import { Card, CardContent } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { DEMO_SCORE, getScoreTier } from "@/data/demoScore";
import { DEMO_FRAMEWORKS } from "@/data/demoFrameworks";
import { DEMO_PILLARS } from "@/data/demoPillars";
import { formatCurrency } from "@/data/demoFinancialRisk";
import { cn } from "@/lib/utils";
import { 
  Shield, 
  Scale, 
  FileCheck,
  AlertTriangle,
  BarChart3,
  RefreshCw,
  Calendar,
  DollarSign,
  Target,
  ChevronRight,
  TrendingUp,
  TrendingDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface StatusCardProps {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  subtext: string;
  progress?: number;
  status: 'good' | 'warning' | 'critical' | 'neutral';
  onClick?: () => void;
}

function StatusCard({ icon, label, value, subtext, progress, status, onClick }: StatusCardProps) {
  const statusColors = {
    good: 'text-status-good',
    warning: 'text-status-warning',
    critical: 'text-status-critical',
    neutral: 'text-muted-foreground',
  };

  const progressColors = {
    good: 'bg-status-good',
    warning: 'bg-status-warning',
    critical: 'bg-status-critical',
    neutral: 'bg-muted-foreground',
  };

  return (
    <Card 
      className={cn(
        "bg-card hover:bg-card-elevated transition-all duration-200 cursor-pointer group border-border",
        onClick && "hover:shadow-lg hover:-translate-y-0.5"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={cn("shrink-0", statusColors[status])}>
              {icon}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm text-muted-foreground truncate">{label}</p>
              {progress !== undefined && (
                <div className="mt-1 mb-1">
                  <Progress 
                    value={progress} 
                    className="h-1.5"
                    indicatorClassName={progressColors[status]}
                  />
                </div>
              )}
              <div className="flex items-center gap-2">
                <span className={cn("font-mono font-semibold", statusColors[status])}>
                  {value}
                </span>
                <span className="text-xs text-muted-foreground truncate">{subtext}</span>
              </div>
            </div>
          </div>
          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors shrink-0" />
        </div>
      </CardContent>
    </Card>
  );
}

export function ScoreStatusCards() {
  const navigate = useNavigate();
  const { metrics } = useVisualizationStore();
  
  const tier = getScoreTier(DEMO_SCORE.overall);
  const securityPillar = DEMO_PILLARS.find(p => p.id === 'security');
  const fairnessPillar = DEMO_PILLARS.find(p => p.id === 'fairness');
  const euAiAct = DEMO_FRAMEWORKS.find(f => f.id === 'eu_ai_act');
  
  const criticalFindings = 47; // Demo value
  const quickWinsCount = 12;
  const quickWinsSavings = 4200000;

  return (
    <div className="space-y-4">
      {/* Featured Score Card */}
      <Card 
        className="bg-card border-border hover:shadow-lg transition-all cursor-pointer group"
        onClick={() => navigate('/dashboard#breakdown')}
      >
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              {/* Green $ Badge */}
              <div className="relative">
                <div className="w-16 h-16 rounded-xl bg-status-good/20 flex items-center justify-center">
                  <Shield className="h-8 w-8 text-status-good" />
                </div>
                <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-status-good flex items-center justify-center">
                  <DollarSign className="h-3 w-3 text-background" />
                </div>
              </div>
              
              <div>
                <p className="text-sm text-muted-foreground">METRIS Score</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-mono font-bold text-foreground">{DEMO_SCORE.overall}</span>
                  <span className="text-lg text-muted-foreground">/1000</span>
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span className={cn("text-sm font-medium", tier.color)}>{tier.name} Tier</span>
                  <span className="text-muted-foreground">•</span>
                  <div className="flex items-center gap-1 text-status-good text-sm">
                    <TrendingUp className="h-3 w-3" />
                    <span>+{DEMO_SCORE.trend.change} pts ({DEMO_SCORE.trend.period})</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <p className="text-sm text-muted-foreground">Exposure at Risk</p>
              <p className="text-2xl font-mono font-bold text-status-warning">
                {formatCurrency(metrics.currentExposure)}
              </p>
            </div>

            <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-foreground transition-colors" />
          </div>
        </CardContent>
      </Card>

      {/* Status Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Row 1 */}
        <StatusCard
          icon={<Shield className="h-5 w-5" />}
          label="Security Score"
          value={securityPillar?.score || 623}
          subtext="Needs Attention"
          progress={(securityPillar?.score || 623) / 10}
          status="warning"
          onClick={() => navigate('/dashboard#security')}
        />
        <StatusCard
          icon={<Scale className="h-5 w-5" />}
          label="Fairness Score"
          value={fairnessPillar?.score || 534}
          subtext="Critical"
          progress={(fairnessPillar?.score || 534) / 10}
          status="critical"
          onClick={() => navigate('/dashboard#fairness')}
        />
        <StatusCard
          icon={<FileCheck className="h-5 w-5" />}
          label="Compliance Coverage"
          value={`${Math.round((euAiAct?.coverage || 0.78) * 100)}%`}
          subtext="On Track"
          progress={(euAiAct?.coverage || 0.78) * 100}
          status="good"
          onClick={() => navigate('/checkpoints')}
        />

        {/* Row 2 */}
        <StatusCard
          icon={<AlertTriangle className="h-5 w-5" />}
          label="Open Findings"
          value={criticalFindings}
          subtext="Critical/High"
          status="critical"
          onClick={() => navigate('/remediation')}
        />
        <StatusCard
          icon={<BarChart3 className="h-5 w-5" />}
          label="Framework Coverage"
          value="84%"
          subtext="Good"
          progress={84}
          status="good"
          onClick={() => navigate('/dashboard#frameworks')}
        />
        <StatusCard
          icon={<RefreshCw className="h-5 w-5" />}
          label="Last Assessment"
          value="2 Days Ago"
          subtext="Current"
          status="good"
          onClick={() => navigate('/assess')}
        />

        {/* Row 3 */}
        <StatusCard
          icon={<Calendar className="h-5 w-5" />}
          label="EU AI Act Deadline"
          value={`${euAiAct?.daysRemaining || 199} Days`}
          subtext="Prepare Now"
          status="warning"
          onClick={() => navigate('/dashboard#eu-ai-act')}
        />
        <StatusCard
          icon={<DollarSign className="h-5 w-5" />}
          label="Quick Wins Available"
          value={`${quickWinsCount} Actions`}
          subtext={formatCurrency(quickWinsSavings) + " Savings"}
          status="good"
          onClick={() => navigate('/remediation')}
        />
        <StatusCard
          icon={<Target className="h-5 w-5" />}
          label="ROI Potential"
          value="8.3x"
          subtext="High Value"
          status="good"
          onClick={() => navigate('/remediation#roi')}
        />
      </div>
    </div>
  );
}
