import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../app';
import { hashPassword } from '../services/auth.service';

const prisma = new PrismaClient();

// Admin test user
const adminUser = {
  firstName: 'Admin',
  lastName: 'Offer',
  email: 'admin-offer@example.com',
  password: 'SuperSecret123!',
  role: 'ADMIN',
};

async function getAdminToken(email: string, password: string): Promise<string> {
  await request(app).post('/api/auth/login').send({ email, password });
  const user = await prisma.user.findUnique({ where: { email } });
  const code = user?.twoFACode;
  const res = await request(app).post('/api/auth/2fa/verify').send({ email, code });
  return res.body.token;
}

describe('Offers API', () => {
  let offerId: string;
  let adminToken: string;

  beforeAll(async () => {
    // Clean up admin if exists
    await prisma.user.deleteMany({ where: { email: adminUser.email } });
    // Create admin directly in DB
    await prisma.user.create({
      data: {
        firstName: adminUser.firstName,
        lastName: adminUser.lastName,
        email: adminUser.email,
        password: await hashPassword(adminUser.password),
        role: 'ADMIN',
      },
    });
    // Login admin via helper 2FA
    adminToken = await getAdminToken(adminUser.email, adminUser.password);
  });

  afterAll(async () => {
    // Clean up offers and admin
    await prisma.offer.deleteMany({ where: { name: { contains: 'Test' } } });
    await prisma.user.deleteMany({ where: { email: adminUser.email } });
    await prisma.$disconnect();
  });

  it('should create an offer', async () => {
    const res = await request(app)
      .post('/api/offers')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Offer',
        description: 'A test offer',
        price: '99.99',
        type: 'SOLO',
        seats: 10,
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    offerId = res.body.id;
  });

  it('should list all offers', async () => {
    const res = await request(app).get('/api/offers');
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get an offer by id', async () => {
    const res = await request(app).get(`/api/offers/${offerId}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', offerId);
  });

  it('should update an offer', async () => {
    const res = await request(app)
      .put(`/api/offers/${offerId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        name: 'Test Offer Updated',
      });
    expect(res.status).toBe(200);
    expect(res.body.name).toBe('Test Offer Updated');
  });

  it('should soft delete an offer', async () => {
    const res = await request(app)
      .delete(`/api/offers/${offerId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
    // Should not be found anymore
    const getRes = await request(app).get(`/api/offers/${offerId}`);
    expect(getRes.status).toBe(404);
  });
});
