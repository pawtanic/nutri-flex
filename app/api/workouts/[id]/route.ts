import { NextRequest, NextResponse } from 'next/server';
import { Types } from 'mongoose';
import { WorkoutService } from '@/lib/services/WorkoutService';
import dbConnect from '@/lib/config/db.config';

const workoutService = new WorkoutService();

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid workout id' }, { status: 400 });
  }

  const workout = await workoutService.findById(id);
  if (!workout) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }
  return NextResponse.json(workout);
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid workout id' }, { status: 400 });
  }

  const updateData = await request.json();
  if (!updateData || Object.keys(updateData).length === 0) {
    return NextResponse.json({ error: 'Update data is required' }, { status: 400 });
  }

  try {
    const updated = await workoutService.update(id, updateData);
    if (!updated) {
      return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
    }
    return NextResponse.json(updated);
  } catch (e: any) {
    if (e.message.includes('not found')) {
      return NextResponse.json({ error: e.message }, { status: 404 });
    }
    throw e;
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  await dbConnect();
  const { id } = params;

  if (!Types.ObjectId.isValid(id)) {
    return NextResponse.json({ error: 'Invalid workout id' }, { status: 400 });
  }

  const deleted = await workoutService.delete(id);
  if (!deleted) {
    return NextResponse.json({ error: 'Workout not found' }, { status: 404 });
  }
  return NextResponse.json({ message: 'Workout deleted' });
}
