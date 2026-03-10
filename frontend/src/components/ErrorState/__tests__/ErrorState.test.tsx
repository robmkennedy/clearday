import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { ErrorState } from '../ErrorState';

/**
 * ErrorState Component Tests
 *
 * Story: S3-002
 * Priority tags: @p0 (critical), @p1 (high), @p2 (medium)
 */
describe('S3-002: ErrorState', () => {
  describe('rendering', () => {
    it('displays default error message @p0', () => {
      render(<ErrorState />);

      expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    });

    it('displays custom error message @p2', () => {
      render(<ErrorState message="Failed to load tasks" />);

      expect(screen.getByText('Failed to load tasks')).toBeInTheDocument();
    });

    it('does not show retry button when onRetry is not provided @p1', () => {
      render(<ErrorState />);

      expect(screen.queryByRole('button')).not.toBeInTheDocument();
    });

    it('shows retry button when onRetry is provided @p0', () => {
      render(<ErrorState onRetry={() => {}} />);

      expect(screen.getByRole('button', { name: 'Try Again' })).toBeInTheDocument();
    });

    it('displays custom retry button text @p2', () => {
      render(<ErrorState onRetry={() => {}} retryLabel="Reload" />);

      expect(screen.getByRole('button', { name: 'Reload' })).toBeInTheDocument();
    });
  });

  describe('interactions', () => {
    it('calls onRetry when retry button is clicked @p0', async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();
      render(<ErrorState onRetry={handleRetry} />);

      await user.click(screen.getByRole('button', { name: 'Try Again' }));

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });

    it('can be triggered multiple times @p1', async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();
      render(<ErrorState onRetry={handleRetry} />);

      const button = screen.getByRole('button', { name: 'Try Again' });
      await user.click(button);
      await user.click(button);

      expect(handleRetry).toHaveBeenCalledTimes(2);
    });
  });

  describe('accessibility', () => {
    it('has role="alert" for screen readers @p0', () => {
      render(<ErrorState />);

      expect(screen.getByRole('alert')).toBeInTheDocument();
    });

    it('has aria-live="polite" for non-intrusive announcements @p0', () => {
      render(<ErrorState />);

      expect(screen.getByRole('alert')).toHaveAttribute('aria-live', 'polite');
    });

    it('retry button is focusable @p1', () => {
      render(<ErrorState onRetry={() => {}} />);

      const button = screen.getByRole('button', { name: 'Try Again' });
      button.focus();

      expect(document.activeElement).toBe(button);
    });

    it('retry button can be activated with keyboard @p1', async () => {
      const user = userEvent.setup();
      const handleRetry = vi.fn();
      render(<ErrorState onRetry={handleRetry} />);

      const button = screen.getByRole('button', { name: 'Try Again' });
      button.focus();
      await user.keyboard('{Enter}');

      expect(handleRetry).toHaveBeenCalledTimes(1);
    });
  });

  describe('reusability', () => {
    it('can display different error scenarios @p2', () => {
      const { rerender } = render(<ErrorState message="Network error" />);
      expect(screen.getByText('Network error')).toBeInTheDocument();

      rerender(<ErrorState message="Server unavailable" />);
      expect(screen.getByText('Server unavailable')).toBeInTheDocument();
    });
  });
});

