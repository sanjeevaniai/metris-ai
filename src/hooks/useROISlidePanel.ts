import { create } from 'zustand';

export type ROISlideTrigger = 
  | 'assessment_started' 
  | 'assessment_progress' 
  | 'assessment_complete' 
  | 'manual';

export interface ROISlideData {
  exposureFound?: number;
  findingsCount?: number;
  estimatedSavings?: number;
  fixInvestment?: number;
  roi?: number;
  paybackMonth?: number;
}

export interface ROISlideContext {
  trigger: ROISlideTrigger;
  data?: ROISlideData;
}

interface ROISlidePanelState {
  isOpen: boolean;
  context: ROISlideContext | null;
  open: (context: ROISlideContext) => void;
  close: () => void;
  toggle: () => void;
  updateData: (data: Partial<ROISlideData>) => void;
}

export const useROISlidePanel = create<ROISlidePanelState>((set) => ({
  isOpen: false,
  context: null,
  
  open: (context: ROISlideContext) => set({ isOpen: true, context }),
  
  close: () => set({ isOpen: false }),
  
  toggle: () => set((state) => ({ isOpen: !state.isOpen })),
  
  updateData: (data: Partial<ROISlideData>) => set((state) => ({
    context: state.context 
      ? { ...state.context, data: { ...state.context.data, ...data } }
      : { trigger: 'manual', data },
  })),
}));

// Default data for the slide panel when no assessment data is available
export const DEFAULT_SLIDE_DATA: ROISlideData = {
  exposureFound: 1707500,
  findingsCount: 24,
  estimatedSavings: 1058650,
  fixInvestment: 125000,
  roi: 8.5,
  paybackMonth: 2,
};
