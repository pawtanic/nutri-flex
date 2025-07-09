'use server';

import { getCookieHeader } from '@/app/(frontend)/utils/getCookieHeader';
import { env } from '@/lib/config/env.config';

export async function getWorkoutById(id: string) {
  try {
    const cookieHeader = await getCookieHeader();
    const res = await fetch(`${env.APP_URL}/api/workouts/${id}`, {
      headers: {
        Cookie: cookieHeader,
      },
    });
    if (!res.ok) {
      return null;
    }
    return await res.json();
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    return null;
  }
}
