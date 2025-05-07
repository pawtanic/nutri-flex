'use client';

import Image from "next/image";
import AuthComponent from "@/components/common/auth-button/AuthComponent";
import { WeeklyCalendar } from "@/components/weekly-calendar";
import { StreakCard } from "./components/streak-card";
import TabContent from "@/components/ui/pages/TabContentByPeriod";

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
        <AuthComponent />
      </div>
      <WeeklyCalendar />
      <StreakCard className="mb-6" />
      <TabContent />
    </div>
  );
}
