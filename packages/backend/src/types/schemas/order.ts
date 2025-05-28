import { z } from 'zod';

/**
 * Zod schema for creating an order (POST /orders)
 * Fields: userId, offerId, totalAmount
 */
export const orderCreateSchema = z.object({
  userId: z.string().uuid(),
  offerId: z.string().uuid(),
  totalAmount: z.number().positive(),
});
