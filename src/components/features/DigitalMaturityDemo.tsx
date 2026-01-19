import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Lightbulb, Server, Database, Users, Workflow, CheckCircle2, AlertTriangle } from 'lucide-react';

const maturityDimensions = [
  { dimension: 'Infrastructure', score: 78, level: 'Optimized' },
  { dimension: 'Data Management', score: 65, level: 'Managed' },
  { dimension: 'Automation', score: 72, level: 'Managed' },
  { dimension: 'AI/ML Ops', score: 58, level: 'Developing' },
  { dimension: 'Workforce Skills', score: 82, level: 'Optimized' },
  { dimension: 'Governance', score: 45, level: 'Initial' },
];

const radarData = maturityDimensions.map(d => ({
  axis: d.dimension,
  value: d.score
}));

const maturityLevels = [
  { level: 'Initial', range: '0-30', description: 'Ad-hoc processes, no standardization' },
  { level: 'Developing', range: '31-50', description: 'Some processes defined, limited adoption' },
  { level: 'Managed', range: '51-70', description: 'Standardized processes, consistent execution' },
  { level: 'Optimized', range: '71-85', description: 'Continuous improvement, metrics-driven' },
  { level: 'Leading', range: '86-100', description: 'Industry best practices, innovation-focused' },
];

const recommendations = [
  { 
    area: 'Governance', 
    priority: 'critical',
    recommendation: 'Implement AI governance framework with clear policies and accountability',
    impact: '+25 points'
  },
  { 
    area: 'AI/ML Ops', 
    priority: 'high',
    recommendation: 'Establish ML model registry and automated retraining pipelines',
    impact: '+15 points'
  },
  { 
    area: 'Data Management', 
    priority: 'medium',
    recommendation: 'Implement data lineage tracking and quality monitoring',
    impact: '+10 points'
  },
];

export function DigitalMaturityDemo() {
  const overallScore = Math.round(
    maturityDimensions.reduce((a, b) => a + b.score, 0) / maturityDimensions.length
  );

  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-cyan-500/10 text-cyan-500 border-cyan-500/20">
          <Lightbulb className="h-3 w-3 mr-1" />
          Digital Maturity (Agent 25)
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">Digitization Maturity Assessment</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Infrastructure, data, automation, and workforce readiness evaluation
        </p>
      </div>

      {/* Overall Score */}
      <Card className="border-primary/30">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Overall Digital Maturity Score</div>
              <div className="text-5xl font-bold text-primary">{overallScore}</div>
              <div className="text-lg text-muted-foreground">Managed Level</div>
            </div>
            <div className="w-64">
              <ResponsiveContainer width="100%" height={150}>
                <RadarChart data={radarData}>
                  <PolarGrid stroke="hsl(var(--border))" />
                  <PolarAngleAxis 
                    dataKey="axis" 
                    tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
                  />
                  <PolarRadiusAxis 
                    angle={30} 
                    domain={[0, 100]}
                    tick={false}
                  />
                  <Radar
                    name="Score"
                    dataKey="value"
                    stroke="hsl(var(--primary))"
                    fill="hsl(var(--primary))"
                    fillOpacity={0.3}
                  />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Dimension Breakdown */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Maturity by Dimension</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {maturityDimensions.map((dim) => (
              <div key={dim.dimension} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    {dim.dimension === 'Infrastructure' && <Server className="h-4 w-4 text-blue-500" />}
                    {dim.dimension === 'Data Management' && <Database className="h-4 w-4 text-green-500" />}
                    {dim.dimension === 'Automation' && <Workflow className="h-4 w-4 text-purple-500" />}
                    {dim.dimension === 'AI/ML Ops' && <Lightbulb className="h-4 w-4 text-yellow-500" />}
                    {dim.dimension === 'Workforce Skills' && <Users className="h-4 w-4 text-cyan-500" />}
                    {dim.dimension === 'Governance' && <AlertTriangle className="h-4 w-4 text-red-500" />}
                    <span className="font-medium">{dim.dimension}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge 
                      variant="outline" 
                      className={`text-xs ${
                        dim.score >= 71 ? 'text-green-500 border-green-500/30' :
                        dim.score >= 51 ? 'text-yellow-500 border-yellow-500/30' :
                        'text-red-500 border-red-500/30'
                      }`}
                    >
                      {dim.level}
                    </Badge>
                    <span className="font-semibold w-8 text-right">{dim.score}</span>
                  </div>
                </div>
                <Progress 
                  value={dim.score} 
                  className={`h-2 ${
                    dim.score >= 71 ? '[&>div]:bg-green-500' :
                    dim.score >= 51 ? '[&>div]:bg-yellow-500' :
                    '[&>div]:bg-red-500'
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Maturity Levels Legend */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Maturity Level Framework</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {maturityLevels.map((level, i) => (
              <div 
                key={level.level}
                className={`p-3 rounded-lg border text-center ${
                  i === 2 ? 'bg-primary/10 border-primary/30' : 'bg-muted/30 border-border/50'
                }`}
              >
                <div className="text-sm font-medium">{level.level}</div>
                <div className="text-xs text-muted-foreground">{level.range}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recommendations */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Priority Recommendations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {recommendations.map((rec, i) => (
              <div 
                key={i}
                className={`p-4 rounded-lg border ${
                  rec.priority === 'critical' ? 'bg-red-500/5 border-red-500/20' :
                  rec.priority === 'high' ? 'bg-orange-500/5 border-orange-500/20' :
                  'bg-yellow-500/5 border-yellow-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        rec.priority === 'critical' ? 'text-red-500 border-red-500/30' :
                        rec.priority === 'high' ? 'text-orange-500 border-orange-500/30' :
                        'text-yellow-500 border-yellow-500/30'
                      }`}
                    >
                      {rec.priority}
                    </Badge>
                    <span className="font-medium">{rec.area}</span>
                  </div>
                  <Badge className="bg-green-500/20 text-green-500">
                    {rec.impact}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground">{rec.recommendation}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
