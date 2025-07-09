import { CrudService } from './CrudService';
import { WorkoutSession, WorkoutSessionModel } from '../models/workoutSession.model';
import MediaService from './MediaService';
import { z } from 'zod';

const workoutSessionSchema = z.object({
  user: z.any(), // Should be a valid user ref
  date: z.date(),
  // Add more validation as needed
});

export class WorkoutSessionService extends CrudService<typeof WorkoutSessionModel, WorkoutSession> {
  constructor(userContext?: { id: string }) {
    super(WorkoutSessionModel, {
      mediaFields: [], // Add media fields if you link media to sessions
      validator: workoutSessionSchema,
      mediaService: MediaService,
      userContext,
      softDelete: true,
    });
  }
}

const workoutSessionService = new WorkoutSessionService();
export default workoutSessionService; 