import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar } from 'recharts';
import { Scale, AlertTriangle, CheckCircle2, Info } from 'lucide-react';

const demographicParityData = [
  { group: 'Group A', approval: 72, baseline: 68 },
  { group: 'Group B', approval: 68, baseline: 68 },
  { group: 'Group C', approval: 65, baseline: 68 },
  { group: 'Group D', approval: 71, baseline: 68 },
  { group: 'Group E', approval: 58, baseline: 68 },
];

const shapFeatures = [
  { feature: 'Income', importance: 0.32, direction: 'positive' },
  { feature: 'Credit History', importance: 0.28, direction: 'positive' },
  { feature: 'Debt Ratio', importance: 0.18, direction: 'negative' },
  { feature: 'Employment', importance: 0.12, direction: 'positive' },
  { feature: 'Age', importance: 0.06, direction: 'neutral' },
  { feature: 'Location', importance: 0.04, direction: 'negative' },
];

const fairnessMetrics = [
  { metric: 'Statistical Parity', value: 0.87, threshold: 0.80, status: 'pass' },
  { metric: 'Equal Opportunity', value: 0.91, threshold: 0.80, status: 'pass' },
  { metric: 'Predictive Equality', value: 0.78, threshold: 0.80, status: 'fail' },
  { metric: 'Calibration', value: 0.94, threshold: 0.85, status: 'pass' },
  { metric: 'Disparate Impact (4/5)', value: 0.85, threshold: 0.80, status: 'pass' },
];

const radarData = [
  { axis: 'Accuracy', value: 85 },
  { axis: 'Fairness', value: 78 },
  { axis: 'Robustness', value: 72 },
  { axis: 'Explainability', value: 88 },
  { axis: 'Privacy', value: 91 },
  { axis: 'Security', value: 82 },
];

export function FairnessDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-purple-500/10 text-purple-500 border-purple-500/20">
          <Scale className="h-3 w-3 mr-1" />
          Fairness & Explainability
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">Bias Detection & Model Interpretation</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          AIF360 & Fairlearn integration with SHAP values, LIME explanations, and counterfactual generation
        </p>
      </div>

      {/* Fairness Metrics Grid */}
      <div className="grid md:grid-cols-5 gap-3">
        {fairnessMetrics.map((m) => (
          <Card key={m.metric} className={`${m.status === 'fail' ? 'border-red-500/30 bg-red-500/5' : ''}`}>
            <CardContent className="p-4 text-center">
              <div className="text-xs text-muted-foreground mb-1">{m.metric}</div>
              <div className={`text-2xl font-semibold ${m.status === 'pass' ? 'text-green-500' : 'text-red-500'}`}>
                {(m.value * 100).toFixed(0)}%
              </div>
              <div className="text-xs text-muted-foreground">
                threshold: {(m.threshold * 100).toFixed(0)}%
              </div>
              {m.status === 'pass' ? (
                <CheckCircle2 className="h-4 w-4 text-green-500 mx-auto mt-2" />
              ) : (
                <AlertTriangle className="h-4 w-4 text-red-500 mx-auto mt-2" />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Demographic Parity Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Demographic Parity Analysis</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={demographicParityData} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
                <XAxis 
                  dataKey="group" 
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <YAxis 
                  domain={[50, 80]}
                  tick={{ fontSize: 11, fill: 'hsl(var(--muted-foreground))' }}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: 'hsl(var(--card))',
                    border: '1px solid hsl(var(--border))',
                    borderRadius: '8px',
                  }}
                />
                <Bar dataKey="approval" radius={[4, 4, 0, 0]}>
                  {demographicParityData.map((entry, index) => (
                    <Cell 
                      key={index} 
                      fill={entry.approval < 60 ? 'hsl(0, 60%, 50%)' : 'hsl(var(--primary))'}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
              <AlertTriangle className="h-3 w-3 text-red-500" />
              Group E shows 15% lower approval rate - potential disparate impact
            </div>
          </CardContent>
        </Card>

        {/* Radar Chart */}
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Responsible AI Radar</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="hsl(var(--border))" />
                <PolarAngleAxis 
                  dataKey="axis" 
                  tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                />
                <PolarRadiusAxis 
                  angle={30} 
                  domain={[0, 100]}
                  tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
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
          </CardContent>
        </Card>
      </div>

      {/* SHAP Feature Importance */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            SHAP Feature Importance
            <Badge variant="outline" className="text-xs">Explainability Engine</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {shapFeatures.map((f) => (
              <div key={f.feature} className="flex items-center gap-4">
                <div className="w-28 text-sm">{f.feature}</div>
                <div className="flex-1">
                  <Progress 
                    value={f.importance * 100} 
                    className={`h-6 ${
                      f.direction === 'positive' ? '[&>div]:bg-green-500' :
                      f.direction === 'negative' ? '[&>div]:bg-red-500' : ''
                    }`}
                  />
                </div>
                <div className="w-16 text-right text-sm font-medium">
                  {f.direction === 'positive' && '+'}
                  {f.direction === 'negative' && '-'}
                  {(f.importance * 100).toFixed(0)}%
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Counterfactual */}
      <Card className="border-blue-500/30 bg-blue-500/5">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Info className="h-4 w-4 text-blue-500" />
            Counterfactual Explanation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="bg-muted/50 p-4 rounded-lg font-mono text-sm">
            <div className="text-muted-foreground mb-2">// For applicant #4821 (Denied)</div>
            <div className="text-foreground">
              <span className="text-blue-400">If</span> income increased by <span className="text-green-500">$12,000</span> (from $48k → $60k)
            </div>
            <div className="text-foreground">
              <span className="text-blue-400">Or</span> debt_ratio decreased by <span className="text-green-500">8%</span> (from 42% → 34%)
            </div>
            <div className="text-foreground mt-2">
              <span className="text-blue-400">Then</span> prediction would change: <span className="text-red-500">Denied</span> → <span className="text-green-500">Approved</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
