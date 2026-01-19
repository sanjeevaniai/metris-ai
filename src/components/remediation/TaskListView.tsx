import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Download, ChevronDown } from 'lucide-react';
import { DEMO_REMEDIATION_TASKS, RemediationTask } from '@/data/demoRemediation';

interface TaskListViewProps {
  onSelectTask: (task: RemediationTask) => void;
}

const priorityStyles = {
  critical: { icon: '🔴' },
  high: { icon: '🟠' },
  medium: { icon: '🟡' },
  low: { icon: '🟢' },
};

const statusStyles = {
  open: { icon: '⚪', label: 'Open' },
  in_progress: { icon: '🔵', label: 'Progress' },
  in_review: { icon: '🟡', label: 'Review' },
  complete: { icon: '✅', label: 'Complete' },
  verified: { icon: '✅', label: 'Verified' },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

export function TaskListView({ onSelectTask }: TaskListViewProps) {
  const [selectedTasks, setSelectedTasks] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState('roi');
  const [showAll, setShowAll] = useState(false);

  const sortedTasks = [...DEMO_REMEDIATION_TASKS].sort((a, b) => {
    if (sortBy === 'roi') return b.roi - a.roi;
    if (sortBy === 'impact') return b.scoreImpact - a.scoreImpact;
    if (sortBy === 'priority') {
      const order = { critical: 0, high: 1, medium: 2, low: 3 };
      return order[a.priority] - order[b.priority];
    }
    return 0;
  });

  const displayedTasks = showAll ? sortedTasks : sortedTasks.slice(0, 7);

  const toggleTask = (taskId: string) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-light">Task List</CardTitle>
          <div className="flex items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Sort by" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="roi">Sort by ROI</SelectItem>
                <SelectItem value="impact">Sort by Impact</SelectItem>
                <SelectItem value="priority">Sort by Priority</SelectItem>
              </SelectContent>
            </Select>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Export CSV
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          {/* Header */}
          <div className="grid grid-cols-12 gap-4 px-3 py-2 text-xs text-muted-foreground font-medium border-b border-border/50">
            <div className="col-span-1"></div>
            <div className="col-span-4">Task</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2">Impact</div>
            <div className="col-span-2">Due</div>
            <div className="col-span-1">Assign</div>
          </div>

          {/* Tasks */}
          {displayedTasks.map((task) => {
            const priority = priorityStyles[task.priority];
            const status = statusStyles[task.status];
            const isComplete = task.status === 'complete' || task.status === 'verified';

            return (
              <div
                key={task.id}
                className={`grid grid-cols-12 gap-4 px-3 py-3 rounded-lg border border-border/30 hover:bg-muted/30 cursor-pointer transition-colors ${
                  isComplete ? 'opacity-70' : ''
                }`}
                onClick={() => onSelectTask(task)}
              >
                <div className="col-span-1 flex items-center">
                  <Checkbox
                    checked={selectedTasks.includes(task.id) || isComplete}
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleTask(task.id);
                    }}
                  />
                </div>
                <div className="col-span-4">
                  <div className="flex items-center gap-2 mb-1">
                    <span>{priority.icon}</span>
                    <Badge variant="outline" className="text-xs font-mono">
                      {task.checkpointId}
                    </Badge>
                    <span className="font-medium text-sm truncate">{task.title}</span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Step {task.steps.filter(s => s.status === 'complete').length} of {task.steps.length || 1} ({task.progress}%)
                    <span className="ml-2">ROI: {task.roi}x</span>
                    <span className="ml-2">{formatCurrency(task.riskReduction)}</span>
                  </p>
                </div>
                <div className="col-span-2 flex items-center">
                  <Badge variant="outline" className="text-xs">
                    {status.icon} {status.label}
                  </Badge>
                </div>
                <div className="col-span-2 flex items-center">
                  <span className="text-sm text-primary">+{task.scoreImpact} pts</span>
                </div>
                <div className="col-span-2 flex items-center text-sm text-muted-foreground">
                  {task.dueDate ? formatDate(task.dueDate) : '—'}
                  {task.completedDate && ' ✓'}
                </div>
                <div className="col-span-1 flex items-center text-sm">
                  {task.assigneeName?.split(' ')[0] || '—'}
                </div>
              </div>
            );
          })}
        </div>

        {!showAll && sortedTasks.length > 7 && (
          <Button 
            variant="ghost" 
            className="w-full mt-4 text-sm text-muted-foreground"
            onClick={() => setShowAll(true)}
          >
            Load More ({sortedTasks.length - 7} remaining)
            <ChevronDown className="h-4 w-4 ml-2" />
          </Button>
        )}

        {selectedTasks.length > 0 && (
          <div className="flex items-center gap-4 mt-4 pt-4 border-t border-border/50">
            <span className="text-sm text-muted-foreground">
              Bulk Actions ({selectedTasks.length} selected):
            </span>
            <Button variant="outline" size="sm">Assign To...</Button>
            <Button variant="outline" size="sm">Set Due Date...</Button>
            <Button variant="outline" size="sm">Change Priority...</Button>
            <Button variant="outline" size="sm">Export...</Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
