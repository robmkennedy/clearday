import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useTheme } from '../useTheme';
import {
  createLocalStorageMock,
  createMatchMediaMock,
} from '../../test/theme-test-utils';

/**
 * useTheme hook tests
 *
 * Tests cover:
 * - Initial state detection (localStorage, system preference, default)
 * - Theme application to DOM
 * - localStorage persistence
 * - Toggle functionality
 * - System preference change listener
 */

describe('useTheme', () => {
  const originalLocalStorage = global.localStorage;
  const originalMatchMedia = global.matchMedia;
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();

    // Set up localStorage mock
    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    // Set up default matchMedia (system prefers light)
    Object.defineProperty(global, 'matchMedia', {
      value: createMatchMediaMock(false),
      writable: true,
    });

    // Reset document theme
    document.documentElement.dataset.theme = '';
  });

  afterEach(() => {
    // Restore originals
    Object.defineProperty(global, 'localStorage', {
      value: originalLocalStorage,
      writable: true,
    });
    Object.defineProperty(global, 'matchMedia', {
      value: originalMatchMedia,
      writable: true,
    });
    vi.clearAllMocks();
  });

  describe('initial state detection', () => {
    it('S4-001-AC1: returns light theme when no localStorage and system prefers light', () => {
      Object.defineProperty(global, 'matchMedia', {
        value: createMatchMediaMock(false),
        writable: true,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('S4-001-AC2: returns dark theme when no localStorage and system prefers dark', () => {
      Object.defineProperty(global, 'matchMedia', {
        value: createMatchMediaMock(true),
        writable: true,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('S4-001-AC3: returns saved light theme from localStorage (ignores system preference)', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });
      Object.defineProperty(global, 'matchMedia', {
        value: createMatchMediaMock(true), // System prefers dark
        writable: true,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('S4-001-AC3: returns saved dark theme from localStorage (ignores system preference)', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'dark' });
      Object.defineProperty(global, 'matchMedia', {
        value: createMatchMediaMock(false), // System prefers light
        writable: true,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('ignores invalid localStorage value and uses system preference', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'invalid-value' });
      Object.defineProperty(global, 'matchMedia', {
        value: createMatchMediaMock(true),
        writable: true,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');
    });
  });

  describe('theme application', () => {
    it('S4-001-AC5: sets data-theme attribute on document root on mount', () => {
      const { result } = renderHook(() => useTheme());

      expect(document.documentElement.dataset.theme).toBe(result.current.theme);
    });

    it('S4-001-AC5: updates data-theme attribute when theme changes', () => {
      const { result } = renderHook(() => useTheme());

      expect(document.documentElement.dataset.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });

      expect(document.documentElement.dataset.theme).toBe('dark');
    });
  });

  describe('localStorage persistence', () => {
    it('does NOT save theme to localStorage on mount (only on toggle)', () => {
      renderHook(() => useTheme());

      // Should NOT call setItem on initial render (preserves system preference listener)
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });

    it('S4-001-AC4: saves theme to localStorage when toggled', () => {
      const { result } = renderHook(() => useTheme());

      act(() => {
        result.current.toggleTheme();
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('bmad-todo-theme', 'dark');
    });
  });

  describe('toggleTheme', () => {
    it('S4-001-AC4: toggles from light to dark', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('dark');
      expect(result.current.isDark).toBe(true);
    });

    it('toggles from dark to light', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'dark' });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.theme).toBe('light');
      expect(result.current.isDark).toBe(false);
    });

    it('toggles multiple times correctly', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('light');

      act(() => {
        result.current.toggleTheme();
      });
      expect(result.current.theme).toBe('dark');
    });

    it('toggleTheme function is stable (same reference)', () => {
      const { result, rerender } = renderHook(() => useTheme());

      const firstToggle = result.current.toggleTheme;
      rerender();
      const secondToggle = result.current.toggleTheme;

      expect(firstToggle).toBe(secondToggle);
    });
  });

  describe('system preference change listener', () => {
    it('S4-001-AC7: registers change listener on mount', () => {
      let addEventListenerSpy: ReturnType<typeof vi.fn> | undefined;

      Object.defineProperty(global, 'matchMedia', {
        value: vi.fn().mockImplementation((query: string) => {
          addEventListenerSpy = vi.fn();
          return {
            matches: query.includes('dark') ? false : true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: addEventListenerSpy,
            removeEventListener: vi.fn(),
            dispatchEvent: vi.fn(),
          };
        }),
        writable: true,
      });

      renderHook(() => useTheme());

      expect(addEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('removes change listener on unmount', () => {
      let removeEventListenerSpy: ReturnType<typeof vi.fn> | undefined;

      Object.defineProperty(global, 'matchMedia', {
        value: vi.fn().mockImplementation((query: string) => {
          removeEventListenerSpy = vi.fn();
          return {
            matches: query.includes('dark') ? false : true,
            media: query,
            onchange: null,
            addListener: vi.fn(),
            removeListener: vi.fn(),
            addEventListener: vi.fn(),
            removeEventListener: removeEventListenerSpy,
            dispatchEvent: vi.fn(),
          };
        }),
        writable: true,
      });

      const { unmount } = renderHook(() => useTheme());
      unmount();

      expect(removeEventListenerSpy).toHaveBeenCalledWith('change', expect.any(Function));
    });

    it('ignores system preference change when user has explicit preference', () => {
      // User explicitly set to light
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });

      const mockMatchMedia = createMatchMediaMock(false);
      Object.defineProperty(global, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      const { result } = renderHook(() => useTheme());

      expect(result.current.theme).toBe('light');

      // Simulate system preference change to dark
      const mediaQueryResult = mockMatchMedia('(prefers-color-scheme: dark)');
      act(() => {
        mediaQueryResult._triggerChange(true);
      });

      // Theme should NOT change because user has explicit preference
      expect(result.current.theme).toBe('light');
    });

    it('responds to system preference change when NO user preference saved', () => {
      // NO localStorage preference - fresh user
      localStorageMock._setStore({});

      const mockMatchMedia = createMatchMediaMock(false);
      Object.defineProperty(global, 'matchMedia', {
        value: mockMatchMedia,
        writable: true,
      });

      const { result } = renderHook(() => useTheme());

      // Initial theme from system (light)
      expect(result.current.theme).toBe('light');

      // Simulate system preference change to dark
      const mediaQueryResult = mockMatchMedia('(prefers-color-scheme: dark)');
      act(() => {
        mediaQueryResult._triggerChange(true);
      });

      // Theme SHOULD change because no user preference saved
      expect(result.current.theme).toBe('dark');
    });
  });

  describe('return value shape', () => {
    it('S4-001-AC6: returns object with theme, toggleTheme, and isDark', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current).toHaveProperty('theme');
      expect(result.current).toHaveProperty('toggleTheme');
      expect(result.current).toHaveProperty('isDark');
    });

    it('theme is of type Theme (light or dark)', () => {
      const { result } = renderHook(() => useTheme());

      expect(['light', 'dark']).toContain(result.current.theme);
    });

    it('toggleTheme is a function', () => {
      const { result } = renderHook(() => useTheme());

      expect(typeof result.current.toggleTheme).toBe('function');
    });

    it('isDark is a boolean', () => {
      const { result } = renderHook(() => useTheme());

      expect(typeof result.current.isDark).toBe('boolean');
    });

    it('isDark accurately reflects theme state', () => {
      const { result } = renderHook(() => useTheme());

      expect(result.current.isDark).toBe(result.current.theme === 'dark');

      act(() => {
        result.current.toggleTheme();
      });

      expect(result.current.isDark).toBe(result.current.theme === 'dark');
    });
  });
});


