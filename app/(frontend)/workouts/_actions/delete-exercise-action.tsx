'use server';

import { getPayload } from 'payload';
import config from '@payload-config';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { Workout } from '@/payload-types';

export async function deleteExerciseAction(
  workoutId: string,
  exerciseId: string
): Promise<ActionResponse> {
  try {
    const payload = await getPayload({ config });

    // First, fetch the current workout
    const workout = (await payload.findByID({
      collection: 'workouts',
      id: workoutId,
    })) as Workout;

    if (!workout) {
      console.log('Workout not found');
      return {
        success: false,
        message: 'Workout not found',
      };
    }

    // Filter out the exercise to be deleted
    const updatedExercises = workout.exercises?.filter(exercise => exercise.id !== exerciseId);

    console.log('Updated exercises after filter:', JSON.stringify(updatedExercises));

    // Update the workout with the filtered exercises
    await payload.update({
      collection: 'workouts',
      id: workoutId,
      data: {
        exercises: updatedExercises,
      },
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
