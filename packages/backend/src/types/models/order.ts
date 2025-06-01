import type { Ticket } from './ticket';

/**
 * OrderItem type (corresponds to the Prisma OrderItem model)
 */
export type OrderItem = {
  id: string;
  offerId: string;
  orderId: string;
  quantity: number;
  unitPrice: string;
  tickets: Ticket[];
};

/**
 * Order type (corresponds to the Prisma Order model)
 * Represents a purchase made by a user for one or more offers.
 */
export type Order = {
  /** Unique order identifier (UUID) */
  id: string;
  /** User ID (UUID) */
  userId: string;
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
  /** Order creation date (ISO 8601 string) */
  createdAt: string;
  /** Order last update date (ISO 8601 string) */
  updatedAt: string;
  /** Soft delete flag */
  isDeleted: boolean;
  /** List of items in the order */
  orderItems: OrderItem[];
};
