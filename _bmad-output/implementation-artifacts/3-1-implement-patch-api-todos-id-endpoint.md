# Story: Implement PATCH /api/todos/:id Endpoint

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 2-3 |
| **Epic** | Epic 3: Task Completion & Organization |
| **Sprint** | Sprint 2 |
| **Points** | 3 |
| **Priority** | P0 - Critical |
| **Status** | done |

## Story
**As a** developer,  
**I want** an API endpoint to update todo completion status,  
**So that** the frontend can toggle tasks.

## Acceptance Criteria
- [x] AC-1: `PATCH /api/todos/:id` with `{ "completed": true }` returns 200 with updated todo
- [x] AC-2: `PATCH /api/todos/:id` with `{ "text": "new text" }` updates the text
- [x] AC-3: Non-existent todo ID returns 404 with error details
- [x] AC-4: `updateTodoSchema` validates `completed` as optional boolean
- [x] AC-5: `updateTodoSchema` validates `text` as optional string (1-500 chars, trimmed)

## Tasks/Subtasks
- [x] Task 1: Create `updateTodoSchema` in shared schemas
  - [x] 1.1: Add `updateTodoSchema` to `shared/schemas/todo.ts` (already existed)
  - [x] 1.2: Validate `completed` as optional boolean (already existed)
  - [x] 1.3: Validate `text` as optional string (1-500 chars, trimmed) (already existed)
  - [x] 1.4: Export from shared index (already existed)
  - [x] 1.5: Write unit tests for schema validation (already existed)
- [x] Task 2: Implement PATCH route in backend
  - [x] 2.1: Add `PATCH /api/todos/:id` route in `backend/src/routes/todos.ts`
  - [x] 2.2: Validate request body with `updateTodoSchema`
  - [x] 2.3: Check if todo exists, return 404 if not
  - [x] 2.4: Update only provided fields in database
  - [x] 2.5: Return full updated todo object with 200 status
  - [x] 2.6: Write integration tests for PATCH endpoint

## Dev Notes

### Architecture Requirements
- Partial update - only provided fields are modified
- Use Drizzle ORM `update` operation with `set()` and `where()`
- Return full updated todo object after update

### Existing Patterns
- Follow existing `POST /api/todos` pattern for validation
- Use `todoIdSchema` for path parameter validation (already exists)
- Error response format: `{ error: { code, message, details? } }`

### Technical Specifications
- Route: `PATCH /api/todos/:id`
- Request body: `{ completed?: boolean, text?: string }`
- Response 200: Full todo object
- Response 404: `{ error: { code: "NOT_FOUND", message: "Todo not found" } }`

### Files to Reference
- `backend/src/routes/todos.ts` - existing routes
- `shared/schemas/todo.ts` - existing schemas
- `backend/src/__tests__/routes/todos.test.ts` - test patterns

## Dev Agent Record

### Implementation Plan
- `updateTodoSchema` already existed in shared schemas with tests
- Added `updateTodoSchema` and `todoIdSchema` inline in backend routes (mirroring shared)
- Implemented PATCH endpoint with validation, 404 handling, partial updates
- Added `eq` import from drizzle-orm for WHERE clause

### Debug Log
- No issues encountered

### Completion Notes
✅ S2-003 implementation complete:
- PATCH endpoint handles both `completed` and `text` updates
- Partial updates work correctly (only provided fields updated)
- 404 response for non-existent todos
- Validation errors return 400 with structured error response
- 12 integration tests added, all passing

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved (after fixes)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| HIGH | Duplicate DB queries (3 ops → 2) | Used `update().returning()` for atomic update+return |
| HIGH | Race condition between check and update | Eliminated by using `returning()` - no separate existence check |
| MEDIUM | Duplicate 404 response blocks | Acceptable for now - code is readable |
| MEDIUM | Missing test for `completed: false` | Added test case |
| LOW | Console.error for logging | Documented tech debt |
| LOW | Schema duplication | Documented intentional tech debt |

### Action Items
- [x] H1: Use `returning()` to eliminate duplicate queries
- [x] H2: Eliminate race condition with atomic update+return
- [x] M2: Add test for toggling completed back to false

### Test Results Post-Fix
- Backend: 36 tests passing ✅
- 1 new test added for `completed: false` toggle

## File List
| File | Action |
|------|--------|
| `backend/src/routes/todos.ts` | Modified |
| `backend/src/__tests__/routes/todos.test.ts` | Modified |

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - PATCH endpoint with 11 integration tests |
| 2026-03-06 | Code review: Fixed 2 HIGH issues (duplicate queries, race condition) + 1 test added |


