import type { ErrorRequestHandler } from 'express';

export const errorHandler: ErrorRequestHandler = (error, _req, res, _next) => {
  const code: string = error.code ?? '';

  if (code === '23505') {
    res.status(409).json({ message: 'Employee with this email already exists' });
    return;
  }

  if (code.startsWith('22') || code.startsWith('23')) {
    res.status(400).json({
      message: 'Invalid data',
      column: error.column,
      constraint: error.constraint,
    });
    return;
  }

  if (error instanceof SyntaxError && 'body' in error) {
    res.status(400).json({ message: 'Invalid JSON in request body' });
    return;
  }

  console.error(error);
  res.status(500).json({ message: 'Internal server error' });
};
