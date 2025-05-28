import { z } from 'zod';

/**
 * Zod schema for user registration
 * Requires: firstName, lastName, email (valid), password (min 8)
 */
export const registerSchema = z.object({
  firstName: z.string().min(2, 'First name is required'),
  lastName: z.string().min(2, 'Last name is required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Zod schema for user login
 * Requires: email (valid), password
 */
export const loginSchema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
});

/**
 * Zod schema for 2FA code verification
 */
export const twoFAVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});
