import React, { useMemo } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_QUICK_WINS } from '@/data/demoQuickWins';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, Save } from 'lucide-react';

interface WaterfallChartProps {
  className?: string;
  onAddFix?: () => void;
}

interface WaterfallDataPoint {
  name: string;
  value: number;
  delta: number;
  runningTotal: number;
  isTotal: boolean;
  checkpointId?: string;
  cost?: number;
  roi?: number;
}

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload as WaterfallDataPoint;
    
    return (
      <div className="bg-bg-secondary border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-text-primary mb-2">{data.name}</p>
        <div className="space-y-1 text-sm">
          {!data.isTotal && data.delta !== 0 && (
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Reduction:</span>
              <span className="text-status-good font-mono">
                -${(Math.abs(data.delta) / 1000000).toFixed(2)}M
              </span>
            </div>
          )}
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">
              {data.isTotal ? 'Total Exposure:' : 'New Total:'}
            </span>
            <span className={cn(
              "font-mono",
              data.isTotal && data.name === 'After Fixes' ? "text-brand-primary" : "text-text-primary"
            )}>
              ${(data.runningTotal / 1000000).toFixed(2)}M
            </span>
          </div>
          {data.cost && (
            <div className="flex justify-between gap-4 border-t border-white/10 pt-1 mt-1">
              <span className="text-text-secondary">Implementation Cost:</span>
              <span className="font-mono text-text-primary">
                ${(data.cost / 1000).toFixed(0)}K
              </span>
            </div>
          )}
          {data.roi && (
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">ROI:</span>
              <span className="font-mono text-status-good">{data.roi.toFixed(1)}x</span>
            </div>
          )}
        </div>
      </div>
    );
  }
  return null;
};

