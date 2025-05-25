import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { Exercises } from './workout-form-types';
import FormErrorMessage from '@/components/common/form-error-message/form-error-message';

interface EditExerciseSetRowProps {
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
}

export function EditExerciseSetRow({
  index,
  setIndex,
  state,
  exercises,
  exerciseErrors,
  onUpdateSet,
}: EditExerciseSetRowProps) {
  const setErrors = exerciseErrors?.sets?.[setIndex] || {};
  const repsId = `reps-${index}-${setIndex}`;
  const weightId = `weight-${index}-${setIndex}`;

  const currentExercise = exercises[index];
  const currentSet = currentExercise.sets[setIndex];

  const savedRepsValue = state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.reps;
  const savedWeightValue = state?.inputs?.exercises?.[index]?.sets?.[setIndex]?.weight;

  const hasRepsError = !!setErrors.reps;
  const hasWeightError = !!setErrors.weight;

  // Use the current value from state or fall back to saved value
  const repsValue = currentSet.reps ?? savedRepsValue;
  const weightValue = currentSet.weight ?? savedWeightValue;

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
          aria-describedby={hasRepsError ? `${repsId}-error` : undefined}
          defaultValue={repsValue}
        />
        {hasRepsError && <FormErrorMessage id={`${repsId}-error`} errorMessage={setErrors.reps} />}
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
          aria-describedby={hasWeightError ? `${weightId}-error` : undefined}
          defaultValue={weightValue}
        />
        {hasWeightError && (
          <FormErrorMessage id={`${weightId}-error`} errorMessage={setErrors.weight} />
        )}
      </div>
    </div>
  );
}
