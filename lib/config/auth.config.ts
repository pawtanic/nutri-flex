import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/lib/config/env.config';
import type { NextAuthOptions } from 'next-auth';

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID!,
      clientSecret: env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,

  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      console.log('[signIn callback]', { user, account, profile, email });
      return true;
    },
    async session({ session, token, user }) {
      return session;
    },
  },

  events: {
    async signIn({ user, account, profile }) {
      console.log('[signIn event]', { user });
    },
    async createUser(user) {
      console.log('[createUser event]', { user });
    },
  },
};
