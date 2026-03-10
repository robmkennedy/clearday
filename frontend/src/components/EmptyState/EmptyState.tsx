import styles from './EmptyState.module.css';

/**
 * Variant types for EmptyState display
 */
export type EmptyStateVariant = 'empty' | 'allComplete';

/**
 * Props for EmptyState component
 */
export interface EmptyStateProps {
  /** Variant determines which message to show */
  variant?: EmptyStateVariant;
  /** Custom message (overrides variant default) */
  message?: string;
}

/**
 * Default messages for each variant
 */
const defaultMessages: Record<EmptyStateVariant, string> = {
  empty: 'No tasks yet — add one above!',
  allComplete: 'All done! 🎉',
};

/**
 * EmptyState component
 *
 * Displays a friendly message when no tasks exist or all tasks are complete.
 * Styling is calm and minimal per JTBD JS9 (Calm Interface).
 */
export function EmptyState({
  variant = 'empty',
  message
}: EmptyStateProps) {
  const displayMessage = message ?? defaultMessages[variant];

  return (
    <div className={styles.container}>
      <p className={styles.message}>{displayMessage}</p>
    </div>
  );
}

