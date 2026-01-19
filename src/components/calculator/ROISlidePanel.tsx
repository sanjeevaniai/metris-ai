import { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { DollarSign, ArrowRight, X, Lightbulb, TrendingUp } from "lucide-react";
import { useROISlidePanel, DEFAULT_SLIDE_DATA } from "@/hooks/useROISlidePanel";
import { useNavigate, useLocation } from "react-router-dom";

// Animated number component with pulse effect on change
function AnimatedNumber({ 
  value, 
  prefix = "", 
  suffix = "",
  onUpdate 
}: { 
  value: number; 
  prefix?: string; 
  suffix?: string;
  onUpdate?: () => void;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const [isPulsing, setIsPulsing] = useState(false);
  const prevValueRef = useRef(value);
  
  useEffect(() => {
    // Detect if value changed significantly
    const hasChanged = Math.abs(value - prevValueRef.current) > 0.01;
    prevValueRef.current = value;
    
    if (hasChanged) {
      setIsPulsing(true);
      onUpdate?.();
      setTimeout(() => setIsPulsing(false), 300);
    }
    
    const duration = 500;
    const steps = 20;
    const stepDuration = duration / steps;
    const increment = (value - displayValue) / steps;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        clearInterval(timer);
      } else {
        setDisplayValue((prev) => prev + increment);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [value, onUpdate]);

  const formatValue = (val: number) => {
    if (val >= 1_000_000) {
      return `${(val / 1_000_000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(val);
  };

  return (
    <span 
      style={{ fontFamily: "'Share Tech Mono', monospace" }}
      className={`transition-all duration-300 ${isPulsing ? 'scale-110 text-[#66ff99]' : ''}`}
    >
      {prefix}{formatValue(displayValue)}{suffix}
    </span>
  );
}

export function ROISlidePanel() {
  const { isOpen, context, close, toggle } = useROISlidePanel();
  const navigate = useNavigate();
  const location = useLocation();
  const [isUpdating, setIsUpdating] = useState(false);
  
  const data = context?.data || DEFAULT_SLIDE_DATA;
  const isAssessmentProgress = context?.trigger === 'assessment_progress';
  const isAssessmentComplete = context?.trigger === 'assessment_complete';
  
  // Don't show on the ROI calculator page itself
  if (location.pathname === '/roi-calculator') {
    return null;
  }

  const handleOpenFullCalculator = () => {
    close();
    navigate('/roi-calculator');
  };

  const handleDataUpdate = () => {
    setIsUpdating(true);
    setTimeout(() => setIsUpdating(false), 300);
  };

  return (
    <>
      {/* Tab trigger - always visible on right edge */}
      <motion.button
        className={`fixed right-0 top-1/2 -translate-y-1/2 z-40 flex items-center gap-1 py-3 px-2 rounded-l-lg cursor-pointer transition-all hover:px-3 ${isUpdating ? 'ring-2 ring-[#33ff66]' : ''}`}
        style={{
          background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
          border: '2px solid #7aab9e',
          borderRight: 'none',
          boxShadow: '-4px 0 12px rgba(0,0,0,0.3)',
        }}
        onClick={toggle}
        whileHover={{ x: -4 }}
        animate={isUpdating ? { scale: [1, 1.1, 1] } : {}}
      >
        <DollarSign className={`w-4 h-4 ${isUpdating ? 'text-[#66ff99]' : 'text-[#33ff66]'}`} />
        <span 
          className={`text-xs font-bold whitespace-nowrap ${isUpdating ? 'text-[#66ff99]' : 'text-[#33ff66]'}`}
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        >
          ROI
        </span>
        {isAssessmentProgress && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -left-1 w-3 h-3 bg-[#33ff66] rounded-full"
          />
        )}
      </motion.button>

      {/* Slide panel */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 z-40"
              onClick={close}
            />
            
            {/* Panel */}
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="fixed right-0 top-0 bottom-0 w-[350px] z-50 overflow-hidden"
              style={{
                background: 'linear-gradient(145deg, #b8d8d0, #9ac4ba)',
                boxShadow: '-8px 0 24px rgba(0,0,0,0.25)',
              }}
            >
              {/* Inner content */}
              <div 
                className="h-full p-4 overflow-y-auto"
                style={{
                  background: 'linear-gradient(180deg, #a8d0c6 0%, #96c4b8 100%)',
                }}
              >
                {/* Header */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="w-5 h-5 text-[#3d6b5e]" />
                    <h3 
                      className="text-[#3d6b5e] font-bold text-sm tracking-wide"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      {isAssessmentComplete 
                        ? "Your Assessment ROI" 
                        : isAssessmentProgress 
                          ? "Live ROI Estimate"
                          : "Your ROI Snapshot"}
                    </h3>
                    {isAssessmentProgress && (
                      <motion.div 
                        animate={{ opacity: [0.5, 1, 0.5] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                        className="flex items-center gap-1 text-[10px] text-[#3d6b5e] bg-white/30 px-2 py-0.5 rounded-full"
                      >
                        <TrendingUp className="w-3 h-3" />
                        LIVE
                      </motion.div>
                    )}
                  </div>
                  <button 
                    onClick={close}
                    className="p-1 rounded-lg hover:bg-white/20 transition-colors"
                  >
                    <X className="w-4 h-4 text-[#3d6b5e]" />
                  </button>
                </div>

                {/* LCD Display */}
                <motion.div 
                  className="rounded-xl p-4 mb-4"
                  style={{
                    background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                    boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.9), inset -2px -2px 6px rgba(0,0,0,0.5)',
                    border: '3px solid #7aab9e',
                  }}
                  animate={isUpdating ? { borderColor: ['#7aab9e', '#33ff66', '#7aab9e'] } : {}}
                  transition={{ duration: 0.3 }}
                >
                  <div className="space-y-3" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                    {/* Exposure Found */}
                    <div className="flex justify-between items-center">
                      <span className="text-[#4a7a4a] text-xs">Exposure Found</span>
                      <span className="text-[#33ff66] text-lg">
                        <AnimatedNumber value={data.exposureFound || 0} prefix="$" onUpdate={handleDataUpdate} />
                      </span>
                    </div>
                    
                    {/* Fix Investment */}
                    <div className="flex justify-between items-center">
                      <span className="text-[#4a7a4a] text-xs">Fix Investment</span>
                      <span className="text-[#66dd88] text-base">
                        <AnimatedNumber value={data.fixInvestment || 0} prefix="$" onUpdate={handleDataUpdate} />
                      </span>
                    </div>
                    
                    {/* Projected Savings */}
                    <div className="flex justify-between items-center">
                      <span className="text-[#4a7a4a] text-xs">Projected Savings</span>
                      <span className="text-[#66dd88] text-base">
                        <AnimatedNumber value={data.estimatedSavings || 0} prefix="$" onUpdate={handleDataUpdate} />
                      </span>
                    </div>
                    
                    <div className="border-t border-[#1a4a1a] my-2" />
                    
                    {/* ROI */}
                    <div className="flex justify-between items-center">
                      <span className="text-[#2a5a2a] text-xs font-bold">ROI</span>
                      <motion.span 
                        className="text-[#33ff66] text-2xl font-bold"
                        animate={isUpdating ? { scale: [1, 1.1, 1] } : {}}
                      >
                        {(data.roi || 0).toFixed(1)}x
                      </motion.span>
                    </div>
                    
                    {/* Payback */}
                    <div className="flex justify-between items-center">
                      <span className="text-[#2a5a2a] text-xs font-bold">Payback</span>
                      <span className="text-[#33ff66] text-lg font-bold">
                        Month {data.paybackMonth || 1}
                      </span>
                    </div>
                  </div>
                </motion.div>

                {/* CTA Button */}
                <button
                  onClick={handleOpenFullCalculator}
                  className="w-full h-12 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95 mb-4"
                  style={{
                    background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                    boxShadow: '4px 4px 12px rgba(0,0,0,0.2)',
                    color: '#33ff66',
                    border: '2px solid #7aab9e',
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  {isAssessmentComplete ? "See Detailed ROI Model" : "Open Full Calculator"}
                  <ArrowRight className="w-4 h-4" />
                </button>

                {/* Tip */}
                <div 
                  className="rounded-lg p-3 flex items-start gap-2"
                  style={{
                    background: 'rgba(255,255,255,0.15)',
                  }}
                >
                  <Lightbulb className="w-4 h-4 text-[#3d6b5e] flex-shrink-0 mt-0.5" />
                  <p 
                    className="text-[#3d6b5e] text-[11px] leading-relaxed"
                    style={{ fontFamily: "'Share Tech Mono', monospace" }}
                  >
                    {isAssessmentComplete 
                      ? "This ROI is calculated from your actual assessment findings."
                      : isAssessmentProgress
                        ? "Watch your ROI update live as you answer each question!"
                        : "This updates as your assessment reveals more data."}
                  </p>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
