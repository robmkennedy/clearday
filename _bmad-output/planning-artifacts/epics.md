---
stepsCompleted: ['step-01-validate-prerequisites', 'step-02-design-epics', 'step-03-create-stories', 'step-04-final-validation']
inputDocuments: ['prd.md (v1.1)', 'architecture.md (v1.3)', 'ux-architecture-handoff.md (v1.0)', 'jobs-to-be-done.md (v1.1)', 'wireframes.md (v1.1)', 'accessibility-audit.md (v1.1)']
workflowType: 'epics-and-stories'
project_name: 'clearday'
user_name: 'Rob'
date: '2026-03-05'
status: 'complete'
---

# clearday - Epic Breakdown

## Overview

This document provides the complete epic and story breakdown for clearday, decomposing the requirements from the PRD, UX Design, and Architecture requirements into implementable stories.

## Requirements Inventory

### Functional Requirements

**Core CRUD Operations:**
- FR1: View all todos organized into separate sections for incomplete (Active) and completed tasks
- FR2: Add a new todo with a text description (1-500 characters, trimmed)
- FR3: Mark a todo as complete (moves from Active to Completed section)
- FR4: Mark a completed todo as incomplete (moves from Completed to Active section)
- FR5: Delete a todo permanently

**Todo Data Model:**
- FR6: Each todo must have: id (UUID), text (string, 1-500 chars), completed (boolean, default false), createdAt (ISO timestamp)
- FR7: IDs and timestamps are server-generated

**API Requirements:**
- FR8: GET /api/todos — Retrieve all todos (sorted by createdAt descending)
- FR9: POST /api/todos — Create a new todo (request: {text}, response: 201 + Todo)
- FR10: PATCH /api/todos/:id — Update a todo (request: {completed?, text?}, response: 200 + Todo)
- FR11: DELETE /api/todos/:id — Delete a todo (response: 204)
- FR12: Return 404 for operations on non-existent todos
- FR13: Return 400 for invalid input (empty text, text > 500 chars)

**UI State Requirements:**
- FR14: Show loading state while fetching todos
- FR15: Show error state with retry option if fetch fails
- FR16: Show empty state when no tasks exist ("No tasks yet!")
- FR17: Active section shows empty state when all tasks are completed
- FR18: Completed section is hidden when no completed tasks exist
- FR19: Optimistic UI updates for add, complete, and delete actions
- FR20: Rollback UI on API failure

**Input Behavior:**
- FR21: Text input field always visible for adding todos
- FR22: Auto-focus input on page load
- FR23: Enter key or add button submits the todo
- FR24: Input field clears after successful creation
- FR25: Reject empty or whitespace-only descriptions

**Theme Requirements:**
- FR26: Theme toggle control visible in the header
- FR27: Toggle switches between light and dark mode instantly
- FR28: Theme preference persisted in localStorage
- FR29: Respect system preference (prefers-color-scheme) when no saved preference
- FR30: All UI elements adapt appropriately to selected theme

### Non-Functional Requirements

**Performance:**
- NFR1: Initial page load < 2 seconds on broadband
- NFR2: API response time < 200ms under normal conditions
- NFR3: UI interaction feedback is immediate (optimistic updates)
- NFR4: Loading indicator only shown if API response > 200ms

**Reliability:**
- NFR5: Data persists durably in SQLite database
- NFR6: Graceful error handling — failures don't crash app or corrupt state
- NFR7: Application recovers gracefully from network interruptions

**Maintainability:**
- NFR8: Clean separation between frontend (React) and backend (Express)
- NFR9: Well-structured, readable code with clear conventions
- NFR10: TypeScript for type safety on both frontend and backend

**Security:**
- NFR11: Input validation on both client (Zod) and server (Zod)
- NFR12: Protection against XSS (React JSX escaping)
- NFR13: Protection against SQL injection (Drizzle parameterized queries)
- NFR14: Security headers in production (Helmet)

**Compatibility:**
- NFR15: Support modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- NFR16: Responsive design: Desktop (≥768px, 600px max-width centered) and Mobile (<768px, 100% width, 16px padding)

**Accessibility (WCAG 2.1 AA):**
- NFR17: Color contrast ratio minimum 4.5:1 for all text
- NFR18: Touch targets minimum 44x44px
- NFR19: Input field minimum 48px height
- NFR20: Full keyboard navigation (Tab, Enter, Space, Delete, Escape)
- NFR21: Screen reader support (semantic HTML, ARIA labels)
- NFR22: Visible focus rings (2px outline), logical tab order
- NFR23: Respect prefers-reduced-motion media query

