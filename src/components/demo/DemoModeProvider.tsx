import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Play, 
  Info,
  Target,
  BarChart3,
  Lightbulb,
  Sliders,
  Rocket
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Tour step definition
interface TourStep {
  id: string;
  title: string;
  description: string;
  target?: string; // CSS selector for element to highlight
  icon: React.ReactNode;
  position?: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const TOUR_STEPS: TourStep[] = [
  {
    id: 'score',
    title: 'Your Governance Score',
    description: 'This is your overall METRIS Score showing how well your AI systems align with governance best practices. Higher is better!',
    target: '[data-tour="score-card"]',
    icon: <Target className="h-5 w-5" />,
    position: 'bottom',
  },
  {
    id: 'pillars',
    title: 'Pillar Health Overview',
    description: 'These pillars represent the 12 key areas of AI governance. Each shows your score, exposure at risk, and potential ROI.',
    target: '[data-tour="pillar-grid"]',
    icon: <BarChart3 className="h-5 w-5" />,
    position: 'top',
  },
  {
    id: 'interaction',
    title: 'Interactive Filtering',
    description: 'Click any pillar to filter all charts and see details. All visualizations stay synchronized!',
    target: '[data-tour="pillar-grid"]',
    icon: <Info className="h-5 w-5" />,
    position: 'top',
  },
  {
    id: 'quick-wins',
    title: 'Quick Wins & ROI',
    description: 'These are the highest-impact fixes you can make right now, sorted by return on investment.',
    target: '[data-tour="quick-wins"]',
    icon: <Lightbulb className="h-5 w-5" />,
    position: 'left',
  },
  {
    id: 'sliders',
    title: 'Optimization Controls',
    description: 'Use these sliders to adjust risk tolerance, budget, and timeline. The system calculates the optimal remediation path.',
    target: '[data-tour="controller"]',
    icon: <Sliders className="h-5 w-5" />,
    position: 'left',
  },
  {
    id: 'ready',
    title: 'Ready to Get Started?',
    description: 'Start your first AI system assessment to get personalized governance insights and recommendations.',
    icon: <Rocket className="h-5 w-5" />,
    position: 'center',
  },
];

// Context
interface DemoModeContextType {
  isDemoMode: boolean;
  toggleDemoMode: () => void;
  isTourActive: boolean;
  startTour: () => void;
  endTour: () => void;
  currentStep: number;
  totalSteps: number;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (step: number) => void;
}

const DemoModeContext = createContext<DemoModeContextType | null>(null);

export function useDemoMode() {
  const context = useContext(DemoModeContext);
  if (!context) {
    throw new Error('useDemoMode must be used within DemoModeProvider');
  }
  return context;
}

// Provider Component
interface DemoModeProviderProps {
  children: React.ReactNode;
}

export function DemoModeProvider({ children }: DemoModeProviderProps) {
  const [isDemoMode, setIsDemoMode] = useState(true); // Default to demo mode
  const [isTourActive, setIsTourActive] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const toggleDemoMode = useCallback(() => {
    setIsDemoMode(prev => !prev);
  }, []);

  const startTour = useCallback(() => {
    setIsTourActive(true);
    setCurrentStep(0);
  }, []);

  const endTour = useCallback(() => {
    setIsTourActive(false);
    setCurrentStep(0);
  }, []);

  const nextStep = useCallback(() => {
    if (currentStep < TOUR_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      endTour();
    }
  }, [currentStep, endTour]);

  const prevStep = useCallback(() => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  }, [currentStep]);

  const goToStep = useCallback((step: number) => {
    if (step >= 0 && step < TOUR_STEPS.length) {
      setCurrentStep(step);
    }
  }, []);

