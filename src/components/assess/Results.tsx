import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { 
  Download, 
  FileSpreadsheet, 
  Calendar, 
  RefreshCw, 
  ChevronDown, 
  ChevronRight,
  TrendingDown,
  Shield,
  AlertTriangle,
  CheckCircle2,
  Target,
  ArrowLeft,
  DollarSign
} from "lucide-react";
import scoutMascot from "@/assets/scout-mascot.png";
import { ReportConfigModal, type ReportConfig } from "@/components/report/ReportConfigModal";
import { ReportGenerationProgress } from "@/components/report/ReportGenerationProgress";
import { toast } from "sonner";
import { DEMO_SCORE } from "@/data/demoScore";
import { DEMO_FINANCIAL_RISK, formatCurrency } from "@/data/demoFinancialRisk";
import type { AssessmentData } from "@/pages/Assess";

interface ResultsProps {
  data: AssessmentData;
  onRestart?: () => void;
}

// Gap data
const GAP_SUMMARY = {
  major: 6,
  minor: 14,
  ofi: 8,
  pass: 1887
};

// Framework compliance data
const FRAMEWORK_COMPLIANCE = [
  { 
    name: "EU AI Act", 
    score: 621, 
    status: "gaps", 
    majorGaps: 4, 
    minorGaps: 6,
    details: [
      "Article 9 - Risk Management System incomplete",
      "Article 14 - Human oversight procedures undocumented",
      "Article 13 - Transparency requirements partial",
      "Article 10 - Data governance gaps identified"
    ]
  },
  { 
    name: "ISO 42001", 
    score: 734, 
    status: "gaps", 
    majorGaps: 1, 
    minorGaps: 4,
    details: [
      "Section 6.1.2 - Risk treatment plan incomplete",
      "Section 8.4 - Operational control gaps"
    ]
  },
  { 
    name: "NIST AI RMF", 
    score: 712, 
    status: "gaps", 
    majorGaps: 1, 
    minorGaps: 3,
    details: [
      "MAP function - AI system inventory incomplete",
      "GOVERN function - Risk appetite undefined"
    ]
  },
  { 
    name: "GDPR (AI provisions)", 
    score: 856, 
    status: "pass", 
    majorGaps: 0, 
    minorGaps: 1,
    details: [
      "Article 22 - Automated decision-making compliant"
    ]
  },
  { 
    name: "SOC 2 (AI controls)", 
    score: 698, 
    status: "gaps", 
    majorGaps: 0, 
    minorGaps: 2,
    details: [
      "CC6.1 - Access controls need enhancement",
      "CC7.2 - Monitoring improvements needed"
    ]
  }
];

// Remediation roadmap
const REMEDIATION_ITEMS = [
  {
    priority: 1,
    severity: "major",
    title: "Implement Quantitative Risk Scoring",
    frameworks: ["EU AI Act Art. 9", "ISO 42001 6.1.2"],
    riskReduction: 1200000,
    effort: "2-3 weeks"
  },
  {
    priority: 2,
    severity: "major",
    title: "Document Human Oversight Procedures",
    frameworks: ["EU AI Act Art. 14", "ISO 42001 8.4"],
    riskReduction: 890000,
    effort: "1-2 weeks"
  },
  {
    priority: 3,
    severity: "major",
    title: "Establish Risk Appetite Statement",
    frameworks: ["ISO 42001 5.2", "NIST AI RMF Govern"],
    riskReduction: 650000,
    effort: "1 week"
  },
  {
    priority: 4,
    severity: "major",
    title: "Create AI System Inventory with Risk Classifications",
    frameworks: ["EU AI Act Art. 6", "ISO 42001 4.3"],
    riskReduction: 580000,
    effort: "2 weeks"
  },
  {
    priority: 5,
    severity: "major",
    title: "Implement Bias Testing Framework",
    frameworks: ["EU AI Act Art. 10", "ISO 42001 9.1"],
    riskReduction: 420000,
    effort: "3 weeks"
  },
  {
    priority: 6,
    severity: "major",
    title: "Establish Incident Response Procedures",
    frameworks: ["EU AI Act Art. 62", "NIST AI RMF Respond"],
    riskReduction: 380000,
    effort: "2 weeks"
  }
];

