import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { microsoftRaiDemo } from '@/data/microsoftRaiData';
import { cn } from '@/lib/utils';
import { 
  FileText, 
  Download, 
  Share2, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  DollarSign,
  Shield,
  Scale,
  Target,
  Zap
} from 'lucide-react';
import { RiskSpeedometer } from '@/components/dashboard/RiskSpeedometer';
import { ForecastSection } from '@/components/report/ForecastSection';
import { toast } from 'sonner';
import { generateGovernanceReportPDF } from '@/lib/pdfReportGenerator';

export function ReportView() {
  const { scanResults, findings, financialMetrics, regulatoryCompliance, organization } = microsoftRaiDemo;
  const overallScore = scanResults.overallScore;
  
  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-emerald-400';
    if (score >= 80) return 'text-primary';
    if (score >= 60) return 'text-gold';
    if (score >= 40) return 'text-risk-high';
    return 'text-risk-critical';
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

  const getEffortColor = (effort: string) => {
    switch (effort) {
      case 'quick': return 'text-primary';
      case 'medium': return 'text-gold';
      case 'significant': return 'text-risk-high';
      default: return 'text-muted-foreground';
    }
  };

  const quickWins = findings.filter(f => f.estimatedEffort === 'quick');
  const totalROI = findings.reduce((sum, f) => sum + f.roiImpact, 0);
  const quickWinROI = quickWins.reduce((sum, f) => sum + f.roiImpact, 0);

  const handleDownloadPDF = async () => {
    try {
      toast.info('Generating comprehensive PDF report...');
      await generateGovernanceReportPDF({
        organization,
        scanResults,
        findings,
        financialMetrics,
        regulatoryCompliance
      });
      toast.success('PDF report downloaded successfully!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to generate PDF');
    }
  };

  const handleShare = () => {
    const shareUrl = `${window.location.origin}/report/${organization.ein || 'demo-12345'}`;
    navigator.clipboard.writeText(shareUrl);
    toast.success('Report URL copied to clipboard!');
  };

  return (
    <div className="space-y-6 animate-fade-in report-content">
      {/* Report Header */}
      <Card className="border-primary/30 shadow-glow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl gradient-primary flex items-center justify-center shadow-glow-sm">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <h1 className="text-2xl font-bold">AI Governance Report</h1>
                <p className="text-muted-foreground">
                  METRIS Assessment • Generated {new Date().toLocaleDateString()}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleShare}>
                <Share2 className="h-4 w-4 mr-2" />
                Share URL
              </Button>
              <Button className="gradient-primary text-primary-foreground" onClick={handleDownloadPDF}>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Executive Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Executive Summary
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-4xl font-bold text-emerald-400 mb-1">{overallScore}</div>
              <p className="text-sm text-muted-foreground">METRIS Score</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-4xl font-bold text-risk-low mb-1">{findings.length}</div>
              <p className="text-sm text-muted-foreground">Findings</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-4xl font-bold text-gold mb-1">
                €{(totalROI / 1000).toFixed(0)}K
              </div>
              <p className="text-sm text-muted-foreground">Total Exposure</p>
            </div>
            <div className="text-center p-4 rounded-lg bg-muted/50">
              <div className="text-4xl font-bold text-primary mb-1">
                {financialMetrics.roiMultiple.toFixed(1)}x
              </div>
              <p className="text-sm text-muted-foreground">ROI Multiple</p>
            </div>
          </div>
          
          <p className="text-muted-foreground leading-relaxed">
            This assessment of <strong className="text-foreground">{organization.system}</strong> identified 
            <strong className="text-foreground"> {findings.length} enhancement opportunities</strong> with 
            a total exposure of <strong className="text-gradient">€{(totalROI / 1000).toFixed(0)}K</strong>. 
            The system demonstrates <strong className="text-emerald-400">excellent governance maturity</strong> with 
            a score of {overallScore}/1000, placing it in the <strong className="text-primary">top 8%</strong> of 
            AI systems assessed. Minor improvements in {findings[0]?.pillar || 'monitoring'} could further strengthen compliance.
          </p>
        </CardContent>
      </Card>

      {/* 4 Dimensions & 9 Pillars */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-primary" />
              4 Core Dimensions
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {scanResults.dimensions.map((dim, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{dim.name}</span>
                  <span className={cn('font-bold', getScoreColor(dim.score))}>
                    {dim.score}/100
                  </span>
                </div>
                <Progress value={dim.score} className="h-2" />
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              9 Governance Pillars
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {scanResults.pillars.map((pillar) => (
                <div
                  key={pillar.id}
                  className="flex items-center justify-between p-2 rounded hover:bg-muted/50"
                >
                  <div className="flex items-center gap-2">
                    <div className={cn(
                      'w-2 h-2 rounded-full',
                      pillar.score >= 90 ? 'bg-emerald-400' : pillar.score >= 70 ? 'bg-primary' : pillar.score >= 50 ? 'bg-gold' : 'bg-risk-high'
                    )} />
                    <span className="text-sm">{pillar.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    {pillar.findings > 0 ? (
                      <Badge variant="outline" className="text-xs">
                        {pillar.findings} issues
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="text-xs text-emerald-400 border-emerald-400/30">
                        ✓ Clear
                      </Badge>
                    )}
                    <span className={cn('font-bold text-sm', getScoreColor(pillar.score))}>
                      {pillar.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Regulatory Mapping */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Scale className="h-5 w-5 text-primary" />
            Regulatory Mapping
          </CardTitle>
          <CardDescription>
            Compliance status across applicable frameworks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regulatoryCompliance.map((reg) => (
              <div
                key={reg.regulation}
                className="p-4 rounded-lg border border-border hover:border-primary/30 transition-all"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="font-medium">{reg.regulation}</span>
                  <span className={cn('font-bold', getScoreColor(reg.compliance))}>
                    {reg.compliance}%
                  </span>
                </div>
                <Progress value={reg.compliance} className="h-1.5 mb-3" />
                <div className="flex flex-wrap gap-1">
                  {(reg.articles || reg.sections || reg.functions)?.slice(0, 3).map((item: string) => (
                    <Badge key={item} variant="secondary" className="text-xs">
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Remediation Roadmap */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-primary" />
            Enhancement Opportunities
          </CardTitle>
          <CardDescription>
            Prioritized actions with ROI impact
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Quick Wins Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Badge className="gradient-primary text-primary-foreground">
                Improvements
              </Badge>
              <span className="text-sm text-muted-foreground">
                Low priority enhancements
              </span>
            </div>
            <div className="space-y-3">
              {findings.map((finding) => (
                <div
                  key={finding.id}
                  className="p-4 rounded-lg border border-border hover:border-primary/20 transition-all"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge className={cn('text-xs', getSeverityColor(finding.severity))}>
                          {finding.severity.toUpperCase()}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          <span className={getEffortColor(finding.estimatedEffort)}>
                            {finding.estimatedEffort} effort
                          </span>
                        </span>
                      </div>
                      <h4 className="font-medium mb-1">{finding.title}</h4>
                      <p className="text-sm text-muted-foreground mb-2">
                        {finding.recommendation}
                      </p>
                    </div>
                    <div className="text-right ml-4">
                      <div className="text-lg font-bold text-gradient">
                        €{(finding.roiImpact / 1000).toFixed(0)}K
                      </div>
                      <div className="text-xs text-muted-foreground">exposure</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator className="my-6" />

          {/* Total ROI Summary */}
          <div className="p-6 rounded-xl gradient-primary/10 border border-primary/30">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Exposure</p>
                <p className="text-2xl font-bold text-gold">
                  €{(totalROI / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Remediation Cost</p>
                <p className="text-2xl font-bold text-primary">
                  €{(financialMetrics.remediationCost / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Net ROI</p>
                <p className="text-2xl font-bold text-gradient">
                  €{(financialMetrics.netROI / 1000).toFixed(0)}K
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Payback Period</p>
                <p className="text-2xl font-bold text-emerald-400">
                  {financialMetrics.paybackPeriod} months
                </p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Series Forecasting */}
      <ForecastSection currentScore={overallScore} currentExposure={totalROI} />

      {/* CTA */}
      <Card className="border-primary/30 shadow-glow-sm">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="text-lg font-bold mb-1">Ready to reduce your AI risk exposure?</h3>
              <p className="text-muted-foreground">
                Contact SANJEEVANI AI to implement this remediation roadmap with expert guidance.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline">
                <ExternalLink className="h-4 w-4 mr-2" />
                View Full Report
              </Button>
              <Button 
                className="gradient-primary text-primary-foreground shadow-glow-sm"
                onClick={() => window.open('https://calendar.notion.so/meet/siaai/0619', '_blank')}
              >
                <DollarSign className="h-4 w-4 mr-2" />
                Book Consultation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
