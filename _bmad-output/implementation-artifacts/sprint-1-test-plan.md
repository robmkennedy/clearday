# Sprint 1 Test Plan

## ClearDay Application

**Version:** 1.0  
**Date:** March 5, 2026  
**Author:** Quinn (QA Engineer)  
**Sprint Reference:** Sprint 1 Backlog  
**Architecture Reference:** architecture.md v1.3

---

## 1. Test Plan Overview

### 1.1 Objectives

- Validate that all Sprint 1 acceptance criteria are met
- Establish baseline test infrastructure for future sprints
- Ensure foundation components are production-ready
- Verify accessibility requirements from day one

### 1.2 Scope

| In Scope | Out of Scope |
|----------|--------------|
| Monorepo structure validation | Performance benchmarking |
| Backend API (GET/POST /api/todos) | Load testing |
| Frontend task input component | Theme toggle (future sprint) |
| Database schema & migrations | Edit/delete operations (future sprint) |
| Shared types & Zod validation | Todo completion toggle (future sprint) |
| Accessibility compliance | Cross-browser testing (IE11, etc.) |

### 1.3 Test Strategy Summary

| Layer | Approach | Tools |
|-------|----------|-------|
| Unit Tests | Component-level isolation | Vitest (frontend), Vitest (backend) |
| Integration Tests | API endpoint testing | Supertest + Vitest |
| E2E Tests | Critical user flows | Playwright |
| Accessibility | Automated + Manual checks | axe-core, Playwright, Manual |
| Validation | Schema validation | Zod (runtime) |

---

## 2. Test Environment Requirements

### 2.1 Development Environment

```yaml
Node.js: 20.x LTS
npm: 10.x
OS: macOS, Linux, Windows (WSL2)
SQLite: 3.x (via better-sqlite3)
```

### 2.2 Test Databases

| Environment | Database Location | Purpose |
|-------------|-------------------|---------|
| Unit Tests | `:memory:` | In-memory SQLite for fast tests |
| Integration | `backend/data/test.db` | Isolated test database |
| E2E | `backend/data/e2e.db` | End-to-end test database |

### 2.3 Test Configuration Files

```
clearday/
├── vitest.config.ts              # Root Vitest config
├── playwright.config.ts          # E2E test config
├── frontend/
│   └── vitest.config.ts          # Frontend unit tests
├── backend/
│   └── vitest.config.ts          # Backend unit/integration tests
```

---

## 3. Test Categories & Coverage Targets

### 3.1 Coverage Targets

| Category | Target | Rationale |
|----------|--------|-----------|
| Unit Tests | 80%+ | Core business logic coverage |
| Integration | 100% endpoints | All API endpoints tested |
| E2E | Critical paths | Happy path + key error states |
| Accessibility | WCAG 2.1 AA | Per PRD requirements |

### 3.2 Test Categories by Story

| Story | Unit | Integration | E2E | A11y |
|-------|------|-------------|-----|------|
| S1-001 Monorepo | ❌ | ❌ | ❌ | ❌ |
| S1-002 Backend | ✅ | ✅ | ❌ | ❌ |
| S1-003 Database | ✅ | ✅ | ❌ | ❌ |
| S1-004 Frontend | ✅ | ❌ | ❌ | ❌ |
| S1-005 React Query | ✅ | ❌ | ❌ | ✅ |
| S1-006 Root Scripts | ❌ | ❌ | ❌ | ❌ |
| S1-007 API Endpoints | ✅ | ✅ | ✅ | ❌ |
| S1-008 Zod Validation | ✅ | ✅ | ❌ | ❌ |
| S1-009 TaskInput | ✅ | ❌ | ✅ | ✅ |

---

## 4. Story Test Specifications

### 4.1 S1-001: Initialize Monorepo Structure

**Test Type:** Manual Validation (Infrastructure)

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-001-01 | Run `npm install` from root | No errors, node_modules created in root | ⬜ |
| S1-001-02 | Verify workspace structure | `frontend/`, `backend/`, `shared/` exist | ⬜ |
| S1-001-03 | Check package.json workspaces | Workspaces array includes all directories | ⬜ |
| S1-001-04 | Verify .gitignore | Excludes node_modules, dist, .env, *.db | ⬜ |

