import { useState, useRef, useEffect, useCallback } from 'react';
import { useTodos, useToggleTodo, useDeleteTodo, useToast, useAnnouncer } from '../../hooks';
import type { OptimisticTodo } from '../../hooks';
import { TaskItem } from '../TaskItem';
import { LoadingState } from '../LoadingState';
import { ErrorState } from '../ErrorState';
import { EmptyState } from '../EmptyState';
import styles from './TodoList.module.css';

/** Animation duration for delete in ms */
const DELETE_ANIMATION_MS = 200;

/**
 * Sort todos by createdAt descending (newest first)
 */
function sortByNewest(todos: OptimisticTodo[]): OptimisticTodo[] {
  return [...todos].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

/**
 * TodoList component
 *
 * Displays todos in two sections: "To Do" and "Done".
 * Each section sorted by createdAt descending (newest first).
 * Done section is collapsible.
 */
export function TodoList() {
  const [isDoneCollapsed, setIsDoneCollapsed] = useState(false);
  const [deletingIds, setDeletingIds] = useState<Set<string>>(new Set());
  const deleteTimersRef = useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());
  const listContainerRef = useRef<HTMLDivElement>(null);
  const { data: todos, isLoading, isError, refetch } = useTodos();
  const { addToast } = useToast();
  const { message: announcement, announce } = useAnnouncer();

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      deleteTimersRef.current.forEach((timer) => clearTimeout(timer));
      deleteTimersRef.current.clear();
    };
  }, []);

  const toggleMutation = useToggleTodo({
    onError: (error) => {
      addToast(error.message || 'Failed to update task', 'error');
    },
  });

  const deleteMutation = useDeleteTodo({
    onError: (error) => {
      addToast(error.message || 'Failed to delete task', 'error');
    },
  });

  /**
   * A11Y-05: Move focus to next sibling task checkbox, previous sibling,
   * or the task input if no tasks remain after deletion.
   */
  const moveFocusAfterDelete = useCallback((deletedId: string) => {
    const container = listContainerRef.current;
    if (!container) return;

    // Collect all visible checkboxes except the one being deleted
    const checkboxes = Array.from(
      container.querySelectorAll<HTMLInputElement>('input[type="checkbox"]')
    ).filter((cb) => !cb.closest(`[data-testid="task-item-${deletedId}"]`));

    if (checkboxes.length > 0) {
      checkboxes[0].focus();
    } else {
      // No tasks left — focus the task input
      document.getElementById('task-input')?.focus();
    }
  }, []);

  if (isLoading) {
    return <LoadingState />;
  }

  if (isError) {
    return <ErrorState message="Error loading todos" onRetry={() => refetch()} />;
  }

  if (!todos || todos.length === 0) {
    return <EmptyState variant="empty" />;
  }

  // Cast to OptimisticTodo and split into sections
  const typedTodos = todos as OptimisticTodo[];
  const incompleteTodos = sortByNewest(typedTodos.filter((t) => !t.completed));
  const completedTodos = sortByNewest(typedTodos.filter((t) => t.completed));

  const handleToggle = (id: string) => {
    const todo = typedTodos.find((t) => t.id === id);
    if (todo) {
      toggleMutation.mutate({ id, completed: !todo.completed });
      // A11Y-03: Announce toggle for screen readers
      const action = todo.completed ? 'marked incomplete' : 'completed';
      announce(`Task ${action}: ${todo.text}`);
    }
  };

  const handleDelete = (id: string) => {
    // A11Y-03: Announce deletion for screen readers
    const todo = typedTodos.find((t) => t.id === id);
    if (todo) {
      announce(`Task deleted: ${todo.text}`);
    }

    // Start delete animation
    setDeletingIds((prev) => new Set(prev).add(id));

    // Wait for animation then actually delete
    const timer = setTimeout(() => {
      deleteTimersRef.current.delete(id);
      deleteMutation.mutate(id);
      setDeletingIds((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
      // A11Y-05: Move focus after item is removed
      moveFocusAfterDelete(id);
    }, DELETE_ANIMATION_MS);

    deleteTimersRef.current.set(id, timer);
  };

  const toggleDoneCollapse = () => {
    setIsDoneCollapsed((prev) => !prev);
  };

  return (
    <div className={styles.todoSections} ref={listContainerRef}>
      {/* A11Y-03: Screen reader announcements for CRUD actions */}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {announcement}
      </div>

      {/* To Do Section */}
      <section className={styles.section} aria-labelledby="todo-heading">
        <h2 id="todo-heading" className={styles.sectionHeading}>
          To Do ({incompleteTodos.length})
        </h2>
        {incompleteTodos.length === 0 ? (
          <p className={styles.sectionEmpty}>No tasks to do</p>
        ) : (
          <ul className={styles.todoList}>
            {incompleteTodos.map((todo) => (
              <TaskItem
                key={todo.id}
                todo={todo}
                onToggle={handleToggle}
                onDelete={handleDelete}
                isDeleting={deletingIds.has(todo.id)}
              />
            ))}
          </ul>
        )}
      </section>

      {/* Done Section */}
      <section className={styles.section} aria-labelledby="done-heading">
        <div className={styles.sectionHeader}>
          <h2 id="done-heading" className={styles.sectionHeading}>
            Done ({completedTodos.length})
          </h2>
          <button
            type="button"
            className={styles.collapseButton}
            onClick={toggleDoneCollapse}
            aria-expanded={!isDoneCollapsed}
            aria-controls="done-list"
            aria-label={isDoneCollapsed ? 'Expand completed tasks' : 'Collapse completed tasks'}
          >
            <span className={styles.collapseIcon}>
              {isDoneCollapsed ? '▶' : '▼'}
            </span>
          </button>
        </div>
        {!isDoneCollapsed && (
          <div id="done-list">
            {completedTodos.length === 0 ? (
              <p className={styles.sectionEmpty}>No completed tasks</p>
            ) : (
              <ul className={styles.todoList}>
                {completedTodos.map((todo) => (
                  <TaskItem
                    key={todo.id}
                    todo={todo}
                    onToggle={handleToggle}
                    onDelete={handleDelete}
                    isDeleting={deletingIds.has(todo.id)}
                  />
                ))}
              </ul>
            )}
          </div>
        )}
      </section>
    </div>
  );
}

