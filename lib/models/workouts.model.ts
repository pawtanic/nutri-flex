import { prop, getModelForClass, modelOptions, Severity, Ref } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { WorkoutExercise } from '@/lib/models/workoutExercises.model';
import { schemaOptions } from '@/lib/models/utils.model';
import type { Media } from '@/lib/models/fileUpload.model';

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

  @prop({ type: [String], default: [] })
  tags?: string[];

  @prop({ type: String, enum: ['public', 'private'], default: 'private' })
  visibility?: 'public' | 'private';

  @prop({ default: 1 })
  version?: number;

  @prop({ ref: 'Media', default: [] })
  mediaRefs?: Ref<Media>[];

  public readonly _id!: string;
}

export const WorkoutModel = mongoose.models.Workout || getModelForClass(Workout);
