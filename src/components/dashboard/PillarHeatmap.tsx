import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { mockPillars } from '@/data/mockData';
import { cn } from '@/lib/utils';

export function PillarHeatmap() {
  // Semantic heatmap colors using score tiers
  const getHeatColor = (score: number) => {
    if (score >= 80) return 'bg-score-excellent'; // Excellent - 80+
    if (score >= 60) return 'bg-score-good'; // Good - 60-80
    if (score >= 40) return 'bg-score-fair'; // Fair - 40-60
    if (score >= 20) return 'bg-score-poor'; // Poor - 20-40
    return 'bg-score-critical'; // Critical - <20
  };

  return (
    <Card className="lg:col-span-2">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-light">Pillar Heatmap</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-3 gap-3">
          {mockPillars.map((pillar) => (
            <div
              key={pillar.id}
              className={cn(
                'p-4 rounded-lg transition-all hover:scale-[1.02] cursor-default min-h-[80px] flex flex-col justify-between',
                getHeatColor(pillar.score)
              )}
            >
              <div className="text-sm font-light text-white/90 leading-tight">
                {pillar.name}
              </div>
              <div className="text-2xl font-light text-white mt-2">
                {pillar.score}%
              </div>
            </div>
          ))}
        </div>
        
        {/* Legend using semantic tokens */}
        <div className="flex items-center justify-center gap-4 mt-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded bg-score-critical" />
            <span>&lt;20</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded bg-score-poor" />
            <span>20-40</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded bg-score-fair" />
            <span>40-60</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded bg-score-good" />
            <span>60-80</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-3 rounded bg-score-excellent" />
            <span>80+</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
