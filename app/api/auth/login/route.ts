import { NextRequest, NextResponse } from 'next/server'
import { AuthService } from '@/lib/services/AuthService';

// NOTE: This route delegates login to NextAuth Credentials provider.
// So here we just redirect or tell client to call /api/auth/callback/credentials.
const authService = new AuthService();
export async function POST(req: NextRequest) {

  try {
    const { email, password } = await req.json();
    const user = authService.login({email, password});
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json(
      { message: 'Failed to authenticate with this email or password' },
      { status: 400 }
    )
  }
}
