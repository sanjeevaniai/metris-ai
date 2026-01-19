import { useState, useMemo } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { 
  Calculator, 
  TrendingUp, 
  DollarSign, 
  AlertTriangle, 
  Shield,
  Building2,
  ChevronRight,
  ChevronLeft,
  BarChart3,
  Clock,
  Zap,
  Check,
  Sparkles,
  Download,
  Info
} from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';

interface ROICalculatorProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Simplified industry data
const INDUSTRIES = [
  { value: 'healthcare', label: 'Healthcare', risk: 'high', multiplier: 1.4 },
  { value: 'finance', label: 'Financial Services', risk: 'high', multiplier: 1.3 },
  { value: 'insurance', label: 'Insurance', risk: 'medium', multiplier: 1.25 },
  { value: 'hr_recruitment', label: 'HR / Recruitment', risk: 'high', multiplier: 1.35 },
  { value: 'retail', label: 'Retail / E-commerce', risk: 'low', multiplier: 0.9 },
  { value: 'manufacturing', label: 'Manufacturing', risk: 'low', multiplier: 0.85 },
  { value: 'technology', label: 'Technology', risk: 'medium', multiplier: 1.0 },
  { value: 'government', label: 'Government', risk: 'high', multiplier: 1.5 },
];

// Simplified company sizes
const COMPANY_SIZES = [
  { value: 'startup', label: 'Startup', revenue: '< $10M', avgRevenue: 5000000, systems: 3 },
  { value: 'smb', label: 'SMB', revenue: '$10M - $100M', avgRevenue: 50000000, systems: 8 },
  { value: 'mid', label: 'Mid-Market', revenue: '$100M - $500M', avgRevenue: 250000000, systems: 15 },
  { value: 'enterprise', label: 'Enterprise', revenue: '$500M+', avgRevenue: 1000000000, systems: 30 },
];

// AI usage levels
const AI_USAGE = [
  { value: 'minimal', label: 'Just Getting Started', description: '1-3 AI systems', systems: 2, riskLevel: 'low' },
  { value: 'moderate', label: 'Growing AI Footprint', description: '4-10 AI systems', systems: 7, riskLevel: 'medium' },
  { value: 'significant', label: 'AI-First Operations', description: '10-25 AI systems', systems: 18, riskLevel: 'high' },
  { value: 'extensive', label: 'AI at Scale', description: '25+ AI systems', systems: 35, riskLevel: 'critical' },
];

const formatCurrency = (value: number) => {
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `$${(value / 1000).toFixed(0)}K`;
  }
  return `$${value.toFixed(0)}`;
};

const STEPS = [
  { id: 'company', title: 'Your Company', icon: Building2 },
  { id: 'ai', title: 'AI Usage', icon: Zap },
  { id: 'results', title: 'Your ROI', icon: TrendingUp },
];

