'use client';

import Image from 'next/image';
import { WeeklyCalendar } from '@/components/weekly-calendar';
import { StreakCard } from './components/streak-card';
import TabContent from '@/components/ui/pages/TabContentByPeriod';
import { Settings } from '@/app/(frontend)/settings/_components/settings';
import { LogInIcon } from 'lucide-react';
import { useAuth } from '@/app/(frontend)/context/auth';
import { Button } from '@/components/ui/button';
import { GuestWelcome } from '@/components/common/guest-welcome/guest-welcome';
import { InspirationalQuote } from '@/components/common/inspirational-quote/inspirational-quote';

export default function Home() {
  const { isUserAuthenticated } = useAuth();

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <Header />
      <WeeklyCalendar />
      {!isUserAuthenticated && (
        <>
          <GuestWelcome />
          <InspirationalQuote />
        </>
      )}
      {isUserAuthenticated && (
        <>
          <StreakCard className="mb-6" />
          <TabContent />
        </>
      )}
    </div>
  );
}

function Header() {
  const { isUserAuthenticated, showAuthModal } = useAuth();

  return (
    <div className="flex items-center justify-between mb-4">
      <Image
        className="aspect-auto"
        src="/logo.jpeg"
        alt="workITout logo"
        width={100}
        height={100}
      />
      {!isUserAuthenticated && (
        <Button onClick={showAuthModal}>
          Log In
          <LogInIcon className="h-4 w-4 ml-2" />
        </Button>
      )}
      <Settings />
    </div>
  );
}
