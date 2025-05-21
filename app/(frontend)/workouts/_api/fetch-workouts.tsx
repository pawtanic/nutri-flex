'use server';

import { getPayload } from 'payload';
import config from '@payload-config';

// fetchWorkouts.js
export async function fetchWorkouts(date) {
  // Format date for database query (YYYY-MM-DD)

  const normalizedDate = normalizeDate(date);

  console.log(normalizedDate, 'normalizedDate');
  console.log(date, 'normalizedDate');

  const payload = await getPayload({ config });
  const workoutsResult = await payload.find({
    collection: 'workouts',
    where: {
      date: {
        equals: normalizedDate,
      },
    },
    limit: 20,
    depth: 2,
    sort: '-createdAt',
  });

  return workoutsResult.docs;
}

function normalizeDate(date) {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  // Use UTC methods to avoid timezone issues
  const year = dateObj.getUTCFullYear();
  const month = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getUTCDate()).padStart(2, '0');

  return `${year}-${month}-${day}`;
}
