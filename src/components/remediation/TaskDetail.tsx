import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Edit, Trash2, CheckCircle2, Circle, Loader2, FileText, Code, Upload, MessageSquare, Paperclip, ExternalLink, RefreshCw } from 'lucide-react';
import { RemediationTask } from '@/data/demoRemediation';

interface TaskDetailProps {
  task: RemediationTask;
  onBack: () => void;
}

const priorityStyles = {
  critical: { label: 'Critical', icon: '🔴', color: 'text-risk-critical', bg: 'bg-risk-critical/20 border-risk-critical/30' },
  high: { label: 'High', icon: '🟠', color: 'text-risk-high', bg: 'bg-risk-high/20 border-risk-high/30' },
  medium: { label: 'Medium', icon: '🟡', color: 'text-risk-medium', bg: 'bg-risk-medium/20 border-risk-medium/30' },
  low: { label: 'Low', icon: '🟢', color: 'text-risk-low', bg: 'bg-risk-low/20 border-risk-low/30' },
};

const statusOptions = [
  { value: 'open', label: '⚪ Open' },
  { value: 'in_progress', label: '🔵 In Progress' },
  { value: 'in_review', label: '🟡 In Review' },
  { value: 'complete', label: '✅ Complete' },
];

function formatCurrency(value: number): string {
  if (value >= 1000000) return `$${(value / 1000000).toFixed(1)}M`;
  if (value >= 1000) return `$${(value / 1000).toFixed(0)}K`;
  return `$${value}`;
}

