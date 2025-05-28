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
    createdAt: o.createdAt.toISOString(),
    updatedAt: o.updatedAt.toISOString(),
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
  // Check if offer exists
  const existing = await prisma.offer.findUnique({ where: { id } });
  if (!existing) return null;
  try {
    // Ne pas muter l'objet d'origine
    const prismaUpdateData: Record<string, unknown> = { ...data };
    if (prismaUpdateData.price !== undefined && prismaUpdateData.price !== null) {
      prismaUpdateData.price = new Prisma.Decimal(prismaUpdateData.price as string);
    }
    const offer = await prisma.offer.update({ where: { id }, data: prismaUpdateData });
    return toOffer(offer);
  } catch (err) {
    // Log or handle error as needed
    return null;
  }
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
