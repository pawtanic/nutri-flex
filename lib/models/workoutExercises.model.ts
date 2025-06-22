import { Exercise, ExerciseSet } from '@/lib/models/exercises.model';
import { getModelForClass, modelOptions, prop } from '@typegoose/typegoose';
import * as typegoose from "@typegoose/typegoose";
import mongoose from 'mongoose';

@modelOptions({
  schemaOptions: {
    _id: false,
  },
})
export class WorkoutExercise {
  @prop({ ref: () => Exercise, required: [true, 'Exercise reference is required'] })
  exercise!: typegoose.Ref<Exercise>;

  @prop({ type: () => [ExerciseSet], default: [] })
  sets!: ExerciseSet[];

  @prop({ trim: true })
  notes?: string;
}

export const WorkoutExerciseModel = mongoose.models.WorkoutExercise || getModelForClass(WorkoutExercise);

// For backward compatibility
export interface IWorkoutExercise extends WorkoutExercise {}
