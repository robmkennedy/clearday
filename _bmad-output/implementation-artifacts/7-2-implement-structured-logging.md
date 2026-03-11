# Story 7.2: Implement Structured Logging

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

**As a** developer,
**I want** structured logging with Pino that logs requests with method, path, status, and duration,
**So that** I can debug and monitor the application effectively in development and production.

**Story Reference:** Epic 7 (Production Readiness), Story 7.2
**Points:** 3
**Priority:** P1 - High
**Sprint:** 5

---

## Acceptance Criteria

- [x] AC1: All application logging uses Pino structured logger (no `console.log` in production code)
- [x] AC2: HTTP requests are logged with method, path, status code, and response duration
- [x] AC3: Development environment uses `pino-pretty` for human-readable log output
- [x] AC4: Production environment outputs JSON-formatted logs (no pino-pretty)
- [x] AC5: Log level is configurable via `LOG_LEVEL` environment variable (default: `info`)
- [x] AC6: All existing tests (208+) continue to pass — zero regressions
- [x] AC7: New tests verify request logging middleware captures method, path, status, and duration

---

## Tasks / Subtasks

### Task 1: Install dependencies (AC: 1, 3)
- [x] 1.1 Install `pino` as a production dependency in `backend/package.json`
- [x] 1.2 Install `pino-pretty` as a dev dependency in `backend/package.json`
- [x] 1.3 Install `pino-http` as a production dependency for Express request logging

### Task 2: Create logger module (AC: 1, 3, 4, 5)
- [x] 2.1 Create `backend/src/middleware/logger.ts`
- [x] 2.2 Export a configured Pino instance with log level from `process.env.LOG_LEVEL || 'info'`
- [x] 2.3 In development (`NODE_ENV !== 'production'`): use `pino-pretty` transport
- [x] 2.4 In production: use default JSON output (no transport)

### Task 3: Add request logging middleware (AC: 2)
- [x] 3.1 Create Express middleware using `pino-http` (or custom middleware) that logs: method, path, status, duration (ms)
- [x] 3.2 Import and apply middleware in `backend/src/app.ts` — place after security middleware (helmet, cors), before routes
- [x] 3.3 Ensure request logs include response time calculation (start → finish)

### Task 4: Replace console.log with logger (AC: 1)
- [x] 4.1 Replace `console.log` in `backend/src/index.ts` startup message with `logger.info()`
- [x] 4.2 Search for any other `console.log` / `console.error` in backend `src/` and replace with logger calls
- [x] 4.3 Do NOT change `console.log` in test setup files (`__tests__/setup.ts`) — those are test diagnostics

### Task 5: Update tests (AC: 6, 7)
- [x] 5.1 Add test: verify request logging middleware is applied (make request, check no errors)
- [x] 5.2 Add test: verify logger module exports configured Pino instance
- [x] 5.3 Ensure Pino logs don't pollute test output — consider setting `LOG_LEVEL=silent` in test setup or using `pino({ level: 'silent' })` in test env
- [x] 5.4 Run full test suite — all 208+ tests must pass

---

## Dev Notes

### ⚠️ CRITICAL: What Already Exists — Do NOT Recreate

| What | Location | Current State |
|------|----------|---------------|
| Middleware directory | `backend/src/middleware/` | Already exists with `errorHandler.ts` and `validation.ts` — add `logger.ts` here |
| Express app factory | `backend/src/app.ts` `createApp()` | Add request logging middleware to the chain |
| Server startup | `backend/src/index.ts` | `console.log('🚀 Server running...')` — replace with logger |
| Test setup | `backend/src/__tests__/setup.ts` | Has `console.log` for test diagnostics — do NOT replace these |

### Architecture References

**Logger Configuration** [Source: architecture.md §13.1]:
```typescript
// backend/src/middleware/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
});
```

### Middleware Order in `app.ts`

After Story 7-1, the middleware order should be:
```
1. helmet()             — security headers (from 7-1)
2. cors()               — CORS (from 7-1)
3. request logger       — THIS STORY: pino-http or custom middleware
4. express.json()       — body parsing
5. /api/health          — health check
6. /api/todos           — application routes
```

### `pino-http` vs Custom Middleware

**Recommended: `pino-http`** — Purpose-built for Express request logging:
```typescript
import pinoHttp from 'pino-http';
import { logger } from './middleware/logger.js';

app.use(pinoHttp({ logger }));
```

