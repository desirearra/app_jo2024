import { OfferType, PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  // Création d'un admin
  await prisma.user.upsert({
    where: { email: 'desirearra@gmail.com' },
    update: {},
    create: {
      email: 'desirearra@gmail.com',
      password: await bcrypt.hash('admin_1234', 10), // À changer en prod !
      firstName: 'Admin',
      lastName: 'JO',
      role: UserRole.ADMIN,
      key1: 'clé-mockée-admin',
    },
  });

  // Création d'un user test
  const testUser = await prisma.user.upsert({
    where: { email: 'testuser@example.com' },
    update: {},
    create: {
      email: 'testuser@example.com',
      password: await bcrypt.hash('test_1234', 10),
      firstName: 'Test',
      lastName: 'User',
      role: UserRole.USER,
      key1: 'clé-mockée-user',
    },
  });

  // --- Création des événements JO 2024 (seed custom) ---
  const events = [
    {
      name: 'Athlétisme au Stade de France',
      description:
        'Vivez les performances exceptionnelles des meilleurs athlètes mondiaux dans ce temple mythique du sport français. Places limitées !',
      sport: 'Athlétisme',
      location: 'Stade de France',
      date: new Date('2024-08-04'),
      image:
        'https://plus.unsplash.com/premium_photo-1661868906940-5d8443acf49e?q=80&w=1171&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      seats: 150,
    },
    {
      name: 'Natation à La Défense Arena',
      description:
        "Soyez aux premières loges pour voir naître de nouveaux records olympiques dans la plus grande salle d'Europe !",
      sport: 'Natation',
      location: 'Centre Aquatique',
      date: new Date('2024-08-02'),
      image: 'https://images.unsplash.com/photo-1530549387789-4c1017266635?q=80&w=1000',
      seats: 100,
    },
    {
      name: 'Gymnastique à Bercy',
      description:
        "Réservez vos places pour assister aux performances spectaculaires des meilleurs gymnastes du monde à l'Accor Arena !",
      sport: 'Gymnastique',
      location: 'Arena Bercy',
      date: new Date('2024-08-06'),
      image:
        'https://plus.unsplash.com/premium_photo-1721755913670-5d20e710df72?q=80&w=1024&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      seats: 80,
    },
  ];

  // On crée chaque event et son offre associée
  for (const event of events) {
    const createdEvent = await prisma.event.create({
      data: {
        name: event.name,
        description: event.description,
        sport: event.sport,
        location: event.location,
        date: event.date,
        image: event.image,
      },
    });
    await prisma.offer.create({
      data: {
        name: `Offre Solo - ${event.sport}`,
        description: `Billet pour ${event.name}`,
        price: 99,
        type: OfferType.SOLO,
        seats: event.seats,
        eventId: createdEvent.id,
        places: 1, // Solo = 1 place
      },
    });
  }
  const duoOffer = await prisma.offer.create({
    data: {
      name: `Offre DUO`,
      description: `Billet pour 2 personnes tous le week-end`,
      price: 250,
      type: OfferType.DUO,
      seats: 40,
      eventId: null,
      places: 2, // Duo = 2 places
    },
  });

  const familyOffer = await prisma.offer.create({
    data: {
      name: `Offre Familial`,
      description: `Billet pour 4 personnes toute la semaine`,
      price: 899,
      type: OfferType.FAMILY,
      seats: 40,
      eventId: null,
      places: 4, // Familial = 4 places
    },
  });

  // --- Création d'une commande multi-items pour le user test ---
  const order = await prisma.order.create({
    data: {
      userId: testUser.id,
      status: 'PAID',
      totalAmount: 1399, // 2 Duo + 1 Familial
      orderItems: {
        create: [
          {
            offerId: duoOffer.id,
            quantity: 2,
            unitPrice: duoOffer.price,
            tickets: {
              create: [
                // 2 Pass Duo = 2 tickets Duo (places: 2)
                {
                  userId: testUser.id,
                  finalKey: 'DUO-1',
                  status: 'ACTIVE',
                  places: 2,
                  offerId: duoOffer.id,
                },
                {
                  userId: testUser.id,
                  finalKey: 'DUO-2',
                  status: 'ACTIVE',
                  places: 2,
                  offerId: duoOffer.id,
                },
              ],
            },
          },
          {
            offerId: familyOffer.id,
            quantity: 1,
            unitPrice: familyOffer.price,
            tickets: {
              create: [
                // 1 Pass Familial = 1 ticket Familial (places: 4)
                {
                  userId: testUser.id,
                  finalKey: 'FAM-1',
                  status: 'ACTIVE',
                  places: 4,
                  offerId: familyOffer.id,
                },
              ],
            },
          },
        ],
      },
    },
    include: {
      orderItems: { include: { tickets: true } },
    },
  });

  console.log('Seed terminé. Commande créée :', order.id);
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
