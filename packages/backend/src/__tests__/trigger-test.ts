import { PrismaClient } from '@prisma/client';

describe('PostgreSQL Triggers', () => {
  let prisma: PrismaClient;

  beforeAll(() => {
    prisma = new PrismaClient();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  it('should automatically update updatedAt on record update', async () => {
    // Create a test user
    const user = await prisma.user.create({
      data: {
        email: 'test@example.com',
        firstName: 'Test',
        lastName: 'User',
        password: 'password123',
      },
    });

    // Store the initial updatedAt
    const initialUpdatedAt = user.updatedAt;

    // Wait a second to ensure timestamp difference
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Update the user
    const updatedUser = await prisma.user.update({
      where: { id: user.id },
      data: { firstName: 'Updated' },
    });

    // Clean up
    await prisma.user.delete({
      where: { id: user.id },
    });

    // Verify updatedAt was changed
    expect(updatedUser.updatedAt.getTime()).toBeGreaterThan(initialUpdatedAt.getTime());
  });
});
