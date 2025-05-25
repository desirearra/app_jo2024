import { PrismaClient, Ticket as PrismaTicket } from '@prisma/client';
import type { Ticket } from '../types/models/ticket';

const prisma = new PrismaClient();

/**
 * Create a new ticket in the database
 * @param data - Ticket creation data (userId, offerId, finalKey, status, isDeleted)
 * @returns Promise<Ticket> - The created ticket
 */
export const createTicket = async (
  data: Omit<Ticket, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Ticket> => {
  const ticket = await prisma.ticket.create({ data });
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
  const ticket = await prisma.ticket.findUnique({ where: { id, isDeleted: false } });
  return ticket ? toTicket(ticket) : null;
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