### Additional Requirements

**From Architecture — Starter/Infrastructure:**
- AR1: Monorepo structure with frontend/ and backend/ directories
- AR2: React 18 + Vite + TypeScript for frontend
- AR3: Node.js 20 LTS + Express 4.x + TypeScript for backend
- AR4: SQLite + Drizzle ORM for database
- AR5: CSS Modules for component styling
- AR6: React Query (TanStack Query) for server state management
- AR7: Zod for runtime validation (shared schemas)
- AR8: Database migrations with Drizzle

**From Architecture — Project Setup:**
- AR9: Root package.json with workspace scripts (dev, build, start, test, lint)
- AR10: Shared TypeScript configuration (tsconfig.base.json)
- AR11: Environment variables for configuration (.env files)
- AR12: Vite dev server proxies API requests to Express in development

**From Architecture — Testing:**
- AR13: Vitest for unit testing (frontend and backend)
- AR14: React Testing Library for component tests
- AR15: Supertest for API integration tests
- AR16: Playwright for E2E tests
- AR17: axe-core for accessibility testing

**From Architecture — Production:**
- AR18: Health check endpoint (GET /api/health)
- AR19: Structured logging with Pino
- AR20: CORS configuration for frontend URL
- AR21: Express serves static frontend build in production

**From UX — Animation Specifications:**
- UX1: Task appear animation: 200ms ease-out (opacity + translateY)
- UX2: Task complete animation: 150ms ease-in-out (styling) + 200ms (section move)
- UX3: Task delete animation: 200ms ease-in-out (opacity + translateX)
- UX4: Section transition animation: 200ms ease-in-out
- UX5: All animations disabled when prefers-reduced-motion: reduce

**From UX — Component Specifications:**
- UX6: TaskInput component: default, focused, typing, error states
- UX7: TaskItem component: incomplete, hover, focused, completed states
- UX8: TaskSection component: wrapper for Active or Completed section
- UX9: SectionHeader component: "Tasks" and "Completed" headers
- UX10: EmptyState component: contextual messages per section
- UX11: LoadingState component: spinner with delayed display (200ms)
- UX12: ErrorState component: error message + "Try Again" button
- UX13: Generic UI components: Button, Checkbox, Input, Spinner
- UX14: ThemeToggle component: sun/moon icon toggle for dark mode

**From JTBD — Job Stories (Implementation Reference):**
- JS1: Quick Capture — Capture task in < 5 seconds with Enter key, immediate appearance
- JS2: Trust Persistence — Tasks persist across refresh and sessions, load < 2 seconds
- JS3: Visual Feedback — Task appears instantly, subtle animation, no loading spinner
- JS4: Task Overview — All tasks scannable, clear hierarchy, empty/loading states
- JS5: Mark Complete — Single tap/click, immediate visual change, state persists
- JS6: Unmark Complete — Single tap/click reversal, immediate change
- JS7: Delete Task — Single action delete, no confirmation, immediate removal
- JS8: Mobile Capture — One-handed use, 44px touch targets, auto-keyboard
- JS9: Calm Interface — Minimal elements, ample whitespace, no aggressive colors

### FR Coverage Map

| Requirement | Epic | Description |
|-------------|------|-------------|
| FR1 | E3 | Two-section view (Active/Completed) |
| FR2 | E2 | Add new todo |
| FR3 | E3 | Mark todo complete |
| FR4 | E3 | Mark completed todo incomplete |
| FR5 | E4 | Delete todo |
| FR6 | E2 | Todo data model |
| FR7 | E2 | Server-generated IDs/timestamps |
| FR8 | E2 | GET /api/todos endpoint |
| FR9 | E2 | POST /api/todos endpoint |
| FR10 | E3 | PATCH /api/todos/:id endpoint |
| FR11 | E4 | DELETE /api/todos/:id endpoint |
| FR12 | E4 | 404 for missing todos |
| FR13 | E2 | 400 for invalid input |
| FR14 | E5 | Loading state |
| FR15 | E5 | Error state with retry |
| FR16 | E5 | Empty state |
| FR17 | E3 | Active section empty state |
| FR18 | E3 | Completed section hidden when empty |
| FR19 | E2, E3, E4 | Optimistic updates |
| FR20 | E2, E3, E4 | Rollback on failure |
| FR21 | E2 | Input always visible |
| FR22 | E2 | Auto-focus input |
| FR23 | E2 | Enter/button submits |
| FR24 | E2 | Clear input after submit |
| FR25 | E2 | Reject empty input |
| FR26-FR30 | E6 | Theme toggle & dark mode |
| NFR17-NFR23 | E2-E6 | Accessibility (woven throughout) |
| AR1-AR12 | E1 | Project foundation |
| AR13-AR21 | E7 | Production readiness |
| UX1-UX5 | E3, E4 | Animations |
| UX6-UX14 | E2-E6 | Component specifications |
| JS1-JS9 | E2-E5 | Job stories |

