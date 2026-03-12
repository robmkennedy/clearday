import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema.js';
import { existsSync, mkdirSync } from 'fs';
import { dirname } from 'path';

/**
 * Database connection
 *
 * Creates and exports a Drizzle ORM instance connected to SQLite.
 * Auto-creates the schema on first run (e.g. fresh Docker volume).
 */

const DATABASE_URL = process.env.DATABASE_URL || './data/todos.db';

// Ensure the data directory exists
const dbDir = dirname(DATABASE_URL);
if (!existsSync(dbDir)) {
  mkdirSync(dbDir, { recursive: true });
}

// Create SQLite database connection
const sqlite = new Database(DATABASE_URL);

// Enable WAL mode for better concurrent access
sqlite.pragma('journal_mode = WAL');

// Auto-create tables if they don't exist (handles fresh Docker volumes)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT false,
    created_at TEXT NOT NULL
  )
`);

// Create Drizzle ORM instance
export const db = drizzle(sqlite, { schema });

export { schema };

