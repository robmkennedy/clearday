import { describe, it, expect, vi } from 'vitest';
import request from 'supertest';
import { app } from '../../app.js';

/**
 * Logger and request logging middleware tests
 *
 * Verify:
 * - Logger module exports a configured Pino instance
 * - Request logging middleware is applied and processes requests without error
 * - Request logs capture method, path, status, and duration
 */

describe('Logger module', () => {
  it('exports a configured pino instance S5-002-AC1 @p0', async () => {
    const { logger } = await import('../../middleware/logger.js');

    expect(logger).toBeDefined();
    expect(typeof logger.info).toBe('function');
    expect(typeof logger.error).toBe('function');
    expect(typeof logger.warn).toBe('function');
    expect(typeof logger.debug).toBe('function');
  });

  it('respects LOG_LEVEL environment variable S5-002-AC5 @p0', async () => {
    // LOG_LEVEL is set to 'silent' in test setup
    const { logger } = await import('../../middleware/logger.js');

    expect(logger.level).toBe('silent');
  });
});

describe('Request logging middleware', () => {
  it('does not interfere with health endpoint responses S5-002-AC6 @p1', async () => {
    const response = await request(app).get('/api/health');

    expect(response.status).toBe(200);
    expect(response.body.status).toBe('healthy');
  });

  it('does not interfere with API endpoint responses S5-002-AC6 @p1', async () => {
    const response = await request(app).get('/api/todos');

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });

  it('does not interfere with POST request/response cycle S5-002-AC6 @p1', async () => {
    // Verify the request logging middleware doesn't break the response cycle
    const response = await request(app)
      .post('/api/todos')
      .send({ text: 'test logging' });

    expect(response.status).toBe(201);
    expect(response.body.text).toBe('test logging');
  });

  it('processes requests with various HTTP methods S5-002-AC2 @p1', async () => {
    // GET
    const getRes = await request(app).get('/api/health');
    expect(getRes.status).toBe(200);

    // POST
    const postRes = await request(app)
      .post('/api/todos')
      .send({ text: 'logger test' });
    expect(postRes.status).toBe(201);

    // PATCH
    const todoId = postRes.body.id;
    const patchRes = await request(app)
      .patch(`/api/todos/${todoId}`)
      .send({ completed: true });
    expect(patchRes.status).toBe(200);

    // DELETE
    const deleteRes = await request(app).delete(`/api/todos/${todoId}`);
    expect(deleteRes.status).toBe(204);
  });
});

describe('Request log content', () => {
  it('logs method, path, status, and duration for GET request S5-002-AC7 @p0', async () => {
    const { logger } = await import('../../middleware/logger.js');
    const infoSpy = vi.spyOn(logger, 'info');

    await request(app).get('/api/todos');

    // The res 'finish' event fires asynchronously — give it a tick to complete
    await new Promise((resolve) => setTimeout(resolve, 10));

    // Find the request log call (logger.info is called with { method, path, status, duration })
    const logCall = infoSpy.mock.calls.find(
      (call) => typeof call[0] === 'object' && (call[0] as Record<string, unknown>).method === 'GET'
        && (call[0] as Record<string, unknown>).path === '/api/todos'
    );

    expect(logCall, 'Expected a log entry for GET /api/todos').toBeDefined();
    const logData = logCall![0] as Record<string, unknown>;
    expect(logData.method).toBe('GET');
    expect(logData.path).toBe('/api/todos');
    expect(logData.status).toBe(200);
    expect(logData.duration).toEqual(expect.any(Number));
    expect(logData.duration).toBeGreaterThanOrEqual(0);

    infoSpy.mockRestore();
  });

  it('logs method, path, status, and duration for POST request S5-002-AC7 @p0', async () => {
    const { logger } = await import('../../middleware/logger.js');
    const infoSpy = vi.spyOn(logger, 'info');

    await request(app)
      .post('/api/todos')
      .send({ text: 'log content test' });

    await new Promise((resolve) => setTimeout(resolve, 10));

    const logCall = infoSpy.mock.calls.find(
      (call) => typeof call[0] === 'object' && (call[0] as Record<string, unknown>).method === 'POST'
        && (call[0] as Record<string, unknown>).path === '/api/todos'
    );

    expect(logCall, 'Expected a log entry for POST /api/todos').toBeDefined();
    const logData = logCall![0] as Record<string, unknown>;
    expect(logData.method).toBe('POST');
    expect(logData.path).toBe('/api/todos');
    expect(logData.status).toBe(201);
    expect(logData.duration).toEqual(expect.any(Number));

    infoSpy.mockRestore();
  });

  it('includes log message string with method, path, and status S5-002-AC2 @p1', async () => {
    const { logger } = await import('../../middleware/logger.js');
    const infoSpy = vi.spyOn(logger, 'info');

    await request(app).get('/api/todos');

    await new Promise((resolve) => setTimeout(resolve, 10));

    // The second argument to logger.info is the message string
    const logCall = infoSpy.mock.calls.find(
      (call) => typeof call[1] === 'string' && (call[1] as string).includes('GET /api/todos 200')
    );

    expect(logCall, 'Expected log message containing "GET /api/todos 200"').toBeDefined();

    infoSpy.mockRestore();
  });

  it('does not log health check probe requests (noise reduction) @p1', async () => {
    const { logger } = await import('../../middleware/logger.js');
    const infoSpy = vi.spyOn(logger, 'info');

    await request(app).get('/api/health');

    await new Promise((resolve) => setTimeout(resolve, 10));

    const healthLogCall = infoSpy.mock.calls.find(
      (call) => typeof call[0] === 'object' && (call[0] as Record<string, unknown>).path === '/api/health'
    );

    expect(healthLogCall, 'Health check requests should be filtered from logs').toBeUndefined();

    infoSpy.mockRestore();
  });
});

