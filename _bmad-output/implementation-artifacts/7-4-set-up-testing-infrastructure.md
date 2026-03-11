# Story 7.4: Set Up Testing Infrastructure

Status: done

<!-- Note: Validation is optional. Run validate-create-story for quality check before dev-story. -->

## Story

**As a** developer,
**I want** a fully verified and documented testing infrastructure,
**So that** I can confidently write and run tests across all layers of the application.

**Story Reference:** Epic 7 (Production Readiness), Story 7.4
**Points:** 2
**Priority:** P1 - High
**Sprint:** 5

---

## Acceptance Criteria

- [x] AC1: Vitest runs unit tests for both frontend and backend via `npm run test`
- [x] AC2: React Testing Library is available and configured for component tests
- [x] AC3: Supertest is available and configured for API integration tests
- [x] AC4: Playwright is configured for E2E tests via `npm run test:e2e`
- [x] AC5: axe-core is integrated for accessibility testing (both Playwright and component-level)
- [x] AC6: `npm run test` runs all unit tests (shared + backend + frontend)
- [x] AC7: `npm run test:e2e` runs all Playwright E2E tests
- [x] AC8: All existing tests pass — zero regressions
- [x] AC9: Coverage thresholds are configured (80% for statements, branches, functions, lines)

---

## Tasks / Subtasks

### Task 1: Verify unit testing infrastructure (AC: 1, 6, 9)
- [x] 1.1 Run `npm run test` from root — verify it executes shared → backend → frontend tests
- [x] 1.2 Verify backend Vitest config (`backend/vitest.config.ts`): environment=node, setupFiles, coverage thresholds at 80%
- [x] 1.3 Verify frontend Vitest config (`frontend/vitest.config.ts`): environment=jsdom, setupFiles, coverage thresholds at 80%
- [x] 1.4 Verify root Vitest config (`vitest.config.ts`): excludes frontend/backend/e2e (for shared tests only)
- [x] 1.5 Fix any test failures or configuration issues

### Task 2: Verify React Testing Library setup (AC: 2)
- [x] 2.1 Verify `@testing-library/react`, `@testing-library/user-event`, `@testing-library/jest-dom` are installed in `frontend/package.json`
- [x] 2.2 Verify `frontend/src/test/setup.ts` imports `@testing-library/jest-dom/vitest` and calls `cleanup()`
- [x] 2.3 Verify `window.matchMedia` is mocked in test setup (needed for theme tests)
- [x] 2.4 Run a sample component test to verify the setup works

### Task 3: Verify Supertest API testing setup (AC: 3)
- [x] 3.1 Verify `supertest` and `@types/supertest` are installed (root `package.json` devDependencies)
- [x] 3.2 Verify `backend/src/__tests__/setup.ts` properly initializes test database
- [x] 3.3 Verify existing API tests (`backend/src/__tests__/routes/todos.test.ts`) use supertest with the `app` export
- [x] 3.4 Run backend tests to confirm API integration tests pass

### Task 4: Verify Playwright E2E setup (AC: 4, 7)
- [x] 4.1 Verify `@playwright/test` is installed in root `package.json`
- [x] 4.2 Verify `playwright.config.ts` has: testDir=`./e2e`, webServer command, multi-browser projects
- [x] 4.3 Verify E2E tests exist: `e2e/task-input.spec.ts`, `e2e/theme.spec.ts`, `e2e/ui-states.spec.ts`, `e2e/accessibility.spec.ts`, `e2e/performance.spec.ts`, `e2e/critical-paths/add-task.spec.ts`
- [x] 4.4 Verify `npm run test:e2e` command works (may need running servers — webServer config handles this)

### Task 5: Verify axe-core accessibility testing (AC: 5)
- [x] 5.1 Verify `@axe-core/playwright` is installed for E2E accessibility tests
- [x] 5.2 Verify `jest-axe` / `@types/jest-axe` are installed for component-level accessibility tests
- [x] 5.3 Verify `e2e/accessibility.spec.ts` uses axe-core for WCAG 2.1 AA checks
- [x] 5.4 Run accessibility tests to confirm they pass

### Task 6: Fill any gaps and document (AC: 8)
- [x] 6.1 If any of the above verifications fail, fix the issue
- [x] 6.2 Ensure all test scripts are documented in root `package.json`
- [x] 6.3 Run the full test suite one final time — all tests must pass

---

## Dev Notes

### ⚠️ CRITICAL: Most Infrastructure Already Exists!

This story is primarily a **verification and gap-filling** story. The previous epics already established extensive testing infrastructure. The dev agent should **verify, not recreate**.

| What | Location | Current State |
|------|----------|---------------|
| Root Vitest config | `vitest.config.ts` | ✅ Configured — node env, 80% coverage thresholds |
| Backend Vitest config | `backend/vitest.config.ts` | ✅ Configured — node env, setup file, 80% thresholds |
| Frontend Vitest config | `frontend/vitest.config.ts` | ✅ Configured — jsdom env, setup file, 80% thresholds, CSS modules |
| Backend test setup | `backend/src/__tests__/setup.ts` | ✅ Creates DB table, clears between tests |
| Frontend test setup | `frontend/src/test/setup.ts` | ✅ RTL cleanup, jest-dom matchers, matchMedia mock |
| Playwright config | `playwright.config.ts` | ✅ Multi-browser (Chrome, FF, Safari, Mobile), webServer |
| React Testing Library | `frontend/package.json` | ✅ `@testing-library/react`, `user-event`, `jest-dom` installed |
| Supertest | Root `package.json` | ✅ `supertest` + `@types/supertest` installed |
| axe-core | Root `package.json` | ✅ `@axe-core/playwright` + `jest-axe` installed |
| Test scripts | Root `package.json` | ✅ `test`, `test:frontend`, `test:backend`, `test:shared`, `test:e2e` |

