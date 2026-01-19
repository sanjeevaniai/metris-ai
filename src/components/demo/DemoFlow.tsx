import { useState } from 'react';
import { IntakeForm, IntakeData } from './IntakeForm';
import { LiveScanning } from './LiveScanning';
import { ScoringView } from './ScoringView';
import { SimulationView } from './SimulationView';
import { ReportView } from './ReportView';
import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

type DemoStep = 'intake' | 'scanning' | 'scoring' | 'simulation' | 'report';

const steps: { id: DemoStep; label: string; description: string }[] = [
  { id: 'intake', label: 'Intake', description: 'AI System Details' },
  { id: 'scanning', label: 'Scanning', description: 'Live Risk Analysis' },
  { id: 'scoring', label: 'Scoring', description: 'Governance Score' },
  { id: 'simulation', label: 'Simulation', description: 'Monte Carlo' },
  { id: 'report', label: 'Report', description: 'Governance Report' },
];

export function DemoFlow() {
  const [currentStep, setCurrentStep] = useState<DemoStep>('intake');
  const [intakeData, setIntakeData] = useState<IntakeData | null>(null);

  const currentStepIndex = steps.findIndex((s) => s.id === currentStep);

  const handleIntakeSubmit = (data: IntakeData) => {
    setIntakeData(data);
    setCurrentStep('scanning');
  };

  const handleScanningComplete = () => {
    setCurrentStep('scoring');
  };

  const handleScoringContinue = () => {
    setCurrentStep('simulation');
  };

  const handleSimulationContinue = () => {
    setCurrentStep('report');
  };

  return (
    <div className="space-y-12">
      {/* Premium Step Indicator - 30% larger */}
      <div className="flex items-center justify-center px-4">
        <div className="inline-flex items-center p-2 rounded-2xl bg-muted/30 backdrop-blur-xl border border-border/30 shadow-elevated">
          {steps.map((step, idx) => {
            const isActive = step.id === currentStep;
            const isComplete = idx < currentStepIndex;
            
            return (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => isComplete && setCurrentStep(step.id)}
                  disabled={!isComplete}
                  className={cn(
                    'relative flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300',
                    isActive && [
                      'bg-card shadow-premium',
                      'text-foreground',
                    ],
                    isComplete && [
                      'text-primary cursor-pointer',
                      'hover:bg-primary/10',
                    ],
                    !isActive && !isComplete && [
                      'text-muted-foreground cursor-not-allowed',
                    ]
                  )}
                >
                  {/* Step indicator - larger */}
                  <span className={cn(
                    'flex items-center justify-center w-8 h-8 rounded-lg text-sm font-medium transition-all duration-300',
                    isActive && 'bg-primary text-primary-foreground shadow-glow-sm',
                    isComplete && 'bg-primary/20 text-primary',
                    !isActive && !isComplete && 'bg-muted text-muted-foreground'
                  )}>
                    {isComplete ? (
                      <Check className="h-4.5 w-4.5" />
                    ) : (
                      idx + 1
                    )}
                  </span>
                  
                  {/* Step label - larger text */}
                  <span className="hidden sm:block text-base font-medium tracking-tight">
                    {step.label}
                  </span>
                </button>
                
                {/* Connector line - slightly longer */}
                {idx < steps.length - 1 && (
                  <div className={cn(
                    'w-8 h-px mx-1.5 transition-colors duration-300',
                    idx < currentStepIndex ? 'bg-primary/50' : 'bg-border/50'
                  )} />
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Content with animation */}
      <div className="container max-w-7xl mx-auto px-4">
        <div className="animate-enter">
          {currentStep === 'intake' && (
            <IntakeForm onSubmit={handleIntakeSubmit} />
          )}
          {currentStep === 'scanning' && (
            <LiveScanning onComplete={handleScanningComplete} />
          )}
          {currentStep === 'scoring' && (
            <ScoringView onContinue={handleScoringContinue} />
          )}
          {currentStep === 'simulation' && (
            <SimulationView onContinue={handleSimulationContinue} />
          )}
          {currentStep === 'report' && (
            <ReportView />
          )}
        </div>
      </div>
    </div>
  );
}
