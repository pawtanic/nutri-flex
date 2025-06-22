import GoogleProvider from 'next-auth/providers/google';
import { env } from '@/lib/config/env.config';
import type { NextAuthOptions, Session, User as AuthUser } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { JWT } from 'next-auth/jwt';
import { User, UserModel } from '../models/user.model';
import { AdapterUser } from 'next-auth/adapters';
import dbConnect from '@/lib/config/db.config';

// Update typings first:
declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    accessToken?: string;
  }
}

declare module 'next-auth' {
  interface AuthUser {
    id: string;
    accessToken?: string;
  }

  interface Session {
    user: {
      id: string;
      email?: string;
      avatar?: string;
      name?: string;
      accessToken?: string;
    };
  }
}

export const authConfig: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: env.AUTH_GOOGLE_ID!,
      clientSecret: env.AUTH_GOOGLE_SECRET!
    }),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        console.log('[authorize]', credentials);
        const res = await fetch(`${env.APP_URL}/auth/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: credentials?.email, password: credentials?.password })
        });

        const user = await res.json();

        if (!res.ok || !user) {
          throw new Error('Invalid credentials');
        }
        return user;
      }
    })
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account }) {
      console.log('[signIn]', { user, account });

      await dbConnect();

      if (account?.provider === 'google') {
        console.log('Google auth');

        const existing = await UserModel.findOne({ email: user.email });
        console.log(`User with email ${user.email} ${existing ? 'exists' : "doesn't exist"}`);

        if (!existing) {
          await UserModel.create({
            email: user.email,
            password: Math.random().toString(36).slice(-8),
            name: user.name,
            picture: user.image,
          });
        }
      }
      return true;
    },
    async jwt({ token, user }) {
      if (user && 'accessToken' in user) {
        token.id = (user as AuthUser).id;
        // @ts-ignore
        token.accessToken = (user as AuthUser).accessToken;
      }
      return token;
    },
    async session({ session, token }) {
      console.log('[session]', { session, token });

      if (session?.user) {
        session.user.id = token.id;
        session.user.accessToken = token.accessToken;
      }
      return session;
    }
  },
  events: {
    signIn: async ({ user }) => {
      // console.log('[event: signIn]', { user });
    },
    createUser: async ({ user }) => {
      // console.log('[event: createUser]', { user });
    }
  },
  session: {
    strategy: 'jwt'
  }
};

