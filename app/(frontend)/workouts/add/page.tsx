'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import Link from 'next/link';
import { DateHeader } from '@/components/date-header';
import { RoutesConfig } from '@/components/navigation';

export default function AddWorkoutPage() {
  const [exercises, setExercises] = useState([{ name: '', sets: '', reps: '' }]);

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
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <div className="flex items-center mb-2">
        <Link href={RoutesConfig.workout}>
          <Button variant="ghost" size="icon" className="mr-2">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-2xl font-bold">Add Workout</h1>
      </div>

      <DateHeader title="" />

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

        <Button className="w-full">Save Workout</Button>
      </div>
    </div>
  );
}
