import { Router } from 'express';
import {
  createEvent,
  deleteEvent,
  getAllEvents,
  getEventById,
  updateEvent,
} from '../controllers/events.controller';
import requireAuth from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

/**
 * @route POST /api/events
 * @desc Create a new event
 * @access Admin only
 */
router.post('/', requireAuth, requireRole(['ADMIN']), createEvent);

/**
 * @route GET /api/events/:id
 * @desc Get event by ID
 * @param id Event ID (string)
 * @access Public
 */
router.get('/:id', getEventById);

/**
 * @route GET /api/events
 * @desc List all events
 * @access Public
 */
router.get('/', getAllEvents);

/**
 * @route PUT /api/events/:id
 * @desc Update an event
 * @access Admin only
 * @param id Event ID (string)
 */
router.put('/:id', requireAuth, requireRole(['ADMIN']), updateEvent);

/**
 * @route DELETE /api/events/:id
 * @desc Delete an event
 * @param id Event ID (string)
 * @access Admin only
 */
router.delete('/:id', requireAuth, requireRole(['ADMIN']), deleteEvent);

export default router;
