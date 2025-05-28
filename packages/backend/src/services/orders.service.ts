import { Order as PrismaOrder } from '@prisma/client';
import type { Order } from '../types/models/order';
import { prisma } from '../utils/prisma';

function toOrder(o: PrismaOrder): Order {
  return {
    ...o,
    totalAmount: o.totalAmount.toString(),
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
  };
}

/**
 * Crée une nouvelle commande
 * @param {Object} args
 * @param {string} args.userId
 * @param {string} args.offerId
 * @param {number} args.totalAmount
 * @returns {Promise<Order>}
 */
export const createOrder = async ({
  userId,
  offerId,
  totalAmount,
}: {
  userId: string;
  offerId: string;
  totalAmount: number;
}): Promise<Order> => {
  const order = await prisma.order.create({
    data: {
      userId,
      offerId,
      totalAmount,
    },
  });
  return toOrder(order);
};

/**
 * Récupère une commande par son ID
 * @param {string} id
 * @returns {Promise<Order | null>}
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
  const order = await prisma.order.findUnique({ where: { id } });
  return order ? toOrder(order) : null;
};

/**
 * Récupère toutes les commandes
 * @returns {Promise<Order[]>}
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const orders = await prisma.order.findMany();
  return orders.map(toOrder);
};

/**
 * Met à jour une commande
 * @param {string} id
 * @param {Partial<Order>} data
 * @returns {Promise<Order|null>}
 */
export const updateOrder = async (id: string, data: Partial<Order>): Promise<Order | null> => {
  try {
    const order = await prisma.order.update({
      where: { id },
      data,
    });
    return toOrder(order);
  } catch {
    return null;
  }
};

/**
 * Supprime une commande
 * @param {string} id
 * @returns {Promise<boolean>} true si supprimé, false sinon
 */
export const deleteOrder = async (id: string): Promise<boolean> => {
  try {
    await prisma.order.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
