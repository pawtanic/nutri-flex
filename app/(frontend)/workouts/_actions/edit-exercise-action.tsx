// actions/workout.ts
'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { ActionResponse } from '@/app/(frontend)/types/common-types';

export async function updateWorkout(_: ActionResponse, formData: FormData) {
  try {
    console.log('Updating workout:', formData);
    // Revalidate the workouts page to reflect changes
    revalidatePath('/workouts');

    // Redirect back to the workouts page
    redirect('/workouts');
  } catch (error) {
    console.error('Error updating workout:', error);
    return {
      success: false,
      message: 'An error occurred during exercise creation',
    };
  }
}
