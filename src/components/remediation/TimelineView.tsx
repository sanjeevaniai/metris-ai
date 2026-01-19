import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { DEMO_REMEDIATION_TASKS } from '@/data/demoRemediation';

function getWeekLabel(date: Date): string {
  const startOfWeek = new Date(date);
  startOfWeek.setDate(date.getDate() - date.getDay());
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(startOfWeek.getDate() + 6);
  
  const startMonth = startOfWeek.toLocaleDateString('en-US', { month: 'short' });
  const startDay = startOfWeek.getDate();
  const endDay = endOfWeek.getDate();
  
  return `${startMonth} ${startDay}-${endDay}`;
}

export function TimelineView() {
  const today = new Date();
  
  // Generate week headers
  const weeks = [];
  for (let i = 0; i < 4; i++) {
    const weekStart = new Date(today);
    weekStart.setDate(today.getDate() + (i * 7) - today.getDay());
    weeks.push({
      label: `Week ${i + 1}`,
      dateRange: getWeekLabel(weekStart),
      start: weekStart,
    });
  }

  const tasksWithDates = DEMO_REMEDIATION_TASKS.filter(t => t.dueDate || t.completedDate);
  const euAiActDeadline = new Date('2026-08-02');
  const daysUntilDeadline = Math.ceil((euAiActDeadline.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-light">Timeline View</CardTitle>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <span>← Jan 2026</span>
            <span className="mx-4">|</span>
            <span>Feb 2026 →</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {/* Week headers */}
        <div className="grid grid-cols-4 gap-4 mb-4">
          {weeks.map((week, index) => (
            <div key={index} className="text-center">
              <p className="text-sm font-medium">{week.label}</p>
              <p className="text-xs text-muted-foreground">{week.dateRange}</p>
            </div>
          ))}
        </div>

        {/* Timeline bars */}
        <div className="space-y-3 border-t border-border/50 pt-4">
          {tasksWithDates.slice(0, 8).map((task) => {
            const isComplete = task.status === 'complete' || task.status === 'verified';
            const progress = task.progress;
            
            // Calculate position and width based on dates
            const startOffset = task.completedDate 
              ? Math.max(0, Math.min(75, ((new Date(task.completedDate).getTime() - today.getTime()) / (28 * 24 * 60 * 60 * 1000)) * 100))
              : 0;
            const endOffset = task.dueDate
              ? Math.max(10, Math.min(100, ((new Date(task.dueDate).getTime() - today.getTime()) / (28 * 24 * 60 * 60 * 1000)) * 100 + 25))
              : 50;
            
            return (
              <div key={task.id} className="flex items-center gap-4">
                <div className="w-24 shrink-0">
                  <p className="text-xs font-mono text-muted-foreground">{task.checkpointId}</p>
                  <p className="text-xs truncate">{task.title}</p>
                </div>
                <div className="flex-1 relative h-6">
                  <div 
                    className={`absolute h-5 rounded-full ${
                      isComplete 
                        ? 'bg-risk-low/50' 
                        : task.status === 'in_progress' || task.status === 'in_review'
                          ? 'bg-primary/30'
                          : 'bg-muted/50'
                    }`}
                    style={{ 
                      left: `${Math.max(0, startOffset)}%`, 
                      width: `${Math.min(100 - startOffset, endOffset - startOffset)}%` 
                    }}
                  >
                    <div 
                      className={`h-full rounded-full ${
                        isComplete ? 'bg-risk-low' : 'bg-primary'
                      }`}
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                  {task.dueDate && !isComplete && (
                    <div 
                      className="absolute text-[10px] text-muted-foreground -bottom-3"
                      style={{ left: `${endOffset - 5}%` }}
                    >
                      Due {task.dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </div>
                  )}
                  {isComplete && (
                    <span className="absolute right-0 text-xs">✓</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Today marker */}
        <div className="relative mt-6 pt-4 border-t border-border/50">
          <div className="absolute top-0 left-[25%] transform -translate-x-1/2 text-xs text-primary">
            ▲ Today
          </div>
        </div>

        {/* Status summary */}
        <div className="mt-8 p-4 rounded-lg border border-border/50 bg-muted/20">
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="text-xs text-risk-critical border-risk-critical/30">
              🔴 Aug 2, 2026: EU AI Act Deadline ({daysUntilDeadline} days)
            </Badge>
          </div>
          <p className="text-sm text-muted-foreground">
            Current pace: Will complete all tasks by ~March 15
          </p>
          <p className="text-sm text-risk-low flex items-center gap-1">
            ✅ On track for EU AI Act compliance
          </p>
        </div>

        <p className="text-xs text-muted-foreground text-center mt-4">
          Drag task bars to reschedule • Click to edit
        </p>
      </CardContent>
    </Card>
  );
}
