/**
 * Event type (corresponds to the Prisma Event model)
 * Represents a sport event with offers.
 */
export type Event = {
  /** Unique event identifier (UUID) */
  id: string;
  /** Event name */
  name: string;
  /** Event description */
  description: string;
  /** Sport type */
  sport: string;
  /** Event location */
  location: string;
  /** Event date (ISO 8601) */
  date: string;
  /** Event image (optional) */
  image?: string | null;
  /** Event creation date (ISO 8601) */
  createdAt: string;
  /** Event last update date (ISO 8601) */
  updatedAt: string;
  /** Soft delete flag */
  isDeleted: boolean;
};
