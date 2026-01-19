import { ReactNode, useState, useCallback } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { AppSidebar } from './AppSidebar';
import { PublicHeader } from './PublicHeader';
import { ScoutDrawer } from '@/components/scout/ScoutDrawer';
import { ScoutTrigger } from '@/components/scout/ScoutTrigger';
import { ROICalculator } from '@/components/calculator/ROICalculator';
import { AnimatedBackground } from '@/components/background/AnimatedBackground';
import { useKeyboardShortcuts } from '@/hooks/useKeyboardShortcuts';
import { toast } from 'sonner';
import { Menu, X, Home, LayoutDashboard, Target, Grid3X3, History, LineChart, Wrench, Shield, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

const mobileNavigation = [
  { name: 'Home', href: '/', icon: Home },
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Assess', href: '/assess', icon: Target },
  { name: 'Checkpoints', href: '/checkpoints', icon: Grid3X3 },
  { name: 'Frameworks', href: '/frameworks', icon: Shield },
  { name: 'History', href: '/history', icon: History },
  { name: 'Simulate', href: '/simulate', icon: LineChart },
  { name: 'Continuous Monitoring', href: '/monitoring', icon: BarChart3 },
  { name: 'Live Tracker', href: '/remediation', icon: Wrench },
];

interface SidebarLayoutProps {
  children: ReactNode;
}

export function SidebarLayout({ children }: SidebarLayoutProps) {
  const location = useLocation();
  const [scoutOpen, setScoutOpen] = useState(false);
  const [roiOpen, setRoiOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);

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
    <div className="min-h-screen bg-background relative">
      <AnimatedBackground />
      
      {/* Global Public Header */}
      <PublicHeader />
      
      <div className="relative z-10 flex">
        {/* Desktop Sidebar */}
        <div className="hidden lg:block">
          <AppSidebar />
        </div>
        
        {/* Main content area */}
        <div className="flex-1 lg:ml-60 min-h-screen transition-all duration-300 w-full flex flex-col">
          {/* Mobile Header */}
          <header className="lg:hidden sticky top-0 z-50 w-full border-b border-border/30 bg-background/95 backdrop-blur-xl shadow-[0_4px_20px_-10px_hsl(0_0%_0%/0.4)]">
            <div className="flex items-center justify-between px-4 h-14">
              <Link to="/" className="flex items-center gap-2">
                <div className="w-7 h-7 rounded bg-primary flex items-center justify-center">
                  <span className="text-primary-foreground font-bold text-xs">M</span>
                </div>
                <span className="font-semibold text-sm">METRIS<sup className="text-[6px] align-super">™</sup></span>
              </Link>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                aria-label="Toggle menu"
              >
                {sidebarOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </Button>
            </div>
            
            {/* Mobile Navigation Dropdown */}
            {sidebarOpen && (
              <nav className="border-t border-border bg-background px-4 py-4 space-y-1">
                {mobileNavigation.map((item) => {
                  const isActive = location.pathname === item.href;
                  const Icon = item.icon;
                  return (
                    <Link 
                      key={item.name} 
                      to={item.href}
                      onClick={() => setSidebarOpen(false)}
                    >
                      <div className={cn(
                        'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm transition-colors',
                        isActive 
                          ? 'bg-primary/10 text-primary' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/50'
                      )}>
                        <Icon className="h-4 w-4" />
                        {item.name}
                      </div>
                    </Link>
                  );
                })}
              </nav>
            )}
          </header>
          
          <main className="flex-1 w-full">
            {children}
          </main>
        </div>
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
      
      <ROICalculator open={roiOpen} onOpenChange={setRoiOpen} />
      
      {/* Keyboard shortcut hints */}
      <div className="fixed bottom-4 left-4 hidden lg:flex items-center gap-3 text-xs text-muted-foreground font-light z-40">
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 backdrop-blur-sm">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">⌘R</kbd>
          ROI Calc
        </span>
        <span className="flex items-center gap-1 px-2 py-1 rounded bg-muted/50 backdrop-blur-sm">
          <kbd className="px-1.5 py-0.5 rounded bg-background border border-border text-[10px] font-mono">⌘P</kbd>
          PDF
        </span>
      </div>
    </div>
  );
}
