// import fetchWorkouts from '@/app/(frontend)/workouts/_api/fetch-workouts';
import WorkoutsPageClient, {
  Workout,
} from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Workouts',
};

export default async function WorkoutsPage({
  params,
  searchParams,
}: {
  params: Promise<any>;
  searchParams: any;
}) {
  // Fetch all necessary data on the server
  // todo: pass generic ?
  const workoutsData = [] as Workout[];
  // const workoutsData = await fetchWorkouts();

  console.log(params);

  console.log(workoutsData);

  console.log(searchParams);
  // Get the initial tab from search params or default
  const initialTab = searchParams.get('tab') || (workoutsData.length > 0 ? 'workout' : 'templates');

  // Pass everything to the client component
  return (
    <WorkoutsPageClient
      initialWorkouts={workoutsData}
      initialTab={initialTab}
      initialTemplates={[]}
    />
  );
}