  // Scroll highlighted element into view
  useEffect(() => {
    if (isTourActive && TOUR_STEPS[currentStep]?.target) {
      const element = document.querySelector(TOUR_STEPS[currentStep].target!);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    }
  }, [currentStep, isTourActive]);

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        toggleDemoMode,
        isTourActive,
        startTour,
        endTour,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        nextStep,
        prevStep,
        goToStep,
      }}
    >
      {children}
      
      {/* Demo Mode Banner */}
      <AnimatePresence>
        {isDemoMode && !isTourActive && (
          <motion.div
            initial={{ y: -50, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -50, opacity: 0 }}
            className="fixed top-0 left-0 right-0 z-50 bg-gradient-to-r from-brand-secondary/90 to-primary/90 backdrop-blur-sm"
          >
            <div className="container mx-auto px-4 py-2 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Badge variant="outline" className="bg-white/20 text-white border-white/30">
                  DEMO
                </Badge>
                <span className="text-white/90 text-sm">
                  You're viewing demo data
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={startTour}
                  className="text-white hover:bg-white/20"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Start Guided Tour
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleDemoMode}
                  className="text-white hover:bg-white/20"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Tour Overlay */}
      <AnimatePresence>
        {isTourActive && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-background/80 backdrop-blur-sm"
              onClick={endTour}
            />

            {/* Tour Card */}
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              className={cn(
                "fixed z-[101] w-[400px] max-w-[90vw] bg-card border border-border rounded-xl shadow-2xl",
                TOUR_STEPS[currentStep].position === 'center' && "left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2",
                TOUR_STEPS[currentStep].position !== 'center' && "left-1/2 -translate-x-1/2 bottom-8"
              )}
            >
              {/* Progress bar */}
              <div className="h-1 bg-muted rounded-t-xl overflow-hidden">
                <motion.div
                  className="h-full bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: `${((currentStep + 1) / TOUR_STEPS.length) * 100}%` }}
                  transition={{ duration: 0.3 }}
                />
              </div>

              <div className="p-6">
                {/* Step indicator */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-lg bg-primary/10 text-primary">
                      {TOUR_STEPS[currentStep].icon}
                    </div>
                    <span className="text-sm text-muted-foreground">
                      Step {currentStep + 1} of {TOUR_STEPS.length}
                    </span>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={endTour}
                    className="h-8 w-8"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                {/* Content */}
                <h3 className="text-xl font-semibold text-foreground mb-2">
                  {TOUR_STEPS[currentStep].title}
                </h3>
                <p className="text-muted-foreground mb-6">
                  {TOUR_STEPS[currentStep].description}
                </p>

                {/* Step dots */}
                <div className="flex items-center justify-center gap-1.5 mb-6">
                  {TOUR_STEPS.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => goToStep(index)}
                      className={cn(
                        "w-2 h-2 rounded-full transition-all",
                        index === currentStep
                          ? "w-6 bg-primary"
                          : index < currentStep
                          ? "bg-primary/50"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>

                {/* Navigation */}
                <div className="flex items-center justify-between">
                  <Button
                    variant="ghost"
                    onClick={prevStep}
                    disabled={currentStep === 0}
                    className="gap-2"
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </Button>

                  {currentStep === TOUR_STEPS.length - 1 ? (
                    <Button onClick={endTour} className="gap-2">
                      Get Started
                      <Rocket className="h-4 w-4" />
                    </Button>
                  ) : (
                    <Button onClick={nextStep} className="gap-2">
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Highlight ring around target element */}
            {TOUR_STEPS[currentStep].target && (
              <TourHighlight target={TOUR_STEPS[currentStep].target!} />
            )}
          </>
        )}
      </AnimatePresence>
    </DemoModeContext.Provider>
  );
}

// Tour Highlight Component
function TourHighlight({ target }: { target: string }) {
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const element = document.querySelector(target);
    if (element) {
      const updateRect = () => {
        setRect(element.getBoundingClientRect());
      };
      updateRect();
      window.addEventListener('resize', updateRect);
      window.addEventListener('scroll', updateRect);
      return () => {
        window.removeEventListener('resize', updateRect);
        window.removeEventListener('scroll', updateRect);
      };
    }
  }, [target]);

  if (!rect) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed z-[99] pointer-events-none"
      style={{
        left: rect.left - 8,
        top: rect.top - 8,
        width: rect.width + 16,
        height: rect.height + 16,
      }}
    >
      <div className="absolute inset-0 rounded-xl border-2 border-primary animate-pulse" />
      <div className="absolute inset-0 rounded-xl bg-primary/5" />
    </motion.div>
  );
}
