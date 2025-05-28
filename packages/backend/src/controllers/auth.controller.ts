import { Request, RequestHandler, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { config } from '../config';
import {
  generate2FACode,
  save2FACodeToUser,
  send2FACodeByEmail,
  verify2FACode,
  verifyPassword,
} from '../services/auth.service';
import { loginSchema, twoFAVerifySchema } from '../types/schemas/auth';
import { logger } from '../utils/logger';
import { prisma } from '../utils/prisma';

/**
 * Login route with 2FA for admin
 * @route POST /api/auth/login
 * @returns 200 JWT | 202 2FA_REQUIRED | 401 Unauthorized
 */
export const loginFileController: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, password } = loginSchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.isDeleted) return res.status(401).json({ error: 'Invalid credentials' });
    const valid = await verifyPassword(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
    // 2FA for admin only
    if (user.role === 'ADMIN') {
      const code = generate2FACode();
      await save2FACodeToUser(user.id, code);
      await send2FACodeByEmail(user.email, code);
      return res.status(202).json({ status: '2FA_REQUIRED', email: user.email });
    }
    // User: login classique
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      {
        expiresIn: '1d',
      } as SignOptions
    );
    return res.json({ token });
  } catch (error) {
    logger.error('Login error', error);
    return res.status(400).json({ error: 'Invalid login data' });
  }
};

/**
 * Verify 2FA code for admin
 * @route POST /api/auth/2fa/verify
 * @returns 200 JWT | 400 Invalid code/data | 401 Unauthorized
 */
export const verify2FAFileController: RequestHandler = async (req: Request, res: Response) => {
  try {
    const { email, code } = twoFAVerifySchema.parse(req.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user || user.role !== 'ADMIN' || user.isDeleted)
      return res.status(401).json({ error: 'Unauthorized' });
    const valid = await verify2FACode(user.id, code);
    if (!valid) return res.status(400).json({ error: 'Invalid or expired 2FA code' });
    const token = jwt.sign(
      { userId: user.id, email: user.email, role: user.role },
      config.jwt.secret,
      {
        expiresIn: '1d',
      } as SignOptions
    );
    return res.json({ token });
  } catch (error) {
    logger.error('2FA verify error', error);
    return res.status(400).json({ error: 'Invalid 2FA data' });
  }
};
