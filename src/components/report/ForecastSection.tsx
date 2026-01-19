import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { TrendingUp, TrendingDown, Calendar, DollarSign } from 'lucide-react';
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip, Legend, CartesianGrid } from 'recharts';

interface ForecastSectionProps {
  currentScore: number;
  currentExposure: number;
}

export function ForecastSection({ currentScore, currentExposure }: ForecastSectionProps) {
  // Generate forecast data for 90, 180, 270, 365 days
  const forecastData = [
    { days: 0, label: 'Today', score: currentScore, exposure: currentExposure, roi: 0 },
    { days: 90, label: '90 Days', score: Math.min(1000, currentScore + 35), exposure: currentExposure * 0.75, roi: currentExposure * 0.25 },
    { days: 180, label: '180 Days', score: Math.min(1000, currentScore + 55), exposure: currentExposure * 0.55, roi: currentExposure * 0.45 },
    { days: 270, label: '270 Days', score: Math.min(1000, currentScore + 70), exposure: currentExposure * 0.38, roi: currentExposure * 0.62 },
    { days: 365, label: '365 Days', score: Math.min(1000, currentScore + 80), exposure: currentExposure * 0.25, roi: currentExposure * 0.75 },
  ];

  const chartData = forecastData.map(d => ({
    name: d.label,
    'METRIS Score': d.score,
    'Risk Exposure (€K)': Math.round(d.exposure / 1000),
    'ROI Captured (€K)': Math.round(d.roi / 1000),
  }));

  const finalScore = forecastData[forecastData.length - 1].score;
  const totalROI = forecastData[forecastData.length - 1].roi;
  const riskReduction = ((currentExposure - forecastData[forecastData.length - 1].exposure) / currentExposure * 100).toFixed(0);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calendar className="h-5 w-5 text-primary" />
          Risk Trajectory Forecast
        </CardTitle>
        <CardDescription>
          Projected score improvement and ROI over 90-180-270-365 day horizons
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {forecastData.slice(1).map((forecast, idx) => (
            <div
              key={forecast.days}
              className="p-4 rounded-lg bg-muted/50 border border-border hover:border-primary/30 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <Badge variant="outline" className="text-xs">
                  {forecast.days} Days
                </Badge>
                {idx === forecastData.length - 2 && (
                  <Badge className="text-xs gradient-primary text-primary-foreground">
                    Target
                  </Badge>
                )}
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Score</span>
                  <div className="flex items-center gap-1">
                    <span className="font-bold text-primary">{forecast.score}</span>
                    <TrendingUp className="h-3 w-3 text-primary" />
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">Exposure</span>
                  <span className="text-sm font-medium text-risk-medium">
                    €{(forecast.exposure / 1000).toFixed(0)}K
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-muted-foreground">ROI</span>
                  <span className="text-sm font-medium text-gradient">
                    €{(forecast.roi / 1000).toFixed(0)}K
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Forecast Chart */}
        <div className="h-[280px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                fontWeight={300}
              />
              <YAxis 
                yAxisId="score" 
                orientation="left" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                fontWeight={300}
                domain={[0, 1000]}
              />
              <YAxis 
                yAxisId="money" 
                orientation="right" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12}
                fontWeight={300}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontWeight: 300,
                }}
              />
              <Legend wrapperStyle={{ fontWeight: 300, fontSize: '12px' }} />
              <Line
                yAxisId="score"
                type="monotone"
                dataKey="METRIS Score"
                stroke="hsl(164, 70%, 50%)"
                strokeWidth={3}
                dot={{ fill: 'hsl(164, 70%, 50%)', strokeWidth: 2, r: 5 }}
                activeDot={{ r: 7, fill: 'hsl(164, 70%, 60%)' }}
              />
              <Line
                yAxisId="money"
                type="monotone"
                dataKey="Risk Exposure (€K)"
                stroke="hsl(45, 93%, 47%)"
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={{ fill: 'hsl(45, 93%, 47%)', strokeWidth: 2, r: 4 }}
              />
              <Line
                yAxisId="money"
                type="monotone"
                dataKey="ROI Captured (€K)"
                stroke="hsl(142, 71%, 45%)"
                strokeWidth={2}
                dot={{ fill: 'hsl(142, 71%, 45%)', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="p-4 rounded-lg gradient-primary/10 border border-primary/30">
          <h4 className="font-medium mb-3 flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary" />
            12-Month Forecast Summary
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-sm text-muted-foreground">Projected Final Score</p>
              <p className="text-2xl font-bold text-primary">{finalScore}</p>
              <p className="text-xs text-muted-foreground">+{finalScore - currentScore} from today</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Risk Reduction</p>
              <p className="text-2xl font-bold text-emerald-400">{riskReduction}%</p>
              <p className="text-xs text-muted-foreground">Exposure eliminated</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total ROI Captured</p>
              <p className="text-2xl font-bold text-gradient">€{(totalROI / 1000).toFixed(0)}K</p>
              <p className="text-xs text-muted-foreground">Value protected</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
