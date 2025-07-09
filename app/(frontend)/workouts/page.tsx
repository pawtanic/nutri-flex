import WorkoutsPageClient from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';
import { env } from '@/lib/config/env.config';
import { cookies } from 'next/headers';

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { date } = await searchParams;

  if (!date) {
    return <WorkoutsPageClient initialWorkouts={[]} initialTab="workout" />;
  }

  // Get cookies from the incoming request (async API)
  const cookieStore = await cookies();
  const cookieHeader = cookieStore.getAll()
    .map(({ name, value }) => `${name}=${value}`)
    .join('; ');

  try {
    const res = await fetch(`${env.APP_URL}/api/workouts?date=${encodeURIComponent(date)}`, {
      cache: 'no-store',
      headers: {
        Cookie: cookieHeader, // Forward the cookie header
      },
    });

    if (!res.ok) {
      let errorText = '';
      try {
        errorText = await res.text();
      } catch (e) {
        errorText = '[Could not read error body]';
      }
      // eslint-disable-next-line no-console
      console.error(`API error: ${res.status} - ${errorText}`);
      return <div className="text-red-500">Failed to load workouts. Please try again later.</div>;
    }

    const apiData = await res.json();
    const workouts = Array.isArray(apiData)
      ? apiData
      : Array.isArray(apiData.data)
        ? apiData.data
        : [];

    return <WorkoutsPageClient initialWorkouts={workouts} initialTab="workout" />;
  } catch (err) {
    // eslint-disable-next-line no-console
    console.error('Fetch error:', err);
    return <div className="text-red-500">An unexpected error occurred. Please try again later.</div>;
  }
}
