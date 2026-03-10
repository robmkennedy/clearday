import { useTheme } from '../../hooks';
import styles from './ThemeToggle.module.css';

/**
 * Theme toggle button component.
 *
 * Displays a sun/moon icon and toggles between light and dark themes.
 * Accessible with keyboard navigation and proper ARIA labels.
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
      onClick={toggleTheme}
      className={styles.toggle}
      aria-label={`Switch to ${isDark ? 'light' : 'dark'} mode`}
      data-testid="theme-toggle"
    >
      <span className={styles.icon} aria-hidden="true">
        {isDark ? '🌙' : '☀️'}
      </span>
    </button>
  );
}

