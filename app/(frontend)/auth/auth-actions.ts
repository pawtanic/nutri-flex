// auth-actions.ts
'use server';

import { cookies } from 'next/headers';
import { loginSchema, signupSchema } from '@/app/(frontend)/auth/auth-schema';

export async function loginAction(formData: FormData) {
  // Validate form data
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Authenticate with Payload CMS
    const response = await fetch(`${process.env.PAYLOAD_API_URL}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: result.data.email,
        password: result.data.password,
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Invalid email or password',
      };
    }

    cookies().set('payload-token', data.token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 1 week
    });

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
}

export async function signupAction(formData: FormData) {
  // Validate form data
  const result = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    confirmPassword: formData.get('confirmPassword'),
  });

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
    };
  }

  try {
    // Create user in Payload CMS
    const response = await fetch(`${process.env.PAYLOAD_API_URL}/api/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: result.data.email,
        password: result.data.password,
      }),
      cache: 'no-store',
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Failed to create account',
      };
    }

    // Auto-login after signup
    return await loginAction(formData);
  } catch (error) {
    return {
      success: false,
      message: 'An error occurred during signup',
    };
  }
}

export async function socialLoginAction(provider: string) {
  // Redirect to Payload CMS social login endpoint
  const redirectUrl = `${process.env.PAYLOAD_API_URL}/api/users/login/${provider}`;
  return { success: true, redirectUrl };
}
