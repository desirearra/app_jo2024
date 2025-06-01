import { z } from 'zod';

/**
 * Zod schema for user update (PUT /api/users/:id)
 * Only firstName and lastName are allowed, both optional
 */
export const updateUserSchema = z.object({
  firstName: z.string().min(1, 'First name is required').optional(),
  lastName: z.string().min(1, 'Last name is required').optional(),
  isDeleted: z.boolean().optional(),
});
