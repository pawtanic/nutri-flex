import { getPayload } from 'payload';
import config from '@payload-config';
import type { Workout } from '@/payload-types';

export async function updateExistingWorkout(id: string, updatedWorkoutData: Workout) {
  const payload = await getPayload({ config });

  return await payload.update({
    collection: 'workouts',
    id,
    data: {
      name: updatedWorkoutData.name,
      exercises: updatedWorkoutData.exercises,
    },
  });
}
