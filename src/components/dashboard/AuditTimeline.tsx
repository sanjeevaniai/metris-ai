import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Calendar, 
  Shield, 
  AlertTriangle, 
  CheckCircle2, 
  Clock, 
  FileCheck,
  Scale,
  Building2,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface AuditEvent {
  id: string;
  name: string;
  date: string;
  type: 'internal' | 'external' | 'regulatory';
  framework: string;
  status: 'completed' | 'upcoming' | 'overdue' | 'in-progress';
  preparationScore: number;
  requiredActions: number;
  completedActions: number;
  risk: 'low' | 'medium' | 'high' | 'critical';
}

const auditEvents: AuditEvent[] = [
  {
    id: '1',
    name: 'Internal AI Governance Review',
    date: '2025-12-15',
    type: 'internal',
    framework: 'NIST AI RMF',
    status: 'completed',
    preparationScore: 92,
    requiredActions: 12,
    completedActions: 12,
    risk: 'low'
  },
  {
    id: '2',
    name: 'ISO 42001 Certification Audit',
    date: '2026-02-20',
    type: 'external',
    framework: 'ISO/IEC 42001',
    status: 'in-progress',
    preparationScore: 78,
    requiredActions: 24,
    completedActions: 18,
    risk: 'medium'
  },
  {
    id: '3',
    name: 'EU AI Act Compliance Assessment',
    date: '2026-05-15',
    type: 'regulatory',
    framework: 'EU AI Act',
    status: 'upcoming',
    preparationScore: 65,
    requiredActions: 38,
    completedActions: 22,
    risk: 'high'
  },
  {
    id: '4',
    name: 'Financial Services Authority Review',
    date: '2026-08-02',
    type: 'regulatory',
    framework: 'EU AI Act Art. 6',
    status: 'upcoming',
    preparationScore: 48,
    requiredActions: 45,
    completedActions: 15,
    risk: 'critical'
  },
  {
    id: '5',
    name: 'Annual SOC 2 Type II Audit',
    date: '2026-09-30',
    type: 'external',
    framework: 'SOC 2',
    status: 'upcoming',
    preparationScore: 55,
    requiredActions: 30,
    completedActions: 12,
    risk: 'medium'
  }
];

const getDaysUntil = (date: string) => {
  const diff = new Date(date).getTime() - Date.now();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
};

const getStatusColor = (status: AuditEvent['status']) => {
  switch (status) {
    case 'completed': return 'bg-primary/20 text-primary border-primary/30';
    case 'in-progress': return 'bg-secondary/20 text-secondary border-secondary/30';
    case 'upcoming': return 'bg-muted text-muted-foreground border-border';
    case 'overdue': return 'bg-destructive/20 text-destructive border-destructive/30';
  }
};

const getRiskColor = (risk: AuditEvent['risk']) => {
  switch (risk) {
    case 'low': return 'text-primary';
    case 'medium': return 'text-risk-medium';
    case 'high': return 'text-risk-high';
    case 'critical': return 'text-risk-critical';
  }
};

const getTypeIcon = (type: AuditEvent['type']) => {
  switch (type) {
    case 'internal': return <Building2 className="h-4 w-4" />;
    case 'external': return <FileCheck className="h-4 w-4" />;
    case 'regulatory': return <Scale className="h-4 w-4" />;
  }
};

