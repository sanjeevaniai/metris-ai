import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, AlertTriangle, CalendarCheck, Flag } from 'lucide-react';
import { DEMO_COMPLIANCE_EVENTS } from '@/data/demoMonitoring';

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    year: 'numeric'
  });
}

function getDaysUntil(date: Date): number {
  const now = new Date();
  const diffMs = date.getTime() - now.getTime();
  return Math.ceil(diffMs / (1000 * 60 * 60 * 24));
}

const typeConfig = {
  scheduled: {
    icon: <CalendarCheck className="h-4 w-4" />,
    color: 'text-primary',
    bg: 'bg-primary/20',
    label: 'Scheduled',
  },
  due: {
    icon: <Clock className="h-4 w-4" />,
    color: 'text-risk-medium',
    bg: 'bg-risk-medium/20',
    label: 'Due',
  },
  deadline: {
    icon: <AlertTriangle className="h-4 w-4" />,
    color: 'text-risk-high',
    bg: 'bg-risk-high/20',
    label: 'Deadline',
  },
  regulatory: {
    icon: <Flag className="h-4 w-4" />,
    color: 'text-risk-critical',
    bg: 'bg-risk-critical/20',
    label: 'Regulatory',
  },
};

export function ComplianceCalendar() {
  const sortedEvents = [...DEMO_COMPLIANCE_EVENTS].sort((a, b) => a.date.getTime() - b.date.getTime());

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <Calendar className="h-4 w-4 text-primary" />
          Compliance Calendar
        </CardTitle>
        <p className="text-xs text-muted-foreground">
          Upcoming deadlines and scheduled events
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {sortedEvents.map((event, index) => {
            const config = typeConfig[event.type as keyof typeof typeConfig];
            const daysUntil = getDaysUntil(event.date);
            const isUrgent = daysUntil <= 30;
            const isCritical = daysUntil <= 7;

            return (
              <div 
                key={index}
                className={`p-3 rounded-lg border ${
                  isCritical 
                    ? 'border-risk-critical/50 bg-risk-critical/10' 
                    : isUrgent 
                      ? 'border-risk-medium/50 bg-risk-medium/10'
                      : 'border-border/50 bg-muted/10'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-1.5 rounded ${config.bg} ${config.color}`}>
                      {config.icon}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{event.title}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(event.date)}
                        </span>
                        <Badge variant="outline" className="text-xs">
                          {event.framework}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={`${config.bg} ${config.color} text-xs`}>
                      {config.label}
                    </Badge>
                    <p className={`text-xs mt-1 ${
                      isCritical 
                        ? 'text-risk-critical font-medium' 
                        : isUrgent 
                          ? 'text-risk-medium'
                          : 'text-muted-foreground'
                    }`}>
                      {daysUntil === 0 
                        ? 'Today!' 
                        : daysUntil < 0 
                          ? 'Overdue' 
                          : `${daysUntil} days`}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
