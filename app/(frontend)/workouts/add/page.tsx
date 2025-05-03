'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { DateHeader } from '@/components/date-header';
import { useTabWithUrl } from '@/hooks/use-tab-with-url';
import { ExerciseSelector } from '@/app/(frontend)/workouts/_components/exercise-selector';
import { Wrapper } from '@/components/layout/Wrapper';
import { WorkoutForm } from '@/app/(frontend)/workouts/_components/workout-form';
import { Exercise } from '@/app/(frontend)/api/public-api';

export default function AddWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const { tab, setTab } = useTabWithUrl({ defaultTab: 'manual' });

  return (
    <Wrapper>
      <div className="flex items-center">
        <Link href={RoutesConfig.workout}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Workout</h1>
      </div>
      <DateHeader title="" />
      <Tabs value={tab} onValueChange={setTab} defaultValue="manual" className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="manual">Manual</TabsTrigger>
          <TabsTrigger value="api">Exercise Library</TabsTrigger>
        </TabsList>
        <TabsContent value="manual" className="space-y-6 mt-4">
          <WorkoutForm exercises={exercises} setExercises={setExercises} />
        </TabsContent>
        <TabsContent value="api" className="mt-4">
          <ExerciseSelector />
        </TabsContent>
      </Tabs>
    </Wrapper>
  );
}
