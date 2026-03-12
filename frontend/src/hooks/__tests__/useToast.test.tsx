import { describe, it, expect, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type { ReactNode } from 'react';
import { ToastProvider, useToast } from '../useToast';

function createWrapper() {
  return function Wrapper({ children }: { children: ReactNode }) {
    return <ToastProvider>{children}</ToastProvider>;
  };
}

describe('useToast', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('throws when used outside ToastProvider', () => {
    // Suppress console.error for expected error
    vi.spyOn(console, 'error').mockImplementation(() => {});
    expect(() => renderHook(() => useToast())).toThrow(
      'useToast must be used within a ToastProvider'
    );
  });

  it('starts with empty toasts array', () => {
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });
    expect(result.current.toasts).toEqual([]);
  });

  it('addToast adds a toast with default type "info"', () => {
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('Hello');
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Hello');
    expect(result.current.toasts[0].type).toBe('info');
    expect(result.current.toasts[0].id).toBeDefined();
  });

  it('addToast accepts custom type', () => {
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('Error occurred', 'error');
    });

    expect(result.current.toasts[0].type).toBe('error');
  });

  it('addToast supports success type', () => {
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('Done!', 'success');
    });

    expect(result.current.toasts[0].type).toBe('success');
  });

  it('removeToast removes a specific toast by id', () => {
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('First');
      result.current.addToast('Second');
    });

    const idToRemove = result.current.toasts[0].id;

    act(() => {
      result.current.removeToast(idToRemove);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Second');
  });

  it('removeToast clears the auto-dismiss timer', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('Timer toast');
    });

    const id = result.current.toasts[0].id;

    // Manually remove before auto-dismiss fires
    act(() => {
      result.current.removeToast(id);
    });

    expect(result.current.toasts).toHaveLength(0);

    // Advance past auto-dismiss — should not cause errors
    act(() => {
      vi.advanceTimersByTime(6000);
    });

    expect(result.current.toasts).toHaveLength(0);
    vi.useRealTimers();
  });

  it('auto-dismisses toast after 5 seconds', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('Auto dismiss me');
    });

    expect(result.current.toasts).toHaveLength(1);

    // Advance time just before auto-dismiss
    act(() => {
      vi.advanceTimersByTime(4999);
    });
    expect(result.current.toasts).toHaveLength(1);

    // Advance past auto-dismiss threshold
    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(result.current.toasts).toHaveLength(0);

    vi.useRealTimers();
  });

  it('removeToast is a no-op for non-existent id', () => {
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('Existing');
    });

    act(() => {
      result.current.removeToast('non-existent-id');
    });

    expect(result.current.toasts).toHaveLength(1);
  });

  it('cleans up all timers on unmount', () => {
    vi.useFakeTimers();
    const clearTimeoutSpy = vi.spyOn(global, 'clearTimeout');
    const { result, unmount } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('Toast 1');
      result.current.addToast('Toast 2');
      result.current.addToast('Toast 3');
    });

    expect(result.current.toasts).toHaveLength(3);

    unmount();

    // clearTimeout should have been called for each active timer (3 toasts)
    expect(clearTimeoutSpy.mock.calls.length).toBeGreaterThanOrEqual(3);

    vi.useRealTimers();
  });

  it('handles multiple toasts with independent auto-dismiss timers', () => {
    vi.useFakeTimers();
    const { result } = renderHook(() => useToast(), { wrapper: createWrapper() });

    act(() => {
      result.current.addToast('First');
    });

    // Wait 3 seconds then add another
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    act(() => {
      result.current.addToast('Second');
    });

    expect(result.current.toasts).toHaveLength(2);

    // At 5000ms total, first should auto-dismiss
    act(() => {
      vi.advanceTimersByTime(2000);
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0].message).toBe('Second');

    // At 8000ms total (3000 + 5000), second should auto-dismiss
    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(result.current.toasts).toHaveLength(0);

    vi.useRealTimers();
  });
});

