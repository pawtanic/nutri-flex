// auth-actions.ts
'use server';

import { loginSchema, signupSchema } from '@/app/(frontend)/auth/auth-schema';

type SignupActionResponse = {
  success: boolean;
  errors?: { email?: string[]; password?: string[]; confirmPassword?: string[] };
  message: string;
};

type LoginActionResponse = {
  success: boolean;
  errors?: { email?: string[]; password?: string[]; confirmPassword?: string[] };
  message: string;
};

export async function loginAction(
  _: LoginActionResponse,
  formData: FormData
): Promise<LoginActionResponse> {
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  console.log('result', result);

  if (!result.success) {
    return {
      success: false,
      errors: result.error.flatten().fieldErrors,
      message: 'Validation failed',
    };
  }

  try {
    // Authenticate with Payload CMS - add api method here
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

    // cookies().set('payload-token', data.token, {
    //   httpOnly: true,
    //   secure: process.env.NODE_ENV === 'production',
    //   sameSite: 'lax',
    //   path: '/',
    //   maxAge: 60 * 60 * 24 * 7, // 1 week
    // });

    return {
      success: true,
      message: 'Login successful',
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during login:', error.message);
      return {
        success: false,
        message: 'An error occurred during login',
      };
    }
    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}

export async function signupAction(
  _: SignupActionResponse,
  formData: FormData
): Promise<SignupActionResponse> {
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
      message: 'Validation failed',
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

    // Auto-login after signup - we need to modify this to work with the new signature
    const loginFormData = new FormData();
    loginFormData.append('email', result.data.email);
    loginFormData.append('password', result.data.password);

    // Create a dummy state for the login action
    const dummyState: LoginActionResponse = {
      success: false,
      message: '',
    };

    return await loginAction(dummyState, loginFormData);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('Error during signup:', error.message);
      return {
        success: false,
        message: 'An error occurred during signup',
      };
    }
    return {
      success: false,
      message: 'An unknown error occurred',
    };
  }
}

// export async function socialLoginAction(provider: string) {
//   // Redirect to Payload CMS social login endpoint
//   const redirectUrl = `${process.env.PAYLOAD_API_URL}/api/users/login/${provider}`;
//   return { success: true, redirectUrl };
// }
