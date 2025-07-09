import { ClientSession } from 'mongoose';
import { CrudService } from './CrudService';
import { Media, MediaModel, MediaType, IMedia } from '../models/fileUpload.model';
import dbConnect from '@/lib/config/db.config';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export interface MediaUploadOptions {
  entityType?: string;
  entityId?: string;
  description?: string;
}

export class MediaService extends CrudService<Media, IMedia> {
  private uploadDir: string;

  constructor() {
    super(MediaModel);
    dbConnect();
    this.uploadDir = path.join(process.cwd(), 'public', 'uploads');
    this.ensureUploadDirExists();
  }

  private async ensureUploadDirExists() {
    try {
      await mkdir(this.uploadDir, { recursive: true });
    } catch (error) {
      console.error('Error creating upload directory:', error);
    }
  }

  private getMediaType(mimetype: string): MediaType {
    if (mimetype.startsWith('image/')) return MediaType.IMAGE;
    if (mimetype.startsWith('video/')) return MediaType.VIDEO;
    if (mimetype.startsWith('audio/')) return MediaType.AUDIO;
    if (mimetype.startsWith('application/pdf') || 
        mimetype.startsWith('application/msword') || 
        mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
        mimetype.startsWith('text/')) return MediaType.DOCUMENT;
    return MediaType.OTHER;
  }

  async uploadMedia(
    file: {
      originalname: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    },
    options: MediaUploadOptions = {},
    session?: ClientSession
  ): Promise<IMedia> {
    // Generate a unique filename
    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const relativePath = path.join('uploads', filename);
    const fullPath = path.join(this.uploadDir, filename);

    // Write the file to disk
    await writeFile(fullPath, file.buffer);

    // Create a media record in the database
    const mediaData: Partial<IMedia> = {
      filename,
      originalName: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: relativePath,
      url: `/uploads/${filename}`,
      type: this.getMediaType(file.mimetype),
      extension: fileExtension.replace('.', ''),
      description: options.description,
      entityType: options.entityType,
      entityId: options.entityId,
      uploadedAt: new Date(),
    };

    return this.create(mediaData);
  }

  async deleteMedia(id: string, session?: ClientSession): Promise<IMedia> {
    const media = await this.findById(id);
    const fullPath = path.join(process.cwd(), 'public', media.path);

    try {
      await unlink(fullPath);
    } catch (error) {
      console.error(`Error deleting file ${fullPath}:`, error);
      // Continue with deletion from database even if file doesn't exist
    }

    return super.delete(id);
  }

  async findByEntity(entityType: string, entityId: string): Promise<IMedia[]> {
    return this.findAll({ entityType, entityId });
  }
}

export default new MediaService();
