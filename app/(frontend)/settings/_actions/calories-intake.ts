'use server';

import {
  CaloriesIntakeData,
  caloriesIntakeSchema,
} from '@/app/(frontend)/settings/_schemas/schemas';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { revalidatePath } from 'next/cache';
import { ActivityLevel, calculateTDEE } from '@/app/(frontend)/utils/helpers';

export async function saveCaloriesIntakeAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const weight = formData.get('weight');
    const height = formData.get('height');
    const age = formData.get('age');
    const sex = formData.get('sex');
    const activity = formData.get('activity');
    const goal = formData.get('goal');

    const inputData = {
      weight,
      height,
      age,
      sex,
      activity,
      goal,
    };

    const validationResult = caloriesIntakeSchema.safeParse(inputData);

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.flatten().fieldErrors;

      return {
        success: false,
        message: 'Please review the errors and try again.',
        errors: formattedErrors,
        inputs: inputData,
      };
    }

    const validatedData = validationResult.data;

    const calculatedCalories = calculateTDEE(validatedData);

    revalidatePath('/settings');

    return {
      success: true,
      message: 'Calorie intake calculated successfully',
      inputs: validatedData,
      calculatedGoal: calculatedCalories,
    };
  } catch (error: unknown) {
    console.error('Error calculating calorie intake:', error);

    if (error instanceof Error) {
      return {
        success: false,
        message: `An error occurred: ${error.message}`,
      };
    }

    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}