export function ROICalculator({ open, onOpenChange }: ROICalculatorProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [companySize, setCompanySize] = useState<string>('smb');
  const [industry, setIndustry] = useState<string>('technology');
  const [aiUsage, setAiUsage] = useState<string>('moderate');
  const [operatesInEU, setOperatesInEU] = useState<boolean>(true);

  // Get derived values
  const selectedSize = COMPANY_SIZES.find(s => s.value === companySize)!;
  const selectedIndustry = INDUSTRIES.find(i => i.value === industry)!;
  const selectedAiUsage = AI_USAGE.find(a => a.value === aiUsage)!;

  // Calculate all metrics
  const calculations = useMemo(() => {
    const revenue = selectedSize.avgRevenue;
    const riskMultiplier = selectedIndustry.multiplier;
    const aiSystems = selectedAiUsage.systems;

    // Base regulatory exposure (simplified)
    const baseExposure = revenue * 0.035; // ~3.5% revenue at risk
    const adjustedExposure = baseExposure * riskMultiplier * (operatesInEU ? 1.4 : 1.0);
    
    // Probability of enforcement (simplified)
    const enforcementProbability = 0.15 * riskMultiplier;
    
    // Annual expected loss
    const annualRisk = adjustedExposure * enforcementProbability;

    // Traditional costs
    const traditionalAuditPerSystem = 25000;
    const traditionalAnnual = aiSystems * traditionalAuditPerSystem * 0.5; // 50% need annual audits

    // METRIS costs (simplified tier pricing)
    let metrisCost = 0;
    if (aiSystems <= 5) metrisCost = 999 * 12;
    else if (aiSystems <= 15) metrisCost = 2999 * 12;
    else if (aiSystems <= 30) metrisCost = 4999 * 12;
    else metrisCost = 9999 * 12;

    // Risk reduction
    const riskReduction = 0.65; // 65% risk reduction
    const riskSavings = annualRisk * riskReduction;

    // Cost savings
    const costSavings = Math.max(0, traditionalAnnual - metrisCost);

    // Total value
    const totalValue = riskSavings + costSavings;
    const netBenefit = totalValue - metrisCost;
    const roi = (netBenefit / metrisCost) * 100;
    const paybackMonths = metrisCost / (totalValue / 12);

    // 3-year projection
    const threeYearSavings = netBenefit * 3;

    return {
      annualRisk,
      adjustedExposure,
      riskReduction,
      riskSavings,
      traditionalAnnual,
      metrisCost,
      costSavings,
      totalValue,
      netBenefit,
      roi,
      paybackMonths,
      threeYearSavings,
      aiSystems,
    };
  }, [selectedSize, selectedIndustry, selectedAiUsage, operatesInEU]);

  const nextStep = () => setCurrentStep(Math.min(currentStep + 1, STEPS.length - 1));
  const prevStep = () => setCurrentStep(Math.max(currentStep - 1, 0));

  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const exportReport = () => {
    const report = {
      companyProfile: { size: companySize, industry, aiUsage, operatesInEU },
      analysis: {
        annualRisk: calculations.annualRisk,
        riskReduction: `${(calculations.riskReduction * 100).toFixed(0)}%`,
        roi: `${calculations.roi.toFixed(0)}%`,
        paybackMonths: calculations.paybackMonths.toFixed(1),
        threeYearSavings: calculations.threeYearSavings,
      },
      generatedAt: new Date().toISOString(),
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'METRIS-ROI-Analysis.json';
    a.click();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div className="p-2 rounded-xl bg-primary/10">
              <Calculator className="h-5 w-5 text-primary" />
            </div>
            Calculate Your ROI
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            Answer 2 quick questions to see your potential savings
          </p>
        </DialogHeader>

        {/* Progress Bar */}
        <div className="mt-4">
          <div className="flex justify-between mb-2">
            {STEPS.map((step, index) => {
              const Icon = step.icon;
              const isActive = index === currentStep;
              const isCompleted = index < currentStep;
              
              return (
                <div 
                  key={step.id}
                  className={`flex items-center gap-2 text-sm transition-colors ${
                    isActive ? 'text-primary font-medium' : 
                    isCompleted ? 'text-success' : 'text-muted-foreground'
                  }`}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-all ${
                    isActive ? 'bg-primary text-primary-foreground' : 
                    isCompleted ? 'bg-success/20 text-success' : 'bg-muted'
                  }`}>
                    {isCompleted ? <Check className="h-4 w-4" /> : <Icon className="h-4 w-4" />}
                  </div>
                  <span className="hidden sm:inline">{step.title}</span>
                </div>
              );
            })}
          </div>
          <Progress value={progress} className="h-1.5" />
        </div>

        {/* Step Content */}
        <div className="mt-8 min-h-[320px]">
          {/* Step 1: Company */}
          {currentStep === 0 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="text-base font-medium mb-3 block">Company Size</Label>
                <div className="grid grid-cols-2 gap-3">
                  {COMPANY_SIZES.map((size) => (
                    <Card
                      key={size.value}
                      className={`p-4 cursor-pointer transition-all hover:scale-[1.02] ${
                        companySize === size.value 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setCompanySize(size.value)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <span className="font-medium">{size.label}</span>
                        {companySize === size.value && (
                          <Check className="h-4 w-4 text-primary" />
                        )}
                      </div>
                      <span className="text-sm text-muted-foreground">{size.revenue}</span>
                    </Card>
                  ))}
                </div>
              </div>

              <div>
                <Label className="text-base font-medium mb-3 block">Industry</Label>
                <Select value={industry} onValueChange={setIndustry}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INDUSTRIES.map((ind) => (
                      <SelectItem key={ind.value} value={ind.value}>
                        <div className="flex items-center gap-3">
                          <span>{ind.label}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${
                            ind.risk === 'high' ? 'bg-destructive/20 text-destructive' :
                            ind.risk === 'medium' ? 'bg-warning/20 text-warning' :
                            'bg-success/20 text-success'
                          }`}>
                            {ind.risk} risk
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Card 
                className={`p-4 cursor-pointer transition-all ${
                  operatesInEU ? 'border-primary bg-primary/5' : 'hover:border-primary/50'
                }`}
                onClick={() => setOperatesInEU(!operatesInEU)}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="font-medium">We operate in the EU</span>
                    <p className="text-sm text-muted-foreground">Subject to EU AI Act requirements</p>
                  </div>
                  <div className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-colors ${
                    operatesInEU ? 'border-primary bg-primary' : 'border-muted-foreground/30'
                  }`}>
                    {operatesInEU && <Check className="h-4 w-4 text-primary-foreground" />}
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 2: AI Usage */}
          {currentStep === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div>
                <Label className="text-base font-medium mb-3 block">Your AI Maturity</Label>
                <p className="text-sm text-muted-foreground mb-4">
                  How many AI/ML systems are you running or planning to deploy?
                </p>
                <div className="space-y-3">
                  {AI_USAGE.map((usage) => (
                    <Card
                      key={usage.value}
                      className={`p-4 cursor-pointer transition-all hover:scale-[1.01] ${
                        aiUsage === usage.value 
                          ? 'border-primary bg-primary/5 ring-2 ring-primary/20' 
                          : 'hover:border-primary/50'
                      }`}
                      onClick={() => setAiUsage(usage.value)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium">{usage.label}</span>
                            <span className={`text-xs px-2 py-0.5 rounded-full ${
                              usage.riskLevel === 'critical' ? 'bg-destructive/20 text-destructive' :
                              usage.riskLevel === 'high' ? 'bg-warning/20 text-warning' :
                              usage.riskLevel === 'medium' ? 'bg-secondary/20 text-secondary' :
                              'bg-success/20 text-success'
                            }`}>
                              {usage.riskLevel} exposure
                            </span>
                          </div>
                          <span className="text-sm text-muted-foreground">{usage.description}</span>
                        </div>
                        {aiUsage === usage.value && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </Card>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Results */}
          {currentStep === 2 && (
            <div className="space-y-6 animate-fade-in">
              {/* Hero Metric */}
              <Card className="p-6 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent border-primary/30">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-2 rounded-full bg-success/20">
                    <Sparkles className="h-5 w-5 text-success" />
                  </div>
                  <span className="text-sm font-medium text-muted-foreground">Your Estimated 3-Year Savings</span>
                </div>
                <p className="text-4xl font-bold text-success mb-2">
                  {formatCurrency(calculations.threeYearSavings)}
                </p>
                <p className="text-sm text-muted-foreground">
                  Based on {calculations.aiSystems} AI systems in {selectedIndustry.label}
                </p>
              </Card>

              {/* Key Metrics Grid */}
              <div className="grid grid-cols-2 gap-4">
                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertTriangle className="h-4 w-4 text-destructive" />
                    <span className="text-xs text-muted-foreground">Annual Risk</span>
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <Info className="h-3 w-3 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>Expected annual loss from regulatory fines based on your industry risk and AI usage.</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>
                  <p className="text-2xl font-bold text-destructive">
                    {formatCurrency(calculations.annualRisk)}
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Shield className="h-4 w-4 text-success" />
                    <span className="text-xs text-muted-foreground">Risk Reduction</span>
                  </div>
                  <p className="text-2xl font-bold text-success">
                    {(calculations.riskReduction * 100).toFixed(0)}%
                  </p>
                </Card>

                <Card className="p-4 border-primary/50">
                  <div className="flex items-center gap-2 mb-2">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <span className="text-xs text-muted-foreground">ROI</span>
                  </div>
                  <p className={`text-2xl font-bold ${calculations.roi > 0 ? 'text-primary' : 'text-destructive'}`}>
                    {calculations.roi.toFixed(0)}%
                  </p>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Clock className="h-4 w-4 text-secondary" />
                    <span className="text-xs text-muted-foreground">Payback</span>
                  </div>
                  <p className="text-2xl font-bold text-secondary">
                    {calculations.paybackMonths.toFixed(0)} mo
                  </p>
                </Card>
              </div>

              {/* Cost Comparison */}
              <Card className="p-4">
                <h4 className="text-sm font-medium mb-4 flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  Annual Cost Comparison
                </h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Traditional Audits</span>
                    <span className="font-medium">{formatCurrency(calculations.traditionalAnnual)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-primary font-medium">METRIS Platform</span>
                    <span className="font-medium text-primary">{formatCurrency(calculations.metrisCost)}</span>
                  </div>
                  <div className="border-t pt-3 flex items-center justify-between">
                    <span className="text-sm font-medium">You Save</span>
                    <span className="font-bold text-success">
                      {formatCurrency(calculations.costSavings + calculations.riskSavings)}/year
                    </span>
                  </div>
                </div>
              </Card>
            </div>
          )}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between mt-6 pt-4 border-t">
          {currentStep > 0 ? (
            <Button variant="ghost" onClick={prevStep} className="gap-2">
              <ChevronLeft className="h-4 w-4" />
              Back
            </Button>
          ) : (
            <Button variant="ghost" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
          )}

          {currentStep < STEPS.length - 1 ? (
            <Button onClick={nextStep} className="gap-2">
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="outline" onClick={exportReport} className="gap-2">
                <Download className="h-4 w-4" />
                Export
              </Button>
              <Button onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
