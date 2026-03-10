# Story 4-3: Implement Dark Mode CSS Variables

## Story

**As a** user,  
**I want** all UI elements to adapt to dark mode,  
**So that** the app is comfortable in low-light conditions.

**Story Reference:** Epic 6, Story 6.3  
**Points:** 3  
**Priority:** P0 - Critical  
**Sprint:** 4

---

## Acceptance Criteria

- [x] AC1: `[data-theme="dark"]` selector overrides all color CSS variables
- [x] AC2: Dark mode color palette per architecture spec
- [x] AC3: All backgrounds, text, borders, buttons, inputs adapt to theme
- [x] AC4: Color contrast remains ≥ 4.5:1 in dark mode (WCAG 2.1 AA)
- [x] AC5: No hardcoded colors bypass the theme (audit all components)
- [x] AC6: Smooth color transitions (150ms) when switching themes

---

## Tasks/Subtasks

### Task 1: Verify and update dark theme CSS variables
- [x] 1.1 Review existing dark theme variables in `variables.css`
- [x] 1.2 Ensure all required colors are defined per sprint backlog spec
- [x] 1.3 Verify contrast ratios meet WCAG 2.1 AA (≥ 4.5:1)

### Task 2: Audit all CSS modules for hardcoded colors
- [x] 2.1 Audit TaskInput.module.css
- [x] 2.2 Audit TaskItem.module.css
- [x] 2.3 Audit TodoList.module.css
- [x] 2.4 Audit EmptyState.module.css
- [x] 2.5 Audit LoadingState.module.css
- [x] 2.6 Audit ErrorState.module.css
- [x] 2.7 Audit App.module.css (not present - using global.css)
- [x] 2.8 Audit global.css

### Task 3: Add theme transition for smooth switching
- [x] 3.1 Add CSS transition for background-color and color properties
- [x] 3.2 Ensure transition respects prefers-reduced-motion

### Task 4: Test dark mode appearance
- [x] 4.1 All tests passing (153 frontend tests)
- [x] 4.2 No TypeScript/CSS errors

---

## Dev Notes

### Architecture References
- CSS variables location: `frontend/src/styles/variables.css`
- Dark theme already partially defined at `[data-theme='dark']`

### Dark Mode Palette (from sprint backlog)
- Background: #111827
- Surface: #1f2937
- Text primary: #f9fafb
- Text secondary: #d1d5db
- Accent: #3b82f6 (primary blue)
- Error: #ef4444
- Success: #22c55e
- Border: #374151

---

## Dev Agent Record

### Debug Log
- All 153 frontend tests passing after CSS changes
- Added --color-hover, --color-focus, --color-error-bg variables for both themes
- Added theme transition to body (150ms)
- Removed all hardcoded color fallbacks from CSS modules

### Completion Notes
- Dark theme already existed in variables.css ✅
- Added interactive state colors for hover/focus in both themes
- Fixed hardcoded "white" in TodoList.module.css retryButton
- Removed fallback colors (var(--x, #fallback)) — all CSS now uses variables directly
- Theme transition added to body respects prefers-reduced-motion (uses --transition-fast)

---

## File List

### Created Files
None

### Modified Files
- `frontend/src/styles/variables.css` — Added hover/focus/error-bg variables for both themes
- `frontend/src/styles/global.css` — Added theme transition to body
- `frontend/src/components/TaskItem/TaskItem.module.css` — Removed fallback colors
- `frontend/src/components/TodoList/TodoList.module.css` — Fixed hardcoded white, removed fallbacks

---

## Change Log

| Change | Date | Description |
|--------|------|-------------|
| Created | 2026-03-10 | Story file created |
| Completed | 2026-03-10 | All ACs met, CSS variables audited and fixed |
| Code Review | 2026-03-10 | Fixed L2: Removed dead text-align CSS |

---

## Senior Developer Review (AI)

**Review Date:** 2026-03-10  
**Outcome:** ✅ Approved (after fixes)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| LOW | Dead `text-align: center` on `.app > header` | Fixed: Removed (flexbox makes it irrelevant) |

---

## Status

**Current Status:** Done  
**Last Updated:** 2026-03-10

