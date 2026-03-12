---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8]
inputDocuments: ['prd.md', 'ux-architecture-handoff.md']
workflowType: 'architecture'
project_name: 'clearday'
user_name: 'Rob'
date: '2026-03-05'
---

# Architecture Document

## Clearday Application

**Version:** 1.3  
**Date:** March 5, 2026  
**Author:** Winston (Architect)  
**Status:** Approved  
**PRD Reference:** prd.md v1.2  
**UX Reference:** ux-architecture-handoff.md v1.0, wireframes.md v1.2

---

## 1. Executive Summary

This document defines the technical architecture for Clearday — a single-user task management application prioritizing simplicity, reliability, and developer ergonomics. The architecture employs a modern, minimal stack that satisfies all PRD requirements while remaining easy to understand, deploy, and extend.

### 1.1 Architecture Philosophy

- **Minimal moving parts** — Fewer technologies mean fewer failure modes
- **Convention over configuration** — Leverage framework defaults where sensible
- **Monorepo simplicity** — Single repository with clear frontend/backend separation
- **Production-ready from day one** — No throwaway prototyping; every component is deployable

### 1.2 UX Handoff Questions Addressed

| # | Question | Decision | Rationale |
|---|----------|----------|-----------|
| 1 | Frontend framework recommendation? | **React 18 + Vite + TypeScript** | Component model matches wireframe structure; React Query handles optimistic UI elegantly |
| 2 | State management approach? | **React Query (server state) + useState (local)** | Built-in optimistic updates, caching, and rollback support |
| 3 | Animation library? | **CSS Transitions (no library)** | Zero runtime overhead; native `prefers-reduced-motion` support via CSS variables; sufficient for simple animations |
| 4 | Database choice? | **SQLite + Drizzle ORM** | Zero-config, file-based, perfect for single-user; easy migration path to PostgreSQL |
| 5 | Deployment strategy? | **Single unit (recommended for v1.0)** | Express serves both API and static frontend build; simplifies deployment |
| 6 | Theme implementation approach? | **CSS custom properties + data attribute** | CSS variables for colors, `data-theme` attribute on root, localStorage persistence; no runtime library needed |

---

## 2. Technology Stack

### 2.1 Stack Overview

| Layer | Technology | Version | Rationale |
|-------|------------|---------|-----------|
| Frontend | React | 18.x | Mature ecosystem, excellent DX, optimistic updates |
| Frontend Build | Vite | 5.x | Fast builds, simple config, native ESM |
| Frontend Language | TypeScript | 5.x | Type safety, better IDE support, self-documenting |
| Styling | CSS Modules | — | Scoped styles, no runtime cost, native CSS |
| Backend | Node.js + Express | 20.x LTS / 4.x | Simple, well-understood, excellent TypeScript support |
| Backend Language | TypeScript | 5.x | Shared types between frontend/backend |
| Database | SQLite | 3.x | Zero-config, file-based, perfect for single-user |
| ORM | Drizzle ORM | Latest | Type-safe, lightweight, excellent DX |
| Validation | Zod | 3.x | Runtime validation with TypeScript inference |
| HTTP Client | Fetch API + React Query | 5.x | Native fetch, excellent caching/state management |

### 2.2 Technology Decisions

#### Frontend: React + Vite + TypeScript

**Decision:** Use React 18 with Vite as the build tool and TypeScript for type safety.

**Rationale:**
- React's component model is well-suited to the simple UI requirements
- Vite provides fast HMR and simple configuration
- TypeScript catches errors early and enables shared type definitions with the backend
- React Query handles server state, caching, and optimistic updates elegantly

**Alternatives Considered:**
- **Vue 3:** Equally capable, but React has broader ecosystem support
- **Next.js:** Overkill for a simple SPA without SSR requirements
- **Plain JavaScript:** Loses type safety benefits for minimal gain

#### Backend: Node.js + Express + TypeScript

**Decision:** Use Express on Node.js with TypeScript for the REST API.

**Rationale:**
- Express is minimal, flexible, and universally understood
- Shares TypeScript types with frontend (monorepo advantage)
- Node.js 20 LTS provides excellent performance and stability
- Easy to deploy to any hosting provider

**Alternatives Considered:**
- **Fastify:** Faster but adds complexity for this scale
- **Hono:** Promising but less mature ecosystem
- **NestJS:** Too much ceremony for a simple CRUD API

#### Database: SQLite + Drizzle ORM

**Decision:** Use SQLite as the database with Drizzle ORM for type-safe queries.

**Rationale:**
- SQLite is zero-configuration and perfect for single-user applications
- File-based storage simplifies deployment and backup
- Drizzle provides type-safe queries with minimal overhead
- Easy migration path to PostgreSQL if needed later

**Alternatives Considered:**
- **PostgreSQL:** Unnecessary infrastructure for single-user MVP
- **JSON file:** Lacks query capabilities and ACID guarantees
- **Prisma:** Heavier than needed; Drizzle is lighter and faster

#### Styling: CSS Modules

**Decision:** Use CSS Modules for component-scoped styling.

