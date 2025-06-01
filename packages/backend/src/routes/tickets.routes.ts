import { Router } from 'express';
import {
  createTicketController,
  deleteTicketController,
  getAllTicketsController,
  getTicketByIdController,
  updateTicketController,
  verifyTicketController,
} from '../controllers/tickets.controller';
import requireAuth from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

/**
 * @route POST /api/tickets
 * @desc Create a new ticket
 * @access Admin only
 */
router.post('/', requireAuth, requireRole(['ADMIN']), createTicketController);

/**
 * @route GET /api/tickets
 * @desc List all tickets
 * @access Admin only
 */
router.get('/', requireAuth, requireRole(['ADMIN']), getAllTicketsController);

/**
 * @route GET /api/tickets/:id
 * @desc Get a ticket by id
 * @param id Ticket ID (string)
 * @access Admin only
 */
router.get('/:id', requireAuth, requireRole(['ADMIN']), getTicketByIdController);

/**
 * @route PUT /api/tickets/:id
 * @desc Update a ticket
 * @param id Ticket ID (string)
 * @access Admin only
 */
router.put('/:id', requireAuth, requireRole(['ADMIN']), updateTicketController);

/**
 * @route DELETE /api/tickets/:id
 * @desc Soft delete a ticket
 * @param id Ticket ID (string)
 * @access Admin only
 */
router.delete('/:id', requireAuth, requireRole(['ADMIN']), deleteTicketController);

/**
 * @route POST /api/tickets/verify
 * @desc Vérifie un ticket à partir de sa finalKey
 * @access Admin only
 */
router.post('/verify', requireAuth, requireRole(['ADMIN']), verifyTicketController);

export default router;
