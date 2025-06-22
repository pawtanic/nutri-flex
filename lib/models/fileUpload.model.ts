import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { schemaOptions } from '@/lib/models/utils.model';

@modelOptions(schemaOptions)
export class FileUpload {
  @prop({ required: true })
  originalName!: string;

  @prop({ required: true })
  filename!: string;

  @prop({ required: true })
  path!: string;

  @prop({ required: true })
  url!: string;

  @prop({ required: true })
  mimetype!: string;

  @prop({ required: true })
  extension!: string;

  @prop({ required: true })
  size!: number;

  @prop({ required: false })
  uploadedAt?: Date;
}

export const FileUploadModel = mongoose.models.FileUpload || getModelForClass(FileUpload);
