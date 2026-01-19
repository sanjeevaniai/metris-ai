// TripleMetricHeader - The Three Numbers
// "Governance in numbers. Risk in dollars. Traceability to the Human."

import { Card } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, DollarSign, BarChart3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { DEMO_TRIPLE_METRICS, formatHumanCount } from '@/data/demoHumanImpact';
import { formatCurrency } from '@/data/demoFinancialRisk';
import { getScoreTier } from '@/data/demoScore';

interface TripleMetricHeaderProps {
  score?: {
    value: number;
    change: number;
    changePeriod: string;
    confidence?: {
      low: number;
      high: number;
    };
  };
  risk?: {
    value: number;
    change: number;
    changePeriod: string;
    var95?: number;
    var99?: number;
  };
  humans?: {
    affected: number;
    change: number;
    changePeriod: string;
    decisionVolume?: {
      total: number;
      quarterly: number;
      monthly: number;
      daily: number;
    };
  };
  compact?: boolean;
  onScoreClick?: () => void;
  onRiskClick?: () => void;
  onHumansClick?: () => void;
}

export function TripleMetricHeader({
  score = DEMO_TRIPLE_METRICS.score,
  risk = DEMO_TRIPLE_METRICS.risk,
  humans = DEMO_TRIPLE_METRICS.humans,
  compact = false,
  onScoreClick,
  onRiskClick,
  onHumansClick,
}: TripleMetricHeaderProps) {
  const scoreTier = getScoreTier(score.value);
  
  return (
    <div className={cn(
      "grid gap-4",
      compact ? "grid-cols-3" : "grid-cols-1 md:grid-cols-3"
    )}>
      {/* NUMBERS - Governance Score */}
      <MetricCard
        label="NUMBERS"
        sublabel="Governance"
        value={score.value.toString()}
        unit="score"
        change={score.change}
        changePeriod={score.changePeriod}
        changeDirection="up-good"
        icon={<BarChart3 className="h-5 w-5" />}
        accentColor={scoreTier.color}
        confidence={score.confidence ? `${score.confidence.low}–${score.confidence.high}` : undefined}
        onClick={onScoreClick}
        compact={compact}
      />

      {/* DOLLARS - Risk Exposure */}
      <MetricCard
        label="DOLLARS"
        sublabel="Risk"
        value={formatCurrency(risk.value)}
        unit="VaR 95%"
        change={risk.change}
        changePeriod={risk.changePeriod}
        changeDirection="down-good"
        icon={<DollarSign className="h-5 w-5" />}
        accentColor="text-status-warning"
        onClick={onRiskClick}
        compact={compact}
      />

      {/* HUMANS - Traceability */}
      <MetricCard
        label="HUMANS"
        sublabel="Traceability"
        value={formatHumanCount(humans.affected)}
        unit="affected"
        change={humans.change}
        changePeriod={humans.changePeriod}
        changeDirection="down-good"
        icon={<Users className="h-5 w-5" />}
        accentColor="text-primary"
        subtitle={humans.decisionVolume ? `${formatHumanCount(humans.decisionVolume.quarterly)} decisions/qtr` : undefined}
        onClick={onHumansClick}
        compact={compact}
      />
    </div>
  );
}

interface MetricCardProps {
  label: string;
  sublabel: string;
  value: string;
  unit: string;
  change: number;
  changePeriod: string;
  changeDirection: 'up-good' | 'down-good';
  icon: React.ReactNode;
  accentColor: string;
  confidence?: string;
  subtitle?: string;
  onClick?: () => void;
  compact?: boolean;
}

