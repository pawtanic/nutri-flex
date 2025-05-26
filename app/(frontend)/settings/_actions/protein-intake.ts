'use server';

import { ProteinIntakeData, proteinIntakeSchema } from '@/app/(frontend)/settings/_schemas/schemas';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { revalidatePath } from 'next/cache';
import { ActivityLevel } from '@/app/(frontend)/utils/helpers';

function calculateProteinIntake(validatedData: ProteinIntakeData): number {
  let proteinPerKg: number;

  switch (validatedData.activity) {
    case 'none':
      proteinPerKg = 1.2;
      break;
    case 'light':
      proteinPerKg = 1.4;
      break;
    case 'moderate':
      proteinPerKg = 1.6;
      break;
    case 'heavy':
      proteinPerKg = 1.8;
      break;
    default:
      proteinPerKg = 1.2;
  }

  // Adjust for sex (slightly higher for males)
  if (validatedData.sex === 'male') {
    proteinPerKg += 0.1;
  }

  // Adjust for age (higher for older adults)
  if (validatedData.age >= 65) {
    proteinPerKg = Math.max(proteinPerKg, 1.2); // Ensure minimum of 1.2g/kg for older adults
    proteinPerKg += 0.1; // Additional 0.1g/kg for older adults
  }

  return Math.round(validatedData.weight * proteinPerKg);
}

export async function saveProteinIntakeAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    const weight = formData.get('weight');
    const sex = formData.get('sex');
    const activity = formData.get('activity');
    const age = formData.get('age');

    const inputData = {
      weight,
      sex,
      activity,
      age,
    };

    const validationResult = proteinIntakeSchema.safeParse(inputData);

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

    const calculatedProtein = calculateProteinIntake(validatedData);

    revalidatePath('/settings');

    return {
      success: true,
      message: 'Protein intake calculated successfully',
      inputs: validatedData,
      calculatedGoal: calculatedProtein,
    };
  } catch (error: unknown) {
    console.error('Error calculating protein intake:', error);

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
