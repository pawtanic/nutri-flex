import dbConnect from '@/lib/config/db.config';
import { NextRequest, NextResponse } from 'next/server';
import { WorkoutService } from '@/lib/services/WorkoutService';
import { Workout, WorkoutModel } from '@/lib/models/workouts.model';
import { Types } from 'mongoose';
import { Ref } from '@typegoose/typegoose';
import { ExerciseModel } from '@/lib/models/exercises.model';

const workoutService = new WorkoutService();

function validateWorkoutInput(data: Partial<Workout>) {
  if (!data.name || typeof data.name !== 'string') {
    throw new Error('Workout name is required and must be a string.');
  }
  // Add more validation as needed (e.g., exercises, mediaRefs)
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '10', 10);
    const workouts = await workoutService.findPaginated({}, { page, limit });
    return NextResponse.json(workouts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body: Partial<Workout> = await request.json();
    validateWorkoutInput(body);

    if (body.mediaRefs && !Array.isArray(body.mediaRefs)) {
      throw new Error('mediaRefs must be an array of Media IDs');
    }
    if (body.mediaRefs && !body.mediaRefs.every(id => typeof id === 'string' && Types.ObjectId.isValid(id))) {
      throw new Error('All mediaRefs must be valid ObjectId strings');
    }

    // Enhanced validation and exercise resolution
    if (!Array.isArray(body.exercises) || body.exercises.length === 0) {
      throw new Error('exercises must be a non-empty array');
    }

    const resolvedExercises: { exercise: string, sets: any[], notes?: string }[] = [];
    for (const [i, ex] of body.exercises.entries()) {
      if (!ex.exercise) {
        throw new Error(`Exercise at index ${i} is missing the 'exercise' field.`);
      }
      let exerciseId = ex.exercise;
      if (!Types.ObjectId.isValid(exerciseId)) {
        // Try to resolve by name
        let found = await ExerciseModel.findOne({ name: exerciseId }).lean();
        if (!found || !found._id) {
          // Create the exercise if not found
          const created = await ExerciseModel.create({ name: exerciseId });
          exerciseId = created._id;
        } else {
          exerciseId = found._id;
        }
      }
      exerciseId = exerciseId.toString();

      if (!Array.isArray(ex.sets) || ex.sets.length === 0) {
        throw new Error(`Exercise at index ${i} must have a non-empty 'sets' array.`);
      }
      resolvedExercises.push({
        exercise: exerciseId,
        sets: ex.sets,
        notes: ex.notes,
      });
    }

    const newWorkout = await workoutService.create({ ...body, exercises: resolvedExercises });
    return NextResponse.json(newWorkout, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body: Partial<Workout> = await request.json();
    // Use 'id' instead of '_id' for update
    const id = (body as any).id || (body as any)._id;
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('A valid workout id is required for update.');
    }
    validateWorkoutInput(body);
    if (body.mediaRefs && !Array.isArray(body.mediaRefs)) {
      throw new Error('mediaRefs must be an array of Media IDs');
    }
    if (body.mediaRefs && !body.mediaRefs.every(id => typeof id === 'string' && Types.ObjectId.isValid(id))) {
      throw new Error('All mediaRefs must be valid ObjectId strings');
    }
    const updatedWorkout = await workoutService.update(id, body);
    return NextResponse.json(updatedWorkout);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id || !Types.ObjectId.isValid(id)) {
      throw new Error('A valid workout id is required for deletion.');
    }
    const deletedWorkout = await workoutService.delete(id);
    return NextResponse.json(deletedWorkout);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }
}
