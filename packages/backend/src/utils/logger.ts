/**
 * Simple logger utility
 * Logs with timestamp and level (info, warn, error)
 */
export const logger = {
  info: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.log(`[INFO] [${new Date().toISOString()}]`, message, ...args);
  },
  warn: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.warn(`[WARN] [${new Date().toISOString()}]`, message, ...args);
  },
  error: (message: string, ...args: unknown[]) => {
    // eslint-disable-next-line no-console
    console.error(`[ERROR] [${new Date().toISOString()}]`, message, ...args);
  },
};
