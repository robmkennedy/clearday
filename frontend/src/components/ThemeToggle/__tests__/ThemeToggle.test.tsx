import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ThemeToggle } from '../ThemeToggle';
import {
  createLocalStorageMock,
  createMatchMediaMock,
} from '../../../test/theme-test-utils';

/**
 * ThemeToggle component tests
 *
 * Tests cover:
 * - Toggle switch renders with role="switch"
 * - Both sun and moon icons are always displayed
 * - Click toggles theme
 * - ARIA labels and aria-checked
 * - Keyboard accessibility
 */

describe('ThemeToggle', () => {
  const originalLocalStorage = global.localStorage;
  const originalMatchMedia = global.matchMedia;
  let localStorageMock: ReturnType<typeof createLocalStorageMock>;

  beforeEach(() => {
    localStorageMock = createLocalStorageMock();

    Object.defineProperty(global, 'localStorage', {
      value: localStorageMock,
      writable: true,
    });

    Object.defineProperty(global, 'matchMedia', {
      value: createMatchMediaMock(false),
      writable: true,
    });

    // Reset document theme
    document.documentElement.dataset.theme = '';
  });

  afterEach(() => {
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

  describe('icon display', () => {
    it('S4-002-AC1: displays both sun and moon icons', () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });

      render(<ThemeToggle />);

      expect(screen.getByText('☀️')).toBeInTheDocument();
      expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('both icons are hidden from screen readers (aria-hidden)', () => {
      render(<ThemeToggle />);

      expect(screen.getByText('☀️')).toHaveAttribute('aria-hidden', 'true');
      expect(screen.getByText('🌙')).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('toggle functionality', () => {
    it('S4-002-AC3: switches from light to dark on click', async () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('aria-checked', 'false');

      await act(async () => {
        await user.click(toggle);
      });

      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('S4-002-AC3: switches from dark to light on click', async () => {
      localStorageMock._setStore({ 'clearday-theme': 'dark' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('aria-checked', 'true');

      await act(async () => {
        await user.click(toggle);
      });

      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('updates localStorage when toggled', async () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      await act(async () => {
        await user.click(screen.getByTestId('theme-toggle'));
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('clearday-theme', 'dark');
    });
  });

  describe('accessibility', () => {
    it('has role="switch"', () => {
      render(<ThemeToggle />);

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('role', 'switch');
    });

    it('S4-002-AC5: has aria-label "Switch to dark mode" when in light mode', () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });

      render(<ThemeToggle />);

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('S4-002-AC5: has aria-label "Switch to light mode" when in dark mode', () => {
      localStorageMock._setStore({ 'clearday-theme': 'dark' });

      render(<ThemeToggle />);

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('aria-checked is false in light mode', () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });

      render(<ThemeToggle />);

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('aria-checked', 'false');
    });

    it('aria-checked is true in dark mode', () => {
      localStorageMock._setStore({ 'clearday-theme': 'dark' });

      render(<ThemeToggle />);

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('is a button element', () => {
      render(<ThemeToggle />);

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle.tagName).toBe('BUTTON');
    });

    it('has type="button" to prevent form submission', () => {
      render(<ThemeToggle />);

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('type', 'button');
    });
  });

  describe('keyboard accessibility', () => {
    it('S4-002-AC8: can be activated with Enter key', async () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const toggle = screen.getByTestId('theme-toggle');
      toggle.focus();

      await act(async () => {
        await user.keyboard('{Enter}');
      });

      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('S4-002-AC8: can be activated with Space key', async () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const toggle = screen.getByTestId('theme-toggle');
      toggle.focus();

      await act(async () => {
        await user.keyboard(' ');
      });

      expect(toggle).toHaveAttribute('aria-checked', 'true');
    });

    it('is focusable via Tab', async () => {
      await act(async () => {
        render(<ThemeToggle />);
      });

      const toggle = screen.getByTestId('theme-toggle');

      // Tab into the button
      await userEvent.tab();

      expect(toggle).toHaveFocus();
    });
  });

  describe('aria-label updates', () => {
    it('updates aria-label after toggle', async () => {
      localStorageMock._setStore({ 'clearday-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const toggle = screen.getByTestId('theme-toggle');
      expect(toggle).toHaveAttribute('aria-label', 'Switch to dark mode');

      await act(async () => {
        await user.click(toggle);
      });

      expect(toggle).toHaveAttribute('aria-label', 'Switch to light mode');
    });
  });
});

