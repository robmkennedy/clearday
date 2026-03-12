# Story: Implement TodoList & useTodos Hook

## Story Info
| Field | Value |
|-------|-------|
| **Story ID** | 2-4 |
| **Epic** | Epic 2: Core Task Capture |
| **Sprint** | Sprint 2 |
| **Points** | 3 |
| **Priority** | P0 - Critical |
| **Status** | done |

## Story
**As a** user,  
**I want** to see my tasks in a list,  
**So that** I know what I've captured.

## Acceptance Criteria
- [x] AC-1: Tasks are displayed in a list when page loads
- [x] AC-2: Tasks are sorted newest first (by createdAt descending)
- [x] AC-3: `useTodos` hook uses React Query for data fetching
- [x] AC-4: Hook returns `{ data, isLoading, isError, refetch }`
- [x] AC-5: React Query manages caching and refetching

## Tasks/Subtasks
- [x] Task 1: Create `useTodos` hook with React Query
  - [x] 1.1: Create `frontend/src/hooks/useTodos.ts` file
  - [x] 1.2: Implement `fetchTodos` function to call `/api/todos`
  - [x] 1.3: Implement `useTodos` hook using `useQuery` with query key `['todos']`
  - [x] 1.4: Return `{ data, isLoading, isError, refetch }` from hook
  - [x] 1.5: Write unit tests for `useTodos` hook
- [x] Task 2: Create `TodoList` component
  - [x] 2.1: Create `frontend/src/components/TodoList/TodoList.tsx`
  - [x] 2.2: Create `frontend/src/components/TodoList/TodoList.module.css`
  - [x] 2.3: Create `frontend/src/components/TodoList/index.ts` barrel export
  - [x] 2.4: Consume `useTodos` hook in component
  - [x] 2.5: Display todos sorted by `createdAt` descending (newest first)
  - [x] 2.6: Write unit tests for `TodoList` component
- [x] Task 3: Integrate `TodoList` into App
  - [x] 3.1: Replace inline todo list rendering in `App.tsx` with `TodoList` component
  - [x] 3.2: Update App tests if needed
  - [x] 3.3: Verify integration works end-to-end

## Dev Notes

### Architecture Requirements
- Use TanStack Query v5 `useQuery` hook
- Query key: `['todos']`
- Fetch from `/api/todos`
- Configure staleTime (1 minute default already in QueryClient)
- Use shared `Todo` type from `@clearday/shared`

### Existing Patterns
- `TaskInput` component pattern: component folder with `.tsx`, `.module.css`, `index.ts`
- QueryClient already configured in `App.tsx` with staleTime: 1 minute
- Todo fetching logic already exists inline in `App.tsx` - extract to hook

### Technical Specifications
- Move `fetchTodos` function from `App.tsx` to hook file
- Use `Todo` type from shared package
- Sort todos in component (API returns chronological order)

### Files to Reference
- `frontend/src/App.tsx` - existing todo fetching pattern
- `frontend/src/components/TaskInput/` - component folder structure
- `shared/types/todo.ts` - Todo interface

## Dev Agent Record

### Implementation Plan
- Created `useTodos` hook using TanStack Query v5 `useQuery`
- Exported `todosQueryKey` for use in mutations (cache invalidation)
- Created `TodoList` component consuming `useTodos` hook
- Sorting handled in component (newest first by createdAt)
- Refactored `App.tsx` to use `TodoList` component, removed inline fetching

### Debug Log
- Fixed import path: `@clearday/shared` → `@shared/types` (matching tsconfig paths)
- Renamed test file `.ts` → `.tsx` for JSX support

### Completion Notes
✅ Story S2-001 implementation complete:
- `useTodos` hook with 7 unit tests
- `TodoList` component with 6 unit tests  
- App integration complete, all 44 frontend tests passing
- Todos sorted by createdAt descending (newest first)

## Senior Developer Review (AI)

**Review Date:** 2026-03-06  
**Outcome:** ✅ Approved (after fixes)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| HIGH | Missing `error` object in useTodos return | Added `error: query.error` to hook return |
| MEDIUM | No retry mechanism in error state | Added retry button calling `refetch()` |
| MEDIUM | Loading/error states lacked ARIA attributes | Added `role="status"` and `role="alert"` |
| MEDIUM | Duplicate test helper code | Extracted to `test/test-utils.tsx` |
| MEDIUM | CSS not scoped for loading/error states | Added CSS classes for all states |

### Action Items
- [x] H1: Add error object to useTodos hook return
- [x] M1: Add retry button to error state
- [x] M2: Add ARIA attributes for accessibility
- [x] M3: Extract shared test utilities
- [x] M4: Add CSS classes for loading/error states

### Test Results Post-Fix
- Frontend: 46 tests passing ✅
- All original tests still pass
- 2 new tests added for retry button and error object

## File List
| File | Action |
|------|--------|
| `frontend/src/hooks/useTodos.ts` | Created |
| `frontend/src/hooks/index.ts` | Created |
| `frontend/src/hooks/__tests__/useTodos.test.tsx` | Created |
| `frontend/src/components/TodoList/TodoList.tsx` | Created |
| `frontend/src/components/TodoList/TodoList.module.css` | Created |
| `frontend/src/components/TodoList/index.ts` | Created |
| `frontend/src/components/TodoList/__tests__/TodoList.test.tsx` | Created |
| `frontend/src/test/test-utils.tsx` | Created |
| `frontend/src/App.tsx` | Modified |

## Change Log
| Date | Change |
|------|--------|
| 2026-03-06 | Story file created |
| 2026-03-06 | Story implementation complete - useTodos hook, TodoList component, App integration |
| 2026-03-06 | Code review: Fixed 5 issues (1 HIGH, 4 MEDIUM) - added error object, retry button, ARIA attributes, shared test utils |


