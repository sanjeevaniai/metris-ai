import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { SEO } from '@/components/seo/SEO';
import { Plus, Download, RefreshCw, ExternalLink } from 'lucide-react';

import { RemediationSummary } from '@/components/remediation/RemediationSummary';
import { TaskBoard } from '@/components/remediation/TaskBoard';
import { TaskDetail } from '@/components/remediation/TaskDetail';
import { TaskListView } from '@/components/remediation/TaskListView';
import { TimelineView } from '@/components/remediation/TimelineView';
import { TeamWorkload } from '@/components/remediation/TeamWorkload';
import { VerificationCenter } from '@/components/remediation/VerificationCenter';
import { RemediationTask } from '@/data/demoRemediation';

function RemediationSEO() {
  return (
    <SEO
      title="Live Tracker | METRIS"
      description="Transform AI governance findings into actionable tasks. Track progress, assign team members, and verify completion with measurable score impact."
    />
  );
}

export default function Remediation() {
  const [viewMode, setViewMode] = useState<'board' | 'list' | 'timeline'>('board');
  const [selectedTask, setSelectedTask] = useState<RemediationTask | null>(null);

  return (
    <SidebarLayout>
      <RemediationSEO />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-light text-foreground mb-2">
                Live Tracker
              </h1>
              <p className="text-muted-foreground">
                Turn findings into fixes • Track progress • Verify completion
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Plus className="h-4 w-4 mr-2" />
                Create Custom Task
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Import from Assessment
              </Button>
              <Button variant="outline" size="sm">
                <ExternalLink className="h-4 w-4 mr-2" />
                Sync with Jira
              </Button>
            </div>
          </div>

          {/* Summary */}
          <div className="mb-8">
            <RemediationSummary />
          </div>

          {/* Main Content */}
          {selectedTask ? (
            <TaskDetail task={selectedTask} onBack={() => setSelectedTask(null)} />
          ) : (
            <>
              {/* Task Views */}
              <div className="mb-8">
                <TaskBoard 
                  onSelectTask={setSelectedTask}
                  viewMode={viewMode}
                  onViewModeChange={setViewMode}
                />
              </div>

              {/* Team & Verification */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                <TeamWorkload />
                <VerificationCenter />
              </div>
            </>
          )}
        </div>
      </div>
    </SidebarLayout>
  );
}
