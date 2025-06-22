'use server';

import type { Exercises } from '@/app/(frontend)/workouts/_components/workout-form-types';

export async function getWorkoutById(id: string) {
  return null;
  // try {
  //   const payload = await getPayload({ config });
  //
  //   const workout = await payload.findByID({
  //     collection: 'workouts',
  //     id,
  //     depth: 2,
  //   });
  //
  //   if (!workout) {
  //     return null;
  //   }
  //
  //   return {
  //     id: workout.id,
  //     name: workout.name,
  //     date: workout.date,
  //     exercises:
  //       workout.exercises?.map((exercise: Exercises[number]) => ({
  //         name: exercise.name,
  //         sets: exercise.sets,
  //         id: exercise.id,
  //       })) || [],
  //     createdBy:
  //       typeof workout.createdBy === 'string' ? workout.createdBy : workout.createdBy?.id || '',
  //   } as Workout;
  // } catch (error) {
  //   console.error('Error fetching workout by ID:', error);
  //   return null;
  // }
}