**Rationale:**
- Scoped styles prevent CSS conflicts and naming collisions
- Zero runtime overhead — styles compiled at build time
- Native CSS syntax — no learning curve for new developers
- Vite has built-in CSS Modules support
- Easy to understand and debug in browser dev tools

**Alternatives Considered:**
- **Tailwind CSS:** Fast but adds utility class learning curve
- **Styled Components:** Runtime CSS-in-JS overhead
- **Vanilla CSS:** Global scope leads to naming conflicts

---

## 3. System Architecture

### 3.1 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                          Browser                                 │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    React SPA (Vite)                       │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │  Components │  │ React Query │  │  Zod Validation │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
                              │
                              │ HTTP/REST (JSON)
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       Node.js Server                             │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                   Express Application                      │  │
│  │  ┌─────────────┐  ┌─────────────┐  ┌─────────────────┐   │  │
│  │  │   Routes    │  │ Controllers │  │  Zod Validation │   │  │
│  │  └─────────────┘  └─────────────┘  └─────────────────┘   │  │
│  │  ┌─────────────────────────────────────────────────────┐ │  │
│  │  │              Drizzle ORM (Type-safe)                │ │  │
│  │  └─────────────────────────────────────────────────────┘ │  │
│  └───────────────────────────────────────────────────────────┘  │
│                              │                                   │
│                              ▼                                   │
│  ┌───────────────────────────────────────────────────────────┐  │
│  │                    SQLite Database                         │  │
│  │                    (todos.db file)                         │  │
│  └───────────────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────────────┘
```

### 3.2 Project Structure

```
clearday/
├── frontend/                    # React SPA
│   ├── src/
│   │   ├── components/          # React components
│   │   │   ├── TodoList/
│   │   │   │   ├── TodoList.tsx
│   │   │   │   └── TodoList.module.css
│   │   │   ├── TaskSection/
│   │   │   │   ├── TaskSection.tsx
│   │   │   │   └── TaskSection.module.css
│   │   │   ├── SectionHeader/
│   │   │   │   ├── SectionHeader.tsx
│   │   │   │   └── SectionHeader.module.css
│   │   │   ├── TodoItem/
│   │   │   │   ├── TodoItem.tsx
│   │   │   │   └── TodoItem.module.css
│   │   │   ├── TodoInput/
│   │   │   │   ├── TodoInput.tsx
│   │   │   │   └── TodoInput.module.css
│   │   │   ├── EmptyState/
│   │   │   │   ├── EmptyState.tsx
│   │   │   │   └── EmptyState.module.css
│   │   │   ├── LoadingState/
│   │   │   │   ├── LoadingState.tsx
│   │   │   │   └── LoadingState.module.css
│   │   │   ├── ErrorState/
│   │   │   │   ├── ErrorState.tsx
│   │   │   │   └── ErrorState.module.css
│   │   │   ├── ThemeToggle/
│   │   │   │   ├── ThemeToggle.tsx
│   │   │   │   └── ThemeToggle.module.css
│   │   │   └── ui/              # Generic UI components
│   │   │       ├── Button/
│   │   │       │   ├── Button.tsx
│   │   │       │   └── Button.module.css
│   │   │       ├── Checkbox/
│   │   │       │   ├── Checkbox.tsx
│   │   │       │   └── Checkbox.module.css
│   │   │       ├── Input/
│   │   │       │   ├── Input.tsx
│   │   │       │   └── Input.module.css
│   │   │       └── Spinner/
│   │   │           ├── Spinner.tsx
│   │   │           └── Spinner.module.css
│   │   ├── hooks/               # Custom React hooks
│   │   │   ├── useTodos.ts      # React Query hooks for todos
│   │   │   └── useTheme.ts      # Theme detection and persistence
│   │   ├── api/                 # API client functions
│   │   │   └── todos.ts
│   │   ├── types/               # TypeScript types (shared)
│   │   │   └── todo.ts
│   │   ├── styles/              # Global styles
│   │   │   ├── global.css       # CSS reset, variables, base styles
│   │   │   └── variables.css    # CSS custom properties (colors, spacing)
│   │   ├── App.tsx
│   │   ├── App.module.css
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── tsconfig.json
│   └── package.json
│
├── backend/                     # Express API
│   ├── src/
│   │   ├── routes/              # Express route definitions
│   │   │   └── todos.ts
│   │   ├── controllers/         # Request handlers
│   │   │   └── todos.ts
│   │   ├── db/                  # Database configuration
│   │   │   ├── schema.ts        # Drizzle schema
│   │   │   ├── index.ts         # DB connection
│   │   │   └── migrations/      # SQL migrations
│   │   ├── middleware/          # Express middleware
│   │   │   ├── errorHandler.ts
│   │   │   └── validation.ts
│   │   ├── types/               # TypeScript types
│   │   │   └── todo.ts
│   │   ├── validation/          # Zod schemas
│   │   │   └── todo.ts
│   │   └── index.ts             # Server entry point
│   ├── data/                    # SQLite database files
│   │   └── .gitkeep
│   ├── tsconfig.json
│   └── package.json
│
├── shared/                      # Shared types (optional)
│   └── types/
│       └── todo.ts
│
├── package.json                 # Root workspace config
├── tsconfig.base.json           # Shared TS config
└── README.md
```

---

## 4. Data Architecture

### 4.1 Database Schema

```sql
-- SQLite Schema
CREATE TABLE todos (
    id TEXT PRIMARY KEY,           -- UUID v4
    text TEXT NOT NULL,            -- Task description (max 500 chars)
    completed INTEGER DEFAULT 0,   -- Boolean: 0 = false, 1 = true
    created_at TEXT NOT NULL       -- ISO 8601 timestamp
);

