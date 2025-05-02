import fetchWorkouts from '@/app/(frontend)/workouts/_api/fetch-workouts';
import WorkoutsPageClient from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';

export default async function WorkoutsPage({
  params,
  searchParams,
}: {
  params: any;
  searchParams: { tab?: string };
}) {
  // Fetch all necessary data on the server
  const workoutsData = await fetchWorkouts();

  console.log(params);

  console.log(workoutsData);

  console.log(searchParams);
  // Get the initial tab from search params or default
  const initialTab = searchParams.tab || (workoutsData.length > 0 ? 'workout' : 'templates');

  // Pass everything to the client component
  return <WorkoutsPageClient initialWorkouts={workoutsData} initialTab={initialTab} />;
}
