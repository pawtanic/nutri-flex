'use client';

import React, { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Workout } from './WorkoutsPageClient';
import { Exercise } from '@/app/(frontend)/workouts/_components/workout-form';
import { updateWorkout } from '@/app/(frontend)/workouts/_actions/edit-exercise-action';

const initialState = {
  errors: [],
  message: '',
  success: false,
};

export function EditWorkoutForm({ workout }: { workout: Workout }) {
  const [_, editWorkoutAction] = useActionState(updateWorkout, initialState);
  // const [state, editWorkoutAction, isPending] = useActionState(updateWorkout, { id: workout.id });
  const [workoutName, setWorkoutName] = useState(workout.name);
  const [exercises, setExercises] = useState<Exercise[]>(workout.exercises);
  const router = useRouter();

  // consider refactoring to hook and reuse
  const removeExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);
  };

  const updateExercise = (index: number, field: keyof Exercise, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  //todo: adjust UI same as add woerkout with errors itp
  return (
    <form action={editWorkoutAction} className="space-y-6">
      <div>
        <Label htmlFor="workout-name">Workout Name</Label>
        <Input
          id="workout-name"
          placeholder="e.g., Upper Body, Leg Day"
          className="mt-1"
          value={workoutName}
          onChange={e => setWorkoutName(e.target.value)}
          required
        />
      </div>

      <div>
        {exercises.map((exercise, index) => (
          <Card key={exercise.id} className="mb-3">
            <CardContent className="pt-4">
              <div className="grid grid-cols-[1fr,auto] gap-3">
                <Input
                  placeholder="Exercise name"
                  value={exercise.exerciseName}
                  onChange={e => updateExercise(index, 'exerciseName', e.target.value)}
                  required
                />
                <Button
                  type="button"
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
                      required
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
                      required
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
        {/*replace with auth button ?*/}
        <Button type="submit" className="flex-1">
          Save Changes
        </Button>
      </div>
    </form>
  );
}
