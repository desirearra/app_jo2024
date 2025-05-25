import { z } from 'zod';

/**
 * Zod schema for creating an offer
 */
export const createOfferSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().min(1, 'Description is required'),
  price: z.string().regex(/^\d+(\.\d{1,2})?$/, 'Invalid price format'),
  type: z.enum(['SOLO', 'DUO', 'FAMILY']),
  seats: z.number().int().min(1, 'Seats must be at least 1'),
  eventId: z.string().uuid().optional(),
});

/**
 * Zod schema for updating an offer (all fields optional)
 */
export const updateOfferSchema = createOfferSchema.partial();
