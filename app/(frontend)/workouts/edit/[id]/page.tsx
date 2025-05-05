import { notFound } from 'next/navigation';
import { getWorkoutById } from '@/app/(frontend)/workouts/_api/fetch-workout-by-id';
import { EditWorkoutForm } from '@/app/(frontend)/workouts/_components/edit-workout-form';

export default async function EditWorkoutPage({ params }: { params: Promise<{ id: string }> }) {
  const workoutPromise = await params;
  const workout = await getWorkoutById(workoutPromise.id);

  if (!workout) {
    notFound();
  }

  return (
    <div className="container max-w-md mx-auto pb-20 pt-6 px-4">
      <h1 className="text-2xl font-bold mb-6">Edit Workout</h1>
      <EditWorkoutForm workout={workout} />
    </div>
  );
}