---

### 4.2 S1-002: Configure Backend with Express & TypeScript

**Test Type:** Integration

#### Health Check Endpoint Tests

```typescript
// backend/src/__tests__/health.test.ts

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual({ status: 'ok' });
  });

  it('returns JSON content type', async () => {
    const response = await request(app).get('/api/health');
    
    expect(response.headers['content-type']).toMatch(/application\/json/);
  });
});
```

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-002-01 | GET /api/health returns 200 | `{ "status": "ok" }` | ⬜ |
| S1-002-02 | Server starts on port 3000 | No port conflicts, server running | ⬜ |
| S1-002-03 | TypeScript compilation | No tsc errors | ⬜ |
| S1-002-04 | Hot reload works | Changes reflect without restart | ⬜ |

---

### 4.3 S1-003: Configure SQLite Database with Drizzle ORM

**Test Type:** Unit + Integration

#### Database Schema Tests

```typescript
// backend/src/__tests__/db/schema.test.ts

describe('Database Schema', () => {
  it('creates todos table with correct columns', async () => {
    const tableInfo = db.prepare("PRAGMA table_info(todos)").all();
    
    const columns = tableInfo.map((col: any) => col.name);
    expect(columns).toContain('id');
    expect(columns).toContain('text');
    expect(columns).toContain('completed');
    expect(columns).toContain('created_at');
  });

  it('id column is TEXT PRIMARY KEY', async () => {
    const tableInfo = db.prepare("PRAGMA table_info(todos)").all();
    const idCol = tableInfo.find((col: any) => col.name === 'id');
    
    expect(idCol.type).toBe('TEXT');
    expect(idCol.pk).toBe(1);
  });

  it('completed defaults to 0 (false)', async () => {
    const tableInfo = db.prepare("PRAGMA table_info(todos)").all();
    const completedCol = tableInfo.find((col: any) => col.name === 'completed');
    
    expect(completedCol.dflt_value).toBe('0');
  });
});
```

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-003-01 | Migration creates todos table | Table exists with correct schema | ⬜ |
| S1-003-02 | todos table has id (TEXT, PK) | Column exists and is primary key | ⬜ |
| S1-003-03 | todos table has text (TEXT, NOT NULL) | Column exists and is required | ⬜ |
| S1-003-04 | todos table has completed (INTEGER, default 0) | Column defaults to false | ⬜ |
| S1-003-05 | todos table has created_at (TEXT, NOT NULL) | Column exists and is required | ⬜ |
| S1-003-06 | Drizzle Studio opens | `npm run db:studio` launches UI | ⬜ |

---

### 4.4 S1-004: Configure Frontend with React, Vite & TypeScript

**Test Type:** Unit + Manual

#### Component Rendering Test

```typescript
// frontend/src/__tests__/App.test.tsx

import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import App from '../App';

describe('App Component', () => {
  it('renders without crashing', () => {
    render(<App />);
    expect(document.body).toBeTruthy();
  });
});
```

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-004-01 | Vite dev server starts | Runs on port 5173 | ⬜ |
| S1-004-02 | App component renders | No console errors | ⬜ |
| S1-004-03 | HMR works | Component updates on file save | ⬜ |
| S1-004-04 | API proxy works | `/api/*` routes to localhost:3000 | ⬜ |
| S1-004-05 | CSS Modules load | Scoped styles apply correctly | ⬜ |

---

### 4.5 S1-005: Configure React Query & Global Styles

**Test Type:** Unit + Visual

#### React Query Provider Test

```typescript
// frontend/src/__tests__/providers.test.tsx

import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import App from '../App';

describe('Providers', () => {
  it('QueryClientProvider wraps the app', () => {
    const queryClient = new QueryClient();
    
    render(
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    );
    
    expect(screen.getByRole('main')).toBeInTheDocument();
  });
});
```

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-005-01 | QueryClientProvider wraps App | No React errors | ⬜ |
| S1-005-02 | CSS variables defined | Colors, spacing, typography available | ⬜ |
| S1-005-03 | Mobile layout (< 600px) | Full width with 16px padding | ⬜ |
| S1-005-04 | Desktop layout (≥ 600px) | 600px max-width, centered | ⬜ |
| S1-005-05 | CSS reset applied | Consistent cross-browser baseline | ⬜ |

