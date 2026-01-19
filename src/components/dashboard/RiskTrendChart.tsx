import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { XAxis, YAxis, Tooltip, ResponsiveContainer, Area, Bar, ComposedChart, ReferenceLine } from 'recharts';
import { useMemo, useState, useCallback, useRef } from 'react';
import { TrendingUp, DollarSign, Settings2, ChevronDown, FileDown, AlertTriangle, Shield, Scale } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger, DropdownMenuSeparator, DropdownMenuLabel } from '@/components/ui/dropdown-menu';
import { Slider } from '@/components/ui/slider';
import { cn } from '@/lib/utils';
import html2pdf from 'html2pdf.js';

type Scenario = 'optimistic' | 'baseline' | 'pessimistic';

interface ForecastPoint {
  period: string;
  days: number;
  score: number;
  scoreOptimistic: number;
  scorePessimistic: number;
  benchmark: number;
  roi: number;
  roiOptimistic: number;
  roiPessimistic: number;
  cumulativeROI: number;
  cumulativeROIOptimistic: number;
  cumulativeROIPessimistic: number;
  riskReduction: number;
}

// Risk score to ROI mapping: higher score improvement = more ROI
const calculateROI = (scoreImprovement: number, baseExposure: number = 8.5): number => {
  // Every 10 points of score improvement reduces risk exposure by ~1.2%
  const riskReductionPercent = (scoreImprovement / 10) * 1.2;
  return Math.round((baseExposure * (riskReductionPercent / 100)) * 100) / 100;
};

