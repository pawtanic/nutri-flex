'use server';

import {
  CaloriesIntakeData,
  caloriesIntakeSchema,
} from '@/app/(frontend)/settings/_schemas/schemas';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { revalidatePath } from 'next/cache';
import { ActivityLevel } from '@/app/(frontend)/utils/helpers';

function calculateTDEE(validatedData: CaloriesIntakeData): number {
  // Calculate BMR using Harris-Benedict equation
  let bmr: number;

  if (validatedData.sex === 'male') {
    // BMR for men = 66.5 + (13.75 × weight in kg) + (5.003 × height in cm) - (6.75 × age)
    bmr =
      66.5 + 13.75 * validatedData.weight + 5.003 * validatedData.height - 6.75 * validatedData.age;
  } else {
    // BMR for women = 655.1 + (9.563 × weight in kg) + (1.850 × height in cm) - (4.676 × age)
    bmr =
      655.1 +
      9.563 * validatedData.weight +
      1.85 * validatedData.height -
      4.676 * validatedData.age;
  }

  // Calculate TDEE based on activity level
  let activityMultiplier: number;

  switch (validatedData.activity as ActivityLevel) {
    case 'none':
      activityMultiplier = 1.2; // Sedentary (little or no exercise)
      break;
    case 'light':
      activityMultiplier = 1.375; // Light exercise (1-3 days per week)
      break;
    case 'moderate':
      activityMultiplier = 1.55; // Moderate exercise (3-5 days per week)
      break;
    case 'heavy':
      activityMultiplier = 1.725; // Heavy exercise (6-7 days per week)
      break;
    default:
      activityMultiplier = 1.2;
  }

  let tdee = Math.round(bmr * activityMultiplier);

  // Adjust based on goal
  let calculatedCalories: number;

  switch (validatedData.goal) {
    case 'lose':
      calculatedCalories = Math.round(tdee * 0.8); // 20% deficit for weight loss
      break;
    case 'maintain':
      calculatedCalories = tdee; // Maintenance calories
      break;
    case 'gain':
      calculatedCalories = Math.round(tdee * 1.1); // 10% surplus for weight gain
      break;
    default:
      calculatedCalories = tdee;
  }

  return calculatedCalories;
}

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
