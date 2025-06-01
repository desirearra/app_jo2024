import { Request, Response } from 'express';
import * as ordersService from '../services/orders.service';
import { orderCreateSchema } from '../types/schemas/order';
import { logger } from '../utils/logger';

/**
 * Create a new order
 * @route POST /api/orders
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 201 + Order | 400 | 500
 */
export const createOrder = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const parsed = orderCreateSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Validation error', details: parsed.error.errors });
    }
    const { userId, items } = parsed.data;
    const order = await ordersService.createOrder({ userId, items });
    // Format totalAmount to always have 2 decimals as string
    const formattedOrder = {
      ...order,
      totalAmount: Number(order.totalAmount).toFixed(2),
    };
    return res.status(201).json(formattedOrder);
  } catch (err) {
    logger.error('createOrder error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get an order by ID
 * @route GET /api/orders/:id
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 200 + Order | 404 | 500
 */
export const getOrderById = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const order = await ordersService.getOrderById(id);
    if (!order) return res.status(404).json({ error: 'Order not found' });
    const formattedOrder = {
      ...order,
      totalAmount: Number(order.totalAmount).toFixed(2),
    };
    return res.status(200).json(formattedOrder);
  } catch (err) {
    logger.error('getOrderById error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * List all orders
 * @route GET /api/orders
 * @access Admin only
 * @param _req Express Request
 * @param res Express Response
 * @returns 200 + Order[] | 500
 */
export const getAllOrders = async (_req: Request, res: Response): Promise<Response | void> => {
  try {
    const orders = await ordersService.getAllOrders();
    return res.status(200).json(
      orders.map(order => ({
        ...order,
        totalAmount: Number(order.totalAmount).toFixed(2),
      }))
    );
  } catch (err) {
    logger.error('getAllOrders error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Delete an order by ID
 * @route DELETE /api/orders/:id
 * @access Admin only
 * @param req Express Request
 * @param res Express Response
 * @returns 204 | 404 | 500
 */
export const deleteOrder = async (req: Request, res: Response): Promise<Response | void> => {
  try {
    const { id } = req.params;
    const deleted = await ordersService.deleteOrder(id);
    if (!deleted) return res.status(404).json({ error: 'Order not found' });
    return res.status(204).send();
  } catch (err) {
    logger.error('deleteOrder error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
