# Story 6-1: Implement useTheme Hook

## Story

**As a** user,  
**I want** theme preference to persist and respect system settings,  
**So that** the app remembers my choice.

**Story Reference:** Epic 6, Story 6.1  
**Points:** 5  
**Priority:** P0 - Critical  
**Sprint:** 4

---

## Acceptance Criteria

- [x] AC1: On first load with no saved preference, detect system preference via `prefers-color-scheme`
- [x] AC2: Apply light or dark theme based on system preference detection
- [x] AC3: When saved preference exists in localStorage, it takes priority over system preference
- [x] AC4: Toggling theme switches instantly and saves to localStorage
- [x] AC5: `data-theme` attribute is set on `<html>` element (`"light"` or `"dark"`)
- [x] AC6: Hook returns: `{ theme, toggleTheme, isDark }`
- [x] AC7: Listens to system preference changes (mediaQuery change listener)

---

## Tasks/Subtasks

### Task 1: Create useTheme hook with system preference detection
- [x] 1.1 Create `frontend/src/hooks/useTheme.ts`
- [x] 1.2 Implement `Theme` type (`'light' | 'dark'`)
- [x] 1.3 Implement initial state detection: localStorage first, then system preference, then default to 'light'
- [x] 1.4 Use `window.matchMedia('(prefers-color-scheme: dark)')` for system detection
- [x] 1.5 Write unit tests for initial state detection scenarios

### Task 2: Implement theme application and persistence
- [x] 2.1 Implement useEffect to set `document.documentElement.dataset.theme` when theme changes
- [x] 2.2 Implement localStorage save on theme change (`bmad-todo-theme` key)
- [x] 2.3 Write unit tests for theme application and persistence

### Task 3: Implement toggleTheme function
- [x] 3.1 Implement `toggleTheme()` function to switch between light/dark
- [x] 3.2 Ensure toggle updates state, DOM attribute, and localStorage atomically
- [x] 3.3 Write unit tests for toggle functionality

### Task 4: Implement system preference change listener
- [x] 4.1 Add mediaQuery change listener in useEffect
- [x] 4.2 Listener should only update theme if no user preference is saved
- [x] 4.3 Implement proper cleanup (removeEventListener) on unmount
- [x] 4.4 Write unit tests for system preference change handling

### Task 5: Export hook with proper return type
- [x] 5.1 Return `{ theme, toggleTheme, isDark }` where `isDark` is derived from `theme === 'dark'`
- [x] 5.2 Export hook from `frontend/src/hooks/index.ts`
- [x] 5.3 Verify TypeScript types are correct

---

## Dev Notes

### Architecture References
- Hook location: `frontend/src/hooks/useTheme.ts`
- localStorage key: `bmad-todo-theme`
- Architecture spec (Section 6.3): CSS custom properties with `data-theme` attribute

### Existing Patterns
- Follow existing hook patterns from `useTodos.ts`, `useAddTodo.ts`
- Use TypeScript strict types throughout
- CSS variables already defined in `frontend/src/styles/variables.css` (dark theme exists at `[data-theme='dark']`)

### Technical Specifications
```typescript
// Hook signature
export function useTheme(): {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  isDark: boolean;
}
```

### Theme Detection Priority
1. User preference saved in localStorage (`bmad-todo-theme`)
2. System preference via `prefers-color-scheme` media query
3. Default to light mode

### Implementation Notes
- Use `useState` with lazy initializer for SSR-safety (access window only in initializer)
- `document.documentElement.dataset.theme` sets the `data-theme` attribute
- MediaQuery listener: `window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ...)`

---

## Dev Agent Record

### Debug Log
- All 21 unit tests passing for useTheme hook
- Full test suite passing: 194 tests (41 backend + 153 frontend)
- TypeScript types verified, no compile errors

### Completion Notes
- Implemented useTheme hook with system preference detection priority: localStorage → matchMedia → light default
- Hook returns `{ theme, toggleTheme, isDark }` per AC6
- localStorage key: `bmad-todo-theme`
- Sets `document.documentElement.dataset.theme` for CSS integration
- System preference listener with proper cleanup on unmount
- useCallback for stable toggleTheme reference
- Comprehensive test coverage for all scenarios

---

## File List

### Created Files
- `frontend/src/hooks/useTheme.ts` — useTheme hook implementation
- `frontend/src/hooks/__tests__/useTheme.test.tsx` — 21 unit tests

### Modified Files
- `frontend/src/hooks/index.ts` — Added useTheme and type exports

---

## Change Log

| Change | Date | Description |
|--------|------|-------------|
| Created | 2026-03-10 | Story file created from sprint backlog |
| Completed | 2026-03-10 | All tasks and ACs complete, 21 tests passing |
| Code Review | 2026-03-10 | Fixed H1: System preference listener now works (useRef for toggle tracking) |

---

## Senior Developer Review (AI)

**Review Date:** 2026-03-10  
**Outcome:** ✅ Approved (after fixes)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| HIGH | System preference listener never triggers after mount | Fixed: Use `useRef` to track explicit toggles; only save to localStorage on toggle, not on mount |
| MEDIUM | Duplicate localStorage mock across test files | Fixed: Created shared `theme-test-utils.ts` |

### Files Modified During Review
- `frontend/src/hooks/useTheme.ts` — Added `useRef` for toggle tracking
- `frontend/src/hooks/__tests__/useTheme.test.tsx` — Updated tests, added system preference change test
- `frontend/src/test/theme-test-utils.ts` — New shared test utilities

---

## Status

**Current Status:** Done  
**Last Updated:** 2026-03-10