## Epic List

### Epic 1: Project Foundation
**Goal:** Development environment is ready; developers can run the application locally with frontend and backend communicating.

**Requirements:** AR1-AR12
**Enables:** All subsequent epics

---

### Epic 2: Core Task Capture
**Goal:** Users can add tasks instantly and see them appear in a list — the fundamental "capture" job is done.

**Requirements:** FR2, FR6-FR9, FR13, FR19-FR25
**JTBD:** JS1 (Quick Capture), JS3 (Visual Feedback), JS8 (Mobile Capture)
**Accessibility:** NFR17-NFR22 for TaskInput component (contrast, touch targets, keyboard, focus)

---

### Epic 3: Task Completion & Organization
**Goal:** Users can complete tasks and see them organized into Active/Completed sections — the "progress tracking" job is done.

**Requirements:** FR1, FR3, FR4, FR10, FR17-FR20
**JTBD:** JS4 (Task Overview), JS5 (Mark Complete), JS6 (Unmark Complete)
**UX:** UX1-UX4, UX7-UX9 (animations, TaskItem, TaskSection, SectionHeader)
**Accessibility:** NFR17-NFR23 for TaskItem/sections (keyboard toggle, ARIA, reduced motion)

---

### Epic 4: Task Deletion
**Goal:** Users can delete tasks to keep their list clean and focused.

**Requirements:** FR5, FR11, FR12, FR19, FR20
**JTBD:** JS7 (Delete Task)
**UX:** UX3 (delete animation)
**Accessibility:** Keyboard delete, accessible delete button

---

### Epic 5: UI States & Feedback
**Goal:** Users experience a polished application with clear feedback for loading, errors, and empty states.

**Requirements:** FR14-FR16
**JTBD:** JS2 (Trust Persistence), JS4 (Task Overview), JS9 (Calm Interface)
**UX:** UX10-UX12 (EmptyState, LoadingState, ErrorState)
**Accessibility:** ARIA live regions for state announcements

---

### Epic 6: Dark Mode & Theme Support
**Goal:** Users can toggle between light and dark themes with preference persistence.

**Requirements:** FR26-FR30
**PRD:** US-5 (Toggle Dark Mode)
**UX:** UX14 (ThemeToggle)
**Accessibility:** NFR17 contrast in both themes, accessible toggle

---

### Epic 7: Production Readiness
**Goal:** The application is deployable, monitored, and tested.

**Requirements:** AR13-AR21, NFR1-NFR7, NFR11-NFR14
**Delivers:** Health check, security headers, logging, CORS, test infrastructure

---

## Epic 1: Project Foundation

**Goal:** Development environment is ready; developers can run the application locally with frontend and backend communicating.

### Story 1.1: Initialize Monorepo Structure

**As a** developer,
**I want** a monorepo with frontend and backend workspaces configured,
**So that** I can develop both applications in a unified codebase.

**Acceptance Criteria:**

**Given** an empty project directory
**When** the setup is complete
**Then** the following structure exists:
- Root `package.json` with npm workspaces configured
- `frontend/` directory with `package.json`
- `backend/` directory with `package.json`
- `shared/` directory for shared types
- `.gitignore` for Node.js, TypeScript, SQLite, env files
**And** running `npm install` from root installs all workspace dependencies

---

### Story 1.2: Configure Backend with Express & TypeScript

**As a** developer,
**I want** an Express server with TypeScript configured,
**So that** I can build type-safe API endpoints.

**Acceptance Criteria:**

