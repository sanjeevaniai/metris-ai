import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { FileText, Link2, CheckCircle2, XCircle, AlertTriangle, ExternalLink, FileCode, Database } from 'lucide-react';

const evidenceSources = [
  { name: 'GitHub', icon: '🐙', docs: 47, status: 'connected' },
  { name: 'GitLab', icon: '🦊', docs: 12, status: 'connected' },
  { name: 'Google Drive', icon: '📁', docs: 23, status: 'connected' },
  { name: 'Confluence', icon: '📘', docs: 31, status: 'pending' },
  { name: 'Notion', icon: '📝', docs: 0, status: 'disconnected' },
  { name: 'Datadog', icon: '🐕', docs: 8, status: 'connected' },
];

const matchedEvidence = [
  { 
    checkpoint: 'Model documentation exists', 
    document: 'model_card_v2.1.yaml',
    similarity: 0.94,
    status: 'matched'
  },
  { 
    checkpoint: 'Bias testing procedures defined', 
    document: 'fairness_audit_process.md',
    similarity: 0.87,
    status: 'matched'
  },
  { 
    checkpoint: 'Data lineage documented', 
    document: 'data_pipeline_spec.docx',
    similarity: 0.72,
    status: 'partial'
  },
  { 
    checkpoint: 'Incident response plan exists', 
    document: null,
    similarity: 0,
    status: 'missing'
  },
  { 
    checkpoint: 'Model versioning in place', 
    document: 'mlflow_config.yaml',
    similarity: 0.91,
    status: 'matched'
  },
  { 
    checkpoint: 'Human oversight procedures', 
    document: 'human_review_sop.pdf',
    similarity: 0.78,
    status: 'partial'
  },
];

const documentationGaps = [
  { category: 'Model Cards', complete: 3, total: 5, priority: 'high' },
  { category: 'Data Policies', complete: 7, total: 8, priority: 'low' },
  { category: 'Incident Response', complete: 1, total: 4, priority: 'critical' },
  { category: 'Training Procedures', complete: 4, total: 6, priority: 'medium' },
  { category: 'Audit Logs', complete: 5, total: 5, priority: 'done' },
];

export function EvidenceDemo() {
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-green-500/10 text-green-500 border-green-500/20">
          <FileText className="h-3 w-3 mr-1" />
          Evidence & Documentation
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">Semantic Evidence Matching</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          ≥0.7 cosine similarity linking documents to checkpoints with automated gap analysis
        </p>
      </div>

      {/* Evidence Sources */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">Connected Evidence Sources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3">
            {evidenceSources.map((source) => (
              <div 
                key={source.name}
                className={`p-4 rounded-lg border text-center ${
                  source.status === 'connected' ? 'bg-green-500/5 border-green-500/20' :
                  source.status === 'pending' ? 'bg-yellow-500/5 border-yellow-500/20' :
                  'bg-muted/30 border-border/50'
                }`}
              >
                <div className="text-2xl mb-2">{source.icon}</div>
                <div className="text-sm font-medium">{source.name}</div>
                <div className="text-xs text-muted-foreground">
                  {source.docs > 0 ? `${source.docs} docs` : 'Not connected'}
                </div>
                <Badge 
                  variant="outline" 
                  className={`text-xs mt-2 ${
                    source.status === 'connected' ? 'text-green-500 border-green-500/30' :
                    source.status === 'pending' ? 'text-yellow-500 border-yellow-500/30' :
                    'text-muted-foreground'
                  }`}
                >
                  {source.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Evidence Matching */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Link2 className="h-4 w-4 text-primary" />
            Evidence-to-Checkpoint Matching
            <Badge variant="outline" className="text-xs">Threshold: ≥0.70</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {matchedEvidence.map((item, i) => (
              <div 
                key={i}
                className={`p-3 rounded-lg border flex items-center gap-4 ${
                  item.status === 'matched' ? 'bg-green-500/5 border-green-500/20' :
                  item.status === 'partial' ? 'bg-yellow-500/5 border-yellow-500/20' :
                  'bg-red-500/5 border-red-500/20'
                }`}
              >
                <div className="flex-shrink-0">
                  {item.status === 'matched' && <CheckCircle2 className="h-5 w-5 text-green-500" />}
                  {item.status === 'partial' && <AlertTriangle className="h-5 w-5 text-yellow-500" />}
                  {item.status === 'missing' && <XCircle className="h-5 w-5 text-red-500" />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium truncate">{item.checkpoint}</div>
                  <div className="text-xs text-muted-foreground flex items-center gap-2">
                    {item.document ? (
                      <>
                        <FileCode className="h-3 w-3" />
                        {item.document}
                      </>
                    ) : (
                      <span className="text-red-500">No matching document found</span>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-lg font-semibold ${
                    item.similarity >= 0.8 ? 'text-green-500' :
                    item.similarity >= 0.7 ? 'text-yellow-500' :
                    'text-red-500'
                  }`}>
                    {item.similarity > 0 ? `${(item.similarity * 100).toFixed(0)}%` : '—'}
                  </div>
                  <div className="text-xs text-muted-foreground">similarity</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Documentation Gaps */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Database className="h-4 w-4 text-orange-500" />
            Documentation Gap Analysis
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {documentationGaps.map((gap) => (
              <div key={gap.category} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium">{gap.category}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{gap.complete}/{gap.total}</span>
                    <Badge 
                      variant="outline"
                      className={`text-xs ${
                        gap.priority === 'done' ? 'text-green-500 border-green-500/30' :
                        gap.priority === 'critical' ? 'text-red-500 border-red-500/30' :
                        gap.priority === 'high' ? 'text-orange-500 border-orange-500/30' :
                        gap.priority === 'medium' ? 'text-yellow-500 border-yellow-500/30' :
                        'text-muted-foreground'
                      }`}
                    >
                      {gap.priority}
                    </Badge>
                  </div>
                </div>
                <Progress 
                  value={(gap.complete / gap.total) * 100} 
                  className={`h-2 ${
                    gap.priority === 'done' ? '[&>div]:bg-green-500' :
                    gap.priority === 'critical' ? '[&>div]:bg-red-500' :
                    gap.priority === 'high' ? '[&>div]:bg-orange-500' : ''
                  }`}
                />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Verification Badge */}
      <div className="grid md:grid-cols-2 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Verification URL</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-3 p-3 bg-muted/50 rounded-lg">
              <div className="flex-1 font-mono text-sm truncate">
                metris.ai/verify/EIN-L9X8K2M4
              </div>
              <ExternalLink className="h-4 w-4 text-muted-foreground" />
            </div>
            <p className="text-xs text-muted-foreground mt-2">
              Public verification page for third-party auditors and stakeholders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Embeddable Badge</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center p-4 bg-gradient-to-r from-primary/10 to-secondary/10 rounded-lg border border-primary/20">
              <div className="flex items-center gap-3 bg-background/80 backdrop-blur px-4 py-2 rounded-full border border-border">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-white font-bold text-xs">
                  M
                </div>
                <div>
                  <div className="text-xs text-muted-foreground">METRIS Score</div>
                  <div className="text-lg font-bold text-primary">847</div>
                </div>
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              </div>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Display your METRIS Score on your website
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
