import { PrismaClient } from '@prisma/client';
import { Response } from 'express';
import { z } from 'zod';
import { AuthenticatedRequest } from '../middlewares/requireAuth';
import { updateUserSchema } from '../types/schemas/user';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Controller to get the authenticated user's profile
 * @route GET /api/users/me
 * @access Authenticated user
 * @param req AuthenticatedRequest (with req.user)
 * @param res Express Response
 * @returns 200 + user | 401 | 404 | 500
 */
export async function getMe(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const user = await prisma.user.findUnique({
      where: { id: req.user.userId },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, key1: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    logger.error('getMe error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Controller to list all users (admin only)
 * @route GET /api/users
 * @access Admin only
 * @param _req AuthenticatedRequest (must be admin)
 * @param res Express Response
 * @returns 200 + users[] | 500
 */
export async function listUsers(_req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    const users = await prisma.user.findMany({
      select: { id: true, email: true, firstName: true, lastName: true, role: true, key1: true },
    });
    return res.status(200).json(users);
  } catch (err) {
    logger.error('listUsers error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Controller to get a user by ID
 * @route GET /api/users/:id
 * @access Admin or self
 * @param req AuthenticatedRequest (with req.user)
 * @param res Express Response
 * @returns 200 + user | 401 | 403 | 404 | 500
 */
export async function getUserById(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    // Only admin or self can access
    if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, email: true, firstName: true, lastName: true, role: true, key1: true },
    });
    if (!user) return res.status(404).json({ error: 'User not found' });
    return res.status(200).json(user);
  } catch (err) {
    logger.error('getUserById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Controller to update a user (admin or self)
 * @route PUT /api/users/:id
 * @access Admin or self
 * @param req AuthenticatedRequest (with req.user, req.validated)
 * @param res Express Response
 * @returns 200 + user | 401 | 403 | 500
 */
export async function updateUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    const { id } = req.params;
    // Only admin or self can update
    if (req.user.role !== 'ADMIN' && req.user.userId !== id) {
      return res.status(403).json({ error: 'Forbidden' });
    }
    // Use validated data from Zod (type-safe)
    type ReqWithValidated = AuthenticatedRequest & { validated: z.infer<typeof updateUserSchema> };
    const data = (req as ReqWithValidated).validated;
    const user = await prisma.user.update({
      where: { id },
      data,
      select: { id: true, email: true, firstName: true, lastName: true, role: true, key1: true },
    });
    return res.status(200).json(user);
  } catch (err) {
    logger.error('updateUser error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Controller to delete a user (admin only)
 * @route DELETE /api/users/:id
 * @access Admin only
 * @param req AuthenticatedRequest (with req.user)
 * @param res Express Response
 * @returns 204 | 401 | 403 | 404 | 500
 */
export async function deleteUser(req: AuthenticatedRequest, res: Response): Promise<Response> {
  try {
    if (!req.user) return res.status(401).json({ error: 'Unauthorized' });
    if (req.user.role !== 'ADMIN') return res.status(403).json({ error: 'Forbidden' });
    const { id } = req.params;
    const user = await prisma.user.findUnique({ where: { id } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    await prisma.user.delete({ where: { id } });
    return res.status(204).send();
  } catch (err) {
    logger.error('deleteUser error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
