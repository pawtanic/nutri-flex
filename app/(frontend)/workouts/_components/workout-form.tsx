import { Wrapper } from '@/components/layout/Wrapper';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { BicepsFlexed, Plus, Trash2 } from 'lucide-react';
import { AuthRequiredButton } from '@/components/common/auth-button/auth-button';
import { SetSchema } from '@/app/(frontend)/workouts/_schemas/exercise-schema';
import { useActionState, useState } from 'react';
import { addExercisesAction } from '@/app/(frontend)/workouts/_actions/add-exercises-action';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';
// import { useFocusError } from '@/hooks/use-focus-error';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { getExerciseDisplayName } from '@/app/(frontend)/utils/helpers';
import type { Workout } from '@/payload-types';
import { ActionResponse } from '@/app/(frontend)/types/common-types';

export type Set = SetSchema;
// Define a non-nullable version of the Exercises type
export type Exercises = NonNullable<Workout['exercises']>;

interface WorkoutFormProps {
  exercises: Exercises;
  setExercises: (exercises: Exercises) => void;
}

const initialState: ActionResponse = {
  errors: [],
  message: '',
  success: false,
};

export function WorkoutForm({ exercises, setExercises }: WorkoutFormProps) {
  const [state, action, isPending] = useActionState(addExercisesAction, initialState);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const addExercise = () => {
    const newExercises = [
      ...exercises,
      {
        exerciseName: '',
        sets: [{ reps: null, weight: null }],
      },
    ];
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

  const addSet = (exerciseIndex: number) => {
    const newExercises = [...exercises];
    const newSets = [...newExercises[exerciseIndex].sets, { reps: null, weight: null }];

    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      sets: newSets,
    };

    setExercises(newExercises);
  };

  const removeSet = (exerciseIndex: number, setIndex: number) => {
    if (exercises[exerciseIndex].sets.length <= 1) {
      return; // Don't remove the last set
    }

    const newExercises = [...exercises];
    const newSets = [...newExercises[exerciseIndex].sets];

    newSets.splice(setIndex, 1);

    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      sets: newSets,
    };

    setExercises(newExercises);
  };

  const handleAccordionChange = (newExpandedSections: string[]) => {
    setExpandedSections(newExpandedSections);
  };

  const handleAction = async (formData: FormData) => {
    formData.append('exercises', JSON.stringify(exercises));
    return action(formData);
  };

  // hide in fn ?
  const workoutNameError = state.errors?.[0]?.workoutName?.[0];
  const hasExercises = exercises.length > 0;

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
              onUpdateSet={updateSet}
              onAddSet={addSet}
              onRemoveSet={removeSet}
            />
          )}
        </div>
        {hasExercises && (
          <AuthRequiredButton loadingText="Saving workout..." className="w-full" isBusy={isPending}>
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
  exercises: Exercises;
  state: ActionResponse;
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (index: number, field: string, value: string) => void;
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: string, value: string) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
}

function ExercisesAccordion({
  expandedSections,
  onAccordionChange,
  exercises,
  state,
  onRemoveExercise,
  onUpdateExercise,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
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
                  onUpdateSet={onUpdateSet}
                  onAddSet={onAddSet}
                  onRemoveSet={onRemoveSet}
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
  exercises: Exercises;
  onRemoveExercise: (index: number) => void;
  onUpdateExercise: (index: number, field: string, value: string) => void;
  onUpdateSet: (exerciseIndex: number, setIndex: number, field: string, value: string) => void;
  onAddSet: (exerciseIndex: number) => void;
  onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
}

function ExercisesCardContent({
  index,
  state,
  exercises,
  onRemoveExercise,
  onUpdateExercise,
  onUpdateSet,
  onAddSet,
  onRemoveSet,
}: ExerciseCardProps) {
  const exerciseErrors = state.errors?.[index] || null;
  const errorMessage = state.message || null;

  const [exerciseNameError] = exerciseErrors?.exerciseName || [];
  const isOnlyExercise = exercises.length === 1;
  console.log(state, 'state');
  return (
    <div className="pt-2 pb-4">
      <div className="grid grid-cols-[1fr,auto] gap-2">
        <Input
          placeholder="Exercise name"
          name="exerciseName"
          value={exercises[index].exerciseName}
          onChange={e => onUpdateExercise(index, 'exerciseName', e.target.value)}
          defaultValue={state?.inputs?.exercises?.[index]?.exerciseName}
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
        {exerciseNameError && <FormErrorMessage errorMessage={exerciseNameError || errorMessage} />}

        <div className="col-span-2 mt-4">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium">Sets</Label>
            <div className="space-x-3">
              <Button type="button" size="sm" onClick={() => onAddSet(index)} className="h-8">
                <Plus className="h-4 w-4 mr-1" />
                Add set
              </Button>
            </div>
          </div>
          {exercises[index].sets.map((_, setIndex) => {
            // Get errors for this specific set
            const setErrors = exerciseErrors?.sets?.[setIndex] || {};
            return (
              // component
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
                    onChange={e => onUpdateSet(index, setIndex, 'reps', e.target.value)}
                    aria-invalid={!!setErrors.reps}
                    defaultValue={state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.reps}
                  />
                  {setErrors.reps && <FormErrorMessage errorMessage={setErrors.reps} />}
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
                    onChange={e => onUpdateSet(index, setIndex, 'weight', e.target.value)}
                    aria-invalid={!!setErrors.weight}
                    defaultValue={state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.weight}
                  />
                  {setErrors.weight && <FormErrorMessage errorMessage={setErrors.weight} />}
                </div>

                {exercises[index].sets.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    onClick={() => onRemoveSet(index, setIndex)}
                    className="self-end mb-1"
                    aria-label="Remove set"
                  >
                    <Trash2 aria-hidden="true" className="h-4 w-4" />
                  </Button>
                )}
              </div>
            );
          })}
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
