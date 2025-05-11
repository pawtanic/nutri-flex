'use server';

import { exerciseSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { Exercises } from '@/app/(frontend)/workouts/_components/workout-form';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { createWorkout } from '@/app/(frontend)/workouts/_api/create-workout';

export async function addExercisesAction(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const workoutName = formData.get('workoutName');
  const exercises = JSON.parse(formData.get('exercises') as string) as Exercises;

  try {
    // Validate each exercise
    const validationResults = exercises.map(exercise => {
      return exerciseSchema.safeParse({
        workoutName,
        exerciseName: exercise.exerciseName,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
        })),
      });
    });

    // Check if all exercises are valid
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

    // Transform validation results into the proper workout format
    const workoutData = {
      name: workoutName as string,
      date: new Date().toISOString(),
      exercises: validationResults.map(result => {
        // Since we've already validated, we know these are all success: true
        const data = (result as any).data;

        // Make sure the sets have the correct structure
        const sets = data.sets.map(set => ({
          reps: Number(set.reps),
          weight: Number(set.weight),
        }));

        return {
          exerciseName: data.exerciseName,
          sets: sets,
        };
      }),
    };

    console.log('Sending workout data:', JSON.stringify(workoutData));

    // Create the workout first
    await createWorkout({ newWorkout: workoutData });

    // Then redirect - this will throw a NEXT_REDIRECT "error" that should not be caught
    return { success: true, message: 'Workout created successfully' };
  } catch (error: unknown) {
    console.error('Full error object:', error);

    if (error instanceof Error) {
      // Check if this is a redirect "error" - if so, don't treat it as an error
      if (error.message.includes('NEXT_REDIRECT')) {
        throw error; // Re-throw the redirect to let Next.js handle it
      }

      console.error('Error creating exercises:', error.message, error.stack);
      return {
        success: false,
        message: `Error during exercise creation: ${error.message}`,
      };
    }

    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}
