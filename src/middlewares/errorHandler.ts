import type { ErrorRequestHandler } from 'express';
import { DatabaseError } from 'pg';
import { ZodError } from 'zod';
import { HttpError } from '../errors/HttpError';

const PG_UNIQUE_VIOLATION = '23505';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  if (error instanceof ZodError) {
    res.status(400).json({
      message: 'Validation failed',
      errors: error.issues.map((issue) => ({
        field: issue.path.map(String).join('.'),
        message: issue.message,
      })),
    });
    return;
  }

  if (error instanceof HttpError) {
    res.status(error.status).json({ message: error.message });
    return;
  }

  if (
    error instanceof DatabaseError &&
    error.code === PG_UNIQUE_VIOLATION &&
    error.constraint === 'employees_email_unique_idx'
  ) {
    res.status(409).json({ message: 'Employee with this email already exists' });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ message: 'Invalid JSON in request body' });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};
