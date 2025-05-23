// In use-edit-workout-form.ts
import { Workout } from '@/payload-types';
import { startTransition, useOptimistic, useTransition } from 'react';
import { showErrorToast, showSuccessToast } from '@/app/(frontend)/utils/helpers';
import { RoutesConfig } from '@/components/common/navigation/navigation';
import { useRouter } from 'next/navigation';
import { deleteWorkoutAction } from '@/app/(frontend)/workouts/_actions/delete-workout-action';

type UseDeleteWorkoutFormReturn = {
  removeWorkout: (formData: FormData) => Promise<boolean>;
  isDeleting: boolean;
  optimisticWorkout: Workout | null;
};

export function useDeleteWorkoutForm(workout: Workout): UseDeleteWorkoutFormReturn {
  const [isPending, startTransition] = useTransition();
  const [optimisticWorkout, removeOptimisticWorkout] = useOptimistic(workout, () => null);

  const router = useRouter();

  async function removeWorkout(): Promise<boolean> {
    return new Promise(resolve => {
      startTransition(async () => {
        removeOptimisticWorkout(null);

        try {
          const result = await deleteWorkoutAction(workout.id);

          if (!result.success) {
            showErrorToast({
              title: 'Error',
              description: result.message || 'Failed to delete workout',
            });
            resolve(false);
            return;
          }

          showSuccessToast({
            title: 'Success',
            description: 'Workout deleted successfully',
          });

          router.push(RoutesConfig.workout);
          router.refresh();
          resolve(true);
        } catch (error) {
          showErrorToast({
            title: 'Error',
            description: 'An unexpected error occurred',
          });
          resolve(false);
        }
      });
    });
  }

  return {
    removeWorkout,
    isDeleting: isPending || optimisticWorkout === null,
    optimisticWorkout,
  };
}
