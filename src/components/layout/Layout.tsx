import { ReactNode, useState, useCallback } from 'react';
import { PublicHeader } from './PublicHeader';
import { StatusBanner, useStatusBanner } from './StatusBanner';
import { ScoutDrawer } from '@/components/scout/ScoutDrawer';
import { ScoutTrigger } from '@/components/scout/ScoutTrigger';
import { ROICalculator } from '@/components/calculator/ROICalculator';
import { ROISlidePanel } from '@/components/calculator/ROISlidePanel';
import { AnimatedBackground } from '@/components/background/AnimatedBackground';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { toast } from 'sonner';

interface LayoutProps {
  children: ReactNode;
}

export function Layout({ children }: LayoutProps) {
  const [scoutOpen, setScoutOpen] = useState(false);
  const [roiOpen, setRoiOpen] = useState(false);
  const { config: bannerConfig, hideBanner } = useStatusBanner();

  const exportToPDF = useCallback(async () => {
    try {
      const html2pdf = (await import('html2pdf.js')).default;
      const element = document.querySelector('main');
      if (!element) return;
      
      toast.info('Generating PDF...');
      
      const opt = {
        margin: 0.5,
        filename: `METRIS-Report-${new Date().toISOString().split('T')[0]}.pdf`,
        image: { type: 'jpeg' as const, quality: 0.98 },
        html2canvas: { scale: 2, useCORS: true },
        jsPDF: { unit: 'in' as const, format: 'a4' as const, orientation: 'portrait' as const }
      };
      
      await html2pdf().set(opt).from(element).save();
      toast.success('PDF exported successfully!');
    } catch (error) {
      toast.error('Failed to export PDF');
      console.error('PDF export error:', error);
    }
  }, []);

  useKeyboardShortcuts([
    { key: 'k', metaKey: true, callback: () => setScoutOpen(prev => !prev) },
    { key: 'r', metaKey: true, callback: () => setRoiOpen(true) },
    { key: 'p', metaKey: true, callback: exportToPDF },
  ]);

  return (
    <div className="min-h-screen bg-background relative pt-2">
      {/* Status Banner */}
      <StatusBanner config={bannerConfig} onDismiss={hideBanner} />
      
      {/* Animated Background */}
      <AnimatedBackground />
      
      {/* Content */}
      <div className="relative z-10">
        <PublicHeader />
        <main className="flex-1">
          {children}
        </main>
      </div>
      
      {/* Scout AI Drawer */}
      <ScoutDrawer open={scoutOpen} onOpenChange={setScoutOpen} />
      
      {/* Scout Trigger Button */}
      {!scoutOpen && (
        <ScoutTrigger 
          insightsCount={3} 
          onClick={() => setScoutOpen(true)} 
        />
      )}
      
      {/* ROI Slide Panel - Always visible contextual panel */}
      <ROISlidePanel />
      
      {/* Global ROI Calculator (full version) */}
      <ROICalculator open={roiOpen} onOpenChange={setRoiOpen} />
      
      {/* Keyboard shortcut hint */}
      <div className="fixed bottom-4 left-4 hidden lg:flex items-center gap-3 text-xs text-muted-foreground font-light z-40">
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 backdrop-blur-sm">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px]">⌘R</kbd>
          ROI Calc
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 backdrop-blur-sm">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px]">⌘P</kbd>
          PDF
        </span>
      </div>
    </div>
  );
}
