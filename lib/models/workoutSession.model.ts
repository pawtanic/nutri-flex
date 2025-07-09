import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import type { Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { schemaOptions } from '@/lib/models/utils.model';
import type { User } from '@/lib/models/user.model';
import type { Workout } from '@/lib/models/workouts.model';
import type { Exercise } from '@/lib/models/exercises.model';

@modelOptions(schemaOptions)
export class SessionSet {
  @prop()
  reps?: number;

  @prop()
  weight?: number;

  @prop()
  rest?: number; // seconds

  @prop()
  tempo?: string; // e.g., '2-1-2'

  @prop()
  completed?: boolean;
}

@modelOptions({ schemaOptions: { _id: false } })
export class SessionExercise {
  @prop({ ref: 'Exercise', required: true })
  exercise!: Ref<Exercise>;

  @prop()
  order?: number;

  @prop({ type: () => [SessionSet], default: [] })
  sets!: SessionSet[];

  @prop()
  notes?: string;

  @prop()
  supersetGroup?: string;
}

@modelOptions(schemaOptions)
export class WorkoutSession {
  @prop({ ref: 'User', required: true })
  user!: Ref<User>;

  @prop({ ref: 'Workout' })
  workout?: Ref<Workout>;

  @prop({ required: true })
  date!: Date;

  @prop()
  duration?: number; // minutes

  @prop()
  notes?: string;

  @prop()
  location?: string;

  @prop({
    type: () => Object,
    default: undefined,
  })
  context?: {
    mood?: string;
    sleepQuality?: number;
    weather?: string;
  };

  @prop({ enum: ['planned', 'in-progress', 'completed', 'skipped'], default: 'completed' })
  status?: 'planned' | 'in-progress' | 'completed' | 'skipped';

  @prop()
  type?: string; // e.g., 'strength', 'cardio'

  @prop()
  source?: string; // e.g., 'template', 'imported', 'ad-hoc'

  @prop({ type: [String], default: [] })
  comments?: string[];

  @prop({ type: () => [SessionExercise], default: [] })
  sessionExercises!: SessionExercise[];

  @prop()
  intensity?: number; // RPE 1-10

  @prop()
  caloriesBurned?: number;

  @prop({ default: true })
  completed?: boolean;
}

export const WorkoutSessionModel =
  mongoose.models.WorkoutSession || getModelForClass(WorkoutSession);

// For backward compatibility
export interface IWorkoutSession extends WorkoutSession {} 