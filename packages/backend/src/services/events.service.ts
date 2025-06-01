import { Event as PrismaEvent } from '@prisma/client';
import type { Event } from '../types/models/event';
import { prisma } from '../utils/prisma';

function toEvent(e: PrismaEvent): Event {
  return {
    ...e,
    date: e.date.toISOString(),
    createdAt: e.createdAt.toISOString(),
    updatedAt: e.updatedAt.toISOString(),
  };
}

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
  date: string;
  image?: string;
  createdAt?: Date;
  updatedAt?: Date;
}): Promise<Event> => {
  delete data.createdAt;
  delete data.updatedAt;
  data.date = new Date(data.date || '').toISOString();
  try {
    const event = await prisma.event.create({ data });
    return toEvent(event);
  } catch (error) {
    console.error('error', error);
    throw error;
  }
};

/**
 * Récupère un event par son ID
 * @param {string} id
 * @returns {Promise<Event|null>}
 */
export const getEventById = async (id: string): Promise<Event | null> => {
  try {
    const event = await prisma.event.findUnique({ where: { id } });
    return event ? toEvent(event) : null;
  } catch (error) {
    console.error('error', error);
    return null;
  }
};

/**
 * Liste tous les events
 * @returns {Promise<Event[]>}
 */
export const getAllEvents = async (): Promise<Event[]> => {
  try {
    const events = await prisma.event.findMany({
      include: {
        offers: true,
      },
    });
    return events.map(toEvent);
  } catch (error) {
    console.error('error', error);
    return [];
  }
};

/**
 * Met à jour un event
 * @param {string} id
 * @param {Partial<Event>} data
 * @returns {Promise<Event|null>}
 */
export const updateEvent = async (id: string, data: Partial<Event>): Promise<Event | null> => {
  try {
    delete data.createdAt;
    delete data.updatedAt;
    data.date = new Date(data.date || '').toISOString();
    const event = await prisma.event.update({ where: { id }, data });
    return toEvent(event);
  } catch (error) {
    console.error('error', error);
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
  } catch (error) {
    console.error('error', error);
    return false;
  }
};
