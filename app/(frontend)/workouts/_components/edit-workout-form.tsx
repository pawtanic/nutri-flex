'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Save } from 'lucide-react';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { useFocusError } from '@/hooks/use-focus-error';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import type { Workout } from '@/payload-types';
import { EditExerciseAccordion } from './edit-exercise-accordion';
import { useEditWorkoutForm } from '../hooks/use-edit-workout-form';

export function EditWorkoutForm({ workout }: { workout: Workout }) {
  const {
    state,
    isPending,
    workoutName,
    exercises,
    expandedSections,
    workoutNameError,
    hasExercises,
    handleAction,
    handleAccordionChange,
    addExercise,
    removeExercise,
    updateExercise,
    updateSet,
    setWorkoutName,
  } = useEditWorkoutForm(workout);
  
  useFocusError(state.errors);

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
            onClick={addExercise}
            aria-label="Add a new exercise"
          >
            <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
            Add Exercise
          </Button>
        </div>

        {hasExercises && (
          <EditExerciseAccordion
            expandedSections={expandedSections}
            onAccordionChange={handleAccordionChange}
            exercises={exercises}
            state={state}
            onRemoveExercise={removeExercise}
            onUpdateExercise={updateExercise}
            onUpdateSet={updateSet}
          />
        )}
        
        {!state.success && state.message && <WarningAlert description={state.message} />}
      </div>
      
      <AuthRequiredButton 
        className="w-full" 
        loadingText="Updating workout..." 
        isBusy={isPending}
        aria-label="Save workout changes"
      >
        <Save className="h-4 w-4 mr-2" aria-hidden="true" />
        Save Changes
      </AuthRequiredButton>
    </form>
  );
}