**Given** the monorepo structure from Story 1.1
**When** backend setup is complete
**Then** the following exists:
- `backend/src/index.ts` entry point starting Express on port 3000
- `backend/tsconfig.json` extending root config
- TypeScript compilation with `ts-node-dev` for development
- `npm run dev` in backend starts the server with hot reload
**And** visiting `http://localhost:3000/api/health` returns `{ "status": "ok" }`

---

### Story 1.3: Configure SQLite Database with Drizzle ORM

**As a** developer,
**I want** SQLite database with Drizzle ORM configured,
**So that** I can persist data with type-safe queries.

**Acceptance Criteria:**

**Given** the backend from Story 1.2
**When** database setup is complete
**Then** the following exists:
- `backend/src/db/schema.ts` with `todos` table (id, text, completed, created_at)
- `backend/src/db/index.ts` with database connection
- `backend/data/` directory for SQLite database file
- Drizzle config for migrations (`drizzle.config.ts`)
**And** running `npm run db:migrate` creates the `todos` table
**And** running `npm run db:studio` opens Drizzle Studio

---

### Story 1.4: Configure Frontend with React, Vite & TypeScript

**As a** developer,
**I want** a React SPA with Vite and TypeScript configured,
**So that** I can build the user interface with fast HMR.

**Acceptance Criteria:**

**Given** the monorepo structure from Story 1.1
**When** frontend setup is complete
**Then** the following exists:
- `frontend/src/main.tsx` entry point
- `frontend/src/App.tsx` with basic component
- `frontend/vite.config.ts` with API proxy to port 3000
- `frontend/tsconfig.json` extending root config
- CSS Modules enabled (`*.module.css`)
**And** running `npm run dev` in frontend starts Vite on port 5173
**And** API calls to `/api/*` are proxied to backend

---

### Story 1.5: Configure React Query & Global Styles

**As a** developer,
**I want** React Query configured with global CSS variables,
**So that** I can manage server state and maintain consistent styling.

**Acceptance Criteria:**

**Given** the frontend from Story 1.4
**When** configuration is complete
**Then** the following exists:
- `QueryClientProvider` wrapping the App
- `frontend/src/styles/variables.css` with CSS custom properties (colors, spacing, typography per architecture)
- `frontend/src/styles/global.css` with CSS reset and base styles
- Responsive container styles (600px max-width centered)
**And** CSS variables are available in all components
**And** the app displays correctly at mobile and desktop widths

---

### Story 1.6: Configure Root Scripts & Shared Types

**As a** developer,
**I want** root workspace scripts and shared types configured,
**So that** I can run the full stack with single commands.

**Acceptance Criteria:**

**Given** frontend and backend configured
**When** root configuration is complete
**Then** root `package.json` has scripts:
- `npm run dev` — starts both frontend and backend concurrently
- `npm run build` — builds both frontend and backend
- `npm run start` — runs production server
**And** `tsconfig.base.json` exists with shared compiler options
**And** `shared/types/todo.ts` has `Todo`, `CreateTodoRequest`, `UpdateTodoRequest` interfaces
**And** environment variables are configured (`.env.example` files)

---

## Epic 2: Core Task Capture

**Goal:** Users can add tasks instantly and see them appear in a list — the fundamental "capture" job is done.

### Story 2.1: Implement Todo API Endpoints (GET & POST)

**As a** developer,
**I want** API endpoints to retrieve and create todos,
**So that** the frontend can fetch and persist task data.

**Acceptance Criteria:**

**Given** the database schema from Epic 1
**When** I call `GET /api/todos`
**Then** I receive 200 with an array of all todos sorted by `createdAt` descending

**Given** a valid todo text
**When** I call `POST /api/todos` with `{ "text": "Buy milk" }`
**Then** I receive 201 with the created todo including server-generated `id` and `createdAt`
**And** the todo is persisted in the database

**Given** invalid input (empty text or > 500 chars)
**When** I call `POST /api/todos`
**Then** I receive 400 with error details

---

### Story 2.2: Implement Zod Validation Schemas

**As a** developer,
**I want** Zod validation schemas for todo operations,
**So that** input is validated consistently on both client and server.

**Acceptance Criteria:**

**Given** a `createTodoSchema`
**When** validating input
**Then** it requires `text` string, trims whitespace, enforces 1-500 character length

**Given** validation schemas
**When** used in backend middleware
**Then** invalid requests return 400 with structured error response: `{ error: { code, message, details } }`

