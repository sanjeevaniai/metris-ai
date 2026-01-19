import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  FileText, 
  History, 
  TrendingUp, 
  Download,
  CheckCircle2,
  Scale,
  Activity
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function AuditGradeBanner() {
  const capabilities = [
    {
      icon: <FileText className="h-4 w-4" />,
      title: 'Quantitative Scoring Trail',
      description: 'Every system scored with traceable methodology',
      status: 'active'
    },
    {
      icon: <Download className="h-4 w-4" />,
      title: 'Audit-Ready Exports',
      description: 'Framework-aligned PDF/JSON reports',
      status: 'active'
    },
    {
      icon: <Scale className="h-4 w-4" />,
      title: 'Framework Alignment',
      description: 'NIST, ISO 42001, EU AI Act, SOC 2',
      status: 'active'
    },
    {
      icon: <History className="h-4 w-4" />,
      title: 'Full Audit History',
      description: 'Scan logs & remediation timeline',
      status: 'active'
    },
    {
      icon: <TrendingUp className="h-4 w-4" />,
      title: 'Risk Forecasting',
      description: '90-365 day projections with scenarios',
      status: 'active'
    },
    {
      icon: <Activity className="h-4 w-4" />,
      title: 'Continuous Monitoring',
      description: 'Real-time drift & compliance tracking',
      status: 'active'
    }
  ];

  return (
    <div className="relative overflow-hidden rounded-xl border border-primary/20 bg-gradient-to-r from-primary/5 via-background to-secondary/5">
      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
      <div className="absolute bottom-0 left-0 w-48 h-48 bg-secondary/5 rounded-full blur-3xl translate-y-1/2 -translate-x-1/2" />
      
      <div className="relative p-6">
        <div className="flex items-start gap-4 mb-6">
          <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
            <Shield className="h-6 w-6 text-primary" />
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h3 className="text-lg font-medium">Audit-Grade AI Governance</h3>
              <Badge className="bg-primary/20 text-primary border-primary/30 text-[10px] uppercase tracking-wider">
                Enterprise Ready
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground font-light max-w-2xl">
              METRIS™ provides audit-grade governance designed for regulatory, risk, and compliance contexts. 
              Full scoring trails, framework alignment, and exportable evidence for every assessment.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {capabilities.map((cap) => (
            <div 
              key={cap.title}
              className="group relative p-3 rounded-lg bg-background/60 border border-border/50 hover:border-primary/30 hover:bg-primary/5 transition-all"
            >
              <div className="flex items-center gap-2 mb-2">
                <span className="text-primary">{cap.icon}</span>
                <CheckCircle2 className="h-3 w-3 text-primary opacity-60" />
              </div>
              <h4 className="text-xs font-medium mb-0.5 leading-tight">{cap.title}</h4>
              <p className="text-[10px] text-muted-foreground leading-tight">{cap.description}</p>
            </div>
          ))}
        </div>

        {/* Compliance Certifications Bar */}
        <div className="mt-6 pt-4 border-t border-border/30">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <span className="font-medium text-foreground">Framework Alignment:</span>
              {['NIST AI RMF 1.0', 'ISO/IEC 42001', 'EU AI Act', 'SOC 2 Type II', 'GDPR Art. 22'].map((framework) => (
                <Badge 
                  key={framework} 
                  variant="outline" 
                  className="text-[10px] font-light py-0.5 border-primary/20 text-primary/80"
                >
                  {framework}
                </Badge>
              ))}
            </div>
            <div className="flex items-center gap-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                Live Monitoring
              </span>
              <span>Last sync: 2 min ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
