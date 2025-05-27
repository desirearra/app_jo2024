import { Router } from 'express';
import {
  createOfferController,
  deleteOfferController,
  getAllOffersController,
  getOfferByIdController,
  updateOfferController,
} from '../controllers/offers.controller';
import requireAuth from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

/**
 * @route POST /api/offers
 * @desc Create a new offer
 * @access Admin only
 * @body OfferCreateSchema
 */
router.post('/', requireAuth, requireRole(['ADMIN']), createOfferController);

/**
 * @route GET /api/offers
 * @desc List all offers
 * @access Public
 */
router.get('/', getAllOffersController);

/**
 * @route GET /api/offers/:id
 * @desc Get offer by ID
 * @access Public
 * @param id Offer ID (string)
 */
router.get('/:id', getOfferByIdController);

/**
 * @route PUT /api/offers/:id
 * @desc Update an offer
 * @access Admin only
 * @param id Offer ID (string)
 * @body OfferUpdateSchema
 */
router.put('/:id', requireAuth, requireRole(['ADMIN']), updateOfferController);

/**
 * @route DELETE /api/offers/:id
 * @desc Soft delete an offer
 * @access Admin only
 * @param id Offer ID (string)
 */
router.delete('/:id', requireAuth, requireRole(['ADMIN']), deleteOfferController);

export default router;
