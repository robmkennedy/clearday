import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';
import { todosRouter } from './routes/index.js';
import { db, schema } from './db/index.js';
import { logger } from './middleware/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Express application factory
 *
 * Creates and configures the Express app.
 * Separated from server startup to enable testing.
 */
export function createApp() {
  const app = express();

  // 1. Security headers (first middleware)
  app.use(helmet());

  // 2. CORS configuration — fail-fast in production if FRONTEND_URL is missing (SEC-04)
  const FRONTEND_URL = process.env.FRONTEND_URL;
  if (process.env.NODE_ENV === 'production' && !FRONTEND_URL) {
    throw new Error('FRONTEND_URL environment variable is required in production');
  }

  app.use(
    cors({
      origin: FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
      credentials: true,
    })
  );

  // 3. Rate limiting — 100 requests per 15 min per IP (SEC-01)
  const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: { code: 'RATE_LIMITED', message: 'Too many requests' } },
  });
  app.use('/api/', apiLimiter);

  // 4. Request logging (health probes filtered to reduce log noise)
  app.use((req, res, next) => {
    if (req.path === '/api/health') {
      return next();
    }
    const start = Date.now();
    res.on('finish', () => {
      logger.info(
        {
          method: req.method,
          path: req.originalUrl,
          status: res.statusCode,
          duration: Date.now() - start,
        },
        `${req.method} ${req.originalUrl} ${res.statusCode}`
      );
    });
    next();
  });

  // 5. Body parsing (SEC-06: added URL-encoded limit)
  app.use(express.json({ limit: '100kb' }));
  app.use(express.urlencoded({ extended: false, limit: '100kb' }));

  // 5. Health check endpoint (before auth in future)
  // Returns enriched diagnostics for container orchestration and monitoring
  app.get('/api/health', async (_req, res) => {
    const checks: Record<string, { status: string; latency?: number; message?: string }> = {};

    // Database connectivity check with latency measurement
    try {
      const dbStart = Date.now();
      await db.select().from(schema.todos).limit(1);
      checks.database = { status: 'pass', latency: Date.now() - dbStart };
    } catch (err) {
      checks.database = {
        status: 'fail',
        message: err instanceof Error ? err.message : 'Unknown database error',
      };
    }

    const isHealthy = Object.values(checks).every((c) => c.status === 'pass');
    const mem = process.memoryUsage();

    res.status(isHealthy ? 200 : 503).json({
      status: isHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      version: process.env.APP_VERSION || '1.0.0',
      uptime: Math.floor(process.uptime()),
      checks,
      memory: {
        rss: Math.round(mem.rss / 1024 / 1024),
        heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
        heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
      },
    });
  });

  // 6. API Routes
  app.use('/api/todos', todosRouter);

  // 7. Production static file serving
  if (process.env.NODE_ENV === 'production') {
    const frontendDist = path.resolve(__dirname, '../../frontend/dist');
    app.use(express.static(frontendDist));

    // 8. SPA fallback — serve index.html for all non-API routes
    app.get('*', (req, res, next) => {
      if (req.path.startsWith('/api')) {
        return next();
      }
      res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
          res.status(404).send('Not found');
        }
      });
    });
  }

  // Global error handler — catches unhandled errors, prevents stack trace leakage (SEC-05)
  app.use(
    (
      err: Error,
      _req: express.Request,
      res: express.Response,
      _next: express.NextFunction
    ) => {
      logger.error({ error: err }, 'Unhandled error');
      res.status(500).json({
        error: {
          code: 'INTERNAL_ERROR',
          message: 'An unexpected error occurred',
        },
      });
    }
  );

  return app;
}

// Export app instance for testing
export const app = createApp();
