
export interface Task {
  id: number;
  title: string;
  description: string;
  prepTime: number;
  speakTime: number;
  requiresImage: boolean;
  samples: string[];
  helper?: {
    title: string;
    points: string[];
  };
}

export enum TimerPhase {
  IDLE = 'IDLE',
  PREPARATION = 'PREPARATION',
  SPEAKING = 'SPEAKING',
  FINISHED = 'FINISHED'
}

export interface AppState {
  currentTaskId: number;
  isCustomMode: boolean;
  customText: string;
  selectedSampleIndex: number;
  uploadedImage: string | null;
  phase: TimerPhase;
  practiceCount: number;
}
