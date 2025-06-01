import { Request, Response } from 'express';
import * as eventsService from '../services/events.service';
import { logger } from '../utils/logger';

/**
 * Create a new event
 * @route POST /api/events
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 201 + Event | 400 | 500
 */
export const createEvent = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const event = await eventsService.createEvent(req.body);
    return res.status(201).json(event);
  } catch (error) {
    logger.error('createEvent error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get an event by ID
 * @route GET /api/events/:id
 * @access Public
 * @param req Express Request
 * @param res Express Response
 * @returns 200 + Event | 404 | 500
 */
export const getEventById = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const event = await eventsService.getEventById(id);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json(event);
  } catch (error) {
    logger.error('getEventById error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List all events
 * @route GET /api/events
 * @access Public
 * @param _req Express Request
 * @param res Express Response
 * @returns 200 + Event[] | 500
 */
export const getAllEvents = async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    const events = await eventsService.getAllEvents();
    return res.status(200).json(events);
  } catch (error) {
    logger.error('getAllEvents error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Update an event by ID
 * @route PUT /api/events/:id
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 200 + Event | 404 | 500
 */
export const updateEvent = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const event = await eventsService.updateEvent(id, req.body);
    if (!event) return res.status(404).json({ error: 'Event not found' });
    return res.status(200).json(event);
  } catch (error) {
    logger.error('updateEvent error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete an event by ID
 * @route DELETE /api/events/:id
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 204 | 404 | 500
 */
export const deleteEvent = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const deleted = await eventsService.deleteEvent(id);
    if (!deleted) return res.status(404).json({ error: 'Event not found' });
    return res.status(204).send();
  } catch (error) {
    logger.error('deleteEvent error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
