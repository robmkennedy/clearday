import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, act } from '@testing-library/react';
import { LoadingState } from '../LoadingState';

/**
 * LoadingState Component Tests
 *
 * Story: S3-001
 * Priority tags: @p0 (critical), @p1 (high), @p2 (medium)
 */
describe('S3-001: LoadingState', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  describe('delay threshold', () => {
    it('does not show spinner immediately with default 200ms delay @p0', () => {
      render(<LoadingState />);

      // Spinner should not be visible yet
      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('shows spinner after 200ms delay @p0', async () => {
      render(<LoadingState />);

      // Advance past the delay threshold
      act(() => {
        vi.advanceTimersByTime(200);
      });

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('does not show spinner if delay has not passed @p1', () => {
      render(<LoadingState />);

      // Advance 199ms - just before threshold
      act(() => {
        vi.advanceTimersByTime(199);
      });

      expect(screen.queryByRole('status')).not.toBeInTheDocument();
    });

    it('shows spinner immediately when delayMs is 0 @p1', () => {
      render(<LoadingState delayMs={0} />);

      // Should be visible immediately, no timer needed
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('respects custom delay value @p1', () => {
      render(<LoadingState delayMs={500} />);

      act(() => {
        vi.advanceTimersByTime(499);
      });
      expect(screen.queryByRole('status')).not.toBeInTheDocument();

      act(() => {
        vi.advanceTimersByTime(1);
      });
      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('cleans up timer on unmount @p1', () => {
      const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
      const { unmount } = render(<LoadingState />);

      unmount();

      expect(clearTimeoutSpy).toHaveBeenCalled();
      clearTimeoutSpy.mockRestore();
    });
  });

  describe('accessibility', () => {
    it('has role="status" for screen readers @p0', () => {
      render(<LoadingState delayMs={0} />);

      expect(screen.getByRole('status')).toBeInTheDocument();
    });

    it('has aria-live="polite" for non-intrusive announcements @p0', () => {
      render(<LoadingState delayMs={0} />);

      expect(screen.getByRole('status')).toHaveAttribute('aria-live', 'polite');
    });

    it('has default aria-label "Loading tasks" @p0', () => {
      render(<LoadingState delayMs={0} />);

      expect(screen.getByLabelText('Loading tasks')).toBeInTheDocument();
    });

    it('accepts custom label prop @p2', () => {
      render(<LoadingState delayMs={0} label="Loading your data" />);

      expect(screen.getByLabelText('Loading your data')).toBeInTheDocument();
      expect(screen.getByText('Loading your data')).toBeInTheDocument();
    });
  });

  describe('rendering', () => {
    it('displays label text @p0', () => {
      render(<LoadingState delayMs={0} />);

      expect(screen.getByText('Loading tasks')).toBeInTheDocument();
    });

    it('displays custom label text @p2', () => {
      render(<LoadingState delayMs={0} label="Please wait..." />);

      expect(screen.getByText('Please wait...')).toBeInTheDocument();
    });
  });

  describe('reusability', () => {
    it('can be used with different labels for different contexts @p2', () => {
      const { rerender } = render(<LoadingState delayMs={0} label="Loading tasks" />);
      expect(screen.getByText('Loading tasks')).toBeInTheDocument();

      rerender(<LoadingState delayMs={0} label="Saving changes" />);
      expect(screen.getByText('Saving changes')).toBeInTheDocument();
    });
  });
});