-- Index for default sort order
CREATE INDEX idx_todos_created_at ON todos(created_at DESC);
```

### 4.2 Drizzle Schema Definition

```typescript
// backend/src/db/schema.ts
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core';

export const todos = sqliteTable('todos', {
  id: text('id').primaryKey(),
  text: text('text').notNull(),
  completed: integer('completed', { mode: 'boolean' }).default(false).notNull(),
  createdAt: text('created_at').notNull(),
});

export type Todo = typeof todos.$inferSelect;
export type NewTodo = typeof todos.$inferInsert;
```

### 4.3 TypeScript Types (Shared)

```typescript
// shared/types/todo.ts
export interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string; // ISO 8601
}

export interface CreateTodoRequest {
  text: string;
}

export interface UpdateTodoRequest {
  text?: string;
  completed?: boolean;
}
```

---

## 5. API Design

### 5.1 RESTful Endpoints

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| GET | `/api/todos` | List all todos | — | 200: Todo[] |
| POST | `/api/todos` | Create a todo | CreateTodoRequest | 201: Todo |
| PATCH | `/api/todos/:id` | Update a todo | UpdateTodoRequest | 200: Todo |
| DELETE | `/api/todos/:id` | Delete a todo | — | 204: No Content |

### 5.2 Validation Schemas (Zod)

```typescript
// backend/src/validation/todo.ts
import { z } from 'zod';

export const createTodoSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be 500 characters or less'),
});

export const updateTodoSchema = z.object({
  text: z
    .string()
    .trim()
    .min(1, 'Todo text is required')
    .max(500, 'Todo text must be 500 characters or less')
    .optional(),
  completed: z.boolean().optional(),
});

export const todoIdSchema = z.object({
  id: z.string().uuid('Invalid todo ID'),
});
```

### 5.3 Error Response Format

```typescript
interface ApiError {
  error: {
    code: string;
    message: string;
    details?: Record<string, string[]>; // Validation errors
  };
}
```

**Standard Error Codes:**

| HTTP Status | Code | Description |
|-------------|------|-------------|
| 400 | VALIDATION_ERROR | Request body failed validation |
| 404 | NOT_FOUND | Todo with given ID does not exist |
| 500 | INTERNAL_ERROR | Unexpected server error |

---

## 6. Frontend Architecture

### 6.1 Component Hierarchy

```
App
├── Header
│   ├── App title ("📝 Clearday")
│   └── ThemeToggle (sun/moon icon, toggles light/dark mode)
├── TodoInput
│   └── Input field + Add button
├── TodoList
│   ├── LoadingState (shown while fetching)
│   ├── ErrorState (shown on fetch failure)
│   ├── EmptyState (shown when no tasks exist at all)
│   ├── TaskSection (Active — "Tasks")
│   │   ├── SectionHeader ("Tasks")
│   │   ├── EmptyState (section-specific: "No tasks yet!")
│   │   └── TodoItem[] (incomplete tasks, newest first)
│   │       ├── Checkbox (toggle complete)
│   │       ├── Text display
│   │       └── Delete button
│   └── TaskSection (Completed — hidden if empty)
│       ├── SectionHeader ("Completed")
│       └── TodoItem[] (completed tasks, newest first)
│           ├── Checkbox (toggle incomplete)
│           ├── Text display (strikethrough, muted)
│           └── Delete button
└── Footer (optional - todo count)
```

**Section Behavior:**
- Active section always visible (shows empty state if no active tasks)
- Completed section hidden entirely when no completed tasks exist
- When a task is completed, it animates from Active → Completed section
- When a task is uncompleted, it animates from Completed → Active section

### 6.2 State Management Strategy

**Server State (React Query):**
- All todo data is server state
- React Query handles fetching, caching, and synchronization
- Optimistic updates for immediate UI feedback

**Local State (React useState):**
- Form input values
- UI state (e.g., loading indicators during mutations)
- Theme preference (light/dark, persisted to localStorage)

### 6.3 Theme Implementation

**Architecture Decision:** Use CSS custom properties with a `data-theme` attribute on the root element. Theme state is client-only (no server persistence needed).

**Theme Detection Priority:**
1. User preference saved in localStorage
2. System preference via `prefers-color-scheme` media query
3. Default to light mode

**useTheme Hook:**

```typescript
// frontend/src/hooks/useTheme.ts
import { useState, useEffect } from 'react';

