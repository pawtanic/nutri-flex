import { NextRequest, NextResponse } from 'next/server'
import { HttpError } from '@/lib/errors/http-errors'

export function handleError(err: unknown, req: NextRequest): NextResponse | never {
  const isAPI = req.nextUrl.pathname.startsWith('/api')

  const status = err instanceof HttpError ? err.status : 500
  const message = err instanceof Error ? err.message : 'Unexpected error'

  if (isAPI) {
    return NextResponse.json({ error: message }, { status })
  } else {
    // For UI routes, you may redirect to /error or throw to let Next.js handle it
    throw err instanceof HttpError ? err : new Error(message)
  }
}