This automatically logs: method, url, status, responseTime for every request.

**Alternative: Custom middleware** (if pino-http is too noisy for dev):
```typescript
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    logger.info({
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      duration: Date.now() - start,
    }, `${req.method} ${req.originalUrl} ${res.statusCode}`);
  });
  next();
});
```

### Suppressing Logs in Tests

Pino logs can be noisy in test output. Two options:

**Option A (recommended):** Set environment variable in test setup:
```typescript
// backend/src/__tests__/setup.ts — add near top
process.env.LOG_LEVEL = 'silent';
```

**Option B:** The logger module checks NODE_ENV:
```typescript
const level = process.env.NODE_ENV === 'test'
  ? 'silent'
  : (process.env.LOG_LEVEL || 'info');
```

### Environment Variables

| Variable | Default | Description |
|----------|---------|-------------|
| `LOG_LEVEL` | `info` | Pino log level: `fatal`, `error`, `warn`, `info`, `debug`, `trace`, `silent` |
| `NODE_ENV` | `development` | Controls pino-pretty transport |

### Package Manager

```bash
npm install --workspace=backend pino pino-http
npm install --workspace=backend --save-dev pino-pretty @types/pino-http
```

### References

- [Source: planning-artifacts/architecture.md §13.1] — Logging Configuration
- [Source: planning-artifacts/epics.md §Epic 7, Story 7.2] — Acceptance Criteria
- [Source: backend/src/app.ts] — Express app (add middleware)
- [Source: backend/src/index.ts] — Server startup (replace console.log)
- [Source: backend/src/middleware/] — Existing middleware directory

---

## Previous Story Intelligence

**From Story 7-1 (Health Check & Security Middleware):**
- `app.ts` will have been refactored with helmet + cors middleware
- Middleware order pattern is established: helmet → cors → ... → routes
- New request logging should slot in after cors, before express.json()
- Test patterns from 7-1 health tests can be reused

**Regression baseline:** 208+ tests (41 backend + 167 frontend)

---

## Dev Agent Record

### Agent Model Used

Claude (Anthropic) — via GitHub Copilot

### Debug Log References

- Set `LOG_LEVEL=silent` in test setup to prevent Pino output from polluting test results.
- Only one `console.log` existed in production code (`index.ts`); test setup `console.log` preserved per story instructions.

### Completion Notes List

- **Task 1**: Installed `pino@^9`, `pino-http` as production deps; `pino-pretty`, `@types/pino-http` as dev deps in backend workspace.
- **Task 2**: Created `backend/src/middleware/logger.ts` — Pino logger with `LOG_LEVEL` env var support, pino-pretty transport in non-production envs.
- **Task 3**: Added `pinoHttp({ logger })` middleware in `app.ts` after CORS, before body parsing. Logs method, url, status, responseTime automatically.
- **Task 4**: Replaced `console.log` in `backend/src/index.ts` with `logger.info()`. No other `console.log` in production code. Test setup `console.log` left intact.
- **Task 5**: Created `backend/src/__tests__/middleware/logger.test.ts` with 6 tests: logger export verification, log level config, request logging for health/todos/POST/multi-method. Added `LOG_LEVEL=silent` to test setup. All 224 tests pass (56 backend + 168 frontend).

### Change Log

- 2026-03-11: Story 7.2 implemented — Pino structured logging with pino-http request middleware, pino-pretty dev transport, LOG_LEVEL env config, 6 new logger tests. 224 total tests passing.
- 2026-03-11: Code review fixes — replaced 4× `console.error` in `todos.ts` with `logger.error()` (H1), changed pino-pretty transport to `development`-only (M2), updated File List (H2).

### File List

- `backend/package.json` — added pino, pino-pretty (pino-http removed during 7.3)
- `backend/src/middleware/logger.ts` — NEW: Pino logger module with env-based config
- `backend/src/app.ts` — added custom request logging middleware
- `backend/src/index.ts` — replaced console.log with logger.info
- `backend/src/routes/todos.ts` — replaced 4× console.error with logger.error
- `backend/src/__tests__/setup.ts` — added LOG_LEVEL=silent for test environment
- `backend/src/__tests__/middleware/logger.test.ts` — NEW: 6 logger/request-logging tests

