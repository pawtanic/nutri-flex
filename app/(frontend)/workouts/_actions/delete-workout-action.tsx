'use server';

import { revalidatePath } from 'next/cache';
import { deleteWorkout } from '@/app/(frontend)/workouts/_actions/delete-workout';

export async function deleteWorkoutAction(workoutId: string) {
  if (!workoutId) {
    return { success: false, message: 'Workout ID is required' };
  }

  try {
    await deleteWorkout(workoutId);
    revalidatePath('/workouts');
    return { success: true };
  } catch (error) {
    console.error('Failed to delete workout:', error);
    return { success: false, message: 'Failed to delete workout' };
  }
}
