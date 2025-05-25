import { PrismaClient } from '@prisma/client';
import request from 'supertest';
import app from '../app';
import { hashPassword } from '../services/auth.service';

const prisma = new PrismaClient();

// Test user credentials
const testUser = {
  firstName: 'Login',
  lastName: 'Test',
  email: 'loginuser@example.com',
  password: 'SuperSecret123!',
};

const adminUser = {
  firstName: 'Admin',
  lastName: 'Test',
  email: 'admin2fa@example.com',
  password: 'SuperSecret123!',
  role: 'ADMIN' as const,
};

describe('POST /api/auth/login', () => {
  beforeAll(async () => {
    // Ensure the test user exists in DB
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await request(app).post('/api/auth/register').send(testUser);
  });

  afterAll(async () => {
    // Clean up test user
    await prisma.user.deleteMany({ where: { email: testUser.email } });
    await prisma.$disconnect();
  });

  it('should login with valid credentials and return a JWT', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: testUser.password });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should reject login with invalid password', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: testUser.email, password: 'WrongPassword!' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject login with unknown email', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'unknown@example.com', password: 'Whatever123!' });
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});

describe('POST /api/auth/login (2FA admin)', () => {
  beforeAll(async () => {
    await prisma.user.deleteMany({ where: { email: adminUser.email } });
    const hashed = await hashPassword(adminUser.password);
    await prisma.user.create({ data: { ...adminUser, password: hashed } });
  });
  afterAll(async () => {
    await prisma.user.deleteMany({ where: { email: adminUser.email } });
  });

  it('should require 2FA for admin login', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    expect(res.status).toBe(202);
    expect(res.body.status).toBe('2FA_REQUIRED');
    expect(res.body.email).toBe(adminUser.email);
    // Code 2FA stocké en base
    const user = await prisma.user.findUnique({ where: { email: adminUser.email } });
    expect(user?.twoFACode).toHaveLength(6);
    expect(user?.twoFAExpiresAt).toBeInstanceOf(Date);
  });

  it('should verify 2FA code and return JWT', async () => {
    // Relancer login pour générer un code
    await request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    const user = await prisma.user.findUnique({ where: { email: adminUser.email } });
    const code = user?.twoFACode;
    const res = await request(app)
      .post('/api/auth/2fa/verify')
      .send({ email: adminUser.email, code });
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(typeof res.body.token).toBe('string');
  });

  it('should reject invalid 2FA code', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    const res = await request(app)
      .post('/api/auth/2fa/verify')
      .send({ email: adminUser.email, code: '000000' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject expired 2FA code', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    // Expire le code en base
    await prisma.user.update({
      where: { email: adminUser.email },
      data: { twoFAExpiresAt: new Date(Date.now() - 60000) },
    });
    const user = await prisma.user.findUnique({ where: { email: adminUser.email } });
    const code = user?.twoFACode;
    const res = await request(app)
      .post('/api/auth/2fa/verify')
      .send({ email: adminUser.email, code });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });

  it('should not allow code reuse (one-time)', async () => {
    await request(app)
      .post('/api/auth/login')
      .send({ email: adminUser.email, password: adminUser.password });
    const user = await prisma.user.findUnique({ where: { email: adminUser.email } });
    const code = user?.twoFACode;
    // Premier usage (OK)
    await request(app).post('/api/auth/2fa/verify').send({ email: adminUser.email, code });
    // Deuxième usage (KO)
    const res = await request(app)
      .post('/api/auth/2fa/verify')
      .send({ email: adminUser.email, code });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
  });
});
