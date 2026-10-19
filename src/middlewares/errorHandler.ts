import type { ErrorRequestHandler } from 'express';

const UNIQUE_VIOLATION = '23505';
const INVALID_DATA_CODES = new Set(['23502', '23514', '22007', '22008', '22P02']);

interface DbError {
  code?: string;
  column?: string;
  constraint?: string;
}

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const { code, column, constraint } = error as DbError;

  if (error.code === UNIQUE_VIOLATION) {
    res.status(409).json({ message: 'Employee with this email already exists' });
    return;
  }

  if (code && INVALID_DATA_CODES.has(code)) {
    res.status(400).json({ message: 'Invalid data', column, constraint });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ message: 'Invalid JSON in request body' });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};
