import { z } from 'zod';

/**
 * Zod schema for creating a ticket (used in POST /tickets)
 * Fields: userId, orderId, status (optional), isDeleted (optional)
 */
export const ticketCreateSchema = z.object({
  userId: z.string().uuid(),
  orderId: z.string().uuid(),
  status: z.enum(['ACTIVE', 'USED', 'CANCELLED']).optional(),
  isDeleted: z.boolean().optional(),
});

/**
 * Zod schema for updating a ticket (used in PUT /tickets/:id)
 * Fields: status (optional), isDeleted (optional)
 */
export const ticketUpdateSchema = z.object({
  status: z.enum(['ACTIVE', 'USED', 'CANCELLED']).optional(),
  isDeleted: z.boolean().optional(),
});
