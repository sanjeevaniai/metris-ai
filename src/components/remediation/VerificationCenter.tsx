import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle2, XCircle, RefreshCw, Eye, AlertTriangle } from 'lucide-react';
import { DEMO_VERIFICATION_READY, DEMO_RECENTLY_VERIFIED } from '@/data/demoRemediation';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function VerificationCenter() {
  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-primary" />
          Verification Center
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Verify completed fixes against METRIS checkpoints
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Ready for Verification */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/10">
          <h4 className="text-sm font-medium mb-4">Ready for Verification ({DEMO_VERIFICATION_READY.length})</h4>
          <div className="space-y-3">
            {DEMO_VERIFICATION_READY.map((task) => (
              <div key={task.id} className="p-3 rounded-lg border border-border/30 bg-card">
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="outline" className="text-xs font-mono">{task.checkpointId}</Badge>
                      <span className="font-medium text-sm">{task.title}</span>
                    </div>
                    <div className="space-y-1 text-xs text-muted-foreground">
                      <p>Status: In Review</p>
                      {task.evidence.length > 0 && (
                        <p>Evidence uploaded: {task.evidence[0].filename}</p>
                      )}
                      <p className="text-primary">Expected impact: +{task.scoreImpact} points</p>
                    </div>
                  </div>
                  <Button size="sm" className="shrink-0">
                    <RefreshCw className="h-3 w-3 mr-2" />
                    Run Verification
                  </Button>
                </div>
              </div>
            ))}
          </div>
          {DEMO_VERIFICATION_READY.length > 0 && (
            <Button className="w-full mt-4" variant="outline">
              <RefreshCw className="h-4 w-4 mr-2" />
              Verify All Ready Items
            </Button>
          )}
        </div>

        {/* Recently Verified */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/10">
          <h4 className="text-sm font-medium mb-4">Recently Verified ({DEMO_RECENTLY_VERIFIED.length})</h4>
          <div className="space-y-2">
            {DEMO_RECENTLY_VERIFIED.map((item, index) => (
              <div 
                key={index} 
                className={`flex items-center justify-between p-3 rounded-lg border ${
                  item.result === 'verified' 
                    ? 'border-risk-low/30 bg-risk-low/10' 
                    : 'border-risk-critical/30 bg-risk-critical/10'
                }`}
              >
                <div className="flex items-center gap-3">
                  {item.result === 'verified' ? (
                    <CheckCircle2 className="h-4 w-4 text-risk-low" />
                  ) : (
                    <XCircle className="h-4 w-4 text-risk-critical" />
                  )}
                  <div>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="text-xs font-mono">{item.checkpointId}</Badge>
                      <span className="text-sm">{item.title}</span>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Verified {formatDate(item.verifiedAt)}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  {item.result === 'verified' ? (
                    <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30">
                      ✓ Verified +{item.impact} pts
                    </Badge>
                  ) : (
                    <div>
                      <Badge className="bg-risk-critical/20 text-risk-critical border-risk-critical/30">
                        ↻ Rework Needed
                      </Badge>
                      <p className="text-xs text-muted-foreground mt-1">{item.reason}</p>
                      <Button variant="ghost" size="sm" className="text-xs mt-1 h-6 px-2">
                        <Eye className="h-3 w-3 mr-1" />
                        View Issues
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