function MetricCard({
  label,
  sublabel,
  value,
  unit,
  change,
  changePeriod,
  changeDirection,
  icon,
  accentColor,
  confidence,
  subtitle,
  onClick,
  compact = false,
}: MetricCardProps) {
  const isPositiveChange = change > 0;
  const isGoodChange = changeDirection === 'up-good' ? isPositiveChange : !isPositiveChange;
  
  const TrendIcon = isPositiveChange ? TrendingUp : TrendingDown;
  const changeColor = isGoodChange ? 'text-status-good' : 'text-status-critical';
  const changeBgColor = isGoodChange ? 'bg-status-good/10' : 'bg-status-critical/10';
  
  const formattedChange = Math.abs(change) >= 1000 
    ? `${change > 0 ? '+' : ''}${formatHumanCount(change)}`
    : `${change > 0 ? '+' : ''}${change.toLocaleString()}`;

  return (
    <Card 
      className={cn(
        "relative overflow-hidden transition-all duration-300 group",
        onClick && "cursor-pointer hover:scale-[1.02] hover:shadow-xl",
        compact ? "p-3" : "p-6"
      )}
      onClick={onClick}
    >
      {/* Top label */}
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <div className={cn("p-1.5 rounded-md bg-muted/50", accentColor)}>
            {icon}
          </div>
          <span className="text-xs font-mono uppercase tracking-wider text-muted-foreground">
            {label}
          </span>
        </div>
        <span className="text-[10px] text-muted-foreground/60 uppercase tracking-wide">
          {sublabel}
        </span>
      </div>

      {/* Main value */}
      <div className={cn(
        "font-display font-bold tracking-tight",
        compact ? "text-2xl" : "text-4xl md:text-5xl",
        accentColor
      )}>
        {value}
      </div>

      {/* Unit label */}
      <div className="text-sm text-muted-foreground mt-1">
        {unit}
        {confidence && (
          <span className="text-xs text-muted-foreground/60 ml-2">
            ({confidence})
          </span>
        )}
      </div>

      {/* Change indicator */}
      <div className={cn(
        "inline-flex items-center gap-1 mt-3 px-2 py-1 rounded-full text-xs font-medium",
        changeBgColor,
        changeColor
      )}>
        <TrendIcon className="h-3 w-3" />
        <span>{formattedChange}</span>
        <span className="text-muted-foreground/60">{changePeriod}</span>
      </div>

      {/* Optional subtitle */}
      {subtitle && (
        <div className="text-xs text-muted-foreground/60 mt-2">
          {subtitle}
        </div>
      )}

      {/* Decorative gradient */}
      <div className={cn(
        "absolute -right-8 -bottom-8 w-32 h-32 rounded-full opacity-5 blur-2xl transition-opacity group-hover:opacity-10",
        accentColor.includes('good') ? 'bg-status-good' :
        accentColor.includes('warning') ? 'bg-status-warning' :
        accentColor.includes('critical') ? 'bg-status-critical' :
        'bg-primary'
      )} />
    </Card>
  );
}

// Compact version for sticky headers
export function TripleMetricCompact() {
  return (
    <div className="flex items-center gap-6 text-sm">
      <div className="flex items-center gap-2">
        <BarChart3 className="h-4 w-4 text-tier-moderate" />
        <span className="font-mono font-semibold">{DEMO_TRIPLE_METRICS.score.value}</span>
        <span className="text-xs text-status-good">▲ +{DEMO_TRIPLE_METRICS.score.change}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <DollarSign className="h-4 w-4 text-status-warning" />
        <span className="font-mono font-semibold">{formatCurrency(DEMO_TRIPLE_METRICS.risk.value)}</span>
        <span className="text-xs text-status-good">▼ {formatCurrency(Math.abs(DEMO_TRIPLE_METRICS.risk.change))}</span>
      </div>
      <div className="h-4 w-px bg-border" />
      <div className="flex items-center gap-2">
        <Users className="h-4 w-4 text-primary" />
        <span className="font-mono font-semibold">{formatHumanCount(DEMO_TRIPLE_METRICS.humans.affected)}</span>
        <span className="text-xs text-status-critical">▲ +{DEMO_TRIPLE_METRICS.humans.change}</span>
      </div>
    </div>
  );
}
