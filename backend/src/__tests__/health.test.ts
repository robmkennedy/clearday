import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app, createApp } from '../app.js';

/**
 * Health endpoint tests
 *
 * These tests verify the /api/health endpoint is working correctly.
 * The endpoint is used for:
 * - Load balancer health checks
 * - Container orchestration readiness probes
 * - Basic connectivity verification with DB
 */

describe('GET /api/health', () => {
  it('returns 200 with status healthy and timestamp S5-001-AC1 @p0', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      status: 'healthy',
      timestamp: expect.any(String),
    });
  });

  it('returns a valid ISO 8601 timestamp S5-001-AC1 @p1', async () => {
    const response = await request(app).get('/api/health');

    const timestamp = response.body.timestamp;
    const parsed = new Date(timestamp);
    expect(parsed.toISOString()).toBe(timestamp);
  });

  it('returns JSON content type S5-001-AC1 @p1', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['content-type']).toMatch(/application\/json/);
  });

  it('responds within acceptable time (<100ms) S5-001-AC3 @p2', async () => {
    const start = Date.now();
    await request(app).get('/api/health');
    const duration = Date.now() - start;

    expect(duration).toBeLessThan(100);
  });
});

describe('GET /api/health (unhealthy state)', () => {
  it('returns 503 with status unhealthy when DB query fails S5-001-AC2 @p0', async () => {
    // Clear module cache so vi.doMock takes effect on fresh imports
    vi.resetModules();

    // Mock the db module to simulate database failure
    vi.doMock('../db/index.js', () => ({
      db: {
        select: () => ({
          from: () => ({
            limit: () => {
              throw new Error('SQLITE_CANTOPEN: unable to open database file');
            },
          }),
        }),
      },
      schema: { todos: {} },
    }));

    // Re-import app with mocked db to get an unhealthy instance
    const { createApp: createUnhealthyApp } = await import('../app.js');
    const unhealthyApp = createUnhealthyApp();

    const response = await request(unhealthyApp).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.body).toEqual({ status: 'unhealthy' });

    vi.restoreAllMocks();
    vi.resetModules();
  });

  it('returns JSON content type even when unhealthy S5-001-AC2 @p1', async () => {
    vi.resetModules();

    vi.doMock('../db/index.js', () => ({
      db: {
        select: () => ({
          from: () => ({
            limit: () => {
              throw new Error('DB connection refused');
            },
          }),
        }),
      },
      schema: { todos: {} },
    }));

    const { createApp: createUnhealthyApp } = await import('../app.js');
    const unhealthyApp = createUnhealthyApp();

    const response = await request(unhealthyApp).get('/api/health');

    expect(response.status).toBe(503);
    expect(response.headers['content-type']).toMatch(/application\/json/);

    vi.restoreAllMocks();
    vi.resetModules();
  });
});

describe('Security headers (Helmet)', () => {
  it('includes X-Content-Type-Options: nosniff S5-001-AC4 @p0', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['x-content-type-options']).toBe('nosniff');
  });

  it('includes X-DNS-Prefetch-Control: off S5-001-AC4 @p1', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['x-dns-prefetch-control']).toBe('off');
  });

  it('includes X-Frame-Options: SAMEORIGIN S5-001-AC4 @p1', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['x-frame-options']).toBe('SAMEORIGIN');
  });

  it('includes Strict-Transport-Security header S5-001-AC4 @p1', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['strict-transport-security']).toMatch(
      /max-age=\d+/
    );
  });

  it('includes X-Download-Options: noopen S5-001-AC4 @p1', async () => {
    const response = await request(app).get('/api/health');

    expect(response.headers['x-download-options']).toBe('noopen');
  });
});

describe('CORS configuration', () => {
  it('includes CORS headers for allowed origin S5-001-AC5 @p0', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://localhost:5173');

    expect(response.headers['access-control-allow-origin']).toBe(
      'http://localhost:5173'
    );
  });

  it('handles preflight OPTIONS request with correct methods S5-001-AC5 @p0', async () => {
    const response = await request(app)
      .options('/api/health')
      .set('Origin', 'http://localhost:5173')
      .set('Access-Control-Request-Method', 'GET');

    expect(response.status).toBe(204);
    expect(response.headers['access-control-allow-methods']).toMatch(/GET/);
    expect(response.headers['access-control-allow-methods']).toMatch(/POST/);
    expect(response.headers['access-control-allow-methods']).toMatch(/PATCH/);
    expect(response.headers['access-control-allow-methods']).toMatch(/DELETE/);
  });

  it('does not reflect disallowed origin in CORS header S5-001-AC5 @p1', async () => {
    const response = await request(app)
      .get('/api/health')
      .set('Origin', 'http://evil.com');

    // cors package with string origin sets configured value, not the request origin
    // Browser enforces: response origin (localhost:5173) ≠ page origin (evil.com) → blocked
    expect(response.headers['access-control-allow-origin']).not.toBe(
      'http://evil.com'
    );
  });
});

