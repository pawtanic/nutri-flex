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
import { WaterWidget } from '@/components/water-widget';
import { ProgressChart } from '@/components/progress-chart';
import { StreakCard } from '@/components/streak-card';
import { GoalProgress } from '@/components/goal-progress';
import Link from 'next/link';

// Import the WeeklyCalendar component
import { WeeklyCalendar } from '@/components/weekly-calendar';
import Image from 'next/image';

// Replace the existing Home component with this updated version
export default function Home() {
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <Image
        className="aspect-auto mb-4"
        src="/logo.jpeg"
        alt="workITout logo"
        width={100}
        height={100}
      />
      {/*<p className="text-muted-foreground mb-6">Track your fitness journey</p>*/}

      {/* Weekly Calendar - Main Component */}
      <WeeklyCalendar />

      {/* Period Selection */}
      <div className="mb-6">
        <Label htmlFor="period" className="text-sm mb-1 block">
          View Progress
        </Label>
        <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
          <SelectTrigger id="period">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="3months">Last 3 Months</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Streak Card */}
      <StreakCard className="mb-6" />

      {/* Main Tabs */}
      <Tabs defaultValue="overview" className="mb-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="workouts">Workouts</TabsTrigger>
          <TabsTrigger value="nutrition">Nutrition</TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-4 mt-4">
          <GoalProgress period={selectedPeriod} />
          <WaterWidget />
        </TabsContent>

        {/* Workouts Tab */}
        <TabsContent value="workouts" className="space-y-4 mt-4">
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

        {/* Nutrition Tab */}
        <TabsContent value="nutrition" className="space-y-4 mt-4">
          <NutritionSummary period={selectedPeriod} />

          <ProgressChart title="Calorie Intake" period={selectedPeriod} type="nutrition" />

          <div className="flex justify-end">
            <Link href="/nutrition">
              <Button variant="outline" size="sm" className="mt-2">
                View All Meals <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
