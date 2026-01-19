import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DEMO_AGENTS, Agent } from "@/data/demoAgents";
import { ArrowLeft, Layers, ChevronDown, Bot, Zap, Target, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

const TIER_CONFIG = [
  { 
    id: 1, 
    name: "Foundation", 
    subtitle: "Evidence & Data Collection",
    icon: Layers,
    color: "from-blue-500 to-cyan-400",
    bgGlow: "bg-blue-500/20",
    description: "Base layer agents that gather raw evidence, documentation, and system artifacts for analysis."
  },
  { 
    id: 2, 
    name: "Analysis", 
    subtitle: "Technical Deep-Dives",
    icon: Zap,
    color: "from-violet-500 to-purple-400",
    bgGlow: "bg-violet-500/20",
    description: "Agents that perform technical analysis on model performance, fairness, and robustness metrics."
  },
  { 
    id: 3, 
    name: "Mapping", 
    subtitle: "Regulatory Alignment",
    icon: Target,
    color: "from-amber-500 to-orange-400",
    bgGlow: "bg-amber-500/20",
    description: "Cross-reference findings against regulatory frameworks and compliance requirements."
  },
  { 
    id: 4, 
    name: "Risk & Monitoring", 
    subtitle: "Continuous Oversight",
    icon: Shield,
    color: "from-emerald-500 to-teal-400",
    bgGlow: "bg-emerald-500/20",
    description: "Ongoing risk quantification and real-time monitoring for production AI systems."
  },
];

const Tiers = () => {
  const [expandedTier, setExpandedTier] = useState<number | null>(null);
  const [hoveredAgent, setHoveredAgent] = useState<number | null>(null);

  const agentsByTier = useMemo(() => {
    const tiers: Record<number, Agent[]> = { 1: [], 2: [], 3: [], 4: [] };
    DEMO_AGENTS.forEach((a) => {
      if (tiers[a.tier]) tiers[a.tier].push(a);
    });
    return tiers;
  }, []);

  const toggleTier = (tierId: number) => {
    setExpandedTier(expandedTier === tierId ? null : tierId);
  };

  return (
    <div className="min-h-screen p-8">
      {/* Back Link */}
      <Link to="/agents" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8 group">
        <ArrowLeft className="h-4 w-4 group-hover:-translate-x-1 transition-transform" />
        Back to Agents
      </Link>

      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary/20 to-secondary/20 mb-4">
          <Layers className="h-8 w-8 text-primary" />
        </div>
        <h1 className="text-4xl font-light tracking-tight mb-2">Agent Tiers</h1>
        <p className="text-muted-foreground font-light max-w-xl mx-auto">
          METRIS agents are organized into 4 hierarchical tiers, each building upon the previous to create a comprehensive governance analysis.
        </p>
      </div>

      {/* Interactive Tower Stack */}
      <div className="max-w-3xl mx-auto">
        <div className="relative">
          {/* Connection Line */}
          <div className="absolute left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-border to-transparent -translate-x-1/2 z-0" />

          {/* Tiers - Stacked from bottom to top visually, but rendered top to bottom */}
          <div className="relative z-10 space-y-4">
            {TIER_CONFIG.slice().reverse().map((tier, visualIndex) => {
              const agents = agentsByTier[tier.id] || [];
              const isExpanded = expandedTier === tier.id;
              const Icon = tier.icon;
              
              // Calculate width based on position (pyramid effect - wider at bottom)
              const widthPercent = 100 - (3 - visualIndex) * 8; // 76%, 84%, 92%, 100%
              
              return (
                <div 
                  key={tier.id}
                  className="flex justify-center"
                  style={{ paddingLeft: `${(100 - widthPercent) / 2}%`, paddingRight: `${(100 - widthPercent) / 2}%` }}
                >
                  <div className="w-full">
                    {/* Tier Header Card */}
                    <Card
                      className={cn(
                        "relative overflow-hidden cursor-pointer transition-all duration-500 group",
                        isExpanded 
                          ? "ring-2 ring-primary/50 shadow-lg shadow-primary/10" 
                          : "hover:ring-1 hover:ring-primary/30"
                      )}
                      onClick={() => toggleTier(tier.id)}
                    >
                      {/* Gradient Background */}
                      <div className={cn(
                        "absolute inset-0 opacity-10 bg-gradient-to-r transition-opacity duration-300",
                        tier.color,
                        isExpanded && "opacity-20"
                      )} />
                      
                      {/* Glow Effect */}
                      <div className={cn(
                        "absolute -inset-1 blur-xl opacity-0 transition-opacity duration-500",
                        tier.bgGlow,
                        isExpanded && "opacity-50"
                      )} />

                      <div className="relative p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-4">
                            <div className={cn(
                              "w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-br transition-transform duration-300",
                              tier.color,
                              isExpanded && "scale-110"
                            )}>
                              <Icon className="h-6 w-6 text-white" />
                            </div>
                            <div>
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-mono text-muted-foreground">TIER {tier.id}</span>
                                <Badge variant="outline" className="text-xs">
                                  {agents.length} agents
                                </Badge>
                              </div>
                              <h3 className="text-xl font-medium mt-1">{tier.name}</h3>
                              <p className="text-sm text-muted-foreground">{tier.subtitle}</p>
                            </div>
                          </div>
                          
                          <ChevronDown className={cn(
                            "h-5 w-5 text-muted-foreground transition-transform duration-300",
                            isExpanded && "rotate-180"
                          )} />
                        </div>

                        {/* Description */}
                        <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
                          {tier.description}
                        </p>
                      </div>
                    </Card>

                    {/* Expanded Agents List */}
                    <div className={cn(
                      "overflow-hidden transition-all duration-500 ease-out",
                      isExpanded ? "max-h-[800px] opacity-100 mt-3" : "max-h-0 opacity-0"
                    )}>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 p-1">
                        {agents.map((agent, agentIndex) => (
                          <Card
                            key={agent.id}
                            className={cn(
                              "p-4 transition-all duration-300 cursor-pointer border-transparent",
                              hoveredAgent === agent.id 
                                ? "bg-primary/10 border-primary/30 scale-[1.02]" 
                                : "bg-muted/30 hover:bg-muted/50"
                            )}
                            style={{ 
                              animationDelay: `${agentIndex * 50}ms`,
                              animation: isExpanded ? 'fade-in 0.3s ease-out forwards' : 'none'
                            }}
                            onMouseEnter={() => setHoveredAgent(agent.id)}
                            onMouseLeave={() => setHoveredAgent(null)}
                          >
                            <div className="flex items-start gap-3">
                              <div className={cn(
                                "w-8 h-8 rounded-lg flex items-center justify-center text-xs font-mono bg-gradient-to-br",
                                tier.color
                              )}>
                                <Bot className="h-4 w-4 text-white" />
                              </div>
                              <div className="flex-1 min-w-0">
                                <p className="font-medium text-sm truncate">{agent.displayName}</p>
                                <p className="text-xs text-muted-foreground truncate">{agent.function}</p>
                                <div className="flex items-center gap-2 mt-2">
                                  <span className="text-xs font-mono text-primary">
                                    {agent.checkpoints} checkpoints
                                  </span>
                                  <span className={cn(
                                    "text-xs px-1.5 py-0.5 rounded-full",
                                    agent.status === 'completed' ? 'bg-score-good/20 text-score-good' :
                                    agent.status === 'running' ? 'bg-primary/20 text-primary' :
                                    'bg-muted text-muted-foreground'
                                  )}>
                                    {agent.status}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </Card>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Summary Footer */}
        <div className="mt-12 text-center">
          <Card className="inline-flex items-center gap-6 p-4 bg-muted/30">
            <div className="text-center">
              <p className="text-2xl font-mono font-medium">{DEMO_AGENTS.length}</p>
              <p className="text-xs text-muted-foreground">Total Agents</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-mono font-medium">4</p>
              <p className="text-xs text-muted-foreground">Tiers</p>
            </div>
            <div className="w-px h-10 bg-border" />
            <div className="text-center">
              <p className="text-2xl font-mono font-medium text-primary">
                {DEMO_AGENTS.reduce((sum, a) => sum + a.checkpoints, 0).toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Checkpoints</p>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Tiers;
