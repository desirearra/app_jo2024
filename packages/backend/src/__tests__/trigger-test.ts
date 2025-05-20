import { PrismaClient } from '@prisma/client';

async function testTriggers(): Promise<void> {
  const prisma = new PrismaClient();

  try {
    // Créer un utilisateur
    console.log("Création d'un utilisateur...");
    const user = await prisma.user.create({
      data: {
        email: `test${Date.now()}@test.com`,
        password: 'password123',
        nom: 'Test',
        prenom: 'User',
      },
    });
    console.log('Utilisateur créé avec updatedAt:', user.updatedAt);

    // Attendre 2 secondes
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Mettre à jour l'utilisateur
    console.log("\nMise à jour de l'utilisateur...");
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { nom: 'Test Updated' },
    });
    console.log('Utilisateur mis à jour avec updatedAt:', updatedUser.updatedAt);

    // Vérifier que les timestamps sont différents
    console.log(
      '\nDifférence entre les timestamps:',
      updatedUser.updatedAt.getTime() - user.updatedAt.getTime(),
      'ms'
    );
  } catch (error) {
    console.error('Erreur:', error);
  } finally {
    await prisma.$disconnect();
  }
}

testTriggers();
