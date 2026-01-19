import { useState } from 'react';
import { Agent } from '@/data/demoAgents';
import { cn } from '@/lib/utils';

interface TierSpectrumProps {
  agentsByTier: Record<number, Agent[]>;
  tierNames: Record<number, string>;
  onTierSelect: (tier: string) => void;
}

const TIER_COLORS = {
  1: 'hsl(var(--chart-1))',
  2: 'hsl(var(--chart-2))',
  3: 'hsl(var(--chart-3))',
  4: 'hsl(var(--chart-4))',
};

export function TierSpectrum({ agentsByTier, tierNames, onTierSelect }: TierSpectrumProps) {
  const [hoveredTier, setHoveredTier] = useState<number | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);

  // Find max checkpoints for scaling
  const maxCheckpoints = Math.max(
    ...Object.values(agentsByTier).flatMap(agents => agents.map(a => a.checkpoints))
  );

  return (
    <div className="relative bg-card/30 backdrop-blur-sm border border-border/50 rounded-xl p-6 overflow-hidden">
      {/* Background grid effect */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
          backgroundSize: '24px 24px'
        }}
      />
      
      {/* Glow effect for hovered tier */}
      {hoveredTier && (
        <div 
          className="absolute inset-0 transition-opacity duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(ellipse at ${(hoveredTier - 1) * 25 + 12.5}% 50%, ${TIER_COLORS[hoveredTier as keyof typeof TIER_COLORS]}15 0%, transparent 50%)`,
          }}
        />
      )}

      <div className="relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
            Agent Spectrum
          </h3>
          <div className="flex items-center gap-4">
            {[1, 2, 3, 4].map(tier => (
              <div key={tier} className="flex items-center gap-1.5">
                <div 
                  className="w-2 h-2 rounded-full"
                  style={{ backgroundColor: TIER_COLORS[tier as keyof typeof TIER_COLORS] }}
                />
                <span className="text-xs text-muted-foreground">T{tier}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Spectrum Visualization */}
        <div className="grid grid-cols-4 gap-3 mb-4">
          {[1, 2, 3, 4].map(tier => {
            const agents = agentsByTier[tier];
            const isHovered = hoveredTier === tier;
            const tierColor = TIER_COLORS[tier as keyof typeof TIER_COLORS];
            
            return (
              <div
                key={tier}
                className="relative"
                onMouseEnter={() => setHoveredTier(tier)}
                onMouseLeave={() => {
                  setHoveredTier(null);
                  setHoveredAgent(null);
                }}
              >
                {/* Tier Column */}
                <div 
                  className={cn(
                    "relative h-48 rounded-lg transition-all duration-500 cursor-pointer overflow-hidden",
                    "border border-border/30",
                    isHovered ? "bg-card/80 scale-[1.02]" : "bg-card/40"
                  )}
                  style={{
                    boxShadow: isHovered ? `0 0 30px ${tierColor}20, inset 0 0 30px ${tierColor}05` : 'none'
                  }}
                  onClick={() => onTierSelect(tier.toString())}
                >
                  {/* Agent Bars - Frequency Spectrum Style */}
                  <div className="absolute bottom-0 left-0 right-0 flex items-end justify-center gap-0.5 px-2 pb-2">
                    {agents.map((agent, idx) => {
                      const height = Math.max(15, (agent.checkpoints / maxCheckpoints) * 100);
                      const isAgentHovered = hoveredAgent === agent.id;
                      const delay = idx * 50;
                      
                      return (
                        <div
                          key={agent.id}
                          className="relative group"
                          onMouseEnter={() => setHoveredAgent(agent.id)}
                          onMouseLeave={() => setHoveredAgent(null)}
                        >
                          {/* Bar */}
                          <div
                            className={cn(
                              "rounded-t-sm transition-all cursor-pointer",
                              isHovered ? "w-2" : "w-1.5"
                            )}
                            style={{
                              height: isHovered ? `${height}%` : `${height * 0.6}%`,
                              minHeight: isHovered ? '20px' : '12px',
                              backgroundColor: tierColor,
                              opacity: hoveredAgent === agent.id ? 1 : isHovered ? 0.8 : 0.5,
                              transitionDuration: '300ms',
                              transitionDelay: `${delay}ms`,
                              boxShadow: hoveredAgent === agent.id ? `0 0 12px ${tierColor}` : 'none',
                            }}
                          />
                          
                          {/* Pulse effect on hover */}
                          {hoveredAgent === agent.id && (
                            <div
                              className="absolute bottom-0 left-1/2 -translate-x-1/2 w-4 h-4 rounded-full animate-ping"
                              style={{ backgroundColor: `${tierColor}40` }}
                            />
                          )}

                          {/* Tooltip */}
                          {hoveredAgent === agent.id && (
                            <div 
                              className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 rounded-lg bg-popover border border-border shadow-lg z-50 whitespace-nowrap animate-fade-in"
                            >
                              <p className="text-xs font-medium text-foreground">{agent.displayName}</p>
                              <p className="text-xs text-muted-foreground mt-0.5">
                                <span className="font-mono" style={{ color: tierColor }}>{agent.checkpoints}</span> checkpoints
                              </p>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Horizontal scan line effect */}
                  {isHovered && (
                    <div 
                      className="absolute left-0 right-0 h-px bg-gradient-to-r from-transparent via-current to-transparent opacity-50 animate-scan"
                      style={{ color: tierColor }}
                    />
                  )}

                  {/* Connection lines between bars when hovered */}
                  {isHovered && (
                    <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible">
                      <defs>
                        <linearGradient id={`grad-${tier}`} x1="0%" y1="100%" x2="0%" y2="0%">
                          <stop offset="0%" stopColor={tierColor} stopOpacity="0.3" />
                          <stop offset="100%" stopColor={tierColor} stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {agents.slice(0, -1).map((_, idx) => {
                        const x1 = ((idx + 0.5) / agents.length) * 100;
                        const x2 = ((idx + 1.5) / agents.length) * 100;
                        return (
                          <line
                            key={idx}
                            x1={`${x1}%`}
                            y1="85%"
                            x2={`${x2}%`}
                            y2="85%"
                            stroke={tierColor}
                            strokeWidth="0.5"
                            strokeOpacity="0.3"
                            className="animate-fade-in"
                            style={{ animationDelay: `${idx * 30}ms` }}
                          />
                        );
                      })}
                    </svg>
                  )}
                </div>

                {/* Tier Label */}
                <div className={cn(
                  "mt-3 text-center transition-all duration-300",
                  isHovered ? "transform -translate-y-1" : ""
                )}>
                  <p 
                    className="text-sm font-medium transition-colors duration-300"
                    style={{ color: isHovered ? tierColor : 'hsl(var(--foreground))' }}
                  >
                    {tierNames[tier]}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {agents.length} agents · {agents.reduce((sum, a) => sum + a.checkpoints, 0).toLocaleString()} checks
                  </p>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Stats Bar */}
        <div className="flex items-center justify-between pt-4 border-t border-border/30">
          <div className="flex items-center gap-6">
            {[1, 2, 3, 4].map(tier => {
              const agents = agentsByTier[tier];
              const total = agents.reduce((sum, a) => sum + a.checkpoints, 0);
              const isHovered = hoveredTier === tier;
              
              return (
                <div 
                  key={tier}
                  className={cn(
                    "flex items-center gap-2 transition-all duration-300",
                    isHovered ? "scale-110" : "opacity-60 hover:opacity-100"
                  )}
                >
                  <div 
                    className={cn(
                      "w-8 h-1 rounded-full transition-all duration-300",
                      isHovered && "h-1.5"
                    )}
                    style={{ 
                      backgroundColor: TIER_COLORS[tier as keyof typeof TIER_COLORS],
                      boxShadow: isHovered ? `0 0 8px ${TIER_COLORS[tier as keyof typeof TIER_COLORS]}` : 'none'
                    }}
                  />
                  <span className="text-xs font-mono text-muted-foreground">
                    {total.toLocaleString()}
                  </span>
                </div>
              );
            })}
          </div>
          
          <p className="text-xs text-muted-foreground">
            Hover to explore · Click to filter
          </p>
        </div>
      </div>
    </div>
  );
}
