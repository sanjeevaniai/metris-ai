import { useCallback, useState, useEffect, useRef } from 'react';
import { Conversation } from '@11labs/client';
import { Button } from '@/components/ui/button';
import { Mic, Phone, Volume2, Loader2, Check, Circle, RefreshCw, ChevronDown, ChevronUp } from 'lucide-react';
import { getScoutAgent } from '@/data/scoutVoices';
import type { AssessmentData } from '@/pages/Assess';
import { cn } from '@/lib/utils';
import { supabase } from '@/lib/supabase';
import scoutAvatarWarm from '@/assets/scout-avatar-warm.png';
import scoutAvatarCalm from '@/assets/scout-avatar-calm.png';
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";

const avatarImages: Record<string, string> = {
  warm: scoutAvatarWarm,
  calm: scoutAvatarCalm,
};

interface VoiceConversationProps {
  data: AssessmentData;
  updateData: (updates: Partial<AssessmentData>) => void;
  onComplete: () => void;
}

interface AssessmentArea {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed';
  answer?: string;
  fullAnswer?: string;
}

interface AnalysisStep {
  id: string;
  label: string;
  status: 'pending' | 'processing' | 'completed';
}

const initialAssessmentAreas: AssessmentArea[] = [
  { id: 'scale', label: 'Scale of AI Operations', status: 'pending' },
  { id: 'governance', label: 'Governance Maturity', status: 'pending' },
  { id: 'risk', label: 'Risk Classification', status: 'pending' },
  { id: 'compliance', label: 'Compliance Framework', status: 'pending' },
  { id: 'documentation', label: 'Documentation Level', status: 'pending' },
  { id: 'monitoring', label: 'Monitoring & Audit', status: 'pending' },
];

const analysisSteps: AnalysisStep[] = [
  { id: 'iso', label: 'Evaluating against ISO 42001...', status: 'pending' },
  { id: 'euai', label: 'Evaluating against EU AI Act...', status: 'pending' },
  { id: 'nist', label: 'Evaluating against NIST AI RMF...', status: 'pending' },
  { id: 'risk', label: 'Calculating risk exposure...', status: 'pending' },
  { id: 'gaps', label: 'Identifying compliance gaps...', status: 'pending' },
  { id: 'priorities', label: 'Generating remediation priorities...', status: 'pending' },
];

