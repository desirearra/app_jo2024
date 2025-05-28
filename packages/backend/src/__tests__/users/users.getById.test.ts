import request from 'supertest';
import app from '../../app';
import { hashPassword } from '../../services/auth.service';
import { prisma } from '../../utils/prisma';

// Test users
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'adminuser2@example.com',
  password: 'SuperSecret123!',
  role: 'ADMIN',
};
const normalUser = {
  firstName: 'Normal',
  lastName: 'User',
  email: 'normaluser2@example.com',
  password: 'SuperSecret123!',
  role: 'USER',
};
const otherUser = {
  firstName: 'Other',
  lastName: 'User',
  email: 'otheruser2@example.com',
  password: 'SuperSecret123!',
  role: 'USER',
};

async function getAdminToken(email: string, password: string): Promise<string> {
  await request(app).post('/api/auth/login').send({ email, password });
  const user = await prisma.user.findUnique({ where: { email } });
  const code = user?.twoFACode;
  const res = await request(app).post('/api/auth/2fa/verify').send({ email, code });
  return res.body.token;
}

describe('GET /api/users/:id', () => {
  let adminToken: string;
  let userToken: string;
  let userId: string;
  let otherId: string;

  beforeAll(async () => {
    // Clean up users if they exist
    await prisma.user.deleteMany({
      where: { email: { in: [adminUser.email, normalUser.email, otherUser.email] } },
    });
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
    // Register normal user via API
    const registerNormalRes = await request(app).post('/api/auth/register').send(normalUser);
    expect([200, 201]).toContain(registerNormalRes.status);
    // Register other user via API
    const registerOtherRes = await request(app).post('/api/auth/register').send(otherUser);
    expect([200, 201]).toContain(registerOtherRes.status);
    // Login admin via helper 2FA
    adminToken = await getAdminToken(adminUser.email, adminUser.password);
    expect(adminToken).toBeDefined();
    // Login user
    const userRes = await request(app).post('/api/auth/login').send({
      email: normalUser.email,
      password: normalUser.password,
    });
    expect(userRes.status).toBe(200);
    expect(userRes.body.token).toBeDefined();
    userToken = userRes.body.token;
    userId = (await prisma.user.findUnique({ where: { email: normalUser.email } }))!.id;
    otherId = (await prisma.user.findUnique({ where: { email: otherUser.email } }))!.id;
  });

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: { email: { in: [adminUser.email, normalUser.email, otherUser.email] } },
    });
    await prisma.$disconnect();
  });

  it('should allow admin to get any user', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
    expect(res.body).not.toHaveProperty('password');
  });

  it('should allow user to get self', async () => {
    const res = await request(app)
      .get(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('id', userId);
  });

  it('should forbid user to get another user', async () => {
    const res = await request(app)
      .get(`/api/users/${otherId}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
