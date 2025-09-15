export interface HealthEntry {
  date: string;
  exercise: {
    duration: number; // in minutes
    type: string;
    intensity: 'low' | 'moderate' | 'high';
    activities: string[];
  };
  healthQuestions: {
    sleep: number; // 1-10 scale
    energy: number; // 1-10 scale
    stress: number; // 1-10 scale
    nutrition: number; // 1-10 scale
    hydration: number; // 1-10 scale
    pain: number; // 1-10 scale (10 being no pain)
  };
  overallHealthScore: number; // calculated score
  suggestions: string[];
}

export interface HealthStats {
  totalExerciseMinutes: number;
  averageHealthScore: number;
  exerciseStreak: number;
  mostCommonExercise: string;
  healthTrend: 'improving' | 'stable' | 'declining';
  weeklyAverage: {
    exercise: number;
    sleep: number;
    energy: number;
    stress: number;
    nutrition: number;
    hydration: number;
    pain: number;
  };
}

export interface CombinedEntry {
  date: string;
  mood: {
    mood: string;
    emoji: string;
    description?: string;
  };
  health: HealthEntry;
}
