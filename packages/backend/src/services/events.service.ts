import { Event, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Crée un nouvel event
 * @param {Object} data
 * @param {string} data.name
 * @param {string} data.description
 * @param {string} data.sport
 * @param {string} data.location
 * @param {Date} data.date
 * @param {string} [data.image]
 * @returns {Promise<Event>}
 */
export const createEvent = async (data: {
  name: string;
  description: string;
  sport: string;
  location: string;
  date: Date;
  image?: string;
}): Promise<Event> => {
  return prisma.event.create({ data });
};

/**
 * Récupère un event par son ID
 * @param {string} id
 * @returns {Promise<Event|null>}
 */
export const getEventById = async (id: string): Promise<Event | null> => {
  return prisma.event.findUnique({ where: { id } });
};

/**
 * Liste tous les events
 * @returns {Promise<Event[]>}
 */
export const getAllEvents = async (): Promise<Event[]> => {
  return prisma.event.findMany();
};

/**
 * Met à jour un event
 * @param {string} id
 * @param {Partial<Event>} data
 * @returns {Promise<Event|null>}
 */
export const updateEvent = async (id: string, data: Partial<Event>): Promise<Event | null> => {
  try {
    return await prisma.event.update({ where: { id }, data });
  } catch {
    return null;
  }
};

/**
 * Supprime un event
 * @param {string} id
 * @returns {Promise<boolean>}
 */
export const deleteEvent = async (id: string): Promise<boolean> => {
  try {
    await prisma.event.delete({ where: { id } });
    return true;
  } catch {
    return false;
  }
};
