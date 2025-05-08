'use server';

import { getPayload } from 'payload';
import config from '@payload-config';
import { Workout } from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';

export async function getWorkoutById(id: string): Promise<Workout | null> {
  try {
    const payload = await getPayload({ config });

    const workout = await payload.findByID({
      collection: 'workouts',
      id,
      depth: 2,
    });

    if (!workout) {
      return null;
    }

    return {
      id: workout.id,
      name: workout.name,
      date: workout.date,
      exercises: workout.exercises.map((exercise: any) => ({
        exerciseName: exercise.name,
        sets: exercise.sets,
        reps: exercise.reps,
        notes: exercise.notes || '',
        id: exercise.id,
      })),
      createdBy:
        typeof workout.createdBy === 'string' ? workout.createdBy : workout.createdBy?.id || '',
    };
  } catch (error) {
    console.error('Error fetching workout by ID:', error);
    return null;
  }
}
