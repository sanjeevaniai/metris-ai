// Decision Volume Step - Assessment Wizard
// "This enables Traceability to the Human"

import { useState, useMemo } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Users, ArrowLeft, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { cn } from '@/lib/utils';
import { INDUSTRY_BENCHMARKS, formatDecisionVolume } from '@/data/demoHumanImpact';

interface DecisionVolumeStepProps {
  data: {
    industry?: string;
    decisionVolume?: number;
    decisionFrequency?: 'daily' | 'monthly' | 'yearly';
    useEstimate?: boolean;
    estimateUseCase?: string;
  };
  updateData: (updates: Partial<DecisionVolumeStepProps['data']>) => void;
  onNext: () => void;
  onBack: () => void;
}

export function DecisionVolumeStep({ data, updateData, onNext, onBack }: DecisionVolumeStepProps) {
  const [frequency, setFrequency] = useState<'daily' | 'monthly' | 'yearly'>(data.decisionFrequency || 'daily');
  const [volumeInput, setVolumeInput] = useState(data.decisionVolume?.toString() || '');
  const [useEstimate, setUseEstimate] = useState(data.useEstimate || false);
  const [selectedIndustry, setSelectedIndustry] = useState(data.industry || '');
  const [selectedUseCase, setSelectedUseCase] = useState(data.estimateUseCase || '');

  // Get available industries
  const industries = Object.entries(INDUSTRY_BENCHMARKS).map(([key, value]) => ({
    id: key,
    name: value.name,
  }));

  // Get use cases for selected industry
  const useCases = useMemo(() => {
    if (!selectedIndustry) return [];
    const industry = INDUSTRY_BENCHMARKS[selectedIndustry as keyof typeof INDUSTRY_BENCHMARKS];
    if (!industry) return [];
    return Object.entries(industry.useCases).map(([key, value]) => ({
      id: key,
      label: value.label,
      daily: value.daily,
    }));
  }, [selectedIndustry]);

  // Get estimated daily volume
  const estimatedDaily = useMemo(() => {
    if (!selectedIndustry || !selectedUseCase) return null;
    const industry = INDUSTRY_BENCHMARKS[selectedIndustry as keyof typeof INDUSTRY_BENCHMARKS];
    if (!industry) return null;
    const useCaseData = industry.useCases as Record<string, { daily: number; label: string }>;
    const useCase = useCaseData[selectedUseCase];
    return useCase?.daily || null;
  }, [selectedIndustry, selectedUseCase]);

  // Calculate daily volume from input
  const calculateDailyVolume = (): number => {
    if (useEstimate && estimatedDaily) {
      return estimatedDaily;
    }
    
    const volume = parseInt(volumeInput) || 0;
    switch (frequency) {
      case 'daily': return volume;
      case 'monthly': return Math.round(volume / 30);
      case 'yearly': return Math.round(volume / 365);
      default: return volume;
    }
  };

  const handleNext = () => {
    const dailyVolume = calculateDailyVolume();
    updateData({
      decisionVolume: dailyVolume,
      decisionFrequency: frequency,
      useEstimate,
      industry: selectedIndustry,
      estimateUseCase: selectedUseCase,
    });
    onNext();
  };

  const isValid = useEstimate ? (selectedIndustry && selectedUseCase) : (volumeInput && parseInt(volumeInput) > 0);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardContent className="p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
            <Users className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-display font-semibold text-foreground mb-2">
            Decision Volume
          </h2>
          <p className="text-muted-foreground">
            How many decisions does this AI system make?
          </p>
          <p className="text-sm text-primary mt-2">
            This enables <span className="font-medium">Traceability to the Human</span> — connecting 
            governance findings to the humans affected by your AI's decisions.
          </p>
        </div>

        {/* Manual Input */}
        <div className={cn(
          "space-y-4 p-4 rounded-lg border transition-all",
          useEstimate ? "opacity-50 pointer-events-none bg-muted/30" : "bg-card"
        )}>
          <Label className="text-sm font-medium">Decision Frequency:</Label>
          
          <RadioGroup
            value={frequency}
            onValueChange={(v) => setFrequency(v as typeof frequency)}
            className="space-y-3"
          >
            {(['daily', 'monthly', 'yearly'] as const).map((freq) => (
              <div key={freq} className="flex items-center gap-3">
                <RadioGroupItem value={freq} id={freq} />
                <Label htmlFor={freq} className="flex-1 flex items-center gap-2 cursor-pointer">
                  <span className="capitalize">{freq === 'daily' ? 'Per Day' : freq === 'monthly' ? 'Per Month' : 'Per Year'}</span>
                  <Input
                    type="number"
                    placeholder={`decisions/${freq.slice(0, -2) + (freq === 'daily' ? 'y' : freq === 'monthly' ? 'h' : '')}`}
                    value={frequency === freq ? volumeInput : ''}
                    onChange={(e) => {
                      setFrequency(freq);
                      setVolumeInput(e.target.value);
                    }}
                    className="w-40 h-8"
                    disabled={useEstimate}
                  />
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        {/* Estimate Option */}
        <div className="mt-6 p-4 rounded-lg border bg-muted/20">
          <div className="flex items-start gap-3">
            <Checkbox
              id="use-estimate"
              checked={useEstimate}
              onCheckedChange={(checked) => setUseEstimate(checked as boolean)}
            />
            <div className="flex-1">
              <Label htmlFor="use-estimate" className="text-sm font-medium cursor-pointer">
                I don't know — estimate based on industry benchmarks
              </Label>
              
              {useEstimate && (
                <div className="mt-4 space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Industry</Label>
                      <Select value={selectedIndustry} onValueChange={setSelectedIndustry}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select industry..." />
                        </SelectTrigger>
                        <SelectContent>
                          {industries.map((ind) => (
                            <SelectItem key={ind.id} value={ind.id}>
                              {ind.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label className="text-xs text-muted-foreground">Use Case</Label>
                      <Select 
                        value={selectedUseCase} 
                        onValueChange={setSelectedUseCase}
                        disabled={!selectedIndustry}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select use case..." />
                        </SelectTrigger>
                        <SelectContent>
                          {useCases.map((uc) => (
                            <SelectItem key={uc.id} value={uc.id}>
                              {uc.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {estimatedDaily && (
                    <div className="p-3 rounded-md bg-primary/10 border border-primary/20">
                      <div className="flex items-center gap-2 text-primary">
                        <Sparkles className="h-4 w-4" />
                        <span className="text-sm font-medium">
                          Estimated: ~{formatDecisionVolume(estimatedDaily)} decisions/day
                        </span>
                      </div>
                      <p className="text-xs text-muted-foreground mt-1">
                        Based on industry benchmarks for {useCases.find(uc => uc.id === selectedUseCase)?.label?.toLowerCase()} systems
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Why This Matters */}
        <div className="mt-6 p-4 rounded-lg bg-muted/30 border border-border/50">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-foreground mb-2">Why This Matters</p>
              <div className="text-sm text-muted-foreground space-y-2">
                <div className="flex gap-2">
                  <span className="text-muted-foreground/60">Without decision volume:</span>
                  <span>"Fairness gap detected"</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-primary font-medium">With decision volume:</span>
                  <span className="text-foreground">"3,247 humans affected by fairness gap in 847K quarterly decisions"</span>
                </div>
              </div>
              <p className="text-xs text-primary mt-3 font-medium">
                This is Traceability to the Human.
              </p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button variant="ghost" onClick={onBack} className="gap-2">
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={!isValid} className="gap-2">
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
