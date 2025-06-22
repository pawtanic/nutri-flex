import { NextRequest, NextResponse } from 'next/server';
import workoutService from '@/lib/services/WorkoutService';
import { WorkoutExercise } from '@/lib/models/workoutExercises.model';

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body: WorkoutExercise = await request.json();

    const newWorkout = await workoutService.addExercise(id, body);
    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error });
  }
}
