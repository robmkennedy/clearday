# Story 1-6: Configure Root Scripts & Shared Types

Status: done

## Story

**As a** developer,
**I want** root workspace scripts and shared types configured,
**So that** I can run the full stack with single commands.

**Story Reference:** Epic 1 (Project Foundation), Story 1.6
**Sprint:** 1

---

## Acceptance Criteria

- [x] AC1: `npm run dev` starts both frontend and backend concurrently
- [x] AC2: `npm run build` builds shared, backend, and frontend in order
- [x] AC3: `npm run start` runs production server
- [x] AC4: `tsconfig.base.json` with shared compiler options
- [x] AC5: `shared/types/todo.ts` has `Todo`, `CreateTodoRequest`, `UpdateTodoRequest` interfaces
- [x] AC6: Environment variables configured

---

## Completed Implementation

### Files Created/Modified
- `package.json` (root) — Scripts: `dev` (concurrently), `build` (shared → backend → frontend), `start`, `test`, `test:e2e`, `lint`, `typecheck`
- `tsconfig.base.json` — ES2022 target, ESNext modules, strict mode, declaration maps
- `shared/index.ts` — Barrel export for shared types and schemas
- `shared/schemas/todo.ts` — Zod schemas (`createTodoSchema`, `updateTodoSchema`, `todoIdSchema`)
- `shared/types/` — TypeScript types (`Todo`, `CreateTodoRequest`, `UpdateTodoRequest`)

### Key Dependencies (root)
- `concurrently` — Run frontend + backend dev servers simultaneously
- `typescript` — Shared TypeScript compiler

### Notes
- Retrospective record — story file created after implementation was complete.

