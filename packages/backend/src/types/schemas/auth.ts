import { z } from 'zod';

/**
 * Zod schema for user registration
 * Requires: firstName, lastName, email (valid), password (min 8)
 */
export const registerSchema = z.object({
  firstName: z.string().min(2, 'Prénom requis'),
  lastName: z.string().min(2, 'Nom requis'),
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe de 8 caractères minimum requis'),
});

/**
 * Zod schema for user login
 * Requires: email (valid), password
 */
export const loginSchema = z.object({
  email: z.string().email('Email invalide'),
  password: z.string().min(8, 'Mot de passe de 8 caractères minimum requis'),
});

/**
 * Zod schema for 2FA code verification
 */
export const twoFAVerifySchema = z.object({
  email: z.string().email(),
  code: z.string().length(6),
});
