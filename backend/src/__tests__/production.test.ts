import { describe, it, expect, beforeAll } from 'vitest';
import request from 'supertest';
import { existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { createApp } from '../app.js';

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
    process.env.NODE_ENV = 'production';
    prodApp = createApp();
    process.env.NODE_ENV = originalNodeEnv;
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
    const testApp = createApp();
    const response = await request(testApp).get('/');

    // No static middleware → Express 404
    expect(response.status).toBe(404);
  });
});

