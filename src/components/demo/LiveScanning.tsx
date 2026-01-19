import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';
import { mockAgents, scanningStages, terminalLogs } from '@/data/mockData';
import { CheckCircle2, Circle, Loader2, AlertTriangle, DollarSign, Zap } from 'lucide-react';
import scoutAvatar from '@/assets/scout-avatar.png';

interface LiveScanningProps {
  onComplete: () => void;
}

export function LiveScanning({ onComplete }: LiveScanningProps) {
  const [currentStage, setCurrentStage] = useState(0);
  const [progress, setProgress] = useState(0);
  const [visibleLogs, setVisibleLogs] = useState<typeof terminalLogs>([]);
  const [agents, setAgents] = useState(mockAgents);
  const [liveROI, setLiveROI] = useState(0);
  const [criticalFound, setCriticalFound] = useState(false);
  const [latestCritical, setLatestCritical] = useState<string | null>(null);

  useEffect(() => {
    // Progress animation
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(progressInterval);
          return 100;
        }
        return prev + 1;
      });
    }, 150);

    // Stage progression (16 stages now)
    const stageInterval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev >= 15) {
          clearInterval(stageInterval);
          return 15;
        }
        return prev + 1;
      });
    }, 1000);

    // Log streaming with critical detection
    let logIndex = 0;
    const logInterval = setInterval(() => {
      if (logIndex < terminalLogs.length) {
        const currentLog = terminalLogs[logIndex];
        setVisibleLogs((prev) => [...prev, currentLog]);
        
        // Detect critical findings
        if (currentLog?.level === 'error' || currentLog?.message?.toLowerCase().includes('critical') || currentLog?.message?.toLowerCase().includes('high risk')) {
          setCriticalFound(true);
          setLatestCritical(currentLog?.message || null);
          setTimeout(() => {
            setCriticalFound(false);
            setLatestCritical(null);
          }, 2000);
        }
        
        logIndex++;
      } else {
        clearInterval(logInterval);
      }
    }, 1000);

    // Agent status updates
    const agentInterval = setInterval(() => {
      setAgents((prev) => {
        const updated = [...prev];
        const idleAgents = updated.filter((a) => a.status === 'idle');
        const activeAgents = updated.filter((a) => a.status === 'active');
        const processingAgents = updated.filter((a) => a.status === 'processing');
        
        if (idleAgents.length > 0) {
          const toActivate = Math.min(3, idleAgents.length);
          for (let i = 0; i < toActivate; i++) {
            const idx = updated.findIndex((a) => a.id === idleAgents[i].id);
            updated[idx] = { ...idleAgents[i], status: 'active' };
          }
        }
        
        if (activeAgents.length > 0) {
          const toProcess = Math.min(2, activeAgents.length);
          for (let i = 0; i < toProcess; i++) {
            const idx = updated.findIndex((a) => a.id === activeAgents[i].id);
            updated[idx] = { ...activeAgents[i], status: 'processing' };
          }
        }
        
        if (processingAgents.length > 0) {
          const randomAgent = processingAgents[Math.floor(Math.random() * processingAgents.length)];
          const idx = updated.findIndex((a) => a.id === randomAgent.id);
          updated[idx] = { ...randomAgent, status: 'complete', findings: Math.floor(Math.random() * 5) + 1 };
        }
        
        return updated;
      });
    }, 400);

    // ROI calculation
    const roiInterval = setInterval(() => {
      setLiveROI((prev) => {
        if (prev >= 700000) return 700000;
        return prev + Math.floor(Math.random() * 50000);
      });
    }, 500);

    // Complete after animation
    const completeTimeout = setTimeout(() => {
      onComplete();
    }, 16000);

    return () => {
      clearInterval(progressInterval);
      clearInterval(stageInterval);
      clearInterval(logInterval);
      clearInterval(agentInterval);
      clearInterval(roiInterval);
      clearTimeout(completeTimeout);
    };
  }, [onComplete]);

  const getLogLevelColor = (level: string) => {
    switch (level) {
      case 'error': return 'text-destructive';
      case 'warning': return 'text-[hsl(42_85%_55%)]';
      case 'success': return 'text-primary';
      default: return 'text-muted-foreground';
    }
  };

  const getAgentStatusIcon = (status: string) => {
    switch (status) {
      case 'complete': return <CheckCircle2 className="h-3.5 w-3.5 text-primary" />;
      case 'processing': return <Loader2 className="h-3.5 w-3.5 text-secondary animate-spin" />;
      case 'active': return <Zap className="h-3.5 w-3.5 text-secondary" />;
      default: return <Circle className="h-3.5 w-3.5 text-muted-foreground/50" />;
    }
  };

  const completedAgents = agents.filter(a => a.status === 'complete').length;
  const activeAgents = agents.filter(a => a.status === 'active' || a.status === 'processing').length;

  return (
    <div className="space-y-8 animate-enter">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight">Live Risk Scanning</h2>
          <p className="text-muted-foreground mt-1">
            25 AI agents analyzing your systems in real-time
          </p>
        </div>
        
        {/* Live ROI Card */}
        <Card className="border-primary/20 shadow-glow-sm">
          <CardContent className="p-4 flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <DollarSign className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-xs text-muted-foreground font-medium">Live Risk Exposure</p>
              <p className="text-2xl font-semibold text-gradient tracking-tight">
                €{(liveROI / 1000000).toFixed(2)}M
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Progress Section */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-sm font-medium">
                Stage {Math.min(currentStage + 1, 16)}: {scanningStages[Math.min(currentStage, 15)]?.name}
              </span>
            </div>
            <span className="text-sm text-muted-foreground font-medium tabular-nums">
              {Math.round(progress)}%
            </span>
          </div>
          
          <Progress value={progress} className="h-2 mb-6" />
          
          {/* Stage Pills - Scrollable for 16 stages */}
          <div className="flex flex-wrap gap-1.5">
            {scanningStages.map((stage, idx) => (
              <div
                key={stage.id}
                className={cn(
                  'px-2 py-1 rounded-md text-[10px] font-medium transition-all duration-300',
                  idx < currentStage && 'bg-primary/15 text-primary',
                  idx === currentStage && 'bg-primary text-primary-foreground shadow-glow-sm',
                  idx > currentStage && 'bg-muted/50 text-muted-foreground'
                )}
              >
                {stage.name.split(' ')[0]}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Terminal Logs */}
        <Card className="lg:col-span-2">
          <CardHeader className="pb-4">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Live Scan Output
            </CardTitle>
          </CardHeader>
          <CardContent>
            {/* Scout Detective Animation */}
            <div className={cn(
              "relative mb-4 h-16 overflow-hidden rounded-xl transition-all duration-500",
              criticalFound 
                ? "bg-destructive/5 border border-destructive/20" 
                : "bg-gradient-to-r from-primary/5 via-transparent to-secondary/5 border border-border/30"
            )}>
              {/* Scan line effect */}
              <div className="absolute inset-0 flex items-center">
                <div className={cn(
                  "w-full h-px transition-colors duration-300",
                  criticalFound 
                    ? "bg-gradient-to-r from-transparent via-destructive/40 to-transparent" 
                    : "bg-gradient-to-r from-transparent via-primary/20 to-transparent"
                )} />
              </div>
              
              {/* Scout Avatar */}
              <img
                src={scoutAvatar}
                alt="METRIS Scout"
                className={cn(
                  "absolute h-10 w-10 rounded-full border-2 transition-all duration-300",
                  "shadow-[0_4px_16px_hsl(var(--primary)/0.2)]",
                  criticalFound 
                    ? "border-destructive animate-scout-alert left-1/2 -translate-x-1/2" 
                    : "border-primary/50 animate-scout-patrol"
                )}
                style={{
                  top: '50%',
                  transform: criticalFound ? 'translate(-50%, -50%)' : 'translateY(-50%)',
                }}
              />
              
              {/* Status text */}
              <div className={cn(
                "absolute right-4 top-1/2 -translate-y-1/2 text-xs transition-all duration-300",
                criticalFound ? "text-destructive font-medium" : "text-muted-foreground"
              )}>
                {criticalFound ? (
                  <span className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="font-mono font-semibold">CRITICAL FINDING</span>
                  </span>
                ) : (
                  <span className="flex items-center gap-1.5">
                    <span className="text-primary font-medium">METRIS Scout</span>
                    <span>investigating...</span>
                  </span>
                )}
              </div>
              
              {/* Critical message */}
              {criticalFound && latestCritical && (
                <div className="absolute bottom-1.5 left-4 right-4 text-[10px] text-destructive/80 font-mono truncate animate-enter">
                  {latestCritical}
                </div>
              )}
            </div>
            
            {/* Terminal */}
            <div className="bg-background/60 rounded-xl p-4 h-[260px] overflow-auto font-mono text-xs border border-border/30">
              {visibleLogs.filter(Boolean).map((log, idx) => (
                <div
                  key={idx}
                  className={cn('py-1 animate-enter opacity-0', getLogLevelColor(log?.level || 'info'))}
                  style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'forwards' }}
                >
                  <span className="text-muted-foreground/60">[{log?.timestamp || '00:00:00'}]</span>{' '}
                  {log?.level === 'error' && <AlertTriangle className="inline h-3 w-3 mr-1" />}
                  {log?.message || ''}
                </div>
              ))}
              <span className="terminal-cursor" />
            </div>
          </CardContent>
        </Card>

        {/* Agent Grid */}
        <Card>
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-sm font-medium">Agent Status</CardTitle>
              <Badge variant="secondary" className="text-xs">
                {completedAgents}/{agents.length} Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-2">
              {agents.map((agent) => (
                <div
                  key={agent.id}
                  className={cn(
                    'relative p-2.5 rounded-xl text-center transition-all duration-300',
                    agent.status === 'complete' && 'bg-primary/10 border border-primary/20',
                    agent.status === 'processing' && 'bg-secondary/10 border border-secondary/20',
                    agent.status === 'active' && 'bg-secondary/5 border border-border/30',
                    agent.status === 'idle' && 'bg-muted/30 border border-transparent'
                  )}
                >
                  <div className="flex justify-center mb-1.5">
                    {getAgentStatusIcon(agent.status)}
                  </div>
                  <div className="text-[10px] font-medium truncate text-foreground/80">
                    {agent.name}
                  </div>
                  {agent.findings > 0 && (
                    <Badge variant="secondary" className="absolute -top-1 -right-1 text-[8px] px-1.5 py-0 min-w-[16px] h-4">
                      {agent.findings}
                    </Badge>
                  )}
                </div>
              ))}
            </div>
            
            {/* Summary stats */}
            <div className="mt-4 pt-4 border-t border-border/30 grid grid-cols-3 gap-2 text-center">
              <div>
                <p className="text-lg font-semibold text-primary tabular-nums">{completedAgents}</p>
                <p className="text-[10px] text-muted-foreground">Complete</p>
              </div>
              <div>
                <p className="text-lg font-semibold text-secondary tabular-nums">{activeAgents}</p>
                <p className="text-[10px] text-muted-foreground">Active</p>
              </div>
              <div>
                <p className="text-lg font-semibold tabular-nums">{agents.reduce((acc, a) => acc + a.findings, 0)}</p>
                <p className="text-[10px] text-muted-foreground">Findings</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
