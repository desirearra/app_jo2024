import { Prisma, Offer as PrismaOffer } from '@prisma/client';
import { Offer } from '../types/models/offer';
import { prisma } from '../utils/prisma';

/**
 * Convertit un objet Offer Prisma en Offer typé (price en string)
 * @param o PrismaOffer
 * @returns Offer
 */
function toOffer(o: PrismaOffer): Offer {
  return {
    ...o,
    price: o.price.toString(),
  };
}

/**
 * Create a new offer
 * @param data Offer creation data
 * @returns The created offer
 */
export async function createOffer(
  data: Omit<Offer, 'id' | 'createdAt' | 'updatedAt' | 'isDeleted'>
): Promise<Offer> {
  const offer = await prisma.offer.create({
    data: {
      ...data,
      price: new Prisma.Decimal(data.price),
    },
  });
  return toOffer(offer);
}

/**
 * Get all offers (not deleted)
 * @returns Array of offers
 */
export async function getAllOffers(): Promise<Offer[]> {
  const offers = await prisma.offer.findMany({ where: { isDeleted: false } });
  return offers.map(toOffer);
}

/**
 * Get an offer by ID
 * @param id Offer ID
 * @returns The offer or null
 */
export async function getOfferById(id: string): Promise<Offer | null> {
  const offer = await prisma.offer.findUnique({ where: { id, isDeleted: false } });
  return offer ? toOffer(offer) : null;
}

/**
 * Update an offer by ID
 * @param id Offer ID
 * @param data Partial offer data
 * @returns The updated offer or null
 */
export async function updateOffer(id: string, data: Partial<Offer>): Promise<Offer | null> {
  const offer = await prisma.offer.update({ where: { id }, data });
  return toOffer(offer);
}

/**
 * Soft delete an offer by ID
 * @param id Offer ID
 * @returns The updated offer or null
 */
export async function deleteOffer(id: string): Promise<Offer | null> {
  const offer = await prisma.offer.update({ where: { id }, data: { isDeleted: true } });
  return toOffer(offer);
}