function formatDate(date: Date): string {
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatDateTime(date: Date): string {
  return date.toLocaleDateString('en-US', { 
    month: 'short', 
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function TaskDetail({ task, onBack }: TaskDetailProps) {
  const priority = priorityStyles[task.priority];

  return (
    <Card className="border-border/50 bg-card/50 backdrop-blur-sm">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" onClick={onBack}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Board
          </Button>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm">
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button variant="outline" size="sm" className="text-risk-critical">
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Title */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Badge className={`${priority.bg} ${priority.color}`}>
              {priority.icon} {task.checkpointId}
            </Badge>
          </div>
          <h2 className="text-xl font-medium">{task.title}</h2>
        </div>

        {/* Status & Priority */}
        <div className="flex items-center gap-4">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Status</label>
            <Select defaultValue={task.status}>
              <SelectTrigger className="w-[160px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {statusOptions.map(opt => (
                  <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">Priority</label>
            <Select defaultValue={task.priority}>
              <SelectTrigger className="w-[140px]">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="critical">🔴 Critical</SelectItem>
                <SelectItem value="high">🟠 High</SelectItem>
                <SelectItem value="medium">🟡 Medium</SelectItem>
                <SelectItem value="low">🟢 Low</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Impact Summary */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
          <h3 className="text-sm font-medium mb-3">Impact Summary</h3>
          <div className="grid grid-cols-4 gap-4 text-center">
            <div>
              <p className="text-lg font-medium text-primary">+{task.scoreImpact} pts</p>
              <p className="text-xs text-muted-foreground">Score Impact</p>
            </div>
            <div>
              <p className="text-lg font-medium text-risk-low">{formatCurrency(task.riskReduction)}</p>
              <p className="text-xs text-muted-foreground">Risk Reduction</p>
            </div>
            <div>
              <p className="text-lg font-medium">{formatCurrency(task.estimatedCost)}</p>
              <p className="text-xs text-muted-foreground">Est. Cost</p>
            </div>
            <div>
              <p className="text-lg font-medium text-primary">{task.roi}x</p>
              <p className="text-xs text-muted-foreground">ROI</p>
            </div>
          </div>
          <div className="mt-3 pt-3 border-t border-border/30">
            <p className="text-xs text-muted-foreground">
              <span className="text-foreground">Frameworks:</span> {task.frameworks.join(', ')}
            </p>
          </div>
        </div>

        {/* Finding Details */}
        <div>
          <h3 className="text-sm font-medium mb-2">Finding Details</h3>
          <p className="text-sm text-muted-foreground">{task.description}</p>
        </div>

        {/* Implementation Progress */}
        {task.steps.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Implementation Progress</h3>
            <Progress value={task.progress} className="h-2 mb-4" />
            <div className="space-y-4">
              {task.steps.map((step, index) => (
                <div 
                  key={step.id} 
                  className={`p-4 rounded-lg border ${
                    step.status === 'complete' 
                      ? 'border-risk-low/30 bg-risk-low/10' 
                      : step.status === 'current'
                        ? 'border-primary/30 bg-primary/10'
                        : 'border-border/50 bg-muted/10'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    {step.status === 'complete' && <CheckCircle2 className="h-5 w-5 text-risk-low mt-0.5" />}
                    {step.status === 'current' && <Loader2 className="h-5 w-5 text-primary mt-0.5 animate-spin" />}
                    {step.status === 'pending' && <Circle className="h-5 w-5 text-muted-foreground mt-0.5" />}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium text-sm">Step {index + 1}: {step.title}</span>
                        {step.status === 'complete' && <Badge variant="outline" className="text-xs text-risk-low border-risk-low/30">Complete</Badge>}
                        {step.status === 'current' && <Badge variant="outline" className="text-xs text-primary border-primary/30">Current</Badge>}
                        {step.status === 'pending' && <Badge variant="outline" className="text-xs">Pending</Badge>}
                      </div>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                      {step.completedAt && (
                        <p className="text-xs text-muted-foreground mt-1">
                          Completed by {step.completedBy} on {formatDate(step.completedAt)}
                        </p>
                      )}
                      {step.template && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <FileText className="h-3 w-3 mr-2" />
                          Download Template
                        </Button>
                      )}
                      {step.codeSnippet && (
                        <Button variant="outline" size="sm" className="mt-2">
                          <Code className="h-3 w-3 mr-2" />
                          View Code Snippet
                        </Button>
                      )}
                      {step.status === 'current' && (
                        <div className="flex gap-2 mt-3">
                          <Button size="sm">
                            <CheckCircle2 className="h-3 w-3 mr-2" />
                            Mark Step Complete
                          </Button>
                          <Button variant="outline" size="sm">
                            <Upload className="h-3 w-3 mr-2" />
                            Upload Evidence
                          </Button>
                        </div>
                      )}
                      {step.status === 'pending' && step.title.includes('Verification') && (
                        <Button variant="outline" size="sm" className="mt-2" disabled>
                          <RefreshCw className="h-3 w-3 mr-2" />
                          Run Verification (available after previous steps)
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Evidence */}
        {task.evidence.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Evidence Uploaded</h3>
            <div className="space-y-2">
              {task.evidence.map((evidence) => (
                <div key={evidence.id} className="flex items-center justify-between p-3 rounded-lg border border-border/50 bg-muted/10">
                  <div className="flex items-center gap-2">
                    <Paperclip className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{evidence.filename}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    Uploaded by {evidence.uploadedBy} on {formatDate(evidence.uploadedAt)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Assignment */}
        <div className="p-4 rounded-lg border border-border/50 bg-muted/20">
          <h3 className="text-sm font-medium mb-3">Assignment & Timeline</h3>
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Assignee:</span>
              <span className="ml-2">{task.assigneeName || 'Unassigned'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Due Date:</span>
              <span className="ml-2">{task.dueDate ? formatDate(task.dueDate) : 'Not set'}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Estimated Effort:</span>
              <span className="ml-2">~{task.estimatedHours} hours</span>
            </div>
            <div>
              <span className="text-muted-foreground">Actual Effort:</span>
              <span className="ml-2">{task.actualHours} hours (so far)</span>
            </div>
          </div>
        </div>

        {/* Activity Log */}
        {task.activityLog.length > 0 && (
          <div>
            <h3 className="text-sm font-medium mb-3">Activity Log</h3>
            <div className="space-y-2">
              {task.activityLog.map((activity) => (
                <div key={activity.id} className="flex items-center gap-2 text-sm">
                  <span className="text-muted-foreground">{formatDateTime(activity.timestamp)}</span>
                  <span className="text-foreground">{activity.user}</span>
                  <span className="text-muted-foreground">{activity.action}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-4 border-t border-border/50">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" />
            Add Comment
          </Button>
          <Button variant="outline" size="sm">
            <Paperclip className="h-4 w-4 mr-2" />
            Attach File
          </Button>
          <Button variant="outline" size="sm">
            <ExternalLink className="h-4 w-4 mr-2" />
            Create Jira Ticket
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
