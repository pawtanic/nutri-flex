import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db.config';
import FileService from '@/lib/services/FileService';

export async function POST(request: NextRequest) {
  await dbConnect();

  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const entityType = formData.get('entityType') as string;
    const entityId = formData.get('entityId') as string;
    const description = formData.get('description') as string | undefined;

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Entity type and entity ID are required' }, { status: 400 });
    }

    // Convert File to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const uploadedFile = await FileService.uploadFile(
      {
        originalname: file.name,
        mimetype: file.type,
        buffer,
        size: file.size,
      },
      {
        entityType,
        entityId,
        description,
      }
    );

    return NextResponse.json(uploadedFile, { status: 201 });
  } catch (error) {
    console.error('Error uploading file:', error);
    return NextResponse.json({ error: 'Error uploading file' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const entityType = searchParams.get('entityType');
    const entityId = searchParams.get('entityId');

    if (!entityType || !entityId) {
      return NextResponse.json({ error: 'Entity type and entity ID are required' }, { status: 400 });
    }

    const files = await FileService.findByEntity(entityType, entityId);
    return NextResponse.json(files);
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Error fetching files' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();

  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'File ID is required' }, { status: 400 });
    }

    const deletedFile = await FileService.deleteFile(id);
    return NextResponse.json(deletedFile);
  } catch (error) {
    console.error('Error deleting file:', error);
    return NextResponse.json({ error: 'Error deleting file' }, { status: 500 });
  }
}
