import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from 'recharts';
import { DEMO_SCORE_HISTORY } from '@/data/demoMonitoring';

export function LiveScoreTrajectory() {
  const chartData = DEMO_SCORE_HISTORY.map(item => ({
    ...item,
    displayDate: new Date(item.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
  }));

  // Add projected data points
  const lastScore = DEMO_SCORE_HISTORY[DEMO_SCORE_HISTORY.length - 1].score;
  const projectedData = [
    { displayDate: 'Jan 20', score: null, projected: lastScore - 3 },
    { displayDate: 'Jan 24', score: null, projected: lastScore - 7 },
    { displayDate: 'Jan 28', score: null, projected: lastScore - 10 },
  ];

  const combinedData = [
    ...chartData.map(d => ({ ...d, projected: null })),
    ...projectedData,
  ];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Live Score Trajectory
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={combinedData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="projectedGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={{ stroke: 'hsl(var(--border))' }}
                tickLine={false}
              />
              <YAxis 
                domain={[600, 800]}
                tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
                axisLine={false}
                tickLine={false}
                width={35}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'hsl(var(--card))', 
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: '12px'
                }}
                labelStyle={{ color: 'hsl(var(--foreground))' }}
              />
              <ReferenceLine 
                y={750} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="3 3" 
                strokeOpacity={0.5}
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#scoreGradient)"
                connectNulls={false}
              />
              <Area
                type="monotone"
                dataKey="projected"
                stroke="hsl(var(--muted-foreground))"
                strokeWidth={2}
                strokeDasharray="5 5"
                fill="url(#projectedGradient)"
                connectNulls={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-center gap-6 mt-3 pt-3 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-primary rounded" />
            <span className="text-xs text-muted-foreground">Actual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-0.5 bg-muted-foreground rounded border-dashed" style={{ borderStyle: 'dashed' }} />
            <span className="text-xs text-muted-foreground">Projected</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
