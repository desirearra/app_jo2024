import { Router } from 'express';
import {
  createOrder,
  deleteOrder,
  getAllOrders,
  getOrderById,
} from '../controllers/orders.controller';
import requireAuth from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

const router = Router();

/**
 * @route POST /api/orders
 * @desc Create a new order
 * @access Admin only
 */
router.post('/', requireAuth, requireRole(['ADMIN', 'USER']), createOrder);

/**
 * @route GET /api/orders/:id
 * @desc Get order by ID
 * @param id Order ID (string)
 * @access Public
 */
router.get('/:id', getOrderById);

/**
 * @route GET /api/orders
 * @desc List all orders
 * @access Public
 */
router.get('/', getAllOrders);

/**
 * @route DELETE /api/orders/:id
 * @desc Delete an order
 * @param id Order ID (string)
 * @access Admin only
 */
router.delete('/:id', requireAuth, requireRole(['ADMIN']), deleteOrder);

export default router;
