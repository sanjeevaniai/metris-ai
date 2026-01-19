import { microsoftRaiDemo } from '@/data/microsoftRaiData';
import { jsPDF } from 'jspdf';

interface ReportData {
  organization: typeof microsoftRaiDemo.organization;
  scanResults: typeof microsoftRaiDemo.scanResults;
  findings: typeof microsoftRaiDemo.findings;
  financialMetrics: typeof microsoftRaiDemo.financialMetrics;
  regulatoryCompliance: typeof microsoftRaiDemo.regulatoryCompliance;
}

const formatCurrency = (value: number) => `EUR ${(value / 1000).toFixed(0)}K`;
const formatDate = (date: Date) =>
  date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

// jsPDF's built-in fonts don't support emoji/unicode well; sanitize for reliable rendering.
// Keep it conservative so text remains selectable/copyable across PDF viewers.
const safeText = (value: unknown) =>
  String(value ?? '')
    // Keep basic ASCII + whitespace; drop emoji and other glyphs that render as boxes/garble.
    .replace(/[^\x09\x0A\x0D\x20-\x7E]/g, '')
    // Collapse spaces/tabs but preserve newlines.
    .replace(/[\t ]+/g, ' ')
    .trim();

export async function generateGovernanceReportPDF(data?: ReportData) {
  const reportData = data || microsoftRaiDemo;
  const { organization, scanResults, findings, financialMetrics, regulatoryCompliance } = reportData;
  
  const overallScore = scanResults.overallScore;
  const totalExposure = findings.reduce((sum, f) => sum + f.roiImpact, 0);
  const assessmentDate = new Date();
  const reportId = `METRIS-${organization.ein || 'DEMO'}-${assessmentDate.toISOString().split('T')[0].replace(/-/g, '')}`;

  // Use named import for jsPDF
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  // Some PDF viewers/extractors behave oddly if char spacing gets changed; enforce default.
  (doc as any).setCharSpace?.(0);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const margin = 20;
  const contentWidth = pageWidth - (margin * 2);
  let y = margin;

  // Colors
  const primaryColor: [number, number, number] = [99, 102, 241]; // Indigo
  const darkColor: [number, number, number] = [26, 26, 46];
  const grayColor: [number, number, number] = [100, 116, 139];
  const greenColor: [number, number, number] = [16, 185, 129];
  const yellowColor: [number, number, number] = [245, 158, 11];
  const redColor: [number, number, number] = [239, 68, 68];

  const getScoreColor = (score: number): [number, number, number] => {
    if (score >= 80) return greenColor;
    if (score >= 60) return yellowColor;
    return redColor;
  };

  const drawHeader = (subtitle: string) => {
    // Logo
    doc.setFontSize(24);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('METRIS', margin, y);
    
    // Subtitle
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(safeText(subtitle), margin, y + 6);

    // Right side info
    doc.setFontSize(8);
    doc.setTextColor(...grayColor);
    doc.text(safeText(`Report ID: ${reportId}`), pageWidth - margin, y, { align: 'right' });
    doc.text(safeText(`Generated: ${formatDate(assessmentDate)}`), pageWidth - margin, y + 4, { align: 'right' });
    doc.text(safeText('Classification: CONFIDENTIAL'), pageWidth - margin, y + 8, { align: 'right' });

    // Line under header
    y += 12;
    doc.setDrawColor(...primaryColor);
    doc.setLineWidth(0.5);
    doc.line(margin, y, pageWidth - margin, y);
    y += 10;
  };

  const drawSectionTitle = (title: string) => {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text(safeText(title), margin, y);
    y += 2;
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.3);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;
  };

  const drawProgressBar = (x: number, yPos: number, width: number, value: number, color: [number, number, number]) => {
    // Background
    doc.setFillColor(226, 232, 240);
    doc.roundedRect(x, yPos, width, 3, 1, 1, 'F');
    // Progress
    doc.setFillColor(...color);
    doc.roundedRect(x, yPos, width * (value / 100), 3, 1, 1, 'F');
  };

  // ==================== PAGE 1 ====================
  drawHeader('AI Governance Assessment Report');

  // Confidential Banner
  doc.setFillColor(254, 242, 242);
  doc.roundedRect(margin, y, contentWidth, 8, 2, 2, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(220, 38, 38);
  doc.text(
    safeText('CONFIDENTIAL - FOR INTERNAL USE ONLY - DO NOT DISTRIBUTE WITHOUT AUTHORIZATION'),
    pageWidth / 2,
    y + 5,
    { align: 'center' }
  );
  y += 15;

  // Executive Summary Title
  drawSectionTitle('Executive Summary');

  // Metrics boxes
  const boxWidth = (contentWidth - 15) / 4;
  const boxHeight = 22;
  const metrics = [
    { label: 'METRIS Score', value: overallScore.toString(), color: greenColor },
    { label: 'Findings', value: findings.length.toString(), color: yellowColor },
    { label: 'Risk Exposure', value: formatCurrency(totalExposure), color: redColor },
    { label: 'ROI Multiple', value: `${financialMetrics.roiMultiple.toFixed(1)}x`, color: primaryColor },
  ];

  metrics.forEach((metric, idx) => {
    const x = margin + (idx * (boxWidth + 5));
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.2);
    doc.roundedRect(x, y, boxWidth, boxHeight, 2, 2, 'S');
    
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...metric.color);
    doc.text(metric.value, x + boxWidth / 2, y + 10, { align: 'center' });
    
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    doc.text(metric.label.toUpperCase(), x + boxWidth / 2, y + 17, { align: 'center' });
  });
  y += boxHeight + 10;

  // Summary paragraph
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...darkColor);
  const summaryText = `This comprehensive AI governance assessment of ${organization.system} by ${organization.name} identified ${findings.length} enhancement opportunities with a combined risk exposure of ${formatCurrency(totalExposure)}. The system achieved a METRIS score of ${overallScore}/1000, demonstrating ${overallScore >= 900 ? 'excellent' : overallScore >= 700 ? 'good' : 'moderate'} governance maturity.`;
  const summaryLines = doc.splitTextToSize(summaryText, contentWidth);
  doc.text(summaryLines, margin, y);
  y += summaryLines.length * 4 + 10;

  // Assessment Metadata
  drawSectionTitle('Assessment Metadata');

  const metaData = [
    ['Organization', organization.name, 'System Assessed', organization.system, 'Industry', organization.industry],
    ['Assessment Date', formatDate(assessmentDate), 'Jurisdiction', 'EU, US, UK', 'Report Validity', '90 Days'],
  ];

  metaData.forEach(row => {
    const cellWidth = contentWidth / 3;
    for (let i = 0; i < 3; i++) {
      const x = margin + (i * cellWidth);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(x + 1, y, cellWidth - 2, 14, 2, 2, 'F');
      
      doc.setFontSize(6);
      doc.setTextColor(...grayColor);
      doc.text(row[i * 2].toUpperCase(), x + 4, y + 5);
      
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...darkColor);
      doc.text(row[i * 2 + 1], x + 4, y + 11);
    }
    y += 18;
  });
  y += 5;

  // Core Dimensions
  drawSectionTitle('4 Core Dimensions');

  scanResults.dimensions.forEach(dim => {
    const color = getScoreColor(dim.score);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    doc.text(dim.name, margin, y + 3);
    
    drawProgressBar(margin + 60, y, 80, dim.score, color);
    
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(`${dim.score}/100`, pageWidth - margin, y + 3, { align: 'right' });
    
    y += 8;
  });
  y += 5;

  // Governance Pillars
  drawSectionTitle('9 Governance Pillars');

  scanResults.pillars.forEach(pillar => {
    const color = getScoreColor(pillar.score);
    
    // (No decorative marker; keep PDF text extraction/copying clean)

    // Name
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    doc.text(pillar.name, margin + 8, y + 3);
    
    // Progress bar
    drawProgressBar(margin + 55, y, 60, pillar.score, color);
    
    // Issues
    doc.setFontSize(7);
    doc.setTextColor(...grayColor);
    if (pillar.findings > 0) {
      const issueLabel = pillar.findings === 1 ? 'issue' : 'issues';
      doc.text(`${pillar.findings} ${issueLabel}`, margin + 120, y + 3);
    } else {
      doc.setTextColor(...grayColor);
      doc.text('0 issues', margin + 120, y + 3);
    }
    
    // Score
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...color);
    doc.text(pillar.score.toString(), pageWidth - margin, y + 3, { align: 'right' });
    
    y += 7;
  });

  // ==================== PAGE 2 ====================
  doc.addPage();
  y = margin;
  drawHeader('Findings & Compliance Analysis');

  // Detailed Findings
  drawSectionTitle('Detailed Findings');

  // Table header
  doc.setFillColor(26, 26, 46);
  doc.rect(margin, y, contentWidth, 8, 'F');
  doc.setFontSize(7);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  const headers = ['ID', 'SEVERITY', 'PILLAR', 'FINDING', 'REGULATION', 'ROI'];
  const colWidths = [15, 18, 30, 60, 30, 17];
  let xPos = margin + 2;
  headers.forEach((header, idx) => {
    doc.text(header, xPos, y + 5);
    xPos += colWidths[idx];
  });
  y += 10;

  // Table rows
  findings.forEach((finding, idx) => {
    const rowHeight = 12;
    if (y + rowHeight > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeader('Findings & Compliance Analysis (continued)');
    }

    const bgColor = idx % 2 === 0 ? 255 : 250;
    doc.setFillColor(bgColor, bgColor, bgColor);
    doc.rect(margin, y, contentWidth, rowHeight, 'F');
    
    xPos = margin + 2;
    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text(finding.id, xPos, y + 5);
    xPos += colWidths[0];

    // Severity badge
    const sevColors: Record<string, [number, number, number]> = {
      critical: [220, 38, 38],
      high: [234, 88, 12],
      medium: [217, 119, 6],
      low: [22, 163, 74],
    };
    const sevColor = sevColors[finding.severity] || sevColors.low;
    doc.setTextColor(...sevColor);
    doc.setFont('helvetica', 'bold');
    doc.text(finding.severity.toUpperCase(), xPos, y + 5);
    xPos += colWidths[1];

    doc.setTextColor(...darkColor);
    doc.setFont('helvetica', 'normal');
    doc.text(finding.pillar, xPos, y + 5);
    xPos += colWidths[2];

    // Finding title (truncated)
    const titleText = doc.splitTextToSize(finding.title, colWidths[3] - 2);
    doc.setFont('helvetica', 'bold');
    doc.text(titleText[0], xPos, y + 5);
    if (titleText.length > 1) {
      doc.setFont('helvetica', 'normal');
      doc.setFontSize(6);
      doc.setTextColor(...grayColor);
      doc.text(titleText[1]?.substring(0, 40) + '...', xPos, y + 9);
    }
    xPos += colWidths[3];

    doc.setFontSize(6);
    doc.setTextColor(...grayColor);
    doc.text(finding.regulation, xPos, y + 5);
    xPos += colWidths[4];

    doc.setFontSize(7);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text(formatCurrency(finding.roiImpact), xPos, y + 5);

    y += rowHeight;
  });
  y += 10;

  // Regulatory Compliance
  if (y + 60 > pageHeight - margin) {
    doc.addPage();
    y = margin;
    drawHeader('Regulatory Compliance');
  }

  drawSectionTitle('Regulatory Compliance Mapping');

  const regBoxWidth = (contentWidth - 5) / 2;
  const regBoxHeight = 34;

  regulatoryCompliance.forEach((reg, idx) => {
    const row = Math.floor(idx / 2);
    const col = idx % 2;
    const x = margin + (col * (regBoxWidth + 5));
    const boxY = y + (row * (regBoxHeight + 5));

    doc.setFillColor(250, 250, 250);
    doc.roundedRect(x, boxY, regBoxWidth, regBoxHeight, 2, 2, 'F');
    doc.setDrawColor(226, 232, 240);
    doc.roundedRect(x, boxY, regBoxWidth, regBoxHeight, 2, 2, 'S');

    // Regulation name
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text(safeText(reg.regulation), x + 4, boxY + 7);

    // Compliance score
    const color = getScoreColor(reg.compliance);
    doc.setFontSize(12);
    doc.setTextColor(...color);
    doc.text(safeText(`${reg.compliance}%`), x + regBoxWidth - 4, boxY + 7, { align: 'right' });

    // Progress bar
    drawProgressBar(x + 4, boxY + 12, regBoxWidth - 8, reg.compliance, color);

    // Mapped items (plain text instead of chips for legibility)
    const tags = (reg.articles || reg.sections || reg.functions || []) as string[];
    doc.setFontSize(6);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);

    const tagsText = safeText(tags.slice(0, 6).join(', '));
    const tagLines = doc.splitTextToSize(tagsText, regBoxWidth - 8);
    doc.text(tagLines, x + 4, boxY + 22);
  });
  y += (Math.ceil(regulatoryCompliance.length / 2) * (regBoxHeight + 5)) + 10;

  // ==================== PAGE 3 ====================
  doc.addPage();
  y = margin;
  drawHeader('Financial Impact & Recommendations');

  // Financial Impact
  drawSectionTitle('ROI Impact Analysis');

  const finMetrics = [
    { label: 'Total Risk Exposure', value: formatCurrency(financialMetrics.totalExposure), color: redColor },
    { label: 'Remediation Investment', value: formatCurrency(financialMetrics.remediationCost), color: yellowColor },
    { label: 'Net ROI', value: formatCurrency(financialMetrics.netROI), color: greenColor },
    { label: 'ROI Multiple', value: `${financialMetrics.roiMultiple.toFixed(1)}x`, color: primaryColor },
    { label: 'Payback Period', value: `${financialMetrics.paybackPeriod} months`, color: primaryColor },
  ];

  const finBoxWidth = (contentWidth - 20) / 5;
  finMetrics.forEach((metric, idx) => {
    const x = margin + (idx * (finBoxWidth + 5));
    doc.setFillColor(248, 250, 252);
    doc.roundedRect(x, y, finBoxWidth, 25, 2, 2, 'F');
    
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...metric.color);
    doc.text(metric.value, x + finBoxWidth / 2, y + 10, { align: 'center' });
    
    doc.setFontSize(5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const labelLines = doc.splitTextToSize(metric.label.toUpperCase(), finBoxWidth - 4);
    doc.text(labelLines, x + finBoxWidth / 2, y + 17, { align: 'center' });
  });
  y += 35;

  // Remediation Recommendations
  drawSectionTitle('Remediation Recommendations');

  findings.forEach((finding, idx) => {
    if (y + 20 > pageHeight - margin) {
      doc.addPage();
      y = margin;
      drawHeader('Remediation Recommendations (continued)');
    }

    doc.setFillColor(248, 250, 252);
    doc.roundedRect(margin, y, contentWidth, 18, 2, 2, 'F');

    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...darkColor);
    doc.text(safeText(`${idx + 1}. ${finding.title}`), margin + 4, y + 6);

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...grayColor);
    const recLines = doc.splitTextToSize(safeText(`Recommendation: ${finding.recommendation}`), contentWidth - 8);
    doc.text(recLines[0], margin + 4, y + 12);

    // Effort badge (bigger + clearer so letters don't look mangled)
    const effortColors: Record<string, [number, number, number]> = {
      quick: greenColor,
      medium: yellowColor,
      extended: redColor,
    };
    const effort = safeText(finding.estimatedEffort).toUpperCase();

    const badgeW = 22;
    const badgeH = 6;
    const badgeX = pageWidth - margin - badgeW;
    const badgeY = y + 2;

    doc.setFillColor(...(effortColors[finding.estimatedEffort] || grayColor));
    doc.roundedRect(badgeX, badgeY, badgeW, badgeH, 1, 1, 'F');
    doc.setFontSize(6);
    doc.setTextColor(255, 255, 255);
    doc.text(effort, badgeX + badgeW / 2, badgeY + 4.5, { align: 'center' });

    y += 22;
  });
  y += 10;

  // Footer on last page
  if (y + 30 < pageHeight - margin) {
    doc.setDrawColor(226, 232, 240);
    doc.line(margin, y, pageWidth - margin, y);
    y += 8;

    doc.setFontSize(8);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Next Steps', margin, y);
    y += 5;

    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(...darkColor);
    const nextSteps = [
      '1. Review findings with your AI governance team',
      '2. Prioritize remediations based on ROI impact and regulatory deadlines',
      '3. Implement quick wins within 30 days',
      '4. Schedule follow-up assessment in 90 days',
    ];
    nextSteps.forEach(step => {
      doc.text(step, margin, y);
      y += 4;
    });
    y += 8;

    doc.setFontSize(6);
    doc.setTextColor(...grayColor);
    doc.text(
      safeText('(c) 2024 METRIS AI Governance Platform. This report is confidential and intended for authorized recipients only.'),
      pageWidth / 2,
      y,
      { align: 'center' }
    );
  }

  // Save
  doc.save(`METRIS-Governance-Report-${assessmentDate.toISOString().split('T')[0]}.pdf`);
}

