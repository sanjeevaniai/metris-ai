import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_FINANCIAL_RISK, formatCurrency } from "@/data/demoFinancialRisk";
import { BarChart3 } from "lucide-react";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, ReferenceLine, Cell } from "recharts";

export const MonteCarloChart = () => {
  const { monteCarloResults } = DEMO_FINANCIAL_RISK;
  
  const chartData = monteCarloResults.distribution.map((d, i) => ({
    exposure: d.exposure,
    probability: d.probability * 100,
    label: formatCurrency(d.exposure),
    isVaR: d.exposure >= 2000000,
  }));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-primary" />
          Monte Carlo Distribution
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[180px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
              <XAxis 
                dataKey="label"
                stroke="hsl(var(--muted-foreground))" 
                fontSize={9}
                angle={-45}
                textAnchor="end"
                height={50}
                interval={1}
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={10}
                tickFormatter={(v) => `${v}%`}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "12px",
                }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Probability"]}
                labelFormatter={(label) => `Exposure: ${label}`}
              />
              <ReferenceLine 
                x={formatCurrency(2000000)}
                stroke="hsl(var(--risk-high))" 
                strokeDasharray="5 5" 
                strokeWidth={1.5}
              />
              <Bar dataKey="probability" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell 
                    key={`cell-${index}`}
                    fill={entry.isVaR ? "hsl(var(--risk-high))" : "hsl(var(--primary))"}
                    opacity={entry.isVaR ? 0.8 : 0.7}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
        <div className="flex items-center justify-between mt-2 text-xs text-muted-foreground">
          <span>10,000 iterations</span>
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded bg-risk-high" />
            VaR 95% tail
          </span>
        </div>
      </CardContent>
    </Card>
  );
};
