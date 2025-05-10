import { getPayload } from 'payload';
import config from '@payload-config';
import { Workout } from '@/payload-types';

// Define a type that matches what Payload expects for workout creation
type CreateWorkoutData = Omit<Workout, 'id' | 'updatedAt' | 'createdAt'>;

interface CreateWorkoutProps {
  newWorkout: CreateWorkoutData;
}

export async function createWorkout({ newWorkout }: CreateWorkoutProps) {
  try {
    console.log('Creating workout with data:', JSON.stringify(newWorkout));
    const payload = await getPayload({ config });

    const result = await payload.create({
      collection: 'workouts',
      data: newWorkout,
    });

    console.log('Workout created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in createWorkout:', error);
    // Re-throw to let the calling function handle it
    throw error;
  }
}
