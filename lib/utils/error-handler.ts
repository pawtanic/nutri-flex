import { NextRequest, NextResponse } from 'next/server';
import { HttpError } from '@/lib/errors/http-errors';
import mongoose from 'mongoose';

type ErrorResponse = {
  type: 'ValidationError' | 'HttpError' | 'UnknownError';
  message: string;
  errors?: {
    field: string;
    message: string;
    kind?: string;
  }[];
};

export function handleError(err: unknown, req: NextRequest): NextResponse | never {
  const isAPI = req.nextUrl.pathname.startsWith('/api');
  let status = 500;

  const res: ErrorResponse = {
    type: 'UnknownError',
    message: 'Unexpected error',
  };

  // Mongoose validation error
  if (err instanceof mongoose.Error.ValidationError) {
    status = 400;
    res.type = 'ValidationError';
    res.message = 'Validation failed';
    res.errors = Object.entries(err.errors).map(([field, error]: any) => ({
      field,
      message: error.message,
      kind: error.kind,
    }));
  }

  // Custom HTTP error
  else if (err instanceof HttpError) {
    status = err.status;
    res.type = 'HttpError';
    res.message = err.message;
  }

  // Generic JS Error
  else if (err instanceof Error) {
    res.message = err.message;
  }

  if (isAPI) {
    return NextResponse.json(res, { status });
  } else {
    throw err instanceof HttpError ? err : new Error(res.message);
  }
}
