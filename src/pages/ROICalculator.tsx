import { useState, useEffect, useRef } from "react";
import { ArrowLeft, Download, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";
import { 
  useROICalculations, 
  formatCurrency, 
  formatFullCurrency, 
  formatMultiplier, 
  formatMonths,
  DEFAULT_ROI_INPUTS,
  type ROIInputs 
} from "@/hooks/useROICalculations";

// Animated number component with count up/down effect
function AnimatedValue({ 
  value, 
  formatter 
}: { 
  value: number; 
  formatter: (v: number) => string;
}) {
  const [displayValue, setDisplayValue] = useState(value);
  const prevValue = useRef(value);
  
  useEffect(() => {
    if (prevValue.current === value) return;
    
    const duration = 400;
    const steps = 15;
    const stepDuration = duration / steps;
    const increment = (value - prevValue.current) / steps;
    const startValue = prevValue.current;
    
    let currentStep = 0;
    const timer = setInterval(() => {
      currentStep++;
      if (currentStep >= steps) {
        setDisplayValue(value);
        prevValue.current = value;
        clearInterval(timer);
      } else {
        setDisplayValue(startValue + increment * currentStep);
      }
    }, stepDuration);
    
    return () => clearInterval(timer);
  }, [value]);

  return <>{formatter(displayValue)}</>;
}

export default function ROICalculator() {
  // CFO Business Variables
  const [inputs, setInputs] = useState<ROIInputs>(DEFAULT_ROI_INPUTS);
  
  const updateInput = (key: keyof ROIInputs, value: string) => {
    setInputs(prev => ({ ...prev, [key]: parseFloat(value) || 0 }));
  };

  const calculations = useROICalculations(inputs);
  const breakEvenMonth = Math.ceil(calculations.paybackMonths);

  const exportPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 25;

    const addText = (text: string, x: number, yPos: number, size: number, style: 'normal' | 'bold' = 'normal', color: [number, number, number] = [30, 30, 30]) => {
      doc.setFontSize(size);
      doc.setFont('helvetica', style);
      doc.setTextColor(...color);
      doc.text(text, x, yPos);
    };

    const addLine = (yPos: number, color: [number, number, number] = [200, 200, 200]) => {
      doc.setDrawColor(...color);
      doc.setLineWidth(0.3);
      doc.line(margin, yPos, pageWidth - margin, yPos);
    };

    const addRow = (label: string, value: string, yPos: number, labelColor: [number, number, number] = [80, 80, 80], valueColor: [number, number, number] = [30, 30, 30], valueBold: boolean = false) => {
      addText(label, margin, yPos, 10, 'normal', labelColor);
      doc.setFont('helvetica', valueBold ? 'bold' : 'normal');
      doc.setTextColor(...valueColor);
      doc.text(value, pageWidth - margin, yPos, { align: 'right' });
    };

    // WATERMARK
    doc.saveGraphicsState();
    // @ts-ignore
    doc.setGState(new doc.GState({ opacity: 0.06 }));
    const watermarkSize = 120;
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    doc.setFillColor(0, 170, 136);
    doc.roundedRect(centerX - watermarkSize/2, centerY - watermarkSize/2, watermarkSize, watermarkSize, 12, 12, 'F');
    doc.setFontSize(80);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    doc.text('M', centerX, centerY + 28, { align: 'center' });
    doc.restoreGraphicsState();

    // Header
    addText('METRIS', margin, y, 24, 'bold', [45, 90, 80]);
    addText('ROI ANALYSIS', margin + 45, y, 24, 'normal', [120, 120, 120]);
    y += 8;
    addText(`Generated: ${new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`, margin, y, 9, 'normal', [140, 140, 140]);
    y += 12;
    addLine(y, [45, 90, 80]);
    y += 15;

    // KEY RESULTS
    doc.setFillColor(248, 250, 249);
    doc.roundedRect(margin, y - 5, contentWidth, 45, 3, 3, 'F');
    const boxWidth = (contentWidth - 10) / 3;
    y += 5;
    addText('NET ROI', margin + 8, y, 8, 'normal', [100, 100, 100]);
    addText(formatMultiplier(calculations.roi), margin + 8, y + 12, 28, 'bold', [34, 139, 34]);
    addText('LOSS AVOIDED', margin + boxWidth + 13, y, 8, 'normal', [100, 100, 100]);
    addText(formatCurrency(calculations.lossAvoided), margin + boxWidth + 13, y + 12, 20, 'bold', [45, 90, 80]);
    addText('PAYBACK PERIOD', margin + boxWidth * 2 + 18, y, 8, 'normal', [100, 100, 100]);
    addText(formatMonths(calculations.paybackMonths), margin + boxWidth * 2 + 18, y + 12, 20, 'bold', [45, 90, 80]);
    y += 45;

    // INPUT PARAMETERS
    addText('INPUT PARAMETERS', margin, y, 11, 'bold', [60, 60, 60]);
    y += 8;
    addLine(y, [220, 220, 220]);
    y += 8;
    addRow('Team Size', String(inputs.teamSize), y);
    y += 7;
    addRow('Average Annual Salary', formatFullCurrency(inputs.avgSalary), y);
    y += 7;
    addRow('Annual AI Project Budget', formatFullCurrency(inputs.projectBudget), y);
    y += 7;
    addRow('Time Spent on Manual Work', `${inputs.wastePercent}%`, y);
    y += 7;
    addRow('Cost of a Single Error', formatFullCurrency(inputs.errorCost), y);
    y += 7;
    addRow('Key Decisions per Year', String(inputs.decisionsPerYear), y);
    y += 15;

    // COST OF POOR QUALITY
    addText('COST OF POOR QUALITY', margin, y, 11, 'bold', [60, 60, 60]);
    y += 8;
    addLine(y, [220, 220, 220]);
    y += 8;
    addRow('Labor Leak (Rework)', formatFullCurrency(calculations.laborLeak), y, [80, 80, 80], [180, 80, 80]);
    y += 7;
    addRow('Opportunity Drain (Failed Projects)', formatFullCurrency(calculations.opportunityDrain), y, [80, 80, 80], [180, 80, 80]);
    y += 7;
    addRow('Strategic Risk (Bad Decisions)', formatFullCurrency(calculations.strategicRisk), y, [80, 80, 80], [180, 80, 80]);
    y += 7;
    addLine(y, [180, 180, 180]);
    y += 7;
    addRow('TOTAL ANNUAL EXPOSURE', formatFullCurrency(calculations.totalCopq), y, [30, 30, 30], [180, 50, 50], true);
    y += 15;

    // METRIS SOLUTION
    addText('METRIS SOLUTION', margin, y, 11, 'bold', [60, 60, 60]);
    y += 8;
    addLine(y, [220, 220, 220]);
    y += 8;
    addRow('Metris Annual Investment', formatFullCurrency(calculations.metrisInvestment), y);
    y += 7;
    addRow('Risk Reduction Factor', '62%', y, [80, 80, 80], [34, 139, 34]);
    y += 7;
    addRow('Annual Savings', formatFullCurrency(calculations.lossAvoided), y, [80, 80, 80], [34, 139, 34], true);

    doc.save('metris-roi-analysis.pdf');
  };

  // Input field component
  const InputField = ({ label, value, onChange, placeholder }: { 
    label: string; 
    value: number; 
    onChange: (v: string) => void;
    placeholder: string;
  }) => (
    <div className="flex items-center justify-between">
      <label className="text-[#3d6b5e] text-xs font-medium tracking-wide">{label}</label>
      <div 
        className="w-28 h-9 rounded-xl flex items-center justify-end px-3"
        style={{
          background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
          boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.1)',
          border: '2px solid #7aab9e',
        }}
      >
        <input
          type="number"
          value={value || ''}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full bg-transparent text-right text-[#33ff66] text-sm outline-none placeholder-[#2a5a2a]"
          style={{ fontFamily: "'Share Tech Mono', monospace" }}
        />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4">
      {/* Back Link */}
      <Link
        to="/"
        className="fixed top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm z-10"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Two-Column Calculator Layout */}
      <div 
        className="w-full max-w-5xl rounded-[32px] p-2"
        style={{
          background: 'linear-gradient(145deg, #b8d8d0, #9ac4ba)',
          boxShadow: '0 0 1px 1px rgba(255,255,255,0.3), 0 0 20px rgba(200,220,215,0.4), 8px 8px 24px rgba(0,0,0,0.25), inset 2px 2px 4px rgba(255,255,255,0.4), inset -1px -1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <div 
          className="rounded-[24px] p-5"
          style={{
            background: 'linear-gradient(180deg, #a8d0c6 0%, #96c4b8 100%)',
            boxShadow: 'inset 3px 3px 8px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.08)',
          }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {/* LEFT COLUMN - Inputs */}
            <div className="space-y-4">
              {/* Main Results Display */}
              <div 
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.9), inset -2px -2px 6px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.2)',
                  border: '3px solid #7aab9e',
                }}
              >
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center">
                    <span className="text-[#2a5a2a] text-[10px] tracking-wider uppercase block mb-1">NET ROI</span>
                    <span 
                      className="text-[#33ff66] text-2xl lg:text-3xl block"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      <AnimatedValue value={calculations.roi} formatter={formatMultiplier} />
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[#2a5a2a] text-[10px] tracking-wider uppercase block mb-1">LOSS AVOIDED</span>
                    <span 
                      className="text-[#33ff66] text-lg lg:text-xl block"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      <AnimatedValue value={calculations.lossAvoided} formatter={formatCurrency} />
                    </span>
                  </div>
                  <div className="text-center">
                    <span className="text-[#2a5a2a] text-[10px] tracking-wider uppercase block mb-1">PAYBACK</span>
                    <span 
                      className="text-[#33ff66] text-lg lg:text-xl block"
                      style={{ fontFamily: "'Share Tech Mono', monospace" }}
                    >
                      <AnimatedValue value={calculations.paybackMonths} formatter={formatMonths} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Input Fields */}
              <div className="space-y-3">
                <InputField 
                  label="Team Size" 
                  value={inputs.teamSize} 
                  onChange={(v) => updateInput('teamSize', v)}
                  placeholder="25"
                />
                <InputField 
                  label="Avg Salary ($)" 
                  value={inputs.avgSalary} 
                  onChange={(v) => updateInput('avgSalary', v)}
                  placeholder="95000"
                />
                <InputField 
                  label="AI Budget ($)" 
                  value={inputs.projectBudget} 
                  onChange={(v) => updateInput('projectBudget', v)}
                  placeholder="500000"
                />
                <InputField 
                  label="Waste Time (%)" 
                  value={inputs.wastePercent} 
                  onChange={(v) => updateInput('wastePercent', v)}
                  placeholder="50"
                />
                <InputField 
                  label="Error Cost ($)" 
                  value={inputs.errorCost} 
                  onChange={(v) => updateInput('errorCost', v)}
                  placeholder="50000"
                />
                <InputField 
                  label="Decisions/Yr" 
                  value={inputs.decisionsPerYear} 
                  onChange={(v) => updateInput('decisionsPerYear', v)}
                  placeholder="12"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button
                  onClick={exportPDF}
                  className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(145deg, #b8d8d0, #9ac4ba)',
                    boxShadow: '4px 4px 10px rgba(0,0,0,0.15), -2px -2px 6px rgba(255,255,255,0.5)',
                    color: '#4a7c72',
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                >
                  <Download className="w-4 h-4" />
                  PDF
                </button>
                <button
                  className="flex-1 h-11 rounded-xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
                  style={{
                    background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                    boxShadow: '4px 4px 10px rgba(0,0,0,0.2)',
                    color: '#33ff66',
                    border: '2px solid #7aab9e',
                    fontFamily: "'Share Tech Mono', monospace",
                  }}
                  onClick={() => window.open('https://calendar.notion.so/meet/siaai/0619', '_blank')}
                >
                  <Calendar className="w-4 h-4" />
                  STRATEGY CALL
                </button>
              </div>
            </div>

            {/* RIGHT COLUMN - Outputs */}
            <div className="space-y-4">
              {/* Cost Breakdown */}
              <div 
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.9), inset -2px -2px 6px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.2)',
                  border: '3px solid #7aab9e',
                }}
              >
                <div className="space-y-2 text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  <div className="text-[#2a5a2a] text-[10px] tracking-wider mb-3">COST OF POOR QUALITY</div>
                  
                  <div className="flex justify-between">
                    <span className="text-[#4a7a4a]">Labor Leak (Rework)</span>
                    <span className="text-[#66dd88]">
                      <AnimatedValue value={calculations.laborLeak} formatter={formatFullCurrency} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a7a4a]">Opportunity Drain</span>
                    <span className="text-[#66dd88]">
                      <AnimatedValue value={calculations.opportunityDrain} formatter={formatFullCurrency} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#4a7a4a]">Strategic Risk</span>
                    <span className="text-[#66dd88]">
                      <AnimatedValue value={calculations.strategicRisk} formatter={formatFullCurrency} />
                    </span>
                  </div>
                  
                  <div className="border-t border-[#1a4a1a] my-2" />
                  
                  <div className="flex justify-between font-bold">
                    <span className="text-[#2a5a2a]">TOTAL EXPOSURE</span>
                    <span className="text-[#33ff66]">
                      <AnimatedValue value={calculations.totalCopq} formatter={formatFullCurrency} />
                    </span>
                  </div>
                  
                  <div className="border-t border-[#1a4a1a] my-2" />
                  
                  <div className="flex justify-between">
                    <span className="text-[#2a5a2a]">METRIS INVESTMENT</span>
                    <span className="text-[#66dd88]">
                      <AnimatedValue value={calculations.metrisInvestment} formatter={formatFullCurrency} />
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2a5a2a]">RISK REDUCTION</span>
                    <span className="text-[#66dd88]">62%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#2a5a2a]">POST-METRIS COST</span>
                    <span className="text-[#66dd88]">
                      <AnimatedValue value={calculations.postMetrisCost} formatter={formatFullCurrency} />
                    </span>
                  </div>
                </div>
              </div>

              {/* Break-Even Timeline */}
              <div 
                className="rounded-xl p-4"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.9), inset -2px -2px 6px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.2)',
                  border: '3px solid #7aab9e',
                }}
              >
                <div className="text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
                  <div className="text-[#2a5a2a] text-[10px] tracking-wider mb-3">BREAK-EVEN TIMELINE</div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-[#4a7a4a] w-16 text-[10px]">Month 1-3</span>
                      <div className="flex-1 h-4 rounded bg-[#1a2a1a] overflow-hidden">
                        <div 
                          className="h-full rounded transition-all duration-300"
                          style={{ 
                            width: '25%', 
                            background: 'linear-gradient(90deg, #ff6666, #ff8866)',
                          }} 
                        />
                      </div>
                      <span className="text-[#ff8866] text-[10px] w-20">Investment</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[#4a7a4a] w-16 text-[10px]">Month 4-8</span>
                      <div className="flex-1 h-4 rounded bg-[#1a2a1a] overflow-hidden">
                        <div 
                          className="h-full rounded transition-all duration-300"
                          style={{ 
                            width: '42%', 
                            background: 'linear-gradient(90deg, #66aaff, #88ccff)',
                          }} 
                        />
                      </div>
                      <span className="text-[#88ccff] text-[10px] w-20">Efficiency</span>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <span className="text-[#4a7a4a] w-16 text-[10px]">Month 9-12</span>
                      <div className="flex-1 h-4 rounded bg-[#1a2a1a] overflow-hidden">
                        <div 
                          className="h-full rounded transition-all duration-300"
                          style={{ 
                            width: '100%', 
                            background: 'linear-gradient(90deg, #33ff66, #66ff99)',
                          }} 
                        />
                      </div>
                      <span className="text-[#66ff99] text-[10px] w-20">Data Dividend</span>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-[#1a4a1a]">
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-[#33ff66] text-xs">↑</span>
                      <span className="text-[#33ff66] text-xs">
                        Break-even: Month {breakEvenMonth < 1 ? '< 1' : breakEvenMonth}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Model Label */}
              <div className="text-center">
                <span 
                  className="text-[#6a9a8e] text-[10px] tracking-[0.2em] uppercase font-medium"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  METRIS CFO-1
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
