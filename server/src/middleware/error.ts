import mongoose from 'mongoose';
import type { NextFunction, Request, Response } from 'express';
import { ZodError } from 'zod';

export function notFound(_req: Request, res: Response): void {
  res.status(404).json({ error: 'Not found' });
}

export function errorHandler(error: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (error instanceof ZodError) {
    res.status(400).json({
      error: 'Validation failed',
      issues: error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof mongoose.Error.CastError) {
    res.status(400).json({ error: 'Invalid identifier' });
    return;
  }

  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: 'Validation failed', issues: Object.values(error.errors).map((e) => e.message) });
    return;
  }

  const status = typeof (error as { status?: unknown }).status === 'number' ? (error as { status: number }).status : 500;
  const message = error instanceof Error ? error.message : 'Unexpected error';

  if (status >= 500) {
    console.error('[api] unhandled error:', message);
  }

  res.status(status).json({ error: status >= 500 ? 'Something went wrong' : message });
}

export function httpError(status: number, message: string): Error & { status: number } {
  const error = new Error(message) as Error & { status: number };
  error.status = status;
  return error;
}
