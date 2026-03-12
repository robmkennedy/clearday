/**
 * Test data factories for backend tests
 *
 * These factories generate unique, valid test data to prevent collisions
 * in parallel test runs and reduce magic strings.
 */

/**
 * Local type matching shared/types
 * Defined locally to avoid rootDir constraint (TS6059)
 */
interface Todo {
  id: string;
  text: string;
  completed: boolean;
  createdAt: string;
}

// Counter for unique data generation
let todoCounter = 0;

/**
 * Input type for creating a todo (matches POST body)
 */
export interface CreateTodoInput {
  text: string;
}

/**
 * Input type for updating a todo (matches PATCH body)
 */
export interface UpdateTodoInput {
  text?: string;
  completed?: boolean;
}

/**
 * Generate a unique todo creation input
 *
 * @param overrides - Optional overrides for the generated data
 * @returns CreateTodoInput with unique text
 *
 * @example
 * const todo = createTodoInput(); // { text: 'Test task 1' }
 * const todo = createTodoInput({ text: 'Buy milk' }); // { text: 'Buy milk' }
 */
export function createTodoInput(overrides: Partial<CreateTodoInput> = {}): CreateTodoInput {
  todoCounter++;
  return {
    text: `Test task ${todoCounter}`,
    ...overrides,
  };
}

/**
 * Generate a unique todo update input
 *
 * @param overrides - Fields to update
 * @returns UpdateTodoInput
 *
 * @example
 * const update = createUpdateInput({ completed: true });
 * const update = createUpdateInput({ text: 'Updated task' });
 */
export function createUpdateInput(overrides: UpdateTodoInput = {}): UpdateTodoInput {
  return { ...overrides };
}

/**
 * Generate a complete mock todo object (for mocking DB responses)
 *
 * @param overrides - Optional overrides for the generated data
 * @returns Complete Todo object
 *
 * @example
 * const todo = createMockTodo(); // Full todo with generated ID, text, timestamps
 * const todo = createMockTodo({ completed: true }); // Completed todo
 */
export function createMockTodo(overrides: Partial<Todo> = {}): Todo {
  todoCounter++;
  const now = new Date().toISOString();
  return {
    id: `00000000-0000-4000-8000-${String(todoCounter).padStart(12, '0')}`,
    text: `Test task ${todoCounter}`,
    completed: false,
    createdAt: now,
    ...overrides,
  };
}

/**
 * Generate multiple unique todo inputs
 *
 * @param count - Number of todos to generate
 * @param overrides - Optional overrides applied to all todos
 * @returns Array of CreateTodoInput
 *
 * @example
 * const todos = createTodoInputs(3); // 3 unique todos
 */
export function createTodoInputs(
  count: number,
  overrides: Partial<CreateTodoInput> = {}
): CreateTodoInput[] {
  return Array.from({ length: count }, () => createTodoInput(overrides));
}

/**
 * Generate edge case test data
 */
export const edgeCases = {
  /** Minimum valid text (1 character) */
  minLength: { text: 'A' },
  /** Maximum valid text (500 characters) */
  maxLength: { text: 'a'.repeat(500) },
  /** Text with leading/trailing whitespace (should be trimmed) */
  whitespace: { text: '  Trimmed task  ' },
  /** Unicode text with emojis */
  unicode: { text: 'Célébrer 🎉 la fête' },
  /** Text with special characters */
  specialChars: { text: "Task with special chars !@#$%^&*()" },
};

/**
 * Generate invalid test data for validation testing
 */
export const invalidCases = {
  /** Empty text */
  empty: { text: '' },
  /** Whitespace only */
  whitespaceOnly: { text: '   ' },
  /** Over max length (501 characters) */
  tooLong: { text: 'a'.repeat(501) },
  /** Missing text field */
  missingText: {},
};

/**
 * Reset the counter (useful in beforeEach)
 */
export function resetFactoryCounter(): void {
  todoCounter = 0;
}