**And** schemas are importable in frontend for client-side validation

---

### Story 2.3: Implement TaskInput Component

**As a** user,
**I want** a text input field to add new tasks,
**So that** I can capture tasks quickly.

**Acceptance Criteria:**

**Given** the application loads
**When** the page renders
**Then** the TaskInput is visible at the top
**And** the input field is auto-focused

**Given** I type a task description
**When** I press Enter or click the Add button
**Then** the task is submitted
**And** the input field clears

**Given** I enter empty or whitespace-only text
**When** I try to submit
**Then** the submission is rejected with visual feedback

**Accessibility:**
**And** input has minimum 48px height
**And** focus ring is visible (2px outline)
**And** touch target is minimum 44x44px
**And** input has accessible label for screen readers

---

### Story 2.4: Implement TodoList & useTodos Hook

**As a** user,
**I want** to see my tasks in a list,
**So that** I know what I've captured.

**Acceptance Criteria:**

**Given** I have tasks in the database
**When** the page loads
**Then** I see all tasks displayed in a list (newest first)

**Given** the `useTodos` hook
**When** fetching data
**Then** React Query manages caching and refetching
**And** the hook returns `{ data, isLoading, isError, refetch }`

---

### Story 2.5: Implement Optimistic Add with Rollback

**As a** user,
**I want** new tasks to appear instantly,
**So that** I feel confident my task was captured.

**Acceptance Criteria:**

**Given** I submit a new task
**When** I press Enter
**Then** the task appears in the list immediately (< 100ms)
**And** the API request is sent in the background

**Given** the API request fails
**When** the error response is received
**Then** the optimistic task is removed from the list
**And** an error indication is shown

**And** no loading spinner is shown during add operation

---

## Epic 3: Task Completion & Organization

**Goal:** Users can complete tasks and see them organized into Active/Completed sections — the "progress tracking" job is done.

### Story 3.1: Implement PATCH /api/todos/:id Endpoint

**As a** developer,
**I want** an API endpoint to update todo completion status,
**So that** the frontend can toggle tasks.

**Acceptance Criteria:**

**Given** an existing todo
**When** I call `PATCH /api/todos/:id` with `{ "completed": true }`
**Then** I receive 200 with the updated todo

**Given** a non-existent todo ID
**When** I call `PATCH /api/todos/:id`
**Then** I receive 404 with error details

**And** the `updateTodoSchema` validates `completed` as optional boolean and `text` as optional string (1-500 chars)

---

### Story 3.2: Implement Two-Section Layout (Active/Completed)

**As a** user,
**I want** to see my tasks organized into Active and Completed sections,
**So that** I can focus on what's left to do.

**Acceptance Criteria:**

**Given** I have both incomplete and complete tasks
**When** I view the list
**Then** Active tasks appear in the top section with header "Tasks"
**And** Completed tasks appear in the bottom section with header "Completed"

**Given** I have no completed tasks
**When** I view the list
**Then** the Completed section is hidden entirely

**Given** I have only completed tasks
**When** I view the list
**Then** the Active section shows an empty state message

**Components:**
**And** TaskSection component wraps each section
**And** SectionHeader component displays section titles

---

### Story 3.3: Implement TaskItem Component

**As a** user,
**I want** each task to show its text and completion status,
**So that** I can see and interact with individual tasks.

**Acceptance Criteria:**

**Given** an incomplete task
**When** displayed
**Then** it shows unchecked checkbox, full-contrast text

**Given** a completed task
**When** displayed
**Then** it shows checked checkbox, strikethrough text, muted styling

**Accessibility:**
**And** checkbox has accessible label: "Mark [task text] as complete/incomplete"
**And** touch target is minimum 44x44px
**And** focus ring is visible on keyboard focus
**And** supports keyboard interaction (Space/Enter to toggle)

---

### Story 3.4: Implement Toggle Completion with Optimistic Update

**As a** user,
**I want** to toggle task completion with immediate feedback,
**So that** I can track my progress fluidly.

**Acceptance Criteria:**

**Given** an incomplete task in the Active section
**When** I click/tap the checkbox
**Then** the task immediately moves to the Completed section
**And** the visual styling changes to completed state
**And** the API request is sent in the background

**Given** a completed task in the Completed section
**When** I click/tap the checkbox
**Then** the task immediately moves back to the Active section

