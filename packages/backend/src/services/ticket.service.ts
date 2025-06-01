import { Ticket as PrismaTicket } from '@prisma/client';
import crypto from 'crypto';
import type { Ticket } from '../types/models/ticket';
import { prisma } from '../utils/prisma';

/**
 * Generate the final key (finalKey) for a ticket
 * @param key1 User key1
 * @param key2 Order key2
 * @returns string finalKey (hashed)
 */
export function generateFinalKey(key1: string, key2: string): string {
  // Secure: hash the concatenation with SHA-256
  return crypto.createHash('sha256').update(`${key1}:${key2}`).digest('hex');
}

/**
 * Create a new ticket in the database
 * Automatically generates the finalKey from user key1 and order key2
 * @param data - Ticket creation data (userId, orderId, status, isDeleted)
 * @returns Promise<Ticket> - The created ticket
 */
export const createTicket = async (data: {
  userId: string;
  offerId: string;
  orderId: string;
  orderItemId: string;
  places: number;
  status: 'ACTIVE' | 'USED' | 'CANCELLED';
  isDeleted: boolean;
}): Promise<Ticket> => {
  // Retrieve user key1
  const user = await prisma.user.findUnique({ where: { id: data.userId } });
  if (!user || !user.key1) throw new Error('User or key1 not found');
  // Retrieve order and key2
  const order = await prisma.order.findUnique({ where: { id: data.orderId } });
  if (!order || !order.key2) throw new Error('Order or key2 not found');
  // Generate finalKey
  const finalKey = generateFinalKey(user.key1, order.key2);
  // Create the ticket (link to offer via order)
  const ticket = await prisma.ticket.create({
    data: {
      userId: data.userId,
      offerId: data.offerId,
      orderItemId: data.orderItemId,
      places: data.places,
      finalKey,
      status: data.status,
      isDeleted: data.isDeleted,
    },
  });
  return toTicket(ticket);
};

/**
 * Get all non-deleted tickets
 * @returns Promise<Ticket[]> - List of tickets
 */
export const getAllTickets = async (): Promise<Ticket[]> => {
  const tickets = await prisma.ticket.findMany({ where: { isDeleted: false } });
  return tickets.map(toTicket);
};

/**
 * Get a ticket by its id (if not deleted)
 * @param id - Ticket UUID
 * @returns Promise<Ticket | null> - The ticket or null if not found
 */
export const getTicketById = async (id: string): Promise<Ticket | null> => {
  const ticket = await prisma.ticket.findUnique({ where: { id } });
  return ticket && !ticket.isDeleted ? toTicket(ticket) : null;
};

/**
 * Update a ticket by id
 * @param id - Ticket UUID
 * @param data - Partial ticket update data
 * @returns Promise<Ticket | null> - The updated ticket or null if not found
 */
export const updateTicket = async (
  id: string,
  data: Partial<Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>>
): Promise<Ticket | null> => {
  // Check if ticket exists
  const existing = await prisma.ticket.findUnique({ where: { id } });
  if (!existing) return null;
  const ticket = await prisma.ticket.update({ where: { id }, data });
  return ticket ? toTicket(ticket) : null;
};

/**
 * Soft delete a ticket (set isDeleted=true)
 * @param id - Ticket UUID
 * @returns Promise<Ticket | null> - The deleted ticket or null if not found
 */
export const deleteTicket = async (id: string): Promise<Ticket | null> => {
  const ticket = await prisma.ticket.update({ where: { id }, data: { isDeleted: true } });
  return ticket ? toTicket(ticket) : null;
};

/**
 * Convert a Prisma ticket to the Ticket type
 * @param t - Prisma ticket object
 * @returns Ticket - Normalized ticket object
 */
function toTicket(t: PrismaTicket): Ticket {
  return {
    id: t.id,
    userId: t.userId,
    offerId: t.offerId,
    finalKey: t.finalKey,
    status: t.status,
    createdAt: t.createdAt.toISOString(),
    updatedAt: t.updatedAt.toISOString(),
    isDeleted: t.isDeleted,
  };
}
