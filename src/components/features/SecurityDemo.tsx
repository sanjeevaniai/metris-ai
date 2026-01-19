import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Shield, AlertTriangle, CheckCircle2, XCircle, Skull, Bug, Lock } from 'lucide-react';

const mitreAtlasCategories = [
  { name: 'Reconnaissance', checks: 12, passed: 11, icon: '🔍' },
  { name: 'Resource Development', checks: 8, passed: 7, icon: '🛠️' },
  { name: 'Initial Access', checks: 15, passed: 14, icon: '🚪' },
  { name: 'ML Attack Staging', checks: 18, passed: 15, icon: '⚙️' },
  { name: 'ML Model Access', checks: 14, passed: 12, icon: '🤖' },
  { name: 'Exfiltration', checks: 10, passed: 10, icon: '📤' },
  { name: 'Impact', checks: 16, passed: 13, icon: '💥' },
  { name: 'Defense Evasion', checks: 19, passed: 16, icon: '🛡️' },
];

const genAIRisks = [
  { 
    name: 'Hallucination Detection', 
    score: 87, 
    status: 'good',
    description: 'Factual accuracy verification against ground truth',
    details: '13% hallucination rate detected in responses'
  },
  { 
    name: 'Prompt Injection', 
    score: 92, 
    status: 'good',
    description: 'Resistance to malicious prompt manipulation',
    details: '847 injection patterns tested, 8% bypass rate'
  },
  { 
    name: 'Jailbreak Detection', 
    score: 78, 
    status: 'warning',
    description: 'Safety guardrail bypass attempts',
    details: '22% of adversarial prompts bypassed filters'
  },
  { 
    name: 'Toxicity Scoring', 
    score: 94, 
    status: 'good',
    description: 'Harmful content generation probability',
    details: '6% toxic output rate under adversarial conditions'
  },
  { 
    name: 'Data Leakage', 
    score: 88, 
    status: 'good',
    description: 'PII and sensitive data exposure risk',
    details: 'No training data memorization detected'
  },
  { 
    name: 'Adversarial Robustness', 
    score: 71, 
    status: 'critical',
    description: 'FGSM, PGD attack resistance',
    details: '29% accuracy drop under FGSM attack (ε=0.3)'
  },
];

const catastrophicRisks = [
  { name: 'Autonomous Operation', status: 'pass', description: 'No unsupervised critical decisions' },
  { name: 'Recursive Self-Improvement', status: 'pass', description: 'No self-modification capabilities' },
  { name: 'Deception Detection', status: 'warning', description: 'Minor inconsistencies in explanations' },
  { name: 'Goal Misalignment', status: 'pass', description: 'Objectives aligned with specifications' },
  { name: 'Uncontrolled Scaling', status: 'pass', description: 'Resource limits enforced' },
];

export function SecurityDemo() {
  const totalChecks = mitreAtlasCategories.reduce((a, b) => a + b.checks, 0);
  const totalPassed = mitreAtlasCategories.reduce((a, b) => a + b.passed, 0);
  
  return (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <Badge className="mb-4 bg-red-500/10 text-red-500 border-red-500/20">
          <Shield className="h-3 w-3 mr-1" />
          Security & GenAI Risk
        </Badge>
        <h3 className="text-2xl font-semibold mb-2">MITRE ATLAS & GenAI Risk Analysis</h3>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          112+ AI security checkpoints mapped to adversarial threat framework with specialized GenAI risk detection
        </p>
      </div>

      {/* MITRE ATLAS Summary */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" />
              MITRE ATLAS Security Assessment
            </span>
            <Badge variant="outline" className="text-green-500 border-green-500/30">
              {totalPassed}/{totalChecks} Passed
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {mitreAtlasCategories.map((cat) => (
              <div key={cat.name} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-2">
                  <span>{cat.icon}</span>
                  <span className="text-xs font-medium truncate">{cat.name}</span>
                </div>
                <Progress value={(cat.passed / cat.checks) * 100} className="h-1.5 mb-1" />
                <div className="text-xs text-muted-foreground">
                  {cat.passed}/{cat.checks} checks
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* GenAI Risk Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {genAIRisks.map((risk) => (
          <Card key={risk.name} className={`
            ${risk.status === 'critical' ? 'border-red-500/30 bg-red-500/5' : ''}
            ${risk.status === 'warning' ? 'border-yellow-500/30 bg-yellow-500/5' : ''}
          `}>
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-2">
                  {risk.status === 'good' && <CheckCircle2 className="h-4 w-4 text-green-500" />}
                  {risk.status === 'warning' && <AlertTriangle className="h-4 w-4 text-yellow-500" />}
                  {risk.status === 'critical' && <XCircle className="h-4 w-4 text-red-500" />}
                  <span className="font-medium text-sm">{risk.name}</span>
                </div>
                <span className={`text-lg font-semibold ${
                  risk.status === 'good' ? 'text-green-500' : 
                  risk.status === 'warning' ? 'text-yellow-500' : 'text-red-500'
                }`}>
                  {risk.score}%
                </span>
              </div>
              <p className="text-xs text-muted-foreground mb-2">{risk.description}</p>
              <p className="text-xs text-foreground/70 bg-muted/50 p-2 rounded">{risk.details}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Catastrophic Risk */}
      <Card className="border-purple-500/30">
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Skull className="h-4 w-4 text-purple-500" />
            Catastrophic Risk Analysis (78 Checkpoints)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {catastrophicRisks.map((risk) => (
              <div key={risk.name} className="p-3 rounded-lg bg-muted/30 border border-border/50">
                <div className="flex items-center gap-2 mb-1">
                  {risk.status === 'pass' ? (
                    <CheckCircle2 className="h-3 w-3 text-green-500" />
                  ) : (
                    <AlertTriangle className="h-3 w-3 text-yellow-500" />
                  )}
                  <span className="text-xs font-medium">{risk.name}</span>
                </div>
                <p className="text-xs text-muted-foreground">{risk.description}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Shadow AI Detection */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Bug className="h-4 w-4 text-orange-500" />
            Shadow AI Detection
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-orange-500/10 border border-orange-500/20">
              <div className="text-2xl font-semibold text-orange-500 mb-1">3</div>
              <div className="text-sm font-medium">Undocumented AI Detected</div>
              <div className="text-xs text-muted-foreground">Via Chrome extension scanning</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-2xl font-semibold mb-1">127</div>
              <div className="text-sm font-medium">Code Repos Scanned</div>
              <div className="text-xs text-muted-foreground">ML library imports analyzed</div>
            </div>
            <div className="p-4 rounded-lg bg-muted/30 border border-border/50">
              <div className="text-2xl font-semibold mb-1">42</div>
              <div className="text-sm font-medium">API Endpoints Monitored</div>
              <div className="text-xs text-muted-foreground">Inference traffic patterns</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
