# Story 5-3: Implement EmptyState Component

Status: done

## Story

**As a** user,
**I want** a friendly message when I have no tasks,
**So that** I understand the app is working and ready for input.

**Story Reference:** Epic 5 (UI States & Feedback), Story 5.3
**Sprint:** 3

---

## Acceptance Criteria

- [x] AC1: Global empty state shows "No tasks yet — add one above!" when no tasks exist
- [x] AC2: Active section shows contextual message (e.g., "All done! 🎉") when all tasks are completed
- [x] AC3: Empty state styling is calm and minimal (no aggressive colors)

---

## Completed Implementation

### Files Created
- `frontend/src/components/EmptyState/EmptyState.tsx` — Contextual empty state messages
- `frontend/src/components/EmptyState/EmptyState.module.css` — Minimal, calm styling

### Key Patterns
- Accepts `variant` prop: `"global"` (no tasks at all) vs `"section"` (active section empty)
- Global: "No tasks yet — add one above!"
- Section: Contextual completion message
- Integrated into `TodoList` conditional rendering and `TaskSection` components

### Notes
- Retrospective record — story file created after implementation was complete.

