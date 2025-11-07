/**
 * Logger utility untuk conditional logging
 * Hanya log di development mode
 */

const isDev = import.meta.env.DEV || import.meta.env.VITE_DEBUG_MODE === 'true';
const showLogs = import.meta.env.VITE_SHOW_CONSOLE_LOGS === 'true';

export const logger = {
  log: (...args: any[]) => {
    if (isDev || showLogs) {
      console.log('[LOG]', ...args);
    }
  },

  info: (...args: any[]) => {
    if (isDev || showLogs) {
      console.info('[INFO]', ...args);
    }
  },

  warn: (...args: any[]) => {
    if (isDev || showLogs) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args: any[]) => {
    // Always log errors, even in production
    console.error('[ERROR]', ...args);
  },

  debug: (...args: any[]) => {
    if (isDev) {
      console.debug('[DEBUG]', ...args);
    }
  },

  table: (data: any) => {
    if (isDev || showLogs) {
      console.table(data);
    }
  },

  group: (label: string) => {
    if (isDev || showLogs) {
      console.group(label);
    }
  },

  groupEnd: () => {
    if (isDev || showLogs) {
      console.groupEnd();
    }
  }
};

// Export untuk backward compatibility
export const log = logger.log;
export const info = logger.info;
export const warn = logger.warn;
export const error = logger.error;
export const debug = logger.debug;
