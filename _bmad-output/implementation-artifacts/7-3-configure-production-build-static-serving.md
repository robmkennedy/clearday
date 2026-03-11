# Story 7.3: Configure Production Build & Static Serving

Status: ready-for-dev

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

**As a** developer,
**I want** Express to serve the frontend build in production mode with SPA fallback,
**So that** the app deploys as a single unit without needing a separate static file server.

**Story Reference:** Epic 7 (Production Readiness), Story 7.3
**Points:** 3
**Priority:** P1 - High
**Sprint:** 5

---

## Acceptance Criteria

- [ ] AC1: `npm run build` compiles frontend to `frontend/dist` and backend to `backend/dist`
- [ ] AC2: When `NODE_ENV=production`, Express serves static files from `frontend/dist`
- [ ] AC3: All non-API routes return `index.html` (SPA fallback) in production
- [ ] AC4: API routes (`/api/*`) are NOT affected by SPA fallback — they return proper API responses
- [ ] AC5: `npm run start` starts the production server serving both API and static frontend
- [ ] AC6: All existing tests (208+) continue to pass — zero regressions
- [ ] AC7: Development mode is unaffected — Vite proxy continues to work normally

---

## Tasks / Subtasks

### Task 1: Verify build scripts already work (AC: 1)
- [ ] 1.1 Verify `npm run build` from root runs: `shared → backend → frontend` in order
- [ ] 1.2 Verify frontend builds to `frontend/dist/` with `index.html` and assets
- [ ] 1.3 Verify backend compiles to `backend/dist/` with `index.js` entry point
- [ ] 1.4 Fix any build issues if they arise

### Task 2: Add static file serving to Express (AC: 2, 4, 7)
- [ ] 2.1 In `backend/src/app.ts`, add conditional static file serving block
- [ ] 2.2 Only enable when `NODE_ENV === 'production'`
- [ ] 2.3 Use `express.static()` to serve files from the resolved path to `frontend/dist`
- [ ] 2.4 Use `path.resolve()` to compute correct absolute path from backend to `../frontend/dist`
- [ ] 2.5 Place static serving AFTER all `/api/*` routes to avoid intercepting API calls

### Task 3: Add SPA fallback route (AC: 3, 4)
- [ ] 3.1 Add catch-all route `app.get('*', ...)` that serves `frontend/dist/index.html`
- [ ] 3.2 Place this AFTER static middleware AND after all API routes (must be last route)
- [ ] 3.3 Ensure the catch-all does NOT match `/api/*` paths — API 404s should still return JSON errors
- [ ] 3.4 Only enable SPA fallback in production mode

### Task 4: Verify production startup (AC: 5)
- [ ] 4.1 Verify `npm run start` (`node dist/index.js` in backend) works correctly
- [ ] 4.2 Verify the compiled backend can find and serve `frontend/dist` files
- [ ] 4.3 Test: `NODE_ENV=production node backend/dist/index.js` serves both API and frontend

### Task 5: Tests (AC: 6, 7)
- [ ] 5.1 Add test: in production mode, static middleware is applied
- [ ] 5.2 Add test: SPA fallback serves HTML for non-API routes in production
- [ ] 5.3 Add test: API routes still return JSON (not HTML) even in production
- [ ] 5.4 Run full test suite — all 208+ tests must pass

---

## Dev Notes

### ⚠️ CRITICAL: What Already Exists — Do NOT Recreate

| What | Location | Current State |
|------|----------|---------------|
| Root build script | `package.json` `"build"` | `npm run build -w shared && npm run build -w backend && npm run build -w frontend` ✅ |
| Frontend build | `frontend/vite.config.ts` | `build: { outDir: 'dist', sourcemap: true }` ✅ |
| Backend build | `backend/package.json` `"build"` | `tsc` → compiles to `backend/dist/` ✅ |
| Start script | Root: `npm run start -w backend`, Backend: `node dist/index.js` ✅ |
| Express app | `backend/src/app.ts` | `createApp()` factory — add static serving here |
| Vite proxy | `frontend/vite.config.ts` | Proxies `/api` to backend in dev — must NOT be affected |

