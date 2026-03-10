import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TodoList } from '../TodoList';
import {
  createAppWrapper,
  mockFetchSuccess,
  mockFetchError,
  mockFetchPending,
  mockFetchWithHandlers
} from '../../../test/test-utils';
import type { Todo } from '@shared/types';

/**
 * TodoList component tests
 */

// Store original fetch
const originalFetch = global.fetch;

// Test data - unsorted to verify sorting
const mockTodos: Todo[] = [
  {
    id: '1',
    text: 'Older task',
    completed: false,
    createdAt: '2026-03-01T10:00:00.000Z',
  },
  {
    id: '2',
    text: 'Newest task',
    completed: false,
    createdAt: '2026-03-05T10:00:00.000Z',
  },
  {
    id: '3',
    text: 'Middle task',
    completed: true,
    createdAt: '2026-03-03T10:00:00.000Z',
  },
];

beforeEach(() => {
  vi.resetAllMocks();
});

afterEach(() => {
  global.fetch = originalFetch;
  vi.useRealTimers();
});

describe('TodoList', () => {
  it('shows loading state initially', () => {
    vi.useFakeTimers();
    global.fetch = mockFetchPending();

    render(<TodoList />, { wrapper: createAppWrapper() });

    // LoadingState has 200ms delay before showing
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByText('Loading tasks')).toBeInTheDocument();
  });

  it('shows error state when fetch fails', async () => {
    global.fetch = mockFetchError(500);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Error loading todos')).toBeInTheDocument();
    });

    // Verify error state has alert role for accessibility
    expect(screen.getByRole('alert')).toBeInTheDocument();
  });

  it('shows retry button in error state that triggers refetch', async () => {
    const user = userEvent.setup();
    let fetchCount = 0;

    global.fetch = vi.fn().mockImplementation(() => {
      fetchCount++;
      if (fetchCount === 1) {
        return Promise.resolve({ ok: false, status: 500 });
      }
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockTodos),
      });
    });

    render(<TodoList />, { wrapper: createAppWrapper() });

    // Wait for error state
    await waitFor(() => {
      expect(screen.getByText('Error loading todos')).toBeInTheDocument();
    });

    // Click retry button
    const retryButton = screen.getByRole('button', { name: /try again/i });
    expect(retryButton).toBeInTheDocument();
    await act(async () => {
      await user.click(retryButton);
    });

    // Should show todos after successful retry
    await waitFor(() => {
      expect(screen.getByText('Newest task')).toBeInTheDocument();
    });

    expect(fetchCount).toBe(2);
  });

  it('shows loading state with status role for accessibility', () => {
    vi.useFakeTimers();
    global.fetch = mockFetchPending();

    render(<TodoList />, { wrapper: createAppWrapper() });

    // LoadingState has 200ms delay before showing
    act(() => {
      vi.advanceTimersByTime(200);
    });

    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('shows empty state when no todos exist', async () => {
    global.fetch = mockFetchSuccess([]);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      expect(screen.getByText('No tasks yet — add one above!')).toBeInTheDocument();
    });
  });

  it('displays todos in a list', async () => {
    global.fetch = mockFetchSuccess(mockTodos);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Older task')).toBeInTheDocument();
      expect(screen.getByText('Newest task')).toBeInTheDocument();
      expect(screen.getByText('Middle task')).toBeInTheDocument();
    });
  });

  it('sorts todos by createdAt descending within each section', async () => {
    // Add another incomplete task for testing sort order
    const todosWithMultipleIncomplete = [
      ...mockTodos,
      {
        id: '4',
        text: 'New incomplete',
        completed: false,
        createdAt: '2026-03-04T10:00:00.000Z',
      },
    ];

    global.fetch = mockFetchSuccess(todosWithMultipleIncomplete);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Newest task')).toBeInTheDocument();
    });

    // Check order within To Do section (incomplete tasks)
    const todoSection = screen.getByRole('region', { name: /to do/i });
    const todoItems = todoSection.querySelectorAll('li');

    // Newest task (Mar 5), New incomplete (Mar 4), Older task (Mar 1)
    expect(todoItems[0]).toHaveTextContent('Newest task');
    expect(todoItems[1]).toHaveTextContent('New incomplete');
    expect(todoItems[2]).toHaveTextContent('Older task');
  });

  it('renders todos in separate sections', async () => {
    global.fetch = mockFetchSuccess(mockTodos);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      // Two sections should exist
      expect(screen.getByRole('region', { name: /to do/i })).toBeInTheDocument();
      expect(screen.getByRole('region', { name: /done/i })).toBeInTheDocument();

      // All todos should be present as list items
      const listItems = screen.getAllByRole('listitem');
      expect(listItems).toHaveLength(3);
    });
  });

  it('calls PATCH API when checkbox is clicked', async () => {
    const user = userEvent.setup();

    global.fetch = mockFetchWithHandlers({
      PATCH: () => Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ ...mockTodos[0], completed: true }),
      }),
    }, mockTodos);

    render(<TodoList />, { wrapper: createAppWrapper() });

    // Wait for todos to load
    await waitFor(() => {
      expect(screen.getByText('Older task')).toBeInTheDocument();
    });

    // Click the checkbox for 'Older task' using data-testid
    // Click the checkbox for 'Older task' using data-testid
    const olderTaskCheckbox = screen.getByTestId('task-checkbox-1');

    await act(async () => {
      await user.click(olderTaskCheckbox);
    });

    // Verify PATCH was called with correct body
    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/todos/1',
        expect.objectContaining({
          method: 'PATCH',
          body: JSON.stringify({ completed: true }),
        })
      );
    });
  });

  it('shows error toast when toggle fails', async () => {
    const user = userEvent.setup();

    global.fetch = mockFetchWithHandlers({
      PATCH: () => Promise.resolve({ ok: false, status: 500 }),
    }, mockTodos);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Older task')).toBeInTheDocument();
    });

    const olderTaskCheckbox = screen.getByTestId('task-checkbox-1');

    await act(async () => {
      await user.click(olderTaskCheckbox);
    });

    // Error toast should appear with error message
    await waitFor(() => {
      expect(screen.getByText(/failed to update/i)).toBeInTheDocument();
    });
  });

  it('calls DELETE API when delete button is clicked', async () => {
    const user = userEvent.setup();

    global.fetch = mockFetchWithHandlers({
      DELETE: () => Promise.resolve({ ok: true }),
    }, mockTodos);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Older task')).toBeInTheDocument();
    });

    // Click the delete button for 'Older task' using data-testid
    const olderTaskDeleteButton = screen.getByTestId('task-delete-1');

    await act(async () => {
      await user.click(olderTaskDeleteButton);
    });

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith(
        '/api/todos/1',
        expect.objectContaining({ method: 'DELETE' })
      );
    });
  });

  it('shows error toast when delete fails', async () => {
    const user = userEvent.setup();

    global.fetch = mockFetchWithHandlers({
      DELETE: () => Promise.resolve({ ok: false, status: 500 }),
    }, mockTodos);

    render(<TodoList />, { wrapper: createAppWrapper() });

    await waitFor(() => {
      expect(screen.getByText('Older task')).toBeInTheDocument();
    });

    const olderTaskDeleteButton = screen.getByTestId('task-delete-1');

    await act(async () => {
      await user.click(olderTaskDeleteButton);
    });

    await waitFor(() => {
      expect(screen.getByText(/failed to delete/i)).toBeInTheDocument();
    });
  });

  describe('two-section layout', () => {
    it('shows incomplete tasks in To Do section', async () => {
      global.fetch = mockFetchSuccess(mockTodos);

      render(<TodoList />, { wrapper: createAppWrapper() });

      await waitFor(() => {
        const todoSection = screen.getByRole('region', { name: /to do/i });
        expect(todoSection).toHaveTextContent('Older task');
        expect(todoSection).toHaveTextContent('Newest task');
      });
    });

    it('shows completed tasks in Done section', async () => {
      global.fetch = mockFetchSuccess(mockTodos);

      render(<TodoList />, { wrapper: createAppWrapper() });

      await waitFor(() => {
        const doneSection = screen.getByRole('region', { name: /done/i });
        expect(doneSection).toHaveTextContent('Middle task');
      });
    });

    it('shows section headings with counts', async () => {
      global.fetch = mockFetchSuccess(mockTodos);

      render(<TodoList />, { wrapper: createAppWrapper() });

      await waitFor(() => {
        expect(screen.getByText('To Do (2)')).toBeInTheDocument();
        expect(screen.getByText('Done (1)')).toBeInTheDocument();
      });
    });

    it('shows empty message when To Do section is empty', async () => {
      const completedOnly = [mockTodos[2]]; // Only completed task

      global.fetch = mockFetchSuccess(completedOnly);

      render(<TodoList />, { wrapper: createAppWrapper() });

      await waitFor(() => {
        expect(screen.getByText('No tasks to do')).toBeInTheDocument();
      });
    });

    it('shows empty message when Done section is empty', async () => {
      const incompleteOnly = mockTodos.filter((t) => !t.completed);

      global.fetch = mockFetchSuccess(incompleteOnly);

      render(<TodoList />, { wrapper: createAppWrapper() });

      await waitFor(() => {
        expect(screen.getByText('No completed tasks')).toBeInTheDocument();
      });
    });

    it('Done section can be collapsed', async () => {
      const user = userEvent.setup();

      global.fetch = mockFetchSuccess(mockTodos);

      render(<TodoList />, { wrapper: createAppWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Middle task')).toBeInTheDocument();
      });

      // Find and click collapse toggle
      const toggleButton = screen.getByRole('button', { name: /collapse completed/i });
      expect(toggleButton).toHaveAttribute('aria-expanded', 'true');

      await act(async () => {
        await user.click(toggleButton);
      });

      // Done section content should be hidden
      await waitFor(() => {
        expect(toggleButton).toHaveAttribute('aria-expanded', 'false');
        expect(screen.queryByText('Middle task')).not.toBeInTheDocument();
      });
    });

    it('Done section can be expanded after collapse', async () => {
      const user = userEvent.setup();

      global.fetch = mockFetchSuccess(mockTodos);

      render(<TodoList />, { wrapper: createAppWrapper() });

      await waitFor(() => {
        expect(screen.getByText('Middle task')).toBeInTheDocument();
      });

      const toggleButton = screen.getByRole('button', { name: /collapse completed/i });

      // Collapse
      await act(async () => {
        await user.click(toggleButton);
      });

      await waitFor(() => {
        expect(screen.queryByText('Middle task')).not.toBeInTheDocument();
      });

      // Expand
      await act(async () => {
        await user.click(screen.getByRole('button', { name: /expand completed/i }));
      });

      await waitFor(() => {
        expect(screen.getByText('Middle task')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: /collapse completed/i })).toHaveAttribute('aria-expanded', 'true');
      });
    });
  });
});

