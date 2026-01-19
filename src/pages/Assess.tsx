import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { PublicHeader } from '@/components/layout/PublicHeader';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { EmailCapture } from '@/components/assess/EmailCapture';
import { StageSelection } from '@/components/assess/StageSelection';
import { DecisionVolumeStep } from '@/components/assess/DecisionVolumeStep';
import { ModeSelection } from '@/components/assess/ModeSelection';
import { ScoutConversation } from '@/components/assess/ScoutConversation';
import { VoiceConversation } from '@/components/assess/VoiceConversation';
import { EvidenceCollection } from '@/components/assess/EvidenceCollection';
import { AnalysisProgress } from '@/components/assess/AnalysisProgress';
import { Results } from '@/components/assess/Results';
import { useROISlidePanel, DEFAULT_SLIDE_DATA } from '@/hooks/useROISlidePanel';

export type AssessmentStage = 'initial' | 'monitoring' | 'readiness';
export type AssessmentMode = 'text' | 'voice';
export type AssessmentStep = 'email' | 'stage' | 'decision-volume' | 'mode' | 'conversation' | 'evidence' | 'analysis' | 'results';
export type VoicePreference = 'warm' | 'calm';

export interface AssessmentData {
  name: string;
  email: string;
  companyName: string;
  industry: string;
  voicePreference: VoicePreference;
  stage: AssessmentStage | null;
  mode: AssessmentMode | null;
  answers: { questionId: number; answerIndex: number; points: number }[];
  score: number;
  verdict: string;
  exposureMin: number;
  exposureMax: number;
  gapsCount: number;
  frameworks: string[];
  // Decision Volume fields
  decisionVolume?: number;
  decisionFrequency?: 'daily' | 'monthly' | 'yearly';
  useEstimate?: boolean;
  estimateUseCase?: string;
}

const initialData: AssessmentData = {
  name: '',
  email: '',
  companyName: '',
  industry: '',
  voicePreference: 'warm',
  stage: null,
  mode: null,
  answers: [],
  score: 0,
  verdict: '',
  exposureMin: 0,
  exposureMax: 0,
  gapsCount: 0,
  frameworks: [],
};

export default function Assess() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const stageFromUrl = searchParams.get('stage') as AssessmentStage | null;
  const { open: openROIPanel, updateData: updateROIData } = useROISlidePanel();
  
  const [step, setStep] = useState<AssessmentStep>('email');
  const [data, setData] = useState<AssessmentData>(() => ({
    ...initialData,
    // Pre-fill stage if coming from landing page cards
    stage: stageFromUrl && ['initial', 'monitoring', 'readiness'].includes(stageFromUrl) ? stageFromUrl : null,
  }));

  const updateData = (updates: Partial<AssessmentData>) => {
    setData(prev => ({ ...prev, ...updates }));
  };

  // Auto-open ROI panel during assessment after a delay
  useEffect(() => {
    const timer = setTimeout(() => {
      if (step === 'conversation' || step === 'evidence') {
        openROIPanel({ 
          trigger: 'assessment_progress',
          data: DEFAULT_SLIDE_DATA
        });
      }
    }, 5000);

    return () => clearTimeout(timer);
  }, [step, openROIPanel]);

  // Update ROI panel when assessment completes with real data
  useEffect(() => {
    if (step === 'results' && data.exposureMax > 0) {
      const avgExposure = (data.exposureMin + data.exposureMax) / 2;
      openROIPanel({
        trigger: 'assessment_complete',
        data: {
          exposureFound: avgExposure,
          findingsCount: data.gapsCount,
          estimatedSavings: avgExposure * 0.62, // 62% risk reduction
          fixInvestment: 125000,
          roi: (avgExposure * 0.62) / 125000,
          paybackMonth: 2,
        }
      });
    }
  }, [step, data.exposureMin, data.exposureMax, data.gapsCount, openROIPanel]);

  // Determine next step after email capture - skip stage selection if stage is pre-selected
  const handleEmailNext = () => {
    if (data.stage) {
      // Stage was pre-selected from landing page cards, go to decision volume
      setStep('decision-volume');
    } else {
      setStep('stage');
    }
  };

  // Handle stage selection → go to decision volume
  const handleStageNext = () => {
    setStep('decision-volume');
  };

  // Handle decision volume → go to conversation
  const handleDecisionVolumeNext = () => {
    setStep('conversation');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <PublicHeader />

      {/* Back Button */}
      <div className="container pt-4">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate('/')}
          className="text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>
      </div>

      {/* Content */}
      <main className="flex-1 flex items-center justify-center p-4">
        {step === 'email' && (
          <EmailCapture 
            data={data} 
            updateData={updateData} 
            onNext={handleEmailNext} 
          />
        )}
        {step === 'stage' && (
          <StageSelection 
            data={data} 
            updateData={updateData} 
            onNext={handleStageNext} 
          />
        )}
        {step === 'decision-volume' && (
          <DecisionVolumeStep
            data={data}
            updateData={updateData}
            onNext={handleDecisionVolumeNext}
            onBack={() => data.stage ? setStep('email') : setStep('stage')}
          />
        )}
        {step === 'conversation' && data.mode === 'voice' && (
          <VoiceConversation 
            data={data} 
            updateData={updateData} 
            onComplete={() => setStep('evidence')} 
          />
        )}
        {step === 'conversation' && data.mode === 'text' && (
          <ScoutConversation 
            data={data} 
            updateData={updateData} 
            onNext={() => setStep('evidence')} 
          />
        )}
        {step === 'conversation' && !data.mode && (
          <ScoutConversation 
            data={data} 
            updateData={updateData} 
            onNext={() => setStep('evidence')} 
          />
        )}
        {step === 'evidence' && (
          <EvidenceCollection
            data={data}
            updateData={updateData}
            onNext={() => setStep('analysis')}
            onSkip={() => setStep('analysis')}
          />
        )}
        {step === 'analysis' && (
          <AnalysisProgress 
            onComplete={() => setStep('results')} 
          />
        )}
        {step === 'results' && (
          <Results data={data} />
        )}
      </main>
    </div>
  );
}
