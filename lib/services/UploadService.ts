import { FileUploadModel } from '@/lib/models/fileUpload.model';
import path from 'path';
import fs from 'fs/promises';
import { v4 as uuidv4 } from 'uuid';

export class UploadService {
  /**
   * Uploads a file to the server and saves metadata to MongoDB.
   * @param file - The file object (expects { buffer, originalname, mimetype, size })
   * @param relativeDir - The relative directory path to save the file
   */
  async uploadFile(file: { buffer: Buffer; originalname: string; mimetype: string; size: number }, relativeDir: string) {
    const ext = path.extname(file.originalname);
    const filename = uuidv4() + ext;
    const saveDir = path.join(process.cwd(), 'public', 'media', relativeDir);
    const savePath = path.join(saveDir, filename);
    const url = path.posix.join('/', relativeDir.replace(/\\/g, '/'), filename);

    // Ensure directory exists
    await fs.mkdir(saveDir, { recursive: true });
    // Write file to disk
    await fs.writeFile(savePath, file.buffer);

    // Save metadata to DB
    const fileDoc = await FileUploadModel.create({
      originalName: file.originalname,
      filename,
      path: savePath,
      url,
      mimetype: file.mimetype,
      extension: ext.replace('.', ''),
      size: file.size,
      uploadedAt: new Date(),
    });

    return {
      url,
      filename,
      mimetype: file.mimetype,
      extension: ext.replace('.', ''),
      size: file.size,
      _id: fileDoc._id,
    };
  }
}

const uploadService = new UploadService();
export default uploadService;
