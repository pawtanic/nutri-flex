// actions/workout.ts
'use server';

import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { Exercise } from '@/app/(frontend)/workouts/_components/workout-form';
import { exerciseSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { updateExistingWorkout } from '@/app/(frontend)/workouts/_api/update-workout';
import { redirect } from 'next/navigation';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { Workout } from '@/payload-types';

// todo - update in payload

export async function updateWorkout(_: ActionResponse, formData: FormData) {
  const workoutId = formData.get('workoutId') as string;
  const workoutName = formData.get('workoutName') as string;
  const exercises = JSON.parse(formData.get('exercises') as string) as Exercise[];

  try {
    const validationResults = exercises.map(exercise => {
      return exerciseSchema.safeParse({
        workoutName,
        exerciseName: exercise.exerciseName,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
      });
    });

    const hasErrors = validationResults.some(result => !result.success);
    if (hasErrors) {
      const errors = validationResults
        .filter((result): result is { success: false; error: any } => !result.success)
        .map(result => result.error.flatten().fieldErrors);

      return {
        success: false,
        errors,
        message: 'Please review the errors and try again.',
      };
    }

    await updateExistingWorkout(workoutId, {
      name: workoutName,
      exercises: exercises.map(exercise => ({
        name: exercise.exerciseName,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
        id: exercise.id,
      })),
    } as Workout);

    redirect(RoutesConfig.workout);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating workout:', error.message);
      return {
        success: false,
        message: 'An error occurred during exercise creation',
      };
    }

    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}
