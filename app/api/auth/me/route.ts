import { NextRequest, NextResponse } from 'next/server'
import {  handleError } from '@/lib/utils/error-handler'
import AuthService from '@/lib/services/AuthService';
import { UnauthorizedError } from '@/lib/errors/http-errors';

// export async function GET(req: NextRequest) {
//   try {
//     const user = await AuthService.getCurrentUser(req)
//     if (!user) throw new UnauthorizedError('Not authenticated')
//     return NextResponse.json({ user })
//   } catch (err) {
//     return handleError(err, req)
//   }
// }

import { getServerSession } from "next-auth"
import { authConfig } from '@/lib/config/auth.config';
import { NextApiRequest, NextApiResponse } from 'next';

// FIXME: Doesn't work.
export async function GET(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authConfig)
  res.json(session)
}

