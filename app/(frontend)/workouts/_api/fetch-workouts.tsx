'use server';

import { getCookieHeader } from '@/app/(frontend)/utils/getCookieHeader';

export async function fetchWorkouts(date: string) {
  // Use absolute URL on the server, relative on the client
  const isServer = typeof window === 'undefined';
  const baseUrl = isServer ? process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000' : '';
  const url = `${baseUrl}/api/workouts?date=${encodeURIComponent(date)}`;
  let res;
  if (isServer) {
    const cookieHeader = await getCookieHeader();
    res = await fetch(url, {
      headers: {
        Cookie: cookieHeader,
      },
    });
  } else {
    res = await fetch(url);
  }
  if (!res.ok) {
    throw new Error(`Failed to fetch workouts: ${res.status}`);
  }
  const apiData = await res.json();
  return Array.isArray(apiData)
    ? apiData
    : Array.isArray(apiData.data)
      ? apiData.data
      : [];
}
