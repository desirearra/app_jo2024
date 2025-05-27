import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../app'; // à adapter selon l'export de l'app Express

const prisma = new PrismaClient();

beforeEach(async () => {
  // Nettoyage avant chaque test
  await prisma.user.deleteMany({
    where: {
      email: {
        in: ['testuser@example.com', 'weakpass@example.com'],
      },
    },
  });
});

describe('POST /api/auth/register', () => {
  afterAll(async () => {
    // Nettoyage : suppression des utilisateurs de test
    await prisma.user.deleteMany({
      where: {
        email: {
          in: ['testuser@example.com', 'weakpass@example.com'],
        },
      },
    });
    await prisma.$disconnect();
  });

  it('should register a new user with valid data', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'testuser@example.com',
      password: 'SuperSecret123!',
    });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body).toHaveProperty('email', 'testuser@example.com');
    expect(res.body).not.toHaveProperty('password');
    expect(res.body).toHaveProperty('key1');
  });

  it('should reject weak passwords', async () => {
    const res = await request(app).post('/api/auth/register').send({
      firstName: 'Test',
      lastName: 'User',
      email: 'weakpass@example.com',
      password: '1234',
    });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
