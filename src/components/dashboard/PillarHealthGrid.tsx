// Pillar Health Grid - Visual Summary
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { DEMO_PILLARS, getPillarColor } from "@/data/demoPillars";
import { formatCurrency } from "@/data/demoFinancialRisk";
import { useVisualizationStore } from "@/store/useVisualizationStore";
import { cn } from "@/lib/utils";
import { 
  Grid3X3, 
  Radar, 
  TrendingUp, 
  TrendingDown, 
  Minus,
  AlertTriangle
} from "lucide-react";

type ViewMode = 'grid' | 'radar';

interface PillarCardProps {
  pillar: typeof DEMO_PILLARS[0];
  isSelected: boolean;
  onClick: () => void;
}

function PillarCard({ pillar, isSelected, onClick }: PillarCardProps) {
  const isCritical = pillar.score < 600;
  const trend = pillar.score > 700 ? 'up' : pillar.score < 550 ? 'down' : 'flat';
  const trendValue = trend === 'up' ? 12 : trend === 'down' ? -8 : 0;
  
  // Determine background tint based on score
  const getBgClass = () => {
    if (pillar.score >= 850) return 'bg-status-good/5 border-status-good/20';
    if (pillar.score >= 700) return 'bg-status-good/5 border-status-good/10';
    if (pillar.score >= 600) return 'bg-status-warning/5 border-status-warning/20';
    if (pillar.score >= 500) return 'bg-status-warning/10 border-status-warning/30';
    return 'bg-status-critical/10 border-status-critical/30';
  };

  const getScoreColor = () => {
    if (pillar.score >= 850) return 'text-status-excellent';
    if (pillar.score >= 750) return 'text-status-good';
    if (pillar.score >= 600) return 'text-tier-moderate';
    if (pillar.score >= 400) return 'text-status-warning';
    return 'text-status-critical';
  };

  return (
    <Card 
      className={cn(
        "cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-0.5",
        getBgClass(),
        isSelected && "ring-2 ring-primary"
      )}
      onClick={onClick}
    >
      <CardContent className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-sm font-medium text-foreground truncate pr-2">{pillar.name}</h3>
          {isCritical && (
            <Badge variant="destructive" className="shrink-0 text-xs px-1.5 py-0">
              <AlertTriangle className="h-3 w-3 mr-1" />
              CRITICAL
            </Badge>
          )}
        </div>

        {/* Progress Bar */}
        <Progress 
          value={pillar.score / 10} 
          className="h-2 mb-3"
          indicatorClassName={cn(
            pillar.score >= 750 ? 'bg-status-good' :
            pillar.score >= 600 ? 'bg-tier-moderate' :
            pillar.score >= 400 ? 'bg-status-warning' :
            'bg-status-critical'
          )}
        />

        {/* Score */}
        <div className={cn("text-3xl font-mono font-bold mb-2", getScoreColor())}>
          {pillar.score}
        </div>

        {/* Exposure */}
        <p className="text-sm text-muted-foreground mb-2">
          <span className="font-mono text-status-warning">{formatCurrency(pillar.exposure)}</span> at risk
        </p>

        {/* ROI & Trend */}
        <div className="flex items-center justify-between text-xs">
          <Badge variant="outline" className="font-mono">
            {pillar.roi.toFixed(1)}x ROI
          </Badge>
          <div className={cn(
            "flex items-center gap-1",
            trend === 'up' ? 'text-status-good' :
            trend === 'down' ? 'text-status-critical' :
            'text-muted-foreground'
          )}>
            {trend === 'up' ? <TrendingUp className="h-3 w-3" /> :
             trend === 'down' ? <TrendingDown className="h-3 w-3" /> :
             <Minus className="h-3 w-3" />}
            <span className="font-mono">{trendValue > 0 ? '+' : ''}{trendValue} (30d)</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function PillarHealthGrid() {
  const [viewMode, setViewMode] = useState<ViewMode>('grid');
  const { selectedPillars, setSelectedPillars } = useVisualizationStore();

  const handlePillarClick = (pillarId: string) => {
    if (selectedPillars.includes(pillarId)) {
      setSelectedPillars(selectedPillars.filter(id => id !== pillarId));
    } else {
      setSelectedPillars([...selectedPillars, pillarId]);
    }
  };

  return (
    <Card className="bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-lg font-semibold">Pillar Health Overview</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Click any pillar for detailed analysis
            </p>
          </div>
          <div className="flex items-center gap-1 bg-secondary rounded-lg p-1">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('grid')}
            >
              <Grid3X3 className="h-4 w-4 mr-1" />
              Grid
            </Button>
            <Button
              variant={viewMode === 'radar' ? 'default' : 'ghost'}
              size="sm"
              className="h-8 px-3"
              onClick={() => setViewMode('radar')}
            >
              <Radar className="h-4 w-4 mr-1" />
              Radar
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {DEMO_PILLARS.map((pillar) => (
              <PillarCard
                key={pillar.id}
                pillar={pillar}
                isSelected={selectedPillars.includes(pillar.id)}
                onClick={() => handlePillarClick(pillar.id)}
              />
            ))}
          </div>
        ) : (
          <div className="flex items-center justify-center h-[400px] text-muted-foreground">
            {/* Radar chart placeholder - would use Recharts RadarChart */}
            <p>Radar visualization coming soon</p>
          </div>
        )}

        {/* Legend */}
        <div className="mt-6 pt-4 border-t border-border flex flex-wrap gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-status-excellent" />
            <span className="text-muted-foreground">850+ Exemplary</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-status-good" />
            <span className="text-muted-foreground">750+ Strong</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-tier-moderate" />
            <span className="text-muted-foreground">600+ Moderate</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-status-warning" />
            <span className="text-muted-foreground">400+ Weak</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded bg-status-critical" />
            <span className="text-muted-foreground">&lt;400 Critical</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
