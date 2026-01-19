import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { microsoftRaiDemo } from '@/data/microsoftRaiData';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2, TrendingUp, DollarSign, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { RiskSpeedometer } from '@/components/dashboard/RiskSpeedometer';

interface ScoringViewProps {
  onContinue: () => void;
}

export function ScoringView({ onContinue }: ScoringViewProps) {
  const { scanResults, findings, financialMetrics } = microsoftRaiDemo;
  const overallScore = scanResults.overallScore;
  
  const getScoreColor = (score: number) => {
    if (score >= 900) return 'text-emerald-400';
    if (score >= 850) return 'text-primary';
    if (score >= 700) return 'text-gold';
    if (score >= 500) return 'text-risk-high';
    return 'text-risk-critical';
  };

  const getScoreLabel = (score: number) => {
    if (score >= 950) return 'Elite';
    if (score >= 900) return 'Excellent';
    if (score >= 850) return 'Good';
    if (score >= 700) return 'Developing';
    if (score >= 500) return 'At Risk';
    return 'Critical';
  };

  const getScoreInterpretation = (score: number) => {
    if (score >= 950) return 'Exceeds all requirements';
    if (score >= 900) return 'Strong governance maturity';
    if (score >= 850) return 'Meets investor/insurance threshold';
    if (score >= 700) return 'Significant gaps requiring attention';
    if (score >= 500) return 'Major compliance deficiencies';
    return 'Immediate intervention required';
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'bg-risk-critical/20 text-risk-critical border-risk-critical/30';
      case 'high': return 'bg-risk-high/20 text-risk-high border-risk-high/30';
      case 'medium': return 'bg-risk-medium/20 text-risk-medium border-risk-medium/30';
      case 'low': return 'bg-risk-low/20 text-risk-low border-risk-low/30';
      default: return 'bg-muted text-muted-foreground';
    }
  };

  const totalROI = findings.reduce((sum, f) => sum + f.roiImpact, 0);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header with Score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Score Gauge - Using Speedometer */}
        <Card className="border-primary/30 shadow-glow-sm">
          <CardContent className="p-8 flex flex-col items-center">
            <RiskSpeedometer 
              value={overallScore} 
              label="METRIS AI Governance Score"
              size={200}
            />
            <Badge className="mt-4 gradient-primary text-primary-foreground text-sm px-4 py-1">
              {getScoreLabel(overallScore)}
            </Badge>
            <p className="text-center text-xs text-muted-foreground mt-2">
              Microsoft Responsible AI Toolkit
            </p>
          </CardContent>
        </Card>

        {/* 4 Core Dimensions */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg">4 Core Dimensions</CardTitle>
            <CardDescription>
              Weighted components of your governance score
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResults.dimensions.map((dim, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{dim.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {Math.round(dim.weight * 100)}%
                    </Badge>
                  </div>
                  <span className={cn('font-bold', getScoreColor(dim.score * 10))}>
                    {dim.score}/100
                  </span>
                </div>
                <Progress value={dim.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* 9 Pillars */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">9 Governance Pillars</CardTitle>
          <CardDescription>
            Detailed breakdown across all assessment areas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {scanResults.pillars.map((pillar) => (
              <div
                key={pillar.id}
                className="p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">{pillar.name}</span>
                  <span className={cn('text-lg font-bold', getScoreColor(pillar.score * 10))}>
                    {pillar.score}
                  </span>
                </div>
                <Progress value={pillar.score} className="h-1.5 mb-2" />
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{pillar.dimension}</span>
                  <span className="flex items-center gap-1">
                    {pillar.findings > 0 ? (
                      <>
                        <AlertTriangle className="h-3 w-3" />
                        {pillar.findings} findings
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                        No issues
                      </>
                    )}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Findings Summary with ROI */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-400" />
              Key Findings
            </CardTitle>
            <CardDescription>
              Opportunities for enhancement - no critical issues detected
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {findings.map((finding) => (
              <div
                key={finding.id}
                className="p-4 rounded-lg border border-border hover:border-primary/20 transition-all"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className={cn('text-xs', getSeverityColor(finding.severity))}>
                        {finding.severity.toUpperCase()}
                      </Badge>
                      <span className="text-xs text-muted-foreground">{finding.pillar}</span>
                    </div>
                    <h4 className="font-medium mb-1">{finding.title}</h4>
                    <p className="text-sm text-muted-foreground">{finding.description}</p>
                  </div>
                  <div className="text-right ml-4">
                    <div className="text-sm font-bold text-gradient">
                      €{(finding.roiImpact / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-muted-foreground">exposure</div>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* ROI Calculator */}
        <Card className="border-primary/30 shadow-glow-sm">
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-primary" />
              ROI Summary
            </CardTitle>
            <CardDescription>
              Strong governance reduces exposure
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <div className="text-4xl font-bold text-gradient mb-1">
                €{(totalROI / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground">
                Total addressable improvement
              </p>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Low priority (3)</span>
                <span className="font-bold text-risk-low">
                  €{((findings.filter(f => f.severity === 'low').reduce((s, f) => s + f.roiImpact, 0)) / 1000).toFixed(0)}K
                </span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                <span className="text-sm">Medium priority (1)</span>
                <span className="font-bold text-risk-medium">
                  €{((findings.filter(f => f.severity === 'medium').reduce((s, f) => s + f.roiImpact, 0)) / 1000).toFixed(0)}K
                </span>
              </div>
            </div>

            <div className="p-4 rounded-lg gradient-primary/10 border border-primary/30">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium">Current Status</span>
                <Badge className="bg-emerald-500/20 text-emerald-400 border-emerald-500/30">Excellent</Badge>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-emerald-400" />
                <span className="text-lg font-bold text-emerald-400">
                  Top 8% of AI systems
                </span>
              </div>
            </div>

            <Button
              className="w-full gradient-primary text-primary-foreground shadow-glow-sm"
              onClick={onContinue}
            >
              View Simulations
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}