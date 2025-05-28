import { OfferType, PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Création d'un admin
  await prisma.user.upsert({
    where: { email: 'admin@jo2024.fr' },
    update: {},
    create: {
      email: 'admin@jo2024.fr',
      password: await bcrypt.hash('admin_1234', 10), // À changer en prod !
      firstName: 'Admin',
      lastName: 'JO',
      role: UserRole.ADMIN,
      key1: 'clé-mockée-admin',
    },
  });

  // Création d'événements
  const event1 = await prisma.event.create({
    data: {
      name: 'Athlétisme - 100m Hommes',
      description: 'Finale du 100m hommes, ambiance garantie !',
      sport: 'Athlétisme',
      location: 'Stade de France',
      date: new Date('2024-07-28T15:00:00Z'),
      image: 'https://example.com/athletisme.jpg',
    },
  });

  const event2 = await prisma.event.create({
    data: {
      name: 'Natation - Finale 200m Nage Libre',
      description: 'Les meilleurs nageurs du monde en compétition.',
      sport: 'Natation',
      location: 'Centre Aquatique',
      date: new Date('2024-08-02T10:00:00Z'),
      image: 'https://example.com/natation.jpg',
    },
  });

  // Création d'offres liées aux événements
  await prisma.offer.createMany({
    data: [
      {
        name: 'Pass Découverte',
        description: 'Accès à une journée de compétition',
        price: 49,
        type: OfferType.SOLO,
        seats: 100,
        eventId: event1.id,
      },
      {
        name: 'Pass Duo',
        description: 'Accès à toutes les épreuves du week-end',
        price: 199,
        type: OfferType.FAMILY,
        seats: 50,
        eventId: event2.id,
      },
      {
        name: 'Pass Famille',
        description: '4 entrées pour toute la famille',
        price: 450,
        type: OfferType.FAMILY,
        seats: 25,
        eventId: event2.id,
      },
    ],
  });
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
