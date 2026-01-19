import { useCallback, useEffect, useMemo } from 'react';
import { useVisualizationStore } from '@/store/useVisualizationStore';
import { toast } from 'sonner';

// Cross-chart communication hook
export function useChartSync() {
  const {
    selectedPillars,
    selectedFrameworks,
    selectedCheckpoints,
    simulationMode,
    simulatedFixes,
    setSelectedPillars,
    setSelectedFrameworks,
    setSelectedCheckpoints,
    clearAllSelections,
    addSimulatedFix,
    removeSimulatedFix,
    setSimulationMode,
  } = useVisualizationStore();

  // Check if any selections are active
  const hasSelections = useMemo(() => {
    return (
      selectedPillars.length > 0 ||
      selectedFrameworks.length > 0 ||
      selectedCheckpoints.length > 0
    );
  }, [selectedPillars, selectedFrameworks, selectedCheckpoints]);

  // Toggle pillar selection with toast feedback
  const togglePillar = useCallback((pillarId: string, pillarName?: string) => {
    if (selectedPillars.includes(pillarId)) {
      setSelectedPillars(selectedPillars.filter(id => id !== pillarId));
    } else {
      setSelectedPillars([...selectedPillars, pillarId]);
      if (pillarName) {
        toast.info(`Pillar selected: ${pillarName}`, {
          duration: 2000,
          position: 'bottom-right',
        });
      }
    }
  }, [selectedPillars, setSelectedPillars]);

  // Toggle framework selection with toast feedback
  const toggleFramework = useCallback((frameworkId: string, frameworkName?: string) => {
    if (selectedFrameworks.includes(frameworkId)) {
      setSelectedFrameworks(selectedFrameworks.filter(id => id !== frameworkId));
    } else {
      setSelectedFrameworks([...selectedFrameworks, frameworkId]);
      if (frameworkName) {
        toast.info(`Framework selected: ${frameworkName}`, {
          duration: 2000,
          position: 'bottom-right',
        });
      }
    }
  }, [selectedFrameworks, setSelectedFrameworks]);

  // Toggle checkpoint selection
  const toggleCheckpoint = useCallback((checkpointId: string) => {
    if (selectedCheckpoints.includes(checkpointId)) {
      setSelectedCheckpoints(selectedCheckpoints.filter(id => id !== checkpointId));
    } else {
      setSelectedCheckpoints([...selectedCheckpoints, checkpointId]);
    }
  }, [selectedCheckpoints, setSelectedCheckpoints]);

  // Select single pillar (replace current selection)
  const selectPillar = useCallback((pillarId: string, pillarName?: string) => {
    setSelectedPillars([pillarId]);
    if (pillarName) {
      toast.info(`Filtering by: ${pillarName}`, {
        duration: 2000,
        position: 'bottom-right',
      });
    }
  }, [setSelectedPillars]);

  // Select single framework (replace current selection)
  const selectFramework = useCallback((frameworkId: string, frameworkName?: string) => {
    setSelectedFrameworks([frameworkId]);
    if (frameworkName) {
      toast.info(`Filtering by: ${frameworkName}`, {
        duration: 2000,
        position: 'bottom-right',
      });
    }
  }, [setSelectedFrameworks]);

  // Clear all with feedback
  const clearAll = useCallback(() => {
    clearAllSelections();
    toast.success('All selections cleared', {
      duration: 1500,
      position: 'bottom-right',
    });
  }, [clearAllSelections]);

  // Add simulated fix with feedback
  const addFix = useCallback((fix: {
    checkpointId: string;
    name?: string;
    pointsGain: number;
    exposureReduction: number;
  }) => {
    addSimulatedFix({
      checkpointId: fix.checkpointId,
      status: 'pending',
      pointsGain: fix.pointsGain,
      exposureReduction: fix.exposureReduction,
    });
    setSimulationMode('projected');
    toast.success(`Fix added: ${fix.name || fix.checkpointId}`, {
      duration: 2000,
      position: 'bottom-right',
    });
  }, [addSimulatedFix, setSimulationMode]);

  // Remove fix with feedback
  const removeFix = useCallback((checkpointId: string, name?: string) => {
    removeSimulatedFix(checkpointId);
    toast.info(`Fix removed: ${name || checkpointId}`, {
      duration: 1500,
      position: 'bottom-right',
    });
  }, [removeSimulatedFix]);

  // Check if a pillar is selected
  const isPillarSelected = useCallback((pillarId: string) => {
    return selectedPillars.includes(pillarId);
  }, [selectedPillars]);

  // Check if a framework is selected
  const isFrameworkSelected = useCallback((frameworkId: string) => {
    return selectedFrameworks.includes(frameworkId);
  }, [selectedFrameworks]);

  // Check if a checkpoint is selected
  const isCheckpointSelected = useCallback((checkpointId: string) => {
    return selectedCheckpoints.includes(checkpointId);
  }, [selectedCheckpoints]);

  // Get opacity for non-selected items
  const getSelectionOpacity = useCallback((isSelected: boolean) => {
    if (!hasSelections) return 1;
    return isSelected ? 1 : 0.35;
  }, [hasSelections]);

  // Summary text for current selections
  const selectionSummary = useMemo(() => {
    const parts: string[] = [];
    if (selectedPillars.length > 0) {
      parts.push(`${selectedPillars.length} pillar${selectedPillars.length > 1 ? 's' : ''}`);
    }
    if (selectedFrameworks.length > 0) {
      parts.push(`${selectedFrameworks.length} framework${selectedFrameworks.length > 1 ? 's' : ''}`);
    }
    if (selectedCheckpoints.length > 0) {
      parts.push(`${selectedCheckpoints.length} checkpoint${selectedCheckpoints.length > 1 ? 's' : ''}`);
    }
    return parts.length > 0 ? `Filtered by: ${parts.join(', ')}` : '';
  }, [selectedPillars, selectedFrameworks, selectedCheckpoints]);

  return {
    // State
    selectedPillars,
    selectedFrameworks,
    selectedCheckpoints,
    simulationMode,
    simulatedFixes,
    hasSelections,
    selectionSummary,
    
    // Actions
    togglePillar,
    toggleFramework,
    toggleCheckpoint,
    selectPillar,
    selectFramework,
    clearAll,
    addFix,
    removeFix,
    
    // Helpers
    isPillarSelected,
    isFrameworkSelected,
    isCheckpointSelected,
    getSelectionOpacity,
  };
}

// Hook for subscribing to selection changes with callbacks
export function useSelectionEffect(callbacks: {
  onPillarChange?: (pillars: string[]) => void;
  onFrameworkChange?: (frameworks: string[]) => void;
  onCheckpointChange?: (checkpoints: string[]) => void;
  onSimulationChange?: (mode: 'current' | 'projected') => void;
}) {
  const { selectedPillars, selectedFrameworks, selectedCheckpoints, simulationMode } = 
    useVisualizationStore();

  useEffect(() => {
    callbacks.onPillarChange?.(selectedPillars);
  }, [selectedPillars, callbacks.onPillarChange]);

  useEffect(() => {
    callbacks.onFrameworkChange?.(selectedFrameworks);
  }, [selectedFrameworks, callbacks.onFrameworkChange]);

  useEffect(() => {
    callbacks.onCheckpointChange?.(selectedCheckpoints);
  }, [selectedCheckpoints, callbacks.onCheckpointChange]);

  useEffect(() => {
    callbacks.onSimulationChange?.(simulationMode);
  }, [simulationMode, callbacks.onSimulationChange]);
}
