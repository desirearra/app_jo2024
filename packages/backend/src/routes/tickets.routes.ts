import { Router } from 'express';
import {
  createTicketFileController,
  deleteTicketFileController,
  getAllTicketsFileController,
  getTicketByIdFileController,
  updateTicketFileController,
} from '../controllers/tickets.controller';
import requireAuth from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

/**
 * @route POST /api/tickets
 * @desc Create a new ticket
 * @access Admin only
 */
router.post('/', requireAuth, requireRole(['ADMIN']), createTicketFileController);

/**
 * @route GET /api/tickets
 * @desc List all tickets
 * @access Admin only
 */
router.get('/', requireAuth, requireRole(['ADMIN']), getAllTicketsFileController);

/**
 * @route GET /api/tickets/:id
 * @desc Get a ticket by id
 * @access Admin only
 */
router.get('/:id', requireAuth, requireRole(['ADMIN']), getTicketByIdFileController);

/**
 * @route PUT /api/tickets/:id
 * @desc Update a ticket
 * @access Admin only
 */
router.put('/:id', requireAuth, requireRole(['ADMIN']), updateTicketFileController);

/**
 * @route DELETE /api/tickets/:id
 * @desc Soft delete a ticket
 * @access Admin only
 */
router.delete('/:id', requireAuth, requireRole(['ADMIN']), deleteTicketFileController);

export default router;
