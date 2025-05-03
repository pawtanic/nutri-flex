'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Copy } from 'lucide-react';
import { DateHeader } from '@/components/date-header';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDate } from '@/app/(frontend)/context/date-context';
import { linkAkaBtnStyles } from '@/app/(frontend)/utils/constants';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { WorkoutTemplates } from '@/app/(frontend)/workouts/_components/workout-templates';
import { useTabWithUrl } from '@/hooks/use-tab-with-url';

export default function WorkoutsPageClient({
  initialWorkouts = [],
  initialTemplates = [],
  initialTab = 'workout',
}) {
  const { selectedDate } = useDate();
  const [workouts, setWorkouts] = useState(initialWorkouts);
  const { tab, setTab } = useTabWithUrl({ defaultTab: initialTab });
  const [currentWorkout, setCurrentWorkout] = useState(() => {
    if (workouts.length > 0) {
      const [workout] = workouts.filter(
        workout => new Date(workout.date).toDateString() === new Date(selectedDate).toDateString()
      );
      // to do extract obj to var
      return workout || { name: '', exercises: [] };
    } else {
      return { name: '', exercises: [] };
    }
  });

  const hasWorkouts = workouts.length > 0;

  const handleUseTemplate = template => {
    setCurrentWorkout({
      name: template.name,
      exercises: [...template.exercises],
    });
  };

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Workouts" />
      <Tabs value={tab} onValueChange={setTab} defaultValue={initialTab} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="mt-4">
          <div className="flex justify-end mb-4">
            <Link className={linkAkaBtnStyles} href={RoutesConfig.addWorkout}>
              <Plus className="h-4 w-4 mr-1" />
              New Workout
            </Link>
          </div>

          {hasWorkouts ? (
            workouts.map(workout => (
              <Card key={workout.id} className="mb-4">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    {/*<CardTitle className="text-lg">{workout.name}</CardTitle>*/}
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  {/*<ul className="space-y-2">*/}
                  {/*  {workout.exercises.map((exercise, index) => (*/}
                  {/*    <li key={index} className="text-sm">*/}
                  {/*      <div className="flex justify-between">*/}
                  {/*        <span>{exercise.name}</span>*/}
                  {/*        <span className="text-muted-foreground">*/}
                  {/*          {exercise.sets} × {exercise.reps}*/}
                  {/*        </span>*/}
                  {/*      </div>*/}
                  {/*    </li>*/}
                  {/*  ))}*/}
                  {/*</ul>*/}
                </CardContent>
              </Card>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground mb-4">No workouts for this date</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="templates" className="mt-4">
          <WorkoutTemplates
            initialTemplates={initialTemplates}
            onUseTemplate={handleUseTemplate}
            currentWorkout={currentWorkout}
          />

          {currentWorkout.exercises?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{currentWorkout.name || 'New Workout'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentWorkout.exercises.map((exercise, index) => (
                      <li key={index} className="text-sm">
                        <div className="flex justify-between">
                          <span>{exercise.name}</span>
                          <span className="text-muted-foreground">
                            {exercise.sets} × {exercise.reps}
                          </span>
                        </div>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-4">
                    <Link href={RoutesConfig.addWorkout}>
                      <Button className="w-full">
                        <Plus className="h-4 w-4 mr-1" />
                        Create Workout from Template
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