// New function for assessment report PDF generation
export async function generatePDFReport(config: any): Promise<Blob> {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });
  const pageWidth = doc.internal.pageSize.getWidth();
  const margin = 20;
  const contentWidth = pageWidth - margin * 2;

  // Cover Page
  doc.setFillColor(15, 23, 41);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');
  
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('AI GOVERNANCE', pageWidth / 2, 80, { align: 'center' });
  doc.text('ASSESSMENT', pageWidth / 2, 92, { align: 'center' });
  
  doc.setFontSize(16);
  doc.setTextColor(8, 145, 178);
  doc.text('METRIS REPORT', pageWidth / 2, 108, { align: 'center' });

  doc.setTextColor(100, 116, 139);
  doc.setFontSize(11);
  doc.text('Prepared for: ACME Corporation', pageWidth / 2, 140, { align: 'center' });
  doc.text('Assessment Date: January 16, 2026', pageWidth / 2, 150, { align: 'center' });
  doc.text('Assessment ID: MTR-2026-0847', pageWidth / 2, 160, { align: 'center' });

  doc.setFontSize(8);
  doc.text('Powered by METRIS • Verified Assessment', pageWidth / 2, 270, { align: 'center' });

  // Executive Summary Page
  doc.addPage();
  doc.setTextColor(30, 41, 59);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('EXECUTIVE SUMMARY', margin, 25);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('METRIS Score: 687 ± 34 (Moderate Tier)', margin, 40);
  doc.text('Risk Exposure: $2.1M (VaR 95%)', margin, 48);
  doc.text('Gaps: 6 Major, 14 Minor, 8 OFI', margin, 56);
  doc.text('Checkpoints Evaluated: 1,915', margin, 64);

  doc.setFontSize(9);
  const summary = 'This assessment evaluated AI governance posture against 1,915 checkpoints across 5 regulatory frameworks. The organization demonstrates moderate maturity with notable strengths in policy documentation.';
  const lines = doc.splitTextToSize(summary, contentWidth);
  doc.text(lines, margin, 80);

  // Add more pages based on config...
  doc.setFontSize(8);
  doc.setTextColor(100, 116, 139);
  doc.text('© 2026 SANJEEVANI AI. All rights reserved.', margin, 280);

  return doc.output('blob');
}
