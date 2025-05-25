// app/api/auth/me/route.ts
import { getUser } from '@/lib/hooks/auth/getUser';
import { NextResponse } from 'next/server'

export async function GET() {
  const { user } = await getUser()
  return NextResponse.json({ user }, { status: user ? 200 : 401 })
}
