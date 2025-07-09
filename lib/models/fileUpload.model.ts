import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import mongoose from 'mongoose';
import { schemaOptions } from '@/lib/models/utils.model';

export enum MediaType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

@modelOptions(schemaOptions)
export class Media {
  @prop({ required: true, trim: true })
  filename!: string;

  @prop({ required: true, trim: true })
  originalName!: string;

  @prop({ required: true, trim: true })
  mimetype!: string;

  @prop({ required: true })
  size!: number;

  @prop({ required: true, trim: true })
  path!: string;

  @prop({ required: true, trim: true })
  url!: string;

  @prop({ type: String, enum: MediaType, required: true, default: MediaType.OTHER })
  type!: MediaType;

  @prop({ required: true, trim: true })
  extension!: string;

  @prop({ trim: true })
  description?: string;

  @prop({ trim: true })
  entityType?: string;

  @prop()
  entityId?: string;

  @prop()
  uploadedAt?: Date;

  @prop({ type: () => Object })
  metadata?: Record<string, any>;
}

export const MediaModel = mongoose.models.Media || getModelForClass(Media);

// For backward compatibility
export interface IMedia extends Media {}
