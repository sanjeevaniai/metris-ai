import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { DEMO_SECURITY } from '@/data/demoSecurity';
import { Shield, AlertTriangle, CheckCircle2, XCircle, ExternalLink, Lock, Eye, Zap } from 'lucide-react';
import { cn } from '@/lib/utils';

const severityColors = {
  critical: 'bg-[hsl(var(--risk-critical))] text-white',
  high: 'bg-[hsl(var(--risk-high))] text-white',
  medium: 'bg-[hsl(var(--risk-medium))] text-black',
  low: 'bg-[hsl(var(--risk-low))] text-black',
};

export default function Security() {
  const { score, findings, mitreMapping, vulnerabilities, controls } = DEMO_SECURITY;

  const criticalFindings = findings.filter(f => f.severity === 'critical');
  const highFindings = findings.filter(f => f.severity === 'high');

  return (
    <SidebarLayout>
      <div className="p-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground flex items-center gap-3">
              <Shield className="h-6 w-6 text-primary" />
              Security Dashboard
            </h1>
            <p className="text-sm text-muted-foreground mt-1">
              AI-specific security posture with MITRE ATLAS mapping
            </p>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-right">
              <p className="text-xs text-muted-foreground uppercase tracking-wider">Security Score</p>
              <p className="text-3xl font-mono font-semibold text-foreground">{score}</p>
            </div>
            <div className="w-24 h-24 relative">
              <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="15.9155" fill="none" stroke="hsl(var(--muted))" strokeWidth="2" />
                <circle
                  cx="18" cy="18" r="15.9155" fill="none"
                  stroke={score >= 700 ? 'hsl(var(--score-good))' : score >= 500 ? 'hsl(var(--score-fair))' : 'hsl(var(--score-poor))'}
                  strokeWidth="2"
                  strokeDasharray={`${(score / 1000) * 100}, 100`}
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <Shield className="h-6 w-6 text-muted-foreground" />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-mono font-semibold text-[hsl(var(--risk-critical))]">
                    {criticalFindings.length}
                  </p>
                  <p className="text-xs text-muted-foreground">Critical Findings</p>
                </div>
                <XCircle className="h-8 w-8 text-[hsl(var(--risk-critical))]/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-mono font-semibold text-[hsl(var(--risk-high))]">
                    {highFindings.length}
                  </p>
                  <p className="text-xs text-muted-foreground">High Findings</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-[hsl(var(--risk-high))]/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-mono font-semibold text-foreground">
                    {vulnerabilities.total}
                  </p>
                  <p className="text-xs text-muted-foreground">Vulnerabilities</p>
                </div>
                <Eye className="h-8 w-8 text-muted-foreground/30" />
              </div>
            </CardContent>
          </Card>
          <Card className="border-border/50 bg-card/50">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-2xl font-mono font-semibold text-[hsl(var(--status-success))]">
                    {controls.implemented}%
                  </p>
                  <p className="text-xs text-muted-foreground">Controls Implemented</p>
                </div>
                <CheckCircle2 className="h-8 w-8 text-[hsl(var(--status-success))]/30" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-6">
          {/* MITRE ATLAS Mapping */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Zap className="h-4 w-4 text-primary" />
                MITRE ATLAS Coverage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {mitreMapping.map((item, idx) => (
                <div key={idx} className="space-y-1.5">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-muted-foreground">{item.id}</span>
                      <span className="text-foreground">{item.technique}</span>
                    </div>
                    <Badge 
                      variant="outline" 
                      className={cn(
                        "text-[10px]",
                        item.status === 'mitigated' && "border-[hsl(var(--status-success))]/50 text-[hsl(var(--status-success))]",
                        item.status === 'partial' && "border-[hsl(var(--status-warning))]/50 text-[hsl(var(--status-warning))]",
                        item.status === 'vulnerable' && "border-[hsl(var(--status-error))]/50 text-[hsl(var(--status-error))]"
                      )}
                    >
                      {item.status}
                    </Badge>
                  </div>
                  <Progress value={item.coverage} className="h-1.5" />
                </div>
              ))}
              <a 
                href="https://atlas.mitre.org" 
                target="_blank" 
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-primary hover:underline mt-4"
              >
                View full ATLAS framework
                <ExternalLink className="h-3 w-3" />
              </a>
            </CardContent>
          </Card>

          {/* Vulnerability Breakdown */}
          <Card className="border-border/50 bg-card/50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base font-medium flex items-center gap-2">
                <Lock className="h-4 w-4 text-primary" />
                Vulnerability Breakdown
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {Object.entries(vulnerabilities.bySeverity).map(([severity, count]) => (
                  <div key={severity} className="flex items-center gap-4">
                    <Badge 
                      className={cn(
                        "w-20 justify-center text-[10px] uppercase",
                        severityColors[severity as keyof typeof severityColors]
                      )}
                    >
                      {severity}
                    </Badge>
                    <div className="flex-1">
                      <Progress 
                        value={(count / vulnerabilities.total) * 100} 
                        className="h-2"
                      />
                    </div>
                    <span className="font-mono text-sm tabular-nums w-8 text-right">{count}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border/50">
                <h4 className="text-sm font-medium mb-3">Top Findings</h4>
                <div className="space-y-2">
                  {findings.slice(0, 5).map((finding, idx) => (
                    <div key={idx} className="flex items-start gap-3 p-2 rounded-md bg-muted/30">
                      <Badge 
                        className={cn(
                          "text-[9px] uppercase shrink-0 mt-0.5",
                          severityColors[finding.severity as keyof typeof severityColors]
                        )}
                      >
                        {finding.severity}
                      </Badge>
                      <div className="min-w-0">
                        <p className="text-sm text-foreground truncate">{finding.title}</p>
                        <p className="text-xs text-muted-foreground truncate">{finding.category}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Control Categories */}
        <Card className="border-border/50 bg-card/50">
          <CardHeader className="pb-3">
            <CardTitle className="text-base font-medium">Security Controls by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {controls.categories.map((cat, idx) => (
                <div key={idx} className="p-4 rounded-lg border border-border/50 bg-muted/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-foreground">{cat.name}</span>
                    <span className="font-mono text-sm tabular-nums">{cat.score}%</span>
                  </div>
                  <Progress value={cat.score} className="h-1.5" />
                  <p className="text-xs text-muted-foreground mt-2">
                    {cat.implemented}/{cat.total} controls
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </SidebarLayout>
  );
}
