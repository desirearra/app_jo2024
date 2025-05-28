import request from 'supertest';
import app from '../app';
import { hashPassword } from '../services/auth.service';
import { prisma } from '../utils/prisma';

let adminToken: string;

// Clean up the database before each test
beforeEach(async () => {
  await prisma.order.deleteMany({});
  await prisma.offer.deleteMany({});
  await prisma.user.deleteMany({});
});

beforeAll(async () => {
  // Créer un admin pour le test
  await prisma.user.create({
    data: {
      email: 'adminorder@example.com',
      password: await hashPassword('SuperSecret123!'),
      firstName: 'Admin',
      lastName: 'Order',
      role: 'ADMIN',
      key1: 'ADMINKEY1',
    },
  });
  // Login admin pour récupérer le token
  await request(app)
    .post('/api/auth/login')
    .send({ email: 'adminorder@example.com', password: 'SuperSecret123!' });
  const user = await prisma.user.findUnique({ where: { email: 'adminorder@example.com' } });
  const code = user?.twoFACode;
  const verifyRes = await request(app)
    .post('/api/auth/2fa/verify')
    .send({ email: 'adminorder@example.com', code });
  adminToken = verifyRes.body.token;
});

describe('Orders CRUD', () => {
  describe('POST /api/orders', () => {
    it('should create a new order', async () => {
      // Arrange: create a user and an offer
      const user = await prisma.user.create({
        data: {
          email: 'testuser@example.com',
          password: 'hashedpassword',
          firstName: 'Test',
          lastName: 'User',
          key1: 'USERKEY1',
        },
      });
      const offer = await prisma.offer.create({
        data: {
          name: 'Pass Duo',
          description: 'Accès pour 2 personnes',
          price: 200.0,
          type: 'DUO',
          seats: 5,
        },
      });
      // Act
      const res = await request(app)
        .post('/api/orders')
        .set('Authorization', `Bearer ${adminToken}`)
        .send({
          userId: user.id,
          offerId: offer.id,
          totalAmount: 200.0,
        });
      // Assert
      expect(res.status).toBe(201);
      expect(res.body).toHaveProperty('id');
      expect(res.body.userId).toBe(user.id);
      expect(res.body.offerId).toBe(offer.id);
      expect(res.body.totalAmount).toBe('200.00');
    });
  });

  describe('GET /api/orders/:id', () => {
    it('should get an order by id', async () => {
      // Arrange: create a user, offer, and order
      const user = await prisma.user.create({
        data: {
          email: 'orderget@example.com',
          password: 'hashedpassword',
          firstName: 'Order',
          lastName: 'Get',
        },
      });
      const offer = await prisma.offer.create({
        data: {
          name: 'Pass Duo',
          description: 'Accès pour 2 personnes',
          price: 200.0,
          type: 'DUO',
          seats: 5,
        },
      });
      const order = await prisma.order.create({
        data: {
          userId: user.id,
          offerId: offer.id,
          totalAmount: 200.0,
        },
      });

      // Act: get the order by id
      const res = await request(app).get(`/api/orders/${order.id}`);

      // Assert
      expect(res.status).toBe(200);
      expect(res.body).toHaveProperty('id', order.id);
      expect(res.body.userId).toBe(user.id);
      expect(res.body.offerId).toBe(offer.id);
      expect(res.body.totalAmount).toBe('200.00');
    });
  });
});