type Theme = 'light' | 'dark';

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    // 1. Check localStorage
    const saved = localStorage.getItem('theme') as Theme | null;
    if (saved === 'light' || saved === 'dark') return saved;
    
    // 2. Check system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    
    // 3. Default to light
    return 'light';
  });

  useEffect(() => {
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Listen for system preference changes (only if no user preference)
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      if (!localStorage.getItem('theme')) {
        setTheme(e.matches ? 'dark' : 'light');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  return { theme, toggleTheme };
}
```

**ThemeToggle Component:**

```tsx
// frontend/src/components/ThemeToggle/ThemeToggle.tsx
import styles from './ThemeToggle.module.css';
import { useTheme } from '../../hooks/useTheme';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
    >
      {theme === 'light' ? '☀️' : '🌙'}
    </button>
  );
}
```

```css
/* frontend/src/components/ThemeToggle/ThemeToggle.module.css */
.toggle {
  display: flex;
  align-items: center;
  justify-content: center;
  width: var(--touch-target-min);
  height: var(--touch-target-min);
  background: transparent;
  border: none;
  border-radius: var(--border-radius);
  cursor: pointer;
  font-size: 1.25rem;
  transition: background-color 200ms ease-in-out;
}

.toggle:hover {
  background-color: var(--color-surface);
}

.toggle:focus-visible {
  outline: 2px solid var(--color-primary);
  outline-offset: 2px;
}
```

**Flash Prevention (index.html):**

```html
<!-- In <head> before stylesheets to prevent flash of wrong theme -->
<script>
  (function() {
    const saved = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
  })();
</script>
```

### 6.4 React Query Configuration

```typescript
// frontend/src/hooks/useTodos.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import * as todosApi from '../api/todos';
import type { Todo } from '../types/todo';

export function useTodos() {
  return useQuery({
    queryKey: ['todos'],
    queryFn: todosApi.fetchTodos,
  });
}

// Derived data: split todos into active and completed sections
export function useTodoSections() {
  const { data: todos = [], ...rest } = useTodos();
  
  const activeTodos = todos.filter((todo: Todo) => !todo.completed);
  const completedTodos = todos.filter((todo: Todo) => todo.completed);
  
  return {
    activeTodos,
    completedTodos,
    ...rest,
  };
}

export function useCreateTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: todosApi.createTodo,
    onMutate: async (newTodo) => {
      // Optimistic update — new task appears at top of Active section
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'], (old: Todo[]) => [
        { ...newTodo, id: 'temp-id', completed: false, createdAt: new Date().toISOString() },
        ...old,
      ]);
      return { previous };
    },
    onError: (err, newTodo, context) => {
      // Rollback on error
      queryClient.setQueryData(['todos'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}

export function useToggleTodo() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      todosApi.updateTodo(id, { completed }),
    onMutate: async ({ id, completed }) => {
      // Optimistic update — task moves between sections immediately
      await queryClient.cancelQueries({ queryKey: ['todos'] });
      const previous = queryClient.getQueryData(['todos']);
      queryClient.setQueryData(['todos'], (old: Todo[]) =>
        old.map((todo) =>
          todo.id === id ? { ...todo, completed } : todo
        )
      );
      return { previous };
    },
    onError: (err, variables, context) => {
      queryClient.setQueryData(['todos'], context?.previous);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ['todos'] });
    },
  });
}
```

### 6.5 CSS Modules Usage

**Folder structure convention:** Each component lives in its own folder with:
- `ComponentName.tsx` — Component implementation
- `ComponentName.module.css` — Scoped styles

**Example folder structure:**

```
components/
├── TodoItem/
│   ├── TodoItem.tsx
│   └── TodoItem.module.css
├── TodoList/
│   ├── TodoList.tsx
│   └── TodoList.module.css
└── TodoInput/
    ├── TodoInput.tsx
    └── TodoInput.module.css
```

**Example Component:**

```tsx
// frontend/src/components/TodoItem/TodoItem.tsx
import styles from './TodoItem.module.css';
import type { Todo } from '../../types/todo';

interface TodoItemProps {
  todo: Todo;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TodoItem({ todo, onToggle, onDelete }: TodoItemProps) {
  return (
    <div className={styles.item}>
      <input
        type="checkbox"
        checked={todo.completed}
        onChange={() => onToggle(todo.id)}
        className={styles.checkbox}
      />
      <span className={todo.completed ? styles.textCompleted : styles.text}>
        {todo.text}
      </span>
      <button onClick={() => onDelete(todo.id)} className={styles.deleteButton}>
        Delete
      </button>
    </div>
  );
}
```

**Example CSS Module:**

```css
/* frontend/src/components/TodoItem/TodoItem.module.css */
.item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border-bottom: 1px solid var(--color-border);
}

.checkbox {
  width: 1.25rem;
  height: 1.25rem;
  cursor: pointer;
}

.text {
  flex: 1;
  color: var(--color-text);
}

.textCompleted {
  flex: 1;
  color: var(--color-text-muted);
  text-decoration: line-through;
}

.deleteButton {
  padding: 0.25rem 0.5rem;
  color: var(--color-danger);
  background: transparent;
  border: none;
  cursor: pointer;
}

