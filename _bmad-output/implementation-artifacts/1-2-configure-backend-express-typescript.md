# Story 1-2: Configure Backend with Express & TypeScript

Status: done

## Story

**As a** developer,
**I want** an Express server with TypeScript configured,
**So that** I can build type-safe API endpoints.

**Story Reference:** Epic 1 (Project Foundation), Story 1.2
**Sprint:** 1

---

## Acceptance Criteria

- [x] AC1: `backend/src/index.ts` entry point starting Express on port 3000
- [x] AC2: `backend/tsconfig.json` extending root config
- [x] AC3: TypeScript compilation with `tsx` for development
- [x] AC4: `npm run dev` in backend starts the server with hot reload (`tsx watch`)
- [x] AC5: `GET /api/health` returns `{ "status": "ok" }`

---

## Completed Implementation

### Files Created
- `backend/src/index.ts` — Server entry point (imports from `app.ts`, listens on PORT)
- `backend/src/app.ts` — Express app factory (`createApp()` pattern for testability)
- `backend/tsconfig.json` — Extends `tsconfig.base.json`, NodeNext module resolution
- `backend/package.json` — Scripts: `dev` (tsx watch), `build` (tsc), `start` (node dist/index.js)

### Architecture Decisions
- App factory pattern (`createApp()`) separated from server startup for testing with supertest
- ESM modules (`"type": "module"` in package.json)

### Notes
- Retrospective record — story file created after implementation was complete.

