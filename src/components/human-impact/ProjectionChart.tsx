// 90-Day Projection Chart Component

import { Card, CardContent } from '@/components/ui/card';
import { DEMO_90_DAY_PROJECTIONS, formatHumanCount } from '@/data/demoHumanImpact';
import { formatCurrency } from '@/data/demoFinancialRisk';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

export function ProjectionChart() {
  const projections = DEMO_90_DAY_PROJECTIONS;
  
  const chartData = [
    { 
      day: 'Today', 
      affected: projections.current.affected,
      exposure: projections.current.exposure,
    },
    { 
      day: '30 days', 
      affected: projections.days30.affected,
      exposure: projections.days30.exposure,
    },
    { 
      day: '60 days', 
      affected: projections.days60.affected,
      exposure: projections.days60.exposure,
    },
    { 
      day: '90 days', 
      affected: projections.days90.affected,
      exposure: projections.days90.exposure,
    },
  ];

  const milestones = [
    { 
      label: '@ 30 days', 
      additional: projections.days30.additionalAffected,
    },
    { 
      label: '@ 60 days', 
      additional: projections.days60.additionalAffected,
    },
    { 
      label: '@ 90 days', 
      additional: projections.days90.additionalAffected,
    },
  ];

  return (
    <Card>
      <CardContent className="p-6">
        <div className="mb-6">
          <h3 className="text-sm font-medium text-muted-foreground mb-4">
            Affected Population Trajectory
          </h3>
          
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="affectedGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="hsl(var(--status-critical))" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="hsl(var(--status-critical))" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid 
                  strokeDasharray="3 3" 
                  stroke="hsl(var(--border))" 
                  opacity={0.3}
                />
                <XAxis 
                  dataKey="day" 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  stroke="hsl(var(--muted-foreground))"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => formatHumanCount(value)}
                />
                <Tooltip 
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-card border border-border rounded-lg p-3 shadow-lg">
                          <p className="text-sm font-medium text-foreground mb-1">{label}</p>
                          <p className="text-sm text-status-critical">
                            {formatHumanCount(payload[0].value as number)} affected
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="affected"
                  stroke="hsl(var(--status-critical))"
                  strokeWidth={3}
                  fill="url(#affectedGradient)"
                  dot={{ 
                    fill: 'hsl(var(--status-critical))', 
                    strokeWidth: 2,
                    r: 6,
                    stroke: 'hsl(var(--background))'
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Milestone cards */}
        <div className="grid grid-cols-3 gap-4 pt-4 border-t border-border/50">
          {milestones.map((milestone) => (
            <div 
              key={milestone.label}
              className="text-center p-4 rounded-lg bg-status-critical/5 border border-status-critical/20"
            >
              <div className="text-xl font-bold font-mono text-status-critical">
                +{formatHumanCount(milestone.additional)}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                additional
              </div>
              <div className="text-xs text-muted-foreground/60">
                {milestone.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