.deleteButton:hover {
  background: var(--color-danger-bg);
  border-radius: 4px;
}
```

**Import paths (direct file references):**

```typescript
// Direct imports to component files
import { TodoItem } from './components/TodoItem/TodoItem';
import { TodoList } from './components/TodoList/TodoList';
import { TodoInput } from './components/TodoInput/TodoInput';
import { TaskSection } from './components/TaskSection/TaskSection';
import { SectionHeader } from './components/SectionHeader/SectionHeader';
import { EmptyState } from './components/EmptyState/EmptyState';
import { LoadingState } from './components/LoadingState/LoadingState';
import { ErrorState } from './components/ErrorState/ErrorState';
import { ThemeToggle } from './components/ThemeToggle/ThemeToggle';
import { Button } from './components/ui/Button/Button';
import { Input } from './components/ui/Input/Input';
import { Checkbox } from './components/ui/Checkbox/Checkbox';
import { Spinner } from './components/ui/Spinner/Spinner';
```

**Global CSS Variables:**

```css
/* frontend/src/styles/variables.css */
:root {
  /* Colors - Accessibility-Compliant Palette (WCAG 2.1 AA) */
  /* Primary Colors */
  --color-background: #FFFFFF;
  --color-surface: #FAFAFA;
  --color-text: #333333;
  --color-text-secondary: #666666;
  --color-text-muted: #767676;
  --color-border: #949494;
  
  /* Accent Colors */
  --color-primary: #4A90D9;        /* Focus Blue */
  --color-primary-hover: #3A7BC8;
  --color-success: #5CB85C;        /* Checkbox checked */
  --color-danger: #D9534F;         /* Delete hover */
  --color-danger-bg: #FDEAEA;
  --color-warning: #F0AD4E;        /* Error state icon */

  /* Spacing */
  --spacing-xs: 0.25rem;
  --spacing-sm: 0.5rem;
  --spacing-md: 1rem;
  --spacing-lg: 1.5rem;
  --spacing-xl: 2rem;

  /* Typography */
  --font-family: system-ui, -apple-system, sans-serif;
  --font-size-sm: 0.875rem;
  --font-size-base: 1rem;
  --font-size-lg: 1.125rem;

  /* Layout */
  --max-width: 600px;              /* Per UX spec */
  --border-radius: 6px;
  
  /* Touch Targets (Accessibility) */
  --touch-target-min: 44px;        /* WCAG 2.1 AA minimum */
  --input-height: 48px;            /* Per wireframe spec */
  
  /* Animation Timings */
  --animation-appear: 200ms;
  --animation-complete: 150ms;
  --animation-delete: 200ms;
  --animation-section: 200ms;
  --animation-easing: ease-in-out;
  --animation-easing-out: ease-out;
}

/* Dark Mode Colors (via data-theme attribute) */
[data-theme="dark"] {
  --color-background: #1A1A1A;
  --color-surface: #242424;
  --color-text: #E8E8E8;
  --color-text-secondary: #A0A0A0;
  --color-text-muted: #8A8A8A;
  --color-border: #4A4A4A;
  
  /* Accent Colors - Adjusted for dark backgrounds */
  --color-primary: #5BA0E9;        /* Focus Blue (lighter) */
  --color-primary-hover: #6BB0F9;
  --color-success: #6DC86C;        /* Checkbox checked */
  --color-danger: #E9635F;         /* Delete hover */
  --color-danger-bg: #3A2020;
  --color-warning: #FFBD5E;        /* Error state icon */
}

/* Reduced Motion Support */
@media (prefers-reduced-motion: reduce) {
  :root {
    --animation-appear: 0ms;
    --animation-complete: 0ms;
    --animation-delete: 0ms;
    --animation-section: 0ms;
  }
}
```

---

## 7. Security Considerations

### 7.1 Input Validation

- **Client-side:** Zod schemas validate before API calls (UX feedback)
- **Server-side:** Zod schemas validate all incoming requests (security)
- **Database:** SQLite parameterized queries prevent SQL injection

### 7.2 XSS Prevention

- React's JSX automatically escapes rendered content
- No `dangerouslySetInnerHTML` usage
- Content-Security-Policy headers recommended for production

### 7.3 Security Headers (Production)

```typescript
// backend/src/middleware/security.ts
import helmet from 'helmet';

app.use(helmet());
```

### 7.4 CORS Configuration

```typescript
// backend/src/index.ts
import cors from 'cors';

app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  methods: ['GET', 'POST', 'PATCH', 'DELETE'],
}));
```

### 7.5 Future Authentication Path

The architecture supports adding authentication without major refactoring:

1. Add user table with standard auth fields
2. Add `user_id` foreign key to todos table
3. Implement JWT or session-based auth middleware
4. Add auth context to frontend with protected routes

---

## 8. UX Implementation Requirements

This section captures specific UX requirements from the UX → Architecture Handoff that must be implemented.

### 8.1 Accessibility Requirements (WCAG 2.1 AA)

| Requirement | Implementation |
|-------------|----------------|
| **Color Contrast** | 4.5:1 minimum ratio for all text (validated palette in CSS variables) |
| **Touch Targets** | 44x44px minimum for all interactive elements |
| **Input Height** | 48px minimum for TaskInput field |
| **Keyboard Navigation** | Full keyboard support: Tab, Enter, Space, Delete, Escape |
| **Screen Readers** | Semantic HTML elements, ARIA labels where needed |
| **Focus Management** | Visible focus rings (2px outline), logical tab order |
| **Reduced Motion** | Respect `prefers-reduced-motion: reduce` media query |

**Keyboard Interactions:**

| Key | Context | Action |
|-----|---------|--------|
| `Tab` | Global | Move focus to next interactive element |
| `Shift+Tab` | Global | Move focus to previous interactive element |
| `Enter` | TaskInput | Submit new task |
| `Enter` | TaskItem checkbox | Toggle completion |
| `Space` | TaskItem checkbox | Toggle completion |
| `Delete` / `Backspace` | TaskItem (focused) | Delete task (with confirmation) |
| `Escape` | TaskInput | Clear input field |

**ARIA Implementation:**

```tsx
// TaskInput — descriptive label
<input
  type="text"
  aria-label="New task"
  placeholder="What needs to be done?"
