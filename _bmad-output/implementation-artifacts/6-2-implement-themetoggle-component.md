# Story 6-2: Implement ThemeToggle Component

## Story

**As a** user,  
**I want** a visible toggle to switch themes,  
**So that** I can change the theme easily.

**Story Reference:** Epic 6, Story 6.2  
**Points:** 3  
**Priority:** P0 - Critical  
**Sprint:** 4

---

## Acceptance Criteria

- [x] AC1: Toggle displays sun icon (☀️) when in light mode
- [x] AC2: Toggle displays moon icon (🌙) when in dark mode
- [x] AC3: Clicking toggle switches theme instantly
- [x] AC4: Toggle is positioned in the header area
- [x] AC5: `aria-label` updates dynamically: "Switch to dark mode" / "Switch to light mode"
- [x] AC6: Touch target is minimum 44x44px
- [x] AC7: Visible focus ring on keyboard focus (2px outline)
- [x] AC8: Toggle is keyboard accessible (Tab, Enter/Space to activate)

---

## Tasks/Subtasks

### Task 1: Create ThemeToggle component
- [x] 1.1 Create `frontend/src/components/ThemeToggle/ThemeToggle.tsx`
- [x] 1.2 Create `frontend/src/components/ThemeToggle/ThemeToggle.module.css`
- [x] 1.3 Create `frontend/src/components/ThemeToggle/index.ts`
- [x] 1.4 Use useTheme hook for theme state and toggle
- [x] 1.5 Display sun (☀️) for light mode, moon (🌙) for dark mode

### Task 2: Implement accessibility
- [x] 2.1 Add dynamic aria-label based on current theme
- [x] 2.2 Ensure 44x44px minimum touch target
- [x] 2.3 Add visible focus ring (2px outline)
- [x] 2.4 Verify keyboard accessibility (Enter/Space)

### Task 3: Integrate into App header
- [x] 3.1 Add ThemeToggle to App.tsx header section
- [x] 3.2 Position appropriately in header layout (flex, space-between)

### Task 4: Write unit tests
- [x] 4.1 Test icon display per theme
- [x] 4.2 Test click toggles theme
- [x] 4.3 Test ARIA labels
- [x] 4.4 Test keyboard activation

---

## Dev Notes

### Architecture References
- Component location: `frontend/src/components/ThemeToggle/`
- Use CSS modules for styling
- Use emoji icons for minimal bundle size

### Implementation Pattern
```tsx
import { useTheme } from '../../hooks';

export function ThemeToggle() {
  const { theme, toggleTheme, isDark } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
    >
      {isDark ? '🌙' : '☀️'}
    </button>
  );
}
```

---

## Dev Agent Record

### Debug Log
- 14 unit tests passing for ThemeToggle component
- Full test suite: 208 tests passing (41 backend + 167 frontend)
- Component integrated into App header

### Completion Notes
- ThemeToggle component created with emoji icons (☀️/🌙)
- 44x44px touch target via --touch-target-min CSS variable
- Focus ring uses --color-primary for visibility
- Keyboard accessible (native button behavior)
- Dynamic aria-label based on current theme
- Header layout updated to flex with space-between

---

## File List

### Created Files
- `frontend/src/components/ThemeToggle/ThemeToggle.tsx`
- `frontend/src/components/ThemeToggle/ThemeToggle.module.css`
- `frontend/src/components/ThemeToggle/index.ts`
- `frontend/src/components/ThemeToggle/__tests__/ThemeToggle.test.tsx` — 14 tests

### Modified Files
- `frontend/src/App.tsx` — Added ThemeToggle import and header integration
- `frontend/src/styles/global.css` — Added header-content flex layout

---

## Change Log

| Change | Date | Description |
|--------|------|-------------|
| Created | 2026-03-10 | Story file created |
| Completed | 2026-03-10 | All ACs met, 14 tests passing |
| Code Review | 2026-03-10 | Fixed L1: Removed unused fireEvent import |

---

## Senior Developer Review (AI)

**Review Date:** 2026-03-10  
**Outcome:** ✅ Approved (after fixes)

### Issues Found & Fixed
| Severity | Issue | Resolution |
|----------|-------|------------|
| LOW | Unused `fireEvent` import | Fixed: Removed from test file |

---

## Status

**Current Status:** Done  
**Last Updated:** 2026-03-10




