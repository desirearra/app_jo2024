import { NextFunction, Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config';
import { JwtUser } from '../types/models/user';

// Extend Express Request type to include user
export interface AuthenticatedRequest extends Request {
  user?: JwtUser;
}

/**
 * Middleware to protect routes with JWT authentication
 * - Checks Authorization header
 * - Verifies JWT
 * - Sets req.user if valid
 * - Returns 401 if missing/invalid
 */
const requireAuth = (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Response | void => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Missing or invalid Authorization header' });
  }
  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, config.jwt.secret);
    // Validate JwtUser structure
    type Decoded = { userId?: unknown; email?: unknown; role?: unknown };
    const d = decoded as Decoded;
    if (
      typeof decoded === 'object' &&
      decoded !== null &&
      typeof d.userId === 'string' &&
      typeof d.email === 'string' &&
      typeof d.role === 'string' &&
      (['USER', 'ADMIN'] as string[]).includes(d.role)
    ) {
      req.user = { userId: d.userId, email: d.email, role: d.role } as JwtUser;
      return next();
    } else {
      return res.status(401).json({ error: 'Invalid token payload' });
    }
  } catch (err) {
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};

export default requireAuth;
