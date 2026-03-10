import { useState, useEffect } from 'react';
import styles from './LoadingState.module.css';

/**
 * Props for LoadingState component
 */
export interface LoadingStateProps {
  /** Custom aria-label for screen readers (default: "Loading tasks") */
  label?: string;
  /** Delay in ms before showing spinner (default: 200) - prevents flash for fast loads */
  delayMs?: number;
}

/**
 * LoadingState component
 *
 * Displays a loading spinner with a delay threshold to prevent flash
 * for fast requests. Respects prefers-reduced-motion.
 */
export function LoadingState({
  label = 'Loading tasks',
  delayMs = 200
}: LoadingStateProps) {
  const [showSpinner, setShowSpinner] = useState(delayMs === 0);

  useEffect(() => {
    if (delayMs === 0) {
      setShowSpinner(true);
      return;
    }

    const timer = setTimeout(() => {
      setShowSpinner(true);
    }, delayMs);

    return () => clearTimeout(timer);
  }, [delayMs]);

  if (!showSpinner) {
    return null;
  }

  return (
    <div
      className={styles.container}
      role="status"
      aria-live="polite"
    >
      <div
        className={styles.spinner}
        aria-label={label}
      />
      <span className={styles.label}>{label}</span>
    </div>
  );
}

