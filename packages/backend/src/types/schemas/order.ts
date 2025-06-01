import { z } from 'zod';

/**
 * Zod schema for creating an order (POST /orders)
 * Fields: userId, items: [{ offerId, quantity }]
 */
export const orderCreateSchema = z.object({
  userId: z.string().uuid(),
  items: z
    .array(
      z.object({
        offerId: z.string().uuid(),
        quantity: z.number().int().positive(),
      })
    )
    .min(1),
});
