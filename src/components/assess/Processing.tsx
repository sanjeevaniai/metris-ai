import { useState, useEffect } from 'react';
import { Check, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';

const steps = [
  'Evaluating against 1,902 checkpoints',
  'Mapping to ISO 42001, EU AI Act, NIST',
  'Calculating risk exposure',
  'Generating auditor verdict',
  'Preparing your results',
];

interface ProcessingProps {
  onComplete: () => void;
}

export function Processing({ onComplete }: ProcessingProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    // Animate progress bar
    const progressInterval = setInterval(() => {
      setProgress(prev => Math.min(prev + 2, 100));
    }, 100);

    // Step through processing items
    const stepInterval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev < steps.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 1000);

    // Complete after animation
    const timeout = setTimeout(() => {
      onComplete();
    }, 5000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stepInterval);
      clearTimeout(timeout);
    };
  }, [onComplete]);

  return (
    <div className="w-full max-w-lg text-center">
      <h2 className="text-2xl font-bold mb-8">
        Analyzing your organization...
      </h2>

      {/* Progress Bar */}
      <div className="card-terminal p-6 rounded-lg mb-8">
        <Progress value={progress} className="h-3" />
      </div>

      {/* Steps */}
      <div className="space-y-4 text-left">
        {steps.map((step, index) => (
          <div key={step} className="flex items-center gap-3">
            {index < currentStep ? (
              <Check className="w-5 h-5 text-primary flex-shrink-0" />
            ) : index === currentStep ? (
              <Loader2 className="w-5 h-5 text-primary animate-spin flex-shrink-0" />
            ) : (
              <div className="w-5 h-5 rounded-full border-2 border-muted-foreground/30 flex-shrink-0" />
            )}
            <span className={index <= currentStep ? 'text-foreground' : 'text-muted-foreground'}>
              {step}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
