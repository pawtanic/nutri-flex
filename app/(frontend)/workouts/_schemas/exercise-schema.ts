import { z } from 'zod';

export const setSchema = z.object({
  reps: z.coerce.number().min(1, 'Reps must be at least 1'),
  weight: z.coerce.number().min(1, 'Weight must be at least 1'),
  // reps: z.coerce.number().min(1, 'Reps must be at least 1').nullable(),
  // weight: z.coerce.number().min(1, 'Weight must be at least 1').nullable(),
});

export type SetSchema = z.infer<typeof setSchema>;

export const exerciseSchema = z.object({
  workoutName: z.string().min(3, 'Workout name must be at least 3 characters'),
  exerciseName: z.string().min(3, 'Exercise name must be at least 3 characters'),
  sets: z.array(setSchema).min(1, 'At least one set is required'),
});

// export type ExerciseSchema = z.infer<typeof exerciseSchema>;
