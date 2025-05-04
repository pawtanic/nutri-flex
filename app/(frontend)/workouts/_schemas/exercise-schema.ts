import { z } from 'zod';

export const exerciseSchema = z.object({
  workoutName: z.string().min(3, 'Workout name must be at least 3 characters'),
  exerciseName: z.string().min(3, 'Exercise name must be at least 3 characters'),
  sets: z.number().min(1, 'Sets must be at least 1').positive('Sets must be a positive number'),
  reps: z.number().min(1, 'Reps must be at least 1').positive('Reps must be a positive number'),
});

export type ExerciseSchema = z.infer<typeof exerciseSchema>;
