import React, { useState, useMemo } from 'react';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { DEMO_PILLARS } from '@/data/demoPillars';
import { DEMO_FRAMEWORKS } from '@/data/demoFrameworks';
import { DEMO_HEATMAP_DATA, getCoverageColor } from '@/data/demoHeatmap';
import { cn } from '@/lib/utils';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { X } from 'lucide-react';

interface HeatmapProps {
  className?: string;
  onCellClick?: (frameworkId: string, pillarId: string) => void;
}

export function Heatmap({ className, onCellClick }: HeatmapProps) {
  const {
    selectedFrameworks,
    selectedPillars,
    setSelectedFrameworks,
    setSelectedPillars,
  } = useVisualizationStore();
  
  const [hoveredCell, setHoveredCell] = useState<{ framework: string; pillar: string } | null>(null);

  // Create abbreviated pillar names for column headers
  const pillarAbbreviations: Record<string, string> = {
    transparency: 'TRANS',
    reliability: 'RELY',
    security: 'SECUR',
    privacy: 'PRIV',
    fairness: 'FAIR',
    ethics: 'ETHIC',
    accountability: 'ACCT',
    explainability: 'EXPL',
    human_oversight: 'HUMAN',
    supply_chain: 'SUPPLY',
    incident_response: 'INCID',
    digital_maturity: 'DIGI',
  };

  // Get cell data
  const getCellData = (frameworkId: string, pillarId: string) => {
    return DEMO_HEATMAP_DATA.find(
      cell => cell.frameworkId === frameworkId && cell.pillarId === pillarId
    );
  };

  // Check if cell/row/column is selected
  const isCellSelected = (frameworkId: string, pillarId: string) => {
    if (selectedFrameworks.length === 0 && selectedPillars.length === 0) return false;
    const frameworkMatch = selectedFrameworks.length === 0 || selectedFrameworks.includes(frameworkId);
    const pillarMatch = selectedPillars.length === 0 || selectedPillars.includes(pillarId);
    return frameworkMatch && pillarMatch;
  };

  const isRowSelected = (frameworkId: string) => selectedFrameworks.includes(frameworkId);
  const isColumnSelected = (pillarId: string) => selectedPillars.includes(pillarId);

  // Handle clicks
  const handleCellClick = (frameworkId: string, pillarId: string) => {
    const newFrameworks = selectedFrameworks.includes(frameworkId)
      ? selectedFrameworks.filter(f => f !== frameworkId)
      : [...selectedFrameworks, frameworkId];
    const newPillars = selectedPillars.includes(pillarId)
      ? selectedPillars.filter(p => p !== pillarId)
      : [...selectedPillars, pillarId];
    
    setSelectedFrameworks(newFrameworks);
    setSelectedPillars(newPillars);
    onCellClick?.(frameworkId, pillarId);
  };

  const handleRowClick = (frameworkId: string) => {
    const newFrameworks = selectedFrameworks.includes(frameworkId)
      ? selectedFrameworks.filter(f => f !== frameworkId)
      : [...selectedFrameworks, frameworkId];
    setSelectedFrameworks(newFrameworks);
  };

  const handleColumnClick = (pillarId: string) => {
    const newPillars = selectedPillars.includes(pillarId)
      ? selectedPillars.filter(p => p !== pillarId)
      : [...selectedPillars, pillarId];
    setSelectedPillars(newPillars);
  };

  const clearSelections = () => {
    setSelectedFrameworks([]);
    setSelectedPillars([]);
  };

  const hasSelections = selectedFrameworks.length > 0 || selectedPillars.length > 0;

  return (
    <div className={cn("w-full overflow-x-auto", className)}>
      {/* Selection indicator */}
      {hasSelections && (
        <div className="mb-4 flex items-center justify-between bg-bg-tertiary rounded-lg px-4 py-2">
          <span className="text-text-secondary text-sm">
            Showing {selectedFrameworks.length || 'all'} framework{selectedFrameworks.length !== 1 ? 's' : ''} × {selectedPillars.length || 'all'} pillar{selectedPillars.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={clearSelections}
            className="flex items-center gap-1 text-brand-primary text-sm hover:underline"
          >
            <X className="w-4 h-4" />
            Clear selection
          </button>
        </div>
      )}

      <TooltipProvider>
        <div className="inline-block min-w-full">
          <table className="border-collapse">
            <thead>
              <tr>
                <th className="p-2 text-left text-text-secondary text-xs font-medium w-32">
                  Framework
                </th>
                {DEMO_PILLARS.map(pillar => (
                  <th
                    key={pillar.id}
                    onClick={() => handleColumnClick(pillar.id)}
                    className={cn(
                      "p-2 text-center text-xs font-medium cursor-pointer transition-colors min-w-[60px]",
                      isColumnSelected(pillar.id)
                        ? "text-brand-primary bg-brand-primary/10"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                    )}
                  >
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <span>{pillarAbbreviations[pillar.id] || pillar.id}</span>
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>{pillar.name}</p>
                      </TooltipContent>
                    </Tooltip>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {DEMO_FRAMEWORKS.map(framework => (
                <tr key={framework.id}>
                  <td
                    onClick={() => handleRowClick(framework.id)}
                    className={cn(
                      "p-2 text-xs font-medium cursor-pointer transition-colors whitespace-nowrap",
                      isRowSelected(framework.id)
                        ? "text-brand-primary bg-brand-primary/10"
                        : "text-text-secondary hover:text-text-primary hover:bg-bg-tertiary"
                    )}
                  >
                    {framework.shortName}
                  </td>
                  {DEMO_PILLARS.map(pillar => {
                    const cellData = getCellData(framework.id, pillar.id);
                    const isSelected = isCellSelected(framework.id, pillar.id);
                    const isHovered = hoveredCell?.framework === framework.id && hoveredCell?.pillar === pillar.id;
                    const coverage = cellData?.coverage || 0;
                    
                    return (
                      <td
                        key={`${framework.id}-${pillar.id}`}
                        className="p-0"
                      >
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <div
                              onClick={() => handleCellClick(framework.id, pillar.id)}
                              onMouseEnter={() => setHoveredCell({ framework: framework.id, pillar: pillar.id })}
                              onMouseLeave={() => setHoveredCell(null)}
                              className={cn(
                                "w-full h-10 flex items-center justify-center cursor-pointer transition-all text-xs font-mono font-semibold",
                                hasSelections && !isSelected && "opacity-30",
                                isHovered && "ring-2 ring-white/50 z-10 relative"
                              )}
                              style={{
                                backgroundColor: getCoverageColor(coverage),
                                color: coverage >= 65 ? '#0f1419' : '#ffffff',
                              }}
                            >
                              {coverage}%
                            </div>
                          </TooltipTrigger>
                          <TooltipContent side="top" className="max-w-xs">
                            <div className="space-y-2">
                              <div className="font-semibold">{framework.name} × {pillar.name}</div>
                              <div className="text-sm space-y-1">
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Coverage:</span>
                                  <span className="font-mono">{coverage}%</span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Checkpoints:</span>
                                  <span className="font-mono">
                                    {cellData?.checkpointsPassed}/{cellData?.checkpointsTotal}
                                  </span>
                                </div>
                                <div className="flex justify-between gap-4">
                                  <span className="text-muted-foreground">Exposure:</span>
                                  <span className="font-mono text-status-warning">
                                    ${((cellData?.exposure || 0) / 1000).toFixed(0)}K
                                  </span>
                                </div>
                              </div>
                              <div className="text-xs text-muted-foreground pt-1 border-t">
                                Click to filter
                              </div>
                            </div>
                          </TooltipContent>
                        </Tooltip>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </TooltipProvider>

      {/* Legend */}
      <div className="mt-4 flex items-center justify-center gap-6 text-xs">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--status-good))' }} />
          <span className="text-text-secondary">85%+</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(142, 71%, 45%)' }} />
          <span className="text-text-secondary">65-84%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--status-warning))' }} />
          <span className="text-text-secondary">45-64%</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 rounded" style={{ backgroundColor: 'hsl(var(--status-critical))' }} />
          <span className="text-text-secondary">&lt;45%</span>
        </div>
      </div>
    </div>
  );
}

export default Heatmap;
