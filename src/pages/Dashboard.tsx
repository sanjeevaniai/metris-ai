import { useState, useCallback, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { DashboardSEO } from '@/components/seo/PageSEO';
import { DashboardHeader } from '@/components/dashboard/DashboardHeader';
import { TripleMetricHeader } from '@/components/dashboard/TripleMetricHeader';
import { ScoreStatusCards } from '@/components/dashboard/ScoreStatusCards';
import { PillarHealthGrid } from '@/components/dashboard/PillarHealthGrid';
import { QuickActionsPanel } from '@/components/dashboard/QuickActionsPanel';
import { FinancialRiskCard } from '@/components/dashboard/FinancialRiskCard';
import { ForecastChart } from '@/components/dashboard/ForecastChart';
import { FrameworkCompliance } from '@/components/dashboard/FrameworkCompliance';
import { MonteCarloChart } from '@/components/dashboard/MonteCarloChart';
import { IndustryBenchmark } from '@/components/dashboard/IndustryBenchmark';
import { AuditTimeline } from '@/components/dashboard/AuditTimeline';
import { GovernanceTrail } from '@/components/dashboard/GovernanceTrail';
import { MonitoringSection } from '@/components/dashboard/MonitoringSection';
import { ClearSelectionsButton } from '@/components/dashboard/ClearSelectionsButton';
import { KeyboardShortcutsModal } from '@/components/dashboard/KeyboardShortcutsModal';
import { DemoModeProvider } from '@/components/demo/DemoModeProvider';
import { ScoutCommandPalette } from '@/components/scout/ScoutCommandPalette';
import { ExportModal } from '@/components/export/ExportModal';
import { MonteCarloVisualization } from '@/components/charts/MonteCarloVisualization';
import { SidebarLayout } from '@/components/layout/SidebarLayout';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { useVisualizationStore } from '@/store/useVisualizationStore';

// Dashboard content component (needs access to DemoModeProvider context)
function DashboardContent() {
  const navigate = useNavigate();
  const { clearAllSelections } = useVisualizationStore();
  const [showShortcuts, setShowShortcuts] = useState(false);
  const [showScout, setShowScout] = useState(false);
  const [showExport, setShowExport] = useState(false);

  // Listen for export events from command palette
  useEffect(() => {
    const handleExportPDF = () => setShowExport(true);
    window.addEventListener('export-dashboard-pdf', handleExportPDF);
    return () => window.removeEventListener('export-dashboard-pdf', handleExportPDF);
  }, []);

  // Keyboard shortcuts
  useKeyboardShortcuts([
    { key: 'k', metaKey: true, callback: () => setShowScout(true) },
    { key: 'Escape', callback: () => clearAllSelections() },
    { key: '?', callback: () => setShowShortcuts(true) },
    { key: 'd', callback: () => navigate('/dashboard') },
    { key: 'c', callback: () => navigate('/checkpoints') },
    { key: 'f', callback: () => navigate('/frameworks') },
    { key: 'h', callback: () => navigate('/human-impact') },
    { key: 'e', metaKey: true, callback: () => setShowExport(true) },
  ]);

  return (
    <>
      <DashboardSEO />
      
      <div className="min-h-screen bg-background">
        {/* Sticky Triple Metric Header */}
        <div className="sticky top-0 z-30 bg-background/95 backdrop-blur-sm border-b border-border/50 py-4 px-4 sm:px-6">
          <div className="max-w-[1600px] mx-auto">
            <TripleMetricHeader 
              onScoreClick={() => navigate('/dashboard#score')}
              onRiskClick={() => navigate('/simulate')}
              onHumansClick={() => navigate('/human-impact')}
            />
          </div>
        </div>

        <div className="max-w-[1600px] mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-6 sm:space-y-8">
          {/* CARFAX-style Header & System Selector */}
          <DashboardHeader />

          {/* Clear Selections Banner */}
          <ClearSelectionsButton variant="banner" />

          {/* Score & Status Cards */}
          <div data-tour="score-card" id="score">
            <ScoreStatusCards />
          </div>

          {/* Pillar Health Grid */}
          <div data-tour="pillar-grid">
            <PillarHealthGrid />
          </div>

          {/* Main Content Grid: Quick Actions + Analytics */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
            {/* Left: Analytics & Charts (2 cols) */}
            <div className="lg:col-span-2 space-y-4 sm:space-y-6">
              {/* Financial Risk & Forecast Row */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FinancialRiskCard />
                <ForecastChart />
              </div>

              {/* Framework & Monte Carlo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <FrameworkCompliance />
                <MonteCarloChart />
              </div>

              {/* Full Monte Carlo Visualization */}
              <MonteCarloVisualization showControls={true} />

              {/* Industry Benchmark - Full Width */}
              <IndustryBenchmark />

              {/* Regulatory Audit Timeline */}
              <AuditTimeline />

              {/* Governance Trail - Audit History */}
              <GovernanceTrail />

              {/* Monitoring & Tracking Section */}
              <MonitoringSection />
            </div>

            {/* Right: Quick Actions Panel (1 col) */}
            <div className="lg:col-span-1" data-tour="quick-wins">
              <div className="lg:sticky lg:top-40">
                <QuickActionsPanel />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <KeyboardShortcutsModal open={showShortcuts} onOpenChange={setShowShortcuts} />
      <ScoutCommandPalette open={showScout} onOpenChange={setShowScout} />
      <ExportModal open={showExport} onOpenChange={setShowExport} />
    </>
  );
}

// Main Dashboard component wrapped with SidebarLayout and DemoModeProvider
const Dashboard = () => {
  return (
    <SidebarLayout>
      <DemoModeProvider>
        <DashboardContent />
      </DemoModeProvider>
    </SidebarLayout>
  );
};

export default Dashboard;
