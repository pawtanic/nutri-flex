import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db.config';
import Task from '@/lib/models/Task';

await dbConnect();

export async function GET() {
  try {
    const tasks = await Task.find();
    return NextResponse.json({ data: tasks });
  } catch (error) {
    console.error("Error retrieving tasks:", error);
    return NextResponse.json({ error: "Failed to retrieve tasks" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { title, description } = await request.json();
    const task = await Task.create({ title, description });
    return NextResponse.json({ message: "Task Created", data: task }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to create task" }, { status: 500 });
  }
}
