import { MessageSquare, Mic } from 'lucide-react';
import type { AssessmentData, AssessmentMode } from '@/pages/Assess';

interface ModeSelectionProps {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
}

export function ModeSelection({ data, updateData, onNext }: ModeSelectionProps) {
  const handleSelect = (mode: AssessmentMode) => {
    updateData({ mode });
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
              Great. I'll ask you 6 quick questions.
            </p>
            <p className="text-muted-foreground mt-2">
              How would you like to do this?
            </p>
          </div>
        </div>
      </div>

      {/* Mode Options */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <button
          onClick={() => handleSelect('text')}
          className="card-terminal p-8 rounded-lg text-center hover:border-primary/50 transition-colors group"
        >
          <div className="w-16 h-16 rounded-lg bg-secondary border border-border flex items-center justify-center mx-auto mb-4 group-hover:border-primary/50 transition-colors">
            <MessageSquare className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Text</h3>
          <p className="text-sm text-muted-foreground">Type responses</p>
        </button>

        <button
          onClick={() => handleSelect('voice')}
          className="card-terminal p-8 rounded-lg text-center hover:border-primary/50 transition-colors group"
        >
          <div className="w-16 h-16 rounded-lg bg-secondary border border-border flex items-center justify-center mx-auto mb-4 group-hover:border-primary/50 transition-colors">
            <Mic className="w-8 h-8 text-primary" />
          </div>
          <h3 className="font-semibold text-lg mb-2">Voice</h3>
          <p className="text-sm text-muted-foreground">Talk to Scout</p>
        </button>
      </div>

      <p className="text-center text-sm text-muted-foreground mt-6">
        Perfect for commutes or multitasking.
      </p>
    </div>
  );
}
