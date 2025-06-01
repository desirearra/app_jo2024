import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import { Request, Response } from 'express';
import {
  createTicket,
  deleteTicket,
  getAllTickets,
  getTicketById,
  updateTicket,
} from '../services/ticket.service';
import { ticketCreateSchema, ticketUpdateSchema } from '../types/schemas/ticket';
import { logger } from '../utils/logger';

const prisma = new PrismaClient();

/**
 * Create a new ticket (admin only)
 * @route POST /api/tickets
 * @access Admin (bearer token)
 * @body TicketCreate
 * @returns 201 Ticket | 400 Invalid data | 403 Forbidden
 */
export const createTicketController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const parsed = ticketCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation error', details: parsed.error.errors });
    }
    const { userId, orderId, status, isDeleted } = parsed.data;
    // Récupérer le premier orderItem lié à la commande (orderId)
    const orderItem = await prisma.orderItem.findFirst({ where: { orderId } });
    if (!orderItem) return res.status(400).json({ error: 'OrderItem not found for this orderId' });
    // Récupérer l'offre liée à l'orderItem
    const offer = await prisma.offer.findUnique({ where: { id: orderItem.offerId } });
    if (!offer) return res.status(400).json({ error: 'Offer not found for this orderItem' });
    const ticket = await createTicket({
      userId,
      offerId: offer.id,
      orderId,
      orderItemId: orderItem.id,
      places: offer.places,
      status: status ?? 'ACTIVE',
      isDeleted: isDeleted ?? false,
    });
    return res.status(201).json(ticket);
  } catch (error) {
    logger.error('Create ticket error', error);
    return res.status(400).json({ error: 'Invalid ticket data' });
  }
};

/**
 * List all tickets (admin only)
 * @route GET /api/tickets
 * @access Admin (bearer token)
 * @returns 200 Ticket[] | 403 Forbidden
 */
export const getAllTicketsController = async (_req: Request, res: Response): Promise<Response> => {
  try {
    const tickets = await getAllTickets();
    return res.json(tickets);
  } catch (error) {
    logger.error('Get all tickets error', error);
    return res.status(500).json({ error: 'Failed to fetch tickets' });
  }
};

/**
 * Get a ticket by id (admin only)
 * @route GET /api/tickets/:id
 * @access Admin (bearer token)
 * @returns 200 Ticket | 404 Not found | 403 Forbidden
 */
export const getTicketByIdController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticket = await getTicketById(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    return res.json(ticket);
  } catch (error) {
    logger.error('Get ticket by id error', error);
    return res.status(500).json({ error: 'Failed to fetch ticket' });
  }
};

/**
 * Update a ticket (admin only)
 * @route PUT /api/tickets/:id
 * @access Admin (bearer token)
 * @body TicketUpdate
 * @returns 200 Ticket | 400 Invalid data | 404 Not found | 403 Forbidden
 */
export const updateTicketController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const parsed = ticketUpdateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation error', details: parsed.error.errors });
    }
    const ticket = await updateTicket(id, parsed.data);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    return res.json(ticket);
  } catch (error) {
    logger.error('Update ticket error', error);
    return res.status(400).json({ error: 'Invalid ticket update data' });
  }
};

/**
 * Soft delete a ticket (admin only)
 * @route DELETE /api/tickets/:id
 * @access Admin (bearer token)
 * @returns 200 Success | 404 Not found | 403 Forbidden
 */
export const deleteTicketController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const ticket = await deleteTicket(id);
    if (!ticket) return res.status(404).json({ error: 'Ticket not found' });
    return res.json({ success: true });
  } catch (error) {
    logger.error('Delete ticket error', error);
    return res.status(500).json({ error: 'Failed to delete ticket' });
  }
};

/**
 * Vérifie un ticket à partir de sa finalKey
 * @route POST /api/tickets/verify
 * @access Admin (bearer token)
 * @body { finalKey: string }
 * @returns 200 Ticket | 404 Not found | 400 Invalid | 403 Forbidden
 */
export const verifyTicketController = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { finalKey } = req.body;
    if (!finalKey || typeof finalKey !== 'string') {
      return res.status(400).json({ error: 'finalKey is required' });
    }
    // Recherche du ticket par finalKey (non supprimé)
    const ticket = await prisma.ticket.findFirst({ where: { finalKey, isDeleted: false } });
    if (!ticket) return res.status(404).json({ error: 'Ticket not found or invalid finalKey' });

    // Récupère l'orderItem et tous ses tickets (pour retrouver l'index)
    const orderItem = await prisma.orderItem.findUnique({
      where: { id: ticket.orderItemId },
      include: { tickets: { orderBy: { createdAt: 'asc' } } },
    });
    if (!orderItem) return res.status(404).json({ error: 'OrderItem not found' });

    // Trouve l'index du ticket dans l'orderItem (par ordre de création)
    const idx = orderItem.tickets.findIndex(t => t.id === ticket.id);
    if (idx === -1) return res.status(400).json({ error: 'Ticket index not found in orderItem' });

    // Récupère la commande et l'utilisateur
    const order = await prisma.order.findUnique({
      where: { id: orderItem.orderId },
      include: { user: true },
    });
    if (!order || !order.key2 || !order.user)
      return res.status(404).json({ error: 'Order, user or key2 not found' });
    const user = order.user;
    const offer = await prisma.offer.findUnique({
      where: { id: ticket.offerId },
      include: { event: true },
    });
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    const eventName = offer.event?.name || null;
    const ticketType = offer.type;
    const ticketPlaces = offer.places;

    // Recalcule la finalKey attendue
    const recomposedKey = `${user.key1}:${order.key2}:${orderItem.id}:${idx}`;
    const expectedFinalKey = crypto.createHash('sha256').update(recomposedKey).digest('hex');

    // Vérifie la correspondance
    if (expectedFinalKey !== finalKey) {
      return res.status(400).json({ error: 'Invalid finalKey (cryptographic check failed)' });
    }

    // Succès : retourne les infos du ticket (hors données sensibles)
    return res.json({
      id: ticket.id,
      userId: ticket.userId,
      userFirstName: user.firstName,
      userLastName: user.lastName,
      offerId: ticket.offerId,
      orderItemId: ticket.orderItemId,
      orderId: order.id,
      orderDate: order.createdAt,
      eventName,
      ticketType,
      ticketPlaces,
      status: ticket.status,
      createdAt: ticket.createdAt,
      updatedAt: ticket.updatedAt,
      places: ticket.places,
      isDeleted: ticket.isDeleted,
      valid: true,
      idx,
    });
  } catch (error) {
    logger.error('Verify ticket error', error);
    return res.status(500).json({ error: 'Failed to verify ticket' });
  }
};