### Existing Test Inventory

| Location | Test Files | Framework |
|----------|-----------|-----------|
| `backend/src/__tests__/health.test.ts` | Health endpoint tests | Vitest + Supertest |
| `backend/src/__tests__/routes/todos.test.ts` | CRUD API tests | Vitest + Supertest |
| `frontend/src/__tests__/` | Component tests | Vitest + RTL |
| `e2e/task-input.spec.ts` | Task input E2E | Playwright |
| `e2e/theme.spec.ts` | Theme toggle E2E | Playwright |
| `e2e/ui-states.spec.ts` | UI states E2E | Playwright |
| `e2e/accessibility.spec.ts` | Accessibility E2E | Playwright + axe-core |
| `e2e/performance.spec.ts` | Performance E2E | Playwright + CDP |
| `e2e/critical-paths/add-task.spec.ts` | Critical path E2E | Playwright |

### Likely Gaps to Check

1. **Coverage reports:** Verify `npm run test:coverage` works for both frontend and backend
2. **Test isolation:** Ensure backend tests properly reset DB state between runs
3. **E2E stability:** E2E tests may need `webServer` timeout tuning
4. **Type checking in tests:** Ensure `tsconfig` includes test files
5. **CI readiness:** Scripts should work in CI environment (Playwright `CI` env var support already in config)

### Test Commands Summary

| Command | Scope | What It Runs |
|---------|-------|-------------|
| `npm run test` | All unit | shared → backend → frontend Vitest tests |
| `npm run test:backend` | Backend | `vitest run` in backend/ |
| `npm run test:frontend` | Frontend | `vitest run` in frontend/ |
| `npm run test:shared` | Shared | `vitest --run` at root (shared schemas) |
| `npm run test:e2e` | E2E | `playwright test` (starts dev servers automatically) |

### Architecture References

**Testing Pyramid** [Source: architecture.md §12]:
```
        E2E (Playwright)         — Critical user flows
       Integration (Supertest)   — API endpoints with real DB
      Unit (Vitest + RTL)        — Components, hooks, validation
```

**Testing Tools** [Source: architecture.md §12.2]:
| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit (Frontend) | Vitest + React Testing Library | Components, hooks |
| Unit (Backend) | Vitest | Validation, utilities |
| Integration | Vitest + Supertest | API endpoints |
| E2E | Playwright | Critical user paths |
| Accessibility | axe-core + Playwright | WCAG 2.1 AA compliance |

**Test File Conventions** [Source: architecture.md §12.3]:
```
frontend/src/__tests__/           — Frontend component/hook tests
backend/src/__tests__/            — Backend unit/integration tests
e2e/                              — Playwright E2E tests
```

### References

- [Source: planning-artifacts/architecture.md §12] — Testing Strategy
- [Source: planning-artifacts/epics.md §Epic 7, Story 7.4] — Acceptance Criteria
- [Source: vitest.config.ts] — Root Vitest config
- [Source: backend/vitest.config.ts] — Backend Vitest config
- [Source: frontend/vitest.config.ts] — Frontend Vitest config
- [Source: playwright.config.ts] — Playwright config
- [Source: backend/src/__tests__/setup.ts] — Backend test setup
- [Source: frontend/src/test/setup.ts] — Frontend test setup
- [Source: package.json] — Root test scripts

---

## Previous Story Intelligence

**From Stories 7-1 through 7-3:**
- New backend middleware (helmet, cors, pino) may affect API test assertions
- Health check tests updated in 7-1 — verify they still pass
- Production mode changes in 7-3 — ensure test env defaults to development
- Logger silence in test env should have been handled in 7-2

**Regression baseline:** 208+ tests (41 backend + 167 frontend)

---

## Dev Agent Record

### Agent Model Used

Claude (Anthropic) — via GitHub Copilot

### Debug Log References

- No issues found — all testing infrastructure was already properly configured from previous sprints.

### Completion Notes List

- **Task 1**: Verified `npm run test` runs shared (21) → backend (62) → frontend (168) = 251 tests. All three vitest configs have 80% coverage thresholds. Root config properly excludes frontend/backend/e2e.
- **Task 2**: Verified RTL stack: `@testing-library/react@14`, `user-event@14`, `jest-dom@6`. Setup file imports `jest-dom/vitest`, calls `cleanup()`, mocks `window.matchMedia`. Component tests passing.
- **Task 3**: Verified `supertest@7` + `@types/supertest` in root devDeps. Backend setup.ts initializes DB table, clears between tests. 32 API integration tests passing via supertest.
- **Task 4**: Verified Playwright: `@playwright/test` installed, config has `testDir=./e2e`, 5 browser projects (Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari), `webServer` auto-starts dev. All 6 E2E test files present.
- **Task 5**: Verified axe-core: `@axe-core/playwright` for E2E, `jest-axe` + `@types/jest-axe` for component-level. `accessibility.spec.ts` uses AxeBuilder, `TaskInput.a11y.test.tsx` uses jest-axe.
- **Task 6**: No gaps found. All test scripts documented in root package.json. Final suite: 251 tests, 0 failures.

### Change Log

- 2026-03-11: Story 7.4 verified — all testing infrastructure confirmed operational. No code changes needed. 251 total tests passing.

### File List

- No files modified — verification-only story. All infrastructure was already correctly configured.

