import { CrudService, NotFoundError } from './CrudService';
import { Workout, WorkoutModel } from '../models/workouts.model';
import { WorkoutExercise, WorkoutExerciseModel } from '@/lib/models/workoutExercises.model';
import { ExerciseService } from '@/lib/services/ExerciseService';

export class WorkoutService extends CrudService<typeof WorkoutModel, Workout> {
  exerciseService: ExerciseService = new ExerciseService();

  constructor() {
    // Populate exercises when querying workouts
    super(WorkoutModel, { populate: ['exercises', 'exercises.exercise'] });
  }

  // Override create to validate exercises exist before creating workout
  async create(data: Partial<Workout>): Promise<Workout> {
    return super.create(data);
  }

  async addExercise(id: string, data: WorkoutExercise): Promise<Workout> {
    const workout = await this.findById(id);
    if (!workout) {
      throw new NotFoundError(`Workout with id ${id} not found`);
    }
    console.log('Workout', data);
    // const workoutExercise = await WorkoutExerciseModel.create(data);
    console.log(workout.exercises);
    console.log(data);

    return await this.update(id, {
      exercises: [...workout.exercises, data],
    });
  }
}

const workoutService = new WorkoutService();
export default workoutService;
