'use client';

import Image from 'next/image';
import { WeeklyCalendar } from '@/components/weekly-calendar';
import { StreakCard } from './components/streak-card';
import TabContent from '@/components/ui/pages/TabContentByPeriod';
import { Settings } from '@/app/(frontend)/settings/_components/settings';

export default function Home() {
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <div className="flex items-center justify-between mb-4">
        <Image
          className="aspect-auto"
          src="/logo.jpeg"
          alt="workITout logo"
          width={100}
          height={100}
        />
        <Settings />
      </div>
      <WeeklyCalendar />
      <StreakCard className="mb-6" />
      <TabContent />
    </div>
  );
}
