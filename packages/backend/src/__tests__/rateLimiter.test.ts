import express from 'express';
import request from 'supertest';
import { rateLimiter } from '../middlewares/rateLimiter';

describe('rateLimiter middleware', () => {
  // Create a simple Express app for testing
  const app = express();
  app.use(express.json());
  // Apply rate limiter to /limited route
  app.post('/limited', rateLimiter, (req, res) => {
    res.json({ message: 'OK' });
  });

  it('should allow up to 5 requests per minute, then block with 429', async () => {
    // Send 5 allowed requests
    for (let i = 0; i < 5; i++) {
      const res = await request(app).post('/limited');
      expect(res.status).toBe(200);
    }
    // 6th request should be blocked
    const res = await request(app).post('/limited');
    expect(res.status).toBe(429);
    expect(res.body).toHaveProperty('error');
  });
});