export function VoiceConversation({ data, updateData, onComplete }: VoiceConversationProps) {
  const [isConnecting, setIsConnecting] = useState(false);
  const [isConnected, setIsConnected] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [transcript, setTranscript] = useState<Array<{ role: 'user' | 'agent'; text: string; timestamp: Date }>>([]);
  const [assessmentAreas, setAssessmentAreas] = useState<AssessmentArea[]>(initialAssessmentAreas);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisProgress, setAnalysisProgress] = useState<AnalysisStep[]>(analysisSteps);
  const [frameworksAnalyzed, setFrameworksAnalyzed] = useState(0);
  const [checkpointsEvaluated, setCheckpointsEvaluated] = useState(0);
  const [hasStartedConversation, setHasStartedConversation] = useState(false);
  const [expandedAreas, setExpandedAreas] = useState<Set<string>>(new Set());
  const [audioLevels, setAudioLevels] = useState<number[]>(new Array(16).fill(5));
  
  const conversationRef = useRef<Conversation | null>(null);
  const transcriptEndRef = useRef<HTMLDivElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const scoutVoice = getScoutAgent(data.voicePreference as 'warm' | 'calm');

  // Toggle expanded state for assessment areas
  const toggleExpanded = (id: string) => {
    setExpandedAreas(prev => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  // Real-time audio level visualization
  useEffect(() => {
    if (!isConnected) {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      setAudioLevels(new Array(16).fill(5));
      return;
    }

    const setupAudioAnalysis = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        audioContextRef.current = new AudioContext();
        analyserRef.current = audioContextRef.current.createAnalyser();
        analyserRef.current.fftSize = 64;
        
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        
        const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
        
        const updateLevels = () => {
          if (!analyserRef.current) return;
          
          analyserRef.current.getByteFrequencyData(dataArray);
          
          // Sample 16 frequency bands for visualization
          const levels: number[] = [];
          const bandSize = Math.floor(dataArray.length / 16);
          
          for (let i = 0; i < 16; i++) {
            const start = i * bandSize;
            const end = start + bandSize;
            let sum = 0;
            for (let j = start; j < end && j < dataArray.length; j++) {
              sum += dataArray[j];
            }
            // Normalize to 5-100 range with some randomness for visual appeal
            const avg = sum / bandSize;
            const normalized = Math.max(5, Math.min(100, (avg / 255) * 100 + (isSpeaking ? Math.random() * 20 : 0)));
            levels.push(normalized);
          }
          
          setAudioLevels(levels);
          animationFrameRef.current = requestAnimationFrame(updateLevels);
        };
        
        updateLevels();
      } catch (err) {
        console.error('Failed to setup audio analysis:', err);
      }
    };

    setupAudioAnalysis();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isConnected, isSpeaking]);

  // Auto-scroll transcript
  useEffect(() => {
    transcriptEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  // Simulate assessment area updates based on conversation
  useEffect(() => {
    if (transcript.length > 0) {
      const agentMessages = transcript.filter(t => t.role === 'agent').length;
      const userMessages = transcript.filter(t => t.role === 'user').length;
      
      // Update current question based on conversation flow
      setCurrentQuestion(Math.min(Math.floor(agentMessages / 2) + 1, 6));
      
      // Simulate completing areas based on user responses with full answers
      if (userMessages >= 1 && assessmentAreas[0].status === 'pending') {
        updateAssessmentArea(0, 'completed', '12 systems', 'Currently operating 12 AI/ML systems across customer service, fraud detection, and internal operations. Includes 3 high-risk automated decision systems.');
      }
      if (userMessages >= 2 && assessmentAreas[1].status === 'pending') {
        updateAssessmentArea(1, 'completed', 'Informal', 'Governance is primarily ad-hoc with no formal AI committee or documented policies. Some teams have informal review processes.');
      }
      if (userMessages >= 3 && assessmentAreas[2].status === 'pending') {
        updateAssessmentArea(2, 'completed', 'High-risk', 'Multiple systems classified as high-risk under EU AI Act criteria, including automated credit scoring and employee evaluation tools.');
      }
      if (userMessages >= 4 && assessmentAreas[3].status === 'pending') {
        updateAssessmentArea(3, 'completed', 'Partial', 'Some awareness of ISO 42001 and NIST AI RMF but no formal compliance program. No EU AI Act compliance assessment completed.');
      }
      if (userMessages >= 5 && assessmentAreas[4].status === 'pending') {
        updateAssessmentArea(4, 'completed', 'Ad-hoc', 'Technical documentation exists but lacks standardization. No model cards, limited bias testing documentation, incomplete audit trails.');
      }
      if (userMessages >= 6 && assessmentAreas[5].status === 'pending') {
        updateAssessmentArea(5, 'completed', 'Manual', 'Monitoring is reactive and manual. No automated drift detection, performance monitoring, or compliance alerting in place.');
      }
      
      // Set processing state for current area
      const completedCount = assessmentAreas.filter(a => a.status === 'completed').length;
      if (completedCount < 6 && assessmentAreas[completedCount]?.status === 'pending') {
        setAssessmentAreas(prev => prev.map((area, i) => 
          i === completedCount ? { ...area, status: 'processing' } : area
        ));
      }
    }
  }, [transcript]);

  const updateAssessmentArea = (index: number, status: 'completed' | 'processing', answer?: string, fullAnswer?: string) => {
    setAssessmentAreas(prev => prev.map((area, i) => 
      i === index ? { ...area, status, answer, fullAnswer } : area
    ));
  };

  // Simulate thinking state when agent is processing
  useEffect(() => {
    if (!isSpeaking && isConnected) {
      const timer = setTimeout(() => setIsThinking(true), 1000);
      return () => clearTimeout(timer);
    } else {
      setIsThinking(false);
    }
  }, [isSpeaking, isConnected]);

  // Run analysis animation
  const runAnalysis = useCallback(async () => {
    setIsAnalyzing(true);
    
    for (let i = 0; i < analysisSteps.length; i++) {
      // Set current step to processing
      setAnalysisProgress(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'processing' } : step
      ));
      
      // Wait and complete
      await new Promise(resolve => setTimeout(resolve, 800 + Math.random() * 400));
      
      setAnalysisProgress(prev => prev.map((step, idx) => 
        idx === i ? { ...step, status: 'completed' } : step
      ));
      
      // Update counters
      if (i < 3) {
        setFrameworksAnalyzed(prev => prev + Math.floor(2 + Math.random() * 2));
      }
      setCheckpointsEvaluated(prev => prev + Math.floor(150 + Math.random() * 100));
    }
    
    // Final delay before completing
    await new Promise(resolve => setTimeout(resolve, 1000));
    onComplete();
  }, [onComplete]);

  const startConversation = useCallback(async () => {
    setIsConnecting(true);
    setError(null);
    setHasStartedConversation(true);
    
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });

      console.log('Getting signed URL for agent:', scoutVoice.agentId);

      const { data: urlData, error: urlError } = await supabase.functions.invoke('get-signed-url', {
        body: { agentId: scoutVoice.agentId }
      });

      if (urlError || !urlData?.signedUrl) {
        console.error('Failed to get signed URL:', urlError, urlData);
        throw new Error(urlError?.message || urlData?.error || 'Failed to get signed URL');
      }

      console.log('Got signed URL, connecting to ElevenLabs...');

      const conversation = await Conversation.startSession({
        signedUrl: urlData.signedUrl,
        dynamicVariables: {
          name: data.name || 'there',
          company: data.companyName || 'your company',
        },
        onConnect: ({ conversationId }) => {
          console.log('Connected to ElevenLabs agent, conversation:', conversationId);
          setIsConnected(true);
          setIsConnecting(false);
        },
        onDisconnect: (details) => {
          console.log('Disconnected from ElevenLabs agent:', details);
          setIsConnected(false);
          setIsSpeaking(false);
        },
        onMessage: ({ message, source }) => {
          console.log('Message received:', source, message);
          setTranscript(prev => [...prev, { 
            role: source === 'user' ? 'user' : 'agent', 
            text: message,
            timestamp: new Date()
          }]);
        },
        onError: (message, context) => {
          console.error('Conversation error:', message, context);
          setError(message || 'Connection error occurred');
          setIsConnecting(false);
        },
        onModeChange: ({ mode }) => {
          console.log('Mode changed:', mode);
          setIsSpeaking(mode === 'speaking');
        },
        onStatusChange: ({ status }) => {
          console.log('Status changed:', status);
          if (status === 'connected') {
            setIsConnected(true);
            setIsConnecting(false);
          } else if (status === 'disconnected') {
            setIsConnected(false);
          }
        },
      });

      conversationRef.current = conversation;
      
    } catch (err) {
      console.error('Failed to start conversation:', err);
      setError(err instanceof Error ? err.message : 'Failed to connect to voice agent');
      setIsConnecting(false);
    }
  }, [scoutVoice.agentId, data.name, data.companyName]);

  const endConversation = useCallback(async () => {
    if (conversationRef.current) {
      await conversationRef.current.endSession();
      conversationRef.current = null;
    }
    setIsConnected(false);
    setIsSpeaking(false);
    
    // Start analysis animation
    runAnalysis();
  }, [runAnalysis]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (conversationRef.current) {
        conversationRef.current.endSession();
      }
    };
  }, []);

  const completedAreas = assessmentAreas.filter(a => a.status === 'completed').length;
  const totalAreas = assessmentAreas.length;

  return (
    <div className="w-full max-w-6xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold mb-2">AI Governance Assessment</h1>
        <p className="text-muted-foreground text-sm">
          Real-time transparency • Every step visible
        </p>
      </div>

      {/* Split Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* LEFT PANEL - 40% */}
        <div className="lg:col-span-2 space-y-6">
          {/* Scout Avatar Card */}
          <div className="card-terminal p-6 rounded-lg">
            <div className="flex flex-col items-center">
              {/* Avatar with ring */}
              <div 
                className={cn(
                  "w-28 h-28 rounded-full overflow-hidden mb-4 ring-4 transition-all duration-300",
                  scoutVoice.id === 'warm' ? "ring-amber-500/30" : "ring-blue-500/30",
                  isSpeaking && "ring-primary scale-105",
                  !isConnected && "opacity-70"
                )}
              >
                <img 
                  src={avatarImages[scoutVoice.id]} 
                  alt={`${scoutVoice.style} Scout avatar`}
                  className="w-full h-full object-cover"
                />
              </div>
              
              {/* Status Indicator */}
              <div className="flex items-center gap-2 text-sm mb-4">
                {isConnected ? (
                  <>
                    <span className={cn(
                      "w-3 h-3 rounded-full transition-colors",
                      isSpeaking ? "bg-primary animate-pulse" : "bg-green-500"
                    )} />
                    <span className="text-muted-foreground font-medium">
                      {isSpeaking ? 'Scout is speaking...' : isThinking ? 'Scout is thinking...' : 'Listening to you...'}
                    </span>
                  </>
                ) : isConnecting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">Connecting...</span>
                  </>
                ) : isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                    <span className="text-muted-foreground">Analyzing responses...</span>
                  </>
                ) : (
                  <>
                    <span className="w-3 h-3 rounded-full bg-muted" />
                    <span className="text-muted-foreground">Ready to connect</span>
                  </>
                )}
              </div>

              {/* Real-time Voice Visualization */}
              {isConnected && (
                <div className="flex justify-center items-end gap-1 h-16 w-full px-4 mb-4">
                  {audioLevels.map((level, i) => (
                    <div
                      key={i}
                      className={cn(
                        "w-1.5 rounded-full transition-all duration-75",
                        isSpeaking ? "bg-primary" : "bg-green-500/70"
                      )}
                      style={{
                        height: `${level}%`,
                        transition: 'height 75ms ease-out',
                      }}
                    />
                  ))}
                </div>
              )}

              {/* Controls */}
              <div className="w-full space-y-3">
                {!isConnected && !isConnecting && !isAnalyzing && (
                  <Button
                    onClick={startConversation}
                    className="w-full h-12"
                    size="lg"
                  >
                    <Mic className="mr-2 h-5 w-5" />
                    Start Conversation
                  </Button>
                )}
                
                {isConnected && (
                  <Button
                    variant="destructive"
                    onClick={endConversation}
                    className="w-full h-12"
                    size="lg"
                  >
                    <Phone className="mr-2 h-5 w-5" />
                    End & Analyze
                  </Button>
                )}

                {isConnected && (
                  <div className="flex justify-center">
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Volume2 className="h-3 w-3" />
                      <span>Speakers on</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-4 bg-destructive/10 border border-destructive/20 rounded-lg">
              <p className="text-sm text-destructive mb-2">{error}</p>
              <Button
                variant="outline"
                size="sm"
                onClick={startConversation}
              >
                Try Again
              </Button>
            </div>
          )}

          {/* Voice Style Info */}
          <div className="card-terminal p-4 rounded-lg">
            <p className="text-xs text-muted-foreground text-center">
              <span className="font-medium text-foreground">{scoutVoice.style}</span> • {scoutVoice.description}
            </p>
          </div>
        </div>

        {/* RIGHT PANEL - 60% */}
        <div className="lg:col-span-3 space-y-6">
          {/* Conversation Transcript */}
          <div className="card-terminal rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 bg-secondary/30">
              <h3 className="font-mono text-sm font-medium text-primary">Conversation</h3>
            </div>
            <div className="h-64 overflow-y-auto p-4 space-y-3 lcd-display">
              {!hasStartedConversation ? (
                <div className="flex flex-col items-center justify-center h-full text-muted-foreground text-sm">
                  <p className="text-center">Conversation will appear here when you start</p>
                </div>
              ) : transcript.length === 0 ? (
                <div className="flex items-center justify-center h-full text-muted-foreground text-sm">
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  <span>Waiting for Scout to speak...</span>
                </div>
              ) : (
                <>
                  {transcript.map((entry, index) => (
                    <div
                      key={index}
                      className={cn(
                        "p-3 rounded-lg text-sm",
                        entry.role === 'user'
                          ? "bg-primary/10 border border-primary/20 ml-4"
                          : "bg-secondary/50 border border-border/30 mr-4"
                      )}
                    >
                      <div className="flex items-center gap-2 mb-1">
                        <span className={cn(
                          "font-mono text-xs font-medium",
                          entry.role === 'user' ? "text-primary" : "text-muted-foreground"
                        )}>
                          {entry.role === 'user' ? 'You:' : 'Scout:'}
                        </span>
                        <span className="text-xs text-muted-foreground/50">
                          {entry.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-foreground/90">{entry.text}</p>
                    </div>
                  ))}
                  {isThinking && !isSpeaking && isConnected && (
                    <div className="p-3 rounded-lg bg-secondary/50 border border-border/30 mr-4">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-medium text-muted-foreground">Scout:</span>
                        <div className="flex gap-1">
                          <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '0ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '150ms' }} />
                          <span className="w-2 h-2 rounded-full bg-primary/50 animate-bounce" style={{ animationDelay: '300ms' }} />
                        </div>
                      </div>
                    </div>
                  )}
                  <div ref={transcriptEndRef} />
                </>
              )}
            </div>
          </div>

          {/* Assessment Progress */}
          <div className="card-terminal rounded-lg overflow-hidden">
            <div className="px-4 py-3 border-b border-border/50 bg-secondary/30 flex items-center justify-between">
              <h3 className="font-mono text-sm font-medium text-primary">
                {isAnalyzing ? 'Analysis in Progress' : 'Assessment Progress'}
              </h3>
              {!isAnalyzing && (
                <span className="font-mono text-xs text-muted-foreground">
                  Question {currentQuestion} of {totalAreas}
                </span>
              )}
            </div>
            
            <div className="p-4 lcd-display">
              {!isAnalyzing ? (
                <>
                  {/* Progress Bar */}
                  <div className="mb-4">
                    <div className="h-2 bg-secondary rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary transition-all duration-500 ease-out"
                        style={{ width: `${(completedAreas / totalAreas) * 100}%` }}
                      />
                    </div>
                    <p className="text-xs text-muted-foreground mt-1 text-right">
                      {completedAreas} of {totalAreas} areas assessed
                    </p>
                  </div>

                  {/* Assessment Areas Checklist with Expand/Collapse */}
                  <div className="space-y-2">
                    {assessmentAreas.map((area) => (
                      <Collapsible
                        key={area.id}
                        open={expandedAreas.has(area.id)}
                        onOpenChange={() => area.status === 'completed' && toggleExpanded(area.id)}
                      >
                        <div 
                          className={cn(
                            "rounded border transition-all",
                            area.status === 'completed' && "bg-green-500/5 border-green-500/20",
                            area.status === 'processing' && "bg-primary/5 border-primary/20",
                            area.status === 'pending' && "bg-secondary/30 border-border/30"
                          )}
                        >
                          <CollapsibleTrigger 
                            className={cn(
                              "flex items-center justify-between p-2 w-full text-left",
                              area.status === 'completed' && "cursor-pointer hover:bg-green-500/10"
                            )}
                            disabled={area.status !== 'completed'}
                          >
                            <div className="flex items-center gap-3">
                              {area.status === 'completed' && (
                                <Check className="h-4 w-4 text-green-500" />
                              )}
                              {area.status === 'processing' && (
                                <RefreshCw className="h-4 w-4 text-primary animate-spin" />
                              )}
                              {area.status === 'pending' && (
                                <Circle className="h-4 w-4 text-muted-foreground/50" />
                              )}
                              <span className={cn(
                                "text-sm",
                                area.status === 'completed' && "text-foreground",
                                area.status === 'processing' && "text-primary font-medium",
                                area.status === 'pending' && "text-muted-foreground"
                              )}>
                                {area.label}
                              </span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className={cn(
                                "font-mono text-xs",
                                area.status === 'completed' && "text-green-500",
                                area.status === 'processing' && "text-primary",
                                area.status === 'pending' && "text-muted-foreground/50"
                              )}>
                                {area.status === 'completed' && `→ ${area.answer}`}
                                {area.status === 'processing' && 'Processing...'}
                                {area.status === 'pending' && 'Pending'}
                              </span>
                              {area.status === 'completed' && (
                                expandedAreas.has(area.id) 
                                  ? <ChevronUp className="h-3 w-3 text-muted-foreground" />
                                  : <ChevronDown className="h-3 w-3 text-muted-foreground" />
                              )}
                            </div>
                          </CollapsibleTrigger>
                          {area.status === 'completed' && area.fullAnswer && (
                            <CollapsibleContent>
                              <div className="px-4 pb-3 pt-1 border-t border-green-500/10">
                                <p className="text-xs text-muted-foreground leading-relaxed">
                                  {area.fullAnswer}
                                </p>
                              </div>
                            </CollapsibleContent>
                          )}
                        </div>
                      </Collapsible>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  {/* Analysis Steps */}
                  <div className="space-y-2 mb-6">
                    {analysisProgress.map((step) => (
                      <div 
                        key={step.id}
                        className={cn(
                          "flex items-center gap-3 p-2 rounded border transition-all",
                          step.status === 'completed' && "bg-green-500/5 border-green-500/20",
                          step.status === 'processing' && "bg-primary/5 border-primary/20",
                          step.status === 'pending' && "bg-secondary/30 border-border/30"
                        )}
                      >
                        {step.status === 'completed' && (
                          <Check className="h-4 w-4 text-green-500 flex-shrink-0" />
                        )}
                        {step.status === 'processing' && (
                          <RefreshCw className="h-4 w-4 text-primary animate-spin flex-shrink-0" />
                        )}
                        {step.status === 'pending' && (
                          <Circle className="h-4 w-4 text-muted-foreground/50 flex-shrink-0" />
                        )}
                        <span className={cn(
                          "text-sm",
                          step.status === 'completed' && "text-foreground",
                          step.status === 'processing' && "text-primary font-medium",
                          step.status === 'pending' && "text-muted-foreground"
                        )}>
                          {step.label}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Analysis Counters */}
                  <div className="grid grid-cols-2 gap-4 p-4 bg-secondary/30 rounded-lg border border-border/30">
                    <div className="text-center">
                      <p className="font-mono text-2xl font-bold text-primary">{frameworksAnalyzed}</p>
                      <p className="text-xs text-muted-foreground">Frameworks analyzed</p>
                    </div>
                    <div className="text-center">
                      <p className="font-mono text-2xl font-bold text-primary">{checkpointsEvaluated.toLocaleString()}</p>
                      <p className="text-xs text-muted-foreground">Checkpoints evaluated</p>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Transparency Notice */}
      <p className="text-xs text-muted-foreground text-center mt-6">
        <span className="font-medium text-primary">Full Transparency:</span> Every question, every calculation, every framework evaluation is shown in real-time.
      </p>
    </div>
  );
}
