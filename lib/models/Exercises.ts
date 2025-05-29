import { Schema, model, models, Document } from 'mongoose';

// Enums
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

// Interfaces
export interface ExerciseSet {
  reps?: number;
  weight?: number;
}

export interface IExercise {
  id: string;
  name: string;
  sets: ExerciseSet[];
  description?: string;
  instructions?: string; // Rich text stored as HTML or Markdown
  muscleGroups?: MuscleGroup[];
  difficulty?: DifficultyLevel;
  equipment?: EquipmentType[];
  createdAt: Date;
  updatedAt: Date;
}

// Document interface to extend mongoose.Document for typing
export interface IExerciseDoc extends IExercise, Document {}

// Schema
const ExerciseSchema = new Schema<IExerciseDoc>(
  {
    name: { type: String, required: true },
    sets: [
      {
        reps: { type: Number, min: 1, max: 100 },
        weight: { type: Number, min: 0 },
      },
    ],
    description: { type: String, required: false },
    instructions: { type: String, required: false }, // HTML or Markdown
    muscleGroups: {
      type: [String],
      enum: Object.values(MuscleGroup),
      required: false,
    },
    difficulty: {
      type: String,
      enum: Object.values(DifficultyLevel),
      required: false,
    },
    equipment: {
      type: [String],
      enum: Object.values(EquipmentType),
      required: false,
    },
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString();
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

export const Exercise =
  models.Exercise || model<IExerciseDoc>('Exercise', ExerciseSchema);
