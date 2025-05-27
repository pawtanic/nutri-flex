import { NextRequest, NextResponse } from 'next/server'

// NOTE: This route delegates login to NextAuth Credentials provider.
// So here we just redirect or tell client to call /api/auth/callback/credentials.

export async function POST(req: NextRequest) {
  return NextResponse.json(
    { message: 'Use NextAuth Credentials provider at /api/auth/callback/credentials to login' },
    { status: 400 }
  )
}
