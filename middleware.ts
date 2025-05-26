import { withAuth } from 'next-auth/middleware'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// Define what to match — exclude /, /auth, /auth/*, /api/auth/*, static files, etc.
export const config = {
  matcher: [
    '/((?!api/auth|auth|auth/.*|_next|favicon.ico|assets|robots.txt|$).*)',
  ],
}

export default withAuth(
  function middleware(req: NextRequest) {
    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ req, token }) => {
        const isApi = req.nextUrl.pathname.startsWith('/api')
        if (token) return true

        // Return false for unauthorized — either triggers redirect or error
        return false
      },
    },
    pages: {
      signIn: '/api/auth/signin',
    },
  }
)

// Inject 403 manually for APIs
export function middleware(request: NextRequest) {
  const isApi = request.nextUrl.pathname.startsWith('/api')
  const isExcluded = /^\/($|auth(\/.*)?|api\/auth(\/.*)?)$/.test(request.nextUrl.pathname)

  if (isExcluded) return NextResponse.next()

  const sessionToken =
    request.cookies.get('next-auth.session-token') ||
    request.cookies.get('__Secure-next-auth.session-token')

  if (isApi && !sessionToken) {
    return new NextResponse(
      JSON.stringify({ error: 'Forbidden: Authentication required.' }),
      { status: 403, headers: { 'Content-Type': 'application/json' } }
    )
  }

  return NextResponse.next()
}
