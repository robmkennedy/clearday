import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, waitFor, act } from '@testing-library/react';
import { App } from '../App';

/**
 * App component tests
 *
 * These tests verify the root App component renders correctly.
 */

// Store original fetch
const originalFetch = global.fetch;

beforeEach(() => {
  // Mock fetch for API calls
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve([]),
  });
});

afterEach(() => {
  // Restore original fetch
  global.fetch = originalFetch;
});

describe('App Component', () => {
  it('renders without crashing', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(document.body).toBeTruthy();
  });

  it('renders main landmark', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('main')).toBeInTheDocument();
  });

  it('renders TaskInput component', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('textbox')).toBeInTheDocument();
  });

  it('renders header with app title', async () => {
    await act(async () => {
      render(<App />);
    });
    expect(screen.getByRole('heading', { name: /clearday/i })).toBeInTheDocument();
  });

  it('shows empty state message when no todos', async () => {
    await act(async () => {
      render(<App />);
    });

    await waitFor(() => {
      expect(screen.getByText(/no tasks yet/i)).toBeInTheDocument();
    });
  });
});

