import { Schema, model, models, Types, Document } from 'mongoose';
import { IExercise } from '@/lib/models/Exercises';

export interface IWorkout {
  _id: Types.ObjectId;
  name: string;
  date: Date;
  exercises: Types.ObjectId[] | IExercise[];
  createdAt: Date;
  updatedAt: Date;
}

export interface IWorkoutDoc extends Document<Types.ObjectId>, Omit<IWorkout, '_id'> {}

export interface NewWorkout {
  name: string;
  date: Date;
  exercises?: Types.ObjectId[];
}

export interface UpdateWorkout {
  name?: string;
  date?: Date;
  exercises?: Types.ObjectId[];
}

const WorkoutSchema = new Schema<IWorkoutDoc>(
  {
    name: { type: String, required: true },
    date: { type: Date, required: true },
    exercises: [{ type: Types.ObjectId, ref: 'Exercise' }],
  },
  {
    timestamps: true,
    toJSON: {
      virtuals: true,
      transform: (_, ret) => {
        ret.id = ret._id.toString(); // expose id string
        delete ret._id;
        delete ret.__v;
      },
    },
    toObject: { virtuals: true },
  }
);

export const Workout = models.Workout || model<IWorkoutDoc>('Workout', WorkoutSchema);
