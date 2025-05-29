import { ClientSession, Types, UpdateQuery } from 'mongoose';
import { CrudService } from './CrudService'
import { Workout, IWorkoutDoc, IWorkout } from '../models/Workouts'
import { ExerciseService } from './ExerciseService'

export class WorkoutService extends CrudService<IWorkoutDoc, IWorkout> {
  private exerciseService = new ExerciseService()

  constructor() {
    // Populate exercises when querying workouts
    super(Workout, { populate: 'exercises' })
  }

  // Override create to validate exercises exist before creating workout
  async create(data: Partial<IWorkout>): Promise<IWorkout> {
    if (data.exercises?.length) {
      // Validate all exercise IDs are valid and exist
      await this.validateExerciseIds(data.exercises)
    }
    return super.create(data)
  }

  async update(
    id: string,
    update: UpdateQuery<IWorkoutDoc>,  // exact type as base
    session?: ClientSession
  ): Promise<IWorkout> {
    if (update.exercises && Array.isArray(update.exercises) && update.exercises.length) {
      await this.validateExerciseIds(update.exercises as Types.ObjectId[]);
    }

    const updated = await super.update(id, update, session);

    if (!updated) {
      throw new Error(`Workout with id ${id} not found`);
    }

    return updated;
  }

  // Validate all exercise IDs exist in DB
  private async validateExerciseIds(exerciseIds: Types.ObjectId[] | string[]): Promise<void> {
    const validIds = exerciseIds.filter(id => Types.ObjectId.isValid(id))
    if (validIds.length !== exerciseIds.length) {
      throw new Error('One or more exercise IDs are invalid.')
    }
    const foundExercises = await this.exerciseService.findAll({
      _id: { $in: validIds }
    })
    if (foundExercises.length !== validIds.length) {
      throw new Error('One or more exercises not found.')
    }
  }
}
