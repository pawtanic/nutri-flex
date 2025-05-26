import { NextRequest, NextResponse } from 'next/server';
import userService from '@/lib/services/UserService';
import { handleError } from '@/lib/utils/error-handler';

interface Params {
  params: { id: string };
}

// GET /api/users/:id
export async function GET(req: NextRequest, { params }: Params) {
  try {
    const user = await userService.findById(params.id);
    if (!user) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(user, { status: 200 });
  } catch (err) {
    return handleError(err, req);
  }
}

// PATCH /api/users/:id
export async function PATCH(req: NextRequest, { params }: Params) {
  try {
    const body = await req.json();
    const updated = await userService.update(params.id, body);
    if (!updated) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json(updated, { status: 200 });
  } catch (err) {
    return handleError(err, req);
  }
}

// DELETE /api/users/:id
export async function DELETE(req: NextRequest, { params }: Params) {
  try {
    const deleted = await userService.delete(params.id);
    if (!deleted) return NextResponse.json({ error: 'Not found' }, { status: 404 });
    return NextResponse.json({ message: 'Deleted successfully' }, { status: 200 });
  } catch (err) {
    return handleError(err, req);
  }
}
