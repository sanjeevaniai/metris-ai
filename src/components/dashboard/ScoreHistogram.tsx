import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface ScoreHistogramProps {
  systems: Array<{ overallScore: number }>;
}

export function ScoreHistogram({ systems }: ScoreHistogramProps) {
  // Create histogram buckets
  // Semantic score tier colors
  const buckets = [
    { range: '0-200', min: 0, max: 200, count: 0, color: 'hsl(var(--score-critical))' },
    { range: '200-400', min: 200, max: 400, count: 0, color: 'hsl(var(--score-poor))' },
    { range: '400-600', min: 400, max: 600, count: 0, color: 'hsl(var(--score-fair))' },
    { range: '600-800', min: 600, max: 800, count: 0, color: 'hsl(var(--score-good))' },
    { range: '800-1000', min: 800, max: 1000, count: 0, color: 'hsl(var(--score-excellent))' },
  ];

  systems.forEach((system) => {
    const bucket = buckets.find((b) => system.overallScore >= b.min && system.overallScore < b.max);
    if (bucket) bucket.count++;
  });

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light">Score Distribution</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={180}>
          <BarChart data={buckets} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <XAxis 
              dataKey="range" 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={{ stroke: 'hsl(var(--border))' }}
              tickLine={false}
            />
            <YAxis 
              tick={{ fontSize: 10, fill: 'hsl(var(--muted-foreground))' }}
              axisLine={false}
              tickLine={false}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                border: '1px solid hsl(var(--border))',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} systems`, 'Count']}
            />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {buckets.map((entry, index) => (
                <Cell key={index} fill={entry.color} fillOpacity={0.8} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
