# Test ID Implementation Plan

**Created**: 2026-03-06
**Status**: Ready for Implementation
**Priority**: P2 (Medium)

---

## Overview

This document outlines the test ID scheme for the clearday project to enable requirements traceability between user stories and test cases.

## Test ID Format

```
{story-id}-{test-type}-{sequence}
```

### Components

| Component | Format | Example | Description |
|-----------|--------|---------|-------------|
| `story-id` | `S{sprint}-{story}` | `S2-003` | Sprint and story number from backlog |
| `test-type` | `E2E`, `API`, `UNIT`, `INT` | `E2E` | Test level classification |
| `sequence` | `{3-digit}` | `001` | Sequential number within story/type |

### Examples

| Test ID | Meaning |
|---------|---------|
| `S2-003-API-001` | Sprint 2, Story 3, API test #1 |
| `S2-005-E2E-002` | Sprint 2, Story 5, E2E test #2 |
| `S2-001-UNIT-003` | Sprint 2, Story 1, Unit test #3 |

---

## Implementation by Test Type

### E2E Tests (Playwright)

Add test IDs to test names with priority tags:

```typescript
// e2e/critical-paths/toggle-completion.spec.ts
test.describe('S2-006: Toggle Completion', () => {
  test('S2-006-E2E-001: user can mark task as complete @p0', async ({ page }) => {
    // ...
  });

  test('S2-006-E2E-002: completed task moves to Done section @p0', async ({ page }) => {
    // ...
  });

  test('S2-006-E2E-003: user can unmark completed task @p1', async ({ page }) => {
    // ...
  });
});
```

### API Tests (Vitest + Supertest)

Test IDs are already in test names via `@p0`/`@p1` tags. Add story references:

```typescript
// backend/src/__tests__/routes/todos.test.ts
describe('PATCH /api/todos/:id', () => {
  // S2-003: PATCH API Story
  it('S2-003-API-001: returns 200 with updated todo when updating completed @p0', async () => {
    // ...
  });

  it('S2-003-API-002: can toggle completed back to false @p1', async () => {
    // ...
  });
});
```

### Component Tests (Vitest + RTL)

```typescript
// frontend/src/components/TaskItem/__tests__/TaskItem.test.tsx
describe('S2-005: TaskItem Component', () => {
  it('S2-005-UNIT-001: renders task text @p0', () => {
    // ...
  });

  it('S2-005-UNIT-002: shows checkbox with correct state @p0', () => {
    // ...
  });
});
```

---

## Sprint 2 Story-to-Test Mapping

| Story ID | Description | Test IDs |
|----------|-------------|----------|
| S2-001 | TodoList & useTodos Hook | S2-001-E2E-001..003, S2-001-API-001..004, S2-001-UNIT-001..007 |
| S2-002 | Optimistic Add with Rollback | S2-002-E2E-001..004, S2-002-UNIT-001..006 |
| S2-003 | PATCH /api/todos/:id | S2-003-API-001..012 |
| S2-004 | Two-Section Layout | S2-004-E2E-001..003, S2-004-UNIT-001..006 |
| S2-005 | TaskItem Component | S2-005-E2E-001..002, S2-005-UNIT-001..023 |
| S2-006 | Toggle Completion | S2-006-E2E-001..003, S2-006-UNIT-001..006 |
| S2-007 | Task Animations | S2-007-E2E-001..002, S2-007-UNIT-001..004 |
| S2-008 | DELETE /api/todos/:id | S2-008-API-001..005 |
| S2-009 | Delete Button | S2-009-E2E-001..003, S2-009-UNIT-001..006 |
| S2-010 | Delete Animation | S2-010-E2E-001..002, S2-010-UNIT-001..002 |

---

## Migration Strategy

### Phase 1: New Tests (Immediate)
- All new tests created from Sprint 3 onward use the ID scheme
- Template: `{story-id}-{test-type}-{sequence}: {description} @{priority}`

### Phase 2: Existing Tests (Sprint 3)
- Add IDs to existing tests during refactoring
- Start with P0 critical path tests
- Use `grep -r "@p0" --include="*.spec.ts" --include="*.test.ts"` to find candidates

### Phase 3: Automation (Backlog)
- Add CI script to validate test ID format
- Generate coverage report from test IDs
- Link test results to story IDs in PR comments

---

## Validation Script

Add to `package.json`:

```json
{
  "scripts": {
    "test:validate-ids": "grep -rE '^\\s*(it|test)\\(' --include='*.test.ts' --include='*.spec.ts' | grep -v 'S[0-9]-[0-9]' | head -20"
  }
}
```

This script finds tests missing the ID scheme.

---

## Benefits

1. **Traceability**: Map any test failure to its user story
2. **Coverage Reporting**: Generate story-level coverage reports
3. **Priority Execution**: Filter tests by story priority
4. **Impact Analysis**: Know which stories are affected by test failures
5. **Sprint Planning**: Identify untested stories before deployment

---

## Next Steps

1. [ ] Add IDs to Sprint 2 P0 tests (highest priority)
2. [ ] Add IDs to Sprint 2 P1 tests
3. [ ] Create validation script in CI
4. [ ] Document in project README

---

*Plan created by TEA Agent during Sprint 2 Test Review*

