import express from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import request from 'supertest';
import { config } from '../config';
import requireAuth, { AuthenticatedRequest } from '../middlewares/requireAuth';

describe('requireAuth middleware', () => {
  // Create a simple Express app for testing
  const app = express();
  app.use(express.json());
  // Protected route
  app.get('/protected', requireAuth, (req: AuthenticatedRequest, res) => {
    // req.user should be set by the middleware
    res.json({ user: req.user });
  });

  const validToken = jwt.sign(
    { userId: 'testid', email: 'test@email.com', role: 'USER' },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as string } as SignOptions
  );

  it('should allow access with a valid JWT', async () => {
    const res = await request(app).get('/protected').set('Authorization', `Bearer ${validToken}`);
    expect(res.status).toBe(200);
    expect(res.body.user).toBeDefined();
    expect(res.body.user.email).toBe('test@email.com');
  });

  it('should reject access with missing JWT', async () => {
    const res = await request(app).get('/protected');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });

  it('should reject access with invalid JWT', async () => {
    const res = await request(app).get('/protected').set('Authorization', 'Bearer invalidtoken');
    expect(res.status).toBe(401);
    expect(res.body).toHaveProperty('error');
  });
});