export function RiskTrendChart() {
  const [scenario, setScenario] = useState<Scenario>('baseline');
  const [showRanges, setShowRanges] = useState(true);
  const [whatIfMultiplier, setWhatIfMultiplier] = useState(100); // 100% = baseline
  const [showExportPreview, setShowExportPreview] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  const forecastData = useMemo((): ForecastPoint[] => {
    const currentScore = 648;
    const industryBenchmark = 650;
    const baseExposure = 8.5; // €8.5M total exposure
    
    // Base improvements per period
    const baseImprovements = [0, 37, 72, 107, 142]; // cumulative score improvements
    
    // Apply what-if multiplier
    const multiplier = whatIfMultiplier / 100;
    
    return [
      { 
        period: 'Now', 
        days: 0, 
        score: currentScore, 
        scoreOptimistic: currentScore,
        scorePessimistic: currentScore,
        benchmark: industryBenchmark, 
        roi: 0, 
        roiOptimistic: 0,
        roiPessimistic: 0,
        cumulativeROI: 0,
        cumulativeROIOptimistic: 0,
        cumulativeROIPessimistic: 0,
        riskReduction: 0
      },
      { 
        period: '90d', 
        days: 90, 
        score: Math.round(currentScore + baseImprovements[1] * multiplier),
        scoreOptimistic: Math.round(currentScore + baseImprovements[1] * 1.3 * multiplier),
        scorePessimistic: Math.round(currentScore + baseImprovements[1] * 0.6 * multiplier),
        benchmark: 655, 
        roi: calculateROI(baseImprovements[1] * multiplier, baseExposure),
        roiOptimistic: calculateROI(baseImprovements[1] * 1.3 * multiplier, baseExposure),
        roiPessimistic: calculateROI(baseImprovements[1] * 0.6 * multiplier, baseExposure),
        cumulativeROI: calculateROI(baseImprovements[1] * multiplier, baseExposure),
        cumulativeROIOptimistic: calculateROI(baseImprovements[1] * 1.3 * multiplier, baseExposure),
        cumulativeROIPessimistic: calculateROI(baseImprovements[1] * 0.6 * multiplier, baseExposure),
        riskReduction: Math.round((baseImprovements[1] * multiplier / 10) * 1.2)
      },
      { 
        period: '180d', 
        days: 180, 
        score: Math.round(currentScore + baseImprovements[2] * multiplier),
        scoreOptimistic: Math.round(currentScore + baseImprovements[2] * 1.3 * multiplier),
        scorePessimistic: Math.round(currentScore + baseImprovements[2] * 0.6 * multiplier),
        benchmark: 660, 
        roi: calculateROI((baseImprovements[2] - baseImprovements[1]) * multiplier, baseExposure),
        roiOptimistic: calculateROI((baseImprovements[2] - baseImprovements[1]) * 1.3 * multiplier, baseExposure),
        roiPessimistic: calculateROI((baseImprovements[2] - baseImprovements[1]) * 0.6 * multiplier, baseExposure),
        cumulativeROI: calculateROI(baseImprovements[2] * multiplier, baseExposure),
        cumulativeROIOptimistic: calculateROI(baseImprovements[2] * 1.3 * multiplier, baseExposure),
        cumulativeROIPessimistic: calculateROI(baseImprovements[2] * 0.6 * multiplier, baseExposure),
        riskReduction: Math.round((baseImprovements[2] * multiplier / 10) * 1.2)
      },
      { 
        period: '270d', 
        days: 270, 
        score: Math.round(currentScore + baseImprovements[3] * multiplier),
        scoreOptimistic: Math.round(currentScore + baseImprovements[3] * 1.3 * multiplier),
        scorePessimistic: Math.round(currentScore + baseImprovements[3] * 0.6 * multiplier),
        benchmark: 665, 
        roi: calculateROI((baseImprovements[3] - baseImprovements[2]) * multiplier, baseExposure),
        roiOptimistic: calculateROI((baseImprovements[3] - baseImprovements[2]) * 1.3 * multiplier, baseExposure),
        roiPessimistic: calculateROI((baseImprovements[3] - baseImprovements[2]) * 0.6 * multiplier, baseExposure),
        cumulativeROI: calculateROI(baseImprovements[3] * multiplier, baseExposure),
        cumulativeROIOptimistic: calculateROI(baseImprovements[3] * 1.3 * multiplier, baseExposure),
        cumulativeROIPessimistic: calculateROI(baseImprovements[3] * 0.6 * multiplier, baseExposure),
        riskReduction: Math.round((baseImprovements[3] * multiplier / 10) * 1.2)
      },
      { 
        period: '365d', 
        days: 365, 
        score: Math.round(currentScore + baseImprovements[4] * multiplier),
        scoreOptimistic: Math.round(currentScore + baseImprovements[4] * 1.3 * multiplier),
        scorePessimistic: Math.round(currentScore + baseImprovements[4] * 0.6 * multiplier),
        benchmark: 670, 
        roi: calculateROI((baseImprovements[4] - baseImprovements[3]) * multiplier, baseExposure),
        roiOptimistic: calculateROI((baseImprovements[4] - baseImprovements[3]) * 1.3 * multiplier, baseExposure),
        roiPessimistic: calculateROI((baseImprovements[4] - baseImprovements[3]) * 0.6 * multiplier, baseExposure),
        cumulativeROI: calculateROI(baseImprovements[4] * multiplier, baseExposure),
        cumulativeROIOptimistic: calculateROI(baseImprovements[4] * 1.3 * multiplier, baseExposure),
        cumulativeROIPessimistic: calculateROI(baseImprovements[4] * 0.6 * multiplier, baseExposure),
        riskReduction: Math.round((baseImprovements[4] * multiplier / 10) * 1.2)
      },
    ];
  }, [whatIfMultiplier]);

  const getScoreKey = () => {
    if (scenario === 'optimistic') return 'scoreOptimistic';
    if (scenario === 'pessimistic') return 'scorePessimistic';
    return 'score';
  };

  const getROIKey = () => {
    if (scenario === 'optimistic') return 'cumulativeROIOptimistic';
    if (scenario === 'pessimistic') return 'cumulativeROIPessimistic';
    return 'cumulativeROI';
  };

  const finalData = forecastData[4];
  const scoreImprovement = finalData[getScoreKey() as keyof ForecastPoint] as number - forecastData[0].score;
  const totalROI = finalData[getROIKey() as keyof ForecastPoint] as number;

  const scenarioColors = {
    optimistic: 'text-primary',
    baseline: 'text-secondary',
    pessimistic: 'text-risk-medium'
  };

  // Calculate fear-inducing penalty exposure metrics
  const penaltyData = useMemo(() => {
    const baseExposure = 8.5; // €8.5M
    const euAIActPenalty = 35; // €35M or 7% of global turnover
    const gdprPenalty = 20; // €20M or 4% of turnover
    const reputationalDamage = 15; // €15M estimated
    
    const currentRiskPercent = (1000 - forecastData[0].score) / 10; // ~35%
    const inactionMultiplier = 1.8; // Risk compounds 80% over inaction
    
    return {
      currentExposure: baseExposure,
      euAIActRisk: euAIActPenalty * (currentRiskPercent / 100),
      gdprRisk: gdprPenalty * (currentRiskPercent / 100),
      reputationalRisk: reputationalDamage * (currentRiskPercent / 100),
      inactionPenalty12Mo: baseExposure * inactionMultiplier,
      inactionPenalty24Mo: baseExposure * inactionMultiplier * 1.5,
      complianceDeadline: '2026-08-02',
      daysUntilDeadline: Math.ceil((new Date('2026-08-02').getTime() - Date.now()) / (1000 * 60 * 60 * 24)),
      auditsExpected: 3,
      nonComplianceProb: Math.round(currentRiskPercent * 2.5),
    };
  }, [forecastData]);

  const handleExportPDF = useCallback(async () => {
    setShowExportPreview(true);
    
    // Wait for render
    await new Promise(resolve => setTimeout(resolve, 100));
    
    const element = exportRef.current;
    if (!element) return;

    const opt = {
      margin: [10, 10, 10, 10] as [number, number, number, number],
      filename: `METRIS-Scenario-Analysis-${new Date().toISOString().split('T')[0]}.pdf`,
      image: { type: 'jpeg' as const, quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm' as const, format: 'a4' as const, orientation: 'portrait' as const }
    };

    await html2pdf().set(opt).from(element).save();
    setShowExportPreview(false);
  }, []);

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <div className="flex items-center gap-3">
            <CardTitle className="text-sm font-light">Score & ROI Forecast</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="h-7 text-xs gap-1 font-light">
                  <Settings2 className="h-3 w-3" />
                  {scenario.charAt(0).toUpperCase() + scenario.slice(1)}
                  <ChevronDown className="h-3 w-3" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuLabel className="text-xs font-light">Scenario Analysis</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setScenario('optimistic')} className="text-xs">
                  <span className="w-2 h-2 rounded-full bg-primary mr-2" />
                  Optimistic (+30%)
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScenario('baseline')} className="text-xs">
                  <span className="w-2 h-2 rounded-full bg-secondary mr-2" />
                  Baseline
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setScenario('pessimistic')} className="text-xs">
                  <span className="w-2 h-2 rounded-full bg-risk-medium mr-2" />
                  Pessimistic (-40%)
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setShowRanges(!showRanges)} className="text-xs">
                  {showRanges ? '✓ ' : ''}Show Confidence Ranges
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="flex items-center gap-4">
            <div className={cn("flex items-center gap-1 text-sm", scenarioColors[scenario])}>
              <TrendingUp className="h-4 w-4" />
              <span className="font-light">+{scoreImprovement} pts</span>
            </div>
            <div className="flex items-center gap-1 text-sm text-gold">
              <DollarSign className="h-4 w-4" />
              <span className="font-light">€{totalROI.toFixed(1)}M saved</span>
            </div>
            <Button 
              variant="outline" 
              size="sm" 
              className="h-7 text-xs gap-1 font-light border-destructive/50 text-destructive hover:bg-destructive/10"
              onClick={handleExportPDF}
            >
              <FileDown className="h-3 w-3" />
              Export Report
            </Button>
          </div>
        </div>
        
        {/* What-If Analysis Slider */}
        <div className="mt-3 pt-3 border-t border-border/30">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs text-muted-foreground font-light">What-If Analysis: Remediation Effort</span>
            <span className="text-xs font-medium">{whatIfMultiplier}%</span>
          </div>
          <Slider
            value={[whatIfMultiplier]}
            onValueChange={(v) => setWhatIfMultiplier(v[0])}
            min={50}
            max={150}
            step={10}
            className="w-full"
          />
          <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
            <span>Reduced Effort (50%)</span>
            <span>Baseline (100%)</span>
            <span>Accelerated (150%)</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={220}>
          <ComposedChart data={forecastData} margin={{ top: 10, right: 30, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="roiGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="hsl(45, 70%, 50%)" stopOpacity={0.8} />
                <stop offset="95%" stopColor="hsl(45, 70%, 50%)" stopOpacity={0.3} />
              </linearGradient>
              <linearGradient id="rangeGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="hsl(var(--primary))" stopOpacity={0.15} />
                <stop offset="100%" stopColor="hsl(var(--primary))" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="period" 
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis 
              yAxisId="score"
              domain={[550, 900]}
              tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
              ticks={[600, 700, 800, 900]}
              label={{ value: 'Score', angle: -90, position: 'insideLeft', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
            />
            <YAxis 
              yAxisId="roi"
              orientation="right"
              domain={[0, 3]}
              tick={{ fontSize: 11, fill: 'hsl(45, 70%, 50%)' }}
              axisLine={false}
              tickLine={false}
              ticks={[0, 1, 2, 3]}
              tickFormatter={(v) => `€${v}M`}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'score' || name === 'scoreOptimistic' || name === 'scorePessimistic') 
                  return [value, 'Score'];
                if (name === 'benchmark') return [value, 'Benchmark'];
                if (name.includes('ROI')) return [`€${value.toFixed(2)}M`, 'ROI'];
                if (name === 'riskReduction') return [`${value}%`, 'Risk Reduction'];
                return [value, name];
              }}
              labelFormatter={(label) => `Forecast: ${label}`}
            />
            <ReferenceLine 
              yAxisId="score"
              y={750} 
              stroke="hsl(var(--primary))" 
              strokeDasharray="3 3" 
              strokeOpacity={0.5}
              label={{ value: 'Target 750', position: 'right', fontSize: 10, fill: 'hsl(var(--muted-foreground))' }} 
            />
            
            {/* Confidence range area */}
            {showRanges && (
              <Area
                yAxisId="score"
                type="monotone"
                dataKey="scoreOptimistic"
                stroke="none"
                fill="url(#rangeGradient)"
                name="optimisticRange"
              />
            )}
            {showRanges && (
              <Area
                yAxisId="score"
                type="monotone"
                dataKey="scorePessimistic"
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="2 2"
                strokeWidth={1}
                strokeOpacity={0.5}
                fill="none"
                name="pessimisticRange"
              />
            )}
            
            {/* ROI Bars */}
            <Bar
              yAxisId="roi"
              dataKey={getROIKey()}
              fill="url(#roiGradient)"
              radius={[4, 4, 0, 0]}
              barSize={28}
              name="cumulativeROI"
            />
            
            {/* Benchmark line */}
            <Area
              yAxisId="score"
              type="monotone"
              dataKey="benchmark"
              stroke="hsl(var(--muted-foreground))"
              strokeDasharray="5 5"
              strokeWidth={1.5}
              fill="none"
              dot={{ fill: 'hsl(var(--muted-foreground))', r: 2 }}
              name="benchmark"
            />
            
            {/* Main forecast line */}
            <Area
              yAxisId="score"
              type="monotone"
              dataKey={getScoreKey()}
              stroke="hsl(var(--primary))"
              strokeWidth={2.5}
              fill="url(#forecastGradient)"
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 4 }}
              activeDot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 6 }}
              name="score"
            />
          </ComposedChart>
        </ResponsiveContainer>
        
        {/* Legend and forecast details */}
        <div className="flex flex-col gap-3 mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <div className="w-4 h-0.5 bg-primary" />
                <span>Forecast ({scenario})</span>
              </div>
              {showRanges && (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-3 bg-primary/10 border border-primary/30 rounded-sm" />
                  <span>Range</span>
                </div>
              )}
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-sm bg-gold/60" />
                <span>ROI</span>
              </div>
            </div>
          </div>
          
          {/* Detailed forecast table */}
          <div className="grid grid-cols-4 gap-2">
            {forecastData.slice(1).map((point) => {
              const score = point[getScoreKey() as keyof ForecastPoint] as number;
              const roi = point[getROIKey() as keyof ForecastPoint] as number;
              return (
                <div 
                  key={point.period} 
                  className="text-[10px] p-2 rounded bg-muted/30 flex flex-col gap-1"
                >
                  <div className="font-medium text-foreground">{point.period}</div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Score:</span>
                    <span className={cn("font-medium", scenarioColors[scenario])}>{score}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Risk ↓:</span>
                    <span className="text-primary">{point.riskReduction}%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">ROI:</span>
                    <span className="text-gold font-medium">€{roi.toFixed(2)}M</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </CardContent>
      
      {/* Hidden PDF Export Template */}
      {showExportPreview && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-pulse text-lg">Generating Executive Report...</div>
          </div>
        </div>
      )}
      <div 
        ref={exportRef} 
        className={cn(
          "bg-white text-slate-900 p-8 w-[210mm] min-h-[297mm]",
          showExportPreview ? "fixed left-[-9999px] top-0" : "hidden"
        )}
        style={{ fontFamily: 'system-ui, -apple-system, sans-serif' }}
      >
        {/* PDF Header */}
        <div className="border-b-2 border-slate-900 pb-4 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-slate-900">METRIS™ SCENARIO ANALYSIS</h1>
              <p className="text-sm text-slate-600">Executive Risk Assessment Report</p>
            </div>
            <div className="text-right text-xs text-slate-500">
              <div>Generated: {new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
              <div>Classification: CONFIDENTIAL</div>
            </div>
          </div>
        </div>

        {/* Critical Alert Banner */}
        <div className="bg-red-50 border-2 border-red-500 rounded-lg p-4 mb-6">
          <div className="flex items-start gap-3">
            <AlertTriangle className="h-6 w-6 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <h2 className="font-bold text-red-800 text-lg">REGULATORY COMPLIANCE DEADLINE</h2>
              <p className="text-red-700 text-sm">
                EU AI Act full enforcement begins {penaltyData.complianceDeadline}. 
                <span className="font-bold"> {penaltyData.daysUntilDeadline} days remaining.</span>
              </p>
              <p className="text-red-600 text-xs mt-1">
                Non-compliance probability at current trajectory: <span className="font-bold">{penaltyData.nonComplianceProb}%</span>
              </p>
            </div>
          </div>
        </div>

        {/* Penalty Exposure Summary */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Scale className="h-5 w-5" />
            POTENTIAL PENALTY EXPOSURE
          </h2>
          <div className="grid grid-cols-2 gap-4">
            <div className="border border-slate-200 rounded p-3">
              <div className="text-xs text-slate-500 uppercase">EU AI Act Penalties</div>
              <div className="text-2xl font-bold text-red-600">€{penaltyData.euAIActRisk.toFixed(1)}M</div>
              <div className="text-xs text-slate-500">Up to €35M or 7% global turnover</div>
            </div>
            <div className="border border-slate-200 rounded p-3">
              <div className="text-xs text-slate-500 uppercase">GDPR Violations</div>
              <div className="text-2xl font-bold text-red-600">€{penaltyData.gdprRisk.toFixed(1)}M</div>
              <div className="text-xs text-slate-500">Up to €20M or 4% global turnover</div>
            </div>
            <div className="border border-slate-200 rounded p-3">
              <div className="text-xs text-slate-500 uppercase">Reputational Damage</div>
              <div className="text-2xl font-bold text-orange-600">€{penaltyData.reputationalRisk.toFixed(1)}M</div>
              <div className="text-xs text-slate-500">Brand value & customer trust</div>
            </div>
            <div className="border border-slate-200 rounded p-3 bg-red-50">
              <div className="text-xs text-slate-500 uppercase">Total Current Exposure</div>
              <div className="text-2xl font-bold text-red-700">€{penaltyData.currentExposure.toFixed(1)}M</div>
              <div className="text-xs text-red-600">Requires immediate attention</div>
            </div>
          </div>
        </div>

        {/* Inaction Cost Analysis */}
        <div className="mb-6 bg-slate-50 rounded-lg p-4">
          <h3 className="font-bold text-slate-900 mb-3 flex items-center gap-2">
            <AlertTriangle className="h-4 w-4 text-orange-500" />
            COST OF INACTION
          </h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-200">
                <th className="text-left py-2 text-slate-500 font-medium">Timeline</th>
                <th className="text-right py-2 text-slate-500 font-medium">Risk Exposure</th>
                <th className="text-right py-2 text-slate-500 font-medium">vs. Current</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-medium">Current State</td>
                <td className="py-2 text-right">€{penaltyData.currentExposure.toFixed(1)}M</td>
                <td className="py-2 text-right text-slate-400">—</td>
              </tr>
              <tr className="border-b border-slate-100">
                <td className="py-2 font-medium text-orange-700">After 12 months (no action)</td>
                <td className="py-2 text-right text-orange-700 font-bold">€{penaltyData.inactionPenalty12Mo.toFixed(1)}M</td>
                <td className="py-2 text-right text-orange-700">+80%</td>
              </tr>
              <tr>
                <td className="py-2 font-medium text-red-700">After 24 months (no action)</td>
                <td className="py-2 text-right text-red-700 font-bold">€{penaltyData.inactionPenalty24Mo.toFixed(1)}M</td>
                <td className="py-2 text-right text-red-700">+170%</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Scenario Comparison Table */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            SCENARIO COMPARISON
          </h2>
          <table className="w-full text-sm border border-slate-200 rounded">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-2 border-b border-slate-200">Metric</th>
                <th className="text-center p-2 border-b border-slate-200 text-green-700">Optimistic</th>
                <th className="text-center p-2 border-b border-slate-200 text-blue-700">Baseline</th>
                <th className="text-center p-2 border-b border-slate-200 text-red-700">Pessimistic</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.slice(1).map((point, idx) => (
                <tr key={point.period} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="p-2 border-b border-slate-100 font-medium">{point.period} Forecast</td>
                  <td className="p-2 border-b border-slate-100 text-center">
                    <div className="font-bold text-green-700">{point.scoreOptimistic}</div>
                    <div className="text-xs text-green-600">€{point.cumulativeROIOptimistic.toFixed(2)}M saved</div>
                  </td>
                  <td className="p-2 border-b border-slate-100 text-center">
                    <div className="font-bold text-blue-700">{point.score}</div>
                    <div className="text-xs text-blue-600">€{point.cumulativeROI.toFixed(2)}M saved</div>
                  </td>
                  <td className="p-2 border-b border-slate-100 text-center">
                    <div className="font-bold text-red-700">{point.scorePessimistic}</div>
                    <div className="text-xs text-red-600">€{point.cumulativeROIPessimistic.toFixed(2)}M saved</div>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-bold">
                <td className="p-2">12-Month Total ROI</td>
                <td className="p-2 text-center text-green-700">€{forecastData[4].cumulativeROIOptimistic.toFixed(2)}M</td>
                <td className="p-2 text-center text-blue-700">€{forecastData[4].cumulativeROI.toFixed(2)}M</td>
                <td className="p-2 text-center text-red-700">€{forecastData[4].cumulativeROIPessimistic.toFixed(2)}M</td>
              </tr>
            </tfoot>
          </table>
        </div>

        {/* Risk-ROI Correlation */}
        <div className="mb-6">
          <h3 className="font-bold text-slate-900 mb-3">RISK SCORE ↔ ROI CORRELATION</h3>
          <table className="w-full text-sm border border-slate-200 rounded">
            <thead>
              <tr className="bg-slate-100">
                <th className="text-left p-2 border-b border-slate-200">Period</th>
                <th className="text-center p-2 border-b border-slate-200">Risk Score</th>
                <th className="text-center p-2 border-b border-slate-200">Risk Reduction</th>
                <th className="text-center p-2 border-b border-slate-200">ROI Generated</th>
                <th className="text-center p-2 border-b border-slate-200">€ per Point</th>
              </tr>
            </thead>
            <tbody>
              {forecastData.slice(1).map((point, idx) => {
                const scoreKey = getScoreKey() as keyof ForecastPoint;
                const roiKey = getROIKey() as keyof ForecastPoint;
                const score = point[scoreKey] as number;
                const roi = point[roiKey] as number;
                const prevScore = idx === 0 ? forecastData[0].score : (forecastData[idx][scoreKey] as number);
                const pointDiff = score - forecastData[0].score;
                const euroPerPoint = pointDiff > 0 ? (roi / pointDiff) : 0;
                
                return (
                  <tr key={point.period} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                    <td className="p-2 border-b border-slate-100 font-medium">{point.period}</td>
                    <td className="p-2 border-b border-slate-100 text-center font-bold">{score}</td>
                    <td className="p-2 border-b border-slate-100 text-center text-green-600">-{point.riskReduction}%</td>
                    <td className="p-2 border-b border-slate-100 text-center text-amber-600 font-bold">€{roi.toFixed(2)}M</td>
                    <td className="p-2 border-b border-slate-100 text-center text-slate-600">€{(euroPerPoint * 1000).toFixed(0)}K</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Call to Action */}
        <div className="bg-slate-900 text-white rounded-lg p-6 mt-6">
          <h3 className="text-lg font-bold mb-2">IMMEDIATE ACTION REQUIRED</h3>
          <p className="text-slate-300 text-sm mb-4">
            Based on this analysis, delaying remediation by even 90 days increases your regulatory penalty exposure by approximately €{(penaltyData.currentExposure * 0.15).toFixed(1)}M.
          </p>
          <div className="flex gap-4 text-sm">
            <div className="flex-1 bg-white/10 rounded p-3">
              <div className="text-amber-400 font-medium text-sm">Expected Audits</div>
              <div className="text-2xl font-mono font-medium">{penaltyData.auditsExpected}</div>
              <div className="text-xs text-slate-400">Next 12 months</div>
            </div>
            <div className="flex-1 bg-white/10 rounded p-3">
              <div className="text-green-400 font-medium text-sm">Potential Savings</div>
              <div className="text-2xl font-mono font-medium">€{totalROI.toFixed(1)}M</div>
              <div className="text-xs text-slate-400">With remediation</div>
            </div>
            <div className="flex-1 bg-red-500/20 rounded p-3">
              <div className="text-red-400 font-medium text-sm">At-Risk Amount</div>
              <div className="text-2xl font-mono font-medium">€{(penaltyData.euAIActRisk + penaltyData.gdprRisk).toFixed(1)}M</div>
              <div className="text-xs text-slate-400">Without action</div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-8 pt-4 border-t border-slate-200 text-xs text-slate-500 flex justify-between">
          <div>METRIS™ AI Governance Platform</div>
          <div>This report is confidential and intended for executive review only.</div>
        </div>
      </div>
    </Card>
  );
}
