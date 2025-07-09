import { env } from '@/lib/config/env.config';

const API_BASE_URL = `${env.APP_URL}/api/workouts`;

export const workoutApi = {
  getWorkouts: async (params: { page?: number; limit?: number } = {}) => {
    const url = new URL(API_BASE_URL, window.location.origin);
    if (params.page) url.searchParams.set('page', params.page.toString());
    if (params.limit) url.searchParams.set('limit', params.limit.toString());
    const response = await fetch(url.toString());
    if (!response.ok) throw new Error('Failed to fetch workouts');
    return response.json();
  },
  createWorkout: async (workout: any) => {
    const response = await fetch(API_BASE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(workout),
    });
    if (!response.ok) throw new Error('Failed to create workout');
    return response.json();
  },
  updateWorkout: async (id: string, workout: any) => {
    const response = await fetch(API_BASE_URL, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...workout, id }),
    });
    if (!response.ok) throw new Error('Failed to update workout');
    return response.json();
  },
  deleteWorkout: async (id: string) => {
    const url = new URL(API_BASE_URL, window.location.origin);
    url.searchParams.set('id', id);
    const response = await fetch(url.toString(), { method: 'DELETE' });
    if (!response.ok) throw new Error('Failed to delete workout');
    return response.json();
  },
}; 
