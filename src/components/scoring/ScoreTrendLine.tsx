import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';
import { useMemo } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';

interface ScoreTrendLineProps {
  currentScore: number;
}

export function ScoreTrendLine({ currentScore }: ScoreTrendLineProps) {
  const trendData = useMemo(() => {
    // Generate historical score data
    const data = [
      { date: 'Week 1', score: 520, delta: 0 },
      { date: 'Week 2', score: 545, delta: 25 },
      { date: 'Week 3', score: 562, delta: 17 },
      { date: 'Week 4', score: 590, delta: 28 },
      { date: 'Week 5', score: 615, delta: 25 },
      { date: 'Week 6', score: currentScore, delta: currentScore - 615 },
    ];
    return data;
  }, [currentScore]);

  const totalDelta = currentScore - 520;
  const isPositive = totalDelta > 0;

  return (
    <Card className="border-border/50">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-light">Score Trend</CardTitle>
          <div className={`flex items-center gap-1 text-sm ${isPositive ? 'text-primary' : 'text-risk-critical'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
            <span className="font-light">{isPositive ? '+' : ''}{totalDelta} pts</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={120}>
          <LineChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="trendGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="hsl(var(--secondary))" />
                <stop offset="100%" stopColor="hsl(var(--primary))" />
              </linearGradient>
            </defs>
            <XAxis 
              dataKey="date" 
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis 
              domain={[450, 750]}
              tick={{ fontSize: 9, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '11px',
              }}
              formatter={(value: number, name: string) => {
                if (name === 'score') return [value, 'Score'];
                return [value, name];
              }}
            />
            <ReferenceLine 
              y={650} 
              stroke="hsl(var(--muted-foreground))" 
              strokeDasharray="3 3" 
              label={{ 
                value: 'Target', 
                position: 'right', 
                fontSize: 9, 
                fill: 'hsl(var(--muted-foreground))' 
              }} 
            />
            <Line 
              type="monotone" 
              dataKey="score" 
              stroke="url(#trendGradient)"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 3 }}
              activeDot={{ fill: 'hsl(var(--primary))', strokeWidth: 0, r: 5 }}
            />
          </LineChart>
        </ResponsiveContainer>
        
        {/* Delta breakdown */}
        <div className="flex items-center justify-between mt-3 pt-3 border-t border-border/50">
          <div className="text-xs text-muted-foreground font-light">
            6-Week Progress
          </div>
          <div className="flex gap-3">
            {trendData.slice(1).map((point, idx) => (
              <div 
                key={idx} 
                className={`text-[10px] px-1.5 py-0.5 rounded ${
                  point.delta > 0 ? 'bg-primary/20 text-primary' : 'bg-risk-critical/20 text-risk-critical'
                }`}
              >
                {point.delta > 0 ? '+' : ''}{point.delta}
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
