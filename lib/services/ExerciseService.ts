import { ClientSession } from 'mongoose';
import { CrudService } from './CrudService';
import { Exercise, ExerciseModel, IExercise } from '../models/exercises.model';
import dbConnect from '@/lib/config/db.config';

export class ExerciseService extends CrudService<typeof ExerciseModel, Exercise> {
  constructor() {
    super(ExerciseModel);
    dbConnect();
  }

  // async findByMuscleGroup(muscleGroup: string, session?: ClientSession): Promise<IExercise[]> {
  //   return this.findAll({ muscleGroups: muscleGroup }, session);
  // }
  //
  // async findByDifficulty(difficulty: string, session?: ClientSession): Promise<IExercise[]> {
  //   return this.findAll({ difficulty }, session);
  // }
  //
  // async findByEquipment(equipment: string, session?: ClientSession): Promise<IExercise[]> {
  //   return this.findAll({ equipment }, session);
  // }
}

export default new ExerciseService();
