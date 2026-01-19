import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DEMO_PILLARS, getPillarColor } from "@/data/demoPillars";
import { Progress } from "@/components/ui/progress";
import { Layers } from "lucide-react";

export const PillarBreakdown = () => {
  // Sort pillars by weight (importance)
  const sortedPillars = [...DEMO_PILLARS].sort((a, b) => b.weight - a.weight);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <Layers className="h-5 w-5 text-primary" />
          Pillar Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {sortedPillars.slice(0, 8).map((pillar) => (
          <div key={pillar.id} className="space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground font-light truncate pr-2">
                {pillar.name}
              </span>
              <div className="flex items-center gap-2">
                <span 
                  className="font-mono text-xs"
                  style={{ color: getPillarColor(pillar.score) }}
                >
                  {pillar.score}
                </span>
                <span className="text-[10px] text-muted-foreground font-mono">
                  ({(pillar.weight * 100).toFixed(0)}%)
                </span>
              </div>
            </div>
            <div className="relative h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="absolute inset-y-0 left-0 rounded-full transition-all"
                style={{
                  width: `${(pillar.score / 1000) * 100}%`,
                  backgroundColor: getPillarColor(pillar.score),
                }}
              />
            </div>
          </div>
        ))}
        {DEMO_PILLARS.length > 8 && (
          <p className="text-xs text-muted-foreground text-center pt-2">
            +{DEMO_PILLARS.length - 8} more pillars
          </p>
        )}
      </CardContent>
    </Card>
  );
};
