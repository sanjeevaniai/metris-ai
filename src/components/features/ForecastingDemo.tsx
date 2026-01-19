import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

const forecastingModels = [
  { name: 'ARIMA', accuracy: 78, color: 'hsl(var(--primary))' },
  { name: 'Prophet', accuracy: 82, color: 'hsl(var(--secondary))' },
  { name: 'Exp. Smoothing', accuracy: 75, color: 'hsl(164, 50%, 45%)' },
  { name: 'TFT', accuracy: 88, color: 'hsl(45, 80%, 55%)' },
  { name: 'N-BEATS', accuracy: 85, color: 'hsl(280, 60%, 55%)' },
  { name: 'xLSTM', accuracy: 86, color: 'hsl(200, 70%, 50%)' },
  { name: 'TimeXer', accuracy: 84, color: 'hsl(340, 60%, 55%)' },
];

// Generate mock forecast data
const generateForecastData = () => {
  const data = [];
  let score = 720;
  
  // Historical (past 30 days)
  for (let i = -30; i <= 0; i++) {
    score += (Math.random() - 0.45) * 8;
    score = Math.max(600, Math.min(850, score));
    data.push({
      day: i,
      actual: Math.round(score),
      type: 'historical'
    });
  }
  
  // Forecast (next 90 days)
  let forecastScore = score;
  for (let i = 1; i <= 90; i++) {
    forecastScore += (Math.random() - 0.4) * 6;
    forecastScore = Math.max(650, Math.min(900, forecastScore));
    const uncertainty = i * 0.8;
    data.push({
      day: i,
      forecast: Math.round(forecastScore),
      upper: Math.round(forecastScore + uncertainty),
      lower: Math.round(forecastScore - uncertainty),
      type: 'forecast'
    });
  }
  
  return data;
};

const forecastData = generateForecastData();

export function ForecastingDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
          <TrendingUp className="h-3 w-3 mr-1" />
          Predictive Forecasting
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">7-Model Ensemble Forecasting</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Multi-horizon predictions using ARIMA, Prophet, Exponential Smoothing, TFT, N-BEATS, xLSTM, and TimeXer
        </p>
      </div>

      {/* Model Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
        {forecastingModels.map((model) => (
          <Card key={model.name} className="text-center p-4 hover:border-primary/50 transition-colors">
            <div className="text-xs text-muted-foreground mb-1">{model.name}</div>
            <div className="text-2xl font-semibold" style={{ color: model.color }}>
              {model.accuracy}%
            </div>
            <div className="text-xs text-muted-foreground">accuracy</div>
          </Card>
        ))}
      </div>

      {/* Forecast Chart */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span>90-Day Compliance Score Trajectory</span>
            <div className="flex items-center gap-4 text-xs">
              <span className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-primary" />
                Historical
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-0.5 bg-secondary" />
                Forecast
              </span>
              <span className="flex items-center gap-1">
                <div className="w-3 h-3 bg-secondary/20 rounded" />
                95% CI
              </span>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={forecastData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--secondary))" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="hsl(var(--secondary))" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                tickFormatter={(v) => v === 0 ? 'Today' : v > 0 ? `+${v}d` : `${v}d`}
              />
              <YAxis 
                domain={[500, 900]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                }}
              />
              {/* Confidence interval */}
              <Area
                dataKey="upper"
                stroke="none"
                fill="url(#confidenceGradient)"
                fillOpacity={1}
              />
              <Area
                dataKey="lower"
                stroke="none"
                fill="hsl(var(--background))"
                fillOpacity={1}
              />
              {/* Historical line */}
              <Line
                dataKey="actual"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                dot={false}
              />
              {/* Forecast line */}
              <Line
                dataKey="forecast"
                stroke="hsl(var(--secondary))"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Horizon Cards */}
      <div className="grid md:grid-cols-4 gap-4">
        {[
          { horizon: '30-Day', score: 742, trend: '+12', status: 'positive' },
          { horizon: '90-Day', score: 768, trend: '+38', status: 'positive' },
          { horizon: '6-Month', score: 795, trend: '+65', status: 'positive' },
          { horizon: '12-Month', score: 812, trend: '+82', status: 'warning' },
        ].map((item) => (
          <Card key={item.horizon} className="p-4">
            <div className="text-xs text-muted-foreground mb-1">{item.horizon} Forecast</div>
            <div className="text-3xl font-semibold">{item.score}</div>
            <div className={`flex items-center gap-1 text-sm ${item.status === 'positive' ? 'text-green-500' : 'text-yellow-500'}`}>
              {item.status === 'positive' ? <CheckCircle2 className="h-3 w-3" /> : <AlertTriangle className="h-3 w-3" />}
              {item.trend} points
            </div>
          </Card>
        ))}
      </div>

      {/* Alerts */}
      <Card className="border-yellow-500/30 bg-yellow-500/5">
        <CardContent className="p-4 flex items-start gap-3">
          <AlertTriangle className="h-5 w-5 text-yellow-500 mt-0.5" />
          <div>
            <div className="font-medium text-yellow-500">Drift Detection Alert</div>
            <div className="text-sm text-muted-foreground">
              Model drift detected in Credit Risk AI. Compliance score degrading at -2.3 points/week. 
              Predicted to cross 750 threshold in 18 days without intervention.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
