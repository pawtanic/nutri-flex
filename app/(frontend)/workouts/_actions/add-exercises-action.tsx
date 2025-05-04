'use server';

import { exerciseSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { Exercise } from '@/app/(frontend)/workouts/_components/workout-form';
import { ActionResponse } from '@/app/(frontend)/types/common-types';

export async function addExercisesAction(
  _: ActionResponse,
  formData: FormData
): Promise<ActionResponse> {
  const workoutName = formData.get('workoutName');
  const exercises = JSON.parse(formData.get('exercises') as string) as Exercise[];

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

  try {
    // Extract valid data
    const validExercises = validationResults.map(result => {
      return (result as { success: true; data: any }).data;
    });

    // Create exercises in Payload CMS - move to payload api
    const responses = await Promise.all(
      validExercises.map(exercise =>
        fetch(`${process.env.PAYLOAD_API_URL}/api/exercises`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(exercise),
          cache: 'no-store',
        })
      )
    );

    // Check if all responses are successful
    const hasRequestErrors = responses.some(response => !response.ok);
    if (hasRequestErrors) {
      return {
        success: false,
        message: 'Failed to create some exercises',
      };
    }

    return {
      success: true,
      message: 'Exercises created successfully',
    };
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
