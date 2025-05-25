import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(price);
}

/**
 * Génère une clé1 mockée à partir des infos utilisateur (email, id, date).
 * Utilise SHA-256 (Web Crypto API) pour le hash côté front (mock).
 * @param email Email de l'utilisateur
 * @param id Id utilisateur
 * @param date Date d'inscription (ISO string)
 * @returns Clé1 hashée (hex)
 */
export async function generateUserKey1(email: string, id: string, date: string): Promise<string> {
  const data = `${email}-${id}-${date}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Génère une clé2 mockée à partir des infos commande (id, date, total).
 * Utilise SHA-256 (Web Crypto API) pour le hash côté front (mock).
 * @param id Id commande
 * @param date Date de la commande (ISO string)
 * @param total Montant total (string ou number)
 * @returns Clé2 hashée (hex)
 */
export async function generateOrderKey2(
  id: string,
  date: string,
  total: string | number
): Promise<string> {
  const data = `${id}-${date}-${total}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}

/**
 * Génère la clé finale à partir de clé1 et clé2 (hash SHA-256 de la concat).
 * @param key1 Clé1 utilisateur (hex)
 * @param key2 Clé2 commande (hex)
 * @returns Clé finale hashée (hex)
 */
export async function generateFinalKey(key1: string, key2: string): Promise<string> {
  const data = `${key1}${key2}`;
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await window.crypto.subtle.digest('SHA-256', dataBuffer);
  return Array.from(new Uint8Array(hashBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
}
