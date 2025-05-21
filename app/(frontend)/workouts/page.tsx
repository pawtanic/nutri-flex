// workouts/page.tsx
import WorkoutsPageClient from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';
import { fetchWorkouts } from '@/app/(frontend)/workouts/_api/fetch-workouts';

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { date } = await searchParams;
  const payloadWorkouts = await fetchWorkouts(date);
  return <WorkoutsPageClient initialWorkouts={payloadWorkouts} initialTab="workout" />;
}

// Add this to ensure we know if this page should be static or dynamic
// export const dynamic = 'force-dynamic'; // If workout data changes frequently