/>

// TaskItem — checkbox with label
<div role="listitem" aria-label={`Task: ${todo.text}`}>
  <input
    type="checkbox"
    aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
  />
  <button aria-label={`Delete task: ${todo.text}`}>Delete</button>
</div>

// TaskSection — labeled region
<section aria-labelledby="active-tasks-heading">
  <h2 id="active-tasks-heading">Tasks</h2>
  <ul role="list">{/* tasks */}</ul>
</section>

// Live region for announcements
<div aria-live="polite" aria-atomic="true" className="sr-only">
  {/* Announce task added, completed, deleted */}
</div>
```

### 8.2 Animation Specifications

| Animation | Duration | Easing | Trigger |
|-----------|----------|--------|---------|
| Task appear | 200ms | ease-out | New task added |
| Task complete | 150ms + 200ms | ease-in-out | Checkbox toggled (fade + section move) |
| Task delete | 200ms | ease-in-out | Delete clicked |
| Section transition | 200ms | ease-in-out | Task moves between Active/Completed |

**CSS Animation Implementation:**

```css
/* Task appear animation */
.taskEnter {
  opacity: 0;
  transform: translateY(-10px);
}
.taskEnterActive {
  opacity: 1;
  transform: translateY(0);
  transition: opacity var(--animation-appear) var(--animation-easing-out),
              transform var(--animation-appear) var(--animation-easing-out);
}

/* Task delete animation */
.taskExit {
  opacity: 1;
  transform: translateX(0);
}
.taskExitActive {
  opacity: 0;
  transform: translateX(20px);
  transition: opacity var(--animation-delete) var(--animation-easing),
              transform var(--animation-delete) var(--animation-easing);
}

/* Task completion animation */
.completing {
  transition: opacity var(--animation-complete) var(--animation-easing);
}

/* Section transition */
.sectionMove {
  transition: transform var(--animation-section) var(--animation-easing);
}
```

**Animation Library Decision:** Use CSS transitions (no external library). CSS transitions are:
- Zero runtime overhead
- Automatically respect `prefers-reduced-motion` via CSS variables
- Sufficient for the simple animations required
- Native browser support

### 8.3 Responsive Design

| Breakpoint | Width | Container | Padding |
|------------|-------|-----------|---------|
| Mobile | < 768px | 100% width | 16px horizontal |
| Desktop | ≥ 768px | 600px max-width, centered | - |

**CSS Implementation:**

```css
/* frontend/src/styles/global.css */
.container {
  width: 100%;
  max-width: var(--max-width);
  margin: 0 auto;
  padding: 0 var(--spacing-md);
}

@media (min-width: 768px) {
  .container {
    padding: 0;
  }
}
```

### 8.4 Component State Specifications

| Component | States | Key Behaviors |
|-----------|--------|---------------|
| **TaskInput** | default, focused, typing, error | Auto-focus on page load, Enter to submit, clear after submit |
| **TaskItem** | incomplete, hover, focused, completed | Checkbox toggle, delete button appears on hover (always visible on mobile) |
| **TaskSection** | active, completed | Active always visible; Completed hidden when empty |
| **SectionHeader** | visible | "Tasks" always shown; "Completed" only when section has items |
| **EmptyState** | global, section-specific | Global: "No tasks yet!" when no tasks exist; Section: shown in Active when all tasks completed |
| **LoadingState** | loading | Show spinner only if API response > 200ms (delayed loading indicator) |
| **ErrorState** | error | Display error message with "Try Again" button |
| **ThemeToggle** | light, dark | Sun/moon icon toggle; 44px touch target; persists to localStorage; detects system preference |

### 8.5 Performance Targets

| Metric | Target | Implementation Strategy |
|--------|--------|-------------------------|
| Initial page load | < 2 seconds | Vite code splitting, gzip compression |
| API response | < 200ms | SQLite local reads, indexed queries |
| UI feedback | Immediate | Optimistic updates via React Query |
| Task capture (end-to-end) | < 10 seconds | Auto-focus input, single action submit |
| Loading indicator delay | 200ms | Only show LoadingState after 200ms |

---

## 9. Deployment Architecture

### 8.1 Development Environment

```
┌──────────────────────────────────────────────────────────────┐
│                    Developer Machine                          │
│                                                               │
│   ┌─────────────────┐          ┌─────────────────────────┐   │
│   │  Vite Dev Server│          │    Express Dev Server   │   │
│   │   (port 5173)   │◀────────▶│      (port 3000)        │   │
│   │                 │  Proxy   │                         │   │
│   └─────────────────┘          └───────────┬─────────────┘   │
│                                            │                  │
│                                            ▼                  │
│                                ┌─────────────────────────┐   │
│                                │  SQLite (todos.db)      │   │
│                                └─────────────────────────┘   │
└──────────────────────────────────────────────────────────────┘
```

### 8.2 Production Deployment Options

**Option A: Single Server (Recommended for v1.0)**

```
┌─────────────────────────────────────────────────────────────┐
│                     Production Server                        │
│                                                              │
│   ┌────────────────────────────────────────────────────┐    │
│   │              Node.js (Express)                      │    │
│   │   • Serves static frontend build                    │    │
│   │   • Handles API requests                            │    │
│   │   • SQLite database in /data                        │    │
│   └────────────────────────────────────────────────────┘    │
│                                                              │
│   Hosting: Railway, Render, Fly.io, DigitalOcean App Platform│
└─────────────────────────────────────────────────────────────┘
```

**Option B: Separate Frontend/Backend**

```
┌─────────────────────┐        ┌─────────────────────────────┐
│   Static Hosting    │        │       API Server            │
│   (Vercel/Netlify)  │◀──────▶│    (Railway/Render)         │
│   • Frontend build  │  API   │    • Express + SQLite       │
└─────────────────────┘        └─────────────────────────────┘
```

### 8.3 Environment Variables

```bash
# backend/.env
NODE_ENV=development|production
PORT=3000
DATABASE_PATH=./data/todos.db
FRONTEND_URL=http://localhost:5173

