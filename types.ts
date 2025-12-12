export interface InterpretationResponse {
  mode: "interpretation_panel";
  recommended: string;
  options: string[];
}

export interface FinalResponse {
  mode: "final_output";
  selected_option: string;
  result: string;
}

export type AppState = 
  | 'IDLE' 
  | 'ANALYZING' 
  | 'SELECTION_REQUIRED' 
  | 'GENERATING_FINAL' 
  | 'COMPLETED' 
  | 'ERROR';

export interface HistoryItem {
  id: string;
  originalRequest: string;
  selectedInterpretation: string;
  finalResult: string;
  timestamp: number;
}