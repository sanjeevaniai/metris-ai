import { useState, useEffect, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { cn } from '@/lib/utils';
import { 
  AGENT_COLORS, 
  AGENT_POSITIONS, 
  getBubbleRadius,
  getAgentExposure,
  type AgentBubble 
} from '@/data/agentVisualization';
import { ANALYSIS_AGENTS, SAMPLE_FINDINGS } from '@/data/analysisAgents';

interface LiveAssessmentBubbleChartProps {
  currentAgentIndex: number;
  agentProgress: number;
  gaps: { major: number; minor: number; ofi: number };
}

export function LiveAssessmentBubbleChart({
  currentAgentIndex,
  agentProgress,
  gaps,
}: LiveAssessmentBubbleChartProps) {
  const [hoveredAgent, setHoveredAgent] = useState<string | null>(null);
  const [zoomedAgent, setZoomedAgent] = useState<string | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });

  // Build bubble data from agents
  const bubbles = useMemo<AgentBubble[]>(() => {
    return ANALYSIS_AGENTS.map((agent, index) => {
      const position = AGENT_POSITIONS[agent.id] || { x: 5, y: 2 };
      const agentFindings = SAMPLE_FINDINGS[agent.id] || [];
      const gapsInAgent = agentFindings.filter(f => f.type === 'gap-major' || f.type === 'gap-minor').length;
      
      let status: 'queued' | 'active' | 'complete' = 'queued';
      let progress = 0;
      let evaluated = 0;
      
      if (index < currentAgentIndex) {
        status = 'complete';
        progress = 100;
        evaluated = agent.checkpoints;
      } else if (index === currentAgentIndex) {
        status = 'active';
        progress = agentProgress;
        evaluated = Math.floor((agentProgress / 100) * agent.checkpoints);
      }

      return {
        id: agent.id,
        name: agent.name,
        displayName: agent.displayName,
        color: AGENT_COLORS[agent.name] || '#6B7280',
        x: position.x,
        y: position.y,
        checkpointCount: agent.checkpoints,
        baseRadius: getBubbleRadius(agent.checkpoints),
        status,
        progress,
        evaluated,
        gapsFound: status === 'complete' ? gapsInAgent : (status === 'active' ? Math.floor(gapsInAgent * progress / 100) : 0),
        exposure: getAgentExposure(gapsInAgent),
        currentCheckpoint: agent.description,
      };
    });
  }, [currentAgentIndex, agentProgress]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setTooltipPosition({ x: e.clientX, y: e.clientY });
  }, []);

  // Chart dimensions
  const chartWidth = 800;
  const chartHeight = 450;
  const padding = { top: 40, right: 120, bottom: 60, left: 60 };
  const plotWidth = chartWidth - padding.left - padding.right;
  const plotHeight = chartHeight - padding.top - padding.bottom;

  // Scale functions
  const xScale = (val: number) => padding.left + ((val - 1) / 9) * plotWidth;
  const yScale = (val: number) => padding.top + plotHeight - (val / 4) * plotHeight;

  // Get hovered bubble data
  const hoveredBubble = bubbles.find(b => b.id === hoveredAgent);

  if (zoomedAgent) {
    const agent = bubbles.find(b => b.id === zoomedAgent);
    if (!agent) return null;
    
    return (
      <div className="w-full">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setZoomedAgent(null)}
          className="mb-4"
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to All Agents
        </Button>
        <AgentDrillDown agent={agent} />
      </div>
    );
  }

  return (
    <div className="relative w-full" onMouseMove={handleMouseMove}>
      {/* Legend */}
      <div className="absolute top-2 right-2 p-3 bg-background/90 backdrop-blur-sm border border-border rounded-lg text-xs space-y-1.5 z-10">
        <div className="font-semibold text-foreground mb-2">Agent Status</div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-cyan-500 animate-pulse" />
          <span className="text-muted-foreground">Active</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-muted-foreground/40" />
          <span className="text-muted-foreground">Queued</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-emerald-500/70" />
          <span className="text-muted-foreground">Complete</span>
        </div>
        <div className="border-t border-border pt-2 mt-2">
          <span className="text-muted-foreground">Size = checkpoint count</span>
        </div>
      </div>

      {/* SVG Chart */}
      <svg 
        viewBox={`0 0 ${chartWidth} ${chartHeight}`}
        className="w-full h-auto"
        style={{ maxHeight: '450px' }}
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="hsl(var(--border))" strokeWidth="0.5" opacity="0.3" />
          </pattern>
        </defs>
        <rect 
          x={padding.left} 
          y={padding.top} 
          width={plotWidth} 
          height={plotHeight} 
          fill="url(#grid)" 
        />

        {/* X-Axis */}
        <line 
          x1={padding.left} 
          y1={chartHeight - padding.bottom}
          x2={chartWidth - padding.right}
          y2={chartHeight - padding.bottom}
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        <text 
          x={padding.left + plotWidth / 2}
          y={chartHeight - 15}
          textAnchor="middle"
          className="fill-muted-foreground text-xs"
        >
          Checkpoint Complexity
        </text>
        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(i => (
          <g key={i}>
            <line
              x1={xScale(i)}
              y1={chartHeight - padding.bottom}
              x2={xScale(i)}
              y2={chartHeight - padding.bottom + 5}
              stroke="hsl(var(--border))"
            />
            <text
              x={xScale(i)}
              y={chartHeight - padding.bottom + 18}
              textAnchor="middle"
              className="fill-muted-foreground text-xs"
            >
              {i}
            </text>
          </g>
        ))}

        {/* Y-Axis */}
        <line 
          x1={padding.left}
          y1={padding.top}
          x2={padding.left}
          y2={chartHeight - padding.bottom}
          stroke="hsl(var(--border))"
          strokeWidth="1"
        />
        <text 
          x={15}
          y={padding.top + plotHeight / 2}
          textAnchor="middle"
          transform={`rotate(-90, 15, ${padding.top + plotHeight / 2})`}
          className="fill-muted-foreground text-xs"
        >
          Risk Exposure ($M)
        </text>
        {[0, 1, 2, 3, 4].map(i => (
          <g key={i}>
            <line
              x1={padding.left - 5}
              y1={yScale(i)}
              x2={padding.left}
              y2={yScale(i)}
              stroke="hsl(var(--border))"
            />
            <text
              x={padding.left - 10}
              y={yScale(i) + 4}
              textAnchor="end"
              className="fill-muted-foreground text-xs"
            >
              ${i}M
            </text>
          </g>
        ))}

        {/* Bubbles */}
        {bubbles.map((bubble) => {
          const cx = xScale(bubble.x);
          const cy = yScale(bubble.y);
          const radius = bubble.status === 'active' ? bubble.baseRadius * 1.5 : bubble.baseRadius;
          const opacity = bubble.status === 'queued' ? 0.4 : bubble.status === 'complete' ? 0.7 : 1;

          return (
            <g 
              key={bubble.id}
              onMouseEnter={() => setHoveredAgent(bubble.id)}
              onMouseLeave={() => setHoveredAgent(null)}
              onClick={() => setZoomedAgent(bubble.id)}
              style={{ cursor: 'pointer' }}
            >
              {/* Glow effect for active */}
              {bubble.status === 'active' && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius + 8}
                  fill="none"
                  stroke={bubble.color}
                  strokeWidth="2"
                  opacity="0.3"
                  className="animate-pulse"
                />
              )}
              
              {/* Main bubble */}
              <circle
                cx={cx}
                cy={cy}
                r={radius}
                fill={bubble.color}
                opacity={opacity}
                stroke={hoveredAgent === bubble.id ? 'white' : 'transparent'}
                strokeWidth="2"
                className="transition-all duration-300"
              />

              {/* Gap indicator badge */}
              {bubble.gapsFound > 0 && bubble.status !== 'queued' && (
                <g>
                  <circle
                    cx={cx + radius * 0.7}
                    cy={cy - radius * 0.7}
                    r={8}
                    fill="#EF4444"
                  />
                  <text
                    x={cx + radius * 0.7}
                    y={cy - radius * 0.7 + 4}
                    textAnchor="middle"
                    className="fill-white text-xs font-bold"
                    style={{ fontSize: '10px' }}
                  >
                    {bubble.gapsFound}
                  </text>
                </g>
              )}

              {/* Complete checkmark */}
              {bubble.status === 'complete' && (
                <circle
                  cx={cx}
                  cy={cy}
                  r={radius * 0.4}
                  fill="rgba(16, 185, 129, 0.8)"
                  className="transition-opacity duration-300"
                />
              )}

              {/* Active spinner */}
              {bubble.status === 'active' && (
                <foreignObject
                  x={cx - 8}
                  y={cy - 8}
                  width={16}
                  height={16}
                >
                  <Loader2 className="w-4 h-4 text-white animate-spin" />
                </foreignObject>
              )}
            </g>
          );
        })}
      </svg>

      {/* Tooltip */}
      <AnimatePresence>
        {hoveredAgent && hoveredBubble && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed z-50 pointer-events-none"
            style={{
              left: Math.min(tooltipPosition.x + 15, window.innerWidth - 280),
              top: Math.min(tooltipPosition.y - 10, window.innerHeight - 220),
            }}
          >
            <div className="bg-background border border-border rounded-lg shadow-xl p-4 w-64">
              <div className="flex items-center gap-2 mb-3">
                <div 
                  className="w-4 h-4 rounded-full"
                  style={{ backgroundColor: hoveredBubble.color }}
                />
                <span className="font-mono text-sm font-semibold">{hoveredBubble.name}</span>
              </div>
              <div className="text-sm text-foreground font-medium mb-3">
                {hoveredBubble.displayName}
              </div>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Checkpoints:</span>
                  <span className="font-mono">{hoveredBubble.checkpointCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Evaluated:</span>
                  <span className="font-mono">{hoveredBubble.evaluated} of {hoveredBubble.checkpointCount}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Gaps Found:</span>
                  <span className={cn(
                    "font-mono",
                    hoveredBubble.gapsFound > 0 && "text-red-400"
                  )}>
                    {hoveredBubble.gapsFound}
                  </span>
                </div>
                {hoveredBubble.gapsFound > 0 && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Exposure:</span>
                    <span className="font-mono text-amber-400">
                      ${(hoveredBubble.exposure / 1000).toFixed(0)}K
                    </span>
                  </div>
                )}
              </div>

              <div className="mt-3 pt-3 border-t border-border">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-muted-foreground text-xs">Status:</span>
                  <span className={cn(
                    "text-xs font-medium flex items-center gap-1",
                    hoveredBubble.status === 'active' && "text-cyan-400",
                    hoveredBubble.status === 'complete' && "text-emerald-400",
                    hoveredBubble.status === 'queued' && "text-muted-foreground"
                  )}>
                    {hoveredBubble.status === 'active' && (
                      <>
                        <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
                        ACTIVE
                      </>
                    )}
                    {hoveredBubble.status === 'complete' && (
                      <>
                        <Check className="w-3 h-3" />
                        COMPLETE
                      </>
                    )}
                    {hoveredBubble.status === 'queued' && 'QUEUED'}
                  </span>
                </div>
                {hoveredBubble.status !== 'queued' && (
                  <Progress value={hoveredBubble.progress} className="h-1.5" />
                )}
              </div>

              {hoveredBubble.currentCheckpoint && hoveredBubble.status === 'active' && (
                <div className="mt-3 pt-3 border-t border-border">
                  <span className="text-muted-foreground text-xs">Currently:</span>
                  <p className="text-xs text-foreground mt-1">{hoveredBubble.currentCheckpoint}</p>
                </div>
              )}

              <div className="mt-3 text-center">
                <span className="text-xs text-cyan-400">Click to zoom in →</span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bottom legend */}
      <div className="flex items-center justify-center gap-6 mt-4 text-xs text-muted-foreground">
        <span>Bubble size = checkpoint count</span>
        <span>•</span>
        <span>Hover for details</span>
        <span>•</span>
        <span>Click to zoom</span>
      </div>
    </div>
  );
}

