# Story 7.1: Implement Health Check & Security Middleware

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

**As a** developer,
**I want** a health check endpoint that verifies database connectivity and security headers on all responses,
**So that** the app is production-ready with proper monitoring and hardened HTTP responses.

**Story Reference:** Epic 7 (Production Readiness), Story 7.1
**Points:** 3
**Priority:** P1 - High
**Sprint:** 5

---

## Acceptance Criteria

- [ ] AC1: `GET /api/health` returns 200 with `{ "status": "healthy", "timestamp": "<ISO8601>" }` when DB is accessible
- [ ] AC2: `GET /api/health` returns 503 with `{ "status": "unhealthy" }` when DB is unavailable
- [ ] AC3: Health check endpoint verifies database connectivity by executing a real query
- [ ] AC4: Helmet middleware adds security headers to all responses (X-Content-Type-Options, Strict-Transport-Security, etc.)
- [ ] AC5: CORS is configured using the `cors` package with `origin` set to `process.env.FRONTEND_URL || 'http://localhost:5173'` and allowed methods `['GET', 'POST', 'PATCH', 'DELETE']`
- [ ] AC6: All existing tests (208+) continue to pass — zero regressions
- [ ] AC7: New tests cover healthy state, unhealthy state, security headers, and CORS configuration

---

## Tasks / Subtasks

### Task 1: Install dependencies (AC: 4, 5)
- [ ] 1.1 Install `helmet` as a production dependency in `backend/package.json`
- [ ] 1.2 Install `cors` and `@types/cors` in `backend/package.json`

### Task 2: Upgrade health check endpoint (AC: 1, 2, 3)
- [ ] 2.1 Replace the basic `/api/health` handler in `backend/src/app.ts`
- [ ] 2.2 Import `db` and `schema` from `./db/index.js`
- [ ] 2.3 Execute `db.select().from(schema.todos).limit(1)` to verify DB connectivity
- [ ] 2.4 Return `200 { status: "healthy", timestamp: new Date().toISOString() }` on success
- [ ] 2.5 Return `503 { status: "unhealthy" }` on database error (catch block)

### Task 3: Add Helmet security middleware (AC: 4)
- [ ] 3.1 Import `helmet` in `backend/src/app.ts`
- [ ] 3.2 Add `app.use(helmet())` BEFORE routes and BEFORE CORS (first middleware in chain)
- [ ] 3.3 Verify Helmet doesn't break existing API responses (JSON content type, CORS headers)

### Task 4: Replace manual CORS with `cors` package (AC: 5)
- [ ] 4.1 Remove the manual CORS middleware block in `backend/src/app.ts` (lines 17-26)
- [ ] 4.2 Import `cors` from 'cors'
- [ ] 4.3 Add `app.use(cors({ origin: process.env.FRONTEND_URL || 'http://localhost:5173', methods: ['GET', 'POST', 'PATCH', 'DELETE'] }))`
- [ ] 4.4 Place CORS middleware after Helmet, before routes

### Task 5: Update & expand tests (AC: 6, 7)
- [ ] 5.1 Update `backend/src/__tests__/health.test.ts` — change expected response from `{ status: 'ok' }` to `{ status: 'healthy', timestamp: expect.any(String) }`
- [ ] 5.2 Add test: verify `timestamp` is valid ISO 8601 string
- [ ] 5.3 Add test: verify security headers present (X-Content-Type-Options: nosniff, etc.)
- [ ] 5.4 Add test: verify CORS headers on preflight OPTIONS request
- [ ] 5.5 Run full test suite — all 208+ tests must pass

---

## Dev Notes

### ⚠️ CRITICAL: What Already Exists — Do NOT Recreate

The following already exist and need to be **modified, not created from scratch**:

| What | Location | Current State |
|------|----------|---------------|
| Health endpoint | `backend/src/app.ts` line 30-32 | Returns `{ status: 'ok' }` — needs upgrade |
| Manual CORS | `backend/src/app.ts` lines 17-26 | Manual headers — needs replacement with `cors` package |
| Health tests | `backend/src/__tests__/health.test.ts` | 3 tests checking `{ status: 'ok' }` — needs update |
| Express app factory | `backend/src/app.ts` `createApp()` | Pattern: middleware → routes — preserve this pattern |
| DB connection | `backend/src/db/index.ts` | Exports `db` and `schema` — import for health check |

### Architecture References

**Health Check Pattern** [Source: architecture.md §13.2]:
```typescript
app.get('/api/health', async (req, res) => {
  try {
    await db.select().from(todos).limit(1);
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: 'Database unavailable' });
  }
});
```

**Security Headers** [Source: architecture.md §7.3]:
```typescript
import helmet from 'helmet';
app.use(helmet());
```

**CORS Configuration** [Source: architecture.md §7.4]:
```typescript
import cors from 'cors';
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
```

### Middleware Order in `app.ts`

The correct middleware order is:

```
1. helmet()          — security headers first
2. cors()            — CORS before body parsing
3. express.json()    — body parsing
4. /api/health       — health check (before auth in future)
5. /api/todos        — application routes
```

### Current `app.ts` Structure

```typescript
// backend/src/app.ts — current
export function createApp() {
  const app = express();
  app.use(express.json({ limit: '100kb' }));
  // Manual CORS block (lines 17-26) — REPLACE
  app.get('/api/health', ...);  // Simple handler — UPGRADE
  app.use('/api/todos', todosRouter);
  return app;
}
export const app = createApp();
```

### Test File: `backend/src/__tests__/health.test.ts`

Current tests check for `{ status: 'ok' }`. After this story:
- Change to `{ status: 'healthy', timestamp: expect.any(String) }`
- Add timestamp format validation
- Add security header assertions
- Add CORS preflight test

### Existing Test Count

At last known checkpoint (Story 6.4): **208 tests passing** (41 backend + 167 frontend).

### Package Manager

This project uses npm workspaces. Install backend deps with:
```bash
cd backend && npm install helmet cors @types/cors
```
Or from root:
```bash
npm install --workspace=backend helmet cors
npm install --workspace=backend --save-dev @types/cors
```

### Project Structure Notes

- Monorepo: `frontend/`, `backend/`, `shared/`
- Backend entry: `backend/src/index.ts` → imports from `backend/src/app.ts`
- App factory pattern: `createApp()` returns Express app — used by tests
- DB module: `backend/src/db/index.ts` exports `db` (Drizzle) and `schema`
- Tests use `supertest` with the exported `app` instance

### References

- [Source: planning-artifacts/architecture.md §7.3] — Security Headers (Helmet)
- [Source: planning-artifacts/architecture.md §7.4] — CORS Configuration
- [Source: planning-artifacts/architecture.md §13.2] — Health Check Endpoint
- [Source: planning-artifacts/epics.md §Epic 7, Story 7.1] — Acceptance Criteria
- [Source: backend/src/app.ts] — Current Express app configuration
- [Source: backend/src/__tests__/health.test.ts] — Existing health endpoint tests
- [Source: backend/src/db/index.ts] — Database connection (import for health check)

---

## Previous Story Intelligence

**From Story 6.4 (Theme Flash Prevention):**
- 208 tests passing (41 backend + 167 frontend) — this is the regression baseline
- App factory pattern in `app.ts` is well-established — preserve it
- Tests use `supertest` with the exported `app` instance from `app.ts`

**From Git Analysis:**
- Most recent commit added performance testing (Playwright CDP metrics)
- E2E tests exist in `e2e/` directory using Playwright
- Backend tests in `backend/src/__tests__/` using Vitest + Supertest

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

