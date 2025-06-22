import { prop, getModelForClass, modelOptions } from '@typegoose/typegoose';
import { schemaOptions } from '@/lib/models/utils.model';

export enum FileType {
  IMAGE = 'image',
  DOCUMENT = 'document',
  VIDEO = 'video',
  AUDIO = 'audio',
  OTHER = 'other',
}

@modelOptions(schemaOptions)
export class File {
  @prop({ required: [true, 'Filename is required'], trim: true })
  filename!: string;

  @prop({ required: [true, 'Original filename is required'], trim: true })
  originalFilename!: string;

  @prop({ required: [true, 'MIME type is required'], trim: true })
  mimetype!: string;

  @prop({ required: [true, 'File size is required'] })
  size!: number;

  @prop({ required: [true, 'File path is required'], trim: true })
  path!: string;

  @prop({ 
    type: String, 
    enum: FileType, 
    required: [true, 'File type is required'],
    default: FileType.OTHER 
  })
  type!: FileType;

  @prop({ trim: true })
  description?: string;

  @prop({ required: [true, 'Entity type is required'], trim: true })
  entityType!: string;

  @prop({ required: [true, 'Entity ID is required'] })
  entityId!: string;
}

export const FileModel = getModelForClass(File);

// For backward compatibility
export interface IFile extends File {}
