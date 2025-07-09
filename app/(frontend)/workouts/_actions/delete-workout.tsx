import { env } from '@/lib/config/env.config';

export async function deleteWorkout(workoutId: string) {
  const res = await fetch(`${env.APP_URL}/api/workouts?id=${encodeURIComponent(workoutId)}`, {
    method: 'DELETE',
  });
  if (!res.ok) {
    throw new Error('Failed to delete workout');
  }
  return res.json();
}