### Architecture References

**Production Deployment** [Source: architecture.md §9 (8.2)]:
> Option A: Single Server (Recommended for v1.0)
> - Express serves static frontend build
> - Handles API requests
> - SQLite database in /data

**Static Serving Pattern** [Source: architecture.md §9]:
```typescript
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

if (process.env.NODE_ENV === 'production') {
  // Serve frontend static build
  const frontendPath = path.resolve(__dirname, '../../frontend/dist');
  app.use(express.static(frontendPath));

  // SPA fallback — serve index.html for all non-API routes
  app.get('*', (req, res) => {
    res.sendFile(path.join(frontendPath, 'index.html'));
  });
}
```

### Middleware / Route Order in `app.ts` (After Stories 7-1 and 7-2)

```
1. helmet()              — security headers (7-1)
2. cors()                — CORS (7-1)
3. request logger        — pino-http (7-2)
4. express.json()        — body parsing
5. /api/health           — health check
6. /api/todos            — application routes
7. express.static()      — THIS STORY: serve frontend/dist (production only)
8. SPA fallback (*)      — THIS STORY: catch-all → index.html (production only)
```

**CRITICAL:** Static serving and SPA fallback MUST come AFTER all API routes. If placed before, they would intercept API requests.

### Path Resolution

The backend runs from `backend/dist/index.js` in production. The path to frontend dist is:
```
backend/dist/index.js → ../../frontend/dist
```

Use ES module compatible path resolution:
```typescript
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const frontendDist = path.resolve(__dirname, '../../frontend/dist');
```

**⚠️ Important:** The `__dirname` trick is needed because this is an ES module (`"type": "module"` in package.json). Native `__dirname` is NOT available in ESM.

### Protecting API Routes from SPA Fallback

The SPA catch-all must NOT intercept API 404s. Two approaches:

**Option A (simple):** Place catch-all after API routes and check path:
```typescript
app.get('*', (req, res, next) => {
  if (req.path.startsWith('/api')) {
    return next(); // Let API 404 handler respond
  }
  res.sendFile(path.join(frontendDist, 'index.html'));
});
```

**Option B:** Use a non-API pattern:
```typescript
app.get(/^(?!\/api).*/, (req, res) => {
  res.sendFile(path.join(frontendDist, 'index.html'));
});
```

### Testing Considerations

Testing production mode requires either:
1. Setting `NODE_ENV=production` before creating the app (complicates test isolation)
2. Accepting the `createApp()` function conditionally includes static middleware

**Recommendation:** Create a conditional check in `createApp()` based on `NODE_ENV`, and test by setting the env var before importing the app in specific test files.

### Project Structure Notes

- Backend is ESM: `"type": "module"` in package.json
- Backend tsconfig: `"module": "NodeNext"`, `"outDir": "dist"`, `"rootDir": "src"`
- Frontend vite config: `build.outDir: 'dist'`
- Root start script: `npm run start -w backend` → `node dist/index.js`

### References

- [Source: planning-artifacts/architecture.md §9] — Deployment Architecture
- [Source: planning-artifacts/epics.md §Epic 7, Story 7.3] — Acceptance Criteria
- [Source: backend/src/app.ts] — Express app (add static serving)
- [Source: backend/src/index.ts] — Server entry point
- [Source: frontend/vite.config.ts] — Frontend build config
- [Source: package.json] — Root workspace scripts

---

## Previous Story Intelligence

**From Story 7-1 (Health Check & Security Middleware):**
- `app.ts` refactored with helmet + cors
- Middleware order pattern established

**From Story 7-2 (Structured Logging):**
- Pino logger and request logging middleware added to `app.ts`
- Logger available for startup messages in `index.ts`

**Regression baseline:** 208+ tests (41 backend + 167 frontend)

---

## Dev Agent Record

### Agent Model Used

{{agent_model_name_version}}

### Debug Log References

### Completion Notes List

### File List

