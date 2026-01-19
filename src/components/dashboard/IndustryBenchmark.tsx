import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Minus, Target } from 'lucide-react';

interface BenchmarkData {
  category: string;
  yourScore: number;
  benchmark: number;
  unit: string;
}

export function IndustryBenchmark() {
  const benchmarks: BenchmarkData[] = [
    { category: 'Overall Governance Score', yourScore: 648, benchmark: 650, unit: '/1000' },
    { category: 'AI Strategy & Vision', yourScore: 78, benchmark: 72, unit: '%' },
    { category: 'EU AI Act Compliance', yourScore: 48, benchmark: 65, unit: '%' },
    { category: 'Model Lifecycle Maturity', yourScore: 62, benchmark: 58, unit: '%' },
    { category: 'Data Governance', yourScore: 70, benchmark: 68, unit: '%' },
    { category: 'Risk Quantification', yourScore: 55, benchmark: 52, unit: '%' },
  ];

  const getTrendIcon = (yours: number, bench: number) => {
    const diff = yours - bench;
    if (diff > 3) return <TrendingUp className="h-4 w-4 text-primary" />;
    if (diff < -3) return <TrendingDown className="h-4 w-4 text-risk-critical" />;
    return <Minus className="h-4 w-4 text-muted-foreground" />;
  };

  const getDiffColor = (yours: number, bench: number) => {
    const diff = yours - bench;
    if (diff > 0) return 'text-primary';
    if (diff < 0) return 'text-risk-critical';
    return 'text-muted-foreground';
  };

  const getPerformanceLabel = (yours: number, bench: number) => {
    const diff = yours - bench;
    if (diff > 10) return 'Exceeds';
    if (diff > 0) return 'Above';
    if (diff === 0) return 'At Benchmark';
    if (diff > -10) return 'Below';
    return 'Needs Focus';
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-light flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            Industry Benchmark Comparison
          </CardTitle>
          <span className="text-xs text-muted-foreground">vs. Financial Services Sector Average</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {benchmarks.map((item) => (
            <div key={item.category} className="p-3 rounded-lg bg-muted/30 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground font-light">{item.category}</span>
                {getTrendIcon(item.yourScore, item.benchmark)}
              </div>
              <div className="relative h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className="absolute h-full bg-primary rounded-full transition-all"
                  style={{ 
                    width: `${(item.yourScore / (item.unit === '/1000' ? 1000 : 100)) * 100}%` 
                  }}
                />
                {/* Benchmark marker */}
                <div 
                  className="absolute top-0 h-full w-0.5 bg-foreground"
                  style={{ 
                    left: `${(item.benchmark / (item.unit === '/1000' ? 1000 : 100)) * 100}%` 
                  }}
                />
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-medium">
                  {item.yourScore}{item.unit}
                </span>
                <span className={getDiffColor(item.yourScore, item.benchmark)}>
                  {item.yourScore > item.benchmark ? '+' : ''}{item.yourScore - item.benchmark} 
                  <span className="text-muted-foreground ml-1">
                    ({getPerformanceLabel(item.yourScore, item.benchmark)})
                  </span>
                </span>
              </div>
              <div className="text-[10px] text-muted-foreground">
                Benchmark: {item.benchmark}{item.unit}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
