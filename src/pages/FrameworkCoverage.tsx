import React, { useState } from 'react';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_FRAMEWORKS } from '@/data/demoFrameworks';
import { DEMO_PILLARS } from '@/data/demoPillars';
import { DEMO_HEATMAP_DATA } from '@/data/demoHeatmap';
import { DEMO_CHECKPOINTS } from '@/data/demoCheckpoints';
import { cn } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  ChevronRight,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  Clock,
  Shield,
  FileText,
  Target,
} from 'lucide-react';

// Requirement categories for each framework
const FRAMEWORK_REQUIREMENTS: Record<string, Array<{ name: string; passed: number; total: number }>> = {
  eu_ai_act: [
    { name: 'Risk Management System', passed: 18, total: 25 },
    { name: 'Data Governance', passed: 22, total: 28 },
    { name: 'Technical Documentation', passed: 15, total: 20 },
    { name: 'Human Oversight', passed: 19, total: 24 },
    { name: 'Accuracy & Robustness', passed: 20, total: 28 },
    { name: 'Transparency Obligations', passed: 25, total: 30 },
    { name: 'Quality Management', passed: 18, total: 25 },
    { name: 'Conformity Assessment', passed: 19, total: 20 },
  ],
  nist_ai_rmf: [
    { name: 'Govern', passed: 42, total: 48 },
    { name: 'Map', passed: 38, total: 42 },
    { name: 'Measure', passed: 45, total: 55 },
    { name: 'Manage', passed: 43, total: 55 },
  ],
  iso_42001: [
    { name: 'Context of Organization', passed: 12, total: 15 },
    { name: 'Leadership', passed: 14, total: 16 },
    { name: 'Planning', passed: 18, total: 22 },
    { name: 'Support', passed: 15, total: 18 },
    { name: 'Operation', passed: 22, total: 30 },
    { name: 'Performance Evaluation', passed: 12, total: 18 },
    { name: 'Improvement', passed: 11, total: 18 },
  ],
  colorado_sb205: [
    { name: 'Impact Assessments', passed: 8, total: 15 },
    { name: 'Consumer Notification', passed: 10, total: 12 },
    { name: 'Opt-Out Rights', passed: 6, total: 10 },
    { name: 'Developer Obligations', passed: 8, total: 14 },
  ],
  ca_ab2013: [
    { name: 'Disclosure Requirements', passed: 12, total: 15 },
    { name: 'Consumer Rights', passed: 8, total: 12 },
    { name: 'Transparency', passed: 7, total: 11 },
  ],
  nyc_ll144: [
    { name: 'Bias Audit', passed: 8, total: 12 },
    { name: 'Public Disclosure', passed: 6, total: 8 },
    { name: 'Candidate Notice', passed: 3, total: 5 },
  ],
  il_hb3773: [
    { name: 'Video Interview Analysis', passed: 10, total: 18 },
    { name: 'Consent Requirements', passed: 5, total: 8 },
    { name: 'Data Destruction', passed: 4, total: 6 },
  ],
  gdpr_ai: [
    { name: 'Lawful Processing', passed: 12, total: 14 },
    { name: 'Automated Decision-Making', passed: 10, total: 12 },
    { name: 'Right to Explanation', passed: 8, total: 10 },
    { name: 'Data Minimization', passed: 7, total: 9 },
  ],
  soc2_ai: [
    { name: 'Security', passed: 18, total: 22 },
    { name: 'Availability', passed: 12, total: 14 },
    { name: 'Processing Integrity', passed: 8, total: 12 },
    { name: 'Confidentiality', passed: 6, total: 12 },
  ],
};

// Critical gaps for each framework
const FRAMEWORK_GAPS: Record<string, Array<{ name: string; status: string; needed: string; exposure: number }>> = {
  eu_ai_act: [
    { name: 'Bias Testing Documentation', status: 'Missing', needed: 'Complete demographic parity analysis', exposure: 890000 },
    { name: 'Human Override Mechanism', status: 'Partial', needed: 'Implement real-time override capability', exposure: 520000 },
    { name: 'Technical Documentation', status: 'Incomplete', needed: 'Add model architecture details', exposure: 340000 },
  ],
  nist_ai_rmf: [
    { name: 'Risk Measurement Metrics', status: 'Partial', needed: 'Define quantitative risk thresholds', exposure: 420000 },
    { name: 'Continuous Monitoring', status: 'Missing', needed: 'Implement drift detection', exposure: 380000 },
  ],
  iso_42001: [
    { name: 'Management Review', status: 'Overdue', needed: 'Complete quarterly review', exposure: 280000 },
    { name: 'Internal Audit', status: 'Scheduled', needed: 'Execute planned audit', exposure: 180000 },
  ],
  colorado_sb205: [
    { name: 'Impact Assessment', status: 'Missing', needed: 'Complete algorithmic impact assessment', exposure: 680000 },
    { name: 'Consumer Opt-Out', status: 'Partial', needed: 'Implement opt-out mechanism', exposure: 420000 },
  ],
};

