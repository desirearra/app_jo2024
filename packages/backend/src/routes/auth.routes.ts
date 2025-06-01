import { Request, Router } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { z } from 'zod';
import { config } from '../config';
import { loginFileController, verify2FAFileController } from '../controllers/auth.controller';
import { validateRequest } from '../middlewares/validateRequest';
import { generateUserKey1, hashPassword } from '../services/auth.service';
import { loginSchema, registerSchema, twoFAVerifySchema } from '../types/schemas/auth';
import { logger } from '../utils/logger';
import { prisma } from '../utils/prisma';

const router = Router();

// Strong password policy (min 8 chars, 1 uppercase, 1 digit, 1 special char)
const isStrongPassword = (password: string): boolean => {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(password);
};

// Type for validated request (extends Express Request)
type RegisterData = z.infer<typeof registerSchema>;

interface ValidatedRequest<T> extends Request {
  validated?: T; // Optional for Express compatibility
}

/**
 * @route POST /api/auth/register
 * @desc Register a new user
 * @access Public
 * @body RegisterData (firstName, lastName, email, password)
 * @returns 201 + token | 400 | 500
 */
router.post('/register', validateRequest(registerSchema), async (req: Request, res) => {
  // Use validated data (type-safe)
  const { firstName, lastName, email, password } = (req as ValidatedRequest<RegisterData>)
    .validated!;

  // 1. Validate required fields
  if (!firstName || !lastName || !email || !password)
    return res.status(400).json({ error: 'Missing required fields' });
  // 2. Validate password strength
  if (!isStrongPassword(password)) return res.status(400).json({ error: 'Password too weak' });
  try {
    // 3. Check email uniqueness
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return res.status(400).json({ error: 'Email already registered' });
    // 4. Hash the password
    const hashed = await hashPassword(password);
    // 5. Create the user without key1 (need id and creation date)
    const created = await prisma.user.create({
      data: { firstName, lastName, email, password: hashed },
    });
    // 6. Generate key1 (HMAC SHA-256 with master key)
    // Uses email, id and creation date (ISO string)
    const key1 = generateUserKey1(created.email, created.id, created.createdAt.toISOString());
    // 7. Update the user with key1
    await prisma.user.update({
      where: { id: created.id },
      data: { key1 },
    });
    // 8. Générer le token JWT (comme pour le login)
    const token = jwt.sign(
      { userId: created.id, email: created.email, role: 'USER' },
      config.jwt.secret,
      { expiresIn: '1d' } as SignOptions
    );
    // 9. Retourner uniquement le token (jamais la clé !)
    return res.status(201).json({ token });
  } catch (err) {
    // Technical log (server side)
    logger.error('Register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
});

/**
 * @route POST /api/auth/login
 * @desc Authenticate user and return JWT
 * @access Public
 * @body LoginData (email, password)
 * @returns 200 + token | 400 | 401 | 500
 */
router.post('/login', validateRequest(loginSchema), loginFileController);

/**
 * @route POST /api/auth/2fa/verify
 * @desc Verify 2FA
 * @access Public
 * @body twoFAVerifySchema (code)
 * @returns 200 | 400 | 500
 */
router.post('/2fa/verify', validateRequest(twoFAVerifySchema), verify2FAFileController);

export default router;