// Score tier labels - NO BINARY PASS/FAIL
const getScoreLabel = (score: number) => {
  if (score >= 900) return "EXEMPLARY";
  if (score >= 750) return "STRONG";
  if (score >= 600) return "MODERATE";
  if (score >= 400) return "WEAK";
  if (score >= 200) return "CRITICAL";
  return "MINIMAL";
};

const getScoreColor = (score: number) => {
  if (score >= 900) return "text-purple-400";
  if (score >= 750) return "text-emerald-400";
  if (score >= 600) return "text-amber-400";
  if (score >= 400) return "text-orange-400";
  return "text-red-400";
};

export function Results({ data, onRestart }: ResultsProps) {
  const [animatedScore, setAnimatedScore] = useState(0);
  const [animatedRisk, setAnimatedRisk] = useState(0);
  const [expandedFrameworks, setExpandedFrameworks] = useState<string[]>([]);
  const [showAllMajor, setShowAllMajor] = useState(false);
  const [showReportConfig, setShowReportConfig] = useState(false);
  const [reportConfig, setReportConfig] = useState<ReportConfig | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);
  
  const score = DEMO_SCORE.overall;
  const confidenceInterval = 34;
  const var95 = DEMO_FINANCIAL_RISK.var95;
  
  // Animate score on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const increment = score / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.floor(current));
      }
    }, duration / steps);
    
    return () => clearInterval(timer);
  }, [score]);
  
  // Animate risk exposure
  useEffect(() => {
    const duration = 2500;
    const steps = 60;
    const target = DEMO_FINANCIAL_RISK.expectedLoss;
    const increment = target / steps;
    let current = 0;
    
    const timer = setTimeout(() => {
      const riskTimer = setInterval(() => {
        current += increment;
        if (current >= target) {
          setAnimatedRisk(target);
          clearInterval(riskTimer);
        } else {
          setAnimatedRisk(Math.floor(current));
        }
      }, duration / steps);
      
      return () => clearInterval(riskTimer);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const toggleFramework = (name: string) => {
    setExpandedFrameworks(prev => 
      prev.includes(name) 
        ? prev.filter(f => f !== name)
        : [...prev, name]
    );
  };

  const formatCompactCurrency = (value: number) => {
    if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
    return `$${value}`;
  };

  const handleGenerateReport = useCallback((config: ReportConfig) => {
    setShowReportConfig(false);
    setReportConfig(config);
    setIsGenerating(true);
  }, []);

  const handleReportComplete = useCallback((pdfBlob: Blob) => {
    setIsGenerating(false);
    const url = URL.createObjectURL(pdfBlob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `METRIS_Assessment_ACME_Corp_2026-01-16_MTR-2026-0847.pdf`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Report downloaded successfully!");
  }, []);

  const handleReportError = useCallback((error: Error) => {
    setIsGenerating(false);
    toast.error("Failed to generate report: " + error.message);
  }, []);

  return (
    <>
      <ReportConfigModal
        open={showReportConfig}
        onClose={() => setShowReportConfig(false)}
        onGenerate={handleGenerateReport}
      />
      {isGenerating && reportConfig && (
        <ReportGenerationProgress
          config={reportConfig}
          onComplete={handleReportComplete}
          onError={handleReportError}
        />
      )}
    <div className="min-h-screen bg-background text-foreground w-full">
      {/* Header */}
      <header className="border-b border-border/50 bg-card/30 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link to="/" className="text-xl font-bold text-primary">METRIS</Link>
              <Badge variant="outline" className="text-xs">Assessment Results</Badge>
            </div>
            {onRestart && (
              <Button variant="ghost" size="sm" onClick={onRestart} className="gap-2">
                <ArrowLeft className="h-4 w-4" />
                New Assessment
              </Button>
            )}
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 pb-32">
        {/* Page Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">Your METRIS Assessment</h1>
          <p className="text-muted-foreground mb-2">{data.companyName || 'Your Organization'} • {data.industry || 'Technology'}</p>
          <p className="text-xs text-muted-foreground">
            Assessment #MTR-2026-0847 • January 18, 2026
          </p>
        </div>

        {/* NEW: Triple Metric Hero - NUMBERS, DOLLARS, HUMANS */}
        <Card className="mb-8 border-primary/30 bg-gradient-to-br from-card via-card to-primary/5">
          <CardContent className="p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
              {/* NUMBERS */}
              <div className="text-center p-6 bg-secondary/30 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <p className="text-primary text-xs font-semibold tracking-wider mb-3">NUMBERS</p>
                <p className={`text-5xl font-bold ${getScoreColor(score)} mb-1 tabular-nums`}>
                  {animatedScore}
                </p>
                <p className="text-muted-foreground text-sm mb-2">± {confidenceInterval} (95%)</p>
                <Badge className={`${
                  score >= 800 ? 'bg-emerald-500' : 
                  score >= 600 ? 'bg-yellow-500 text-black' : 
                  'bg-red-500'
                }`}>
                  {getScoreLabel(score)}
                </Badge>
              </div>
              
              {/* DOLLARS */}
              <div className="text-center p-6 bg-secondary/30 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <p className="text-primary text-xs font-semibold tracking-wider mb-3">DOLLARS</p>
                <p className="text-5xl font-bold text-red-400 mb-1 tabular-nums">
                  {formatCompactCurrency(var95)}
                </p>
                <p className="text-muted-foreground text-sm mb-2">VaR 95%</p>
                <Badge variant="outline" className="text-red-400 border-red-400/50">
                  High Risk
                </Badge>
              </div>
              
              {/* HUMANS */}
              <div className="text-center p-6 bg-secondary/30 rounded-xl border border-border hover:border-primary/50 transition-colors">
                <p className="text-primary text-xs font-semibold tracking-wider mb-3">HUMANS</p>
                <p className="text-5xl font-bold text-amber-400 mb-1 tabular-nums">
                  3,247
                </p>
                <p className="text-muted-foreground text-sm mb-2">affected this quarter</p>
                <Badge variant="outline" className="text-amber-400 border-amber-400/50">
                  Traceability Active
                </Badge>
              </div>
            </div>
            
            <p className="text-center text-muted-foreground text-sm">
              In a loop. Continuously.
            </p>
          </CardContent>
        </Card>

        {/* Hero Section - METRIS Score */}
        <Card className="mb-8 border-primary/20 bg-gradient-to-br from-card via-card to-primary/5">
          <CardContent className="p-8">
            <div className="flex flex-col lg:flex-row items-center gap-8">
              {/* Scout Image */}
              <div className="flex-shrink-0">
                <div className="relative">
                  <img 
                    src={scoutMascot} 
                    alt="Scout" 
                    className="w-32 h-32 object-contain drop-shadow-lg"
                  />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 rounded-full p-1">
                    <CheckCircle2 className="h-5 w-5 text-white" />
                  </div>
                </div>
              </div>
              
              {/* Score Display */}
              <div className="flex-1 text-center lg:text-left">
                <p className="text-sm text-muted-foreground uppercase tracking-wider mb-2">Your METRIS Score</p>
                
                <div className="inline-flex flex-col items-center lg:items-start">
                  <div className="relative">
                    <span className={`text-7xl md:text-8xl font-bold ${getScoreColor(score)} tabular-nums`}>
                      {animatedScore}
                    </span>
                    <span className="text-2xl text-muted-foreground ml-2">± {confidenceInterval}</span>
                  </div>
                  
                  <Badge className={`mt-2 text-lg px-4 py-1 ${
                    score >= 800 ? 'bg-emerald-500' : 
                    score >= 600 ? 'bg-yellow-500 text-black' : 
                    'bg-red-500'
                  }`}>
                    {getScoreLabel(score)}
                  </Badge>
                </div>
                
                {/* Score Scale */}
                <div className="mt-6 max-w-xl">
                  <div className="relative h-4 bg-muted rounded-full overflow-hidden">
                    <div className="absolute inset-0 flex">
                      <div className="h-full w-[20%] bg-red-600" />
                      <div className="h-full w-[20%] bg-red-500" />
                      <div className="h-full w-[20%] bg-amber-500" />
                      <div className="h-full w-[20%] bg-yellow-500" />
                      <div className="h-full w-[10%] bg-emerald-500" />
                      <div className="h-full w-[10%] bg-emerald-400" />
                    </div>
                    {/* Score marker */}
                    <div 
                      className="absolute top-0 bottom-0 w-1 bg-white shadow-lg transition-all duration-1000"
                      style={{ left: `${(animatedScore / 1000) * 100}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground mt-1">
                    <span>0</span>
                    <span>200</span>
                    <span>400</span>
                    <span>600</span>
                    <span>800</span>
                    <span>1000</span>
                  </div>
                  <div className="flex justify-between text-xs mt-1">
                    <span className="text-gray-400">MINIMAL</span>
                    <span className="text-red-400">CRITICAL</span>
                    <span className="text-orange-400">WEAK</span>
                    <span className="text-amber-400">MODERATE</span>
                    <span className="text-emerald-400">STRONG</span>
                    <span className="text-purple-400">EXEMPLARY</span>
                  </div>
                </div>
                
                <p className="text-sm text-muted-foreground mt-4">
                  Confidence Level: <span className="text-foreground font-medium">87%</span> based on evidence completeness
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Score Interpretation */}
        <Card className="mb-8 lcd-display">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-primary" />
              What This Means
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-lg mb-4">
              Your organization demonstrates <span className="font-semibold text-yellow-500">MODERATE governance maturity</span> with 
              notable gaps in risk quantification and documentation.
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-emerald-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-emerald-500">Strengths</p>
                  <p className="text-sm text-muted-foreground">Policy framework, ethical guidelines, training programs</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-amber-500">Gaps</p>
                  <p className="text-sm text-muted-foreground">Risk scoring methodology, human oversight evidence</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <Target className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-medium text-primary">Priority</p>
                  <p className="text-sm text-muted-foreground">Address 6 major gaps before EU AI Act deadline</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Financial Risk Exposure */}
        <Card className="mb-8 border-red-500/30 bg-gradient-to-br from-card to-red-950/10">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-red-500" />
              Financial Risk Exposure
            </CardTitle>
            <p className="text-sm text-muted-foreground">
              Based on your gaps, industry, and regulatory scope
            </p>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6 mb-6">
              <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">Expected Loss</p>
                <p className="text-3xl font-bold text-amber-500">
                  {formatCompactCurrency(animatedRisk)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Annual exposure</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">VaR (95%)</p>
                <p className="text-3xl font-bold text-red-500">
                  {formatCompactCurrency(DEMO_FINANCIAL_RISK.var95)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Likely maximum</p>
              </div>
              <div className="text-center p-4 bg-muted/30 rounded-lg border border-border/50">
                <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">CVaR (99%)</p>
                <p className="text-3xl font-bold text-red-600">
                  {formatCompactCurrency(DEMO_FINANCIAL_RISK.var99)}
                </p>
                <p className="text-xs text-muted-foreground mt-1">Worst case</p>
              </div>
            </div>
            
            {/* Risk Range Bar */}
            <div className="mb-4">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-muted-foreground">Risk Exposure Range</span>
                <span className="text-red-500 font-medium">{formatCompactCurrency(DEMO_FINANCIAL_RISK.var99)}</span>
              </div>
              <div className="relative h-3 bg-gradient-to-r from-amber-500 via-red-500 to-red-700 rounded-full">
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-white rounded-sm shadow-lg border-2 border-amber-500"
                  style={{ left: '22%' }}
                  title="Expected"
                />
                <div 
                  className="absolute top-1/2 -translate-y-1/2 w-3 h-5 bg-white rounded-sm shadow-lg border-2 border-red-500"
                  style={{ left: '55%' }}
                  title="VaR 95%"
                />
              </div>
              <div className="flex justify-between text-xs text-muted-foreground mt-1">
                <span>$0</span>
                <span>Expected ▲</span>
                <span>VaR 95% ▲</span>
                <span>Tail Risk</span>
              </div>
            </div>
            
            <p className="text-xs text-muted-foreground text-center">
              Calculated via Monte Carlo simulation (10,000 iterations) • 
              Factors: Revenue size, EU exposure, gap severity, enforcement probability
            </p>
          </CardContent>
        </Card>

        {/* Gap Summary */}
        <Card className="mb-8 lcd-display">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📋 Gap Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              <div className="text-center p-4 bg-red-950/30 rounded-lg border border-red-500/30">
                <div className="text-4xl font-bold text-red-500 mb-1">{GAP_SUMMARY.major}</div>
                <div className="text-sm font-medium text-red-400">🔴 MAJOR</div>
                <div className="text-xs text-muted-foreground">Blocking</div>
              </div>
              <div className="text-center p-4 bg-amber-950/30 rounded-lg border border-amber-500/30">
                <div className="text-4xl font-bold text-amber-500 mb-1">{GAP_SUMMARY.minor}</div>
                <div className="text-sm font-medium text-amber-400">🟡 MINOR</div>
                <div className="text-xs text-muted-foreground">Required</div>
              </div>
              <div className="text-center p-4 bg-blue-950/30 rounded-lg border border-blue-500/30">
                <div className="text-4xl font-bold text-blue-500 mb-1">{GAP_SUMMARY.ofi}</div>
                <div className="text-sm font-medium text-blue-400">🔵 OFI</div>
                <div className="text-xs text-muted-foreground">Improve</div>
              </div>
              <div className="text-center p-4 bg-emerald-950/30 rounded-lg border border-emerald-500/30">
                <div className="text-4xl font-bold text-emerald-500 mb-1">{GAP_SUMMARY.pass.toLocaleString()}</div>
                <div className="text-sm font-medium text-emerald-400">✅ ADDRESSED</div>
                <div className="text-xs text-muted-foreground">Conforming</div>
              </div>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              Coverage: <span className="text-foreground font-medium">98.5%</span> of applicable checkpoints evaluated
            </p>
          </CardContent>
        </Card>

        {/* Framework Compliance Breakdown */}
        <Card className="mb-8 lcd-display">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              📊 Framework Compliance Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {FRAMEWORK_COMPLIANCE.map((framework) => (
              <Collapsible 
                key={framework.name}
                open={expandedFrameworks.includes(framework.name)}
                onOpenChange={() => toggleFramework(framework.name)}
              >
                <div className="p-4 bg-muted/30 rounded-lg border border-border/50">
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-3">
                        <span className="font-medium">{framework.name}</span>
                        <Badge variant={framework.status === 'pass' ? 'default' : 'secondary'} className={
                          framework.status === 'pass' ? 'bg-emerald-500' : 'bg-amber-500/20 text-amber-500'
                        }>
                          {framework.status === 'pass' ? '✅ Pass' : '⚠️ Gaps'}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm text-muted-foreground">
                          {framework.majorGaps} major, {framework.minorGaps} minor
                        </span>
                        <span className={`font-bold ${
                          framework.score >= 800 ? 'text-emerald-500' : 
                          framework.score >= 600 ? 'text-yellow-500' : 'text-red-500'
                        }`}>
                          {framework.score}
                        </span>
                        {expandedFrameworks.includes(framework.name) ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <ChevronRight className="h-4 w-4" />
                        )}
                      </div>
                    </div>
                    <Progress 
                      value={framework.score / 10} 
                      className="h-2"
                    />
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="mt-4 pt-4 border-t border-border/50">
                      <p className="text-sm text-muted-foreground mb-2">Key findings:</p>
                      <ul className="space-y-1">
                        {framework.details.map((detail, i) => (
                          <li key={i} className="text-sm flex items-start gap-2">
                            <span className={framework.status === 'pass' ? 'text-emerald-500' : 'text-amber-500'}>
                              {framework.status === 'pass' ? '✓' : '•'}
                            </span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </CollapsibleContent>
                </div>
              </Collapsible>
            ))}
          </CardContent>
        </Card>

        {/* Priority Remediation Roadmap */}
        <Card className="mb-8 border-primary/20">
          <CardHeader>
            <div className="flex items-center justify-between flex-wrap gap-2">
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5 text-primary" />
                Priority Remediation Roadmap
              </CardTitle>
              <Badge variant="outline">Sorted by: Risk Reduction Impact</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            {REMEDIATION_ITEMS.slice(0, showAllMajor ? undefined : 4).map((item) => (
              <div key={item.priority} className="p-4 bg-muted/30 rounded-lg border border-border/50 hover:border-primary/30 transition-colors">
                <div className="flex items-start gap-4">
                  <div className="flex-shrink-0 w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center">
                    <span className="text-red-500 font-bold text-sm">#{item.priority}</span>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-red-500">🔴</span>
                      <span className="font-medium">{item.title}</span>
                    </div>
                    <div className="grid md:grid-cols-3 gap-2 text-sm text-muted-foreground mt-2">
                      <div className="flex items-center gap-1">
                        <Shield className="h-3 w-3" />
                        <span>{item.frameworks.join(", ")}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <TrendingDown className="h-3 w-3 text-emerald-500" />
                        <span className="text-emerald-500">Risk Reduction: {formatCompactCurrency(item.riskReduction)}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        <span>Effort: {item.effort}</span>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <Button variant="outline" size="sm" className="text-xs">View Details</Button>
                      <Button variant="outline" size="sm" className="text-xs">Generate Action Plan</Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            <div className="flex flex-wrap gap-2">
              {!showAllMajor && REMEDIATION_ITEMS.length > 4 && (
                <Button variant="ghost" size="sm" onClick={() => setShowAllMajor(true)}>
                  Show all {REMEDIATION_ITEMS.length} major gaps
                </Button>
              )}
              <Button variant="ghost" size="sm">Show 14 minor gaps</Button>
              <Button variant="ghost" size="sm">Show 8 OFIs</Button>
            </div>
          </CardContent>
        </Card>

        {/* ROI Calculator Integration */}
        <Card className="mb-8 bg-gradient-to-br from-card to-emerald-950/10 border-emerald-500/20">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              💼 METRIS ROI Calculation
            </CardTitle>
            <p className="text-sm text-muted-foreground">Based on your assessment results</p>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Current Risk Exposure</span>
                <span className="font-medium text-red-500">{formatCompactCurrency(var95)} (VaR 95%)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">Post-Remediation Exposure</span>
                <span className="font-medium text-emerald-500">$340K (projected)</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="font-medium">Risk Reduction Value</span>
                <span className="font-bold text-emerald-500 text-xl">$3.86M</span>
              </div>
              <div className="flex justify-between items-center py-2 border-b border-border/50">
                <span className="text-muted-foreground">METRIS Investment</span>
                <span className="font-medium">$85K/year</span>
              </div>
              <div className="flex justify-between items-center py-2 bg-emerald-500/10 rounded-lg px-4">
                <span className="font-bold text-lg">ROI</span>
                <span className="font-bold text-3xl text-emerald-500">45.4x</span>
              </div>
            </div>
            <Button variant="outline" className="w-full mt-4">
              View Detailed ROI Breakdown →
            </Button>
          </CardContent>
        </Card>
      </main>

      {/* Sticky Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-card/95 backdrop-blur-sm border-t border-border/50 p-4 z-50">
        <div className="container mx-auto flex flex-wrap items-center justify-center gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Download PDF Report
          </Button>
          <Button variant="outline" className="gap-2">
            <FileSpreadsheet className="h-4 w-4" />
            Export Data
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" />
            Schedule Review
          </Button>
          <Button className="gap-2 bg-primary hover:bg-primary/90">
            <RefreshCw className="h-4 w-4" />
            Start Continuous Monitoring
            <Badge variant="secondary" className="ml-1 text-xs">Pro</Badge>
          </Button>
        </div>
      </div>
    </div>
    </>
  );
}
