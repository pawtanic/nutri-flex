'use server';

import { getPayload } from 'payload';
import config from '@payload-config';

export async function fetchWorkouts(date: string) {
  const payload = await getPayload({ config });
  const startOfDay = new Date(date);
  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  const workoutsResult = await payload.find({
    collection: 'workouts',
    where: {
      date: {
        greater_than_equal: startOfDay.toISOString(),
        less_than_equal: endOfDay.toISOString(),
      },
    },
    limit: 20,
    depth: 2,
    sort: '-createdAt',
    page: 1,
  });
  return workoutsResult.docs;
}
