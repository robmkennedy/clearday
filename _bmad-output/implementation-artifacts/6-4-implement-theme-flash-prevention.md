# Story 6-4: Implement Theme Flash Prevention

## Story

**As a** user,  
**I want** no flash of wrong theme on page load,  
**So that** the experience feels polished.

**Story Reference:** Epic 6, Story 6.4  
**Points:** 2  
**Priority:** P1 - High  
**Sprint:** 4

---

## Acceptance Criteria

- [x] AC1: When dark mode is saved and page reloads, no white flash occurs
- [x] AC2: Theme is applied before first paint
- [x] AC3: Inline `<script>` in `<head>` sets `data-theme` before stylesheets load
- [x] AC4: Script is synchronous (not `defer` or `async`)
- [x] AC5: Script handles: 1) localStorage preference, 2) system preference fallback, 3) default to light

---

## Tasks/Subtasks

### Task 1: Add blocking theme script to index.html
- [x] 1.1 Add inline `<script>` in `<head>` before CSS links
- [x] 1.2 Script checks localStorage for 'bmad-todo-theme'
- [x] 1.3 Script falls back to prefers-color-scheme media query
- [x] 1.4 Script defaults to 'light' if no preference
- [x] 1.5 Script sets document.documentElement.dataset.theme

### Task 2: Verify script is synchronous
- [x] 2.1 Ensure script has no defer or async attributes
- [x] 2.2 Script executes before CSS loads (in head, before module script)

### Task 3: Test flash prevention
- [x] 3.1 All existing tests passing (208 tests)
- [x] 3.2 Script logic matches useTheme hook priority order

---

## Dev Notes

### Script Pattern
```html
<script>
  (function() {
    const saved = localStorage.getItem('bmad-todo-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    document.documentElement.dataset.theme = saved || (prefersDark ? 'dark' : 'light');
  })();
</script>
```

### Important
- Script MUST be before any CSS links to prevent FOUC (Flash of Unstyled Content)
- Use IIFE to avoid polluting global scope
- Keep script minimal (no dependencies)

---

## Dev Agent Record

### Debug Log
- All 208 tests passing (41 backend + 167 frontend)
- Script added to index.html in <head> before main script

### Completion Notes
- Added inline blocking script in <head> section of index.html
- Script uses IIFE to avoid global scope pollution
- Script uses 'var' for older browser compatibility
- Priority order: localStorage → prefers-color-scheme → light
- No defer/async attributes (synchronous execution)
- Script runs before any CSS loads (in head, before body)

---

## File List

### Created Files
None

### Modified Files
- `frontend/index.html` — Added theme flash prevention script

---

## Change Log

| Change | Date | Description |
|--------|------|-------------|
| Created | 2026-03-10 | Story file created |
| Completed | 2026-03-10 | All ACs met, flash prevention script added |
| Code Review | 2026-03-10 | Fixed M2: Validate localStorage value before using |

---

## Senior Developer Review (AI)

**Review Date:** 2026-03-10  
**Outcome:** ✅ Approved (after fixes)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| MEDIUM | Invalid localStorage value not validated | Fixed: Script now checks `saved === 'light' || saved === 'dark'` before using |

---

## Status

**Current Status:** Done  
**Last Updated:** 2026-03-10




