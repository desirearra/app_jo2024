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

/**
 * Create a new ticket (admin only)
 * @route POST /api/tickets
 * @access Admin (bearer token)
 * @body TicketCreate
 * @returns 201 Ticket | 400 Invalid data | 403 Forbidden
 */
export const createTicketFileController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const data = ticketCreateSchema.parse(req.body);
    const ticket = await createTicket({
      ...data,
      status: data.status ?? 'ACTIVE',
      isDeleted: data.isDeleted ?? false,
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
export const getAllTicketsFileController = async (
  _req: Request,
  res: Response
): Promise<Response> => {
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
export const getTicketByIdFileController = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
export const updateTicketFileController = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const { id } = req.params;
    const data = ticketUpdateSchema.parse(req.body);
    const ticket = await updateTicket(id, data);
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
export const deleteTicketFileController = async (
  req: Request,
  res: Response
): Promise<Response> => {
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