---

### 4.6 S1-006: Configure Root Scripts & Shared Types

**Test Type:** Manual Validation

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-006-01 | `npm run dev` | Starts frontend and backend concurrently | ⬜ |
| S1-006-02 | `npm run build` | Builds both workspaces without errors | ⬜ |
| S1-006-03 | `npm run start` | Runs production server | ⬜ |
| S1-006-04 | Shared types importable | `Todo`, `CreateTodoRequest`, `UpdateTodoRequest` available | ⬜ |
| S1-006-05 | `.env.example` exists | Documents required env vars | ⬜ |

---

### 4.7 S1-007: Implement Todo API Endpoints (GET & POST)

**Test Type:** Integration + E2E

#### API Integration Tests

```typescript
// backend/src/__tests__/routes/todos.test.ts

import request from 'supertest';
import { describe, it, expect, beforeEach } from 'vitest';
import { app } from '../../app';
import { db } from '../../db';
import { todos } from '../../db/schema';

describe('Todo API', () => {
  beforeEach(async () => {
    // Clear database before each test
    await db.delete(todos);
  });

  describe('GET /api/todos', () => {
    it('returns 200 with empty array when no todos', async () => {
      const response = await request(app).get('/api/todos');
      
      expect(response.status).toBe(200);
      expect(response.body).toEqual([]);
    });

    it('returns todos sorted by createdAt descending', async () => {
      // Create two todos
      await request(app)
        .post('/api/todos')
        .send({ text: 'First todo' });
      
      await request(app)
        .post('/api/todos')
        .send({ text: 'Second todo' });

      const response = await request(app).get('/api/todos');
      
      expect(response.status).toBe(200);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].text).toBe('Second todo');
      expect(response.body[1].text).toBe('First todo');
    });
  });

  describe('POST /api/todos', () => {
    it('returns 201 with created todo', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Buy milk' });
      
      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Buy milk');
      expect(response.body.id).toBeDefined();
      expect(response.body.createdAt).toBeDefined();
      expect(response.body.completed).toBe(false);
    });

    it('returns 400 for empty text', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '' });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('returns 400 for text > 500 chars', async () => {
      const longText = 'a'.repeat(501);
      const response = await request(app)
        .post('/api/todos')
        .send({ text: longText });
      
      expect(response.status).toBe(400);
      expect(response.body.error).toBeDefined();
    });

    it('returns 400 for whitespace-only text', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '   ' });
      
      expect(response.status).toBe(400);
    });

    it('trims whitespace from text', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: '  Buy milk  ' });
      
      expect(response.status).toBe(201);
      expect(response.body.text).toBe('Buy milk');
    });

    it('generates UUID for id', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Test todo' });
      
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(response.body.id).toMatch(uuidRegex);
    });

    it('generates ISO timestamp for createdAt', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Test todo' });
      
      const isoRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
      expect(response.body.createdAt).toMatch(isoRegex);
    });

    it('persists todo in database', async () => {
      const response = await request(app)
        .post('/api/todos')
        .send({ text: 'Persisted todo' });
      
      const getResponse = await request(app).get('/api/todos');
      
      expect(getResponse.body).toHaveLength(1);
      expect(getResponse.body[0].id).toBe(response.body.id);
    });
  });
});
```

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-007-01 | GET /api/todos returns 200 with array | Empty array when no todos | ⬜ |
| S1-007-02 | GET /api/todos sorts by createdAt DESC | Newest first | ⬜ |
| S1-007-03 | POST /api/todos returns 201 | Created todo with id, createdAt | ⬜ |
| S1-007-04 | POST generates UUID for id | Valid UUID v4 format | ⬜ |
| S1-007-05 | POST generates ISO timestamp | Valid ISO 8601 format | ⬜ |
| S1-007-06 | POST with empty text returns 400 | Error details in response | ⬜ |
| S1-007-07 | POST with > 500 chars returns 400 | Error details in response | ⬜ |
| S1-007-08 | POST trims whitespace | Stored text is trimmed | ⬜ |
| S1-007-09 | Todo is persisted | Appears in GET after POST | ⬜ |

