import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { LayoutGrid, List, Calendar, Search, Plus, User, CalendarDays, ChevronRight } from 'lucide-react';
import { DEMO_REMEDIATION_TASKS, RemediationTask } from '@/data/demoRemediation';

interface TaskBoardProps {
  onSelectTask: (task: RemediationTask) => void;
  viewMode: 'board' | 'list' | 'timeline';
  onViewModeChange: (mode: 'board' | 'list' | 'timeline') => void;
}

const priorityStyles = {
  critical: { label: 'Critical', icon: '🔴', color: 'text-risk-critical', bg: 'bg-risk-critical/20 border-risk-critical/30' },
  high: { label: 'High', icon: '🟠', color: 'text-risk-high', bg: 'bg-risk-high/20 border-risk-high/30' },
  medium: { label: 'Medium', icon: '🟡', color: 'text-risk-medium', bg: 'bg-risk-medium/20 border-risk-medium/30' },
  low: { label: 'Low', icon: '🟢', color: 'text-risk-low', bg: 'bg-risk-low/20 border-risk-low/30' },
};

const statusConfig = {
  open: { label: 'Open', icon: '⚪', count: 0 },
  in_progress: { label: 'In Progress', icon: '🔵', count: 0 },
  in_review: { label: 'In Review', icon: '🟡', count: 0 },
  complete: { label: 'Complete', icon: '✅', count: 0 },
  verified: { label: 'Verified', icon: '✅', count: 0 },
};

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function TaskCard({ task, onClick }: { task: RemediationTask; onClick: () => void }) {
  const priority = priorityStyles[task.priority];
  const isComplete = task.status === 'complete' || task.status === 'verified';

  return (
    <div 
      className="p-3 rounded-lg border border-border/50 bg-card hover:bg-muted/50 cursor-pointer transition-colors"
      onClick={onClick}
    >
      <div className="flex items-start justify-between mb-2">
        <Badge className={`${priority.bg} ${priority.color} text-xs`}>
          {priority.icon} {task.checkpointId}
        </Badge>
      </div>
      <h4 className="font-medium text-sm mb-2 line-clamp-2">{task.title}</h4>
      <div className="space-y-1 text-xs">
        <p className="text-primary">+{task.scoreImpact} pts {isComplete && '✓'}</p>
        <p className="text-muted-foreground">{formatCurrency(task.riskReduction)} saved</p>
      </div>
      <div className="mt-3 pt-2 border-t border-border/30 flex items-center justify-between text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <User className="h-3 w-3" />
          {task.assigneeName || 'Unassigned'}
        </span>
        <span className="flex items-center gap-1">
          <CalendarDays className="h-3 w-3" />
          {task.dueDate ? formatDate(task.dueDate) : 'No date'}
          {task.completedDate && ' ✓'}
        </span>
      </div>
    </div>
  );
}

function KanbanColumn({ 
  title, 
  icon, 
  tasks, 
  onSelectTask 
}: { 
  title: string; 
  icon: string; 
  tasks: RemediationTask[]; 
  onSelectTask: (task: RemediationTask) => void;
}) {
  const displayTasks = tasks.slice(0, 3);
  const remainingCount = tasks.length - displayTasks.length;

  return (
    <div className="flex-1 min-w-[250px]">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-medium flex items-center gap-2">
          {icon} {title} ({tasks.length})
        </h3>
      </div>
      <div className="space-y-3">
        {displayTasks.map((task) => (
          <TaskCard key={task.id} task={task} onClick={() => onSelectTask(task)} />
        ))}
        {remainingCount > 0 && (
          <Button variant="ghost" className="w-full text-xs text-muted-foreground">
            + {remainingCount} more
          </Button>
        )}
        <Button variant="ghost" className="w-full text-xs text-muted-foreground border border-dashed border-border/50">
          <Plus className="h-3 w-3 mr-1" />
          Add task
        </Button>
      </div>
    </div>
  );
}

export function TaskBoard({ onSelectTask, viewMode, onViewModeChange }: TaskBoardProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('all');

  const filteredTasks = DEMO_REMEDIATION_TASKS.filter(task => {
    if (searchQuery && !task.title.toLowerCase().includes(searchQuery.toLowerCase())) return false;
    if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;
    return true;
  });

  const openTasks = filteredTasks.filter(t => t.status === 'open');
  const inProgressTasks = filteredTasks.filter(t => t.status === 'in_progress');
  const inReviewTasks = filteredTasks.filter(t => t.status === 'in_review');
  const completeTasks = filteredTasks.filter(t => t.status === 'complete' || t.status === 'verified');

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-light">Task Board</CardTitle>
          <div className="flex items-center gap-2">
            <Button
              variant={viewMode === 'board' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('board')}
            >
              <LayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('list')}
            >
              <List className="h-4 w-4" />
            </Button>
            <Button
              variant={viewMode === 'timeline' ? 'default' : 'outline'}
              size="sm"
              onClick={() => onViewModeChange('timeline')}
            >
              <Calendar className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="flex items-center gap-3 mt-4">
          <div className="relative flex-1 max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search tasks..." 
              className="pl-9"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Select value={priorityFilter} onValueChange={setPriorityFilter}>
            <SelectTrigger className="w-[150px]">
              <SelectValue placeholder="All Priorities" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Priorities</SelectItem>
              <SelectItem value="critical">🔴 Critical</SelectItem>
              <SelectItem value="high">🟠 High</SelectItem>
              <SelectItem value="medium">🟡 Medium</SelectItem>
              <SelectItem value="low">🟢 Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-4 overflow-x-auto pb-4">
          <KanbanColumn title="Open" icon="⚪" tasks={openTasks} onSelectTask={onSelectTask} />
          <KanbanColumn title="In Progress" icon="🔵" tasks={inProgressTasks} onSelectTask={onSelectTask} />
          <KanbanColumn title="In Review" icon="🟡" tasks={inReviewTasks} onSelectTask={onSelectTask} />
          <KanbanColumn title="Complete" icon="✅" tasks={completeTasks} onSelectTask={onSelectTask} />
        </div>
        <p className="text-xs text-muted-foreground text-center mt-4">
          Drag cards between columns to update status
        </p>
      </CardContent>
    </Card>
  );
}
