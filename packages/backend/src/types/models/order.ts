/**
 * Order type (corresponds to the Prisma Order model)
 * Represents a purchase made by a user for an offer.
 */
export type Order = {
  /** Unique order identifier (UUID) */
  id: string;
  /** User ID (UUID) */
  userId: string;
  /** Offer ID (UUID) */
  offerId: string;
  /** Order status */
  status: 'PENDING' | 'PAID' | 'CANCELLED' | 'REFUNDED';
  /** Transaction type (optional) */
  transactionType?: string | null;
  /** Transaction ID (optional) */
  transactionId?: string | null;
  /** Total amount (decimal as string) */
  totalAmount: string;
  /** Key2 for ticket security (optional) */
  key2?: string | null;
  /** Order creation date (ISO 8601) */
  createdAt: Date;
  /** Order last update date (ISO 8601) */
  updatedAt: Date;
  /** Soft delete flag */
  isDeleted: boolean;
};
