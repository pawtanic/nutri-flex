import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  // check for the session cookies
  const payloadToken = request.cookies.get('payload-token');

  if (request.nextUrl.pathname.startsWith('/api')
    || request.nextUrl.pathname.startsWith('/admin')
    || request.nextUrl.pathname.startsWith('/auth')
  ) {
    return NextResponse.next();
  }

  if (!payloadToken) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  // redirect to /home if the user tries to access the root URL
  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/home',
  ]
}
