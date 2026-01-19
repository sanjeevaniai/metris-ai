import { useState, useMemo } from "react";
import { ArrowLeft, Download, Calendar } from "lucide-react";
import jsPDF from "jspdf";
import { Link } from "react-router-dom";

export default function ROICalculator() {
  // CFO Business Variables
  const [teamSize, setTeamSize] = useState<string>("25");
  const [avgSalary, setAvgSalary] = useState<string>("95000");
  const [projectBudget, setProjectBudget] = useState<string>("500000");
  const [wastePercent, setWastePercent] = useState<string>("50");
  const [errorCost, setErrorCost] = useState<string>("50000");
  const [decisionsPerYear, setDecisionsPerYear] = useState<string>("12");

  const calculations = useMemo(() => {
    const team = parseFloat(teamSize) || 0;
    const salary = parseFloat(avgSalary) || 0;
    const budget = parseFloat(projectBudget) || 0;
    const waste = parseFloat(wastePercent) || 0;
    const errCost = parseFloat(errorCost) || 0;
    const decisions = parseFloat(decisionsPerYear) || 0;

    // 1. THE LABOR LEAK (Rework)
    const laborLeak = team * salary * (waste / 100);

    // 2. THE OPPORTUNITY DRAIN (Failed Projects) - Industry failure rate = 80%
    const opportunityDrain = budget * 0.80;

    // 3. THE STRATEGIC RISK (Bad Decisions) - 20% affected by bad data
    const strategicRisk = decisions * errCost * 0.20;

    // TOTAL COST OF POOR QUALITY
    const totalCopq = laborLeak + opportunityDrain + strategicRisk;

    // METRIS INVESTMENT (based on team size)
    const metrisInvestment = team <= 10 ? 25000 :
                             team <= 50 ? 75000 :
                             team <= 200 ? 150000 : 300000;

    // POST-METRIS (62% risk reduction)
    const riskReduction = 0.62;
    const postMetrisCost = totalCopq * (1 - riskReduction);

    // NET BENEFIT
    const lossAvoided = totalCopq - postMetrisCost;

    // ROI
    const roi = metrisInvestment > 0 ? (totalCopq - metrisInvestment) / metrisInvestment : 0;

    // PAYBACK (months)
    const monthlySavings = lossAvoided / 12;
    const paybackMonths = monthlySavings > 0 ? metrisInvestment / monthlySavings : 0;

    return {
      laborLeak,
      opportunityDrain,
      strategicRisk,
      totalCopq,
      metrisInvestment,
      postMetrisCost,
      lossAvoided,
      roi,
      paybackMonths,
    };
  }, [teamSize, avgSalary, projectBudget, wastePercent, errorCost, decisionsPerYear]);

  const formatCurrency = (value: number) => {
    if (value >= 1_000_000) {
      return `$${(value / 1_000_000).toFixed(1)}M`;
    }
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatFullCurrency = (value: number) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatMultiplier = (value: number) => {
    return `${value.toFixed(1)}x`;
  };

  const formatMonths = (value: number) => {
    if (value < 1) return "< 1 mo";
    return `${Math.ceil(value)} mo`;
  };

  // Calculate break-even month for timeline
  const breakEvenMonth = Math.ceil(calculations.paybackMonths);

  const exportPDF = () => {
    const doc = new jsPDF('p', 'mm', 'a4');
    const pageWidth = 210;
    const pageHeight = 297;
    const margin = 20;
    const contentWidth = pageWidth - margin * 2;
    let y = 25;

    // Helper functions
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

    // WATERMARK - Large centered logo with low opacity
    doc.saveGraphicsState();
    // @ts-ignore - jsPDF supports GState
    doc.setGState(new doc.GState({ opacity: 0.06 }));
    
    // Draw large "M" in center
    const watermarkSize = 120;
    const centerX = pageWidth / 2;
    const centerY = pageHeight / 2;
    
    // Teal square background
    doc.setFillColor(0, 170, 136);
    doc.roundedRect(centerX - watermarkSize/2, centerY - watermarkSize/2, watermarkSize, watermarkSize, 12, 12, 'F');
    
    // White M letter
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

    // KEY RESULTS - Hero Section
    doc.setFillColor(248, 250, 249);
    doc.roundedRect(margin, y - 5, contentWidth, 45, 3, 3, 'F');
    
    // ROI Box
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

    addRow('Team Size (people who touch data daily)', teamSize, y);
    y += 7;
    addRow('Average Annual Salary', formatFullCurrency(parseFloat(avgSalary) || 0), y);
    y += 7;
    addRow('Annual Data/AI Project Budget', formatFullCurrency(parseFloat(projectBudget) || 0), y);
    y += 7;
    addRow('Time Spent on Manual Data Work', `${wastePercent}%`, y);
    y += 7;
    addRow('Cost of a Single Data Error', formatFullCurrency(parseFloat(errorCost) || 0), y);
    y += 7;
    addRow('Key Data-Driven Decisions per Year', decisionsPerYear, y);
    y += 15;

    // COST OF POOR QUALITY
    addText('COST OF POOR QUALITY (1-10-100 Rule)', margin, y, 11, 'bold', [60, 60, 60]);
    y += 8;
    addLine(y, [220, 220, 220]);
    y += 8;

    addRow('Labor Leak (Rework)', formatFullCurrency(calculations.laborLeak), y, [80, 80, 80], [180, 80, 80]);
    addText('Team × Salary × Waste%', margin + 5, y + 5, 8, 'normal', [150, 150, 150]);
    y += 14;
    
    addRow('Opportunity Drain (Failed Projects)', formatFullCurrency(calculations.opportunityDrain), y, [80, 80, 80], [180, 80, 80]);
    addText('80% industry failure rate on data projects', margin + 5, y + 5, 8, 'normal', [150, 150, 150]);
    y += 14;
    
    addRow('Strategic Risk (Bad Decisions)', formatFullCurrency(calculations.strategicRisk), y, [80, 80, 80], [180, 80, 80]);
    addText('20% of decisions affected by poor data quality', margin + 5, y + 5, 8, 'normal', [150, 150, 150]);
    y += 12;

    addLine(y, [180, 180, 180]);
    y += 8;
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
    addRow('Post-Metris Annual Cost', formatFullCurrency(calculations.postMetrisCost), y, [80, 80, 80], [34, 139, 34]);
    y += 7;
    addRow('Annual Savings', formatFullCurrency(calculations.lossAvoided), y, [80, 80, 80], [34, 139, 34], true);
    y += 15;

    // BREAK-EVEN TIMELINE
    addText('BREAK-EVEN TIMELINE', margin, y, 11, 'bold', [60, 60, 60]);
    y += 8;
    addLine(y, [220, 220, 220]);
    y += 10;

    // Timeline visual
    const timelineWidth = contentWidth;
    const phases = [
      { label: 'Month 1-3', name: 'Investment Phase', width: 0.25, color: [255, 140, 100] as [number, number, number] },
      { label: 'Month 4-8', name: 'Efficiency Gains', width: 0.42, color: [100, 170, 255] as [number, number, number] },
      { label: 'Month 9-12', name: 'Data Dividend', width: 1, color: [100, 200, 130] as [number, number, number] },
    ];

    phases.forEach((phase, i) => {
      const phaseY = y + i * 12;
      addText(phase.label, margin, phaseY + 5, 9, 'normal', [100, 100, 100]);
      
      doc.setFillColor(240, 240, 240);
      doc.roundedRect(margin + 28, phaseY, timelineWidth - 70, 7, 2, 2, 'F');
      
      doc.setFillColor(...phase.color);
      doc.roundedRect(margin + 28, phaseY, (timelineWidth - 70) * phase.width, 7, 2, 2, 'F');
      
      addText(phase.name, margin + timelineWidth - 38, phaseY + 5, 9, 'normal', phase.color);
    });

    y += 42;
    
    // Break-even marker
    doc.setFillColor(34, 139, 34);
    doc.circle(margin + 28 + ((timelineWidth - 70) * Math.min(breakEvenMonth / 12, 1)), y - 8, 3, 'F');
    addText(`Break-even: Month ${breakEvenMonth < 1 ? '< 1' : breakEvenMonth}`, margin + 28, y, 10, 'bold', [34, 139, 34]);

    y += 20;

    // DISCLAIMER
    addLine(y, [220, 220, 220]);
    y += 8;
    doc.setFontSize(8);
    doc.setTextColor(140, 140, 140);
    const disclaimer = 'This analysis is based on the 1-10-100 Rule methodology and industry benchmarks. Actual results may vary based on organizational factors and implementation quality. The 80% project failure rate is based on industry research on data initiative success rates. Risk reduction estimates are based on Metris platform performance data.';
    const splitDisclaimer = doc.splitTextToSize(disclaimer, contentWidth);
    doc.text(splitDisclaimer, margin, y);

    // Footer
    doc.setFontSize(9);
    doc.setTextColor(100, 100, 100);
    doc.text('metris.ai', pageWidth / 2, 285, { align: 'center' });

    doc.save('metris-roi-analysis.pdf');
  };

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 md:p-8">
      {/* Back Link */}
      <Link
        to="/"
        className="fixed top-4 left-4 flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors text-sm"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Home</span>
      </Link>

      {/* Calculator Device - Claymorphic Teal */}
      <div 
        className="w-full max-w-[440px] rounded-[32px] p-2"
        style={{
          background: 'linear-gradient(145deg, #b8d8d0, #9ac4ba)',
          boxShadow: '0 0 1px 1px rgba(255,255,255,0.3), 0 0 20px rgba(200,220,215,0.4), 8px 8px 24px rgba(0,0,0,0.25), inset 2px 2px 4px rgba(255,255,255,0.4), inset -1px -1px 3px rgba(0,0,0,0.08)',
        }}
      >
        <div 
          className="rounded-[24px] p-5 md:p-7"
          style={{
            background: 'linear-gradient(180deg, #a8d0c6 0%, #96c4b8 100%)',
            boxShadow: 'inset 3px 3px 8px rgba(255,255,255,0.4), inset -2px -2px 6px rgba(0,0,0,0.08)',
          }}
        >
          {/* LCD Display - Main Results */}
          <div 
            className="rounded-xl p-5 mb-6"
            style={{
              background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
              boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.9), inset -2px -2px 6px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.2)',
              border: '3px solid #7aab9e',
            }}
          >
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-[#2a5a2a] text-xs tracking-wider uppercase">NET ROI</span>
                <span 
                  className="text-[#33ff66] text-3xl md:text-4xl"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {formatMultiplier(calculations.roi)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#2a5a2a] text-xs tracking-wider uppercase">LOSS AVOIDED</span>
                <span 
                  className="text-[#33ff66] text-xl md:text-2xl"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {formatCurrency(calculations.lossAvoided)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[#2a5a2a] text-xs tracking-wider uppercase">PAYBACK</span>
                <span 
                  className="text-[#33ff66] text-xl md:text-2xl"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                >
                  {formatMonths(calculations.paybackMonths)}
                </span>
              </div>
            </div>
          </div>

          {/* Input Section */}
          <div className="space-y-4 mb-6">
            {/* Team Size Input */}
            <div className="flex items-center justify-between">
              <label className="text-[#3d6b5e] text-xs font-medium tracking-wide">Team Size</label>
              <div 
                className="w-28 h-10 rounded-xl flex items-center justify-end px-3"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid #7aab9e',
                }}
              >
                <input
                  type="number"
                  value={teamSize}
                  onChange={(e) => setTeamSize(e.target.value)}
                  placeholder="25"
                  className="w-full bg-transparent text-right text-[#33ff66] text-base outline-none placeholder-[#2a5a2a]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                />
              </div>
            </div>

            {/* Average Salary Input */}
            <div className="flex items-center justify-between">
              <label className="text-[#3d6b5e] text-xs font-medium tracking-wide">Avg Salary ($)</label>
              <div 
                className="w-28 h-10 rounded-xl flex items-center justify-end px-3"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid #7aab9e',
                }}
              >
                <input
                  type="number"
                  value={avgSalary}
                  onChange={(e) => setAvgSalary(e.target.value)}
                  placeholder="95000"
                  className="w-full bg-transparent text-right text-[#33ff66] text-base outline-none placeholder-[#2a5a2a]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                />
              </div>
            </div>

            {/* Project Budget Input */}
            <div className="flex items-center justify-between">
              <label className="text-[#3d6b5e] text-xs font-medium tracking-wide">AI Budget ($)</label>
              <div 
                className="w-28 h-10 rounded-xl flex items-center justify-end px-3"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid #7aab9e',
                }}
              >
                <input
                  type="number"
                  value={projectBudget}
                  onChange={(e) => setProjectBudget(e.target.value)}
                  placeholder="500000"
                  className="w-full bg-transparent text-right text-[#33ff66] text-base outline-none placeholder-[#2a5a2a]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                />
              </div>
            </div>

            {/* Waste Percent Input */}
            <div className="flex items-center justify-between">
              <label className="text-[#3d6b5e] text-xs font-medium tracking-wide">Waste Time (%)</label>
              <div 
                className="w-28 h-10 rounded-xl flex items-center justify-end px-3"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid #7aab9e',
                }}
              >
                <input
                  type="number"
                  value={wastePercent}
                  onChange={(e) => setWastePercent(e.target.value)}
                  placeholder="50"
                  className="w-full bg-transparent text-right text-[#33ff66] text-base outline-none placeholder-[#2a5a2a]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                />
              </div>
            </div>

            {/* Error Cost Input */}
            <div className="flex items-center justify-between">
              <label className="text-[#3d6b5e] text-xs font-medium tracking-wide">Error Cost ($)</label>
              <div 
                className="w-28 h-10 rounded-xl flex items-center justify-end px-3"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid #7aab9e',
                }}
              >
                <input
                  type="number"
                  value={errorCost}
                  onChange={(e) => setErrorCost(e.target.value)}
                  placeholder="50000"
                  className="w-full bg-transparent text-right text-[#33ff66] text-base outline-none placeholder-[#2a5a2a]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                />
              </div>
            </div>

            {/* Decisions Per Year Input */}
            <div className="flex items-center justify-between">
              <label className="text-[#3d6b5e] text-xs font-medium tracking-wide">Decisions/Yr</label>
              <div 
                className="w-28 h-10 rounded-xl flex items-center justify-end px-3"
                style={{
                  background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                  boxShadow: 'inset 2px 2px 6px rgba(0,0,0,0.8), 0 2px 4px rgba(0,0,0,0.1)',
                  border: '2px solid #7aab9e',
                }}
              >
                <input
                  type="number"
                  value={decisionsPerYear}
                  onChange={(e) => setDecisionsPerYear(e.target.value)}
                  placeholder="12"
                  className="w-full bg-transparent text-right text-[#33ff66] text-base outline-none placeholder-[#2a5a2a]"
                  style={{ fontFamily: "'Share Tech Mono', monospace" }}
                />
              </div>
            </div>
          </div>

          {/* Secondary LCD Display - Cost Breakdown */}
          <div 
            className="rounded-xl p-4 mb-6"
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
                <span className="text-[#66dd88]">{formatFullCurrency(calculations.laborLeak)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a7a4a]">Opportunity Drain</span>
                <span className="text-[#66dd88]">{formatFullCurrency(calculations.opportunityDrain)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#4a7a4a]">Strategic Risk</span>
                <span className="text-[#66dd88]">{formatFullCurrency(calculations.strategicRisk)}</span>
              </div>
              
              <div className="border-t border-[#1a4a1a] my-3" />
              
              <div className="flex justify-between font-bold">
                <span className="text-[#2a5a2a]">TOTAL EXPOSURE</span>
                <span className="text-[#33ff66]">{formatFullCurrency(calculations.totalCopq)}</span>
              </div>
              
              <div className="border-t border-[#1a4a1a] my-3" />
              
              <div className="flex justify-between">
                <span className="text-[#2a5a2a]">METRIS INVESTMENT</span>
                <span className="text-[#66dd88]">{formatFullCurrency(calculations.metrisInvestment)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2a5a2a]">RISK REDUCTION</span>
                <span className="text-[#66dd88]">62%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#2a5a2a]">POST-METRIS COST</span>
                <span className="text-[#66dd88]">{formatFullCurrency(calculations.postMetrisCost)}</span>
              </div>
            </div>
          </div>

          {/* Break-Even Timeline Visual */}
          <div 
            className="rounded-xl p-4 mb-6"
            style={{
              background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
              boxShadow: 'inset 4px 4px 12px rgba(0,0,0,0.9), inset -2px -2px 6px rgba(0,0,0,0.5), 0 4px 8px rgba(0,0,0,0.2)',
              border: '3px solid #7aab9e',
            }}
          >
            <div className="text-xs" style={{ fontFamily: "'Share Tech Mono', monospace" }}>
              <div className="text-[#2a5a2a] text-[10px] tracking-wider mb-3">BREAK-EVEN TIMELINE</div>
              
              {/* Timeline Bar */}
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <span className="text-[#4a7a4a] w-20 text-[10px]">Month 1-3</span>
                  <div className="flex-1 h-4 rounded bg-[#1a2a1a] overflow-hidden">
                    <div 
                      className="h-full rounded"
                      style={{ 
                        width: '25%', 
                        background: 'linear-gradient(90deg, #ff6666, #ff8866)',
                      }} 
                    />
                  </div>
                  <span className="text-[#ff8866] text-[10px] w-24">Investment</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[#4a7a4a] w-20 text-[10px]">Month 4-8</span>
                  <div className="flex-1 h-4 rounded bg-[#1a2a1a] overflow-hidden">
                    <div 
                      className="h-full rounded"
                      style={{ 
                        width: '42%', 
                        background: 'linear-gradient(90deg, #66aaff, #88ccff)',
                      }} 
                    />
                  </div>
                  <span className="text-[#88ccff] text-[10px] w-24">Efficiency</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-[#4a7a4a] w-20 text-[10px]">Month 9-12</span>
                  <div className="flex-1 h-4 rounded bg-[#1a2a1a] overflow-hidden">
                    <div 
                      className="h-full rounded"
                      style={{ 
                        width: '100%', 
                        background: 'linear-gradient(90deg, #33ff66, #66ff99)',
                      }} 
                    />
                  </div>
                  <span className="text-[#66ff99] text-[10px] w-24">Data Dividend</span>
                </div>
              </div>
              
              {/* Break-even marker */}
              <div className="mt-3 pt-3 border-t border-[#1a4a1a]">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-[#33ff66] text-xs">↑</span>
                  <span className="text-[#33ff66] text-xs">Break-even: Month {breakEvenMonth < 1 ? '< 1' : breakEvenMonth}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons - Claymorphic */}
          <div className="flex gap-3">
            <button
              onClick={exportPDF}
              className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(145deg, #b8d8d0, #9ac4ba)',
                boxShadow: '6px 6px 14px rgba(0,0,0,0.15), -3px -3px 8px rgba(255,255,255,0.5), inset 1px 1px 2px rgba(255,255,255,0.3)',
                color: '#4a7c72',
                fontFamily: "'Share Tech Mono', monospace",
              }}
            >
              <Download className="w-4 h-4" />
              PDF
            </button>
            <button
              className="flex-1 h-12 rounded-2xl flex items-center justify-center gap-2 text-xs font-bold transition-all active:scale-95"
              style={{
                background: 'linear-gradient(180deg, #0a1f0a 0%, #051505 100%)',
                boxShadow: '6px 6px 14px rgba(0,0,0,0.2), -3px -3px 8px rgba(255,255,255,0.3)',
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

          {/* Calculator Model Label */}
          <div className="mt-5 text-center">
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
  );
}
