import { Workout } from '@/app/(frontend)/workouts/_components/WorkoutsPageClient';

const dummyData = [
  {
    id: '1',
    name: 'Push Day',
    date: '2025-05-01T10:00:00.000Z',
    exercises: [
      { exerciseName: 'Bench Press', sets: 4, reps: 8, notes: 'Focus on form' },
      { exerciseName: 'Overhead Press', sets: 3, reps: 10, notes: '' },
      { exerciseName: 'Triceps Dips', sets: 3, reps: 12, notes: 'Full range' },
    ],
    createdBy: 'user1',
  },
  {
    id: '2',
    name: 'Pull Day',
    date: '2025-05-02T10:00:00.000Z',
    exercises: [
      { exerciseName: 'Pull Ups', sets: 4, reps: 6, notes: '' },
      { exerciseName: 'Barbell Row', sets: 3, reps: 10, notes: 'Keep back straight' },
      { exerciseName: 'Bicep Curls', sets: 3, reps: 15, notes: '' },
    ],
    createdBy: 'user1',
  },
  {
    id: '3',
    name: 'Leg Day',
    date: '2025-05-03T10:00:00.000Z',
    exercises: [
      { exerciseName: 'Squats', sets: 4, reps: 8, notes: 'Go deep' },
      { exerciseName: 'Leg Press', sets: 3, reps: 12, notes: '' },
      { exerciseName: 'Calf Raises', sets: 4, reps: 20, notes: '' },
    ],
    createdBy: 'user1',
  },
  {
    id: '4',
    name: 'Core & Cardio',
    date: '2025-05-04T10:00:00.000Z',
    exercises: [
      { exerciseName: 'Plank', sets: 3, reps: 1, notes: '60 seconds each' },
      { exerciseName: 'Russian Twists', sets: 3, reps: 20, notes: '' },
      { exerciseName: 'Treadmill', sets: 1, reps: 20, notes: '20 min run' },
    ],
    createdBy: 'user1',
  },
  {
    id: '5',
    name: 'Full Body',
    date: '2025-05-05T10:00:00.000Z',
    exercises: [
      { exerciseName: 'Deadlift', sets: 4, reps: 6, notes: '' },
      { exerciseName: 'Push Ups', sets: 3, reps: 20, notes: '' },
      { exerciseName: 'Burpees', sets: 3, reps: 15, notes: '' },
    ],
    createdBy: 'user1',
  },
];

export async function getWorkoutById(id: string): Promise<Workout | null> {
  // In a real app, this would fetch from a database
  // For now, we'll simulate fetching from a data source
  try {
    // Example implementation
    // const workout = await db.workouts.findUnique({ where: { id } });
    // return workout;

    // Simulated data for demonstration
    return dummyData.find(workout => workout.id === id) as Workout;
  } catch (error) {
    console.error('Error fetching workout:', error);
    return null;
  }
}
