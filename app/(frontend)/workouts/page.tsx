'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Copy } from 'lucide-react';
import { DateHeader } from '@/components/date-header';
import { format } from 'date-fns';
import { WorkoutTemplates } from '@/components/workout-templates';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useDate } from '@/app/(frontend)/context/date-context';

export default function WorkoutsPage() {
  const { selectedDate } = useDate();
  const [currentWorkout, setCurrentWorkout] = useState({
    name: '',
    exercises: [],
  });

  // Sample workout data - in a real app, you'd filter this based on the selected date
  const workouts = [
    {
      id: 1,
      date: format(selectedDate, 'yyyy-MM-dd'),
      name: 'Upper Body',
      exercises: [
        { name: 'Bench Press', sets: 3, reps: 10 },
        { name: 'Pull-ups', sets: 3, reps: 8 },
        { name: 'Shoulder Press', sets: 3, reps: 12 },
      ],
    },
  ];

  // Check if there are workouts for the selected date
  const hasWorkouts = workouts.length > 0;

  // Set current workout based on existing workout for the day
  useEffect(() => {
    if (hasWorkouts) {
      setCurrentWorkout(workouts[0]);
    } else {
      setCurrentWorkout({
        name: '',
        exercises: [],
      });
    }
  }, [selectedDate, hasWorkouts]);

  // Handle using a template
  const handleUseTemplate = (template: any) => {
    setCurrentWorkout({
      name: template.name,
      exercises: [...template.exercises],
    });
  };

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <DateHeader title="Workouts" />

      <Tabs defaultValue={hasWorkouts ? 'workout' : 'templates'} className="mb-6">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="workout">Workout</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
        </TabsList>

        <TabsContent value="workout" className="mt-4">
          <div className="flex justify-end mb-4">
            <Link href="/workouts/add">
              <Button size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New Workout
              </Button>
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
              <Link href="/workouts/add">
                <Button>
                  <Plus className="h-4 w-4 mr-1" />
                  Add Workout
                </Button>
              </Link>
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
                    <Link href="/workouts/add">
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
