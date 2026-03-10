import styles from './ErrorState.module.css';

/**
 * Props for ErrorState component
 */
export interface ErrorStateProps {
  /** Custom error message (default: "Something went wrong") */
  message?: string;
  /** Callback when retry button is clicked */
  onRetry?: () => void;
  /** Custom retry button text (default: "Try Again") */
  retryLabel?: string;
}

/**
 * ErrorState component
 *
 * Displays an error message with optional retry button.
 * Uses aria-live="polite" for accessible screen reader announcements.
 */
export function ErrorState({
  message = 'Something went wrong',
  onRetry,
  retryLabel = 'Try Again'
}: ErrorStateProps) {
  return (
    <div
      className={styles.container}
      role="alert"
      aria-live="polite"
    >
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button
          type="button"
          className={styles.retryButton}
          onClick={onRetry}
        >
          {retryLabel}
        </button>
      )}
    </div>
  );
}

