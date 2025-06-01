/**
 * Returns the API base URL depending on the environment (Node, Jest, Vite)
 * @returns {string} The API base URL
 */
export const getApiBaseUrl = (): string => {
  // Utilise uniquement process.env pour compatibilité Node/Jest/Vite
  if (typeof process !== 'undefined' && process.env && process.env.VITE_API_URL) {
    return process.env.VITE_API_URL;
  }

  // Valeur par défaut
  return 'http://localhost:3000';
};
