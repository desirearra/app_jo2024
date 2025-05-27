import { Order, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
  return prisma.order.create({
    data: {
      userId,
      offerId,
      totalAmount,
    },
  });
};

/**
 * Récupère une commande par son ID
 * @param {string} id
 * @returns {Promise<Order | null>}
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
  return prisma.order.findUnique({ where: { id } });
};

/**
 * Récupère toutes les commandes
 * @returns {Promise<Order[]>}
 */
export const getAllOrders = async (): Promise<Order[]> => {
  return prisma.order.findMany();
};

/**
 * Met à jour une commande
 * @param {string} id
 * @param {Partial<Order>} data
 * @returns {Promise<Order|null>}
 */
export const updateOrder = async (id: string, data: Partial<Order>): Promise<Order | null> => {
  try {
    return await prisma.order.update({
      where: { id },
      data,
    });
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
