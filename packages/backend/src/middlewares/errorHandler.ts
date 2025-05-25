import { NextFunction, Request, Response } from 'express';
import { logger } from '../utils/logger';

/**
 * Centralized error handler middleware
 * Logs the error and returns a formatted JSON response
 */
export function errorHandler(err: Error, _req: Request, res: Response, _next: NextFunction): void {
  logger.error('Unhandled error:', err);
  res.status(500).json({
    status: 'error',
    message: 'Internal server error',
    // Optionally add stack trace in development
    stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
  });
}
