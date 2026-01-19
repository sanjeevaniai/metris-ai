import { useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { mockFinancialMetrics, generateSimulationData } from '@/data/mockData';
import { cn } from '@/lib/utils';
import { TrendingUp, TrendingDown, AlertTriangle, DollarSign, ArrowRight, Target, Shield, Zap } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { useState } from 'react';

interface SimulationViewProps {
  onContinue: () => void;
}

export function SimulationView({ onContinue }: SimulationViewProps) {
  const [riskAppetite, setRiskAppetite] = useState([50]);
  const simulationData = useMemo(() => generateSimulationData(), []);
  
  // Transform data for fan chart
  const chartData = useMemo(() => {
    const grouped: Record<number, { iteration: number; best: number; likely: number; worst: number }> = {};
    simulationData.forEach(({ iteration, value, scenario }) => {
      if (!grouped[iteration]) {
        grouped[iteration] = { iteration, best: 0, likely: 0, worst: 0 };
      }
      grouped[iteration][scenario] = value;
    });
    return Object.values(grouped);
  }, [simulationData]);

  const metrics = mockFinancialMetrics;

  const scenarios = [
    {
      name: 'Best Case',
      probability: '5th percentile',
      value: metrics.totalExposure * 0.4,
      description: 'All quick wins implemented, no adverse events',
      icon: TrendingDown,
      color: 'text-primary',
    },
    {
      name: 'Most Likely',
      probability: '50th percentile',
      value: metrics.expectedLoss,
      description: 'Typical remediation timeline with normal variance',
      icon: Target,
      color: 'text-gold',
    },
    {
      name: 'Worst Case',
      probability: '95th percentile',
      value: metrics.varP95,
      description: 'Regulatory action or major incident occurs',
      icon: AlertTriangle,
      color: 'text-risk-critical',
    },
  ];

  const adjustedROI = metrics.netROI * (1 + (riskAppetite[0] - 50) / 100);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Monte Carlo Simulation</h2>
          <p className="text-muted-foreground">
            10,000 iterations modeling potential risk outcomes
          </p>
        </div>
        <Badge variant="outline" className="text-sm">
          <Zap className="h-3 w-3 mr-1" />
          Advanced Analytics
        </Badge>
      </div>

      {/* Fan Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Risk Distribution Fan Chart</CardTitle>
          <CardDescription>
            Probability-weighted outcomes across scenarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="worstGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="hsl(0, 72%, 51%)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="likelyGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(45, 93%, 58%)" stopOpacity={0.5}/>
                    <stop offset="95%" stopColor="hsl(45, 93%, 58%)" stopOpacity={0.1}/>
                  </linearGradient>
                  <linearGradient id="bestGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.6}/>
                    <stop offset="95%" stopColor="hsl(160, 84%, 39%)" stopOpacity={0.1}/>
                  </linearGradient>
                </defs>
                <XAxis 
                  dataKey="iteration" 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(v) => `${v}%`}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))" 
                  fontSize={12}
                  tickFormatter={(v) => `€${(v / 1000000).toFixed(1)}M`}
                />
                <Tooltip 
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                  formatter={(value: number) => [`€${(value / 1000000).toFixed(2)}M`, '']}
                />
                <Legend />
                <Area 
                  type="monotone" 
                  dataKey="worst" 
                  stroke="hsl(0, 72%, 51%)" 
                  fill="url(#worstGradient)"
                  name="95th Percentile (Worst)"
                />
                <Area 
                  type="monotone" 
                  dataKey="likely" 
                  stroke="hsl(45, 93%, 58%)" 
                  fill="url(#likelyGradient)"
                  name="50th Percentile (Likely)"
                />
                <Area 
                  type="monotone" 
                  dataKey="best" 
                  stroke="hsl(160, 84%, 39%)" 
                  fill="url(#bestGradient)"
                  name="5th Percentile (Best)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Financial Metrics */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">Financial Risk Metrics</CardTitle>
            <CardDescription>
              Value at Risk and Expected Loss calculations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">Total Exposure</p>
                <p className="text-2xl font-bold text-gradient">
                  €{(metrics.totalExposure / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">VaR (95%)</p>
                <p className="text-2xl font-bold text-risk-high">
                  €{(metrics.varP95 / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">CVaR (99%)</p>
                <p className="text-2xl font-bold text-risk-critical">
                  €{(metrics.cvarP99 / 1000000).toFixed(1)}M
                </p>
              </div>
              <div className="p-4 rounded-lg bg-muted/50 text-center">
                <p className="text-sm text-muted-foreground mb-1">Expected Loss</p>
                <p className="text-2xl font-bold text-gold">
                  €{(metrics.expectedLoss / 1000000).toFixed(1)}M
                </p>
              </div>
            </div>

            {/* Scenario Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {scenarios.map((scenario) => {
                const Icon = scenario.icon;
                return (
                  <div
                    key={scenario.name}
                    className="p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <Icon className={cn('h-5 w-5', scenario.color)} />
                      <span className="font-medium">{scenario.name}</span>
                    </div>
                    <p className={cn('text-2xl font-bold mb-1', scenario.color)}>
                      €{(scenario.value / 1000000).toFixed(1)}M
                    </p>
                    <Badge variant="outline" className="text-xs mb-2">
                      {scenario.probability}
                    </Badge>
                    <p className="text-xs text-muted-foreground">
                      {scenario.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* ROI Projection */}
        <Card className="border-primary/30 shadow-glow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              ROI Projection
            </CardTitle>
            <CardDescription>
              Remediation savings forecast
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Risk Appetite Control */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Risk Appetite</span>
                <Badge variant="outline">{riskAppetite[0]}%</Badge>
              </div>
              <Slider
                value={riskAppetite}
                onValueChange={setRiskAppetite}
                max={100}
                step={5}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>Conservative</span>
                <span>Aggressive</span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Remediation Cost</span>
                <span className="font-bold text-risk-medium">
                  €{(metrics.remediationCost / 1000000).toFixed(2)}M
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Risk Reduction</span>
                <span className="font-bold text-primary">
                  €{(metrics.totalExposure - metrics.expectedLoss) / 1000000}M
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-sm font-medium">Net ROI</span>
                <span className="font-bold text-gradient">
                  €{(adjustedROI / 1000000).toFixed(1)}M
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg gradient-primary/10 border border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  <span className="font-medium">ROI Multiple</span>
                </div>
                <span className="text-2xl font-bold text-gradient">
                  {metrics.roiMultiple.toFixed(1)}x
                </span>
              </div>
              <p className="text-xs text-muted-foreground">
                Payback period: {metrics.paybackPeriod} months
              </p>
            </div>

            <Button
              className="w-full gradient-primary text-primary-foreground shadow-glow-sm"
              onClick={onContinue}
            >
              Generate Report
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
