'use server';

import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { getWorkoutById } from '@/app/(frontend)/workouts/_api/fetch-workout-by-id';
import { updateExistingWorkout } from '@/app/(frontend)/workouts/_api/update-workout';

export async function deleteExerciseAction(
  workoutId: string,
  exerciseId: string
): Promise<ActionResponse> {
  try {
    // Fetch the current workout
    const workout = await getWorkoutById(workoutId);
    if (!workout) {
      return {
        success: false,
        message: 'Workout not found',
      };
    }
    // Filter out the exercise to be deleted
    const updatedExercises = workout.exercises?.filter((exercise: any) => exercise.id !== exerciseId);
    // Update the workout with the filtered exercises
    await updateExistingWorkout(workoutId, {
      ...workout,
      exercises: updatedExercises,
    });
    return {
      success: true,
      message: 'Exercise deleted successfully',
    };
  } catch (error) {
    if (error instanceof Error) {
      return {
        success: false,
        message: `Failed to delete exercise: ${error.message}`,
      };
    }
    return {
      success: false,
      message: 'Failed to delete exercise',
    };
  }
}
