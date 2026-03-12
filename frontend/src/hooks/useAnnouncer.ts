import { useState, useCallback, useRef, useEffect } from 'react';

/**
 * Hook for screen reader announcements via ARIA live region.
 *
 * Returns an `announce` function and an `Announcer` component
 * that renders a visually-hidden aria-live region.
 *
 * A11Y-03: Provides CRUD action confirmations for screen readers (WCAG 4.1.3).
 */
export function useAnnouncer() {
  const [message, setMessage] = useState('');
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((text: string) => {
    // Clear then set to ensure screen readers pick up repeated messages
    setMessage('');
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      setMessage(text);
    }, 50);
  }, []);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return { message, announce };
}

