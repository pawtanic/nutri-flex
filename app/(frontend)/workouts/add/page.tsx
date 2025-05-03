'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { RoutesConfig } from '@/components/navigation';
import { DateHeader } from '@/components/date-header';
import { Card, CardContent } from '@/components/ui/card';
import { useTabWithUrl } from '@/hooks/use-tab-with-url';
import { ExerciseSelector } from '@/app/(frontend)/workouts/_components/exercise-selector';
import { Wrapper } from '@/components/layout/Wrapper';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';

interface Exercise {
  name: string;
  type: string;
  muscle: string;
  equipment: string;
  difficulty: string;
  instructions: string;
  sets?: string;
  reps?: string;
}

export default function AddWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const { tab, setTab } = useTabWithUrl({ defaultTab: 'manual' });

  // const addExercise = () => {
  //   setExercises([...exercises, { name: '', sets: '', reps: '' }]);
  // };
  //
  // const removeExercise = (index: number) => {
  //   const newExercises = [...exercises];
  //   newExercises.splice(index, 1);
  //   setExercises(newExercises);
  // };
  //
  // const updateExercise = (index: number, field: string, value: string) => {
  //   const newExercises = [...exercises];
  //   newExercises[index] = { ...newExercises[index], [field]: value };
  //   setExercises(newExercises);
  // };

  return (
    // todo: extract outer div to layout because it is present in many place
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

interface WorkoutFormProps {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
}

function WorkoutForm({ exercises, setExercises }: WorkoutFormProps) {
  const addExercise = () => {
    setExercises([...exercises, { name: '', sets: '', reps: '' }]);
  };

  const removeExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  return (
    <Wrapper>
      <div className="space-y-6">
        <div>
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input id="workout-name" placeholder="e.g., Upper Body, Leg Day" className="mt-1" />
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            <Label>Exercises</Label>
            <Button variant="outline" size="sm" onClick={addExercise}>
              <Plus className="h-4 w-4 mr-1" />
              Add Exercise
            </Button>
          </div>
          {exercises.map((exercise, index) => (
            <Card key={index} className="mb-3">
              <CardContent className="pt-4">
                <div className="grid grid-cols-[1fr,auto] gap-3">
                  <Input
                    placeholder="Exercise name"
                    value={exercise.name}
                    onChange={e => updateExercise(index, 'name', e.target.value)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(index)}
                    disabled={exercises.length === 1}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <div className="col-span-2 grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label htmlFor={`sets-${index}`} className="text-xs">
                        Sets
                      </Label>
                      <Input
                        id={`sets-${index}`}
                        type="number"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={e => updateExercise(index, 'sets', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`reps-${index}`} className="text-xs">
                        Reps
                      </Label>
                      <Input
                        id={`reps-${index}`}
                        type="number"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={e => updateExercise(index, 'reps', e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
        <AuthRequiredButton
          loadingText="Saving workout..."
          successMessageText="Workout saved successfully!"
          errorMessageText="Failed to save workout. Please try again."
          className="w-full"
          onAuthenticatedClick={() => console.log('save')}
        >
          Save Workout
        </AuthRequiredButton>
      </div>
    </Wrapper>
  );
}
