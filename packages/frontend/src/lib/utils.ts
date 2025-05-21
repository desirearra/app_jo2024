import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

/****
 * Combine plusieurs valeurs de classes CSS en une seule chaîne optimisée pour Tailwind CSS.
 *
 * Prend en charge la concaténation conditionnelle et la fusion des classes Tailwind en supprimant les doublons et les conflits.
 *
 * @param inputs - Liste de valeurs de classes à combiner, pouvant inclure des chaînes, des objets ou des tableaux.
 * @returns Une chaîne de classes CSS fusionnées et optimisées pour Tailwind.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
