import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db.config';
import ExerciseService from '@/lib/services/ExerciseService';
import { handleError } from '@/lib/utils/error-handler';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  
  try {
    const exercise = await ExerciseService.findById(params.id);
    return NextResponse.json(exercise);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  
  try {
    const body = await request.json();
    
    const { name, description, instructions, muscleGroups, difficulty, equipment, sets } = body;
    
    const updatedExercise = await ExerciseService.update(params.id, {
      name,
      description,
      instructions,
      muscleGroups,
      difficulty,
      equipment,
      sets,
    });
    
    return NextResponse.json(updatedExercise);
  } catch (error) {
    return handleError(error, request);
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  await dbConnect();
  
  try {
    const deletedExercise = await ExerciseService.delete(params.id);
    return NextResponse.json(deletedExercise);
  } catch (error) {
    return handleError(error, request);
  }
}
