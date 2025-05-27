import bcrypt from 'bcrypt';
import crypto from 'crypto';
import { prisma } from '../utils/prisma';

const SALT_ROUNDS = 10;

/**
 * Hash a password using bcrypt
 * @param password Plain user password
 * @returns Promise<string> Hashed password
 */
export const hashPassword = async (password: string): Promise<string> => {
  return bcrypt.hash(password, SALT_ROUNDS);
};

/**
 * Verify a password against a hash
 * @param password Plain user password
 * @param hash Hashed password
 * @returns Promise<boolean> True if match
 */
export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return bcrypt.compare(password, hash);
};

/**
 * Generate user key1 using HMAC SHA-256 with the master key
 * @param email User email
 * @param id User id
 * @param date Registration date (ISO string)
 * @returns HMAC string
 */
export const generateUserKey1 = (email: string, id: string, date: string): string => {
  const masterKey = process.env.MASTER_KEY || 'default_master_key';
  return crypto
    .createHmac('sha256', masterKey)
    .update(email + id + date)
    .digest('hex');
};

/**
 * Generate a 6-digit 2FA code
 * @returns string (6 digits)
 */
export const generate2FACode = (): string => {
  return crypto.randomInt(100000, 1000000).toString();
};

/**
 * Send a 2FA code by email (mock: console.log)
 * @param email User email
 * @param code 2FA code
 * @returns Promise<void>
 */
export const send2FACodeByEmail = async (email: string, code: string): Promise<void> => {
  // TODO: Replace with real email service
  console.log(`[2FA] Send code ${code} to ${email}`);
};

/**
 * Save 2FA code and expiration to user (5 min)
 * @param userId User UUID
 * @param code 2FA code
 * @returns Promise<void>
 */
export const save2FACodeToUser = async (userId: string, code: string): Promise<void> => {
  const expires = new Date(Date.now() + 5 * 60 * 1000); // 5 min
  await prisma.user.update({
    where: { id: userId },
    data: { twoFACode: code, twoFAExpiresAt: expires },
  });
};

/**
 * Verify a 2FA code for a user (and reset if valid)
 * @param userId User UUID
 * @param code 2FA code
 * @returns Promise<boolean> True if valid
 */
export const verify2FACode = async (userId: string, code: string): Promise<boolean> => {
  const user = await prisma.user.findUnique({ where: { id: userId } });
  if (!user || !user.twoFACode || !user.twoFAExpiresAt) return false;
  const now = new Date();
  if (user.twoFACode !== code) return false;
  if (user.twoFAExpiresAt < now) return false;
  // Reset code after usage
  await prisma.user.update({
    where: { id: userId },
    data: { twoFACode: null, twoFAExpiresAt: null },
  });
  return true;
};