export function WaterfallChart({ className, onAddFix }: WaterfallChartProps) {
  const {
    metrics,
    simulatedFixes,
    removeSimulatedFix,
    clearSimulatedFixes,
    addSimulatedFix,
  } = useVisualizationStore();

  // Build waterfall data from simulated fixes
  const waterfallData = useMemo(() => {
    const data: WaterfallDataPoint[] = [];
    let runningTotal = metrics.currentExposure;

    // Starting point
    data.push({
      name: 'Current Exposure',
      value: runningTotal,
      delta: 0,
      runningTotal,
      isTotal: true,
    });

    // Add each simulated fix
    simulatedFixes.forEach((fix, index) => {
      const quickWin = DEMO_QUICK_WINS.find(w => w.checkpointId === fix.checkpointId);
      const delta = -fix.exposureReduction;
      runningTotal += delta;
      
      data.push({
        name: quickWin?.name || `Fix ${index + 1}`,
        value: Math.abs(delta),
        delta,
        runningTotal,
        isTotal: false,
        checkpointId: fix.checkpointId,
        cost: quickWin?.estimatedCost,
        roi: quickWin?.roi,
      });
    });

    // Ending point (if there are fixes)
    if (simulatedFixes.length > 0) {
      data.push({
        name: 'After Fixes',
        value: runningTotal,
        delta: 0,
        runningTotal,
        isTotal: true,
      });
    }

    return data;
  }, [metrics.currentExposure, simulatedFixes]);

  // Calculate summary stats
  const summary = useMemo(() => {
    const totalInvestment = simulatedFixes.reduce((sum, fix) => {
      const quickWin = DEMO_QUICK_WINS.find(w => w.checkpointId === fix.checkpointId);
      return sum + (quickWin?.estimatedCost || 0);
    }, 0);
    
    const totalSavings = simulatedFixes.reduce((sum, fix) => sum + fix.exposureReduction, 0);
    const overallROI = totalInvestment > 0 ? totalSavings / totalInvestment : 0;
    const paybackDays = totalInvestment > 0 ? Math.ceil((totalInvestment / totalSavings) * 365) : 0;

    return { totalInvestment, totalSavings, overallROI, paybackDays };
  }, [simulatedFixes]);

  // Add a quick win to simulation
  const handleAddQuickWin = (quickWin: typeof DEMO_QUICK_WINS[0]) => {
    addSimulatedFix({
      checkpointId: quickWin.checkpointId,
      status: 'pending',
      pointsGain: quickWin.pointGain,
      exposureReduction: quickWin.exposureReduction,
    });
  };

  // Available quick wins (not already simulated)
  const availableQuickWins = DEMO_QUICK_WINS.filter(
    w => !simulatedFixes.some(f => f.checkpointId === w.checkpointId)
  ).slice(0, 5);

  return (
    <div className={cn("space-y-4", className)}>
      {/* Chart */}
      <div className="bg-bg-secondary rounded-lg border border-white/10 p-4">
        <h3 className="text-lg font-semibold text-text-primary mb-4">
          Exposure Reduction Waterfall
        </h3>
        
        <ResponsiveContainer width="100%" height={300}>
          <BarChart
            data={waterfallData}
            margin={{ top: 20, right: 30, left: 20, bottom: 60 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
            <XAxis
              dataKey="name"
              tick={{ fill: '#a0aec0', fontSize: 11 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              angle={-45}
              textAnchor="end"
              height={60}
            />
            <YAxis
              tick={{ fill: '#a0aec0', fontSize: 11 }}
              tickLine={{ stroke: 'rgba(255,255,255,0.2)' }}
              tickFormatter={(value) => `$${(value / 1000000).toFixed(1)}M`}
              domain={[0, 'auto']}
            />
            <Tooltip content={<CustomTooltip />} />
            <ReferenceLine y={0} stroke="rgba(255,255,255,0.3)" />
            
            <Bar dataKey="value" radius={[4, 4, 0, 0]}>
              {waterfallData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={
                    entry.isTotal
                      ? entry.name === 'Current Exposure'
                        ? '#6b7280'
                        : '#00d4aa'
                      : '#22c55e'
                  }
                  fillOpacity={entry.isTotal ? 1 : 0.8}
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Summary Stats */}
      {simulatedFixes.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="bg-bg-secondary border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-text-secondary text-sm">Total Investment</p>
              <p className="text-2xl font-mono font-bold text-text-primary">
                ${(summary.totalInvestment / 1000).toFixed(0)}K
              </p>
            </CardContent>
          </Card>
          <Card className="bg-bg-secondary border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-text-secondary text-sm">Total Savings</p>
              <p className="text-2xl font-mono font-bold text-status-good">
                ${(summary.totalSavings / 1000000).toFixed(2)}M
              </p>
            </CardContent>
          </Card>
          <Card className="bg-bg-secondary border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-text-secondary text-sm">Overall ROI</p>
              <p className="text-2xl font-mono font-bold text-brand-primary">
                {summary.overallROI.toFixed(1)}x
              </p>
            </CardContent>
          </Card>
          <Card className="bg-bg-secondary border-white/10">
            <CardContent className="p-4 text-center">
              <p className="text-text-secondary text-sm">Payback</p>
              <p className="text-2xl font-mono font-bold text-text-primary">
                {summary.paybackDays} days
              </p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Simulated Fixes List */}
      {simulatedFixes.length > 0 && (
        <div className="bg-bg-secondary rounded-lg border border-white/10 p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-text-primary">Simulated Fixes ({simulatedFixes.length})</h4>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={clearSimulatedFixes}
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Clear All
              </Button>
              <Button size="sm" className="bg-brand-primary text-bg-primary hover:bg-brand-primary/90">
                <Save className="w-4 h-4 mr-1" />
                Apply to Roadmap
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            {simulatedFixes.map((fix) => {
              const quickWin = DEMO_QUICK_WINS.find(w => w.checkpointId === fix.checkpointId);
              return (
                <div
                  key={fix.checkpointId}
                  className="flex items-center justify-between p-2 bg-bg-tertiary rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="text-text-primary">{quickWin?.name || fix.checkpointId}</span>
                    <span className="text-status-good text-sm font-mono">
                      -${(fix.exposureReduction / 1000).toFixed(0)}K
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeSimulatedFix(fix.checkpointId)}
                    className="text-status-critical hover:text-status-critical/80"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Add Fix Section */}
      <div className="bg-bg-secondary rounded-lg border border-white/10 p-4">
        <h4 className="font-medium text-text-primary mb-3 flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Add Fixes to Simulation
        </h4>
        <div className="grid gap-2">
          {availableQuickWins.map((quickWin) => (
            <div
              key={quickWin.checkpointId}
              className="flex items-center justify-between p-3 bg-bg-tertiary rounded-lg hover:bg-bg-tertiary/80 cursor-pointer transition-colors"
              onClick={() => handleAddQuickWin(quickWin)}
            >
              <div>
                <p className="text-text-primary text-sm">{quickWin.name}</p>
                <p className="text-text-secondary text-xs">{quickWin.category}</p>
              </div>
              <div className="text-right">
                <p className="text-status-good text-sm font-mono">
                  -${(quickWin.exposureReduction / 1000).toFixed(0)}K
                </p>
                <p className="text-text-secondary text-xs">
                  {quickWin.roi}x ROI
                </p>
              </div>
            </div>
          ))}
        </div>
        {onAddFix && (
          <Button
            variant="outline"
            className="w-full mt-3"
            onClick={onAddFix}
          >
            <Plus className="w-4 h-4 mr-2" />
            Browse All Checkpoints
          </Button>
        )}
      </div>
    </div>
  );
}

export default WaterfallChart;
