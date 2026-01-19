import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ReferenceLine,
  Cell,
  Area,
  AreaChart,
} from 'recharts';
import { DEMO_FINANCIAL_RISK, formatCurrency } from '@/data/demoFinancialRisk';
import { cn } from '@/lib/utils';
import {
  BarChart3,
  Info,
  TrendingUp,
  AlertTriangle,
  Target,
  Percent,
  RefreshCw,
} from 'lucide-react';

interface MonteCarloVisualizationProps {
  className?: string;
  showControls?: boolean;
}

// Generate Monte Carlo simulation data
function generateMonteCarloData(iterations: number = 10000, seed: number = 42) {
  const data: { score: number; count: number; cumulative: number }[] = [];
  const buckets: Record<number, number> = {};
  
  // Generate scores using normal distribution approximation
  for (let i = 0; i < iterations; i++) {
    // Box-Muller transform for normal distribution
    const u1 = Math.random();
    const u2 = Math.random();
    const z = Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
    
    // Mean around 720, std dev of 80
    const score = Math.round(Math.max(400, Math.min(950, 720 + z * 80)));
    const bucket = Math.floor(score / 25) * 25;
    buckets[bucket] = (buckets[bucket] || 0) + 1;
  }

  // Convert to array and calculate cumulative
  let cumulative = 0;
  const sortedBuckets = Object.keys(buckets).map(Number).sort((a, b) => a - b);
  
  for (const bucket of sortedBuckets) {
    cumulative += buckets[bucket];
    data.push({
      score: bucket,
      count: buckets[bucket],
      cumulative: (cumulative / iterations) * 100,
    });
  }

  return data;
}

