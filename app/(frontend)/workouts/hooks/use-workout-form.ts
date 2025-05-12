import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { addExercisesAction } from '@/app/(frontend)/workouts/_actions/add-exercises-action';
import { showSuccessToast } from '@/app/(frontend)/utils/helpers';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { Exercises, Set } from '../_components/workout-form-types';

interface UseWorkoutFormReturn {
  readonly state: ActionResponse;
  readonly isPending: boolean;
  readonly expandedSections: string[];
  readonly workoutNameError: string | undefined;
  readonly hasExercises: boolean;
  readonly handleAction: (formData: FormData) => Promise<void>;
  readonly handleAccordionChange: (newExpandedSections: string[]) => void;
  readonly addExercise: () => void;
  readonly removeExercise: (index: number) => void;
  readonly updateExercise: (index: number, field: string, value: string | Set[]) => void;
  readonly updateSet: (exerciseIndex: number, setIndex: number, field: string, value: string) => void;
  readonly addSet: (exerciseIndex: number) => void;
  readonly removeSet: (exerciseIndex: number, setIndex: number) => void;
}

const initialState: ActionResponse = {
  errors: [],
  message: '',
  success: false,
};

export function useWorkoutForm(
  exercises: Exercises,
  setExercises: (exercises: Exercises) => void
): UseWorkoutFormReturn {
  const [state, action, isPending] = useActionState(addExercisesAction, initialState);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const router = useRouter();

  function addExercise(): void {
    const newExercises = [
      ...exercises,
      {
        exerciseName: '',
        sets: [{ reps: null, weight: null }],
      },
    ];
    setExercises(newExercises);
    setExpandedSections([`exercise-${newExercises.length - 1}`]);
  }

  function removeExercise(index: number): void {
    const newExercises = [...exercises];
    newExercises.splice(index, 1);
    setExercises(newExercises);

    if (newExercises.length > 0) {
      setExpandedSections([`exercise-${newExercises.length - 1}`]);
    } else {
      setExpandedSections([]);
    }
  }

  function updateExercise(index: number, field: string, value: string | Set[]): void {
    const newExercises = [...exercises];

    if (field === 'sets') {
      // When updating the entire sets array
      newExercises[index] = { ...newExercises[index], sets: value as Set[] };
    } else {
      // For other fields like exerciseName
      newExercises[index] = { ...newExercises[index], [field]: value };
    }

    setExercises(newExercises);
  }

  function updateSet(exerciseIndex: number, setIndex: number, field: string, value: string): void {
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
  }

  function addSet(exerciseIndex: number): void {
    const newExercises = [...exercises];
    const newSets = [...newExercises[exerciseIndex].sets, { reps: null, weight: null }];

    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      sets: newSets,
    };

    setExercises(newExercises);
  }

  function removeSet(exerciseIndex: number, setIndex: number): void {
    if (exercises[exerciseIndex].sets.length <= 1) {
      return; // Early return for error condition
    }

    const newExercises = [...exercises];
    const newSets = [...newExercises[exerciseIndex].sets];

    newSets.splice(setIndex, 1);

    newExercises[exerciseIndex] = {
      ...newExercises[exerciseIndex],
      sets: newSets,
    };

    setExercises(newExercises);
  }

  function handleAccordionChange(newExpandedSections: string[]): void {
    setExpandedSections(newExpandedSections);
  }

  async function handleAction(formData: FormData): Promise<void> {
    formData.append('exercises', JSON.stringify(exercises));
    return action(formData);
  }

  useEffect(() => {
    if (!state.success) return;

    showSuccessToast({
      title: 'Success',
      description: 'Workout created successfully',
    });

    router.push(RoutesConfig.workout);
  }, [state.success, router]);

  const workoutNameError = state.errors?.[0]?.workoutName?.[0];
  const hasExercises = exercises.length > 0;

  return {
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
  };
}