# frontend/.env
VITE_API_URL=http://localhost:3000/api
```

---

## 10. Development Workflow

### 10.1 Scripts

```json
// Root package.json
{
  "scripts": {
    "dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "start": "cd backend && npm run start",
    "db:migrate": "cd backend && npm run db:migrate",
    "db:studio": "cd backend && npm run db:studio",
    "test": "npm run test:frontend && npm run test:backend",
    "lint": "npm run lint:frontend && npm run lint:backend"
  }
}
```

### 10.2 Database Migrations

```bash
# Generate migration from schema changes
npm run db:generate

# Apply migrations
npm run db:migrate

# Open Drizzle Studio (database GUI)
npm run db:studio
```

---

## 11. Performance Considerations

### 11.1 Frontend Performance

| Technique | Implementation |
|-----------|----------------|
| Code splitting | Vite automatic chunking |
| Optimistic updates | React Query mutation handlers |
| Scoped CSS | CSS Modules with build-time compilation |
| Efficient renders | React 18 automatic batching |

### 11.2 Backend Performance

| Technique | Implementation |
|-----------|----------------|
| Connection pooling | Drizzle built-in connection management |
| Indexed queries | Index on `created_at` for sort |
| Minimal middleware | Only essential Express middleware |

### 11.3 Target Metrics (from PRD)

| Metric | Target | Strategy |
|--------|--------|----------|
| Initial page load | < 2s | Vite build optimization, gzip |
| API response time | < 200ms | SQLite local reads, no N+1 |
| UI feedback | Immediate | Optimistic updates |

---

## 12. Testing Strategy

### 12.1 Testing Pyramid

```
        ╱╲
       ╱  ╲         E2E Tests (Playwright)
      ╱────╲        • Critical user flows
     ╱      ╲       
    ╱────────╲      Integration Tests
   ╱          ╲     • API endpoints with real DB
  ╱────────────╲    
 ╱              ╲   Unit Tests (Vitest)
╱────────────────╲  • Validation schemas
                    • Utility functions
                    • React components
```

### 12.2 Testing Tools

| Layer | Tool | Coverage Target |
|-------|------|-----------------|
| Unit (Frontend) | Vitest + React Testing Library | Components, hooks |
| Unit (Backend) | Vitest | Validation, utilities |
| Integration | Vitest + Supertest | API endpoints |
| E2E | Playwright | Critical user paths |
| Accessibility | axe-core + Playwright | WCAG 2.1 AA compliance |

### 12.3 Test File Conventions

```
frontend/src/components/__tests__/TodoItem.test.tsx
backend/src/routes/__tests__/todos.test.ts
e2e/tests/todo-crud.spec.ts
```

---

## 13. Monitoring & Observability (Production)

### 13.1 Logging

```typescript
// backend/src/middleware/logger.ts
import pino from 'pino';

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport: process.env.NODE_ENV === 'development'
    ? { target: 'pino-pretty' }
    : undefined,
});
```

### 13.2 Health Check Endpoint

```typescript
// GET /api/health
app.get('/api/health', async (req, res) => {
  try {
    // Verify database connection
    await db.select().from(todos).limit(1);
    res.json({ status: 'healthy', timestamp: new Date().toISOString() });
  } catch (error) {
    res.status(503).json({ status: 'unhealthy', error: 'Database unavailable' });
  }
});
```

---

## 14. Extensibility Considerations

### 14.1 Future Authentication

The architecture supports adding authentication with minimal changes:

1. Add `users` table to schema
2. Add `user_id` column to `todos` table
3. Create auth middleware for protected routes
4. Add auth context provider in React
5. Update React Query hooks to pass auth headers

### 14.2 Future Database Migration (PostgreSQL)

Drizzle ORM supports PostgreSQL with minimal schema changes:

1. Update Drizzle config to use PostgreSQL driver
2. Migrate SQLite data to PostgreSQL
3. Update connection string in environment variables

### 14.3 API Versioning

If needed, version the API by updating routes:

```typescript
// Current
app.use('/api/todos', todosRouter);

