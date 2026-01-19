import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_QUICK_WINS } from '@/data/demoQuickWins';
import { cn } from '@/lib/utils';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RotateCcw, Check, Target, DollarSign, Calendar, Shield } from 'lucide-react';

interface BidirectionalControllerProps {
  className?: string;
  onApply?: () => void;
}

interface OptimizationResult {
  fixes: typeof DEMO_QUICK_WINS;
  projectedScore: number;
  projectedExposure: number;
  totalCost: number;
  totalROI: number;
  weeklyBreakdown: Array<{
    week: number;
    fixes: typeof DEMO_QUICK_WINS;
    cumulativeScore: number;
    cumulativeExposure: number;
  }>;
}

const DEFAULT_VALUES = {
  riskTolerance: 0.5,
  budgetConstraint: 520000,
  targetScore: 850,
  timeline: 90,
};

export function BidirectionalController({ className, onApply }: BidirectionalControllerProps) {
  const {
    metrics,
    addSimulatedFix,
    clearSimulatedFixes,
    setSimulationMode,
  } = useVisualizationStore();

  // Slider states
  const [riskTolerance, setRiskTolerance] = useState(DEFAULT_VALUES.riskTolerance);
  const [budgetConstraint, setBudgetConstraint] = useState(DEFAULT_VALUES.budgetConstraint);
  const [targetScore, setTargetScore] = useState(DEFAULT_VALUES.targetScore);
  const [timeline, setTimeline] = useState(DEFAULT_VALUES.timeline);

  // Run optimization algorithm
  const optimizationResult = useMemo((): OptimizationResult => {
    // Sort quick wins by ROI (greedy approach)
    const sortedWins = [...DEMO_QUICK_WINS].sort((a, b) => {
      // Weight by ROI, difficulty, and risk tolerance
      const aScore = a.roi * (riskTolerance < 0.5 ? (a.difficulty === 'Low' ? 1.5 : 1) : 1);
      const bScore = b.roi * (riskTolerance < 0.5 ? (b.difficulty === 'Low' ? 1.5 : 1) : 1);
      return bScore - aScore;
    });

    // Greedy selection within budget and time constraints
    let remainingBudget = budgetConstraint;
    let currentScore = metrics.currentScore;
    let currentExposure = metrics.currentExposure;
    const selectedFixes: typeof DEMO_QUICK_WINS = [];
    
    // Calculate available hours based on timeline (assume 40hrs/week capacity)
    const availableHours = (timeline / 7) * 40;
    let usedHours = 0;

    for (const win of sortedWins) {
      const hours = parseInt(win.timeEstimate) || 8;
      
      if (
        win.estimatedCost <= remainingBudget &&
        usedHours + hours <= availableHours &&
        currentScore < targetScore
      ) {
        selectedFixes.push(win);
        remainingBudget -= win.estimatedCost;
        currentScore += win.pointGain;
        currentExposure -= win.exposureReduction;
        usedHours += hours;
      }
    }

    // Create weekly breakdown
    const weeksAvailable = Math.ceil(timeline / 7);
    const fixesPerWeek = Math.ceil(selectedFixes.length / weeksAvailable);
    const weeklyBreakdown = [];
    let cumulativeScore = metrics.currentScore;
    let cumulativeExposure = metrics.currentExposure;

    for (let week = 1; week <= weeksAvailable && selectedFixes.length > 0; week++) {
      const weekFixes = selectedFixes.splice(0, fixesPerWeek);
      if (weekFixes.length === 0) break;
      
      weekFixes.forEach(fix => {
        cumulativeScore += fix.pointGain;
        cumulativeExposure -= fix.exposureReduction;
      });

      weeklyBreakdown.push({
        week,
        fixes: weekFixes,
        cumulativeScore,
        cumulativeExposure,
      });
    }

    // Recalculate with original array
    const allFixes = weeklyBreakdown.flatMap(w => w.fixes);
    const totalCost = allFixes.reduce((sum, f) => sum + f.estimatedCost, 0);
    const totalExposureReduction = allFixes.reduce((sum, f) => sum + f.exposureReduction, 0);

    return {
      fixes: allFixes,
      projectedScore: metrics.currentScore + allFixes.reduce((sum, f) => sum + f.pointGain, 0),
      projectedExposure: metrics.currentExposure - totalExposureReduction,
      totalCost,
      totalROI: totalCost > 0 ? totalExposureReduction / totalCost : 0,
      weeklyBreakdown,
    };
  }, [riskTolerance, budgetConstraint, targetScore, timeline, metrics.currentScore, metrics.currentExposure]);

  // Apply optimization to global state
  const handleApply = useCallback(() => {
    clearSimulatedFixes();
    setSimulationMode('projected');
    
    optimizationResult.fixes.forEach(fix => {
      addSimulatedFix({
        checkpointId: fix.checkpointId,
        status: 'pending',
        pointsGain: fix.pointGain,
        exposureReduction: fix.exposureReduction,
      });
    });

    onApply?.();
  }, [optimizationResult, clearSimulatedFixes, setSimulationMode, addSimulatedFix, onApply]);

  // Reset to defaults
  const handleReset = () => {
    setRiskTolerance(DEFAULT_VALUES.riskTolerance);
    setBudgetConstraint(DEFAULT_VALUES.budgetConstraint);
    setTargetScore(DEFAULT_VALUES.targetScore);
    setTimeline(DEFAULT_VALUES.timeline);
    clearSimulatedFixes();
    setSimulationMode('current');
  };

  // Get slider track color based on value
  const getTrackColor = (value: number, min: number, max: number) => {
    const percentage = (value - min) / (max - min);
    if (percentage < 0.33) return 'bg-status-good';
    if (percentage < 0.66) return 'bg-status-warning';
    return 'bg-status-critical';
  };

  return (
    <div className={cn("space-y-6", className)}>
      {/* Sliders */}
      <Card className="bg-bg-secondary border-white/10">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center justify-between">
            <span>Optimization Controls</span>
            <Button variant="ghost" size="sm" onClick={handleReset}>
              <RotateCcw className="w-4 h-4 mr-1" />
              Reset
            </Button>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Risk Tolerance */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Risk Tolerance</span>
              </div>
              <span className="text-sm font-mono text-brand-primary">
                {riskTolerance < 0.33 ? 'Low Risk' : riskTolerance < 0.66 ? 'Moderate' : 'High Risk'}
              </span>
            </div>
            <div className="relative">
              <Slider
                value={[riskTolerance]}
                onValueChange={([v]) => setRiskTolerance(v)}
                min={0}
                max={1}
                step={0.01}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-secondary">Conservative</span>
                <span className="text-xs text-text-secondary">Aggressive</span>
              </div>
            </div>
          </div>

          {/* Budget Constraint */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Budget Constraint</span>
              </div>
              <span className="text-sm font-mono text-brand-primary">
                ${(budgetConstraint / 1000).toFixed(0)}K
              </span>
            </div>
            <div className="relative">
              <Slider
                value={[budgetConstraint]}
                onValueChange={([v]) => setBudgetConstraint(v)}
                min={100000}
                max={2000000}
                step={10000}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-secondary">$100K</span>
                <span className="text-xs text-text-secondary">$2M</span>
              </div>
            </div>
          </div>

          {/* Target Score */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Target className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Target Score</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-text-secondary">Current: {metrics.currentScore}</span>
                <span className="text-sm font-mono text-brand-primary">{targetScore}</span>
              </div>
            </div>
            <div className="relative">
              <Slider
                value={[targetScore]}
                onValueChange={([v]) => setTargetScore(v)}
                min={600}
                max={950}
                step={10}
                className="w-full"
              />
              {/* Current score marker */}
              <div
                className="absolute top-0 w-0.5 h-5 bg-status-warning -translate-y-1"
                style={{
                  left: `${((metrics.currentScore - 600) / (950 - 600)) * 100}%`,
                }}
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-secondary">600</span>
                <span className="text-xs text-text-secondary">950</span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-text-secondary" />
                <span className="text-sm font-medium text-text-primary">Timeline</span>
              </div>
              <span className="text-sm font-mono text-brand-primary">
                {timeline} days
              </span>
            </div>
            <div className="relative">
              <Slider
                value={[timeline]}
                onValueChange={([v]) => setTimeline(v)}
                min={30}
                max={180}
                step={7}
                className="w-full"
              />
              <div className="flex justify-between mt-1">
                <span className="text-xs text-text-secondary">30 days</span>
                <span className="text-xs text-text-secondary">180 days</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Optimization Result */}
      <Card className="bg-bg-secondary border-white/10">
        <CardHeader className="pb-3">
          <CardTitle className="text-base">Optimal Path</CardTitle>
          <p className="text-text-secondary text-sm">
            Based on your constraints, here's the recommended remediation path:
          </p>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-bg-tertiary rounded-lg p-3 text-center">
              <p className="text-text-secondary text-xs">Projected Score</p>
              <p className="text-xl font-mono font-bold text-brand-primary">
                {optimizationResult.projectedScore}
              </p>
              <p className="text-xs text-status-good">
                +{optimizationResult.projectedScore - metrics.currentScore} pts
              </p>
            </div>
            <div className="bg-bg-tertiary rounded-lg p-3 text-center">
              <p className="text-text-secondary text-xs">Exposure</p>
              <p className="text-xl font-mono font-bold text-status-good">
                ${(optimizationResult.projectedExposure / 1000000).toFixed(1)}M
              </p>
              <p className="text-xs text-status-good">
                -${((metrics.currentExposure - optimizationResult.projectedExposure) / 1000000).toFixed(1)}M
              </p>
            </div>
          </div>

          {/* Weekly Breakdown */}
          {optimizationResult.weeklyBreakdown.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-medium text-text-primary">Weekly Plan</h4>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {optimizationResult.weeklyBreakdown.map(week => (
                  <div
                    key={week.week}
                    className="bg-bg-tertiary rounded-lg p-3"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-text-primary">
                        Week {week.week}
                      </span>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          Score: {week.cumulativeScore}
                        </Badge>
                        <Badge variant="outline" className="text-xs text-status-good">
                          ${(week.cumulativeExposure / 1000000).toFixed(1)}M
                        </Badge>
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {week.fixes.map(fix => (
                        <Badge
                          key={fix.checkpointId}
                          variant="secondary"
                          className="text-xs"
                        >
                          {fix.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ROI Summary */}
          <div className="flex items-center justify-between p-3 bg-brand-primary/10 rounded-lg border border-brand-primary/30">
            <div>
              <p className="text-sm text-text-secondary">Total Investment</p>
              <p className="text-lg font-mono font-bold text-text-primary">
                ${(optimizationResult.totalCost / 1000).toFixed(0)}K
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-text-secondary">Overall ROI</p>
              <p className="text-lg font-mono font-bold text-brand-primary">
                {optimizationResult.totalROI.toFixed(1)}x
              </p>
            </div>
          </div>

          {/* Apply Button */}
          <Button
            onClick={handleApply}
            className="w-full bg-brand-primary text-bg-primary hover:bg-brand-primary/90"
            disabled={optimizationResult.fixes.length === 0}
          >
            <Check className="w-4 h-4 mr-2" />
            Apply to Dashboard
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

export default BidirectionalController;
