import { Router } from 'express';
import {
  deleteUser,
  getMe,
  getUserById,
  listUsers,
  updateUser,
} from '../controllers/users.controller';
import requireAuth from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';
import { validateRequest } from '../middlewares/validateRequest';
import { updateUserSchema } from '../types/schemas/user';

const router = Router();

/**
 * @route GET /api/users/me
 * @desc Returns the authenticated user's profile
 * @access Authenticated user only
 */
router.get('/me', requireAuth, getMe);

/**
 * @route GET /api/users
 * @desc Returns the list of all users
 * @access Admin only
 */
router.get('/', requireAuth, requireRole(['ADMIN']), listUsers);

/**
 * @route GET /api/users/:id
 * @desc Returns a user by ID
 * @access Admin or self
 * @param id User ID (string)
 */
router.get('/:id', requireAuth, getUserById);

/**
 * @route PUT /api/users/:id
 * @desc Updates a user (firstName, lastName)
 * @access Admin or self
 * @param id User ID (string)
 * @body updateUserSchema
 */
router.put('/:id', requireAuth, validateRequest(updateUserSchema), updateUser);

/**
 * @route DELETE /api/users/:id
 * @desc Deletes a user
 * @access Admin only
 * @param id User ID (string)
 */
router.delete('/:id', requireAuth, requireRole(['ADMIN']), deleteUser);

export default router;
