'use client';

import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { WorkoutSummary } from '@/components/workout-summary';
import { NutritionSummary } from '@/components/nutrition-summary';
import { ProgressChart } from '@/components/progress-chart';
import { StreakCard } from '@/components/streak-card';
import { GoalProgress } from '@/components/goal-progress';
import Link from 'next/link';
import { WeeklyCalendar } from '@/components/weekly-calendar';
import Image from 'next/image';
import { capitalize } from '@/app/(frontend)/utils/helpers';

const tabsValues = {
  overview: 'overview',
  workouts: 'workouts',
  nutrition: 'nutrition',
} as const;

export default function Home() {
  const [selectedTab, setSelectedTab] = useState<string>(tabsValues.overview);
  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <Image
        className="aspect-auto mb-4"
        src="/logo.jpeg"
        alt="workITout logo"
        width={100}
        height={100}
      />
      <WeeklyCalendar />
      <StreakCard className="mb-6" />
      <Tabs onValueChange={setSelectedTab} defaultValue="overview" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value={tabsValues.overview}>{capitalize(tabsValues.overview)}</TabsTrigger>
          <TabsTrigger value={tabsValues.workouts}>{capitalize(tabsValues.workouts)}</TabsTrigger>
          <TabsTrigger value={tabsValues.nutrition}>{capitalize(tabsValues.nutrition)}</TabsTrigger>
        </TabsList>
        {selectedTab !== tabsValues.overview ? (
          <TabContentByPeriod />
        ) : (
          <TabsContent value={tabsValues.overview} className="space-y-4 mt-4">
            <GoalProgress />
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

const periodValue = {
  week: 'week',
  month: 'month',
  '3months': '3months',
  year: 'year',
} as const;

function TabContentByPeriod() {
  const [selectedPeriod, setSelectedPeriod] = useState<string>(periodValue.week);
  return (
    <>
      <div className="my-6">
        <Label htmlFor="period" className="mb-1 block text-md">
          View Progress
        </Label>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger id="period">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          {/*// todo object here*/}
          <SelectContent>
            <SelectItem value={periodValue.week}>This Week</SelectItem>
            <SelectItem value={periodValue.month}>This Month</SelectItem>
            <SelectItem value={periodValue['3months']}>Last 3 Months</SelectItem>
            <SelectItem value={periodValue.year}>This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <TabsContent value={tabsValues.workouts} className="space-y-4 mt-4">
        <WorkoutSummary period={selectedPeriod} />
        <ProgressChart title="Workout Frequency" period={selectedPeriod} type="workout" />
        <div className="flex justify-end">
          <Link href="/workouts">
            <Button variant="outline" size="sm" className="mt-2">
              View All Workouts <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </TabsContent>
      <TabsContent value={tabsValues.nutrition} className="space-y-4 mt-4">
        <NutritionSummary period={selectedPeriod} />
        <ProgressChart title="Calorie Intake" period={selectedPeriod} type={tabsValues.nutrition} />
        <div className="flex justify-end">
          <Link href="/nutrition">
            <Button variant="outline" size="sm" className="mt-2">
              View All Meals <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </TabsContent>
    </>
  );
}