**Given** the API request fails
**When** the error response is received
**Then** the task reverts to its previous state
**And** an error indication is shown

---

### Story 3.5: Implement Task Animations

**As a** user,
**I want** smooth animations when tasks change state,
**So that** the interface feels polished and responsive.

**Acceptance Criteria:**

**Given** a new task is added
**When** it appears in the list
**Then** it animates in with 200ms ease-out (opacity + translateY)

**Given** a task is completed/uncompleted
**When** it moves between sections
**Then** styling transitions in 150ms ease-in-out
**And** section move animates in 200ms ease-in-out

**Given** user has `prefers-reduced-motion: reduce`
**When** any animation would play
**Then** animations are disabled (instant transitions)

**And** all timing uses CSS variables (`--animation-appear`, etc.)

---

## Epic 4: Task Deletion

**Goal:** Users can delete tasks to keep their list clean and focused.

### Story 4.1: Implement DELETE /api/todos/:id Endpoint

**As a** developer,
**I want** an API endpoint to delete todos,
**So that** users can remove unwanted tasks.

**Acceptance Criteria:**

**Given** an existing todo
**When** I call `DELETE /api/todos/:id`
**Then** I receive 204 No Content
**And** the todo is removed from the database

**Given** a non-existent todo ID
**When** I call `DELETE /api/todos/:id`
**Then** I receive 404 with error details

---

### Story 4.2: Implement Delete Button on TaskItem

**As a** user,
**I want** a delete button on each task,
**So that** I can remove tasks I no longer need.

**Acceptance Criteria:**

**Given** any task (active or completed)
**When** displayed
**Then** a delete button is visible

**Given** I click the delete button
**When** the action completes
**Then** the task is removed immediately (optimistic)
**And** the API request is sent in the background

**Given** the API request fails
**When** the error response is received
**Then** the task reappears in its original position
**And** an error indication is shown

**Accessibility:**
**And** delete button has accessible label: "Delete task: [task text]"
**And** touch target is minimum 44x44px
**And** keyboard accessible (can focus and activate with Enter/Space)

---

### Story 4.3: Implement Delete Animation

**As a** user,
**I want** a smooth animation when tasks are deleted,
**So that** the removal feels intentional and polished.

**Acceptance Criteria:**

**Given** I delete a task
**When** it is removed
**Then** it animates out with 200ms ease-in-out (opacity + translateX slide right)

**Given** user has `prefers-reduced-motion: reduce`
**When** delete animation would play
**Then** task disappears instantly

---

## Epic 5: UI States & Feedback

**Goal:** Users experience a polished application with clear feedback for loading, errors, and empty states.

### Story 5.1: Implement LoadingState Component

**As a** user,
**I want** a loading indicator while data is being fetched,
**So that** I know the app is working.

**Acceptance Criteria:**

**Given** the app is fetching todos
**When** the request takes longer than 200ms
**Then** a loading spinner is displayed

**Given** the request completes in under 200ms
**When** data arrives
**Then** no loading spinner is shown (prevents flash)

**Accessibility:**
**And** spinner has `aria-label="Loading tasks"`
**And** spinner respects `prefers-reduced-motion` (no spin animation)

---

### Story 5.2: Implement ErrorState Component

**As a** user,
**I want** a clear error message when something goes wrong,
**So that** I know what happened and can try again.

**Acceptance Criteria:**

**Given** the todo fetch fails
**When** the error occurs
**Then** an error message is displayed: "Something went wrong"
**And** a "Try Again" button is visible

**Given** I click "Try Again"
**When** the button is activated
**Then** the fetch is retried

**Accessibility:**
**And** error region has `aria-live="polite"` for screen reader announcement
**And** button has minimum 44x44px touch target

---

### Story 5.3: Implement EmptyState Component

**As a** user,
**I want** a friendly message when I have no tasks,
**So that** I understand the app is working and ready for input.

**Acceptance Criteria:**

**Given** I have no tasks at all
**When** viewing the app
**Then** I see "No tasks yet — add one above!"

**Given** I have only completed tasks (Active section empty)
**When** viewing the Active section
**Then** I see "All done! 🎉" or similar contextual message

**And** empty state styling is calm and minimal (no aggressive colors)

---

## Epic 6: Dark Mode & Theme Support

**Goal:** Users can toggle between light and dark themes with preference persistence.

