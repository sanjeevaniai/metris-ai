import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { Leaf, Zap, Factory, GitBranch, Cloud, Cpu, TrendingDown } from 'lucide-react';

const carbonData = [
  { name: 'Training', value: 45, color: 'hsl(0, 60%, 50%)' },
  { name: 'Inference', value: 35, color: 'hsl(45, 70%, 50%)' },
  { name: 'Data Processing', value: 15, color: 'hsl(200, 60%, 50%)' },
  { name: 'Infrastructure', value: 5, color: 'hsl(var(--muted-foreground))' },
];

const energyMetrics = [
  { metric: 'Total kWh', value: '2,847', change: '-12%', trend: 'down' },
  { metric: 'CO₂ (kg)', value: '1,423', change: '-8%', trend: 'down' },
  { metric: 'PUE', value: '1.2', change: '-5%', trend: 'down' },
  { metric: 'Carbon Intensity', value: '0.42', change: '-15%', trend: 'down' },
];

const vendorRisks = [
  { vendor: 'OpenAI', risk: 'medium', score: 72, issues: ['Data retention policy unclear', 'Limited model transparency'] },
  { vendor: 'AWS Bedrock', risk: 'low', score: 88, issues: ['Minor logging gaps'] },
  { vendor: 'Hugging Face', risk: 'low', score: 91, issues: [] },
  { vendor: 'Custom Model (Internal)', risk: 'high', score: 45, issues: ['No model card', 'Missing bias testing', 'No versioning'] },
];

const lineageSteps = [
  { step: 'Data Collection', status: 'documented', artifacts: 3 },
  { step: 'Data Processing', status: 'documented', artifacts: 5 },
  { step: 'Feature Engineering', status: 'partial', artifacts: 2 },
  { step: 'Model Training', status: 'documented', artifacts: 4 },
  { step: 'Validation', status: 'documented', artifacts: 3 },
  { step: 'Deployment', status: 'partial', artifacts: 1 },
  { step: 'Monitoring', status: 'missing', artifacts: 0 },
];

export function EnvironmentalDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
          <Leaf className="h-3 w-3 mr-1" />
          Environmental & Supply Chain
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">Sustainable AI Governance</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Carbon footprint analysis, vendor risk assessment, and complete model lineage tracking
        </p>
      </div>

      {/* Carbon Footprint */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Cloud className="h-4 w-4 text-green-500" />
              Carbon Footprint Analysis
              <Badge variant="outline" className="text-xs">CodeCarbon</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-4">
              <ResponsiveContainer width={150} height={150}>
                <PieChart>
                  <Pie
                    data={carbonData}
                    innerRadius={40}
                    outerRadius={60}
                    paddingAngle={2}
                    dataKey="value"
                  >
                    {carbonData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-2 flex-1">
                {carbonData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2 text-sm">
                    <div className="w-3 h-3 rounded" style={{ backgroundColor: item.color }} />
                    <span className="flex-1">{item.name}</span>
                    <span className="font-medium">{item.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Zap className="h-4 w-4 text-yellow-500" />
              Energy Efficiency Metrics
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {energyMetrics.map((m) => (
                <div key={m.metric} className="p-3 bg-muted/30 rounded-lg">
                  <div className="text-xs text-muted-foreground">{m.metric}</div>
                  <div className="text-xl font-semibold">{m.value}</div>
                  <div className="flex items-center gap-1 text-xs text-green-500">
                    <TrendingDown className="h-3 w-3" />
                    {m.change} vs last month
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Third-Party Vendor Risk */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Factory className="h-4 w-4 text-orange-500" />
            Third-Party / Vendor Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {vendorRisks.map((vendor) => (
              <div 
                key={vendor.vendor}
                className={`p-4 rounded-lg border ${
                  vendor.risk === 'high' ? 'bg-red-500/5 border-red-500/20' :
                  vendor.risk === 'medium' ? 'bg-yellow-500/5 border-yellow-500/20' :
                  'bg-green-500/5 border-green-500/20'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-3">
                    <span className="font-medium">{vendor.vendor}</span>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        vendor.risk === 'high' ? 'text-red-500 border-red-500/30' :
                        vendor.risk === 'medium' ? 'text-yellow-500 border-yellow-500/30' :
                        'text-green-500 border-green-500/30'
                      }`}
                    >
                      {vendor.risk} risk
                    </Badge>
                  </div>
                  <div className={`text-lg font-semibold ${
                    vendor.score >= 80 ? 'text-green-500' :
                    vendor.score >= 60 ? 'text-yellow-500' : 'text-red-500'
                  }`}>
                    {vendor.score}
                  </div>
                </div>
                {vendor.issues.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {vendor.issues.map((issue, i) => (
                      <Badge key={i} variant="secondary" className="text-xs">
                        {issue}
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Model Lineage */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <GitBranch className="h-4 w-4 text-purple-500" />
            Model Lineage Tracking
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2 overflow-x-auto pb-4">
            {lineageSteps.map((step, i) => (
              <div key={step.step} className="flex items-center">
                <div 
                  className={`p-3 rounded-lg border min-w-[120px] text-center ${
                    step.status === 'documented' ? 'bg-green-500/5 border-green-500/20' :
                    step.status === 'partial' ? 'bg-yellow-500/5 border-yellow-500/20' :
                    'bg-red-500/5 border-red-500/20'
                  }`}
                >
                  <Cpu className={`h-4 w-4 mx-auto mb-1 ${
                    step.status === 'documented' ? 'text-green-500' :
                    step.status === 'partial' ? 'text-yellow-500' : 'text-red-500'
                  }`} />
                  <div className="text-xs font-medium truncate">{step.step}</div>
                  <div className="text-xs text-muted-foreground">{step.artifacts} artifacts</div>
                </div>
                {i < lineageSteps.length - 1 && (
                  <div className="w-6 h-0.5 bg-border mx-1" />
                )}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-4 text-xs text-muted-foreground mt-2">
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-green-500/20 border border-green-500/30" />
              Documented
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-yellow-500/20 border border-yellow-500/30" />
              Partial
            </span>
            <span className="flex items-center gap-1">
              <div className="w-3 h-3 rounded bg-red-500/20 border border-red-500/30" />
              Missing
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