---

### 4.8 S1-008: Implement Zod Validation Schemas

**Test Type:** Unit

#### Zod Schema Tests

```typescript
// shared/schemas/__tests__/todo.test.ts

import { describe, it, expect } from 'vitest';
import { createTodoSchema } from '../todo';

describe('createTodoSchema', () => {
  it('accepts valid text', () => {
    const result = createTodoSchema.safeParse({ text: 'Buy milk' });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).toBe('Buy milk');
    }
  });

  it('trims whitespace', () => {
    const result = createTodoSchema.safeParse({ text: '  Buy milk  ' });
    
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.text).toBe('Buy milk');
    }
  });

  it('rejects empty string', () => {
    const result = createTodoSchema.safeParse({ text: '' });
    
    expect(result.success).toBe(false);
  });

  it('rejects whitespace-only string', () => {
    const result = createTodoSchema.safeParse({ text: '   ' });
    
    expect(result.success).toBe(false);
  });

  it('rejects text > 500 chars', () => {
    const longText = 'a'.repeat(501);
    const result = createTodoSchema.safeParse({ text: longText });
    
    expect(result.success).toBe(false);
  });

  it('accepts 500 char text', () => {
    const maxText = 'a'.repeat(500);
    const result = createTodoSchema.safeParse({ text: maxText });
    
    expect(result.success).toBe(true);
  });

  it('rejects missing text field', () => {
    const result = createTodoSchema.safeParse({});
    
    expect(result.success).toBe(false);
  });
});
```

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-008-01 | Valid text accepted | Parse succeeds | ⬜ |
| S1-008-02 | Whitespace trimmed | "  Buy milk  " → "Buy milk" | ⬜ |
| S1-008-03 | Empty string rejected | Validation error | ⬜ |
| S1-008-04 | Whitespace-only rejected | Validation error | ⬜ |
| S1-008-05 | > 500 chars rejected | Validation error | ⬜ |
| S1-008-06 | 500 chars accepted | At boundary, succeeds | ⬜ |
| S1-008-07 | Missing text rejected | Validation error | ⬜ |
| S1-008-08 | Error format structured | `{ error: { code, message, details } }` | ⬜ |

---

### 4.9 S1-009: Implement TaskInput Component

**Test Type:** Unit + E2E + Accessibility

#### Component Unit Tests

```typescript
// frontend/src/components/TaskInput/__tests__/TaskInput.test.tsx

import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import { TaskInput } from '../TaskInput';

describe('TaskInput Component', () => {
  it('renders input field', () => {
    render(<TaskInput onSubmit={vi.fn()} />);
    
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('auto-focuses input on mount', () => {
    render(<TaskInput onSubmit={vi.fn()} />);
    
    expect(screen.getByRole('textbox')).toHaveFocus();
  });

  it('calls onSubmit with text when Enter pressed', async () => {
    const onSubmit = vi.fn();
    render(<TaskInput onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Buy milk{Enter}');
    
    expect(onSubmit).toHaveBeenCalledWith('Buy milk');
  });

  it('calls onSubmit when Add button clicked', async () => {
    const onSubmit = vi.fn();
    render(<TaskInput onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Buy milk');
    
    const button = screen.getByRole('button', { name: /add/i });
    await userEvent.click(button);
    
    expect(onSubmit).toHaveBeenCalledWith('Buy milk');
  });

  it('clears input after successful submission', async () => {
    const onSubmit = vi.fn().mockResolvedValue(undefined);
    render(<TaskInput onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, 'Buy milk{Enter}');
    
    await waitFor(() => {
      expect(input).toHaveValue('');
    });
  });

  it('does not submit empty text', async () => {
    const onSubmit = vi.fn();
    render(<TaskInput onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '{Enter}');
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('does not submit whitespace-only text', async () => {
    const onSubmit = vi.fn();
    render(<TaskInput onSubmit={onSubmit} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '   {Enter}');
    
    expect(onSubmit).not.toHaveBeenCalled();
  });

  it('shows visual feedback for invalid input', async () => {
    render(<TaskInput onSubmit={vi.fn()} />);
    
    const input = screen.getByRole('textbox');
    await userEvent.type(input, '   {Enter}');
    
    // Check for error styling or message
    expect(input).toHaveAttribute('aria-invalid', 'true');
  });
});
```

