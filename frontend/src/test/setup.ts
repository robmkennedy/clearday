import { afterEach, beforeEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import '@testing-library/jest-dom/vitest';
import { setStaticMode } from '../api/todoApi';

/**
 * Frontend test setup
 *
 * This file configures the test environment for React component tests.
 * It's automatically loaded by Vitest via setupFiles config.
 */

// Force API mode in tests (tests mock global.fetch to act as backend)
beforeEach(() => {
  setStaticMode(false);
});

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock window.matchMedia for responsive tests
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: (query: string) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: () => {},
    removeListener: () => {},
    addEventListener: () => {},
    removeEventListener: () => {},
    dispatchEvent: () => {},
  }),
});

