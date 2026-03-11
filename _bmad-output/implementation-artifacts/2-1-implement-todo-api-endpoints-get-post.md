# Story 2-1: Implement Todo API Endpoints (GET & POST)

Status: done

## Story

**As a** developer,
**I want** API endpoints to retrieve and create todos,
**So that** the frontend can fetch and persist task data.

**Story Reference:** Epic 2 (Core Task Capture), Story 2.1
**Sprint:** 1

---

## Acceptance Criteria

- [x] AC1: `GET /api/todos` returns 200 with array of all todos sorted by `createdAt` descending
- [x] AC2: `POST /api/todos` with `{ "text": "Buy milk" }` returns 201 with created todo (server-generated `id` and `createdAt`)
- [x] AC3: `POST /api/todos` with invalid input (empty text or > 500 chars) returns 400 with error details

---

## Completed Implementation

### Files Created/Modified
- `backend/src/routes/todos.ts` — Express router with GET and POST handlers, Zod validation (inline schemas)
- `backend/src/routes/index.ts` — Barrel export for `todosRouter`
- `backend/src/app.ts` — Mounted router at `/api/todos`
- `backend/src/__tests__/routes/todos.test.ts` — API integration tests using Supertest

### Key Patterns
- UUID v4 generated server-side for `id`
- ISO 8601 timestamp for `createdAt`
- Zod validation with structured error response: `{ error: { code, message, details } }`
- Drizzle ORM for type-safe queries

### Notes
- Retrospective record — story file created after implementation was complete.

