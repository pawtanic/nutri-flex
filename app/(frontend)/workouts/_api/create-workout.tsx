import { getPayload } from 'payload';
import config from '@payload-config';
import { Workout } from '@/payload-types';

interface CreateWorkoutProps {
  newWorkout: Workout;
}

export async function createWorkout({ newWorkout }: CreateWorkoutProps) {
  // create workout in payload
  console.log('Creating workout with data:', newWorkout);
  const payload = await getPayload({ config });

  return await payload.create({
    collection: 'workouts',
    data: newWorkout,
  });
}
