import { useState, useEffect, useCallback, useRef } from 'react';

/**
 * Theme type - light or dark
 */
export type Theme = 'light' | 'dark';

/**
 * localStorage key for theme persistence
 */
const STORAGE_KEY = 'clearday-theme';

/**
 * Check if code is running in browser environment
 */
const isBrowser = typeof window !== 'undefined';

/**
 * Get the initial theme based on priority:
 * 1. User preference saved in localStorage
 * 2. System preference via prefers-color-scheme
 * 3. Default to 'light'
 */
function getInitialTheme(): Theme {
  if (!isBrowser) {
    return 'light';
  }

  // 1. Check localStorage for saved preference
  const saved = localStorage.getItem(STORAGE_KEY);
  if (saved === 'light' || saved === 'dark') {
    return saved;
  }

  // 2. Check system preference
  if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    return 'dark';
  }

  // 3. Default to light
  return 'light';
}

/**
 * Apply theme to the document root element
 */
function applyTheme(theme: Theme): void {
  if (isBrowser) {
    document.documentElement.dataset.theme = theme;
  }
}

/**
 * Save theme preference to localStorage
 */
function saveTheme(theme: Theme): void {
  if (isBrowser) {
    localStorage.setItem(STORAGE_KEY, theme);
  }
}

/**
 * Check if user has explicitly saved a theme preference
 */
function hasUserPreference(): boolean {
  if (!isBrowser) {
    return false;
  }
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === 'light' || saved === 'dark';
}

/**
 * Hook return type
 */
export interface UseThemeReturn {
  /** Current theme ('light' or 'dark') */
  theme: Theme;
  /** Toggle between light and dark themes */
  toggleTheme: () => void;
  /** Convenience boolean - true when theme is 'dark' */
  isDark: boolean;
}

/**
 * Custom hook for managing theme state with system preference detection
 * and localStorage persistence.
 *
 * Features:
 * - Detects system preference via prefers-color-scheme media query
 * - Persists user preference to localStorage (only on explicit toggle)
 * - localStorage preference takes priority over system preference
 * - Listens for system preference changes (when no user preference set)
 * - Sets data-theme attribute on document root for CSS theming
 *
 * @returns Object with theme state, toggle function, and isDark boolean
 *
 * @example
 * ```tsx
 * function ThemeToggle() {
 *   const { theme, toggleTheme, isDark } = useTheme();
 *   return (
 *     <button onClick={toggleTheme}>
 *       {isDark ? '🌙' : '☀️'}
 *     </button>
 *   );
 * }
 * ```
 */
export function useTheme(): UseThemeReturn {
  // Initialize with lazy initializer to avoid SSR issues
  const [theme, setTheme] = useState<Theme>(getInitialTheme);

  // Track if user has explicitly toggled (to distinguish from initial load)
  const userHasToggled = useRef(false);

  // Apply theme to DOM when theme changes
  // Only save to localStorage if user explicitly toggled
  useEffect(() => {
    applyTheme(theme);
    if (userHasToggled.current) {
      saveTheme(theme);
    }
  }, [theme]);

  // Listen for system preference changes
  useEffect(() => {
    if (!isBrowser) {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleChange = (event: MediaQueryListEvent) => {
      // Only update if user hasn't explicitly set a preference
      if (!hasUserPreference()) {
        setTheme(event.matches ? 'dark' : 'light');
      }
    };

    mediaQuery.addEventListener('change', handleChange);

    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }, []);

  // Toggle between light and dark themes
  const toggleTheme = useCallback(() => {
    userHasToggled.current = true;
    setTheme((current) => (current === 'light' ? 'dark' : 'light'));
  }, []);

  // Derive isDark from theme
  const isDark = theme === 'dark';

  return { theme, toggleTheme, isDark };
}

