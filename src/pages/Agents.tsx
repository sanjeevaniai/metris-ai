import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Progress } from "@/components/ui/progress";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DEMO_AGENTS, Agent } from "@/data/demoAgents";
import { Search, Bot, CheckCircle2, Play, Clock, Layers, Cpu, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { TierSpectrum } from "@/components/agents/TierSpectrum";

const STAGE_NAMES: Record<number, string> = {
  1: "Evidence Collection",
  2: "Technical Analysis",
  3: "Advanced Analysis",
  4: "Specialized Analysis",
  5: "Regulatory Mapping",
  6: "Risk Quantification",
  7: "Continuous Monitoring",
};

const TIER_NAMES: Record<number, string> = {
  1: "Foundation",
  2: "Analysis",
  3: "Mapping",
  4: "Risk & Monitoring",
};

const Agents = () => {
  const [search, setSearch] = useState("");
  const [tierFilter, setTierFilter] = useState<string>("all");
  const [stageFilter, setStageFilter] = useState<string>("all");

  const filteredAgents = useMemo(() => {
    return DEMO_AGENTS.filter((agent) => {
      const matchesSearch = 
        agent.displayName.toLowerCase().includes(search.toLowerCase()) ||
        agent.function.toLowerCase().includes(search.toLowerCase());
      const matchesTier = tierFilter === "all" || agent.tier === parseInt(tierFilter);
      const matchesStage = stageFilter === "all" || agent.stage === parseInt(stageFilter);
      return matchesSearch && matchesTier && matchesStage;
    });
  }, [search, tierFilter, stageFilter]);

  const totalCheckpoints = DEMO_AGENTS.reduce((sum, a) => sum + a.checkpoints, 0);
  const completedAgents = DEMO_AGENTS.filter((a) => a.status === "completed").length;

  const agentsByTier = useMemo(() => {
    const tiers: Record<number, Agent[]> = { 1: [], 2: [], 3: [], 4: [] };
    DEMO_AGENTS.forEach((a) => {
      if (tiers[a.tier]) tiers[a.tier].push(a);
    });
    return tiers;
  }, []);

  const getStatusIcon = (status: Agent["status"]) => {
    switch (status) {
      case "completed":
        return <CheckCircle2 className="h-4 w-4 text-score-good" />;
      case "running":
        return <Play className="h-4 w-4 text-primary animate-pulse" />;
      case "pending":
        return <Clock className="h-4 w-4 text-muted-foreground" />;
    }
  };

  const getStatusBadge = (status: Agent["status"]) => {
    const variants: Record<Agent["status"], string> = {
      completed: "bg-score-good/20 text-score-good border-score-good/30",
      running: "bg-primary/20 text-primary border-primary/30",
      pending: "bg-muted text-muted-foreground border-muted-foreground/30",
    };
    return variants[status];
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-light tracking-tight">METRIS<sup className="text-sm align-super">™</sup> Agents</h1>
        <p className="text-muted-foreground font-light">
          25 specialized agents performing 1,768 governance checkpoints
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-light">Total Agents</p>
                <p className="text-3xl font-mono font-light text-foreground">{DEMO_AGENTS.length}</p>
              </div>
              <Bot className="h-8 w-8 text-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-light">Checkpoints</p>
                <p className="text-3xl font-mono font-light text-foreground">{totalCheckpoints.toLocaleString()}</p>
              </div>
              <Activity className="h-8 w-8 text-primary opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground font-light">Completed</p>
                <p className="text-3xl font-mono font-light text-score-good">{completedAgents}</p>
              </div>
              <CheckCircle2 className="h-8 w-8 text-score-good opacity-70" />
            </div>
          </CardContent>
        </Card>
        <Link to="/tiers" className="block group">
          <Card className="transition-all duration-300 hover:ring-2 hover:ring-primary/50 hover:shadow-lg hover:shadow-primary/10 cursor-pointer relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
            <CardContent className="p-6 relative">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground font-light">Tiers</p>
                  <p className="text-3xl font-mono font-light text-foreground">4</p>
                </div>
                <div className="relative">
                  <Layers className="h-8 w-8 text-primary opacity-70 group-hover:scale-110 transition-transform" />
                  <div className="absolute inset-0 blur-lg bg-primary/30 opacity-0 group-hover:opacity-50 transition-opacity" />
                </div>
              </div>
              <p className="text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity mt-2">
                Click to explore →
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Interactive Tier Spectrum Visualization */}
      <TierSpectrum 
        agentsByTier={agentsByTier}
        tierNames={TIER_NAMES}
        onTierSelect={setTierFilter}
      />

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search agents..."
                className="pl-9"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Select value={tierFilter} onValueChange={setTierFilter}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Tiers" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="1">Tier 1: Foundation</SelectItem>
                <SelectItem value="2">Tier 2: Analysis</SelectItem>
                <SelectItem value="3">Tier 3: Mapping</SelectItem>
                <SelectItem value="4">Tier 4: Risk</SelectItem>
              </SelectContent>
            </Select>
            <Select value={stageFilter} onValueChange={setStageFilter}>
              <SelectTrigger className="w-[220px]">
                <SelectValue placeholder="All Stages" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Stages</SelectItem>
                {Object.entries(STAGE_NAMES).map(([id, name]) => (
                  <SelectItem key={id} value={id}>Stage {id}: {name}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Agents Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base font-light">Agent Registry</CardTitle>
          <CardDescription className="font-light">
            {filteredAgents.length} of {DEMO_AGENTS.length} agents
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-light w-12">#</TableHead>
                <TableHead className="font-light">Agent</TableHead>
                <TableHead className="font-light">Function</TableHead>
                <TableHead className="font-light text-center">Tier</TableHead>
                <TableHead className="font-light text-center">Stage</TableHead>
                <TableHead className="font-light text-right">Checkpoints</TableHead>
                <TableHead className="font-light text-center">Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredAgents.map((agent) => (
                <TableRow key={agent.id}>
                  <TableCell className="font-mono text-xs text-muted-foreground">{agent.id}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Cpu className="h-4 w-4 text-primary" />
                      <div>
                        <p className="font-medium text-sm">{agent.displayName}</p>
                        <p className="text-xs text-muted-foreground font-mono">{agent.name}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground max-w-xs truncate">
                    {agent.function}
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="outline" className="font-mono text-xs">
                      T{agent.tier}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-center">
                    <Badge variant="secondary" className="font-mono text-xs">
                      S{agent.stage}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <span className="font-mono text-sm">{agent.checkpoints}</span>
                      {agent.checkpoints > 0 && (
                        <Progress 
                          value={(agent.checkpoints / 1120) * 100} 
                          className="w-16 h-1.5" 
                        />
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      {getStatusIcon(agent.status)}
                      <Badge className={cn("text-xs font-light capitalize", getStatusBadge(agent.status))}>
                        {agent.status}
                      </Badge>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default Agents;
