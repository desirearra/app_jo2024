import request from 'supertest';
import app from '../../app';
import { hashPassword } from '../../services/auth.service';
import { prisma } from '../../utils/prisma';

// Test users
const adminUser = {
  firstName: 'Admin',
  lastName: 'User',
  email: 'adminuser4@example.com',
  password: 'SuperSecret123!',
  role: 'ADMIN',
};
const normalUser = {
  firstName: 'Normal',
  lastName: 'User',
  email: 'normaluser4@example.com',
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

describe('DELETE /api/users/:id', () => {
  let adminToken: string;
  let userToken: string;
  let userId: string;

  beforeAll(async () => {
    // Clean up users if they exist
    await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, normalUser.email] } } });
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
  });

  afterAll(async () => {
    // Clean up test users
    await prisma.user.deleteMany({ where: { email: { in: [adminUser.email, normalUser.email] } } });
    await prisma.$disconnect();
  });

  it('should allow admin to delete any user', async () => {
    const res = await request(app)
      .delete(`/api/users/${userId}`)
      .set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(204);
    // User should no longer exist
    const user = await prisma.user.findUnique({ where: { id: userId } });
    expect(user).toBeNull();
  });

  it('should forbid user to delete anyone', async () => {
    // Re-create user for this test
    const created = await prisma.user.create({
      data: {
        firstName: normalUser.firstName,
        lastName: normalUser.lastName,
        email: normalUser.email,
        password: await hashPassword(normalUser.password),
        role: 'USER',
      },
    });
    const res = await request(app)
      .delete(`/api/users/${created.id}`)
      .set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
  });
});
