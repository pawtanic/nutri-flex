import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db.config';
import { Types } from 'mongoose';
import workoutService from '@/lib/services/WorkoutService';

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

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
