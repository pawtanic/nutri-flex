import dbConnect from '@/lib/config/db.config';
import { NextRequest, NextResponse } from 'next/server';
import { WorkoutService } from '@/lib/services/WorkoutService';

const workoutService = new WorkoutService();

export async function GET() {
  await dbConnect();
  const workouts = await workoutService.findAll();
  return NextResponse.json(workouts);
}

export async function POST(request: NextRequest) {
  await dbConnect();
  const body = await request.json();

  const { name, date, exercises } = body;

  if (!name || !date) {
    return NextResponse.json({ error: 'Name and date are required' }, { status: 400 });
  }

  const newWorkout = await workoutService.create({ name, date, exercises });
  return NextResponse.json(newWorkout, { status: 201 });
}
