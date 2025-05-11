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
import type { Workout } from '@/payload-types';

interface WorkoutsPageClientProps {
  initialWorkouts: Workout[];
  initialTab: string;
}

function normalizeDate(date: Date | string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0'); // Add 1 because months are 0-indexed
  const day = String(dateObj.getDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}

export default function WorkoutsPageClient({
  initialWorkouts = [],
  initialTab = 'workout',
}: WorkoutsPageClientProps) {
  const searchParams = useSearchParams();
  const { selectedDate } = useDate();

  const urlTab = searchParams.get('tab') || initialTab;
  // ideally done on server
  const filteredWorkouts = initialWorkouts.filter(workout => {
    const workoutDate = normalizeDate(workout.date);
    const currentDate = normalizeDate(selectedDate);
    return workoutDate === currentDate;
  });

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
                    {workout?.exercises?.map((exercise, index) => (
                      <li key={exercise.id} className="text-sm">
                        <div className="flex justify-between">
                          <span>{exercise.exerciseName}</span>
                          {/*<span className="text-muted-foreground">*/}
                          {/*  {exercise.sets[index].reps} × {exercise.sets[index].weight}*/}
                          {/*</span>*/}
                          {exercise.sets.map(set => (
                            <span key={set.id} className="text-muted-foreground">
                              {set.reps} × {set.weight}
                            </span>
                          ))}
                        </div>
                      </li>
                    ))}
                  </ul>
                  <Link
                    href={`${RoutesConfig.editWorkout}/${workout.id}`}
                    className={`${linkAkaBtnStyles} w-full mt-6`}
                  >
                    View Details
                  </Link>
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
