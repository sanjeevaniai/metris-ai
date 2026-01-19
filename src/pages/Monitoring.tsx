import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { SEO } from '@/components/seo/SEO';
import { Activity, Settings, Bell } from 'lucide-react';

import { TripleMetricHeader } from '@/components/dashboard/TripleMetricHeader';
import { GovernanceHealthStatus } from '@/components/monitoring/GovernanceHealthStatus';
import { LiveScoreTrajectory } from '@/components/monitoring/LiveScoreTrajectory';
import { IntegrationHealth } from '@/components/monitoring/IntegrationHealth';
import { ActiveAlertsPanel } from '@/components/monitoring/ActiveAlertsPanel';
import { DriftDetectionDashboard } from '@/components/monitoring/DriftDetectionDashboard';
import { LiveEventFeed } from '@/components/monitoring/LiveEventFeed';
import { CheckpointStatusMonitor } from '@/components/monitoring/CheckpointStatusMonitor';
import { ComplianceCalendar } from '@/components/monitoring/ComplianceCalendar';

function MonitoringSEO() {
  return (
    <SEO
      title="Continuous Monitoring Dashboard | METRIS"
      description="Real-time AI governance monitoring with drift detection, automated alerts, and compliance tracking. 24/7 protection for your AI systems."
    />
  );
}

export default function Monitoring() {
  return (
    <SidebarLayout>
      <MonitoringSEO />
      
      <div className="min-h-screen bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-3xl font-light text-foreground">
                  Continuous Monitoring
                </h1>
                <Badge className="bg-risk-low/20 text-risk-low border-risk-low/30 animate-pulse">
                  <Activity className="h-3 w-3 mr-1" />
                  LIVE
                </Badge>
              </div>
              <p className="text-muted-foreground">
                In a loop. Continuously. • Real-time governance intelligence
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" size="sm">
                <Bell className="h-4 w-4 mr-2" />
                Alert Settings
              </Button>
              <Button variant="outline" size="sm">
                <Settings className="h-4 w-4 mr-2" />
                Configure
              </Button>
            </div>
          </div>

          {/* Triple Metric Header */}
          <div className="mb-8">
            <TripleMetricHeader />
          </div>

          {/* Governance Health Status */}
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-4 text-foreground">Governance Health Status</h2>
            <GovernanceHealthStatus />
          </div>

          {/* Score Trajectory + Integration Health */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LiveScoreTrajectory />
            <IntegrationHealth />
          </div>

          {/* Active Alerts */}
          <div className="mb-8">
            <ActiveAlertsPanel />
          </div>

          {/* Drift Detection */}
          <div className="mb-8">
            <DriftDetectionDashboard />
          </div>

          {/* Live Event Feed + Checkpoint Monitor */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <LiveEventFeed />
            <CheckpointStatusMonitor />
          </div>

          {/* Compliance Calendar */}
          <div className="mb-8">
            <ComplianceCalendar />
          </div>
        </div>
      </div>
    </SidebarLayout>
  );
}
