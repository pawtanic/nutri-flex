import { SetSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import type { Workout } from '@/payload-types';

export type Set = SetSchema;
export type Exercises = NonNullable<Workout['exercises']>;

export interface WorkoutFormProps {
  exercises: Exercises;
  setExercises: (exercises: Exercises) => void;
}
