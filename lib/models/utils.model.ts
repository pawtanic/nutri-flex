import { Document, Types } from 'mongoose';
import type { IModelOptions } from '@typegoose/typegoose/lib/types';
import { Severity } from '@typegoose/typegoose';

export type NewEntity<T> = Document<Types.ObjectId> & Omit<T, '_id'>;

export const schemaOptions: IModelOptions = {
  schemaOptions: {
    timestamps: true,
    toJSON: {
      virtuals: true,
      versionKey: false,
      transform: (_, ret) => {
        ret.id = ret._id?.toString();
        delete ret._id;
        return ret;
      }
    }
  },
  options: {
    allowMixed: Severity.WARN
  }
}
