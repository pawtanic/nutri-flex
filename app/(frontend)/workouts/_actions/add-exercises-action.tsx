'use server';

import { exerciseSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { Exercise } from '@/app/(frontend)/workouts/_components/workout-form';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { redirect } from 'next/navigation';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { createWorkout } from '@/app/(frontend)/workouts/_api/create-workout';
import { Workout } from '@/payload-types';

export async function addExercisesAction(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const workoutName = formData.get('workoutName');
  const exercises = JSON.parse(formData.get('exercises') as string) as Exercise[];

  try {
    // Validate each exercise
    const validationResults = exercises.map(exercise => {
      return exerciseSchema.safeParse({
        workoutName,
        exerciseName: exercise.exerciseName,
        sets: Number(exercise.sets),
        reps: Number(exercise.reps),
      });
    });

    // Check if all exercises are valid
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

    console.log(validationResults, 'validationResults');

    // Transform validation results into the proper workout format
    const workoutData = {
      name: workoutName as string,
      date: new Date().toISOString(),
      exercises: validationResults.map(result => {
        // Since we've already validated, we know these are all success: true
        const data = (result as any).data;
        return {
          name: data.exerciseName,
          sets: data.sets,
          reps: data.reps,
        };
      }),
    };

    await createWorkout({ newWorkout: workoutData as Workout });

    redirect(RoutesConfig.workout);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error creating exercises:', error.message);
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
