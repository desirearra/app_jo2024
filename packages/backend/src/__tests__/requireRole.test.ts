import express from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import request from 'supertest';
import { config } from '../config';
import requireAuth, { AuthenticatedRequest } from '../middlewares/requireAuth';
import { requireRole } from '../middlewares/requireRole';

describe('requireRole middleware', () => {
  // Create a simple Express app for testing
  const app = express();
  app.use(express.json());
  // Protected admin route
  app.get('/admin', requireAuth, requireRole(['ADMIN']), (req: AuthenticatedRequest, res) => {
    res.json({ message: 'Welcome, admin!', user: req.user });
  });

  const adminToken = jwt.sign(
    { userId: 'adminid', email: 'admin@email.com', role: 'ADMIN' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as string } as SignOptions
  );
  const userToken = jwt.sign(
    { userId: 'userid', email: 'user@email.com', role: 'USER' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as string } as SignOptions
  );

  it('should allow access for allowed role', async () => {
    const res = await request(app).get('/admin').set('Authorization', `Bearer ${adminToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user.role).toBe('ADMIN');
  });

  it('should forbid access for non-allowed role', async () => {
    const res = await request(app).get('/admin').set('Authorization', `Bearer ${userToken}`);
    expect(res.status).toBe(403);
    expect(res.body).toHaveProperty('error');
  });

  it('should forbid access if user is missing', async () => {
    const res = await request(app).get('/admin');
    expect(res.status).toBe(401); // requireAuth returns 401 before requireRole
  });
});
