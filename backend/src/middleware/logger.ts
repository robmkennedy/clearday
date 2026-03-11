import pino from 'pino';

/**
 * Structured logger using Pino
 *
 * - Development: human-readable output via pino-pretty
 * - Production: JSON-formatted logs (no pino-pretty)
 * - Log level configurable via LOG_LEVEL env var (default: info)
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development'
      ? { target: 'pino-pretty' }
      : undefined,
});

