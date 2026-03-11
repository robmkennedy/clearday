import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
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

  // 2. CORS configuration
  app.use(
    cors({
      origin: process.env.FRONTEND_URL || 'http://localhost:5173',
      methods: ['GET', 'POST', 'PATCH', 'DELETE'],
    })
  );

  // 3. Request logging
  app.use((req, res, next) => {
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

  // 4. Body parsing
  app.use(express.json({ limit: '100kb' }));

  // 5. Health check endpoint (before auth in future)
  app.get('/api/health', async (_req, res) => {
    try {
      await db.select().from(schema.todos).limit(1);
      res.json({ status: 'healthy', timestamp: new Date().toISOString() });
    } catch {
      res.status(503).json({ status: 'unhealthy' });
    }
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

  return app;
}

// Export app instance for testing
export const app = createApp();
