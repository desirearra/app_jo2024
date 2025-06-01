import { PrismaClient } from '@prisma/client';

describe('Seed Events', () => {
  const prisma = new PrismaClient();

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should contain the 3 seeded events with correct data', async () => {
    const events = await prisma.event.findMany();
    // On vérifie qu'il y a au moins les 3 events attendus
    expect(events.length).toBeGreaterThanOrEqual(3);
    // Vérifie la présence de chaque event par son nom
    expect(events.some(e => e.name === 'Athlétisme au Stade de France')).toBe(true);
    expect(events.some(e => e.name === 'Natation à La Défense Arena')).toBe(true);
    expect(events.some(e => e.name === 'Gymnastique à Bercy')).toBe(true);
  });
});
