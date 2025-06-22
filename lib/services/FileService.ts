import { ClientSession } from 'mongoose';
import { CrudService } from './CrudService';
import { File, FileModel, FileType, IFile } from '../models/file.model';
import dbConnect from '@/lib/config/db.config';
import fs from 'fs';
import path from 'path';
import { promisify } from 'util';
import { v4 as uuidv4 } from 'uuid';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);
const unlink = promisify(fs.unlink);

export interface FileUploadOptions {
  entityType: string;
  entityId: string;
  description?: string;
}

export class FileService extends CrudService<File, IFile> {
  private uploadDir: string;

  constructor() {
    super(FileModel);
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

  private getFileType(mimetype: string): FileType {
    if (mimetype.startsWith('image/')) return FileType.IMAGE;
    if (mimetype.startsWith('video/')) return FileType.VIDEO;
    if (mimetype.startsWith('audio/')) return FileType.AUDIO;
    if (mimetype.startsWith('application/pdf') || 
        mimetype.startsWith('application/msword') || 
        mimetype.startsWith('application/vnd.openxmlformats-officedocument.wordprocessingml.document') ||
        mimetype.startsWith('text/')) return FileType.DOCUMENT;
    return FileType.OTHER;
  }

  async uploadFile(
    file: {
      originalname: string;
      mimetype: string;
      buffer: Buffer;
      size: number;
    },
    options: FileUploadOptions,
    session?: ClientSession
  ): Promise<IFile> {
    // Generate a unique filename
    const fileExtension = path.extname(file.originalname);
    const filename = `${uuidv4()}${fileExtension}`;
    const relativePath = path.join('uploads', filename);
    const fullPath = path.join(this.uploadDir, filename);

    // Write the file to disk
    await writeFile(fullPath, file.buffer);

    // Create a file record in the database
    const fileData: Partial<IFile> = {
      filename,
      originalFilename: file.originalname,
      mimetype: file.mimetype,
      size: file.size,
      path: relativePath,
      type: this.getFileType(file.mimetype),
      entityType: options.entityType,
      entityId: options.entityId,
      description: options.description,
    };

    return this.create(fileData, session);
  }

  async deleteFile(id: string, session?: ClientSession): Promise<IFile> {
    const file = await this.findById(id);
    const fullPath = path.join(process.cwd(), 'public', file.path);

    try {
      await unlink(fullPath);
    } catch (error) {
      console.error(`Error deleting file ${fullPath}:`, error);
      // Continue with deletion from database even if file doesn't exist
    }

    return super.delete(id, session);
  }

  async findByEntity(entityType: string, entityId: string): Promise<IFile[]> {
    return this.findAll({ entityType, entityId });
  }
}

export default new FileService();
