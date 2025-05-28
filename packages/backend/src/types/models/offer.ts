/**
 * Offer type for business logic and API
 * Matches the Prisma Offer model
 */
export type Offer = {
  id: string;
  name: string;
  description: string;
  price: string; // Decimal as string for serialization
  type: 'SOLO' | 'DUO' | 'FAMILY';
  seats: number;
  isActive: boolean;
  eventId?: string | null;
  createdAt: string;
  updatedAt: string;
  isDeleted: boolean;
};
