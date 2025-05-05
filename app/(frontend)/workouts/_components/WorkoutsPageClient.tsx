'use client';

import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus } from 'lucide-react';
import { DateHeader } from '@/components/date-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDate } from '@/app/(frontend)/context/date-context';
import { linkAkaBtnStyles } from '@/app/(frontend)/utils/constants';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { useTabWithUrl } from '@/hooks/use-tab-with-url';
import { Exercise } from '@/app/(frontend)/workouts/_components/workout-form';

export interface Workout {
  id?: string;
  name: string;
  exercises: Exercise[];
  date: string;
  createdBy: string;
}

interface WorkoutsPageClientProps {
  initialWorkouts: Workout[];
  initialTab: string;
}

function normalizeDate(date: Date | string) {
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toISOString().slice(0, 10);
}

export default function WorkoutsPageClient({
  initialWorkouts = [],
  initialTab = 'workout',
}: WorkoutsPageClientProps) {
  const searchParams = useSearchParams();
  const { selectedDate } = useDate();

  const urlTab = searchParams.get('tab') || initialTab;

  // ideally done on server
  const filteredWorkouts = initialWorkouts.filter(
    workout => normalizeDate(workout.date) === normalizeDate(selectedDate)
  );

  const { tab, setTab } = useTabWithUrl({ defaultTab: urlTab });
  const hasWorkouts = filteredWorkouts.length > 0;

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Workouts" />
      <Tabs value={tab} onValueChange={setTab} defaultValue={initialTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">Workout</TabsTrigger>
          {/*<TabsTrigger value="templates">Templates</TabsTrigger>*/}
        </TabsList>

        <p>You can find all your workouts here.</p>

        <TabsContent value="workout" className="mt-4">
          <div className="flex justify-end mb-4">
            <Link className={linkAkaBtnStyles} href={RoutesConfig.addWorkout}>
              <Plus className="h-4 w-4 mr-1" />
              New Workout
            </Link>
          </div>

          {hasWorkouts ? (
            filteredWorkouts.map(workout => (
              <Card key={workout.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    {/*<Button onClick={() => console.log('copy')} variant="ghost" size="icon">*/}
                    {/*  <Copy*/}
                    {/*    aria-label={`Copy workout ${workout.name} to clipboard`}*/}
                    {/*    className="h-4 w-4"*/}
                    {/*  />*/}
                    {/*</Button>*/}
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
                      <li key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{exercise.exerciseName}</span>
                          <span className="text-muted-foreground">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">
                We could not find any workouts for this date
              </p>
            </div>
          )}
        </TabsContent>

        {/*<TabsContent value="templates" className="mt-4">*/}
        {/*  <WorkoutTemplates*/}
        {/*    initialTemplates={initialTemplates}*/}
        {/*    onUseTemplateAction={handleUseTemplate}*/}
        {/*    currentWorkout={currentWorkout}*/}
        {/*  />*/}
        {/*</TabsContent>*/}
      </Tabs>
    </div>
  );
}
