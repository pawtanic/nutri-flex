import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/config/db.config';
import Task from '@/lib/models/Task';

await dbConnect();

export async function GET(request, { params }) {
  const {id} = params;
  try {
    const task = await Task.findById(id);
    if (!task) {
      return NextResponse.json({
        message: 'Task not found',
        id,
      }, {
        status: 404,
      })
    }
    return NextResponse.json({data: task, message: `Task with id ${id} fetched`, id});
  } catch(error) {
    console.error('Error retrieving task:', error);
    return NextResponse.json({message: `Error retrieving task with id: ${id}`, error}, {status: 500});
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get('id');
    const result = await Task.findByIdAndDelete(id);
    if (!result) {
      return NextResponse.json({ message: 'Task not found' }, { status: 404 });
    }
    return NextResponse.json({ message: `Task deleted with id=${id} deleted`, id }, { status: 200 });
  } catch (error) {
    console.error('Error deleting task:', error);
    return NextResponse.json({ error: 'Failed to delete task' }, { status: 500 });
  }
}

export async function PUT(request, { params }) {
  try {
    const { id } = params;
    const { newTitle: title, newDescription: description } = await request.json();
    await Task.findByIdAndUpdate(id, { title, description }, { new: true });
    return NextResponse.json({ message: `Task with id=${id} updated successfully`, id: id }, { status: 200 });
  } catch (error) {
    console.error("Error updating task:", error);
    return NextResponse.json({ error: "Failed to update task" }, { status: 500 });
  }
}
