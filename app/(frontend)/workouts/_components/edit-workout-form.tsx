'use client';

import React, { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Workout } from './WorkoutsPageClient';
import { Exercise } from '@/app/(frontend)/workouts/_components/workout-form';
import { updateWorkout } from '@/app/(frontend)/workouts/_actions/edit-exercise-action';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { useFocusError } from '@/hooks/use-focus-error';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import WarningAlert from '@/components/common/warning-alert/warning-alert';

const initialState = {
  errors: [],
  message: '',
  success: false,
};

export function EditWorkoutForm({ workout }: { workout: Workout }) {
  const [state, action, isPending] = useActionState(updateWorkout, initialState);
  useFocusError(state.errors);
  console.log(state, 'state');
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

  const handleAction = async (formData: FormData) => {
    // todo: why id is undefined?
    formData.append('workoutId', workout.id);
    return action(formData);
  };

  //todo: adjust UI same as add woerkout with errors itp
  return (
    <form action={handleAction} className="space-y-6">
      <div>
        <Label htmlFor="workout-name">Workout Name</Label>
        <Input
          id="workout-name"
          name="workoutName"
          placeholder="e.g., Upper Body, Leg Day"
          className="mt-1"
          value={workoutName}
          onChange={e => setWorkoutName(e.target.value)}
        />
      </div>

      <div>
        {exercises.map((exercise, index) => {
          const exerciseErrors = state.errors?.[index] ?? null;
          const [exerciseNameError] = exerciseErrors?.exerciseName || [];
          const [repsError] = exerciseErrors?.reps || [];
          const [setsError] = exerciseErrors?.sets || [];
          const isOnlyExercise = exercises.length === 1;
          return (
            <Card key={exercise.id} className="mb-3">
              <CardContent className="pt-4">
                <div className="grid grid-cols-[1fr,auto] gap-3">
                  <Input
                    name="exerciseName"
                    placeholder="Exercise name"
                    value={exercise.exerciseName}
                    onChange={e => updateExercise(index, 'exerciseName', e.target.value)}
                    aria-invalid={!!exerciseNameError}
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => removeExercise(index)}
                    disabled={isOnlyExercise}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  {exerciseNameError && <FormErrorMessage errorMessage={exerciseNameError} />}
                  <div className="col-span-2 grid grid-cols-2 gap-3 mt-2">
                    <div>
                      <Label htmlFor={`sets-${index}`} className="text-xs">
                        Sets
                      </Label>
                      <Input
                        id={`sets-${index}`}
                        type="number"
                        name="sets"
                        placeholder="Sets"
                        value={exercise.sets}
                        onChange={e => updateExercise(index, 'sets', e.target.value)}
                        aria-invalid={!!setsError}
                      />
                      {setsError && <FormErrorMessage errorMessage={setsError} />}
                    </div>
                    <div>
                      <Label htmlFor={`reps-${index}`} className="text-xs">
                        Reps
                      </Label>
                      <Input
                        id={`reps-${index}`}
                        type="number"
                        name="reps"
                        placeholder="Reps"
                        value={exercise.reps}
                        onChange={e => updateExercise(index, 'reps', e.target.value)}
                        aria-invalid={!!repsError}
                      />
                      {repsError && <FormErrorMessage errorMessage={repsError} />}

                      {/*HACK for now to pass exercises array to Form Data*/}
                      <input type="hidden" name="exercises" value={JSON.stringify(exercises)} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
        {!state.success && state.message && <WarningAlert description={state.message} />}
      </div>

      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
        <AuthRequiredButton
          onAuthenticatedClick={() => null}
          successMessageText="Workout updated successfully!"
          successMessageDescription="You can now view your updated workout in the 'Workouts' page."
          errorMessageText="Failed to update workout. Please try again."
          loadingText="Updating workout..."
          disabled={isPending}
        >
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </AuthRequiredButton>
      </div>
    </form>
  );
}
