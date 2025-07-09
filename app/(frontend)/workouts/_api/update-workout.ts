import { getCookieHeader } from '@/app/(frontend)/utils/getCookieHeader';
import { env } from '@/lib/config/env.config';

export async function updateExistingWorkout(id: string, updatedWorkoutData) {
  const cookieHeader = await getCookieHeader();
  const res = await fetch(`${env.APP_URL}/api/workouts`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', Cookie: cookieHeader },
    body: JSON.stringify({ ...updatedWorkoutData, id }),
  });
  if (!res.ok) {
    throw new Error(`Failed to update workout: ${res.status}`);
  }
  return res.json();
}
