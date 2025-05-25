import { NextFunction, Response } from 'express';
import { AuthenticatedRequest } from './requireAuth';

/**
 * Middleware to restrict access by user role
 * @param allowedRoles Array of allowed roles (e.g. ['ADMIN'])
 * Usage: app.get('/admin', requireAuth, requireRole(['ADMIN']), ...)
 */
export function requireRole(allowedRoles: string[]) {
  return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status(403).json({ error: 'Forbidden: insufficient permissions' });
    }
    return next();
  };
}
