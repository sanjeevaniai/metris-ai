import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Mic, MicOff, Loader2 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { supabase } from '@/lib/supabase';
import type { AssessmentData } from '@/pages/Assess';
import { useROISlidePanel } from '@/hooks/useROISlidePanel';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionResultList {
  readonly length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionResult {
  readonly length: number;
  item(index: number): SpeechRecognitionAlternative;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  readonly transcript: string;
  readonly confidence: number;
}

interface SpeechRecognition extends EventTarget {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: Event) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
}

declare global {
  interface Window {
    webkitSpeechRecognition: new () => SpeechRecognition;
  }
}

interface Question {
  id: number;
  text: string;
  options: { label: string; points: number }[];
}

// Fallback questions if API fails
const fallbackQuestions: Question[] = [
  {
    id: 1,
    text: 'How many AI or ML systems does your organization currently have in production?',
    options: [
      { label: 'None yet — exploring', points: 1 },
      { label: '1-5 systems', points: 2 },
      { label: '6-20 systems', points: 2 },
      { label: '20+ systems', points: 3 },
      { label: "I don't know", points: 0 },
    ],
  },
  {
    id: 2,
    text: 'Do you have documented policies governing AI development and deployment?',
    options: [
      { label: 'Yes, comprehensive and reviewed regularly', points: 3 },
      { label: 'Some policies exist but incomplete', points: 2 },
      { label: 'No formal policies', points: 1 },
      { label: "I don't know", points: 0 },
    ],
  },
  {
    id: 3,
    text: 'Do you maintain a complete inventory of all AI systems?',
    options: [
      { label: 'Yes, fully documented and updated', points: 3 },
      { label: 'Partially — we know most but not all', points: 2 },
      { label: 'No formal inventory', points: 1 },
      { label: "I don't know", points: 0 },
    ],
  },
  {
    id: 4,
    text: 'How do you assess bias and fairness in your AI systems?',
    options: [
      { label: 'Regular automated testing with metrics', points: 3 },
      { label: 'Occasional manual review', points: 2 },
      { label: 'No formal assessment', points: 1 },
      { label: "I don't know", points: 0 },
    ],
  },
  {
    id: 5,
    text: 'Do you have human oversight mechanisms for high-risk AI decisions?',
    options: [
      { label: 'Yes, documented review processes', points: 3 },
      { label: 'For some systems only', points: 2 },
      { label: 'No formal oversight', points: 1 },
      { label: "I don't know", points: 0 },
    ],
  },
  {
    id: 6,
    text: 'Which frameworks are you targeting for compliance?',
    options: [
      { label: 'ISO 42001', points: 3 },
      { label: 'EU AI Act', points: 3 },
      { label: 'NIST AI RMF', points: 3 },
      { label: 'Not sure yet', points: 1 },
    ],
  },
];

const contextualResponses: Record<string, string> = {
  "I don't know": "That's actually a data point itself — many organizations have visibility gaps. We'll factor that into your score.",
  high: "Excellent. That's above average and will reflect positively in your NUMBERS.",
  medium: "Good foundation. Let's see how this affects your score and who's impacted.",
  low: "Understood. This helps us calculate both your risk in DOLLARS and the HUMANS affected.",
};

interface ScoutConversationProps {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  onNext: () => void;
}

