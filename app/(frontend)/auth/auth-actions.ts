'use server';

import { loginSchema, signupSchema } from '@/app/(frontend)/auth/auth-schema';
import { ActionResponse } from '../types/common-types';
import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import { constructApiUrl } from '@/app/(frontend)/utils/helpers';

export type { LoginFormValues, SignupFormValues } from './auth-schema';

const handleApiError = (error: unknown, defaultMessage: string): ActionResponse => {
  console.error('API Error:', error);

  if (error instanceof Error) {
    return {
      success: false,
      message: error.message || defaultMessage,
    };
  }

  if (typeof error === 'object' && error !== null && 'message' in error) {
    return {
      success: false,
      message: (error as { message: string }).message || defaultMessage,
    };
  }

  return {
    success: false,
    message: defaultMessage,
  };
};
export async function loginAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Validate form data
    const result = loginSchema.safeParse({
      email: formData.get('email'),
      password: formData.get('password'),
    });

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
        message: 'Validation failed. Please check your input and try again.',
        inputs: result.data,
      };
    }

    const response = await fetch(constructApiUrl('/api/users/login'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: result.data.email,
        password: result.data.password,
      }),
      credentials: 'include',
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Invalid email or password',
        inputs: result.data,
      };
    }

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error) {
    return handleApiError(error, 'An error occurred during login. Please try again.');
  }

  revalidatePath('/');
  redirect('/');
}

export async function signupAction(
  _: ActionResponse | null,
  formData: FormData
): Promise<ActionResponse> {
  try {
    // Get form data
    const formDataObj = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    const result = signupSchema.safeParse(formDataObj);

    if (!result.success) {
      return {
        success: false,
        errors: result.error.flatten().fieldErrors,
        message: 'Validation failed. Please check your input and try again.',
        inputs: formDataObj,
      };
    }

    const response = await fetch(constructApiUrl('/api/users'), {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: result.data.email,
        password: result.data.password,
      }),
      // credentials: 'include',
      cache: 'no-store',
    });

    const data = await response.json();

    console.log('Signup response:', data);
    console.log('Signup response:', response);

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to create account. Please try again.',
        inputs: result.data,
      };
    }

    return {
      success: true,
      message: 'Account created successfully!',
    };
  } catch (error) {
    return handleApiError(error, 'An error occurred during signup. Please try again.');
  }

  revalidatePath('/');
  redirect('/');
}

/**
 * Logout action
 */
// export async function logoutAction(): Promise<ActionResponse> {
//   try {
//     // Call Payload CMS logout endpoint
//     const response = await fetch(constructApiUrl('/api/users/logout'), {
//       method: 'POST',
//       credentials: 'include',
//       cache: 'no-store',
//     });
//
//     if (!response.ok) {
//       throw new Error('Failed to logout');
//     }
//
//     return {
//       success: true,
//       message: 'Logout successful',
//     };
//   } catch (error) {
//     return handleApiError(error, 'An error occurred during logout. Please try again.');
//   }
// }

/**
 * Get current user session
 */
// export async function getCurrentUser() {
//   try {
//     const response = await fetch(constructApiUrl('/api/users/me'), {
//       method: 'GET',
//       credentials: 'include',
//       cache: 'no-store',
//       headers: {
//         'Content-Type': 'application/json',
//       },
//     });
//
//     if (!response.ok) {
//       return null;
//     }
//
//     const data = await response.json();
//     return data.user || null;
//   } catch (error) {
//     console.error('Error fetching current user:', error);
//     return null;
//   }
// }