export function AuditTimeline() {
  const upcomingAudits = auditEvents.filter(e => e.status !== 'completed').length;
  const avgPreparation = Math.round(
    auditEvents.filter(e => e.status !== 'completed')
      .reduce((sum, e) => sum + e.preparationScore, 0) / upcomingAudits
  );
  const criticalAudits = auditEvents.filter(e => e.risk === 'critical' || e.risk === 'high').length;

  return (
    <Card className="w-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle className="text-base font-light">Regulatory Audit Timeline</CardTitle>
              <p className="text-xs text-muted-foreground font-light">
                Scheduled audits & compliance assessments
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="text-center px-3">
              <div className="text-2xl font-light text-foreground">{upcomingAudits}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Upcoming</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center px-3">
              <div className={cn("text-2xl font-light", avgPreparation >= 70 ? 'text-primary' : avgPreparation >= 50 ? 'text-risk-medium' : 'text-risk-high')}>
                {avgPreparation}%
              </div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Avg Prep</div>
            </div>
            <div className="h-8 w-px bg-border" />
            <div className="text-center px-3">
              <div className="text-2xl font-light text-risk-critical">{criticalAudits}</div>
              <div className="text-[10px] text-muted-foreground uppercase tracking-wide">At-Risk</div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Timeline Visual */}
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-[18px] top-8 bottom-4 w-0.5 bg-gradient-to-b from-primary via-secondary to-risk-critical" />
          
          <div className="space-y-4">
            {auditEvents.map((event, idx) => {
              const daysUntil = getDaysUntil(event.date);
              const isPast = daysUntil < 0;
              const isUrgent = daysUntil > 0 && daysUntil <= 90;
              
              return (
                <div 
                  key={event.id} 
                  className={cn(
                    "relative pl-12 py-3 pr-4 rounded-lg transition-all",
                    event.status === 'in-progress' && "bg-secondary/5 border border-secondary/20",
                    isUrgent && event.status !== 'completed' && "bg-risk-high/5 border border-risk-high/20",
                    event.risk === 'critical' && event.status !== 'completed' && "bg-risk-critical/5 border border-risk-critical/20"
                  )}
                >
                  {/* Timeline node */}
                  <div className={cn(
                    "absolute left-2 top-5 h-7 w-7 rounded-full flex items-center justify-center border-2 bg-background",
                    event.status === 'completed' ? 'border-primary' :
                    event.risk === 'critical' ? 'border-risk-critical' :
                    event.risk === 'high' ? 'border-risk-high' :
                    'border-muted-foreground'
                  )}>
                    {event.status === 'completed' ? (
                      <CheckCircle2 className="h-4 w-4 text-primary" />
                    ) : isUrgent ? (
                      <AlertTriangle className="h-3.5 w-3.5 text-risk-high" />
                    ) : (
                      <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                    )}
                  </div>

                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex-1 min-w-[200px]">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-muted-foreground">{getTypeIcon(event.type)}</span>
                        <h4 className="font-medium text-sm">{event.name}</h4>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-2">
                        <Badge variant="outline" className="text-[10px] font-light py-0 h-5">
                          {event.framework}
                        </Badge>
                        <span>•</span>
                        <span>{new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        {!isPast && (
                          <>
                            <span>•</span>
                            <span className={cn(
                              "font-medium",
                              daysUntil <= 30 ? 'text-risk-critical' :
                              daysUntil <= 90 ? 'text-risk-high' :
                              daysUntil <= 180 ? 'text-risk-medium' :
                              'text-muted-foreground'
                            )}>
                              {daysUntil} days
                            </span>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {/* Preparation Status */}
                      <div className="min-w-[140px]">
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-muted-foreground">Preparation</span>
                          <span className={cn("font-medium", getRiskColor(event.risk))}>
                            {event.preparationScore}%
                          </span>
                        </div>
                        <Progress 
                          value={event.preparationScore} 
                          className="h-2"
                        />
                        <div className="text-[10px] text-muted-foreground mt-1">
                          {event.completedActions}/{event.requiredActions} actions complete
                        </div>
                      </div>

                      {/* Status Badge */}
                      <Badge className={cn("text-[10px] font-light uppercase", getStatusColor(event.status))}>
                        {event.status === 'in-progress' ? 'In Progress' : event.status}
                      </Badge>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Framework Alignment Summary */}
        <div className="mt-6 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2 mb-3">
            <Shield className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium">Framework Alignment Status</span>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            {[
              { name: 'NIST AI RMF', score: 89, color: 'primary' },
              { name: 'ISO/IEC 42001', score: 78, color: 'secondary' },
              { name: 'EU AI Act', score: 65, color: 'risk-medium' },
              { name: 'SOC 2', score: 82, color: 'primary' },
              { name: 'GDPR AI', score: 74, color: 'secondary' }
            ].map((framework) => (
              <div key={framework.name} className="text-center p-3 rounded-lg bg-muted/30">
                <div className={cn(
                  "text-xl font-light",
                  framework.score >= 80 ? 'text-primary' :
                  framework.score >= 60 ? 'text-secondary' :
                  'text-risk-high'
                )}>
                  {framework.score}%
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">{framework.name}</div>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
