import { prop, getModelForClass, modelOptions, Severity, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { WorkoutExercise } from '@/lib/models/workoutExercises.model';
import { schemaOptions } from '@/lib/models/utils.model';

@modelOptions(schemaOptions)
export class Workout {
  @prop({ required: [true, 'Workout name is required'], trim: true })
  name!: string;

  @prop({ required: false })
  date!: Date;

  @prop({ trim: true })
  image?: string;

  @prop({ type: () => [WorkoutExercise], default: [] })
  exercises!: WorkoutExercise[];
}

export const WorkoutModel = mongoose.models.Workout || getModelForClass(Workout);
