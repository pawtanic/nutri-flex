import './globals.css';
import { Nunito } from 'next/font/google';
import { getServerSession } from 'next-auth';
import { authConfig } from '@/lib/config/auth.config';

import type { Metadata } from 'next';
import { Toaster } from 'sonner';
import { DateProvider } from '@/app/(frontend)/context/date-context';
import { AuthModalProvider } from '@/app/(frontend)/context/auth-modal-context';
import Navigation from '@/components/common/navigation/navigation';
import { Analytics } from '@vercel/analytics/react';
import { ReactQueryProvider, SessionProviderWrapper } from './providers';
import React from 'react';

const inter = Nunito({ subsets: ['latin'], weight: '400', display: 'swap' });

export const metadata: Metadata = {
  title: 'workITout - Workout & Nutrition Tracker',
  description: 'Track your workouts and nutrition with ease',
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authConfig);

  return (
    <html lang="en">
      <body className={inter.className}>
        <SessionProviderWrapper session={session}>
          <ReactQueryProvider>
            <DateProvider>
              <AuthModalProvider>
                <div className="flex flex-col min-h-screen">
                  <main className="flex-1">{children}</main>
                  <Navigation />
                </div>
                <Toaster />
              </AuthModalProvider>
            </DateProvider>
          </ReactQueryProvider>
        </SessionProviderWrapper>
        <Analytics />
      </body>
    </html>
  );
}
