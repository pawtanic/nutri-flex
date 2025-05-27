import { signIn, signOut, getSession } from 'next-auth/react';
import { Session } from 'next-auth';

export type LoginInput = {
  provider: string; // e.g., 'credentials', 'google'
  options?: {
    email: string;
    password: string;
  };
};

class AuthClientService {
  async login({ provider = 'google', options = undefined }: LoginInput): Promise<Session | null> {
    const res = await signIn(provider, {
      redirect: true,
      ...options,
    });

    if (!res || res.error) throw new Error(res?.error || 'Login failed');
    return await getSession();
  }

  async logout() {
    await signOut({ redirect: true });
  }

  async isAuthenticated(): Promise<boolean> {
    const session = await getSession();
    return !!session?.user;
  }

  async getCurrentUser() {
    const session = await getSession();
    return session?.user ?? null;
  }
}

const authClientService = new AuthClientService();
export default authClientService;