#### Accessibility Tests

```typescript
// frontend/src/components/TaskInput/__tests__/TaskInput.a11y.test.tsx

import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';
import { describe, it, expect } from 'vitest';
import { TaskInput } from '../TaskInput';

expect.extend(toHaveNoViolations);

describe('TaskInput Accessibility', () => {
  it('has no accessibility violations', async () => {
    const { container } = render(<TaskInput onSubmit={vi.fn()} />);
    
    const results = await axe(container);
    expect(results).toHaveNoViolations();
  });

  it('has accessible label for screen readers', () => {
    render(<TaskInput onSubmit={vi.fn()} />);
    
    const input = screen.getByLabelText(/add.*task/i);
    expect(input).toBeInTheDocument();
  });

  it('has visible focus ring', () => {
    render(<TaskInput onSubmit={vi.fn()} />);
    
    const input = screen.getByRole('textbox');
    input.focus();
    
    // Check computed styles for outline
    const styles = window.getComputedStyle(input);
    expect(styles.outlineWidth).not.toBe('0px');
  });
});
```

#### E2E Tests

```typescript
// e2e/task-input.spec.ts

import { test, expect } from '@playwright/test';

test.describe('TaskInput', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('adds a new task', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    
    await input.fill('Buy groceries');
    await input.press('Enter');
    
    await expect(page.getByText('Buy groceries')).toBeVisible();
  });

  test('input is auto-focused on page load', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    
    await expect(input).toBeFocused();
  });

  test('input clears after adding task', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    
    await input.fill('Buy groceries');
    await input.press('Enter');
    
    await expect(input).toHaveValue('');
  });

  test('rejects empty submission', async ({ page }) => {
    const input = page.getByRole('textbox', { name: /add.*task/i });
    
    await input.press('Enter');
    
    // Should show error or remain empty
    await expect(page.getByRole('listitem')).toHaveCount(0);
  });
});
```

| Test ID | Description | Expected Result | Status |
|---------|-------------|-----------------|--------|
| S1-009-01 | Input renders at top of page | TaskInput visible | ⬜ |
| S1-009-02 | Input auto-focused on load | Input has focus | ⬜ |
| S1-009-03 | Enter submits task | Task added to list | ⬜ |
| S1-009-04 | Add button submits task | Task added to list | ⬜ |
| S1-009-05 | Input clears after submission | Input value is empty | ⬜ |
| S1-009-06 | Empty text rejected | No submission, visual feedback | ⬜ |
| S1-009-07 | Whitespace-only rejected | No submission, visual feedback | ⬜ |
| S1-009-08 | Minimum 48px height | Input meets size requirement | ⬜ |
| S1-009-09 | Focus ring visible (2px) | Outline on focus | ⬜ |
| S1-009-10 | Touch target 44x44px min | Button meets size | ⬜ |
| S1-009-11 | Accessible label present | aria-label or label element | ⬜ |
| S1-009-12 | No a11y violations (axe) | Zero violations | ⬜ |

---

## 5. E2E Test Scenarios

### 5.1 Critical Path: Add a Task

