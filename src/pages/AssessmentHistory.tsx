import React, { useState } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { DEMO_ASSESSMENTS, getScoreTrend, compareAssessments, Assessment } from '@/data/demoAssessments';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  FileText,
  GitCompare,
  AlertTriangle,
  CheckCircle2,
  ChevronRight,
  Filter,
} from 'lucide-react';

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-bg-secondary border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-text-primary mb-2">{data.date}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">Score:</span>
            <span className="font-mono text-brand-primary">{data.score}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">Tier:</span>
            <span className="text-text-primary">{data.tier}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">Exposure:</span>
            <span className="font-mono text-status-warning">
              ${(data.exposure / 1000000).toFixed(1)}M
            </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export default function AssessmentHistory() {
  const [selectedAssessments, setSelectedAssessments] = useState<string[]>([]);
  const [showCriticalOnly, setShowCriticalOnly] = useState(false);
  const [dateFilter, setDateFilter] = useState('all');
  const [systemFilter, setSystemFilter] = useState('all');

  const trendData = getScoreTrend();

  // Filter assessments
  const filteredAssessments = DEMO_ASSESSMENTS.filter(assessment => {
    if (showCriticalOnly && !assessment.findings.some(f => f.type === 'critical')) {
      return false;
    }
    if (systemFilter !== 'all' && !assessment.systemsAssessed.includes(systemFilter)) {
      return false;
    }
    return true;
  });

  // Comparison data
  const comparisonData = selectedAssessments.length === 2
    ? compareAssessments(selectedAssessments[0], selectedAssessments[1])
    : null;

  const toggleAssessmentSelection = (id: string) => {
    if (selectedAssessments.includes(id)) {
      setSelectedAssessments(selectedAssessments.filter(a => a !== id));
    } else if (selectedAssessments.length < 2) {
      setSelectedAssessments([...selectedAssessments, id]);
    }
  };

  const getTrendIcon = (change: number) => {
    if (change > 0) return <TrendingUp className="w-4 h-4 text-status-good" />;
    if (change < 0) return <TrendingDown className="w-4 h-4 text-status-critical" />;
    return <Minus className="w-4 h-4 text-text-secondary" />;
  };

  // Get unique systems
  const allSystems = [...new Set(DEMO_ASSESSMENTS.flatMap(a => a.systemsAssessed))];

  return (
    <SidebarLayout>
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-text-primary">Assessment History</h1>
            <p className="text-text-secondary">
              Track your AI governance progress over time
            </p>
          </div>
          {selectedAssessments.length === 2 && (
            <Button variant="outline">
              <GitCompare className="w-4 h-4 mr-2" />
              Compare Selected
            </Button>
          )}
        </div>

        {/* Trend Chart */}
        <Card className="bg-bg-secondary border-white/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-brand-primary" />
              Score Trend
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={trendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.1)" />
                <XAxis
                  dataKey="date"
                  tick={{ fill: '#a0aec0', fontSize: 11 }}
                  tickFormatter={(value) => value.split(' ')[0]}
                />
                <YAxis
                  domain={[500, 850]}
                  tick={{ fill: '#a0aec0', fontSize: 11 }}
                  tickCount={5}
                />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine
                  y={750}
                  stroke="#22c55e"
                  strokeDasharray="5 5"
                  label={{ value: 'Good', fill: '#22c55e', fontSize: 10, position: 'right' }}
                />
                <ReferenceLine
                  y={600}
                  stroke="#ef4444"
                  strokeDasharray="5 5"
                  label={{ value: 'Critical', fill: '#ef4444', fontSize: 10, position: 'right' }}
                />
                <Line
                  type="monotone"
                  dataKey="score"
                  stroke="#00d4aa"
                  strokeWidth={3}
                  dot={{ fill: '#00d4aa', strokeWidth: 2, r: 6 }}
                  activeDot={{ r: 8, fill: '#00d4aa' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="bg-bg-secondary border-white/10">
          <CardContent className="py-4">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-2">
                <Filter className="w-4 h-4 text-text-secondary" />
                <span className="text-text-secondary text-sm">Filters:</span>
              </div>

              <Select value={systemFilter} onValueChange={setSystemFilter}>
                <SelectTrigger className="w-48 bg-bg-tertiary border-white/10">
                  <SelectValue placeholder="All Systems" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Systems</SelectItem>
                  {allSystems.map(system => (
                    <SelectItem key={system} value={system}>{system}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center gap-2">
                <Checkbox
                  id="critical-only"
                  checked={showCriticalOnly}
                  onCheckedChange={(checked) => setShowCriticalOnly(checked as boolean)}
                />
                <label
                  htmlFor="critical-only"
                  className="text-sm text-text-secondary cursor-pointer"
                >
                  Show only with critical findings
                </label>
              </div>

              {selectedAssessments.length > 0 && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedAssessments([])}
                  className="text-brand-primary"
                >
                  Clear selection ({selectedAssessments.length}/2)
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Comparison Panel (when 2 selected) */}
        {comparisonData && (
          <Card className="bg-gradient-to-r from-brand-primary/10 to-brand-secondary/10 border-brand-primary/30">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <GitCompare className="w-5 h-5" />
                Comparison: {selectedAssessments[0]} vs {selectedAssessments[1]}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-text-secondary text-sm">Score Change</p>
                  <p className={cn(
                    "text-2xl font-mono font-bold",
                    comparisonData.scoreChange > 0 ? "text-status-good" : "text-status-critical"
                  )}>
                    {comparisonData.scoreChange > 0 ? '+' : ''}{comparisonData.scoreChange}
                  </p>
                </div>
                <div className="bg-bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-text-secondary text-sm">Exposure Change</p>
                  <p className={cn(
                    "text-2xl font-mono font-bold",
                    comparisonData.exposureChange < 0 ? "text-status-good" : "text-status-critical"
                  )}>
                    ${(comparisonData.exposureChange / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="bg-bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-text-secondary text-sm">Resolved Findings</p>
                  <p className="text-2xl font-mono font-bold text-status-good">
                    {comparisonData.resolvedFindings}
                  </p>
                </div>
                <div className="bg-bg-secondary/50 rounded-lg p-3 text-center">
                  <p className="text-text-secondary text-sm">New Findings</p>
                  <p className="text-2xl font-mono font-bold text-status-warning">
                    {comparisonData.newFindings}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Timeline */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-white/10" />

          <div className="space-y-6">
            {filteredAssessments.map((assessment, index) => {
              const isSelected = selectedAssessments.includes(assessment.id);
              const criticalFindings = assessment.findings.filter(f => f.type === 'critical');
              const resolvedFindings = assessment.findings.filter(f => f.status === 'resolved');

              return (
                <div key={assessment.id} className="relative pl-16">
                  {/* Timeline dot */}
                  <div
                    className={cn(
                      "absolute left-6 top-6 w-5 h-5 rounded-full border-2 transition-all cursor-pointer",
                      isSelected
                        ? "bg-brand-primary border-brand-primary"
                        : "bg-bg-secondary border-white/30 hover:border-brand-primary"
                    )}
                    onClick={() => toggleAssessmentSelection(assessment.id)}
                  />

                  <Card
                    className={cn(
                      "bg-bg-secondary border-white/10 transition-all",
                      isSelected && "border-brand-primary ring-1 ring-brand-primary"
                    )}
                  >
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <Calendar className="w-4 h-4 text-text-secondary" />
                            <span className="text-text-primary font-medium">
                              {assessment.displayDate}
                            </span>
                            <Badge variant="outline" className="text-xs">
                              {assessment.id}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-3 mt-2">
                            <span className={cn(
                              "text-3xl font-mono font-bold",
                              assessment.overallScore >= 750 ? "text-status-good" :
                              assessment.overallScore >= 650 ? "text-status-warning" :
                              "text-status-critical"
                            )}>
                              {assessment.overallScore}
                            </span>
                            {assessment.scoreChange !== 0 && (
                              <div className="flex items-center gap-1">
                                {getTrendIcon(assessment.scoreChange)}
                                <span className={cn(
                                  "font-mono text-sm",
                                  assessment.scoreChange > 0 ? "text-status-good" : "text-status-critical"
                                )}>
                                  {assessment.scoreChange > 0 ? '+' : ''}{assessment.scoreChange}
                                </span>
                              </div>
                            )}
                            <Badge
                              variant="outline"
                              className={cn(
                                "ml-2",
                                assessment.tier === 'Critical' && "text-status-critical border-status-critical/30",
                                assessment.tier === 'Developing' && "text-status-warning border-status-warning/30",
                                assessment.tier === 'Moderate' && "text-brand-secondary border-brand-secondary/30"
                              )}
                            >
                              {assessment.tier}
                            </Badge>
                          </div>
                        </div>

                        <div className="flex gap-2">
                          <Button variant="outline" size="sm">
                            <FileText className="w-4 h-4 mr-2" />
                            View Report
                          </Button>
                          {assessment.previousScore && (
                            <Button variant="outline" size="sm">
                              <GitCompare className="w-4 h-4 mr-2" />
                              Compare
                            </Button>
                          )}
                        </div>
                      </div>

                      {/* Key Highlights */}
                      <div className="space-y-2 mb-4">
                        {assessment.keyHighlights.map((highlight, i) => (
                          <div key={i} className="flex items-center gap-2 text-sm">
                            <ChevronRight className="w-4 h-4 text-brand-primary" />
                            <span className="text-text-secondary">{highlight}</span>
                          </div>
                        ))}
                      </div>

                      {/* Findings Summary */}
                      <div className="flex items-center gap-4 pt-4 border-t border-white/10">
                        {criticalFindings.length > 0 && (
                          <div className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4 text-status-critical" />
                            <span className="text-text-secondary text-sm">
                              {criticalFindings.length} critical finding{criticalFindings.length > 1 ? 's' : ''}
                            </span>
                          </div>
                        )}
                        {resolvedFindings.length > 0 && (
                          <div className="flex items-center gap-2">
                            <CheckCircle2 className="w-4 h-4 text-status-good" />
                            <span className="text-text-secondary text-sm">
                              {resolvedFindings.length} resolved
                            </span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 ml-auto">
                          <span className="text-text-secondary text-sm">Systems:</span>
                          {assessment.systemsAssessed.map(system => (
                            <Badge key={system} variant="secondary" className="text-xs">
                              {system}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
    </SidebarLayout>
  );
}
