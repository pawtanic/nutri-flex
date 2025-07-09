// Define a type that matches what Payload expects for workout creation
import { Workout } from '@/lib/models/workouts.model';
import { env } from '@/lib/config/env.config';
import { getCookieHeader } from '@/app/(frontend)/utils/getCookieHeader';


interface CreateWorkoutProps {
  newWorkout: Partial<Workout>;
}

export async function createWorkout({ newWorkout }: CreateWorkoutProps) {
  try {
    console.log('Creating workout with data:', JSON.stringify(newWorkout));

    const cookieHeader = await getCookieHeader();
    const result = await fetch(`${env.APP_URL}/api/workouts`, {
      method: 'POST',
      body: JSON.stringify(newWorkout),
      headers: {
        'Content-Type': 'application/json',
        Cookie: cookieHeader,
      },
    });

    if (!result.ok) {
      const errorBody = await result.text();
      console.error(
        `Error creating workout: ${result.status} ${result.statusText} - ${errorBody}`
      );
      throw new Error(
        `Failed to create workout: ${result.status} ${result.statusText} - ${errorBody}`
      );
    }

    const data = await result.json();
    console.log('Workout created successfully:', data);
    return data;
  } catch (error) {
    console.error('Error in createWorkout:', error);
    throw error;
  }
}
