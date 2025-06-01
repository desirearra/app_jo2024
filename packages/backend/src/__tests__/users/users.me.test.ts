import request from 'supertest';
import app from '../../app';
import { prisma } from '../../utils/prisma';

// Test user credentials
const testUser = {
  firstName: 'Profile',
  lastName: 'Test',
  email: 'profileuser@example.com',
  password: 'SuperSecret123!',
};

describe('GET /api/users/me', () => {
  let token: string;

  beforeAll(async () => {
    // Ensure the test user does not exist
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    // Register user
    const registerRes = await request(app).post('/api/auth/register').send(testUser);
    expect([200, 201]).toContain(registerRes.status);
    // Login user
    const loginRes = await request(app).post('/api/auth/login').send({
      email: testUser.email,
      password: testUser.password,
    });
    expect(loginRes.status).toBe(200);
    expect(loginRes.body.token).toBeDefined();
    token = loginRes.body.token;
  });

  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('should return the profile of the authenticated user', async () => {
    const res = await request(app).get('/api/users/me').set('Authorization', `Bearer ${token}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id');
    expect(res.body.email).toBe(testUser.email);
    expect(res.body.firstName).toBe(testUser.firstName);
    expect(res.body.lastName).toBe(testUser.lastName);
    expect(res.body).not.toHaveProperty('password');
    // Vérifie la présence des commandes et tickets
    expect(res.body).toHaveProperty('orders');
    expect(Array.isArray(res.body.orders)).toBe(true);
    expect(res.body).toHaveProperty('tickets');
    expect(Array.isArray(res.body.tickets)).toBe(true);
    // Vérifie la structure d'un élément si présent
    if (res.body.orders.length > 0) {
      expect(res.body.orders[0]).toHaveProperty('id');
      expect(res.body.orders[0]).toHaveProperty('offerId');
      expect(res.body.orders[0]).toHaveProperty('status');
      expect(res.body.orders[0]).toHaveProperty('totalAmount');
      expect(res.body.orders[0]).toHaveProperty('createdAt');
    }
    if (res.body.tickets.length > 0) {
      expect(res.body.tickets[0]).toHaveProperty('id');
      expect(res.body.tickets[0]).toHaveProperty('offerId');
      expect(res.body.tickets[0]).toHaveProperty('finalKey');
      expect(res.body.tickets[0]).toHaveProperty('status');
      expect(res.body.tickets[0]).toHaveProperty('createdAt');
    }
  });
});
