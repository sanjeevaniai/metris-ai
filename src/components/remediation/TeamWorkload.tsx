import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Users, Plus, RefreshCw } from 'lucide-react';
import { DEMO_TEAM_MEMBERS, DEMO_REMEDIATION_TASKS } from '@/data/demoRemediation';

const loadLevelStyles = {
  light: { label: 'Light', color: 'text-risk-low', bg: 'bg-risk-low' },
  normal: { label: 'Normal', color: 'text-primary', bg: 'bg-primary' },
  high: { label: 'High', color: 'text-risk-medium', bg: 'bg-risk-medium' },
  overloaded: { label: 'Overloaded', color: 'text-risk-critical', bg: 'bg-risk-critical' },
};

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TeamWorkload() {
  const unassignedCount = DEMO_REMEDIATION_TASKS.filter(t => !t.assigneeId).length;

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <CardTitle className="text-base font-light flex items-center gap-2">
          <Users className="h-4 w-4 text-primary" />
          Team Workload
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Header */}
          <div className="grid grid-cols-6 gap-4 px-3 text-xs text-muted-foreground font-medium border-b border-border/50 pb-2">
            <div className="col-span-2">Team Member</div>
            <div>Assigned</div>
            <div>In Progress</div>
            <div>Completed</div>
            <div>Load</div>
          </div>

          {/* Team members */}
          {DEMO_TEAM_MEMBERS.map((member) => {
            const loadStyle = loadLevelStyles[member.loadLevel];
            const totalTasks = member.assigned + member.inProgress + member.completed;
            const completionPercent = totalTasks > 0 ? Math.round((member.completed / totalTasks) * 100) : 0;

            return (
              <div key={member.id} className="p-3 rounded-lg border border-border/30 bg-muted/10">
                <div className="grid grid-cols-6 gap-4 items-center mb-2">
                  <div className="col-span-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center text-xs font-medium">
                        {member.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{member.name}</p>
                        <p className="text-xs text-muted-foreground">{member.role}</p>
                      </div>
                    </div>
                  </div>
                  <div className="text-sm font-medium">{member.assigned}</div>
                  <div className="text-sm font-medium">{member.inProgress}</div>
                  <div className="text-sm font-medium">{member.completed}</div>
                  <div>
                    <span className={`text-xs font-medium ${loadStyle.color}`}>
                      {member.loadLevel === 'light' && '🟢'}
                      {member.loadLevel === 'normal' && '🟢'}
                      {member.loadLevel === 'high' && '🟡'}
                      {member.loadLevel === 'overloaded' && '🔴'}
                      {' '}{loadStyle.label}
                    </span>
                  </div>
                </div>
                <Progress value={completionPercent} className="h-1.5 mb-1" />
                <p className="text-xs text-muted-foreground">
                  {completionPercent}% complete • Est. completion: {formatDate(member.estimatedCompletion)}
                </p>
              </div>
            );
          })}

          {/* Unassigned */}
          {unassignedCount > 0 && (
            <div className="p-3 rounded-lg border border-risk-medium/30 bg-risk-medium/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                    <span className="text-lg">⚪</span>
                  </div>
                  <div>
                    <p className="font-medium text-sm">Unassigned</p>
                    <p className="text-xs text-muted-foreground">Needs assignment</p>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-medium">{unassignedCount} tasks</span>
                  <span className="text-xs text-risk-medium">⚠️</span>
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-2 mt-6">
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Team Member
          </Button>
          <Button variant="outline" size="sm">
            <RefreshCw className="h-4 w-4 mr-2" />
            Rebalance Workload
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