// Versioned
app.use('/api/v1/todos', todosRouter);
app.use('/api/v2/todos', todosV2Router);
```

---

## 15. Technical Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| SQLite concurrent writes | Data corruption | Low (single-user) | WAL mode, single server deployment |
| SQLite file loss | Data loss | Low | Regular backups, persistent storage |
| Bundle size growth | Slow load times | Medium | Vite tree-shaking, dependency audits |
| Breaking changes in deps | Build failures | Low | Lock dependency versions, Renovate bot |

---

## 16. Decision Log

| Date | Decision | Rationale | Alternatives Rejected |
|------|----------|-----------|----------------------|
| 2026-03-04 | SQLite over PostgreSQL | Zero-config, perfect for single-user MVP | PostgreSQL (unnecessary infrastructure) |
| 2026-03-04 | Drizzle over Prisma | Lighter, faster, excellent TypeScript DX | Prisma (heavier), raw SQL (no types) |
| 2026-03-04 | React Query over Redux | Server state focus, built-in caching | Redux (overkill), Zustand (less caching) |
| 2026-03-04 | CSS Modules over Tailwind | Native CSS syntax, scoped styles, zero runtime | Tailwind (utility learning curve), Styled Components (runtime cost) |
| 2026-03-04 | Express over Fastify | Simpler, universal understanding | Fastify (marginal perf gains not needed) |
| 2026-03-05 | Two-section task list (Active/Completed) | Better visual hierarchy, clearer task states, reduces cognitive load per PRD v1.1 | Single flat list (less organized), Tabs (extra interaction) |
| 2026-03-05 | CSS transitions for animations | Zero runtime overhead, native reduced-motion support, sufficient for simple animations | React Spring (overkill), Framer Motion (bundle size), GSAP (complexity) |
| 2026-03-05 | WCAG 2.1 AA accessibility target | Required by UX handoff, ensures broad usability | WCAG AAA (too restrictive for MVP) |
| 2026-03-05 | axe-core for accessibility testing | Industry standard, Playwright integration, automated CI checks | Manual testing only (error-prone) |
| 2026-03-05 | CSS custom properties + data-theme for dark mode | Zero runtime overhead, flash prevention via inline script, respects system preference, persists user choice | CSS-in-JS themes (runtime cost), separate stylesheets (duplication), React context only (flash on load) |

---

## 17. Acceptance Criteria (Architecture)

| Criterion | Verification |
|-----------|--------------|
| Full CRUD operations work | Integration tests pass |
| Data persists across restarts | E2E test with server restart |
| Optimistic updates function | Frontend tests verify immediate UI update |
| Error states display correctly | Manual testing with network failures |
| Responsive on mobile/desktop | Visual testing at breakpoints |
| Build completes < 30 seconds | CI pipeline timing |
| Cold start < 5 seconds | Production deployment verification |
| Accessibility (WCAG 2.1 AA) | axe-core tests pass, keyboard navigation works |
| Touch targets ≥ 44px | Visual inspection, automated checks |
| Color contrast ≥ 4.5:1 | axe-core automated verification |
| Animations respect reduced-motion | Manual test with `prefers-reduced-motion: reduce` |
| Dark mode toggle works | Click toggle switches theme, verified in both modes |
| Theme persists across sessions | Reload page, verify theme matches previous selection |
| System preference detection | New user with dark OS preference sees dark mode |
| No theme flash on load | Page loads without visible flash of wrong theme |

---

## Document History

| Version | Date | Author | Changes |
|---------|------|--------|---------|
| 1.0-draft | March 4, 2026 | Winston (Architect) | Initial architecture based on PRD v1.0 |
| 1.0 | March 4, 2026 | Winston (Architect) | Approved by Rob |
| 1.1 | March 5, 2026 | Winston (Architect) | Updated for PRD v1.1: Added TaskSection, SectionHeader, EmptyState, LoadingState, ErrorState components; Updated component hierarchy for two-section design (Active/Completed); Added useTodoSections and useToggleTodo hooks |
| 1.2 | March 5, 2026 | Winston (Architect) | Integrated UX handoff requirements: Added Section 8 (UX Implementation Requirements) covering accessibility (WCAG 2.1 AA), animation specs, responsive design, keyboard navigation; Updated CSS variables with accessibility-compliant color palette; Added axe-core to testing tools; Expanded acceptance criteria for accessibility validation |
| 1.3 | March 5, 2026 | Winston (Architect) | Added dark mode support per wireframes v1.2: ThemeToggle component in hierarchy and project structure; useTheme hook with localStorage persistence and system preference detection; Dark mode CSS variables with data-theme attribute; Flash prevention inline script for index.html; Updated decision log and acceptance criteria |
