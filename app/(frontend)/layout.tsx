import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
// import { ThemeProvider } from "@/components/theme-provider"
import Navigation from '@/components/navigation';
import { DateProvider } from '@/app/(frontend)/context/date-context';
import { Toaster } from 'sonner';

const inter = Nunito({ weight: '400', subsets: ['latin'], display: 'swap' });

export const metadata: Metadata = {
  title: 'workITout - Workout & Nutrition Tracker',
  description: 'Track your workouts and nutrition with ease',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        {/*<ThemeProvider attribute="class" defaultTheme="light">*/}
        <DateProvider>
          <div className="flex flex-col min-h-screen">
            <Suspense fallback={<div>Loading...</div>}>
              <main className="flex-1">{children}</main>
            </Suspense>
            <Navigation />
          </div>
          <Toaster />
        </DateProvider>
        {/*</ThemeProvider>*/}
      </body>
    </html>
  );
}
