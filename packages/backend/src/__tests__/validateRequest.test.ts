import express from 'express';
import request from 'supertest';
import { z, ZodTypeAny } from 'zod';
import { validateRequest } from '../middlewares/validateRequest';

describe('validateRequest middleware', () => {
  // Define a simple Zod schema for testing
  const schema: ZodTypeAny = z.object({
    email: z.string().email(),
    password: z.string().min(8),
  });

  // Create a simple Express app for testing
  const app = express();
  app.use(express.json());
  app.post('/test', validateRequest(schema), (req, res) => {
    // Return the validated data
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.json({ validated: (req as any).validated });
  });

  it('should allow valid payload and attach validated data', async () => {
    const res = await request(app)
      .post('/test')
      .send({ email: 'test@email.com', password: 'SuperSecret123' });
    expect(res.status).toBe(200);
    expect(res.body.validated).toBeDefined();
    expect(res.body.validated.email).toBe('test@email.com');
  });

  it('should reject invalid payload and return 400', async () => {
    const res = await request(app).post('/test').send({ email: 'not-an-email', password: 'short' });
    expect(res.status).toBe(400);
    expect(res.body).toHaveProperty('error');
    expect(res.body).toHaveProperty('details');
  });
});
