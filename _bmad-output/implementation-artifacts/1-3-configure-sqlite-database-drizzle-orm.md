# Story 1-3: Configure SQLite Database with Drizzle ORM

Status: done

## Story

**As a** developer,
**I want** SQLite database with Drizzle ORM configured,
**So that** I can persist data with type-safe queries.

**Story Reference:** Epic 1 (Project Foundation), Story 1.3
**Sprint:** 1

---

## Acceptance Criteria

- [x] AC1: `backend/src/db/schema.ts` with `todos` table (id, text, completed, created_at)
- [x] AC2: `backend/src/db/index.ts` with database connection
- [x] AC3: `backend/data/` directory for SQLite database file
- [x] AC4: Drizzle config for migrations (`drizzle.config.ts`)
- [x] AC5: `npm run db:migrate` creates the `todos` table
- [x] AC6: `npm run db:studio` opens Drizzle Studio

---

## Completed Implementation

### Files Created
- `backend/src/db/schema.ts` — Drizzle schema: `todos` table with `id` (text PK), `text`, `completed` (integer/boolean), `created_at`
- `backend/src/db/index.ts` — Database connection using `better-sqlite3`, WAL mode enabled, exports `db` and `schema`
- `backend/drizzle.config.ts` — Drizzle Kit configuration
- `backend/data/` — SQLite database directory

### Architecture Decisions
- `better-sqlite3` driver (synchronous, fast for single-user)
- WAL mode enabled for better concurrent access
- Auto-creates data directory if missing
- `DATABASE_URL` env var (default: `./data/todos.db`)

### Notes
- Retrospective record — story file created after implementation was complete.

