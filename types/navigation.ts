import { Exercise } from "./exercise";
import { Progress } from "./progress";

export type RootStackParamList = {
  '(tabs)': undefined;
  'ExerciseDetail': { exercise: Exercise };
  'WorkoutDay': { day: string; workout: string };
  'AccountSettings': undefined;
  'AddWorkout': { day: string; userId: string, workoutPlanName: string };
  '+not-found': undefined;
  'editWorkout': { day: string};
  'ProgressDetail': { progress: Progress };
  'AddProgress': undefined;
  'EditProgress': { progress: Progress };
};

export type TabParamList = {
  home: undefined;
  explore: undefined;
  progress: undefined;
};