```typescript
// e2e/critical-paths/add-task.spec.ts

import { test, expect } from '@playwright/test';

test.describe('Critical Path: Add a Task', () => {
  test('user can add a task and see it in the list', async ({ page }) => {
    // Given: User visits the app
    await page.goto('/');
    
    // When: User types a task and presses Enter
    const input = page.getByRole('textbox', { name: /add.*task/i });
    await input.fill('Complete Sprint 1 test plan');
    await input.press('Enter');
    
    // Then: Task appears in the list
    await expect(page.getByText('Complete Sprint 1 test plan')).toBeVisible();
    
    // And: Input is cleared and focused
    await expect(input).toHaveValue('');
    await expect(input).toBeFocused();
  });

  test('user can add multiple tasks', async ({ page }) => {
    await page.goto('/');
    
    const input = page.getByRole('textbox', { name: /add.*task/i });
    
    await input.fill('First task');
    await input.press('Enter');
    
    await input.fill('Second task');
    await input.press('Enter');
    
    await input.fill('Third task');
    await input.press('Enter');
    
    // Verify all tasks are visible
    await expect(page.getByText('First task')).toBeVisible();
    await expect(page.getByText('Second task')).toBeVisible();
    await expect(page.getByText('Third task')).toBeVisible();
  });

  test('tasks persist after page refresh', async ({ page }) => {
    await page.goto('/');
    
    const input = page.getByRole('textbox', { name: /add.*task/i });
    await input.fill('Persistent task');
    await input.press('Enter');
    
    await expect(page.getByText('Persistent task')).toBeVisible();
    
    // Refresh the page
    await page.reload();
    
    // Task should still be visible
    await expect(page.getByText('Persistent task')).toBeVisible();
  });
});
```

---

## 6. Accessibility Testing

### 6.1 Automated Checks

| Check | Tool | Standard | Status |
|-------|------|----------|--------|
| Color contrast | axe-core | WCAG 2.1 AA | ⬜ |
| Heading hierarchy | axe-core | WCAG 2.1 AA | ⬜ |
| Form labels | axe-core | WCAG 2.1 AA | ⬜ |
| Focus visible | axe-core | WCAG 2.1 AA | ⬜ |
| Touch targets | Manual | 44x44px minimum | ⬜ |

### 6.2 Manual Accessibility Checks

| Check | Requirement | Status |
|-------|-------------|--------|
| Keyboard navigation | Tab through all interactive elements | ⬜ |
| Focus order | Logical tab sequence | ⬜ |
| Screen reader | Input announced with label | ⬜ |
| Reduced motion | Respects prefers-reduced-motion | ⬜ |

### 6.3 Accessibility Test Script

```typescript
// e2e/accessibility.spec.ts

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Accessibility', () => {
  test('homepage has no accessibility violations', async ({ page }) => {
    await page.goto('/');
    
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa'])
      .analyze();
    
    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('keyboard navigation works', async ({ page }) => {
    await page.goto('/');
    
    // Tab to input (should already be focused)
    const input = page.getByRole('textbox');
    await expect(input).toBeFocused();
    
    // Tab to Add button
    await page.keyboard.press('Tab');
    const button = page.getByRole('button', { name: /add/i });
    await expect(button).toBeFocused();
  });
});
```

---

## 7. Test Data

### 7.1 Valid Test Data

| Field | Value | Notes |
|-------|-------|-------|
| text | "Buy groceries" | Typical task |
| text | "A" | Minimum length (1 char) |
| text | "a".repeat(500) | Maximum length |
| text | "Task with émojis 🎉" | Unicode support |
| text | "Task with <script>alert('xss')</script>" | XSS attempt (should be escaped) |

### 7.2 Invalid Test Data

| Field | Value | Expected Error |
|-------|-------|----------------|
| text | "" | "Todo text is required" |
| text | "   " | "Todo text is required" (after trim) |
| text | "a".repeat(501) | "Todo text must be 500 characters or less" |
| (missing) | undefined | "Required" |

---

## 8. Test Execution Plan

### 8.1 Test Commands

```bash
# Run all tests
npm run test

# Run unit tests only
npm run test:unit

# Run integration tests
npm run test:integration

# Run E2E tests
npm run test:e2e

# Run with coverage
npm run test:coverage

# Run accessibility tests
npm run test:a11y
```

### 8.2 CI Pipeline Integration

```yaml
# .github/workflows/test.yml
name: Test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run unit tests
        run: npm run test:unit
      
      - name: Run integration tests
        run: npm run test:integration
      
      - name: Install Playwright browsers
        run: npx playwright install --with-deps
      
      - name: Run E2E tests
        run: npm run test:e2e
      
      - name: Upload coverage
        uses: codecov/codecov-action@v4
```

