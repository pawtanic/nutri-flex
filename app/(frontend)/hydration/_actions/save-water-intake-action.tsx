'use server';

import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { waterIntakeSchema } from '@/app/(frontend)/hydration/_schemas/schemas';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { RoutesConfig } from '@/components/common/navigation/navigation';

export async function saveWaterIntakeAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  const waterIntake = formData.get('waterIntake');
  const dateString = formData.get('date') as string;
  const date = new Date(dateString);

  try {
    const validationResult = waterIntakeSchema.safeParse({
      waterIntake,
      date,
    });

    if (!validationResult.success) {
      const formattedErrors = validationResult.error.flatten();
      return {
        success: false,
        message: 'Please review the errors and try again.',
        errors: formattedErrors.fieldErrors,
        inputs: { waterIntake },
      };
    }

    // await saveWaterIntakeToDatabase(validationResult.data);

    return {
      success: true,
      message: 'Water intake saved successfully',
      inputs: validationResult.data,
    };
  } catch (error) {
    console.error('Error saving water intake:', error);
    return {
      success: false,
      message: 'An error occurred while saving water intake',
      errors: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  revalidatePath(RoutesConfig.hydration);
  redirect('/');
}