### Story 6.1: Implement useTheme Hook

**As a** user,
**I want** theme preference to persist and respect system settings,
**So that** the app remembers my choice.

**Acceptance Criteria:**

**Given** no saved preference exists
**When** the app loads
**Then** it detects system preference via `prefers-color-scheme`
**And** applies light or dark theme accordingly

**Given** a saved preference exists in localStorage
**When** the app loads
**Then** the saved preference takes priority over system preference

**Given** I toggle the theme
**When** the toggle is clicked
**Then** the theme switches instantly
**And** the preference is saved to localStorage

**And** `data-theme` attribute is set on `<html>` element

---

### Story 6.2: Implement ThemeToggle Component

**As a** user,
**I want** a visible toggle to switch themes,
**So that** I can change the theme easily.

**Acceptance Criteria:**

**Given** the app is in light mode
**When** viewing the header
**Then** I see a sun icon (☀️) on the toggle

**Given** the app is in dark mode
**When** viewing the header
**Then** I see a moon icon (🌙) on the toggle

**Given** I click the toggle
**When** the action completes
**Then** the theme switches instantly

**Accessibility:**
**And** toggle has `aria-label="Switch to dark/light mode"`
**And** touch target is minimum 44x44px
**And** visible focus ring on keyboard focus

---

### Story 6.3: Implement Dark Mode CSS Variables

**As a** user,
**I want** all UI elements to adapt to dark mode,
**So that** the app is comfortable in low-light conditions.

**Acceptance Criteria:**

**Given** `[data-theme="dark"]` selector
**When** dark mode is active
**Then** all color variables are overridden per architecture spec
**And** backgrounds, text, borders, buttons all adapt

**And** color contrast remains ≥ 4.5:1 in dark mode
**And** no hardcoded colors bypass the theme

---

### Story 6.4: Implement Theme Flash Prevention

**As a** user,
**I want** no flash of wrong theme on page load,
**So that** the experience feels polished.

**Acceptance Criteria:**

**Given** I have dark mode saved
**When** I reload the page
**Then** dark mode is applied before first paint (no white flash)

**Implementation:**
**And** inline `<script>` in `<head>` sets `data-theme` before stylesheets load
**And** script is synchronous (not deferred)

---

## Epic 7: Production Readiness

**Goal:** The application is deployable, monitored, and tested.

### Story 7.1: Implement Health Check & Security Middleware

**As a** developer,
**I want** health check endpoint and security headers,
**So that** the app is production-ready.

**Acceptance Criteria:**

**Given** the app is running
**When** I call `GET /api/health`
**Then** I receive 200 with `{ "status": "healthy", "timestamp": "..." }`
**And** the endpoint verifies database connectivity

**Given** the database is unavailable
**When** I call `GET /api/health`
**Then** I receive 503 with `{ "status": "unhealthy" }`

**And** Helmet middleware adds security headers
**And** CORS is configured for frontend URL

---

### Story 7.2: Implement Structured Logging

**As a** developer,
**I want** structured logging with Pino,
**So that** I can debug and monitor the application.

**Acceptance Criteria:**

**Given** the app is running
**When** requests are made
**Then** requests are logged with method, path, status, duration

**Given** development environment
**When** logs are output
**Then** `pino-pretty` formats logs for readability

**And** log level is configurable via environment variable

---

### Story 7.3: Configure Production Build & Static Serving

**As a** developer,
**I want** Express to serve the frontend build in production,
**So that** the app deploys as a single unit.

**Acceptance Criteria:**

**Given** `npm run build` is executed
**When** the build completes
**Then** frontend is built to `frontend/dist`
**And** backend is compiled to `backend/dist`

**Given** `NODE_ENV=production`
**When** the server starts
**Then** Express serves static files from `frontend/dist`
**And** all non-API routes return `index.html` (SPA fallback)

---

### Story 7.4: Set Up Testing Infrastructure

**As a** developer,
**I want** testing tools configured,
**So that** I can write and run tests.

**Acceptance Criteria:**

**Given** the test configuration
**When** tests are run
**Then** Vitest runs unit tests for frontend and backend
**And** React Testing Library is available for component tests
**And** Supertest is available for API integration tests
**And** Playwright is configured for E2E tests
**And** axe-core is integrated for accessibility testing

**And** `npm run test` runs unit tests
**And** `npm run test:e2e` runs Playwright tests
