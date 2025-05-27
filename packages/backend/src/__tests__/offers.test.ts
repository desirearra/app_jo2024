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
  const loginRes = await request(app).post('/api/auth/login').send({ email, password });
  if (loginRes.status !== 202 && loginRes.status !== 200) {
    throw new Error(
      `Login failed for ${email}: status ${loginRes.status} - ${loginRes.body?.error || 'No error message'}`
    );
  }
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    throw new Error(`User not found in DB after login: ${email}`);
  }
  const code = user.twoFACode;
  if (!code) {
    throw new Error(`2FA code not set for user: ${email}`);
  }
  const res = await request(app).post('/api/auth/2fa/verify').send({ email, code });
  if (res.status !== 200 || !res.body.token) {
    throw new Error(
      `2FA verification failed for ${email}: status ${res.status} - ${res.body?.error || 'No token returned'}`
    );
  }
  return res.body.token;
}

describe('Offers API', () => {
  let offerId: string;
  let adminToken: string;
  const createdOfferIds: string[] = [];

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
    // Clean up only offers created in this test
    if (createdOfferIds.length > 0) {
      await prisma.offer.deleteMany({ where: { id: { in: createdOfferIds } } });
    }
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
    createdOfferIds.push(offerId);
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
