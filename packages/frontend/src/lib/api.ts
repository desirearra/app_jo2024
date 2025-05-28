// api.ts
// Centralise tous les appels à l'API backend avec axios
// Utilise la variable d'environnement VITE_API_URL pour l'URL de base
// Fournit des helpers typés pour GET, POST, PUT, DELETE

import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';

/**
 * Création d'une instance axios avec l'URL de base du backend
 * @see https://axios-http.com/docs/instance
 */
export const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
