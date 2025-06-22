import dbConnect from '@/lib/config/db.config';
import { NextRequest, NextResponse } from 'next/server';
import { WorkoutService } from '@/lib/services/WorkoutService';
import { Workout } from '@/lib/models/workouts.model';

const workoutService = new WorkoutService();

export async function GET() {
  const workouts = await workoutService.findPaginated();
  return NextResponse.json(workouts);
}

export async function POST(request: NextRequest) {
  const body: Workout = await request.json();

  const newWorkout = await workoutService.create(body);
  return NextResponse.json(newWorkout, { status: 201 });
}
