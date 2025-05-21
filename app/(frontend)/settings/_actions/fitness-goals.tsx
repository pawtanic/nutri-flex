// Initial state for the form
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { fitnessGoalsSchema } from '@/app/(frontend)/settings/_schemas/schemas';

export interface FitnessGoalsResponse {
  success: boolean;
  message: string;
  errors?: {
    calories?: string;
    protein?: string;
    workouts?: string;
    hydration?: string;
  };
  inputs?: {
    calories?: number;
    protein?: number;
    workouts?: number;
    hydration?: number;
  };
}

export const initialState: FitnessGoalsResponse = {
  success: false,
  message: '',
  errors: {},
  inputs: {},
};

// Server action to save fitness goals
export async function saveFitnessGoals(
  _: ActionResponse,
  formData: FormData
): Promise<FitnessGoalsResponse> {
  // Extract form data
  const formValues = {
    calories: formData.get('calories'),
    protein: formData.get('protein'),
    workouts: formData.get('workouts'),
    hydration: formData.get('hydration'),
  };

  // Validate with zod
  const validationResult = fitnessGoalsSchema.safeParse(formValues);

  if (!validationResult.success) {
    const errors = validationResult.error.flatten().fieldErrors;
    return {
      success: false,
      message: 'Please correct the form errors',
      errors: Object.fromEntries(
        Object.entries(errors).map(([key, value]) => [key, value?.[0] || ''])
      ),
      inputs: formValues as unknown as { calories?: number; protein?: number; workouts?: number },
    };
  }

  try {
    // Simulate API call to save goals
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Return success response
    return {
      success: true,
      message: 'Fitness goals saved successfully',
      inputs: validationResult.data,
    };
  } catch (error) {
    console.error('Error saving fitness goals:', error);
    return {
      success: false,
      message: 'Failed to save fitness goals. Please try again.',
      inputs: formValues as unknown as { calories?: number; protein?: number; workouts?: number },
    };
  }
}
