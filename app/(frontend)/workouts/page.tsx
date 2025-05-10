import WorkoutsPageClient from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';
import { Suspense } from 'react';
import { fetchWorkouts } from '@/app/(frontend)/workouts/_api/fetch-workouts';

export default async function WorkoutsPage() {
  const payloadWorkouts = await fetchWorkouts();
  return (
    <Suspense>
      <WorkoutsPageClient initialWorkouts={payloadWorkouts} initialTab="workout" />
    </Suspense>
  );
}
