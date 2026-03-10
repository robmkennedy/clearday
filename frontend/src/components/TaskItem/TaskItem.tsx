import type { OptimisticTodo } from '../../hooks';
import styles from './TaskItem.module.css';

/**
 * Props for TaskItem component
 */
export interface TaskItemProps {
  /** Todo data to display */
  todo: OptimisticTodo;
  /** Callback when checkbox is toggled */
  onToggle?: (id: string) => void;
  /** Callback when delete button is clicked */
  onDelete?: (id: string) => void;
  /** Whether interactions are disabled (e.g., during mutation) */
  disabled?: boolean;
  /** Whether the item is being deleted (for exit animation) */
  isDeleting?: boolean;
}

/**
 * TaskItem component
 *
 * Displays a single todo item with checkbox, text, and delete button.
 * Supports completed state, pending state, and keyboard navigation.
 */
export function TaskItem({ todo, onToggle, onDelete, disabled = false, isDeleting = false }: TaskItemProps) {
  const isPending = todo.isPending ?? false;
  const isDisabled = disabled || isPending || isDeleting;

  const handleChange = () => {
    if (!isDisabled && onToggle) {
      onToggle(todo.id);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Allow Enter and Space to toggle (in addition to native checkbox behavior)
    if ((e.key === 'Enter' || e.key === ' ') && !isDisabled && onToggle) {
      e.preventDefault();
      onToggle(todo.id);
    }
  };

  const handleDelete = () => {
    if (!isDisabled && onDelete) {
      onDelete(todo.id);
    }
  };

  const classNames = [
    styles.taskItem,
    todo.completed ? styles.completed : '',
    isPending ? styles.pending : '',
    isDeleting ? styles.deleting : '',
  ].filter(Boolean).join(' ');

  return (
    <li className={classNames} data-testid={`task-item-${todo.id}`}>
      <input
        type="checkbox"
        className={styles.checkbox}
        checked={todo.completed}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        disabled={isDisabled}
        aria-label={`Mark "${todo.text}" as ${todo.completed ? 'incomplete' : 'complete'}`}
        data-testid={`task-checkbox-${todo.id}`}
      />
      <span className={styles.text}>{todo.text}</span>
      {isPending && <span className={styles.pendingIndicator}>Saving...</span>}
      {onDelete && (
        <button
          type="button"
          className={styles.deleteButton}
          onClick={handleDelete}
          disabled={isDisabled}
          aria-label={`Delete "${todo.text}"`}
          data-testid={`task-delete-${todo.id}`}
        >
          ×
        </button>
      )}
    </li>
  );
}

