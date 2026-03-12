import { app } from './app.js';
import { logger } from './middleware/logger.js';

const PORT = process.env.PORT || 3000;

// Start server (only when running directly, not when imported for tests)
const server = app.listen(PORT, () => {
  logger.info(
    {
      port: PORT,
      nodeEnv: process.env.NODE_ENV,
      version: process.env.APP_VERSION || '1.0.0',
      pid: process.pid,
    },
    `🚀 Server running on http://localhost:${PORT}`
  );
});

/**
 * Graceful shutdown handler
 *
 * Docker sends SIGTERM on `docker compose down`. This handler:
 * 1. Stops accepting new connections
 * 2. Waits for in-flight requests to complete
 * 3. Exits cleanly so the container stops with code 0
 * 4. Force-exits after 10s if something hangs
 */
function shutdown(signal: string) {
  logger.info({ signal }, `Received ${signal}, starting graceful shutdown…`);
  server.close(() => {
    logger.info('HTTP server closed, exiting');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Graceful shutdown timed out after 10s, forcing exit');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));

