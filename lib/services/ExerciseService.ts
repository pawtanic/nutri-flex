import { Types } from 'mongoose'
import { CrudService } from './CrudService' // adjust import path
import { Exercise, IExerciseDoc, IExercise } from '../models/Exercises' // adjust import path

export class ExerciseService extends CrudService<IExerciseDoc, IExercise> {
  constructor() {
    super(Exercise)
  }

  // Example validation: ensure sets array has valid entries before create/update
  private validateSets(sets?: IExercise['sets']): IExercise['sets'] | undefined {
    if (!sets) return undefined
    return sets.filter(set =>
      typeof set.reps === 'number' && set.reps > 0 &&
      typeof set.weight === 'number' && set.weight >= 0
    )
  }

  async create(data: Partial<IExercise>): Promise<IExercise> {
    if (data.sets) {
      data.sets = this.validateSets(data.sets)
    }
    return super.create(data)
  }

  async update(id: string, update: Partial<IExercise>): Promise<IExercise> {
    if (update.sets) {
      update.sets = this.validateSets(update.sets)
    }
    return super.update(id, update)
  }

  // Add more domain-specific logic here if needed (e.g., filtering by muscle groups, difficulty)
}
