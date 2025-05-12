// actions/workout.ts
'use server';

import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { exerciseSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { updateExistingWorkout } from '@/app/(frontend)/workouts/_api/update-workout';
import type { Exercises } from '@/app/(frontend)/workouts/_components/workout-form-types';
import { Workout } from '@/payload-types';

// todo - update in payload

export async function updateWorkout(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const workoutId = formData.get('workoutId') as string;
  const workoutName = formData.get('workoutName') as string;
  const exercises = JSON.parse(formData.get('exercises') as string) as Exercises;

  if (!exercises.length) {
    return {
      success: false,
      message: 'Please add at least one exercise',
    };
  }

  try {
    const validationResults = exercises.map(exercise => {
      return exerciseSchema.safeParse({
        workoutName,
        exerciseName: exercise.exerciseName,
        sets: exercise.sets,
      });
    });

    const hasErrors = validationResults.some(result => !result.success);
    if (hasErrors) {
      const errors = validationResults
        .filter((result): result is { success: false; error: any } => !result.success)
        .map(result => {
          const fieldErrors = result.error.flatten().fieldErrors;

          // Process set errors if they exist
          if (fieldErrors.sets) {
            // Extract set index and error type from error path
            const setsErrors: Array<{ reps?: string; weight?: string }> = [];

            // Get the detailed errors from the error object
            const formattedErrors = result.error.format();

            // If there are set validation errors, they'll be in formattedErrors.sets
            if (formattedErrors.sets?._errors) {
              // General set array errors
              fieldErrors.sets = formattedErrors.sets._errors;
            }

            // Process individual set errors
            if (formattedErrors.sets) {
              // Loop through each set that has errors
              Object.keys(formattedErrors.sets).forEach(key => {
                if (key !== '_errors') {
                  const setIndex = parseInt(key);
                  const setError = formattedErrors.sets[key];

                  // Add structured error for this set
                  setsErrors[setIndex] = {
                    reps: setError.reps?._errors[0],
                    weight: setError.weight?._errors[0],
                  };
                }
              });

              // Replace the sets errors with our structured version
              if (setsErrors.length > 0) {
                fieldErrors.sets = setsErrors;
              }
            }
          }

          return fieldErrors;
        });

      return {
        success: false,
        errors,
        message: 'Please review the errors and try again.',
        inputs: {
          workoutName,
          exercises,
        },
      };
    }

    await updateExistingWorkout(workoutId, {
      name: workoutName,
      exercises: exercises.map(exercise => ({
        exerciseName: exercise.exerciseName,
        sets: exercise.sets.map(set => ({
          reps: Number(set.reps),
          weight: Number(set.weight),
        })),
      })),
    } as Workout);

    return { success: true, message: 'Workout updated successfully' };
  } catch (error: unknown) {
    if (error instanceof Error) {
      return {
        success: false,
        message: 'An error occurred during workout update',
      };
    }

    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}
