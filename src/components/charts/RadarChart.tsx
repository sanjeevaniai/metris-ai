import React from 'react';
import {
  Radar,
  RadarChart as RechartsRadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from 'recharts';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_PILLARS } from '@/data/demoPillars';
import { cn } from '@/lib/utils';

interface RadarChartProps {
  showBenchmark?: boolean;
  showProjected?: boolean;
  className?: string;
  onPillarClick?: (pillarId: string) => void;
}

// Industry benchmark scores (slightly higher than current for comparison)
const BENCHMARK_SCORES: Record<string, number> = {
  transparency: 780,
  reliability: 750,
  security: 720,
  privacy: 760,
  fairness: 680,
  ethics: 820,
  accountability: 740,
  explainability: 750,
  human_oversight: 730,
  supply_chain: 700,
  incident_response: 710,
  digital_maturity: 720,
};

// Projected scores after remediation
const PROJECTED_SCORES: Record<string, number> = {
  transparency: 850,
  reliability: 800,
  security: 750,
  privacy: 820,
  fairness: 720,
  ethics: 910,
  accountability: 800,
  explainability: 830,
  human_oversight: 820,
  supply_chain: 760,
  incident_response: 780,
  digital_maturity: 780,
};

const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    const pillar = DEMO_PILLARS.find(p => p.id === data.pillarId);
    
    return (
      <div className="bg-bg-secondary border border-white/10 rounded-lg p-3 shadow-xl">
        <p className="font-semibold text-text-primary mb-2">{data.name}</p>
        <div className="space-y-1 text-sm">
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">Current Score:</span>
            <span className="text-brand-primary font-mono">{data.current}</span>
          </div>
          <div className="flex justify-between gap-4">
            <span className="text-text-secondary">Benchmark:</span>
            <span className="text-brand-secondary font-mono">{data.benchmark}</span>
          </div>
          {data.projected && (
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Projected:</span>
              <span className="text-status-excellent font-mono">{data.projected}</span>
            </div>
          )}
          <div className="border-t border-white/10 mt-2 pt-2">
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">Exposure:</span>
              <span className="text-status-warning font-mono">
                ${((pillar?.exposure || 0) / 1000000).toFixed(1)}M
              </span>
            </div>
            <div className="flex justify-between gap-4">
              <span className="text-text-secondary">ROI Potential:</span>
              <span className="text-status-good font-mono">{pillar?.roi}x</span>
            </div>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

export function RadarChart({
  showBenchmark = true,
  showProjected = false,
  className,
  onPillarClick,
}: RadarChartProps) {
  const { selectedPillars, setSelectedPillars, simulationMode } = useVisualizationStore();
  
  // Prepare data for the radar chart
  const data = DEMO_PILLARS.map(pillar => ({
    name: pillar.name.length > 12 ? pillar.name.slice(0, 12) + '...' : pillar.name,
    fullName: pillar.name,
    pillarId: pillar.id,
    current: pillar.score,
    benchmark: BENCHMARK_SCORES[pillar.id] || 700,
    projected: simulationMode === 'projected' ? PROJECTED_SCORES[pillar.id] : undefined,
    exposure: pillar.exposure,
    roi: pillar.roi,
  }));

  const handleAxisClick = (value: string) => {
    const pillar = DEMO_PILLARS.find(p => 
      p.name === value || p.name.startsWith(value.replace('...', ''))
    );
    if (pillar) {
      const newSelection = selectedPillars.includes(pillar.id)
        ? selectedPillars.filter(id => id !== pillar.id)
        : [...selectedPillars, pillar.id];
      setSelectedPillars(newSelection);
      onPillarClick?.(pillar.id);
    }
  };

  return (
    <div className={cn("w-full", className)}>
      <ResponsiveContainer width="100%" height={400}>
        <RechartsRadarChart data={data} cx="50%" cy="50%" outerRadius="75%">
          <PolarGrid 
            stroke="rgba(255, 255, 255, 0.1)" 
            strokeDasharray="3 3"
          />
          <PolarAngleAxis
            dataKey="name"
            tick={({ payload, x, y, textAnchor }) => {
              const isSelected = selectedPillars.some(id => {
                const pillar = DEMO_PILLARS.find(p => p.id === id);
                return pillar?.name.startsWith(payload.value.replace('...', ''));
              });
              return (
                <text
                  x={x}
                  y={y}
                  textAnchor={textAnchor}
                  fill={isSelected ? '#00d4aa' : '#a0aec0'}
                  fontSize={11}
                  fontWeight={isSelected ? 600 : 400}
                  className="cursor-pointer hover:fill-brand-primary transition-colors"
                  onClick={() => handleAxisClick(payload.value)}
                >
                  {payload.value}
                </text>
              );
            }}
          />
          <PolarRadiusAxis
            angle={30}
            domain={[0, 1000]}
            tick={{ fill: '#a0aec0', fontSize: 10 }}
            tickCount={5}
          />
          
          {/* Current Score */}
          <Radar
            name="Current Score"
            dataKey="current"
            stroke="#00d4aa"
            fill="#00d4aa"
            fillOpacity={0.3}
            strokeWidth={2}
          />
          
          {/* Industry Benchmark */}
          {showBenchmark && (
            <Radar
              name="Industry Benchmark"
              dataKey="benchmark"
              stroke="#0ea5e9"
              fill="transparent"
              strokeDasharray="5 5"
              strokeWidth={2}
            />
          )}
          
          {/* Projected Score (when simulation active) */}
          {(showProjected || simulationMode === 'projected') && (
            <Radar
              name="Projected Score"
              dataKey="projected"
              stroke="#8b5cf6"
              fill="#8b5cf6"
              fillOpacity={0.15}
              strokeWidth={2}
            />
          )}
          
          <Tooltip content={<CustomTooltip />} />
          
          <Legend
            wrapperStyle={{ paddingTop: 20 }}
            formatter={(value) => (
              <span className="text-text-secondary text-sm">{value}</span>
            )}
          />
        </RechartsRadarChart>
      </ResponsiveContainer>
      
      {selectedPillars.length > 0 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <span className="text-text-secondary text-sm">
            {selectedPillars.length} pillar{selectedPillars.length > 1 ? 's' : ''} selected
          </span>
          <button
            onClick={() => setSelectedPillars([])}
            className="text-brand-primary text-sm hover:underline"
          >
            Clear
          </button>
        </div>
      )}
    </div>
  );
}

export default RadarChart;
