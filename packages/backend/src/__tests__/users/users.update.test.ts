import request from 'supertest';
import app from '../../app';
import { hashPassword } from '../../services/auth.service';
import { prisma } from '../../utils/prisma';

// Test users
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'adminuser3@example.com',
  password: 'SuperSecret123!',
  role: 'ADMIN',
};
const normalUser = {
  firstName: 'Normal',
  lastName: 'User',
  email: 'normaluser3@example.com',
  password: 'SuperSecret123!',
  role: 'USER',
};
const otherUser = {
  firstName: 'Other',
  lastName: 'User',
  email: 'otheruser3@example.com',
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

describe('PUT /api/users/:id', () => {
  let adminToken: string;
  let userToken: string;
  let otherToken: string;
  let userId: string;

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
    await request(app).post('/api/auth/register').send(normalUser);
    // Register other user via API
    await request(app).post('/api/auth/register').send(otherUser);
    // Login admin via helper 2FA
    adminToken = await getAdminToken(adminUser.email, adminUser.password);
    // Login user
    const userRes = await request(app).post('/api/auth/login').send({
      email: normalUser.email,
      password: normalUser.password,
    });
    userToken = userRes.body.token;
    userId = (await prisma.user.findUnique({ where: { email: normalUser.email } }))!.id;
    const otherRes = await request(app).post('/api/auth/login').send({
      email: otherUser.email,
      password: otherUser.password,
    });
    otherToken = otherRes.body.token;
  });

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: { email: { in: [adminUser.email, normalUser.email, otherUser.email] } },
    });
    await prisma.$disconnect();
  });

  it('should allow admin to update any user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`)
      .send({ firstName: 'Updated', lastName: 'User' });
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Updated');
    expect(res.body.lastName).toBe('User');
  });

  it('should allow user to update self', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${userToken}`)
      .send({ firstName: 'Self', lastName: 'Updated' });
    expect(res.status).toBe(200);
    expect(res.body.firstName).toBe('Self');
    expect(res.body.lastName).toBe('Updated');
  });

  it('should forbid user to update another user', async () => {
    const res = await request(app)
      .put(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${otherToken}`)
      .send({ firstName: 'Hacker', lastName: 'User' });
    expect(res.status).toBe(403);
  });
});
