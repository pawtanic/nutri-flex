import Workouts from '@/app/(frontend)/workouts/_components/workouts';
import { fetchWorkouts } from '@/app/(frontend)/workouts/_api/fetch-workouts';

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { date } = await searchParams;

  // ideally show not found page ?
  if (!date) {
    return <Workouts initialWorkouts={[]} initialTab="workout" />;
  }

  const payloadWorkouts = await fetchWorkouts(date);

  return <Workouts initialWorkouts={payloadWorkouts} initialTab="workout" />;
}
