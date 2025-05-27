import { Request, Response } from 'express';
import * as eventsService from '../services/events.service';

/**
 * Crée un nouvel event
 * @route POST /api/events
 * @access Admin only
 */
export const createEvent = async (req: Request, res: Response): Promise<void> => {
  const event = await eventsService.createEvent(req.body);
  res.status(201).json(event);
};

/**
 * Récupère un event par son ID
 * @route GET /api/events/:id
 * @access Public
 */
export const getEventById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const event = await eventsService.getEventById(id);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.status(200).json(event);
};

/**
 * Liste tous les events
 * @route GET /api/events
 * @access Public
 */
export const getAllEvents = async (_req: Request, res: Response): Promise<void> => {
  const events = await eventsService.getAllEvents();
  res.status(200).json(events);
};

/**
 * Met à jour un event
 * @route PUT /api/events/:id
 * @access Admin only
 */
export const updateEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const event = await eventsService.updateEvent(id, req.body);
  if (!event) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.status(200).json(event);
};

/**
 * Supprime un event
 * @route DELETE /api/events/:id
 * @access Admin only
 */
export const deleteEvent = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const deleted = await eventsService.deleteEvent(id);
  if (!deleted) {
    res.status(404).json({ error: 'Event not found' });
    return;
  }
  res.status(204).send();
};
