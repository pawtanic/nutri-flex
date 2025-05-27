import { NextRequest, NextResponse } from 'next/server'
import AuthService from '@/lib/services/AuthService';
import { handleError } from '@/lib/utils/error-handler'
import { BadRequestError } from '@/lib/errors/http-errors';

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json()
    if (!email || !password) throw new BadRequestError('Email and password required')

    const user = await AuthService.register({ email, password, name })
    return NextResponse.json({ user }, { status: 201 })
  } catch (err) {
    return handleError(err, req)
  }
}
