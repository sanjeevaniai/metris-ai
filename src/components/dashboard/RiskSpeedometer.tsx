import { useEffect, useRef } from 'react';

interface RiskSpeedometerProps {
  value: number; // 0-1000
  label: string;
  size?: number;
}

export const RiskSpeedometer = ({ value, label, size = 200 }: RiskSpeedometerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // High DPI support
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    ctx.scale(dpr, dpr);

    const centerX = size / 2;
    const centerY = size / 2 + 15;
    const radius = size / 2 - 25;

    // Clear canvas
    ctx.clearRect(0, 0, size, size);

    // Draw arc from 7 o'clock to 5 o'clock (roughly 220° to 320° range)
    const startAngle = Math.PI * 0.75; // 135 degrees (7 o'clock position)
    const endAngle = Math.PI * 2.25;   // 405 degrees (5 o'clock position)
    const totalAngle = endAngle - startAngle;
    
    // Draw colored segments: Red -> Orange -> Yellow -> Green (0-1000 scale)
    // Higher score = better = green
    const segments = [
      { start: 0, end: 0.25, color: '#ef4444' },     // Red (0-250: Critical)
      { start: 0.25, end: 0.50, color: '#f97316' },  // Orange (250-500: At Risk)
      { start: 0.50, end: 0.70, color: '#eab308' },  // Yellow (500-700: Developing)
      { start: 0.70, end: 0.85, color: '#22c55e' },  // Green (700-850: Good)
      { start: 0.85, end: 1, color: '#10b981' },     // Emerald (850-1000: Excellent)
    ];

    // Draw track background
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, startAngle, endAngle);
    ctx.strokeStyle = 'rgba(255,255,255,0.1)';
    ctx.lineWidth = 16;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Draw colored segments
    segments.forEach((segment) => {
      const segmentStartAngle = startAngle + totalAngle * segment.start;
      const segmentEndAngle = startAngle + totalAngle * segment.end;
      
      ctx.beginPath();
      ctx.arc(centerX, centerY, radius, segmentStartAngle, segmentEndAngle);
      ctx.strokeStyle = segment.color;
      ctx.lineWidth = 14;
      ctx.lineCap = 'butt';
      ctx.stroke();
    });

    // Draw tick marks
    const numTicks = 10;
    for (let i = 0; i <= numTicks; i++) {
      const tickAngle = startAngle + (totalAngle * i) / numTicks;
      const innerRadius = radius - 12;
      const outerRadius = radius + 12;
      
      ctx.beginPath();
      ctx.moveTo(
        centerX + Math.cos(tickAngle) * innerRadius,
        centerY + Math.sin(tickAngle) * innerRadius
      );
      ctx.lineTo(
        centerX + Math.cos(tickAngle) * outerRadius,
        centerY + Math.sin(tickAngle) * outerRadius
      );
      ctx.strokeStyle = 'rgba(255,255,255,0.3)';
      ctx.lineWidth = i % 5 === 0 ? 2 : 1;
      ctx.stroke();
    }

    // Draw needle
    const normalizedValue = Math.min(Math.max(value, 0), 1000) / 1000;
    const needleAngle = startAngle + totalAngle * normalizedValue;
    const needleLength = radius - 20;
    
    // Needle shadow
    ctx.beginPath();
    ctx.moveTo(centerX + 2, centerY + 2);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * needleLength + 2,
      centerY + Math.sin(needleAngle) * needleLength + 2
    );
    ctx.strokeStyle = 'rgba(0,0,0,0.3)';
    ctx.lineWidth = 4;
    ctx.lineCap = 'round';
    ctx.stroke();
    
    // Main needle
    ctx.beginPath();
    ctx.moveTo(centerX, centerY);
    ctx.lineTo(
      centerX + Math.cos(needleAngle) * needleLength,
      centerY + Math.sin(needleAngle) * needleLength
    );
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.stroke();

    // Needle tip glow
    const tipX = centerX + Math.cos(needleAngle) * needleLength;
    const tipY = centerY + Math.sin(needleAngle) * needleLength;
    const gradient = ctx.createRadialGradient(tipX, tipY, 0, tipX, tipY, 8);
    gradient.addColorStop(0, 'rgba(34, 211, 238, 0.8)');
    gradient.addColorStop(1, 'rgba(34, 211, 238, 0)');
    ctx.beginPath();
    ctx.arc(tipX, tipY, 8, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Draw center circle with gradient
    const centerGradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 12);
    centerGradient.addColorStop(0, '#1a1a2e');
    centerGradient.addColorStop(1, '#0f0f1a');
    
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.fillStyle = centerGradient;
    ctx.fill();
    
    // Center circle border with glow
    ctx.beginPath();
    ctx.arc(centerX, centerY, 12, 0, Math.PI * 2);
    ctx.strokeStyle = '#22d3ee';
    ctx.lineWidth = 2;
    ctx.shadowColor = '#22d3ee';
    ctx.shadowBlur = 10;
    ctx.stroke();
    ctx.shadowBlur = 0;

  }, [value, size]);

  // Score interpretation aligned with KB document
  const getScoreInfo = () => {
    if (value >= 950) return { tier: 'Elite', interpretation: 'Exceeds all requirements', color: '#10b981' };
    if (value >= 900) return { tier: 'Excellent', interpretation: 'Strong governance maturity', color: '#22c55e' };
    if (value >= 850) return { tier: 'Good', interpretation: 'Meets investor/insurance threshold', color: '#22c55e' };
    if (value >= 700) return { tier: 'Developing', interpretation: 'Significant gaps requiring attention', color: '#eab308' };
    if (value >= 500) return { tier: 'At Risk', interpretation: 'Major compliance deficiencies', color: '#f97316' };
    return { tier: 'Critical', interpretation: 'Immediate intervention required', color: '#ef4444' };
  };

  const scoreInfo = getScoreInfo();

  return (
    <div className="flex flex-col items-center">
      <canvas 
        ref={canvasRef} 
        width={size} 
        height={size} 
        style={{ width: size, height: size }}
        className="drop-shadow-lg"
      />
      <div className="text-center -mt-6">
        <p className="text-4xl font-bold" style={{ color: scoreInfo.color }}>{value}</p>
        <p className="text-sm text-muted-foreground font-light">/1000</p>
        <p className="text-sm font-semibold mt-1" style={{ color: scoreInfo.color }}>{scoreInfo.tier}</p>
        <p className="text-xs text-muted-foreground mt-0.5">{scoreInfo.interpretation}</p>
        <p className="text-xs text-muted-foreground mt-2">{label}</p>
      </div>
    </div>
  );
};