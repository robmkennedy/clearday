import { vi } from 'vitest';

/**
 * Shared test utilities for theme-related tests
 */

/**
 * Create a mock localStorage with helper methods
 */
export function createLocalStorageMock() {
  let store: Record<string, string> = {};

  return {
    getItem: vi.fn((key: string) => store[key] ?? null),
    setItem: vi.fn((key: string, value: string) => {
      store[key] = value;
    }),
    removeItem: vi.fn((key: string) => {
      delete store[key];
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    get length() {
      return Object.keys(store).length;
    },
    key: vi.fn((index: number) => Object.keys(store)[index] ?? null),
    /** Helper: Set store contents directly for test setup */
    _setStore: (newStore: Record<string, string>) => {
      store = { ...newStore };
    },
    /** Helper: Reset all mocks and clear store */
    _reset: () => {
      store = {};
      vi.clearAllMocks();
    },
  };
}

/**
 * Create a mock matchMedia with system preference control
 * @param prefersDark - Whether the "system" prefers dark mode
 */
export function createMatchMediaMock(prefersDark: boolean) {
  const listeners: Array<(event: MediaQueryListEvent) => void> = [];

  const mockFn = vi.fn().mockImplementation((query: string) => ({
    matches: query.includes('dark') ? prefersDark : !prefersDark,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn((_event: string, callback: (event: MediaQueryListEvent) => void) => {
      listeners.push(callback);
    }),
    removeEventListener: vi.fn((_event: string, callback: (event: MediaQueryListEvent) => void) => {
      const index = listeners.indexOf(callback);
      if (index > -1) listeners.splice(index, 1);
    }),
    dispatchEvent: vi.fn(),
    /** Helper: Simulate system preference change */
    _triggerChange: (newMatches: boolean) => {
      listeners.forEach((listener) => {
        listener({ matches: newMatches } as MediaQueryListEvent);
      });
    },
    /** Helper: Get registered listeners count */
    _getListenerCount: () => listeners.length,
  }));

  return mockFn;
}

/**
 * Setup theme test environment with mocked localStorage and matchMedia
 */
export function setupThemeTestEnv(options: {
  savedTheme?: 'light' | 'dark' | null;
  systemPrefersDark?: boolean;
} = {}) {
  const { savedTheme = null, systemPrefersDark = false } = options;

  const localStorageMock = createLocalStorageMock();
  const matchMediaMock = createMatchMediaMock(systemPrefersDark);

  if (savedTheme) {
    localStorageMock._setStore({ 'clearday-theme': savedTheme });
  }

  Object.defineProperty(global, 'localStorage', {
    value: localStorageMock,
    writable: true,
  });

  Object.defineProperty(global, 'matchMedia', {
    value: matchMediaMock,
    writable: true,
  });

  // Reset document theme
  document.documentElement.dataset.theme = '';

  return { localStorageMock, matchMediaMock };
}

