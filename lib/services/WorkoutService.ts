import { CrudService, NotFoundError } from './CrudService';
import { Workout, WorkoutModel } from '../models/workouts.model';
import { WorkoutExercise } from '@/lib/models/workoutExercises.model';
import MediaService from './MediaService';
import { z } from 'zod';

const workoutSchema = z.object({
  name: z.string().min(1),
  // Add more validation as needed
});

export class WorkoutService extends CrudService<typeof WorkoutModel, Workout> {
  constructor(userContext?: { id: string }) {
    super(WorkoutModel, {
      populate: ['exercises', 'exercises.exercise', 'mediaRefs'],
      mediaFields: ['mediaRefs'],
      validator: workoutSchema,
      mediaService: MediaService,
      userContext,
      softDelete: true,
      hooks: {
        afterCreate: (doc) => { /* custom logic */ },
      },
    });
  }

  // Custom business logic for adding an exercise to a workout
  async addExercise(id: string, data: WorkoutExercise): Promise<Workout> {
    const workout = await this.findById(id);
    if (!workout) {
      throw new NotFoundError(`Workout with id ${id} not found`);
    }
    return await this.update(id, {
      exercises: [...workout.exercises, data],
    });
  }
}

const workoutService = new WorkoutService();
export default workoutService;
