import { createRequire } from 'module';
import pino from 'pino';

const require = createRequire(import.meta.url);

/**
 * Check whether pino-pretty is installed (it's a devDependency,
 * so it won't be present in production Docker images).
 */
function hasPinoPretty(): boolean {
  try {
    require.resolve('pino-pretty');
    return true;
  } catch {
    return false;
  }
}

/**
 * Structured logger using Pino
 *
 * - Development (with pino-pretty installed): human-readable output
 * - Production / Docker: JSON-formatted logs
 * - Log level configurable via LOG_LEVEL env var (default: info)
 */
export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development' && hasPinoPretty()
      ? { target: 'pino-pretty' }
      : undefined,
});

