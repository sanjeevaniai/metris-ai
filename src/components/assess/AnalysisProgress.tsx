import { useState, useEffect, useRef, useCallback } from 'react';
import { Check, FileText, Globe, Package, Loader2, Volume2, VolumeX, BarChart3 } from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import scoutMascot from '@/assets/scout-mascot.png';
import { 
  ANALYSIS_AGENTS, 
  TOTAL_CHECKPOINTS, 
  SAMPLE_FINDINGS,
  type Finding 
} from '@/data/analysisAgents';
import { useAnalysisSounds } from '@/hooks/useAnalysisSounds';
import { LiveAssessmentBubbleChart } from '@/components/visualizations/LiveAssessmentBubbleChart';

interface AnalysisProgressProps {
  onComplete: () => void;
  evidenceData?: {
    documents: number;
    website: boolean;
    github: boolean;
  };
}

export function AnalysisProgress({ onComplete, evidenceData }: AnalysisProgressProps) {
  const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
  const [agentProgress, setAgentProgress] = useState(0);
  const [findings, setFindings] = useState<Finding[]>([]);
  const [completedCheckpoints, setCompletedCheckpoints] = useState(0);
  const [gaps, setGaps] = useState({ major: 0, minor: 0, ofi: 0 });
  const [confidence, setConfidence] = useState(0);
  const [isTransitioning, setIsTransitioning] = useState(false);
  const [badgeGlow, setBadgeGlow] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [showBubbleChart, setShowBubbleChart] = useState(false);
  const findingsRef = useRef<HTMLDivElement>(null);
  const hasPlayedCompletionRef = useRef(false);
  
  const { playFindingSound, playAgentComplete, playCompletionChime } = useAnalysisSounds();

  const currentAgent = ANALYSIS_AGENTS[currentAgentIndex];
  const overallProgress = Math.round((currentAgentIndex / ANALYSIS_AGENTS.length) * 100);
  const estimatedMinutes = Math.max(1, Math.round((ANALYSIS_AGENTS.length - currentAgentIndex) * 0.16));

  // Wrapped sound functions that respect soundEnabled
  const playSoundIfEnabled = useCallback((type: Finding['type']) => {
    if (soundEnabled) {
      playFindingSound(type);
    }
  }, [soundEnabled, playFindingSound]);

  const playAgentCompleteIfEnabled = useCallback(() => {
    if (soundEnabled) {
      playAgentComplete();
    }
  }, [soundEnabled, playAgentComplete]);

  const playCompletionChimeIfEnabled = useCallback(() => {
    if (soundEnabled && !hasPlayedCompletionRef.current) {
      hasPlayedCompletionRef.current = true;
      playCompletionChime();
    }
  }, [soundEnabled, playCompletionChime]);

  // Agent progress simulation
  useEffect(() => {
    if (currentAgentIndex >= ANALYSIS_AGENTS.length) {
      playCompletionChimeIfEnabled();
      // Delay onComplete to let the chime play
      const completeTimeout = setTimeout(() => {
        onComplete();
      }, 1500);
      return () => clearTimeout(completeTimeout);
    }

    const agent = ANALYSIS_AGENTS[currentAgentIndex];
    const agentFindings = SAMPLE_FINDINGS[agent.id] || [];
    let findingIndex = 0;

    // Progress bar animation
    const progressInterval = setInterval(() => {
      setAgentProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2;
      });
    }, 50);

    // Add findings one by one
    const findingInterval = setInterval(() => {
      if (findingIndex < agentFindings.length) {
        const finding = agentFindings[findingIndex];
        setFindings(prev => [...prev, finding]);
        
        // Play sound for the finding
        playSoundIfEnabled(finding.type);
        
        // Update gap counts
        if (finding.type === 'gap-major') {
          setGaps(prev => ({ ...prev, major: prev.major + 1 }));
          setBadgeGlow(true);
          setTimeout(() => setBadgeGlow(false), 500);
        } else if (finding.type === 'gap-minor') {
          setGaps(prev => ({ ...prev, minor: prev.minor + 1 }));
        } else if (finding.type === 'ofi') {
          setGaps(prev => ({ ...prev, ofi: prev.ofi + 1 }));
        }

        findingIndex++;
      }
    }, 600);

    // Update checkpoints
    const checkpointInterval = setInterval(() => {
      setCompletedCheckpoints(prev => {
        const target = ANALYSIS_AGENTS.slice(0, currentAgentIndex + 1)
          .reduce((sum, a) => sum + a.checkpoints, 0);
        if (prev >= target) return target;
        return prev + Math.ceil(agent.checkpoints / 20);
      });
    }, 100);

    // Update confidence
    const confidenceInterval = setInterval(() => {
      setConfidence(prev => {
        const target = Math.min(92, 50 + (currentAgentIndex / ANALYSIS_AGENTS.length) * 42);
        if (prev >= target) return target;
        return prev + 0.5;
      });
    }, 100);

    // Move to next agent
    const nextAgentTimeout = setTimeout(() => {
      setIsTransitioning(true);
      playAgentCompleteIfEnabled();
      setTimeout(() => {
        setAgentProgress(0);
        setFindings([]);
        setCurrentAgentIndex(prev => prev + 1);
        setIsTransitioning(false);
      }, 400);
    }, 3500);

    return () => {
      clearInterval(progressInterval);
      clearInterval(findingInterval);
      clearInterval(checkpointInterval);
      clearInterval(confidenceInterval);
      clearTimeout(nextAgentTimeout);
    };
  }, [currentAgentIndex, onComplete, playSoundIfEnabled, playAgentCompleteIfEnabled, playCompletionChimeIfEnabled]);

  // Auto-scroll findings
  useEffect(() => {
    if (findingsRef.current) {
      findingsRef.current.scrollTop = findingsRef.current.scrollHeight;
    }
  }, [findings]);

  const getFindingIcon = (type: Finding['type']) => {
    switch (type) {
      case 'pass':
        return <Check className="w-4 h-4 text-emerald-400" />;
      case 'gap-major':
        return <span className="text-red-400 text-sm">⚠️</span>;
      case 'gap-minor':
        return <span className="text-amber-400 text-sm">⚠️</span>;
      case 'ofi':
        return <span className="text-blue-400 text-sm">💡</span>;
      case 'examining':
        return <Loader2 className="w-4 h-4 text-cyan-400 animate-spin" />;
    }
  };

  const getFindingClass = (type: Finding['type']) => {
    switch (type) {
      case 'pass':
        return 'text-emerald-400';
      case 'gap-major':
        return 'text-red-400';
      case 'gap-minor':
        return 'text-amber-400';
      case 'ofi':
        return 'text-blue-400';
      case 'examining':
        return 'text-cyan-400';
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 lg:p-6">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-2xl lg:text-3xl font-bold mb-2">
          Scout is Analyzing Your AI Governance
        </h1>
        <p className="text-muted-foreground mb-4">
          25 specialized agents • {TOTAL_CHECKPOINTS.toLocaleString()} checkpoints • Your evidence
        </p>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 text-sm mb-4">
          <span className="text-emerald-400">Intake ✓</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-emerald-400">Evidence ✓</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-cyan-400 font-medium">Analysis</span>
          <span className="text-muted-foreground">→</span>
          <span className="text-muted-foreground">Results</span>
        </div>

        {/* Overall Progress */}
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <span>
            Agent {currentAgentIndex + 1} of {ANALYSIS_AGENTS.length} • {overallProgress}% complete • ~{estimatedMinutes} min remaining
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSoundEnabled(!soundEnabled)}
            className="h-8 w-8 p-0"
            title={soundEnabled ? "Mute sounds" : "Enable sounds"}
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4" />
            ) : (
              <VolumeX className="h-4 w-4 text-muted-foreground" />
            )}
          </Button>
          <Button
            variant={showBubbleChart ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setShowBubbleChart(!showBubbleChart)}
            className="h-8 px-3"
            title="Toggle visualization view"
          >
            <BarChart3 className="h-4 w-4 mr-1" />
            <span className="text-xs">Viz</span>
          </Button>
        </div>
      </div>

      {/* Bubble Chart Visualization */}
      {showBubbleChart && (
        <div className="mb-8 p-6 lcd-display">
          <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-cyan-400" />
            Live Assessment Visualization
          </h3>
          <LiveAssessmentBubbleChart
            currentAgentIndex={currentAgentIndex}
            agentProgress={agentProgress}
            gaps={gaps}
          />
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr,280px] gap-6">
        {/* Main Section */}
        <div className="space-y-6">
          {/* Scout + Current Agent */}
          <div className="lcd-display p-6 lg:p-8">
            <div className={cn(
              "flex flex-col items-center transition-opacity duration-300",
              isTransitioning && "opacity-50"
            )}>
              {/* Scout Avatar */}
              <div className={cn(
                "relative mb-6 transition-all duration-300",
                badgeGlow && "animate-pulse"
              )}>
                <img 
                  src={scoutMascot} 
                  alt="Scout - AI Governance Detective" 
                  className={cn(
                    "w-32 h-32 lg:w-40 lg:h-40 rounded-full",
                    "shadow-[0_0_30px_rgba(245,166,35,0.3)]",
                    "transition-shadow duration-300",
                    badgeGlow && "shadow-[0_0_50px_rgba(8,145,178,0.5)]"
                  )}
                />
                {/* Gentle bob animation */}
                <div className="absolute inset-0 animate-[scout-bob_3s_ease-in-out_infinite]" />
              </div>

              {/* Agent Name */}
              <div className="text-center mb-6">
                <div className="inline-block px-4 py-1 rounded border border-cyan-500/30 bg-cyan-500/10 mb-2">
                  <span className="font-mono text-cyan-400">{currentAgent?.name}</span>
                </div>
                <h2 className="text-xl font-semibold text-foreground">
                  "{currentAgent?.displayName}"
                </h2>
              </div>

              {/* Agent Progress Bar */}
              <div className="w-full max-w-md mb-6">
                <Progress value={agentProgress} className="h-3" />
                <p className="text-center text-sm text-muted-foreground mt-2">
                  {agentProgress}%
                </p>
              </div>

              {/* Currently Examining */}
              <div className="text-center text-sm text-muted-foreground mb-4">
                <p className="mb-2">Currently examining:</p>
                <p className="flex items-center justify-center gap-2">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span className="font-mono">{currentAgent?.description}</span>
                </p>
              </div>

              {/* Frameworks Being Checked */}
              <div className="text-center text-sm">
                <p className="text-muted-foreground mb-2">Checking against:</p>
                <div className="flex flex-wrap justify-center gap-2">
                  {currentAgent?.frameworks.map((framework, i) => (
                    <span 
                      key={i}
                      className="px-2 py-1 rounded bg-muted/50 text-xs font-mono text-muted-foreground"
                    >
                      • {framework}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Live Findings Feed */}
          <div className="lcd-display p-4 lg:p-6">
            <h3 className="text-sm font-semibold text-muted-foreground mb-3 flex items-center gap-2">
              <span className="text-amber-400">🔍</span> Scout's Findings:
            </h3>
            <div 
              ref={findingsRef}
              className="h-48 overflow-y-auto space-y-2 font-mono text-sm scrollbar-thin"
            >
              {findings.length === 0 ? (
                <p className="text-muted-foreground/50 italic">
                  Examining documentation...
                </p>
              ) : (
                findings.map((finding, i) => (
                  <div 
                    key={i}
                    className={cn(
                      "flex items-start gap-2 animate-fade-in",
                      getFindingClass(finding.type)
                    )}
                  >
                    {getFindingIcon(finding.type)}
                    <span>{finding.text}</span>
                  </div>
                ))
              )}
              {!isTransitioning && (
                <div className="flex items-center gap-2 text-cyan-400">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Examining {currentAgent?.description?.toLowerCase()}...</span>
                </div>
              )}
            </div>
          </div>

          {/* Agent Queue */}
          <div className="lcd-display p-4">
            <div className="flex items-center gap-1 overflow-x-auto pb-2 scrollbar-thin">
              {ANALYSIS_AGENTS.map((agent, i) => (
                <div
                  key={agent.id}
                  className={cn(
                    "flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-xs transition-all duration-300",
                    i < currentAgentIndex && "bg-emerald-500/20 text-emerald-400",
                    i === currentAgentIndex && "bg-cyan-500/20 text-cyan-400 ring-2 ring-cyan-500/50 scale-110",
                    i > currentAgentIndex && "bg-muted/30 text-muted-foreground/50"
                  )}
                  title={agent.displayName}
                >
                  {i < currentAgentIndex ? (
                    <Check className="w-3 h-3" />
                  ) : i === currentAgentIndex ? (
                    <span className="text-[10px]">🔍</span>
                  ) : (
                    <span className="text-[8px]">○</span>
                  )}
                </div>
              ))}
            </div>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground overflow-x-auto">
              {ANALYSIS_AGENTS.slice(0, 7).map((agent, i) => (
                <span 
                  key={agent.id}
                  className={cn(
                    "flex-shrink-0",
                    i < currentAgentIndex && "text-emerald-400",
                    i === currentAgentIndex && "text-cyan-400 font-medium"
                  )}
                >
                  {agent.name.replace('Agent_', '')} {i < currentAgentIndex ? '✓' : i === currentAgentIndex ? '🔍' : '→'}
                </span>
              ))}
              <span className="text-muted-foreground/50">...</span>
            </div>
          </div>
        </div>

        {/* Right Sidebar - Running Totals */}
        <div className="space-y-4">
          <div className="lcd-display p-4">
            <h3 className="text-sm font-semibold text-muted-foreground mb-4">
              Assessment Stats
            </h3>

            {/* Checkpoints */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Checkpoints</span>
                <span className="font-mono text-foreground">{completedCheckpoints.toLocaleString()}</span>
              </div>
              <Progress 
                value={(completedCheckpoints / TOTAL_CHECKPOINTS) * 100} 
                className="h-2 mb-1"
              />
              <p className="text-xs text-muted-foreground text-right">
                of {TOTAL_CHECKPOINTS.toLocaleString()}
              </p>
            </div>

            {/* Gaps Found */}
            <div className="mb-6">
              <p className="text-sm text-muted-foreground mb-2">Gaps Found</p>
              <div className="space-y-1 text-sm font-mono">
                <div className="flex justify-between">
                  <span className="text-red-400">🔴 Major:</span>
                  <span className="text-red-400">{gaps.major}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-amber-400">🟡 Minor:</span>
                  <span className="text-amber-400">{gaps.minor}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-blue-400">🔵 OFI:</span>
                  <span className="text-blue-400">{gaps.ofi}</span>
                </div>
              </div>
            </div>

            {/* Confidence */}
            <div className="mb-6">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-muted-foreground">Confidence</span>
                <span className="font-mono text-foreground">{Math.round(confidence)}%</span>
              </div>
              <Progress value={confidence} className="h-2" />
            </div>

            {/* Evidence Reviewed */}
            <div>
              <p className="text-sm text-muted-foreground mb-2">Evidence Reviewed</p>
              <div className="space-y-1 text-sm">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <FileText className="w-4 h-4" />
                  <span>{evidenceData?.documents || 3} documents</span>
                </div>
                {(evidenceData?.website ?? true) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Globe className="w-4 h-4" />
                    <span>1 website</span>
                  </div>
                )}
                {(evidenceData?.github ?? false) && (
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Package className="w-4 h-4" />
                    <span>1 repository</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
