# Story 2-2: Implement Zod Validation Schemas

Status: done

## Story

**As a** developer,
**I want** Zod validation schemas for todo operations,
**So that** input is validated consistently on both client and server.

**Story Reference:** Epic 2 (Core Task Capture), Story 2.2
**Sprint:** 1

---

## Acceptance Criteria

- [x] AC1: `createTodoSchema` requires `text` string, trims whitespace, enforces 1-500 character length
- [x] AC2: Invalid requests return 400 with structured error response: `{ error: { code, message, details } }`
- [x] AC3: Schemas are importable in frontend for client-side validation

---

## Completed Implementation

### Files Created
- `shared/schemas/todo.ts` — Zod schemas: `createTodoSchema`, `updateTodoSchema`, `todoIdSchema`
- `shared/schemas/index.ts` — Barrel export
- `shared/schemas/__tests__/todo.test.ts` — Schema validation tests

### Schema Definitions
- `createTodoSchema`: `{ text: z.string().trim().min(1).max(500) }`
- `updateTodoSchema`: `{ text?: z.string().trim().min(1).max(500), completed?: z.boolean() }`
- `todoIdSchema`: `{ id: z.string().uuid() }`

### Notes
- Schemas duplicated inline in `backend/src/routes/todos.ts` to avoid build-order dependency (shared package must build first)
- Shared schemas available for frontend client-side validation
- Retrospective record — story file created after implementation was complete.

