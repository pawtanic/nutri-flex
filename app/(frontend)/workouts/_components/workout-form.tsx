import { Wrapper } from '@/components/layout/Wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { WorkoutFormProps } from './workout-form-types';
import { NoExerciseMessage } from './no-exercise-message';
import { ExerciseAccordion } from './exercise-accordion';
import { useWorkoutForm } from '@/app/(frontend)/workouts/hooks/use-workout-form';

export function WorkoutForm({ exercises, setExercises }: WorkoutFormProps) {
  const {
    state,
    isPending,
    expandedSections,
    workoutNameError,
    hasExercises,
    handleAction,
    handleAccordionChange,
    addExercise,
    removeExercise,
    updateExercise,
    updateSet,
    addSet,
    removeSet,
  } = useWorkoutForm(exercises, setExercises);

  return (
    <Wrapper>
      <form action={handleAction} className="space-y-6">
        <div>
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            name="workoutName"
            placeholder="e.g., Upper Body, Leg Day"
            className="mt-1"
            defaultValue={state?.inputs?.workoutName}
            aria-invalid={!!workoutNameError}
            aria-describedby={workoutNameError ? 'workout-name-error' : undefined}
          />
          {workoutNameError && <FormErrorMessage errorMessage={workoutNameError} />}
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            {hasExercises ? <Label>Exercises</Label> : <div />}
            <Button type="button" size="sm" onClick={addExercise} aria-label="Add a new exercise">
              <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
              Add Exercise
            </Button>
          </div>
          {!hasExercises && <NoExerciseMessage />}
          {hasExercises && (
            <ExerciseAccordion
              expandedSections={expandedSections}
              onAccordionChange={handleAccordionChange}
              exercises={exercises}
              state={state}
              onRemoveExercise={removeExercise}
              onUpdateExercise={updateExercise}
              onUpdateSet={updateSet}
              onAddSet={addSet}
              onRemoveSet={removeSet}
            />
          )}
        </div>
        {hasExercises && (
          <AuthRequiredButton
            loadingText="Saving workout..."
            className="w-full"
            isBusy={isPending}
            aria-label="Save workout"
          >
            Save Workout
          </AuthRequiredButton>
        )}
      </form>
    </Wrapper>
  );
}
