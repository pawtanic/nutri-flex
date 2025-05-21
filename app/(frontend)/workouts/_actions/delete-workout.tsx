import { getPayload } from 'payload';
import config from '@payload-config';

export async function deleteWorkout(workoutId: string) {
  const payload = await getPayload({ config });
  const workout = await payload.findByID({
    collection: 'workouts',
    id: workoutId,
  });

  if (!workout) {
    throw new Error('Workout not found');
  }

  // if (workout.user !== userId) {
  //   throw new Error('Unauthorized');
  // }

  await payload.delete({
    collection: 'workouts',
    id: workoutId,
  });
}
