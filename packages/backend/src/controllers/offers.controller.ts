import { Request, Response } from 'express';
import {
  createOffer,
  deleteOffer,
  getAllOffers,
  getOfferById,
  updateOffer,
} from '../services/offer.service';
import { createOfferSchema, updateOfferSchema } from '../types/schemas/offer';
import { logger } from '../utils/logger';

/**
 * Create a new offer
 * @route POST /api/offers
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 201 + Offer | 400 | 500
 */
export async function createOfferController(req: Request, res: Response): Promise<Response> {
  try {
    const parsed = createOfferSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
    const offer = await createOffer({ ...parsed.data, isActive: true });
    return res.status(201).json(offer);
  } catch (err) {
    logger.error('createOffer error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get all offers
 * @route GET /api/offers
 * @access Public
 * @param _req Express Request
 * @param res Express Response
 * @returns 200 + Offer[] | 500
 */
export async function getAllOffersController(_req: Request, res: Response): Promise<Response> {
  try {
    const offers = await getAllOffers();
    return res.status(200).json(offers);
  } catch (err) {
    logger.error('getAllOffers error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Get an offer by ID
 * @route GET /api/offers/:id
 * @access Public
 * @param req Express Request
 * @param res Express Response
 * @returns 200 + Offer | 404 | 500
 */
export async function getOfferByIdController(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const offer = await getOfferById(id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    return res.status(200).json(offer);
  } catch (err) {
    logger.error('getOfferById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Update an offer by ID
 * @route PUT /api/offers/:id
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 200 + Offer | 400 | 404 | 500
 */
export async function updateOfferController(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const parsed = updateOfferSchema.safeParse(req.body);
    if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
    const offer = await updateOffer(id, parsed.data);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    return res.status(200).json(offer);
  } catch (err) {
    logger.error('updateOffer error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

/**
 * Soft delete an offer by ID
 * @route DELETE /api/offers/:id
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 204 | 404 | 500
 */
export async function deleteOfferController(req: Request, res: Response): Promise<Response> {
  try {
    const { id } = req.params;
    const offer = await deleteOffer(id);
    if (!offer) return res.status(404).json({ error: 'Offer not found' });
    return res.status(204).send();
  } catch (err) {
    logger.error('deleteOffer error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}
