import { PrismaClient } from '@prisma/client';

/**
 * Export a single PrismaClient instance for the whole backend
 * Avoids connection and performance issues
 */
export const prisma = new PrismaClient();
