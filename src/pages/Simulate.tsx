import { useState } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DEMO_SCENARIOS } from '@/data/demoScenarios';
import { DEMO_FINANCIAL_RISK } from '@/data/demoFinancialRisk';
import { LineChart, TrendingUp, TrendingDown, DollarSign, Clock, ArrowRight, Play, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';

export default function Simulate() {
  const [selectedScenario, setSelectedScenario] = useState(DEMO_SCENARIOS[0]);
  const [isRunning, setIsRunning] = useState(false);

  const { monteCarloResults } = DEMO_FINANCIAL_RISK;

  const formatCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value.toLocaleString()}`;
  };

  const runSimulation = () => {
    setIsRunning(true);
    setTimeout(() => setIsRunning(false), 2000);
  };

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <LineChart className="h-6 w-6 text-primary" />
              What-If Simulator
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              Model remediation scenarios and project governance outcomes
            </p>
          </div>
          <Button 
            onClick={runSimulation} 
            disabled={isRunning}
            className="gap-2"
          >
            <Play className="h-4 w-4" />
            {isRunning ? 'Running...' : 'Run Simulation'}
          </Button>
        </div>

        {/* Scenario Selection */}
        <div className="grid md:grid-cols-3 gap-4">
          {DEMO_SCENARIOS.map((scenario) => (
            <Card 
              key={scenario.id}
              className={cn(
                "border-border/50 bg-card/50 cursor-pointer transition-all hover:border-primary/50",
                selectedScenario.id === scenario.id && "border-primary bg-primary/5"
              )}
              onClick={() => setSelectedScenario(scenario)}
            >
              <CardContent className="p-4">
                <div className="flex items-start justify-between mb-2">
                  <h3 className="text-sm font-medium text-foreground">{scenario.name}</h3>
                  {selectedScenario.id === scenario.id && (
                    <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  )}
                </div>
                <p className="text-xs text-muted-foreground mb-3">{scenario.description}</p>
                <div className="flex items-center gap-4 text-xs">
                  <span className="flex items-center gap-1 text-[hsl(var(--status-success))]">
                    <TrendingUp className="h-3 w-3" />
                    +{scenario.projectedOutcomes.scoreChange.delta} pts
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {scenario.implementation.time}
                  </span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Simulation Results */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Projected Outcomes */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Projected Outcomes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Score Change */}
              <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Governance Score</span>
                  <Badge variant="outline" className="text-[hsl(var(--status-success))] border-[hsl(var(--status-success))]/50">
                    +{selectedScenario.projectedOutcomes.scoreChange.delta} points
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-2xl text-muted-foreground">
                    {selectedScenario.projectedOutcomes.scoreChange.from}
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <span className="font-mono text-2xl text-primary font-semibold">
                    {selectedScenario.projectedOutcomes.scoreChange.to}
                  </span>
                </div>
                <Progress 
                  value={(selectedScenario.projectedOutcomes.scoreChange.to / 1000) * 100} 
                  className="h-2 mt-3" 
                />
              </div>

              {/* Exposure Change */}
              <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm text-muted-foreground">Risk Exposure</span>
                  <Badge variant="outline" className="text-[hsl(var(--status-success))] border-[hsl(var(--status-success))]/50">
                    {formatCurrency(selectedScenario.projectedOutcomes.exposureChange.delta)} saved
                  </Badge>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-mono text-xl text-[hsl(var(--risk-high))]">
                    {formatCurrency(selectedScenario.projectedOutcomes.exposureChange.from)}
                  </span>
                  <ArrowRight className="h-5 w-5 text-primary" />
                  <span className="font-mono text-xl text-[hsl(var(--status-success))] font-semibold">
                    {formatCurrency(selectedScenario.projectedOutcomes.exposureChange.to)}
                  </span>
                </div>
              </div>

              {/* Additional Metrics */}
              {selectedScenario.projectedOutcomes.var95Change && (
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">VaR (95%)</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-[hsl(var(--status-success))]" />
                    <span className="font-mono text-sm">
                      {formatCurrency(selectedScenario.projectedOutcomes.var95Change.delta)}
                    </span>
                  </div>
                </div>
              )}
              {selectedScenario.projectedOutcomes.auditProbabilityChange && (
                <div className="flex items-center justify-between p-3 rounded-md bg-muted/30">
                  <span className="text-sm text-muted-foreground">Audit Probability</span>
                  <div className="flex items-center gap-2">
                    <TrendingDown className="h-4 w-4 text-[hsl(var(--status-success))]" />
                    <span className="font-mono text-sm">
                      {(selectedScenario.projectedOutcomes.auditProbabilityChange.delta * 100).toFixed(0)}%
                    </span>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Monte Carlo Distribution */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium">Risk Distribution (Monte Carlo)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[200px]">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={monteCarloResults.distribution}>
                    <defs>
                      <linearGradient id="colorProb" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="hsl(var(--chart-primary))" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="hsl(var(--chart-primary))" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis 
                      dataKey="exposure" 
                      tickFormatter={(v) => formatCurrency(v)}
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <YAxis 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                      axisLine={{ stroke: 'hsl(var(--border))' }}
                    />
                    <Tooltip 
                      contentStyle={{ 
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                      formatter={(value: number) => [`${(value * 100).toFixed(1)}%`, 'Probability']}
                      labelFormatter={(label) => formatCurrency(label)}
                    />
                    <ReferenceLine 
                      x={monteCarloResults.var95} 
                      stroke="hsl(var(--risk-high))" 
                      strokeDasharray="4 4"
                      label={{ value: 'VaR 95%', fill: 'hsl(var(--risk-high))', fontSize: 10 }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="probability" 
                      stroke="hsl(var(--chart-primary))"
                      fillOpacity={1}
                      fill="url(#colorProb)"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
              
              <div className="grid grid-cols-3 gap-4 mt-4 pt-4 border-t border-border/50">
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">Expected Loss</p>
                  <p className="font-mono text-lg font-semibold">{formatCurrency(monteCarloResults.expectedLoss)}</p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">VaR (95%)</p>
                  <p className="font-mono text-lg font-semibold text-[hsl(var(--risk-high))]">
                    {formatCurrency(monteCarloResults.var95)}
                  </p>
                </div>
                <div className="text-center">
                  <p className="text-xs text-muted-foreground">CVaR (95%)</p>
                  <p className="font-mono text-lg font-semibold text-[hsl(var(--risk-critical))]">
                    {formatCurrency(monteCarloResults.cvar95)}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Implementation Details */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary" />
              Implementation Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-6">
              <div className="text-center p-4 rounded-lg border border-border/50 bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Estimated Cost</p>
                <p className="font-mono text-2xl font-semibold text-foreground">
                  {formatCurrency(selectedScenario.implementation.cost)}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg border border-border/50 bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Timeline</p>
                <p className="font-mono text-2xl font-semibold text-foreground">
                  {selectedScenario.implementation.time}
                </p>
              </div>
              <div className="text-center p-4 rounded-lg border border-border/50 bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">ROI</p>
                <p className="font-mono text-2xl font-semibold text-[hsl(var(--status-success))]">
                  {selectedScenario.implementation.roi}x
                </p>
              </div>
              <div className="text-center p-4 rounded-lg border border-border/50 bg-muted/20">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Checkpoints Fixed</p>
                <p className="font-mono text-2xl font-semibold text-foreground">
                  {typeof selectedScenario.inputs.checkpointsToFix === 'number' 
                    ? selectedScenario.inputs.checkpointsToFix 
                    : selectedScenario.inputs.checkpointsToFix.length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