export function ScoutConversation({ data, updateData, onNext }: ScoutConversationProps) {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [isLoadingQuestions, setIsLoadingQuestions] = useState(true);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResponse, setShowResponse] = useState(false);
  const [responseText, setResponseText] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [recognition, setRecognition] = useState<SpeechRecognition | null>(null);

  const isVoiceMode = data.mode === 'voice';
  const question = questions[currentQuestion];
  const progress = questions.length > 0 ? ((currentQuestion) / questions.length) * 100 : 0;

  // Get ROI panel updater
  const { updateData: updateROIData, open: openROIPanel, isOpen: isROIPanelOpen } = useROISlidePanel();

  // Fetch dynamic questions based on user context
  useEffect(() => {
    const fetchQuestions = async () => {
      setIsLoadingQuestions(true);
      try {
        const { data: responseData, error } = await supabase.functions.invoke('generate-assessment-questions', {
          body: {
            industry: data.industry,
            companyName: data.companyName,
            stage: data.stage,
          },
        });

        if (error) {
          console.error('Error fetching questions:', error);
          setQuestions(fallbackQuestions);
        } else if (responseData?.questions) {
          setQuestions(responseData.questions);
        } else {
          setQuestions(fallbackQuestions);
        }
      } catch (error) {
        console.error('Error fetching questions:', error);
        setQuestions(fallbackQuestions);
      } finally {
        setIsLoadingQuestions(false);
      }
    };

    fetchQuestions();
  }, [data.industry, data.companyName, data.stage]);

  // Initialize speech recognition
  useEffect(() => {
    if (isVoiceMode && 'webkitSpeechRecognition' in window && question) {
      const SpeechRecognition = window.webkitSpeechRecognition;
      const recognitionInstance = new SpeechRecognition();
      recognitionInstance.continuous = false;
      recognitionInstance.interimResults = false;
      recognitionInstance.lang = 'en-US';

      recognitionInstance.onresult = (event) => {
        const transcript = event.results[0][0].transcript.toLowerCase();
        // Try to match transcript to an option
        const matchedOption = question.options.findIndex(opt => 
          transcript.includes(opt.label.toLowerCase().slice(0, 10))
        );
        if (matchedOption !== -1) {
          handleAnswer(matchedOption, question.options[matchedOption].points);
        }
        setIsListening(false);
      };

      recognitionInstance.onerror = () => {
        setIsListening(false);
      };

      recognitionInstance.onend = () => {
        setIsListening(false);
      };

      setRecognition(recognitionInstance);
    }
  }, [isVoiceMode, currentQuestion, question]);

  // Text-to-speech for voice mode
  useEffect(() => {
    if (isVoiceMode && question && 'speechSynthesis' in window && !isLoadingQuestions) {
      const utterance = new SpeechSynthesisUtterance(question.text);
      utterance.rate = 0.9;
      utterance.onend = () => {
        // Start listening after speaking
        if (recognition) {
          setIsListening(true);
          recognition.start();
        }
      };
      window.speechSynthesis.speak(utterance);
    }

    return () => {
      if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    };
  }, [isVoiceMode, currentQuestion, recognition, isLoadingQuestions, question]);

  const handleAnswer = useCallback((answerIndex: number, points: number) => {
    if (!question) return;
    
    const answer = { questionId: question.id, answerIndex, points };
    const newAnswers = [...data.answers, answer];
    updateData({ answers: newAnswers });

    // Calculate running totals for real-time ROI updates
    const totalPoints = newAnswers.reduce((sum, a) => sum + a.points, 0);
    const progressRatio = newAnswers.length / questions.length;
    
    // Progressive exposure calculation based on answers so far
    const industryExposure: Record<string, { min: number; max: number }> = {
      Healthcare: { min: 2000000, max: 5000000 },
      Finance: { min: 3000000, max: 8000000 },
      Insurance: { min: 2000000, max: 6000000 },
      Technology: { min: 1000000, max: 4000000 },
      Manufacturing: { min: 1000000, max: 3000000 },
      Retail: { min: 500000, max: 2000000 },
      Other: { min: 500000, max: 2500000 },
    };
    const exposure = industryExposure[data.industry] || industryExposure.Other;
    const avgPoints = totalPoints / newAnswers.length;
    const riskMultiplier = avgPoints < 1.5 ? 1.5 : avgPoints < 2 ? 1.2 : avgPoints < 2.5 ? 1.0 : 0.5;
    
    // Calculate progressive exposure (scales up as more questions answered)
    const currentExposure = Math.round(((exposure.min + exposure.max) / 2) * riskMultiplier * progressRatio);
    const projectedFullExposure = Math.round(((exposure.min + exposure.max) / 2) * riskMultiplier);
    const estimatedSavings = Math.round(projectedFullExposure * 0.62); // 62% risk reduction
    const fixInvestment = 125000;
    const roi = estimatedSavings / fixInvestment;
    
    // Update ROI panel in real-time
    updateROIData({
      exposureFound: currentExposure,
      findingsCount: Math.round((1000 - (avgPoints / 3 * 400 + 450)) / 15 * progressRatio),
      estimatedSavings: Math.round(estimatedSavings * progressRatio),
      fixInvestment,
      roi: roi * progressRatio,
      paybackMonth: 2,
    });

    // Auto-open panel on first answer if not already open
    if (newAnswers.length === 1 && !isROIPanelOpen) {
      openROIPanel({ 
        trigger: 'assessment_progress',
        data: {
          exposureFound: currentExposure,
          findingsCount: 1,
          estimatedSavings: Math.round(estimatedSavings * progressRatio),
          fixInvestment,
          roi: roi * progressRatio,
          paybackMonth: 2,
        }
      });
    }

    // Show contextual response
    const option = question.options[answerIndex];
    let response = contextualResponses.low;
    if (option.label.toLowerCase().includes("don't know")) {
      response = contextualResponses["I don't know"];
    } else if (points >= 3) {
      response = contextualResponses.high;
    } else if (points >= 2) {
      response = contextualResponses.medium;
    }

    setResponseText(response);
    setShowResponse(true);

    setTimeout(() => {
      setShowResponse(false);
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Calculate final score
        const finalMaxPoints = questions.length * 3;
        const baseScore = Math.round((totalPoints / finalMaxPoints) * 400 + 450);
        const variance = Math.floor(Math.random() * 30) - 15;
        const score = Math.max(450, Math.min(850, baseScore + variance));

        // Determine tier (NO BINARY PASS/FAIL)
        let tier = 'WEAK';
        if (score >= 900) tier = 'EXEMPLARY';
        else if (score >= 750) tier = 'STRONG';
        else if (score >= 600) tier = 'MODERATE';
        else if (score >= 400) tier = 'WEAK';
        else tier = 'CRITICAL';

        // Final exposure calculation
        const finalRiskMultiplier = tier === 'CRITICAL' ? 1.5 : tier === 'WEAK' ? 1.2 : tier === 'MODERATE' ? 1.0 : 0.5;

        // Calculate gaps
        const gapsCount = Math.max(10, Math.round((1000 - score) / 15) + Math.floor(Math.random() * 10) - 5);

        updateData({
          score,
          verdict: tier,
          exposureMin: Math.round(exposure.min * finalRiskMultiplier),
          exposureMax: Math.round(exposure.max * finalRiskMultiplier),
          gapsCount,
        });

        onNext();
      }
    }, 2000);
  }, [currentQuestion, data.answers, data.industry, updateData, onNext, question, questions.length, updateROIData, openROIPanel, isROIPanelOpen]);

  const toggleListening = () => {
    if (!recognition) return;
    
    if (isListening) {
      recognition.stop();
      setIsListening(false);
    } else {
      setIsListening(true);
      recognition.start();
    }
  };

  const switchMode = () => {
    updateData({ mode: isVoiceMode ? 'text' : 'voice' });
    if (recognition) recognition.stop();
    setIsListening(false);
  };

  // Loading state while generating questions
  if (isLoadingQuestions) {
    return (
      <div className="w-full max-w-2xl">
        <div className="card-terminal p-8 rounded-lg text-center">
          <Loader2 className="w-12 h-12 mx-auto mb-4 animate-spin text-primary" />
          <p className="font-semibold text-primary mb-2">Scout AI</p>
          <p className="text-muted-foreground">
            Generating personalized assessment questions for {data.companyName || 'your organization'} in the {data.industry} sector...
          </p>
        </div>
      </div>
    );
  }

  if (!question) {
    return null;
  }

  return (
    <div className="w-full max-w-2xl">
      {/* Progress Bar */}
      <div className="flex items-center gap-4 mb-6">
        <span className="text-sm text-muted-foreground">
          Question {currentQuestion + 1} of {questions.length}
        </span>
        <Progress value={progress} className="flex-1 h-2" />
      </div>

      {/* Voice Mode Display */}
      {isVoiceMode ? (
        <div className="card-terminal p-8 rounded-lg text-center">
          <p className="font-semibold text-primary mb-4">Scout AI</p>
          
          {/* Pulsing Animation */}
          <div className="w-24 h-24 mx-auto mb-6 relative">
            <div className={`absolute inset-0 rounded-full bg-primary/20 ${isListening ? 'animate-ping' : ''}`} />
            <div className="absolute inset-2 rounded-full bg-primary/30" />
            <div className="absolute inset-4 rounded-full bg-primary/40 flex items-center justify-center">
              {isListening ? (
                <Mic className="w-8 h-8 text-primary" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-primary" />
              )}
            </div>
          </div>

          <p className="text-lg mb-8">{question.text}</p>

          {showResponse ? (
            <p className="text-muted-foreground italic">{responseText}</p>
          ) : (
            <>
              <p className="text-sm text-muted-foreground mb-4">
                {isListening ? 'Listening...' : 'Click to speak'}
              </p>
              
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={toggleListening}
                  className={isListening ? 'bg-primary text-primary-foreground' : ''}
                >
                  {isListening ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
                </Button>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          {/* Text Mode - Scout Message */}
          <div className="card-terminal p-6 rounded-lg mb-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center flex-shrink-0">
                <span className="text-primary font-mono text-sm">AI</span>
              </div>
              <div>
                <p className="font-semibold text-primary mb-2">Scout AI</p>
                {showResponse ? (
                  <>
                    <p className="text-muted-foreground italic mb-4">{responseText}</p>
                    <p className="text-foreground">Next question...</p>
                  </>
                ) : (
                  <p className="text-foreground">{question.text}</p>
                )}
              </div>
            </div>
          </div>

          {/* Answer Options */}
          {!showResponse && (
            <div className="card-terminal p-6 rounded-lg space-y-3">
              {question.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswer(index, option.points)}
                  className="w-full text-left p-4 rounded-lg border border-border hover:border-primary/50 hover:bg-secondary transition-colors group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-4 h-4 rounded-full border-2 border-muted-foreground group-hover:border-primary transition-colors" />
                    <span>{option.label}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
        </>
      )}

      {/* Switch Mode */}
      <div className="mt-6 text-center">
        <button 
          onClick={switchMode}
          className="text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          Switch to {isVoiceMode ? 'Text' : 'Voice'}
        </button>
      </div>
    </div>
  );
}
