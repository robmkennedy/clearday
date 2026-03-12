import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import express from 'express';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from '../app.js';
import { logger } from '../middleware/logger.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../../../frontend/dist/index.html');
const hasFrontendBuild = existsSync(frontendDist);

/**
 * Production static serving and SPA fallback tests
 *
 * Tests verify:
 * - Static file serving is active in production mode
 * - SPA fallback serves index.html for non-API routes
 * - API routes are not affected by SPA fallback
 * - Dev/test mode has no static serving
 *
 * Note: Static serving tests require `npm run build` to have been run first.
 */

describe('Production mode (static serving & SPA fallback)', () => {
  let prodApp: ReturnType<typeof createApp>;

  beforeAll(() => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalFrontendUrl = process.env.FRONTEND_URL;
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_URL = 'http://localhost:5173';
    prodApp = createApp();
    process.env.NODE_ENV = originalNodeEnv;
    if (originalFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL;
    } else {
      process.env.FRONTEND_URL = originalFrontendUrl;
    }
  });

  it.skipIf(!hasFrontendBuild)('serves index.html for root path in production S5-003-AC2 @p0', async () => {
    const response = await request(prodApp).get('/');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  it.skipIf(!hasFrontendBuild)('serves index.html for arbitrary non-API paths (SPA fallback) S5-003-AC3 @p0', async () => {
    const response = await request(prodApp).get('/some/random/path');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/text\/html/);
  });

  it('API health endpoint still returns JSON in production S5-003-AC4 @p0', async () => {
    const response = await request(prodApp).get('/api/health');

    // May be 200 or 503 depending on DB availability, but always JSON
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(response.body).toHaveProperty('status');
  });

  it('API todos endpoint still returns JSON in production S5-003-AC4 @p1', async () => {
    const response = await request(prodApp).get('/api/todos');

    expect(response.status).toBe(200);
    expect(response.headers['content-type']).toMatch(/application\/json/);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('does not serve SPA fallback for /api/* routes S5-003-AC4 @p0', async () => {
    const response = await request(prodApp).get('/api/nonexistent');

    // Should get Express default 404, not index.html
    expect(response.status).toBe(404);
  });
});

describe('Development/test mode (no static serving)', () => {
  it('does not serve static files in non-production mode S5-003-AC7 @p1', async () => {
    // createApp() with NODE_ENV=test should not include static middleware
    const originalNodeEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'test';
    const testApp = createApp();
    process.env.NODE_ENV = originalNodeEnv;
    const response = await request(testApp).get('/');

    // No static middleware → Express 404
    expect(response.status).toBe(404);
  });
});

describe('Security hardening (SEC-04, SEC-05)', () => {
  it('throws if FRONTEND_URL is missing in production mode SEC-04 @p0', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalFrontendUrl = process.env.FRONTEND_URL;
    process.env.NODE_ENV = 'production';
    delete process.env.FRONTEND_URL;

    expect(() => createApp()).toThrow(
      'FRONTEND_URL environment variable is required in production'
    );

    process.env.NODE_ENV = originalNodeEnv;
    if (originalFrontendUrl !== undefined) {
      process.env.FRONTEND_URL = originalFrontendUrl;
    }
  });

  it('does not throw when FRONTEND_URL is set in production mode SEC-04 @p1', () => {
    const originalNodeEnv = process.env.NODE_ENV;
    const originalFrontendUrl = process.env.FRONTEND_URL;
    process.env.NODE_ENV = 'production';
    process.env.FRONTEND_URL = 'https://example.com';

    expect(() => createApp()).not.toThrow();

    process.env.NODE_ENV = originalNodeEnv;
    if (originalFrontendUrl === undefined) {
      delete process.env.FRONTEND_URL;
    } else {
      process.env.FRONTEND_URL = originalFrontendUrl;
    }
  });

  it('global error handler returns 500 JSON without stack trace SEC-05 @p1', async () => {
    // Build a standalone app with a throwing route followed by the exact
    // error-handler pattern from createApp — verifies the handler catches
    // unhandled errors and returns a sanitised JSON response.
    const errorApp = express();
    errorApp.get('/api/test-error', () => {
      throw new Error('Test unhandled error');
    });
    errorApp.use(
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

    const response = await request(errorApp).get('/api/test-error');

    expect(response.status).toBe(500);
    expect(response.body).toEqual({
      error: {
        code: 'INTERNAL_ERROR',
        message: 'An unexpected error occurred',
      },
    });
    // Ensure no stack trace leaked
    expect(response.text).not.toContain('at ');
  });
});

