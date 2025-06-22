import WorkoutsPageClient from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';
// import { fetchWorkouts } from '@/app/(frontend)/workouts/_api/fetch-workouts';
import WorkoutService from '@/lib/services/WorkoutService';
import { Workout } from '@/lib/models/workouts.model';

export default async function WorkoutsPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | undefined }>;
}) {
  const { date } = await searchParams;

  // ideally show not found page ?
  if (!date) {
    return <WorkoutsPageClient initialWorkouts={[]} initialTab="workout" />;
  }

  // const payloadWorkouts = await fetchWorkouts(date);
  const workouts: Workout[] = await WorkoutService.findAll();

  return <WorkoutsPageClient initialWorkouts={workouts} initialTab="workout" />;
}
