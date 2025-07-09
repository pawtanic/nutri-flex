import { CrudService } from './CrudService';
import { Exercise, ExerciseModel } from '../models/exercises.model';
import MediaService from './MediaService';
import { z } from 'zod';

const exerciseSchema = z.object({
  name: z.string().min(1),
  // Add more validation as needed
});

export class ExerciseService extends CrudService<typeof ExerciseModel, Exercise> {
  constructor(userContext?: { id: string }) {
    super(ExerciseModel, {
      mediaFields: ['mediaRefs'],
      validator: exerciseSchema,
      mediaService: MediaService,
      userContext,
      softDelete: true,
    });
  }
}

export default new ExerciseService();
