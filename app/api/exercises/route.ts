import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db.config';
import ExerciseService from '@/lib/services/ExerciseService';
import { handleError } from '@/lib/utils/error-handler';
import exerciseService from '@/lib/services/ExerciseService';
import { Exercise } from '@/lib/models/exercises.model';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const limit = parseInt(searchParams.get('limit') || '10', 10);
  // Optional filters
  const difficulty = searchParams.get('difficulty');
  const muscleGroup = searchParams.get('muscleGroup');

  const filter: any = {};
  if (difficulty) filter.difficulty = difficulty;
  if (muscleGroup) filter.muscleGroups = muscleGroup;

  try {
    const result = await exerciseService.findPaginated(filter, { page, limit });
    return NextResponse.json(result);
  } catch (error) {
    console.error('[GET /api/exercises]', error);
    return NextResponse.json({ error: 'Failed to fetch exercises' }, { status: 500 });
  }
}
// export async function GET(request: NextRequest) {
//   await dbConnect();
//
//   try {
//     const { searchParams } = new URL(request.url);
//     const muscleGroup = searchParams.get('muscleGroup');
//     const difficulty = searchParams.get('difficulty');
//     const equipment = searchParams.get('equipment');
//
//     let exercises;
//
//     if (muscleGroup) {
//       exercises = await ExerciseService.findByMuscleGroup(muscleGroup);
//     } else if (difficulty) {
//       exercises = await ExerciseService.findByDifficulty(difficulty);
//     } else if (equipment) {
//       exercises = await ExerciseService.findByEquipment(equipment);
//     } else {
//       exercises = await ExerciseService.findAll();
//     }
//
//     return NextResponse.json(exercises);
//   } catch (error) {
//     return handleError(error, request);
//   }
// }

export async function POST(request: NextRequest) {
  await dbConnect();
  
  try {
    const body: Exercise = await request.json();
    const newExercise = await exerciseService.create(body);
    return NextResponse.json(newExercise, { status: 201 });
  } catch (error) {
    return handleError(error, request);
  }
}
