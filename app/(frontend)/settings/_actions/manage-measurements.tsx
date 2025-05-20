'use server';

import { revalidatePath } from 'next/cache';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { userProfileSchema } from '@/app/(frontend)/settings/_schemas/schemas';
import { ZodError } from 'zod';

export type MeasurementUnit = 'metric' | 'imperial';

export async function saveMeasurementPreferences(_: ActionResponse, formData: FormData) {
  const heightUnit = formData.get('heightUnit') as MeasurementUnit;
  const weightUnit = formData.get('weightUnit') as MeasurementUnit;

  const preferences = {
    heightUnit,
    weightUnit,
  };

  try {
    // In a real app, you would save this to your database
    console.log('Saving measurement preferences:', preferences);

    // Simulate a successful save
    await new Promise(resolve => setTimeout(resolve, 500));

    // Revalidate the settings page to reflect the changes
    revalidatePath('/settings');

    return {
      success: true,
      message: 'Measurement preferences saved successfully',
    };
  } catch (error) {
    console.error('Error saving measurement preferences:', error);

    if (error instanceof Error) {
      return {
        success: false,
        message: `Failed to save preferences: ${error.message}`,
      };
    }

    return {
      success: false,
      message: 'Failed to save measurement preferences',
    };
  }
}

export async function saveUserProfile(_: ActionResponse, formData: FormData) {
  // Create an object to collect all input values
  const inputs: Record<string, string | number> = {};

  // Process and collect all form inputs
  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      // Handle numeric inputs
      if (['height', 'weight', 'height-ft', 'height-in', 'weight-st', 'weight-lb'].includes(key)) {
        // Store as number for validation
        inputs[key] = value.trim() === '' ? '' : Number(value);
      } else {
        inputs[key] = value;
      }
    }
  }

  console.log('Form inputs:', inputs);

  try {
    // Extract form data
    const rawData = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      height: formData.get('height') as string,
      heightUnit: formData.get('heightUnit') as MeasurementUnit,
      weight: formData.get('weight') as string,
      weightUnit: formData.get('weightUnit') as MeasurementUnit,
    };
    // In a real app, you would validate and save this to your database
    // unit are stirng change to numbers !!!!!

    const validatedData = userProfileSchema.parse(rawData);
    console.log('Saving user profile:', validatedData);

    revalidatePath('/settings');

    return {
      success: true,
      message: 'Profile saved successfully',
    };
  } catch (error) {
    console.error('Error saving profile:', error);

    // Handle Zod validation errors
    if (error instanceof ZodError) {
      // Format errors into a user-friendly object
      const fieldErrors = error.errors.reduce(
        (acc, err) => {
          const fieldName = err.path.join('.') || 'form';
          acc[fieldName] = err.message;
          return acc;
        },
        {} as Record<string, string>
      );

      return {
        success: false,
        message: 'Please correct the form errors',
        errors: fieldErrors,
        inputs,
      };
    }

    if (error instanceof Error) {
      return {
        success: false,
        message: `Failed to save profile: ${error.message}`,
        inputs,
      };
    }

    return {
      success: false,
      message: 'Failed to save profile',
      inputs,
    };
  }
}
