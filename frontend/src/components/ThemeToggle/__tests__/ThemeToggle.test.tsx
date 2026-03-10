import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
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
 * - Icon display per theme
 * - Click toggles theme
 * - ARIA labels
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
    it('S4-002-AC1: displays sun icon (☀️) when in light mode', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });

      render(<ThemeToggle />);

      expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    it('S4-002-AC2: displays moon icon (🌙) when in dark mode', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'dark' });

      render(<ThemeToggle />);

      expect(screen.getByText('🌙')).toBeInTheDocument();
    });
  });

  describe('toggle functionality', () => {
    it('S4-002-AC3: switches from light to dark on click', async () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const button = screen.getByTestId('theme-toggle');
      expect(screen.getByText('☀️')).toBeInTheDocument();

      await act(async () => {
        await user.click(button);
      });

      expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('S4-002-AC3: switches from dark to light on click', async () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'dark' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const button = screen.getByTestId('theme-toggle');
      expect(screen.getByText('🌙')).toBeInTheDocument();

      await act(async () => {
        await user.click(button);
      });

      expect(screen.getByText('☀️')).toBeInTheDocument();
    });

    it('updates localStorage when toggled', async () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      await act(async () => {
        await user.click(screen.getByTestId('theme-toggle'));
      });

      expect(localStorageMock.setItem).toHaveBeenCalledWith('bmad-todo-theme', 'dark');
    });
  });

  describe('accessibility', () => {
    it('S4-002-AC5: has aria-label "Switch to dark mode" when in light mode', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');
    });

    it('S4-002-AC5: has aria-label "Switch to light mode" when in dark mode', () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'dark' });

      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });

    it('is a button element', () => {
      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle');
      expect(button.tagName).toBe('BUTTON');
    });

    it('has type="button" to prevent form submission', () => {
      render(<ThemeToggle />);

      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('type', 'button');
    });

    it('icon is hidden from screen readers (aria-hidden)', () => {
      render(<ThemeToggle />);

      const icon = screen.getByText('☀️');
      expect(icon).toHaveAttribute('aria-hidden', 'true');
    });
  });

  describe('keyboard accessibility', () => {
    it('S4-002-AC8: can be activated with Enter key', async () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const button = screen.getByTestId('theme-toggle');
      button.focus();

      await act(async () => {
        await user.keyboard('{Enter}');
      });

      expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('S4-002-AC8: can be activated with Space key', async () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const button = screen.getByTestId('theme-toggle');
      button.focus();

      await act(async () => {
        await user.keyboard(' ');
      });

      expect(screen.getByText('🌙')).toBeInTheDocument();
    });

    it('is focusable via Tab', async () => {
      await act(async () => {
        render(<ThemeToggle />);
      });

      const button = screen.getByTestId('theme-toggle');

      // Tab into the button
      await userEvent.tab();

      expect(button).toHaveFocus();
    });
  });

  describe('aria-label updates', () => {
    it('updates aria-label after toggle', async () => {
      localStorageMock._setStore({ 'bmad-todo-theme': 'light' });
      const user = userEvent.setup();

      await act(async () => {
        render(<ThemeToggle />);
      });

      const button = screen.getByTestId('theme-toggle');
      expect(button).toHaveAttribute('aria-label', 'Switch to dark mode');

      await act(async () => {
        await user.click(button);
      });

      expect(button).toHaveAttribute('aria-label', 'Switch to light mode');
    });
  });
});

