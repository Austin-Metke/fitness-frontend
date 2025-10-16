export interface Progress {
  id?: number;
  user_id: number;
  date: string;
  weight: number;
  bfPercentage: number;
  personalBests?: PersonalBest[];
}

export interface PersonalBest {
  id?: number;
  progress_id: number;
  exercise: string;
  weight: number;
  reps: number;
  sets?: number;
  notes?: string;
}

export interface ProgressFormData {
  date: string;
  weight: number;
  bfPercentage: number;
  personalBests: Omit<PersonalBest, 'id' | 'progress_id'>[];
}

export interface ProgressStats {
  currentWeight: number;
  weightChange: number;
  currentBF: number;
  bfChange: number;
  totalEntries: number;
  lastEntryDate: string;
}