### 8.3 Execution Schedule

| Phase | Stories | Tests | Timing |
|-------|---------|-------|--------|
| Foundation | S1-001 to S1-006 | Manual + Unit | Days 1-5 |
| API | S1-007, S1-008 | Integration | Days 6-8 |
| UI | S1-009 | Unit + E2E + A11y | Days 9-10 |

---

## 9. Test Infrastructure Setup

### 9.1 Required Dependencies

```json
// Root package.json devDependencies
{
  "vitest": "^1.x",
  "@testing-library/react": "^14.x",
  "@testing-library/user-event": "^14.x",
  "@testing-library/jest-dom": "^6.x",
  "supertest": "^6.x",
  "@types/supertest": "^6.x",
  "@playwright/test": "^1.x",
  "@axe-core/playwright": "^4.x",
  "jest-axe": "^8.x"
}
```

### 9.2 Test Configuration Files

#### Vitest Config (Root)

```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
      exclude: ['node_modules', 'dist', '**/*.test.ts'],
    },
  },
});
```

#### Playwright Config

```typescript
// playwright.config.ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  reporter: 'html',
  use: {
    baseURL: 'http://localhost:5173',
    trace: 'on-first-retry',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
    { name: 'Mobile Chrome', use: { ...devices['Pixel 5'] } },
    { name: 'Mobile Safari', use: { ...devices['iPhone 12'] } },
  ],
  webServer: {
    command: 'npm run dev',
    url: 'http://localhost:5173',
    reuseExistingServer: !process.env.CI,
  },
});
```

---

## 10. Risk Assessment & Mitigation

### 10.1 Testing Risks

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Flaky E2E tests | Medium | Medium | Use proper wait strategies, avoid timing-based assertions |
| Database state leakage | High | Low | Isolate test databases, clear before each test |
| Missing accessibility issues | High | Medium | Combine automated + manual testing |
| Test coverage gaps | Medium | Low | Review coverage reports, require coverage thresholds |

### 10.2 Contingency Plans

| Scenario | Action |
|----------|--------|
| E2E tests unreliable | Focus on integration tests, run E2E on schedule |
| Time constraints | Prioritize critical path tests (API + TaskInput) |
| Accessibility failures | Document as bugs, fix in immediate follow-up |

---

## 11. Definition of Done (Testing)

Each story is considered **test-complete** when:

- [ ] All unit tests pass
- [ ] All integration tests pass (if applicable)
- [ ] E2E critical path tests pass (if applicable)
- [ ] No accessibility violations (automated scan)
- [ ] Coverage targets met (80%+ for unit tests)
- [ ] Tests run in CI pipeline

---

## 12. Appendix

### 12.1 Test Naming Conventions

```
<ComponentName>.<method>.<scenario>.test.ts

Examples:
- TaskInput.submit.withValidText.test.ts
- TodosApi.post.withEmptyText.test.ts
```

### 12.2 Test File Organization

```
backend/
└── src/
    └── __tests__/
        ├── routes/
        │   └── todos.test.ts
        ├── db/
        │   └── schema.test.ts
        └── setup.ts

frontend/
└── src/
    ├── components/
    │   └── TaskInput/
    │       └── __tests__/
    │           ├── TaskInput.test.tsx
    │           └── TaskInput.a11y.test.tsx
    └── test/
        └── setup.ts

e2e/
├── critical-paths/
│   └── add-task.spec.ts
├── accessibility.spec.ts
└── fixtures/
    └── test-data.ts
```

### 12.3 Useful Commands Cheatsheet

| Command | Purpose |
|---------|---------|
| `npm run test` | Run all tests |
| `npm run test:watch` | Run tests in watch mode |
| `npm run test:coverage` | Run with coverage report |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run test:e2e -- --ui` | Run E2E with Playwright UI |
| `npm run test:e2e -- --debug` | Debug E2E tests |
| `npx playwright codegen` | Generate E2E test code |

---

**Document Status:** ✅ Complete  
**Next Steps:** Implement test infrastructure alongside story development

