import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_FORECAST, THRESHOLD_ALERTS } from "@/data/demoForecast";
import { DEMO_SCORE } from "@/data/demoScore";
import { LineChart, TrendingDown, AlertTriangle } from "lucide-react";
import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, Tooltip, ReferenceLine } from "recharts";
import { Badge } from "@/components/ui/badge";

export const ForecastChart = () => {
  const { currentPath, confidenceBandUpper, confidenceBandLower } = DEMO_FORECAST;
  const warningAlert = THRESHOLD_ALERTS.find((a) => a.type === "warning");

  // Add confidence bands to data
  const chartData = currentPath.map((point) => ({
    day: point.day,
    score: point.score,
    upper: Math.min(1000, point.score + confidenceBandUpper),
    lower: Math.max(0, point.score - confidenceBandLower),
  }));

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-light flex items-center gap-2">
            <LineChart className="h-5 w-5 text-primary" />
            90-Day Score Forecast
          </CardTitle>
          {warningAlert && (
            <Badge className="bg-risk-high/20 text-risk-high border-risk-high/30 text-xs">
              <AlertTriangle className="h-3 w-3 mr-1" />
              {warningAlert.daysUntilBreach}d to threshold
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-[200px]">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="forecastGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--primary))" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="hsl(var(--primary))" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="confidenceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.1} />
                  <stop offset="95%" stopColor="hsl(var(--muted-foreground))" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <XAxis 
                dataKey="day" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                tickFormatter={(v) => `+${v}d`}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10} 
                domain={[600, 850]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number, name: string) => {
                  if (name === "score") return [value, "Projected Score"];
                  if (name === "upper") return [value, "Upper Bound"];
                  if (name === "lower") return [value, "Lower Bound"];
                  return [value, name];
                }}
                labelFormatter={(label) => `Day ${label}`}
              />
              <ReferenceLine 
                y={750} 
                stroke="hsl(var(--risk-high))" 
                strokeDasharray="5 5" 
                strokeWidth={1.5}
              />
              <ReferenceLine 
                y={DEMO_SCORE.overall} 
                stroke="hsl(var(--primary))" 
                strokeDasharray="2 2"
                strokeWidth={1}
              />
              <Area 
                type="monotone" 
                dataKey="upper" 
                stroke="none" 
                fill="url(#confidenceGradient)" 
              />
              <Area 
                type="monotone" 
                dataKey="lower" 
                stroke="none" 
                fill="transparent" 
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="hsl(var(--primary))"
                strokeWidth={2}
                fill="url(#forecastGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-3 text-xs">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-primary rounded" />
              <span className="text-muted-foreground">Projected</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-0.5 bg-risk-high rounded" style={{ borderStyle: "dashed" }} />
              <span className="text-muted-foreground">Threshold (750)</span>
            </span>
          </div>
          <span className="text-muted-foreground font-mono">
            7-model ensemble • 78% directional accuracy
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
