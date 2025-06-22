// Define a type that matches what Payload expects for workout creation
import { Workout } from '@/lib/models/workouts.model';

type CreateWorkoutData = Omit<Workout, 'id' | 'updatedAt' | 'createdAt'>;

interface CreateWorkoutProps {
  newWorkout: CreateWorkoutData;
}

export async function createWorkout({ newWorkout }: CreateWorkoutProps) {
  try {
    console.log('Creating workout with data:', JSON.stringify(newWorkout));

    const result = await fetch('/api/workouts', {
      method: 'POST',
      body: JSON.stringify(newWorkout),
    });

    console.log('Workout created successfully:', result);
    return result;
  } catch (error) {
    console.error('Error in createWorkout:', error);
    // Re-throw to let the calling function handle it
    throw error;
  }
}