// Drill-down view for a single agent
function AgentDrillDown({ agent }: { agent: AgentBubble }) {
  const findings = SAMPLE_FINDINGS[agent.id] || [];
  
  return (
    <div className="p-4 bg-card border border-border rounded-lg">
      <div className="flex items-center gap-3 mb-4">
        <div 
          className="w-6 h-6 rounded-full"
          style={{ backgroundColor: agent.color }}
        />
        <div>
          <h3 className="font-semibold">{agent.name}</h3>
          <p className="text-sm text-muted-foreground">{agent.displayName}</p>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6 text-sm">
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold">{agent.checkpointCount}</div>
          <div className="text-muted-foreground">Checkpoints</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold">{agent.evaluated}</div>
          <div className="text-muted-foreground">Evaluated</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className={cn("text-2xl font-bold", agent.gapsFound > 0 && "text-red-400")}>
            {agent.gapsFound}
          </div>
          <div className="text-muted-foreground">Gaps</div>
        </div>
        <div className="text-center p-3 bg-muted/30 rounded-lg">
          <div className="text-2xl font-bold text-amber-400">
            ${(agent.exposure / 1000).toFixed(0)}K
          </div>
          <div className="text-muted-foreground">Exposure</div>
        </div>
      </div>

      <div className="space-y-2">
        <h4 className="font-medium text-sm">Findings</h4>
        {findings.map((finding, i) => (
          <div 
            key={i}
            className={cn(
              "flex items-start gap-2 text-sm p-2 rounded-lg",
              finding.type === 'pass' && "bg-emerald-500/10 text-emerald-400",
              finding.type === 'gap-major' && "bg-red-500/10 text-red-400",
              finding.type === 'gap-minor' && "bg-amber-500/10 text-amber-400",
              finding.type === 'ofi' && "bg-blue-500/10 text-blue-400"
            )}
          >
            {finding.type === 'pass' && <Check className="w-4 h-4 mt-0.5 flex-shrink-0" />}
            {finding.type === 'gap-major' && <span className="flex-shrink-0">🔴</span>}
            {finding.type === 'gap-minor' && <span className="flex-shrink-0">🟡</span>}
            {finding.type === 'ofi' && <span className="flex-shrink-0">💡</span>}
            <span>{finding.text}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
