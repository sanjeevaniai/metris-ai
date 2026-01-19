import { Button } from '@/components/ui/button';
import type { AssessmentData, AssessmentStage } from '@/pages/Assess';

const stages: { value: AssessmentStage; label: string; arrow: string }[] = [
  { value: 'initial', label: 'Just starting — I need to know where we stand', arrow: 'Initial Score' },
  { value: 'monitoring', label: "We've been working on it — checking our progress", arrow: 'Monitoring Score' },
  { value: 'readiness', label: "Audit coming up — need to know our readiness tier", arrow: 'Readiness Score' },
];

interface StageSelectionProps {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
}

export function StageSelection({ data, updateData, onNext }: StageSelectionProps) {
  const handleSelect = (stage: AssessmentStage) => {
    updateData({ stage });
    onNext();
  };

  return (
    <div className="w-full max-w-2xl">
      {/* Scout Message */}
      <div className="card-terminal p-6 rounded-lg mb-6">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
            <span className="text-primary font-mono text-sm">AI</span>
          </div>
          <div>
            <p className="font-semibold text-primary mb-2">Scout AI</p>
            <p className="text-foreground">
              Hi! I'm Scout, your governance analyst.
            </p>
            <p className="text-muted-foreground mt-2">
              Before we begin — where are you in your governance journey?
            </p>
          </div>
        </div>
      </div>

      {/* Options */}
      <div className="card-terminal p-6 rounded-lg space-y-3">
        {stages.map((stage) => (
          <button
            key={stage.value}
            onClick={() => handleSelect(stage.value)}
            className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary transition-colors group"
          >
            <div className="flex items-center gap-3">
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors ${
                data.stage === stage.value 
                  ? 'border-primary bg-primary' 
                  : 'border-muted-foreground group-hover:border-primary'
              }`}>
                {data.stage === stage.value && (
                  <div className="w-1.5 h-1.5 rounded-full bg-primary-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="text-foreground">{stage.label}</p>
                <p className="text-sm text-primary">→ {stage.arrow}</p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
