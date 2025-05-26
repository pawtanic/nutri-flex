'use server';

import { hydrationIntakeSchema } from '@/app/(frontend)/settings/_schemas/schemas';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { revalidatePath } from 'next/cache';
import { calculateHydrationGoal } from '@/app/(frontend)/utils/helpers';

export async function saveHydrationIntakeAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const weight = formData.get('weight');
    const sex = formData.get('sex');
    const activity = formData.get('activity');
    const includeFood = formData.get('includeFood') === 'on';
    const initialFoodDataKcalValue = includeFood ? formData.get('initialFoodDataKcal') : undefined;

    // Convert foodData string to FoodData object if present
    const initialFoodDataKcal = initialFoodDataKcalValue
      ? Number(initialFoodDataKcalValue)
      : undefined;

    const inputData = {
      weight,
      sex,
      activity,
      includeFood,
      initialFoodDataKcal,
    };

    const validationResult = hydrationIntakeSchema.safeParse(inputData);
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

    revalidatePath('/settings');

    return {
      success: true,
      message: 'Hydration intake saved successfully',
      inputs: validatedData,
      calculatedGoal: calculateHydrationGoal(
        validatedData.weight,
        validatedData.activity,
        validatedData.sex,
        initialFoodDataKcal
      ),
    };
  } catch (error: unknown) {
    console.error('Error saving hydration intake:', error);

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
