import { Wrapper } from '@/components/layout/Wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BicepsFlexed, Plus, Trash2 } from 'lucide-react';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { ExerciseSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { useActionState, useState } from 'react';
import { addExercisesAction } from '@/app/(frontend)/workouts/_actions/add-exercises-action';
import WarningAlert from '@/components/common/warning-alert/warning-alert';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { useFocusError } from '@/hooks/use-focus-error';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import * as React from 'react';
import { getExerciseDisplayName } from '@/app/(frontend)/utils/helpers';

export type Exercise = Omit<ExerciseSchema, 'workoutName'> & { id?: string };

interface WorkoutFormProps {
  exercises: Exercise[];
  setExercises: (exercises: Exercise[]) => void;
}

const initialState: ActionResponse = {
  errors: [],
  message: '',
  success: false,
};

export function WorkoutForm({ exercises, setExercises }: WorkoutFormProps) {
  const [state, action, isPending] = useActionState(addExercisesAction, initialState);
  // bug fix needed
  useFocusError(state.errors);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);

  const addExercise = () => {
    const newExercises = [...exercises, { exerciseName: '', sets: 1, reps: 1 }];
    setExercises(newExercises);
    setExpandedSections([`exercise-${newExercises.length - 1}`]);
  };

  const removeExercise = (index: number) => {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);

    if (newExercises.length > 0) {
      setExpandedSections([`exercise-${newExercises.length - 1}`]);
    } else {
      setExpandedSections([]);
    }
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const newExercises = [...exercises];
    newExercises[index] = { ...newExercises[index], [field]: value };
    setExercises(newExercises);
  };

  const handleAccordionChange = (newExpandedSections: string[]) => {
    setExpandedSections(newExpandedSections);
  };

  const [workoutNameError] = state.errors[0]?.workoutName || [];
  const hasExercises = exercises.length > 0;

  return (
    <Wrapper>
      <form action={action} className="space-y-6">
        <div>
          <Label htmlFor="workout-name">Workout Name</Label>
          <Input
            id="workout-name"
            name="workoutName"
            placeholder="e.g., Upper Body, Leg Day"
            className="mt-1"
            aria-invalid={!!workoutNameError}
          />
          {workoutNameError && <FormErrorMessage errorMessage={workoutNameError} />}
        </div>
        <div>
          <div className="flex justify-between items-center mb-2">
            {hasExercises ? <Label>Exercises</Label> : <div />}
            <Button type="button" size="sm" onClick={addExercise}>
              <Plus className="h-4 w-4 mr-1" />
              Add Exercise
            </Button>
          </div>
          {!hasExercises && <NoExerciseMessage />}
          {hasExercises && (
            <ExercisesAccordion
              expandedSections={expandedSections}
              onAccordionChange={handleAccordionChange}
              exercises={exercises}
              state={state}
              onRemoveExercise={removeExercise}
              onUpdateExercise={updateExercise}
            />
          )}
        </div>
        {!state.success && state.message && <WarningAlert description={state.message} />}
        {hasExercises && (
          <AuthRequiredButton
            loadingText="Saving workout..."
            successMessageText="Workout saved successfully!"
            successMessageDescription="You can now view your added workout in the 'Workouts' page."
            errorMessageText="Failed to save workout. Please try again."
            className="w-full"
            // optional prop ? or completely get rid of ?
            onAuthenticatedClick={() => null}
            disabled={isPending}
          >
            Save Workout
          </AuthRequiredButton>
        )}
      </form>
    </Wrapper>
  );
}

interface ExercisesAccordionProps {
  expandedSections: string[];
  onAccordionChange: (newExpandedSections: string[]) => void;
  exercises: Exercise[];
  state: ActionResponse;
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (index: number, field: string, value: string) => void;
}

function ExercisesAccordion({
  expandedSections,
  onAccordionChange,
  exercises,
  state,
  onRemoveExercise,
  onUpdateExercise,
}: ExercisesAccordionProps) {
  return (
    <Accordion
      type="multiple"
      value={expandedSections}
      onValueChange={onAccordionChange}
      className="space-y-3 bg-white"
    >
      {exercises.map((exercise, index) => {
        const exerciseName = getExerciseDisplayName(exercise, index);
        const isExpanded = expandedSections.includes(`exercise-${index}`);

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
              <div className="px-4">
                <ExercisesCardContent
                  index={index}
                  state={state}
                  exercises={exercises}
                  onRemoveExercise={onRemoveExercise}
                  onUpdateExercise={onUpdateExercise}
                />
              </div>
            </AccordionContent>
          </AccordionItem>
        );
      })}
    </Accordion>
  );
}

interface ExerciseCardProps {
  index: number;
  state: ActionResponse;
  exercises: Exercise[];
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (index: number, field: string, value: string) => void;
}

function ExercisesCardContent({
  index,
  state,
  exercises,
  onRemoveExercise,
  onUpdateExercise,
}: ExerciseCardProps) {
  const exerciseErrors = state.errors[index];
  const [exerciseNameError] = exerciseErrors?.exerciseName || [];
  const [repsError] = exerciseErrors?.reps || [];
  const [setsError] = exerciseErrors?.sets || [];
  const isOnlyExercise = exercises.length === 1;

  return (
    <div className="pt-2 pb-4">
      <div className="grid grid-cols-[1fr,auto] gap-2">
        <Input
          placeholder="Exercise name"
          name="exerciseName"
          value={exercises[index].exerciseName}
          onChange={e => onUpdateExercise(index, 'exerciseName', e.target.value)}
          aria-invalid={!!exerciseNameError}
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => onRemoveExercise(index)}
          disabled={isOnlyExercise}
        >
          <Trash2
            style={{ width: '24px', height: '24px' }}
            aria-label="Remove exercise from workout"
          />
        </Button>
        {exerciseNameError && <FormErrorMessage errorMessage={exerciseNameError} />}
        <div className="col-span-2 grid grid-cols-2 gap-3 mt-2">
          <div>
            <Label htmlFor={`sets-${index}`} className="text-xs">
              Sets
            </Label>
            <Input
              id={`sets-${index}`}
              name={`sets-${index}`}
              type="number"
              placeholder="Sets"
              value={exercises[index].sets}
              onChange={e => onUpdateExercise(index, 'sets', e.target.value)}
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
              name={`reps-${index}`}
              type="number"
              placeholder="Reps"
              value={exercises[index].reps}
              onChange={e => onUpdateExercise(index, 'reps', e.target.value)}
              aria-invalid={!!repsError}
            />
            {repsError && <FormErrorMessage errorMessage={repsError} />}
            {/*HACK for now to pass exercises array to Form Data*/}
            <input type="hidden" name="exercises" value={JSON.stringify(exercises)} />
          </div>
        </div>
      </div>
    </div>
  );
}

function NoExerciseMessage() {
  return (
    <>
      <BicepsFlexed className="h-12 w-12 text-muted-foreground mx-auto my-6" />
      <p className="text-muted-foreground text-center">
        No exercises added yet. Click the &apos;Add Exercise&apos; button to start building your
        workout routine or go to &apos;Exercise Library&apos; to choose from a wide range of
        exercises.
      </p>
    </>
  );
}
