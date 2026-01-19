import { create } from 'zustand';

// Types
export interface Organization {
  id: string;
  name: string;
  industry: string;
  ein: string;
  jurisdictions: string[];
}

export interface AISystem {
  id: string;
  name: string;
  type: string;
  riskLevel: string;
  status: string;
  score: number;
}

export interface SimulatedFix {
  checkpointId: string;
  status: 'fixed' | 'pending';
  pointsGain: number;
  exposureReduction: number;
}

export interface VisualizationMetrics {
  currentScore: number;
  projectedScore: number;
  currentExposure: number;
  projectedExposure: number;
  totalROI: number;
  paybackDays: number;
}

export interface VisualizationState {
  // Current Organization
  organization: Organization;
  
  // Current AI System being viewed
  selectedSystem: AISystem | null;
  
  // All AI Systems
  aiSystems: AISystem[];
  
  // Selections (for cross-filtering)
  selectedPillars: string[];
  selectedFrameworks: string[];
  selectedCheckpoints: string[];
  selectedAgents: number[];
  
  // Simulation Mode
  simulationMode: 'current' | 'projected';
  simulatedFixes: SimulatedFix[];
  
  // Computed Metrics (recalculated on changes)
  metrics: VisualizationMetrics;
  
  // Actions
  setOrganization: (org: Organization) => void;
  setSelectedSystem: (system: AISystem | null) => void;
  setSelectedPillars: (pillars: string[]) => void;
  setSelectedFrameworks: (frameworks: string[]) => void;
  setSelectedCheckpoints: (checkpoints: string[]) => void;
  setSelectedAgents: (agents: number[]) => void;
  toggleSimulationMode: () => void;
  setSimulationMode: (mode: 'current' | 'projected') => void;
  addSimulatedFix: (fix: SimulatedFix) => void;
  removeSimulatedFix: (checkpointId: string) => void;
  clearSimulatedFixes: () => void;
  clearAllSelections: () => void;
  recalculateMetrics: () => void;
}

// Initial demo data
const initialOrganization: Organization = {
  id: "org_demo_001",
  name: "Meridian Health Systems",
  industry: "Healthcare",
  ein: "84-2847591",
  jurisdictions: ["US", "EU"],
};

const initialAISystems: AISystem[] = [
  { id: "sys_001", name: "DiagnosticAI Pro", type: "Classification Model", riskLevel: "High-Risk", status: "Production", score: 743 },
  { id: "sys_002", name: "PatientChat Assistant", type: "Generative AI / LLM", riskLevel: "High-Risk", status: "Production", score: 687 },
  { id: "sys_003", name: "ClaimsProcessor ML", type: "Classification Model", riskLevel: "Limited Risk", status: "Production", score: 812 },
];

const initialMetrics: VisualizationMetrics = {
  currentScore: 743,
  projectedScore: 743,
  currentExposure: 12800000,
  projectedExposure: 12800000,
  totalROI: 0,
  paybackDays: 0,
};

// Zustand store
export const useVisualizationStore = create<VisualizationState>((set, get) => ({
  // Initial state
  organization: initialOrganization,
  selectedSystem: initialAISystems[0],
  aiSystems: initialAISystems,
  selectedPillars: [],
  selectedFrameworks: [],
  selectedCheckpoints: [],
  selectedAgents: [],
  simulationMode: 'current',
  simulatedFixes: [],
  metrics: initialMetrics,

  // Actions
  setOrganization: (org) => set({ organization: org }),
  
  setSelectedSystem: (system) => set({ selectedSystem: system }),
  
  setSelectedPillars: (pillars) => set({ selectedPillars: pillars }),
  
  setSelectedFrameworks: (frameworks) => set({ selectedFrameworks: frameworks }),
  
  setSelectedCheckpoints: (checkpoints) => set({ selectedCheckpoints: checkpoints }),
  
  setSelectedAgents: (agents) => set({ selectedAgents: agents }),
  
  toggleSimulationMode: () => set((state) => ({
    simulationMode: state.simulationMode === 'current' ? 'projected' : 'current'
  })),
  
  setSimulationMode: (mode) => set({ simulationMode: mode }),
  
  addSimulatedFix: (fix) => set((state) => {
    const existing = state.simulatedFixes.find(f => f.checkpointId === fix.checkpointId);
    if (existing) return state;
    
    const newFixes = [...state.simulatedFixes, fix];
    const totalPointsGain = newFixes.reduce((sum, f) => sum + f.pointsGain, 0);
    const totalExposureReduction = newFixes.reduce((sum, f) => sum + f.exposureReduction, 0);
    
    return {
      simulatedFixes: newFixes,
      metrics: {
        ...state.metrics,
        projectedScore: state.metrics.currentScore + totalPointsGain,
        projectedExposure: state.metrics.currentExposure - totalExposureReduction,
        totalROI: totalExposureReduction > 0 ? totalExposureReduction / 45000 : 0, // Assume $45K fix cost
        paybackDays: totalExposureReduction > 0 ? Math.ceil(45000 / (totalExposureReduction / 365)) : 0,
      }
    };
  }),
  
  removeSimulatedFix: (checkpointId) => set((state) => {
    const newFixes = state.simulatedFixes.filter(f => f.checkpointId !== checkpointId);
    const totalPointsGain = newFixes.reduce((sum, f) => sum + f.pointsGain, 0);
    const totalExposureReduction = newFixes.reduce((sum, f) => sum + f.exposureReduction, 0);
    
    return {
      simulatedFixes: newFixes,
      metrics: {
        ...state.metrics,
        projectedScore: state.metrics.currentScore + totalPointsGain,
        projectedExposure: state.metrics.currentExposure - totalExposureReduction,
        totalROI: totalExposureReduction > 0 ? totalExposureReduction / 45000 : 0,
        paybackDays: totalExposureReduction > 0 ? Math.ceil(45000 / (totalExposureReduction / 365)) : 0,
      }
    };
  }),
  
  clearSimulatedFixes: () => set((state) => ({
    simulatedFixes: [],
    metrics: {
      ...state.metrics,
      projectedScore: state.metrics.currentScore,
      projectedExposure: state.metrics.currentExposure,
      totalROI: 0,
      paybackDays: 0,
    }
  })),
  
  clearAllSelections: () => set({
    selectedPillars: [],
    selectedFrameworks: [],
    selectedCheckpoints: [],
    selectedAgents: [],
    simulatedFixes: [],
    simulationMode: 'current',
  }),
  
  recalculateMetrics: () => set((state) => {
    const totalPointsGain = state.simulatedFixes.reduce((sum, f) => sum + f.pointsGain, 0);
    const totalExposureReduction = state.simulatedFixes.reduce((sum, f) => sum + f.exposureReduction, 0);
    
    return {
      metrics: {
        ...state.metrics,
        projectedScore: state.metrics.currentScore + totalPointsGain,
        projectedExposure: state.metrics.currentExposure - totalExposureReduction,
        totalROI: totalExposureReduction > 0 ? totalExposureReduction / 45000 : 0,
        paybackDays: totalExposureReduction > 0 ? Math.ceil(45000 / (totalExposureReduction / 365)) : 0,
      }
    };
  }),
}));

// Selector hooks for performance
export const useOrganization = () => useVisualizationStore((state) => state.organization);
export const useSelectedSystem = () => useVisualizationStore((state) => state.selectedSystem);
export const useSimulationMode = () => useVisualizationStore((state) => state.simulationMode);
export const useMetrics = () => useVisualizationStore((state) => state.metrics);
export const useSimulatedFixes = () => useVisualizationStore((state) => state.simulatedFixes);
