
// GET /api/users
import { NextRequest, NextResponse } from 'next/server'
import UserService from '@/lib/services/UserService'
import { handleError } from '@/lib/utils/error-handler'
import dbConnect from '@/lib/config/db.config';
dbConnect();

export async function GET(req: NextRequest) {
  try {
    const users = await UserService.findAll()
    return NextResponse.json(users, { status: 200 })
  } catch (err) {
    return handleError(err, req)
  }
}


// POST /api/users
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const newUser = await UserService.create(body)
    return NextResponse.json(newUser, { status: 201 })
  } catch (err) {
    return handleError(err, req)
  }
}
