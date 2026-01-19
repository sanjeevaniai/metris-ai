import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_FRAMEWORKS } from "@/data/demoFrameworks";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { FileCheck, AlertTriangle, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export const FrameworkCompliance = () => {
  const getCoverageColor = (coverage: number) => {
    if (coverage >= 0.8) return "text-score-good";
    if (coverage >= 0.6) return "text-score-fair";
    if (coverage >= 0.4) return "text-risk-high";
    return "text-risk-critical";
  };

  const getProgressColor = (coverage: number) => {
    if (coverage >= 0.8) return "bg-score-good";
    if (coverage >= 0.6) return "bg-score-fair";
    if (coverage >= 0.4) return "bg-risk-high";
    return "bg-risk-critical";
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <FileCheck className="h-5 w-5 text-primary" />
          Framework Compliance
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {DEMO_FRAMEWORKS.map((framework) => (
          <div key={framework.id} className="space-y-1.5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-sm font-light">{framework.shortName}</span>
                {framework.critical && (
                  <AlertTriangle className="h-3.5 w-3.5 text-risk-critical" />
                )}
              </div>
              <div className="flex items-center gap-2">
                <span className={cn("font-mono text-sm", getCoverageColor(framework.coverage))}>
                  {(framework.coverage * 100).toFixed(0)}%
                </span>
                {framework.daysRemaining && (
                  <Badge 
                    variant="outline" 
                    className={cn(
                      "text-[10px] font-mono",
                      framework.daysRemaining < 150 && "border-risk-high/50 text-risk-high"
                    )}
                  >
                    <Clock className="h-2.5 w-2.5 mr-1" />
                    {framework.daysRemaining}d
                  </Badge>
                )}
              </div>
            </div>
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className={cn("absolute inset-y-0 left-0 rounded-full transition-all", getProgressColor(framework.coverage))}
                style={{ width: `${framework.coverage * 100}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-muted-foreground">
              <span>{framework.checkpointsAddressed}/{framework.checkpointsTotal} checkpoints</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
