// api.ts
// Centralise tous les appels à l'API backend avec axios
// Utilise la variable d'environnement VITE_API_URL pour l'URL de base
// Fournit des helpers typés pour GET, POST, PUT, DELETE

import type { Order } from '@/types';
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getApiBaseUrl } from './getApiBaseUrl';

/**
 * Création d'une instance axios avec l'URL de base du backend
 * @see https://axios-http.com/docs/instance
 */
const baseURL = getApiBaseUrl();

export const api: AxiosInstance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers = config.headers || {};
      config.headers['Authorization'] = `Bearer ${token}`;
    } else if (config.headers && 'Authorization' in config.headers) {
      delete config.headers['Authorization'];
    }
    return config;
  },
  error => Promise.reject(error)
);

/**
 * Helper générique pour requête GET
 * @param url string - endpoint relatif (ex: '/offers')
 * @param config AxiosRequestConfig - options axios
 * @returns Promise<AxiosResponse<T>>
 */
export function get<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return api.get<T>(url, config);
}

/**
 * Helper générique pour requête POST
 * @param url string - endpoint relatif
 * @param data unknown - payload (doit être typé à l'appel)
 * @param config AxiosRequestConfig - options axios
 * @returns Promise<AxiosResponse<T>>
 */
export function post<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return api.post<T>(url, data, config);
}

/**
 * Helper générique pour requête PUT
 * @param url string - endpoint relatif
 * @param data unknown - payload (doit être typé à l'appel)
 * @param config AxiosRequestConfig - options axios
 * @returns Promise<AxiosResponse<T>>
 */
export function put<T>(
  url: string,
  data?: unknown,
  config?: AxiosRequestConfig
): Promise<AxiosResponse<T>> {
  return api.put<T>(url, data, config);
}

/**
 * Helper générique pour requête DELETE
 */
export function del<T>(url: string, config?: AxiosRequestConfig): Promise<AxiosResponse<T>> {
  return api.delete<T>(url, config);
}

/**
 * Récupère la liste des événements depuis l'API backend
 * @returns Promise<Event[]>
 */
export async function getEvents<T = unknown[]>(): Promise<T> {
  const res = await api.get<T>('/api/events');
  return res.data;
}

/**
 * Récupère la liste des offres depuis l'API backend
 * @returns Promise<Offer[]>
 */
export async function getOffers<T = unknown[]>(): Promise<T> {
  const res = await api.get<T>('/api/offers');
  return res.data;
}

/**
 * Récupère la liste des offres liées à un événement
 * @param eventId string
 * @returns Promise<Offer[]>
 */
export async function getOffersByEventId<T = unknown[]>(eventId: string): Promise<T> {
  const res = await api.get<T>(`/api/offers?eventId=${eventId}`);
  return res.data;
}

/**
 * Authentifie un utilisateur via l'API backend
 * @param email string
 * @param password string
 * @returns Promise<{ token: string }>
 */
export async function loginUser(email: string, password: string): Promise<{ token: string }> {
  const res = await api.post<{ token: string }>('/api/auth/login', { email, password });
  return res.data;
}

/**
 * Crée une commande à partir du panier utilisateur
 * @param userId string
 * @param items Array<{ offerId: string, quantity: number }>
 * @returns Promise<Order> (commande créée)
 */
export async function createOrder(
  userId: string,
  items: { offerId: string; quantity: number }[]
): Promise<Order> {
  const res = await post<Order>('/api/orders', { userId, items });
  return res.data;
}
