import type { Todo } from '@shared/types';

const STORAGE_KEY = 'clearday-todos';

/**
 * Check if we're running in static/GitHub Pages mode (no backend available).
 * Caches the result after first check to avoid repeated network requests.
 */
let staticMode: boolean | null = null;

export async function isStaticMode(): Promise<boolean> {
  if (staticMode !== null) return staticMode;

  try {
    const response = await fetch('/api/todos', { method: 'HEAD', signal: AbortSignal.timeout(2000) });
    staticMode = !response.ok;
  } catch {
    staticMode = true;
  }
  return staticMode;
}

/**
 * Reset the cached static mode flag. Used in tests to prevent state leaking between test cases.
 */
export function resetStaticMode(): void {
  staticMode = null;
}

/**
 * Force a specific static mode value. Used in tests.
 */
export function setStaticMode(value: boolean): void {
  staticMode = value;
}

// ── localStorage helpers ──────────────────────────────────────────────

function loadTodos(): Todo[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveTodos(todos: Todo[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(todos));
}

// ── Local CRUD operations ─────────────────────────────────────────────

function localFetchTodos(): Todo[] {
  return loadTodos();
}

function localCreateTodo(text: string): Todo {
  const todos = loadTodos();
  const todo: Todo = {
    id: crypto.randomUUID(),
    text: text.trim(),
    completed: false,
    createdAt: new Date().toISOString(),
  };
  saveTodos([todo, ...todos]);
  return todo;
}

function localToggleTodo(id: string, completed: boolean): Todo {
  const todos = loadTodos();
  const index = todos.findIndex((t) => t.id === id);
  if (index === -1) throw new Error('Todo not found');
  todos[index] = { ...todos[index], completed };
  saveTodos(todos);
  return todos[index];
}

function localDeleteTodo(id: string): void {
  const todos = loadTodos();
  saveTodos(todos.filter((t) => t.id !== id));
}

// ── Public API (auto-detects backend vs localStorage) ─────────────────

export async function apiFetchTodos(): Promise<Todo[]> {
  if (await isStaticMode()) {
    return localFetchTodos();
  }
  const response = await fetch('/api/todos');
  if (!response.ok) throw new Error('Failed to fetch todos');
  return response.json();
}

export async function apiCreateTodo(text: string): Promise<Todo> {
  if (await isStaticMode()) {
    return localCreateTodo(text);
  }
  const response = await fetch('/api/todos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text }),
  });
  if (!response.ok) throw new Error('Failed to create todo');
  return response.json();
}

export async function apiToggleTodo(id: string, completed: boolean): Promise<Todo> {
  if (await isStaticMode()) {
    return localToggleTodo(id, completed);
  }
  const response = await fetch(`/api/todos/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ completed }),
  });
  if (!response.ok) throw new Error('Failed to update todo');
  return response.json();
}

export async function apiDeleteTodo(id: string): Promise<void> {
  if (await isStaticMode()) {
    return localDeleteTodo(id);
  }
  const response = await fetch(`/api/todos/${id}`, {
    method: 'DELETE',
  });
  if (!response.ok) throw new Error('Failed to delete todo');
}


