import { OfferType, PrismaClient, UserRole } from '@prisma/client';
import request from 'supertest';
import app from '../app';
import { hashPassword } from '../services/auth.service';
import type { Ticket } from '../types/models/ticket';

const prisma = new PrismaClient();

// Admin test user
const adminUser = {
  firstName: 'Admin',
  lastName: 'Ticket',
  email: 'admin-ticket@example.com',
  password: 'SuperSecret123!',
  role: 'ADMIN',
};

// Regular test user
const regularUser = {
  firstName: 'User',
  lastName: 'Ticket',
  email: 'user-ticket@example.com',
  password: 'UserSecret123!',
  role: 'USER',
};

// Offer for ticket
const offerData = {
  name: 'Test Offer',
  description: 'Offer for ticket tests',
  price: '99.99',
  type: 'SOLO',
  seats: 10,
  isActive: true,
};

let adminToken: string;
let userId: string;
let offerId: string;
let ticketId: string;

async function getAdminToken(email: string, password: string): Promise<string> {
  await request(app).post('/api/auth/login').send({ email, password });
  const user = await prisma.user.findUnique({ where: { email } });
  const code = user?.twoFACode;
  const res = await request(app).post('/api/auth/2fa/verify').send({ email, code });
  return res.body.token;
}

beforeAll(async () => {
  // Clean up users, offers, tickets
  await prisma.ticket.deleteMany();
  await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, regularUser.email] } } });
  await prisma.offer.deleteMany({ where: { name: offerData.name } });

  // Create admin
  await prisma.user.create({
    data: {
      ...adminUser,
      role: UserRole.ADMIN,
      password: await hashPassword(adminUser.password),
    },
  });

  // Create regular user
  const user = await prisma.user.create({
    data: {
      ...regularUser,
      role: UserRole.USER,
      password: await hashPassword(regularUser.password),
    },
  });
  userId = user.id;

  // Create offer
  const offer = await prisma.offer.create({
    data: {
      ...offerData,
      type: OfferType.SOLO,
      price: 99.99,
    },
  });
  offerId = offer.id;

  // Login admin via helper 2FA
  adminToken = await getAdminToken(adminUser.email, adminUser.password);
});

afterAll(async () => {
  await prisma.ticket.deleteMany();
  await prisma.offer.deleteMany({ where: { id: offerId } });
  await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, regularUser.email] } } });
  await prisma.$disconnect();
});

describe('Ticket CRUD (admin only)', () => {
  it('should create a ticket', async () => {
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${adminToken}`)
      .send({
        userId,
        offerId,
        finalKey: 'QR123456789',
      });
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    expect(res.body.userId).toBe(userId);
    expect(res.body.offerId).toBe(offerId);
    expect(res.body.finalKey).toBe('QR123456789');
    expect(res.body.status).toBe('ACTIVE');
    ticketId = res.body.id;
  });

  it('should get all tickets', async () => {
    const res = await request(app).get('/api/tickets').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBeGreaterThan(0);
  });

  it('should get a ticket by id', async () => {
    const res = await request(app)
      .get(`/api/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.id).toBe(ticketId);
  });

  it('should update a ticket', async () => {
    const res = await request(app)
      .put(`/api/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ status: 'USED' });
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('USED');
  });

  it('should soft delete a ticket', async () => {
    const res = await request(app)
      .delete(`/api/tickets/${ticketId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    // Should not be returned in get all
    const all = await request(app).get('/api/tickets').set('Authorization', `Bearer ${adminToken}`);
    expect((all.body as Ticket[]).find(t => t.id === ticketId)).toBeUndefined();
  });

  it('should forbid non-admin access', async () => {
    // Login as regular user
    const resLogin = await request(app)
      .post('/api/auth/login')
      .send({ email: regularUser.email, password: regularUser.password });
    const userToken = resLogin.body.token;
    // Try to create ticket
    const res = await request(app)
      .post('/api/tickets')
      .set('Authorization', `Bearer ${userToken}`)
      .send({ userId, offerId, finalKey: 'QR987654321' });
    expect(res.status).toBe(403);
  });
});
