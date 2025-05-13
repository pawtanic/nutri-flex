import { useState, useEffect } from 'react';
import { useActionState } from 'react';
import { useRouter } from 'next/navigation';
import { ActionResponse } from '@/app/(frontend)/types/common-types';
import { updateWorkout } from '@/app/(frontend)/workouts/_actions/edit-exercise-action';
import { deleteExerciseAction } from '@/app/(frontend)/workouts/_actions/delete-exercise-action';
import { showErrorToast, showSuccessToast } from '@/app/(frontend)/utils/helpers';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { Exercises, Set } from '../_components/workout-form-types';
import { Workout } from '@/payload-types';

interface UseEditWorkoutFormReturn {
  readonly state: ActionResponse;
  readonly isPending: boolean;
  readonly workoutName: string;
  readonly exercises: Exercises;
  readonly expandedSections: string[];
  readonly workoutNameError: string | undefined;
  readonly hasExercises: boolean;
  readonly handleAction: (formData: FormData) => Promise<void>;
  readonly handleAccordionChange: (newExpandedSections: string[]) => void;
  readonly addExercise: () => void;
  readonly removeExercise: (index: number) => Promise<void>;
  readonly updateExercise: (index: number, field: string, value: string | Set[]) => void;
  readonly updateSet: (exerciseIndex: number, setIndex: number, field: string, value: string) => void;
  readonly setWorkoutName: (name: string) => void;
}

const initialState: ActionResponse = {
  errors: [],
  message: '',
  success: false,
};

export function useEditWorkoutForm(workout: Workout): UseEditWorkoutFormReturn {
  const [state, action, isPending] = useActionState(updateWorkout, initialState);
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

  async function removeExercise(index: number): Promise<void> {
    const exerciseToRemove = exercises[index];

    // Only call the server action if the exercise has an ID (exists in the database)
    if (exerciseToRemove.id) {
      try {
        const result = await deleteExerciseAction(workout.id as string, exerciseToRemove.id);
        
        if (!result.success) {
          showErrorToast({
            title: 'Error',
            description: 'Failed to delete exercise',
          });
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
        showErrorToast({
          title: 'Error',
          description: 'Failed to delete exercise',
        });
      }
    } else {
      // For exercises that don't have an ID (not saved to the database yet)
      const newExercises = [...exercises];
      newExercises.splice(index, 1);
      setExercises(newExercises);
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

  function addExercise(): void {
    const newExercises = [
      ...exercises,
      {
        exerciseName: `Exercise ${exercises.length + 1}`,
        sets: [{ reps: 1, weight: 1 }],
      },
    ];
    setExercises(newExercises);
    setExpandedSections([`exercise-${newExercises.length - 1}`]);
  }

  function handleAccordionChange(newExpandedSections: string[]): void {
    setExpandedSections(newExpandedSections);
  }

  async function handleAction(formData: FormData): Promise<void> {
    formData.append('workoutId', workout.id as string);
    formData.append('workoutName', workoutName);
    formData.append('exercises', JSON.stringify(exercises));
    formData.append('date', workout.date);
    
    return action(formData);
  }

  useEffect(() => {
    if (!state.success) return;

    showSuccessToast({
      title: 'Success',
      description: 'Workout updated successfully',
    });

    router.push(RoutesConfig.workout);
  }, [state.success, router]);

  const workoutNameError = state.errors?.[0]?.workoutName?.[0];
  const hasExercises = exercises.length > 0;

  return {
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
  };
}
