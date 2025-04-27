'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Copy } from 'lucide-react';
import { DateHeader } from '@/components/date-header';
import { WorkoutTemplates } from '@/components/workout/workout-templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDate } from '@/app/(frontend)/context/date-context';
import { linkAkaBtnStyles } from '@/app/(frontend)/utils/constants';
import { RoutesConfig } from '@/components/navigation';
import { useRouter, useSearchParams } from 'next/navigation';

const workouts1 = [
  {
    id: 1,
    date: new Date(),
    name: 'Upper Body1',
    exercises: [
      { name: 'Bench Press', sets: 3, reps: 10 },
      { name: 'Pull-ups', sets: 3, reps: 8 },
      { name: 'Shoulder Press', sets: 3, reps: 12 },
    ],
  },
];

const fetchWorkouts = (): Promise<typeof workouts1> => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(workouts1);
    }, 1000);
  });
};

export default function WorkoutsPage() {
  const { selectedDate } = useDate();
  // temp
  const [workouts, setWorkouts] = useState<
    {
      id: number;
      date: Date;
      name: string;
      exercises: { name: string; sets: number; reps: number }[];
    }[]
  >([]);

  useEffect(() => {
    const fetchData = async () => {
      const data = await fetchWorkouts();
      setWorkouts(data);
    };

    fetchData();
  }, []);

  const hasWorkouts = workouts.length > 0;

  const [currentWorkout, setCurrentWorkout] = useState(() => {
    if (hasWorkouts) {
      const [workout] = workouts.filter(workout => workout.date === selectedDate);
      return workout;
    } else {
      return {
        // add unique ID when adding new exercise
        // add date when adding an exercise
        name: '',
        exercises: [],
      };
    }
  });

  const handleUseTemplate = (template: any) => {
    setCurrentWorkout({
      name: template.name,
      exercises: [...template.exercises],
    });
  };

  const router = useRouter();
  const searchParams = useSearchParams();
  const tab = searchParams.get('tab') ?? (hasWorkouts ? 'workout' : 'templates');

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Workouts" />
      <Tabs
        value={tab}
        onValueChange={tab => router.push(`?tab=${tab}`)}
        defaultValue={hasWorkouts ? 'workout' : 'templates'}
        className="mb-6"
      >
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
                    <CardTitle className="text-lg">{workout.name}</CardTitle>
                    <Button variant="ghost" size="icon">
                      <Copy className="h-4 w-4" />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {workout.exercises.map((exercise, index) => (
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
          <WorkoutTemplates onUseTemplate={handleUseTemplate} currentWorkout={currentWorkout} />

          {currentWorkout.exercises.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-2">Preview</h3>
              <Card>
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{currentWorkout.name || 'New Workout'}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentWorkout.exercises.map((exercise: any, index: number) => (
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
