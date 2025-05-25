/**
 * Ticket type (corresponds to the Prisma Ticket model)
 * Represents a digital ticket linked to a user and an offer.
 * Used for QR code validation and event access.
 */
export type Ticket = {
  /** Unique ticket identifier (UUID) */
  id: string;
  /** User ID (owner, UUID) */
  userId: string;
  /** Offer ID (linked offer, UUID) */
  offerId: string;
  /** QR code value (finalKey, unique) */
  finalKey: string;
  /** Ticket status (ACTIVE, USED, CANCELLED) */
  status: 'ACTIVE' | 'USED' | 'CANCELLED';
  /** Ticket creation date (ISO 8601) */
  createdAt: string;
  /** Ticket last update date (ISO 8601) */
  updatedAt: string;
  /** Soft delete flag (true if deleted) */
  isDeleted: boolean;
};
