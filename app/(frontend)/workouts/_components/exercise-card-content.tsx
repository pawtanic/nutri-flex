import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { Exercises, Set } from './workout-form-types';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';

interface ExerciseCardProps {
  readonly index: number;
  readonly state: ActionResponse;
  readonly exercises: Exercises;
  readonly onRemoveExercise: (index: number) => void;
  readonly onUpdateExercise: (index: number, field: string, value: string | Set[]) => void;
  readonly onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: string,
    value: string
  ) => void;
  readonly onAddSet: (exerciseIndex: number) => void;
  readonly onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
}

export function ExerciseCardContent({
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
  const exerciseNameError = exerciseErrors?.exerciseName?.[0];
  const isOnlyExercise = exercises.length === 1;
  const savedExerciseName = state?.inputs?.exercises?.[index]?.exerciseName;
  const currentExercise = exercises[index];

  return (
    <div className="pt-2 pb-4">
      <div className="grid grid-cols-[1fr,auto] gap-2">
        <Input
          placeholder="Exercise name"
          name="exerciseName"
          value={currentExercise.exerciseName}
          onChange={e => onUpdateExercise(index, 'exerciseName', e.target.value)}
          defaultValue={savedExerciseName}
          aria-invalid={!!exerciseNameError}
          aria-describedby={exerciseNameError ? `exercise-name-error-${index}` : undefined}
        />
        <Button
          type="button"
          variant="ghost"
          onClick={() => onRemoveExercise(index)}
          disabled={isOnlyExercise}
          aria-label="Remove exercise from workout"
        >
          <Trash2 style={{ width: '24px', height: '24px' }} aria-hidden="true" />
        </Button>
        {exerciseNameError && <FormErrorMessage errorMessage={exerciseNameError || errorMessage} />}

        <div className="col-span-2 mt-4">
          <div className="flex justify-between items-center mb-2">
            <Label className="text-sm font-medium">Sets</Label>
            <div className="space-x-3">
              <Button
                type="button"
                size="sm"
                onClick={() => onAddSet(index)}
                className="h-8"
                aria-label="Add a new set"
              >
                <Plus className="h-4 w-4 mr-1" aria-hidden="true" />
                Add set
              </Button>
            </div>
          </div>

          {currentExercise.sets.map((_, setIndex) => (
            <ExerciseSetRow
              key={setIndex}
              index={index}
              setIndex={setIndex}
              state={state}
              exercises={exercises}
              exerciseErrors={exerciseErrors}
              onUpdateSet={onUpdateSet}
              onRemoveSet={onRemoveSet}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

interface ExerciseSetRowProps {
  readonly index: number;
  readonly setIndex: number;
  readonly state: ActionResponse;
  readonly exercises: Exercises;
  readonly exerciseErrors: any;
  readonly onUpdateSet: (
    exerciseIndex: number,
    setIndex: number,
    field: string,
    value: string
  ) => void;
  readonly onRemoveSet: (exerciseIndex: number, setIndex: number) => void;
}

function ExerciseSetRow({
  index,
  setIndex,
  state,
  exercises,
  exerciseErrors,
  onUpdateSet,
  onRemoveSet,
}: ExerciseSetRowProps) {
  const setErrors = exerciseErrors?.sets?.[setIndex] || {};
  const repsId = `reps-${index}-${setIndex}`;
  const weightId = `weight-${index}-${setIndex}`;
  const repsErrorId = `${repsId}-error`;
  const weightErrorId = `${weightId}-error`;
  
  const currentExercise = exercises[index];
  const hasMultipleSets = currentExercise.sets.length > 1;
  
  const savedRepsValue = state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.reps;
  const savedWeightValue = state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.weight;
  
  const hasRepsError = !!setErrors.reps;
  const hasWeightError = !!setErrors.weight;

  return (
    <div className="grid grid-cols-[1fr,1fr,auto] gap-3 mb-3 p-3 bg-gray-50 rounded-md">
      <div>
        <Label htmlFor={repsId} className="text-xs">
          Reps
        </Label>
        <Input
          id={repsId}
          name={repsId}
          type="number"
          placeholder="Reps"
          onChange={e => onUpdateSet(index, setIndex, 'reps', e.target.value)}
          aria-invalid={hasRepsError}
          aria-describedby={hasRepsError ? repsErrorId : undefined}
          defaultValue={savedRepsValue}
        />
        {hasRepsError && <FormErrorMessage errorMessage={setErrors.reps} />}
      </div>

      <div>
        <Label htmlFor={weightId} className="text-xs">
          Weight (kg)
        </Label>
        <Input
          id={weightId}
          name={weightId}
          type="number"
          placeholder="Weight"
          onChange={e => onUpdateSet(index, setIndex, 'weight', e.target.value)}
          aria-invalid={hasWeightError}
          aria-describedby={hasWeightError ? weightErrorId : undefined}
          defaultValue={savedWeightValue}
        />
        {hasWeightError && <FormErrorMessage errorMessage={setErrors.weight} />}
      </div>

      {hasMultipleSets && (
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
}
