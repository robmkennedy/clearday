import { useTheme } from '../../hooks';
import styles from './ThemeToggle.module.css';

/**
 * Theme toggle switch component.
 *
 * Renders an accessible toggle switch with sun/moon icons
 * that switches between light and dark themes.
 *
 * @example
 * ```tsx
 * <ThemeToggle />
 * ```
 */
export function ThemeToggle() {
  const { toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isDark}
      onClick={toggleTheme}
      className={`${styles.toggle} ${isDark ? styles.dark : ''}`}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      data-testid="theme-toggle"
    >
      <span className={styles.track}>
        <span className={styles.iconLeft} aria-hidden="true">☀️</span>
        <span className={styles.iconRight} aria-hidden="true">🌙</span>
        <span className={styles.knob} />
      </span>
    </button>
  );
}

