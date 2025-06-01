import { Prisma } from '@prisma/client';
import crypto from 'crypto';
import type { Order } from '../types/models/order';
import { prisma } from '../utils/prisma';
import { generateFinalKey } from './ticket.service';

function toOrderWithItems(o: {
  id: string;
  userId: string;
  status: string;
  transactionType?: string | null;
  transactionId?: string | null;
  totalAmount: Prisma.Decimal | string;
  key2?: string | null;
  createdAt: string | Date;
  updatedAt: string | Date;
  isDeleted: boolean;
  orderItems: {
    id: string;
    offerId: string;
    orderId: string;
    quantity: number;
    unitPrice: Prisma.Decimal | string;
    tickets: {
      id: string;
      userId: string;
      offerId: string;
      finalKey: string;
      status: string;
      createdAt: string | Date;
      updatedAt: string | Date;
      isDeleted: boolean;
      places: number;
    }[];
  }[];
}): Order {
  return {
    ...o,
    status: o.status as 'CANCELLED' | 'PENDING' | 'PAID' | 'REFUNDED',
    totalAmount: o.totalAmount.toString(),
    createdAt: typeof o.createdAt === 'string' ? o.createdAt : o.createdAt.toISOString(),
    updatedAt: typeof o.updatedAt === 'string' ? o.updatedAt : o.updatedAt.toISOString(),
    orderItems: o.orderItems.map(item => ({
      ...item,
      unitPrice: item.unitPrice.toString(),
      tickets: item.tickets.map(t => ({
        ...t,
        status: t.status as 'ACTIVE' | 'USED' | 'CANCELLED',
        createdAt: typeof t.createdAt === 'string' ? t.createdAt : t.createdAt.toISOString(),
        updatedAt: typeof t.updatedAt === 'string' ? t.updatedAt : t.updatedAt.toISOString(),
      })),
    })),
  };
}

/**
 * Génère la clé2 (key2) pour une commande
 * @param orderId string
 * @param orderDate string (ISO)
 * @param totalAmount string | number
 * @returns string (HMAC SHA-256)
 */
function generateOrderKey2(
  orderId: string,
  orderDate: string,
  totalAmount: string | number
): string {
  const masterKey = process.env.MASTER_KEY;
  if (!masterKey) throw new Error('MASTER_KEY environment variable is not set.');
  return crypto
    .createHmac('sha256', masterKey)
    .update(`${orderId}${orderDate}${totalAmount}`)
    .digest('hex');
}

/**
 * Crée une nouvelle commande avec plusieurs OrderItems et tickets associés
 * @param {Object} args
 * @param {string} args.userId - ID de l'utilisateur
 * @param {Array<{ offerId: string; quantity: number }>} args.items - Liste des offres et quantités
 * @returns {Promise<Order>} La commande créée avec items et tickets
 */
export const createOrder = async ({
  userId,
  items,
}: {
  userId: string;
  items: { offerId: string; quantity: number }[];
}): Promise<Order> => {
  return await prisma.$transaction(async tx => {
    // Récupère les offres pour calculer le total et les places
    const offers = await tx.offer.findMany({
      where: { id: { in: items.map(i => i.offerId) } },
      // lock: { mode: 'PESSIMISTIC_WRITE' }, // Prisma ne supporte pas cette option
    });
    // Vérifie le stock pour chaque item
    for (const item of items) {
      const offer = offers.find(o => o.id === item.offerId);
      if (!offer) throw new Error('Offer not found');
      if (offer.seats < item.quantity) {
        throw new Error(`Stock insuffisant pour l'offre ${offer.name}`);
      }
    }
    // Calcule le total
    let totalAmount = 0;
    for (const item of items) {
      const offer = offers.find(o => o.id === item.offerId);
      if (!offer) throw new Error('Offer not found');
      totalAmount += Number(offer.price) * item.quantity;
    }
    // Crée la commande (sans tickets pour l'instant)
    const order = await tx.order.create({
      data: {
        userId,
        status: 'PAID',
        totalAmount,
      },
    });
    // Génère la key2 et l'enregistre
    const orderDate =
      order.createdAt instanceof Date ? order.createdAt.toISOString() : order.createdAt;
    const key2 = generateOrderKey2(order.id, orderDate, totalAmount);
    await tx.order.update({ where: { id: order.id }, data: { key2 } });
    // Récupère l'utilisateur pour la key1
    const user = await tx.user.findUnique({ where: { id: userId } });
    if (!user || !user.key1) throw new Error('User or key1 not found');
    // Crée les orderItems et tickets avec la vraie finalKey
    for (const item of items) {
      const offer = offers.find(o => o.id === item.offerId);
      if (!offer) throw new Error('Offer not found');
      const orderItem = await tx.orderItem.create({
        data: {
          orderId: order.id,
          offerId: offer.id,
          quantity: item.quantity,
          unitPrice: offer.price,
        },
      });
      for (let idx = 0; idx < item.quantity; idx++) {
        const finalKey = generateFinalKey(user.key1, `${key2}:${orderItem.id}:${idx}`);
        await tx.ticket.create({
          data: {
            userId,
            offerId: offer.id,
            orderItemId: orderItem.id,
            status: 'ACTIVE',
            places: offer.places,
            finalKey,
          },
        });
      }
      // Décrémente le stock de l'offre
      await tx.offer.update({
        where: { id: offer.id },
        data: { seats: { decrement: item.quantity } },
      });
    }
    // Recharge la commande complète avec items et tickets
    const fullOrder = await tx.order.findUnique({
      where: { id: order.id },
      include: {
        orderItems: {
          include: {
            tickets: true,
          },
        },
      },
    });
    return toOrderWithItems(fullOrder!);
  });
};

/**
 * Récupère une commande par son ID (avec items et tickets)
 */
export const getOrderById = async (id: string): Promise<Order | null> => {
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      orderItems: {
        include: {
          tickets: true,
        },
      },
    },
  });
  return order ? toOrderWithItems(order) : null;
};

/**
 * Récupère toutes les commandes (avec items et tickets)
 */
export const getAllOrders = async (): Promise<Order[]> => {
  const orders = await prisma.order.findMany({
    include: {
      orderItems: {
        include: {
          tickets: true,
          order: {
            include: {
              user: true,
            },
          },
        },
      },
    },
  });
  return orders.map(toOrderWithItems);
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