export default function FrameworkCoverage() {
  const { addSimulatedFix } = useVisualizationStore();
  const [selectedFramework, setSelectedFramework] = useState<string | null>(null);

  const selectedFrameworkData = selectedFramework
    ? DEMO_FRAMEWORKS.find(f => f.id === selectedFramework)
    : null;

  const requirements = selectedFramework ? FRAMEWORK_REQUIREMENTS[selectedFramework] || [] : [];
  const gaps = selectedFramework ? FRAMEWORK_GAPS[selectedFramework] || [] : [];

  // Get checkpoints for selected framework
  const frameworkCheckpoints = selectedFramework
    ? DEMO_CHECKPOINTS.filter(cp => {
        const fwName = selectedFrameworkData?.name || '';
        return cp.framework.includes(fwName) || cp.framework.includes(selectedFrameworkData?.shortName || '');
      }).slice(0, 20)
    : [];

  const getCoverageColor = (coverage: number) => {
    if (coverage >= 80) return 'text-status-good';
    if (coverage >= 60) return 'text-status-warning';
    return 'text-status-critical';
  };

  const getProgressColor = (coverage: number) => {
    if (coverage >= 80) return 'bg-status-good';
    if (coverage >= 60) return 'bg-status-warning';
    return 'bg-status-critical';
  };

  return (
    <SidebarLayout>
    <div className="min-h-screen bg-bg-primary p-6">
      <div className="max-w-[1400px] mx-auto space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-text-primary">Framework Coverage</h1>
          <p className="text-text-secondary">
            Detailed compliance status for each regulatory framework
          </p>
        </div>

        {/* Framework Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {DEMO_FRAMEWORKS.map(framework => {
            const isSelected = selectedFramework === framework.id;
            const coveragePercent = Math.round(framework.coverage * 100);
            
            return (
              <Card
                key={framework.id}
                onClick={() => setSelectedFramework(isSelected ? null : framework.id)}
                className={cn(
                  "bg-bg-secondary border-white/10 cursor-pointer transition-all hover:border-white/20",
                  isSelected && "border-brand-primary ring-1 ring-brand-primary"
                )}
              >
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-text-primary">{framework.shortName}</h3>
                      <p className="text-text-secondary text-sm">{framework.name}</p>
                    </div>
                    {framework.deadline && (
                      <Badge variant="outline" className="text-xs gap-1 text-status-warning border-status-warning/30">
                        <Clock className="w-3 h-3" />
                        {framework.daysRemaining}d
                      </Badge>
                    )}
                  </div>

                  <div className="mb-3">
                    <div className="flex items-end justify-between mb-1">
                      <span className={cn("text-3xl font-mono font-bold", getCoverageColor(coveragePercent))}>
                        {coveragePercent}%
                      </span>
                      <span className="text-text-secondary text-sm">
                        {framework.checkpointsAddressed}/{framework.checkpointsTotal} met
                      </span>
                    </div>
                    <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                      <div
                        className={cn("h-full rounded-full transition-all", getProgressColor(coveragePercent))}
                        style={{ width: `${coveragePercent}%` }}
                      />
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    className="w-full justify-between text-brand-primary hover:text-brand-primary/80"
                  >
                    View Details
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Selected Framework Detail */}
        {selectedFramework && selectedFrameworkData && (
          <div className="space-y-6 animate-in fade-in slide-in-from-top-4 duration-300">
            {/* Deadline Countdown (for EU AI Act) */}
            {selectedFrameworkData.deadline && (
              <Card className="bg-gradient-to-r from-brand-secondary/10 to-brand-primary/10 border-brand-secondary/30">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <Calendar className="w-5 h-5 text-brand-secondary" />
                        <span className="text-text-secondary">Enforcement Deadline</span>
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="text-4xl font-mono font-bold text-brand-primary">
                          {selectedFrameworkData.daysRemaining}
                        </span>
                        <span className="text-xl text-text-primary">days remaining</span>
                      </div>
                      <p className="text-text-secondary mt-2">
                        Deadline: {new Date(selectedFrameworkData.deadline).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-text-secondary text-sm mb-1">Current readiness</p>
                      <p className={cn("text-2xl font-mono font-bold", getCoverageColor(Math.round(selectedFrameworkData.coverage * 100)))}>
                        {Math.round(selectedFrameworkData.coverage * 100)}%
                      </p>
                      <p className="text-text-secondary text-sm mt-2">
                        At current pace, you'll reach <span className="text-text-primary font-medium">92%</span> by deadline
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 flex gap-3">
                    <Button className="bg-brand-primary text-bg-primary hover:bg-brand-primary/90">
                      <Target className="w-4 h-4 mr-2" />
                      Create Compliance Roadmap
                    </Button>
                    <Button variant="outline">
                      <FileText className="w-4 h-4 mr-2" />
                      Generate Gap Report
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Requirements Breakdown */}
              <Card className="bg-bg-secondary border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5 text-brand-primary" />
                    Requirements Breakdown
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {requirements.map((req, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-text-primary text-sm">{req.name}</span>
                          <span className="text-text-secondary text-xs">
                            {req.passed}/{req.total}
                          </span>
                        </div>
                        <div className="h-2 bg-bg-tertiary rounded-full overflow-hidden">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              getProgressColor(Math.round((req.passed / req.total) * 100))
                            )}
                            style={{ width: `${(req.passed / req.total) * 100}%` }}
                          />
                        </div>
                      </div>
                      {req.passed === req.total ? (
                        <CheckCircle2 className="w-5 h-5 text-status-good flex-shrink-0" />
                      ) : (
                        <AlertTriangle className="w-5 h-5 text-status-warning flex-shrink-0" />
                      )}
                    </div>
                  ))}
                </CardContent>
              </Card>

              {/* Gap Analysis */}
              <Card className="bg-bg-secondary border-white/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-status-warning" />
                    Critical Gaps
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {gaps.length > 0 ? gaps.map((gap, index) => (
                    <div
                      key={index}
                      className="bg-bg-tertiary rounded-lg p-3 border-l-2 border-status-warning"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <p className="font-medium text-text-primary">{gap.name}</p>
                          <Badge variant="outline" className="text-xs mt-1 text-status-warning border-status-warning/30">
                            {gap.status}
                          </Badge>
                        </div>
                        <span className="font-mono text-status-critical text-sm">
                          ${(gap.exposure / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <p className="text-text-secondary text-sm mb-2">{gap.needed}</p>
                      <Button
                        size="sm"
                        onClick={() => {
                          addSimulatedFix({
                            checkpointId: `GAP-${selectedFramework}-${index}`,
                            status: 'pending',
                            pointsGain: Math.floor(gap.exposure / 20000),
                            exposureReduction: gap.exposure,
                          });
                        }}
                        className="bg-brand-primary text-bg-primary hover:bg-brand-primary/90"
                      >
                        Fix Now
                      </Button>
                    </div>
                  )) : (
                    <div className="text-center py-8 text-text-secondary">
                      <CheckCircle2 className="w-12 h-12 text-status-good mx-auto mb-2" />
                      <p>No critical gaps identified</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            {/* Checkpoint Mapping Table */}
            <Card className="bg-bg-secondary border-white/10">
              <CardHeader>
                <CardTitle>Checkpoint Mapping</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10">
                      <TableHead>Checkpoint</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Severity</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {frameworkCheckpoints.map(cp => (
                      <TableRow key={cp.id} className="border-white/10">
                        <TableCell>
                          <div>
                            <p className="font-mono text-text-secondary text-xs">{cp.id}</p>
                            <p className="text-text-primary">{cp.name}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="text-xs">{cp.pillar}</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            {cp.status === 'passed' ? (
                              <CheckCircle2 className="w-4 h-4 text-status-good" />
                            ) : cp.status === 'failed' ? (
                              <XCircle className="w-4 h-4 text-status-critical" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-status-warning" />
                            )}
                            <span className="capitalize text-sm">{cp.status}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={cn(
                              "text-xs",
                              cp.severity === 'critical' && "text-status-critical border-status-critical/30",
                              cp.severity === 'high' && "text-orange-400 border-orange-400/30",
                              cp.severity === 'medium' && "text-status-warning border-status-warning/30",
                              cp.severity === 'low' && "text-status-good border-status-good/30"
                            )}
                          >
                            {cp.severity}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
    </SidebarLayout>
  );
}
