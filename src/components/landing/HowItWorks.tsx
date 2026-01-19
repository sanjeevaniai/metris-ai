import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  DollarSign, 
  TrendingUp, 
  Users, 
  ListChecks, 
  ArrowRight, 
  ArrowDown, 
  RefreshCw, 
  AlertCircle 
} from 'lucide-react';

export function HowItWorks() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="container">
        {/* Header */}
        <div className="text-center mb-12">
          <Badge className="mb-4 bg-primary/10 text-primary border-primary/20">
            How It Works
          </Badge>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            We Score. You Fix. We Track.
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            METRIS tells you exactly what's wrong and what to fix first. 
            You make the changes. We verify and re-score continuously.
          </p>
        </div>

        {/* What We Deliver */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-6 mb-16">
          <Card className="text-center p-6 border-primary/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">SCORE</h3>
            <p className="text-sm text-muted-foreground">
              Your governance number (0-1000) with statistical confidence
            </p>
          </Card>

          <Card className="text-center p-6 border-primary/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <DollarSign className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">RISK ($)</h3>
            <p className="text-sm text-muted-foreground">
              Financial exposure in real dollars, not vague ratings
            </p>
          </Card>

          <Card className="text-center p-6 border-primary/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <TrendingUp className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">ROI</h3>
            <p className="text-sm text-muted-foreground">
              Prioritized fixes ranked by risk reduction per dollar
            </p>
          </Card>

          <Card className="text-center p-6 border-primary/20">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">HUMANS</h3>
            <p className="text-sm text-muted-foreground">
              Who's affected by your AI decisions, quantified
            </p>
          </Card>

          <Card className="text-center p-6 border-primary/20 sm:col-span-2 md:col-span-1">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
              <ListChecks className="h-6 w-6 text-primary" />
            </div>
            <h3 className="font-semibold mb-2">RECOMMENDATIONS</h3>
            <p className="text-sm text-muted-foreground">
              What to fix, in what order, and exactly why
            </p>
          </Card>
        </div>

        {/* The Loop */}
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-2">The Continuous Improvement Loop</h3>
            <p className="text-muted-foreground">
              We don't implement. We score, recommend, and verify — continuously.
            </p>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-center gap-4 md:gap-8">
            {/* Step 1 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
                <span className="text-primary-foreground font-bold text-xl">1</span>
              </div>
              <h4 className="font-semibold mb-1">METRIS Scores</h4>
              <p className="text-sm text-muted-foreground max-w-[150px]">
                We assess and give you the numbers
              </p>
            </div>

            <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
            <ArrowDown className="h-8 w-8 text-primary md:hidden" />

            {/* Step 2 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-muted border-2 border-primary flex items-center justify-center mb-3">
                <span className="text-primary font-bold text-xl">2</span>
              </div>
              <h4 className="font-semibold mb-1">You Fix</h4>
              <p className="text-sm text-muted-foreground max-w-[150px]">
                Your team implements the recommendations
              </p>
            </div>

            <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
            <ArrowDown className="h-8 w-8 text-primary md:hidden" />

            {/* Step 3 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-3">
                <span className="text-primary-foreground font-bold text-xl">3</span>
              </div>
              <h4 className="font-semibold mb-1">METRIS Re-scores</h4>
              <p className="text-sm text-muted-foreground max-w-[150px]">
                CI/CD triggers automatic verification
              </p>
            </div>

            <ArrowRight className="h-8 w-8 text-primary hidden md:block" />
            <ArrowDown className="h-8 w-8 text-primary md:hidden" />

            {/* Step 4 */}
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center mb-3">
                <RefreshCw className="h-8 w-8 text-white" />
              </div>
              <h4 className="font-semibold mb-1">Repeat</h4>
              <p className="text-sm text-muted-foreground max-w-[150px]">
                Continuous loop until audit-ready
              </p>
            </div>
          </div>
        </div>

        {/* Clarification Box */}
        <div className="mt-16 max-w-2xl mx-auto">
          <Card className="bg-muted/50 border-border">
            <CardContent className="p-6">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center flex-shrink-0">
                  <AlertCircle className="h-5 w-5 text-amber-500" />
                </div>
                <div>
                  <h4 className="font-semibold mb-2">What METRIS Doesn't Do</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    <li>• We don't implement fixes — we tell you what to fix</li>
                    <li>• We don't write policies — we identify policy gaps</li>
                    <li>• We don't modify your systems — read-only access only</li>
                    <li>• We don't do consulting — we give you the data to act</li>
                  </ul>
                  <p className="text-sm text-primary mt-3 font-medium">
                    Think of us as your continuous AI auditor, not your implementation team.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
