import { beforeAll, afterAll, afterEach } from 'vitest';
import { sql } from 'drizzle-orm';
import { db, schema } from '../db/index.js';

/**
 * Backend test setup
 *
 * This file configures the test environment for backend tests.
 * It's automatically loaded by Vitest via setupFiles config.
 */

// Set test environment
process.env.NODE_ENV = 'test';

// Silence Pino logs during tests
process.env.LOG_LEVEL = 'silent';

// Global test timeout
// vi.setConfig({ testTimeout: 10000 });

beforeAll(async () => {
  // Setup code that runs once before all tests
  console.log('🧪 Starting backend test suite...');

  // Ensure the todos table exists for testing
  db.run(sql`
    CREATE TABLE IF NOT EXISTS todos (
      id TEXT PRIMARY KEY,
      text TEXT NOT NULL,
      completed INTEGER NOT NULL DEFAULT false,
      created_at TEXT NOT NULL
    )
  `);
});

afterAll(async () => {
  // Cleanup code that runs once after all tests
  console.log('✅ Backend test suite complete');
});

afterEach(async () => {
  // Reset any mocks after each test
  // vi.restoreAllMocks();

  // Clear todos table between tests
  await db.delete(schema.todos);
});

