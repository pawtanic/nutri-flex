import * as typegoose from '@typegoose/typegoose';
import mongoose, { Types } from 'mongoose';
import { schemaOptions } from '@/lib/models/utils.model';

export enum MuscleGroup {
  Chest = 'chest',
  Back = 'back',
  Shoulders = 'shoulders',
  Arms = 'arms',
  Legs = 'legs',
  Core = 'core',
  FullBody = 'fullBody',
}

export enum DifficultyLevel {
  Beginner = 'beginner',
  Intermediate = 'intermediate',
  Advanced = 'advanced',
}

export enum EquipmentType {
  None = 'none',
  Dumbbells = 'dumbbells',
  Barbell = 'barbell',
  Kettlebell = 'kettlebell',
  ResistanceBands = 'resistanceBands',
  Machine = 'machine',
  Bodyweight = 'bodyweight',
}

export class ExerciseSet {
  @typegoose.prop({ min: [1, 'Reps must be at least 1'] })
  reps?: number;

  @typegoose.prop({ min: [0, 'Weight cannot be negative'] })
  weight?: number;
}

@typegoose.modelOptions(schemaOptions)
export class Exercise {
  @typegoose.prop({ required: [true, 'Exercise name is required'], trim: true })
  name!: string;

  @typegoose.prop({ type: () => [ExerciseSet], default: [] })
  sets!: ExerciseSet[];

  @typegoose.prop({ trim: true })
  description?: string;

  @typegoose.prop({ trim: true })
  instructions?: string;

  @typegoose.prop({ trim: true })
  image?: string;

  @typegoose.prop({ type: String, enum: MuscleGroup })
  muscleGroups?: MuscleGroup[];

  @typegoose.prop({ type: String, enum: DifficultyLevel })
  difficulty?: DifficultyLevel;

  @typegoose.prop({ type: String, enum: EquipmentType })
  equipment?: EquipmentType[];
}

export const ExerciseModel = mongoose.models.Exercise || typegoose.getModelForClass(Exercise);

// For backward compatibility
export interface IExercise extends Exercise {}
