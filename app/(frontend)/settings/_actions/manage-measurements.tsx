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
    // TODO api call here

    // Revalidate the settings page to reflect the changes - should be defined outside catch block ?
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
  const inputs: Record<string, string | number> = {};

  for (const [key, value] of formData.entries()) {
    if (typeof value === 'string') {
      if (['height', 'weight', 'height-ft', 'height-in', 'weight-st', 'weight-lb'].includes(key)) {
        inputs[key] = value.trim() === '' ? '' : Number(value);
      } else {
        inputs[key] = value;
      }
    }
  }

  try {
    const rawData = {
      name: formData.get('name') as string,
      // email: formData.get('email') as string,
      height: formData.get('height') as string,
      heightUnit: formData.get('heightUnit') as MeasurementUnit,
      weight: formData.get('weight') as string,
      weightUnit: formData.get('weightUnit') as MeasurementUnit,
      age: formData.get('age') as string,
    };

    const validatedData = userProfileSchema.parse(rawData);
    // todo api call here

    // should be defined outside catch block ?
    revalidatePath('/settings');

    return {
      success: true,
      message: 'Profile saved successfully',
    };
  } catch (error) {
    console.error('Error saving profile:', error);

    if (error instanceof ZodError) {
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
