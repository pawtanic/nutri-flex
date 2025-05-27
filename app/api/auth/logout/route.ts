import { NextRequest, NextResponse } from 'next/server'

// This is a simple placeholder — NextAuth signout is normally client-side

export async function POST(req: NextRequest) {
  // Optionally clear cookies manually here or redirect to /api/auth/signout
  return NextResponse.json({ message: 'Logout handled client-side via NextAuth signout' }, { status: 200 })
}
