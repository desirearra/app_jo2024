import { Request, Response } from 'express';
import * as ordersService from '../services/orders.service';

// POST /api/orders
// Crée une nouvelle commande
// Args: req.body: { userId: string, offerId: string, totalAmount: number }
// Returns: 201 + commande créée
export const createOrder = async (req: Request, res: Response): Promise<void> => {
  const { userId, offerId, totalAmount } = req.body;
  const order = await ordersService.createOrder({ userId, offerId, totalAmount });
  // Format totalAmount to always have 2 decimals as string
  const formattedOrder = {
    ...order,
    totalAmount: Number(order.totalAmount).toFixed(2),
  };
  res.status(201).json(formattedOrder);
};

/**
 * GET /api/orders/:id
 * Récupère une commande par son ID
 * Args: req.params.id
 * Returns: 200 + commande | 404
 */
export const getOrderById = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await ordersService.getOrderById(id);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  const formattedOrder = {
    ...order,
    totalAmount: Number(order.totalAmount).toFixed(2),
  };
  res.status(200).json(formattedOrder);
};

/**
 * GET /api/orders
 * Liste toutes les commandes
 * @param req Express Request
 * @param res Express Response
 * @returns 200 + array d'orders
 */
export const getAllOrders = async (_req: Request, res: Response): Promise<void> => {
  const orders = await ordersService.getAllOrders();
  res.status(200).json(
    orders.map(order => ({
      ...order,
      totalAmount: Number(order.totalAmount).toFixed(2),
    }))
  );
};

/**
 * PUT /api/orders/:id
 * Met à jour une commande
 * @param req Express Request
 * @param res Express Response
 * @returns 200 + order | 404
 */
export const updateOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const order = await ordersService.updateOrder(id, req.body);
  if (!order) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.status(200).json({
    ...order,
    totalAmount: Number(order.totalAmount).toFixed(2),
  });
};

/**
 * DELETE /api/orders/:id
 * Supprime une commande
 * @param req Express Request
 * @param res Express Response
 * @returns 204 | 404
 */
export const deleteOrder = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const deleted = await ordersService.deleteOrder(id);
  if (!deleted) {
    res.status(404).json({ error: 'Order not found' });
    return;
  }
  res.status(204).send();
};