// Calculate VaR and CVaR
function calculateRiskMetrics(data: ReturnType<typeof generateMonteCarloData>) {
  const totalCount = data.reduce((sum, d) => sum + d.count, 0);
  let cumulative = 0;
  let var95Score = 0;
  let cvarSum = 0;
  let cvarCount = 0;

  // VaR at 5th percentile (worst 5%)
  for (const d of data) {
    cumulative += d.count;
    if (cumulative / totalCount >= 0.05 && var95Score === 0) {
      var95Score = d.score;
    }
    if (cumulative / totalCount <= 0.05) {
      cvarSum += d.score * d.count;
      cvarCount += d.count;
    }
  }

  const cvar95Score = cvarCount > 0 ? Math.round(cvarSum / cvarCount) : var95Score;
  
  // Calculate confidence intervals
  cumulative = 0;
  let ci5 = 0, ci25 = 0, ci50 = 0, ci75 = 0, ci95 = 0;
  
  for (const d of data) {
    cumulative += d.count;
    const pct = cumulative / totalCount;
    if (pct >= 0.05 && ci5 === 0) ci5 = d.score;
    if (pct >= 0.25 && ci25 === 0) ci25 = d.score;
    if (pct >= 0.50 && ci50 === 0) ci50 = d.score;
    if (pct >= 0.75 && ci75 === 0) ci75 = d.score;
    if (pct >= 0.95 && ci95 === 0) ci95 = d.score;
  }

  return {
    var95: var95Score,
    cvar95: cvar95Score,
    median: ci50,
    confidenceInterval: { low: ci5, high: ci95 },
    quartiles: { q1: ci25, q2: ci50, q3: ci75 },
  };
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-card border border-border rounded-lg p-3 shadow-xl">
        <p className="font-mono font-semibold text-foreground mb-2">
          Score: {label} - {label + 24}
        </p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Frequency:</span>
            <span className="font-mono text-foreground">{payload[0].value.toLocaleString()}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-muted-foreground">Probability:</span>
            <span className="font-mono text-primary">
              {((payload[0].value / 10000) * 100).toFixed(2)}%
            </span>
          </div>
          {payload[1] && (
            <div className="flex justify-between gap-4 border-t border-border pt-1 mt-1">
              <span className="text-muted-foreground">Cumulative:</span>
              <span className="font-mono text-brand-secondary">
                {payload[1].value.toFixed(1)}%
              </span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function MonteCarloVisualization({ 
  className, 
  showControls = true 
}: MonteCarloVisualizationProps) {
  const [iterations, setIterations] = useState(10000);
  const [showCumulative, setShowCumulative] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [seed, setSeed] = useState(42);

  const data = useMemo(() => generateMonteCarloData(iterations, seed), [iterations, seed]);
  const metrics = useMemo(() => calculateRiskMetrics(data), [data]);

  const maxCount = Math.max(...data.map(d => d.count));

  const handleRefresh = () => {
    setIsRefreshing(true);
    setSeed(Math.random());
    setTimeout(() => setIsRefreshing(false), 500);
  };

  return (
    <Card className={cn("bg-card border-border", className)}>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-medium flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-primary" />
            Monte Carlo Simulation
            <Badge variant="outline" className="font-mono text-xs">
              {iterations.toLocaleString()} iterations
            </Badge>
          </CardTitle>
          {showControls && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleRefresh}
              className="h-8 gap-1"
            >
              <RefreshCw className={cn("h-4 w-4", isRefreshing && "animate-spin")} />
              Resample
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Risk Metrics Cards */}
        <div className="grid grid-cols-4 gap-3">
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Target className="h-3 w-3" />
              VaR (95%)
            </div>
            <div className="text-lg font-mono font-bold text-status-warning">
              {metrics.var95}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <AlertTriangle className="h-3 w-3" />
              CVaR (95%)
            </div>
            <div className="text-lg font-mono font-bold text-status-critical">
              {metrics.cvar95}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <TrendingUp className="h-3 w-3" />
              Median
            </div>
            <div className="text-lg font-mono font-bold text-primary">
              {metrics.median}
            </div>
          </div>
          <div className="bg-muted/50 rounded-lg p-3 text-center">
            <div className="text-xs text-muted-foreground mb-1 flex items-center justify-center gap-1">
              <Percent className="h-3 w-3" />
              90% CI
            </div>
            <div className="text-lg font-mono font-bold text-foreground">
              {metrics.confidenceInterval.low}-{metrics.confidenceInterval.high}
            </div>
          </div>
        </div>

        {/* Histogram Chart */}
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="score"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickFormatter={(v) => v.toString()}
                interval={3}
              />
              <YAxis 
                yAxisId="left"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickFormatter={(v) => v.toLocaleString()}
              />
              {showCumulative && (
                <YAxis 
                  yAxisId="right"
                  orientation="right"
                  stroke="hsl(var(--brand-secondary))" 
                  fontSize={10}
                  tickFormatter={(v) => `${v}%`}
                  domain={[0, 100]}
                />
              )}
              <Tooltip content={<CustomTooltip />} />
              
              {/* VaR Reference Line */}
              <ReferenceLine 
                x={metrics.var95}
                yAxisId="left"
                stroke="hsl(var(--status-warning))" 
                strokeDasharray="5 5" 
                strokeWidth={2}
                label={{
                  value: 'VaR 95%',
                  position: 'top',
                  fill: 'hsl(var(--status-warning))',
                  fontSize: 10,
                }}
              />
              
              {/* CVaR Reference Line */}
              <ReferenceLine 
                x={metrics.cvar95}
                yAxisId="left"
                stroke="hsl(var(--status-critical))" 
                strokeDasharray="3 3" 
                strokeWidth={2}
                label={{
                  value: 'CVaR',
                  position: 'top',
                  fill: 'hsl(var(--status-critical))',
                  fontSize: 10,
                }}
              />

              {/* Median Reference Line */}
              <ReferenceLine 
                x={metrics.median}
                yAxisId="left"
                stroke="hsl(var(--primary))" 
                strokeWidth={2}
                label={{
                  value: 'Median',
                  position: 'top',
                  fill: 'hsl(var(--primary))',
                  fontSize: 10,
                }}
              />

              {/* Histogram Bars */}
              <Bar 
                yAxisId="left"
                dataKey="count" 
                radius={[2, 2, 0, 0]}
              >
                {data.map((entry, index) => {
                  let color = 'hsl(var(--primary))';
                  if (entry.score <= metrics.cvar95) {
                    color = 'hsl(var(--status-critical))';
                  } else if (entry.score <= metrics.var95) {
                    color = 'hsl(var(--status-warning))';
                  } else if (entry.score >= 800) {
                    color = 'hsl(var(--status-good))';
                  }
                  return (
                    <Cell 
                      key={`cell-${index}`}
                      fill={color}
                      opacity={0.8}
                    />
                  );
                })}
              </Bar>

              {/* Cumulative Line */}
              {showCumulative && (
                <Area
                  yAxisId="right"
                  type="monotone"
                  dataKey="cumulative"
                  stroke="hsl(var(--brand-secondary))"
                  fill="hsl(var(--brand-secondary))"
                  fillOpacity={0.1}
                  strokeWidth={2}
                />
              )}
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Controls */}
        {showControls && (
          <div className="flex items-center justify-between pt-2 border-t border-border">
            <div className="flex items-center gap-4">
              <label className="flex items-center gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={showCumulative}
                  onChange={(e) => setShowCumulative(e.target.checked)}
                  className="rounded"
                />
                Show cumulative distribution
              </label>
            </div>
            
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-status-critical" />
                CVaR tail
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-status-warning" />
                VaR 95%
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-primary" />
                Normal range
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-3 h-3 rounded bg-status-good" />
                Strong (800+)
              </div>
            </div>
          </div>
        )}

        {/* Info tooltip */}
        <div className="flex items-start gap-2 p-3 bg-muted/30 rounded-lg text-xs text-muted-foreground">
          <Info className="h-4 w-4 shrink-0 mt-0.5" />
          <div>
            <strong>VaR (Value at Risk):</strong> With 95% confidence, your score won't fall below {metrics.var95}. 
            <strong className="ml-2">CVaR (Conditional VaR):</strong> If it does fall below VaR, the expected score is {metrics.cvar95}.
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
