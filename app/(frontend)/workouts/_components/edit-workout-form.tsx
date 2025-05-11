'use client';

import React, { useActionState, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save, Trash2 } from 'lucide-react';
import { useRouter } from 'next/navigation';
import type { Exercises, Set } from '@/app/(frontend)/workouts/_components/workout-form';
import { updateWorkout } from '@/app/(frontend)/workouts/_actions/edit-exercise-action';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { useFocusError } from '@/hooks/use-focus-error';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import type { Workout } from '@/payload-types';
import { deleteExerciseAction } from '@/app/(frontend)/workouts/_actions/delete-exercise-action';
import { showErrorToast, showSuccessToast } from '@/app/(frontend)/utils/helpers';

const initialState = {
  errors: [],
  message: '',
  success: false,
};

export function EditWorkoutForm({ workout }: { workout: Workout }) {
  const [state, action, isPending] = useActionState(updateWorkout, initialState);
  useFocusError(state.errors);
  const [workoutName, setWorkoutName] = useState(workout.name);

  const [exercises, setExercises] = useState<Exercises>(
    () =>
      workout.exercises?.map(exercise => ({
        id: exercise.id,
        exerciseName: exercise.exerciseName,
        sets: exercise.sets.map(set => ({
          reps: set.reps,
          weight: set.weight,
        })),
      })) || []
  );
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const router = useRouter();

  const removeExercise = async (index: number) => {
    const exerciseToRemove = exercises[index];

    // Only call the server action if the exercise has an ID (exists in the database)
    if (exerciseToRemove.id) {
      console.log(
        `Attempting to delete exercise: ${exerciseToRemove.exerciseName || 'Unnamed exercise'} with ID: ${exerciseToRemove.id}`
      );

      try {
        const result = await deleteExerciseAction(workout.id as string, exerciseToRemove.id);
        console.log(result);
        if (!result.success) {
          showErrorToast({
            title: 'Error',
            description: 'Failed to delete exercise',
          });
          console.error('Delete exercise failed:', result.message);
          return;
        }

        // Update the local state if the server action was successful
        const newExercises = [...exercises];
        newExercises.splice(index, 1);
        setExercises(newExercises);

        showSuccessToast({
          title: 'Success',
          description: 'Exercise deleted successfully',
        });
      } catch (error) {
        console.error('Error in removeExercise:', error);
        showErrorToast({
          title: 'Error',
          description: 'Failed to delete exercise',
        });
      }
    } else {
      // For exercises that don't have an ID (not saved to the database yet)
      console.log('Removing unsaved exercise from local state only');
      const newExercises = [...exercises];
      newExercises.splice(index, 1);
      setExercises(newExercises);
    }
  };

  const updateExercise = (index: number, field: string, value: string | Set[]) => {
    const newExercises = [...exercises];

    if (field === 'sets') {
      // When updating the entire sets array
      newExercises[index] = { ...newExercises[index], sets: value as Set[] };
    } else {
      // For other fields like exerciseName
      newExercises[index] = { ...newExercises[index], [field]: value };
    }

    setExercises(newExercises);
  };

  const updateSet = (exerciseIndex: number, setIndex: number, field: string, value: string) => {
    const newExercises = [...exercises];
    const newSets = [...newExercises[exerciseIndex].sets];

    newSets[setIndex] = {
      ...newSets[setIndex],
      [field]: field === 'reps' || field === 'weight' ? Number(value) : value,
    };

    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      sets: newSets,
    };

    setExercises(newExercises);
  };

  // const addSet = (exerciseIndex: number) => {
  //   const newExercises = [...exercises];
  //   const newSets = [...newExercises[exerciseIndex].sets, { reps: 1, weight: 0 }];
  //
  //   newExercises[exerciseIndex] = {
  //     ...newExercises[exerciseIndex],
  //     sets: newSets,
  //   };
  //
  //   setExercises(newExercises);
  // };

  const handleAccordionChange = (newExpandedSections: string[]) => {
    setExpandedSections(newExpandedSections);
  };

  const handleAction = async (formData: FormData) => {
    formData.append('workoutId', workout.id as string);
    formData.append('workoutName', workoutName);
    formData.append('exercises', JSON.stringify(exercises));
    return action(formData);
  };

  const workoutNameError = state.errors?.[0]?.workoutName?.[0];
  const hasExercises = exercises.length > 0;

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
          defaultValue={state?.inputs?.workoutName}
          aria-invalid={!!workoutNameError}
        />
        {workoutNameError && <FormErrorMessage errorMessage={workoutNameError} />}
      </div>

      <div>
        <div className="flex justify-between items-center mb-2">
          {hasExercises ? <Label>Exercises</Label> : <div />}
          <Button
            type="button"
            size="sm"
            onClick={() => {
              const newExercises = [
                ...exercises,
                {
                  exerciseName: `Exercise ${exercises.length + 1}`,
                  sets: [{ reps: 1, weight: 1 }],
                },
              ];
              setExercises(newExercises);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Exercise
          </Button>
        </div>

        <Accordion
          type="multiple"
          value={expandedSections}
          onValueChange={handleAccordionChange}
          className="space-y-3 bg-white mb-2"
        >
          {exercises.map((exercise, index) => {
            const exerciseName = exercise.exerciseName || `Exercise ${index + 1}`;
            const isExpanded = expandedSections.includes(`exercise-${index}`);
            const exerciseErrors = state.errors?.[index] || null;
            return (
              <AccordionItem
                key={index}
                value={`exercise-${index}`}
                className="border rounded-md overflow-hidden"
              >
                <AccordionTrigger
                  className={`px-4 py-3 hover:no-underline ${isExpanded ? 'before:content-[""] before:flex-1' : ''}`}
                >
                  {!isExpanded && exerciseName}
                </AccordionTrigger>
                <AccordionContent>
                  <div className="px-4 pt-2 pb-4">
                    <div className="grid grid-cols-[1fr,auto] gap-2">
                      <Input
                        placeholder="Exercise name"
                        name="exerciseName"
                        value={exerciseName}
                        onChange={e => updateExercise(index, 'exerciseName', e.target.value)}
                        defaultValue={state?.inputs?.exercises?.[index]?.exerciseName}
                        aria-invalid={!!exerciseErrors?.exerciseName}
                      />
                      <Button type="button" variant="ghost" onClick={() => removeExercise(index)}>
                        <Trash2
                          style={{ width: '24px', height: '24px' }}
                          aria-label="Remove exercise from workout"
                        />
                      </Button>
                      {exerciseErrors?.exerciseName && (
                        <FormErrorMessage
                          errorMessage={exerciseErrors.exerciseName[0] || state.message}
                        />
                      )}

                      <div className="col-span-2 mt-4">
                        {exercise.sets.map((set, setIndex) => {
                          // Get errors for this specific set
                          const setErrors = exerciseErrors?.sets?.[setIndex] || {};

                          return (
                            <div
                              key={setIndex}
                              className="grid grid-cols-[1fr,1fr,auto] gap-3 mb-3 p-3 bg-gray-50 rounded-md"
                            >
                              <div>
                                <Label htmlFor={`reps-${index}-${setIndex}`} className="text-xs">
                                  Reps
                                </Label>
                                <Input
                                  id={`reps-${index}-${setIndex}`}
                                  name={`reps-${index}-${setIndex}`}
                                  type="number"
                                  placeholder="Reps"
                                  onChange={e => updateSet(index, setIndex, 'reps', e.target.value)}
                                  aria-invalid={!!setErrors.reps}
                                  defaultValue={
                                    state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.reps
                                  }
                                />
                                {setErrors.reps && (
                                  <FormErrorMessage errorMessage={setErrors.reps} />
                                )}
                              </div>

                              <div>
                                <Label htmlFor={`weight-${index}-${setIndex}`} className="text-xs">
                                  Weight (kg)
                                </Label>
                                <Input
                                  id={`weight-${index}-${setIndex}`}
                                  name={`weight-${index}-${setIndex}`}
                                  type="number"
                                  placeholder="Weight"
                                  onChange={e =>
                                    updateSet(index, setIndex, 'weight', e.target.value)
                                  }
                                  aria-invalid={!!setErrors.weight}
                                  defaultValue={
                                    state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.weight
                                  }
                                />
                                {setErrors.weight && (
                                  <FormErrorMessage errorMessage={setErrors.weight} />
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            );
          })}
        </Accordion>
        {!state.success && state.message && <WarningAlert description={state.message} />}
      </div>
      <div className="flex gap-3">
        <Button type="button" variant="outline" className="flex-1" onClick={() => router.back()}>
          Cancel
        </Button>
        <AuthRequiredButton loadingText="Updating workout..." isBusy={isPending}>
          <Save className="h-4 w-4 mr-2" />
          Save Changes
        </AuthRequiredButton>
      </div>
    </form>
  );
}
