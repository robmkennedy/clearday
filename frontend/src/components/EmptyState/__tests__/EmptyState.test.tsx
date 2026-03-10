import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { EmptyState } from '../EmptyState';

/**
 * EmptyState Component Tests
 *
 * Story: S3-003
 * Priority tags: @p0 (critical), @p1 (high), @p2 (medium)
 */
describe('S3-003: EmptyState', () => {
  describe('rendering', () => {
    it('displays default empty message @p0', () => {
      render(<EmptyState />);

      expect(screen.getByText('No tasks yet — add one above!')).toBeInTheDocument();
    });

    it('displays empty variant message by default @p0', () => {
      render(<EmptyState variant="empty" />);

      expect(screen.getByText('No tasks yet — add one above!')).toBeInTheDocument();
    });

    it('displays allComplete variant message @p0', () => {
      render(<EmptyState variant="allComplete" />);

      expect(screen.getByText('All done! 🎉')).toBeInTheDocument();
    });

    it('displays custom message when provided @p2', () => {
      render(<EmptyState message="Custom empty message" />);

      expect(screen.getByText('Custom empty message')).toBeInTheDocument();
    });

    it('custom message overrides variant default @p2', () => {
      render(<EmptyState variant="allComplete" message="Override message" />);

      expect(screen.getByText('Override message')).toBeInTheDocument();
      expect(screen.queryByText('All done! 🎉')).not.toBeInTheDocument();
    });
  });

  describe('variants', () => {
    it('supports empty variant for no tasks @p1', () => {
      render(<EmptyState variant="empty" />);

      expect(screen.getByText(/No tasks yet/)).toBeInTheDocument();
    });

    it('supports allComplete variant for all done @p1', () => {
      render(<EmptyState variant="allComplete" />);

      expect(screen.getByText(/All done!/)).toBeInTheDocument();
    });
  });

  describe('accessibility', () => {
    it('renders message in a paragraph element @p1', () => {
      render(<EmptyState />);

      const message = screen.getByText('No tasks yet — add one above!');
      expect(message.tagName).toBe('P');
    });
  });

  describe('reusability', () => {
    it('can switch between variants via rerender @p2', () => {
      const { rerender } = render(<EmptyState variant="empty" />);
      expect(screen.getByText('No tasks yet — add one above!')).toBeInTheDocument();

      rerender(<EmptyState variant="allComplete" />);
      expect(screen.getByText('All done! 🎉')).toBeInTheDocument();
    });

    it('can be used with different custom messages @p2', () => {
      const { rerender } = render(<EmptyState message="First message" />);
      expect(screen.getByText('First message')).toBeInTheDocument();

      rerender(<EmptyState message="Second message" />);
      expect(screen.getByText('Second message')).toBeInTheDocument();
    });
  });
});

