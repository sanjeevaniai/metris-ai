import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DEMO_DIGITAL_MATURITY } from '@/data/demoDigitalMaturity';
import { Target, TrendingUp, Users, Cpu, Database, Cloud, GitBranch, ArrowRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';

const levelColors = {
  1: 'text-[hsl(var(--risk-critical))]',
  2: 'text-[hsl(var(--risk-high))]',
  3: 'text-[hsl(var(--risk-medium))]',
  4: 'text-[hsl(var(--score-good))]',
  5: 'text-[hsl(var(--score-excellent))]',
};

const dimensionIcons = {
  'AI/ML Adoption': Cpu,
  'Data Infrastructure': Database,
  'Cloud & DevOps': Cloud,
  'Talent & Culture': Users,
  'Process & Governance': GitBranch,
};

export default function Maturity() {
  const { overallLevel, overallScore, dimensions, recommendations, benchmarks } = DEMO_DIGITAL_MATURITY;

  const radarData = dimensions.map(d => ({
    dimension: d.name.split(' ')[0],
    score: d.score,
    benchmark: 65,
    fullMark: 100,
  }));

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Target className="h-6 w-6 text-primary" />
              Digital Maturity Assessment
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              5-dimension maturity model aligned with MIT CISR framework
            </p>
          </div>
          <div className="flex items-center gap-6">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Overall Score</p>
              <p className="text-3xl font-mono font-semibold text-foreground">{overallScore}%</p>
            </div>
            <div className="px-4 py-2 rounded-lg border border-primary/30 bg-primary/10">
              <p className="text-xs text-muted-foreground">Maturity Level</p>
              <p className={cn("text-2xl font-mono font-bold", levelColors[overallLevel as keyof typeof levelColors])}>
                Level {overallLevel}
              </p>
            </div>
          </div>
        </div>

        {/* Radar Chart & Level Guide */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card className="lg:col-span-2 border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Dimension Analysis</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <RadarChart data={radarData}>
                    <PolarGrid stroke="hsl(var(--border))" />
                    <PolarAngleAxis 
                      dataKey="dimension" 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 11 }}
                    />
                    <PolarRadiusAxis 
                      angle={90} 
                      domain={[0, 100]} 
                      tick={{ fill: 'hsl(var(--muted-foreground))', fontSize: 10 }}
                    />
                    <Radar
                      name="Industry Benchmark"
                      dataKey="benchmark"
                      stroke="hsl(var(--chart-baseline))"
                      fill="hsl(var(--chart-baseline))"
                      fillOpacity={0.1}
                      strokeDasharray="4 4"
                    />
                    <Radar
                      name="Your Score"
                      dataKey="score"
                      stroke="hsl(var(--chart-primary))"
                      fill="hsl(var(--chart-primary))"
                      fillOpacity={0.3}
                    />
                  </RadarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-2">
              <CardTitle className="text-base font-medium">Maturity Levels</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {[5, 4, 3, 2, 1].map(level => (
                <div 
                  key={level}
                  className={cn(
                    "flex items-center gap-3 p-2 rounded-md transition-all",
                    level === overallLevel && "bg-primary/10 border border-primary/30"
                  )}
                >
                  <span className={cn("font-mono font-bold text-lg w-6", levelColors[level as keyof typeof levelColors])}>
                    {level}
                  </span>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-foreground">
                      {level === 5 && 'Optimizing'}
                      {level === 4 && 'Managed'}
                      {level === 3 && 'Defined'}
                      {level === 2 && 'Developing'}
                      {level === 1 && 'Initial'}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {level === 5 && 'Continuous improvement, AI-driven'}
                      {level === 4 && 'Measured & controlled processes'}
                      {level === 3 && 'Standardized across organization'}
                      {level === 2 && 'Repeatable but ad-hoc'}
                      {level === 1 && 'Unpredictable, reactive'}
                    </p>
                  </div>
                  {level === overallLevel && (
                    <Badge variant="outline" className="text-[10px] text-primary border-primary/50">
                      CURRENT
                    </Badge>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Dimension Details */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
          {dimensions.map((dim) => {
            const Icon = dimensionIcons[dim.name as keyof typeof dimensionIcons] || Target;
            return (
              <Card key={dim.name} className="border-border/50 bg-card/50">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <div className="p-2 rounded-md bg-muted/50">
                        <Icon className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-foreground">{dim.name}</p>
                        <p className="text-xs text-muted-foreground">Level {dim.level}</p>
                      </div>
                    </div>
                    <span className={cn("font-mono text-lg font-semibold", levelColors[dim.level as keyof typeof levelColors])}>
                      {dim.score}%
                    </span>
                  </div>
                  <Progress value={dim.score} className="h-1.5 mb-3" />
                  <div className="space-y-1">
                    {dim.capabilities.slice(0, 3).map((cap, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-xs">
                        <span className={cn(
                          "w-1.5 h-1.5 rounded-full",
                          cap.status === 'complete' && "bg-[hsl(var(--status-success))]",
                          cap.status === 'in_progress' && "bg-[hsl(var(--status-warning))]",
                          cap.status === 'planned' && "bg-[hsl(var(--status-inactive))]"
                        )} />
                        <span className="text-muted-foreground truncate">{cap.name}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Recommendations */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              Priority Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-4">
              {recommendations.map((rec, idx) => (
                <div key={idx} className="flex items-start gap-3 p-3 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex items-center justify-center w-6 h-6 rounded-full bg-primary/10 text-primary text-xs font-mono shrink-0">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground">{rec.title}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{rec.description}</p>
                    <div className="flex items-center gap-4 mt-2">
                      <Badge variant="outline" className="text-[10px]">{rec.dimension}</Badge>
                      <span className="text-xs text-muted-foreground">
                        Impact: <span className="text-primary font-mono">+{rec.impact}%</span>
                      </span>
                    </div>
                  </div>
                  <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
