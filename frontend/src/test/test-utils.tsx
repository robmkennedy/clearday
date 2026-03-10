import type { ReactNode } from 'react';
import { vi } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '../hooks/useToast';
import { ToastContainer } from '../components/Toast';

/**
 * Create a fresh QueryClient for tests with retry disabled
 */
export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

/**
 * Create a wrapper component with QueryClientProvider for testing hooks/components
 */
export function createQueryWrapper() {
  const queryClient = createTestQueryClient();
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Create a wrapper that uses a specific QueryClient instance
 * Useful when multiple hooks need to share the same cache
 */
export function createQueryWrapperWithClient(queryClient: QueryClient) {
  return function QueryWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
    );
  };
}

/**
 * Create a wrapper with QueryClient and ToastProvider for component testing
 * Includes ToastContainer to render toast notifications
 */
export function createAppWrapper() {
  const queryClient = createTestQueryClient();
  return function AppWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </QueryClientProvider>
    );
  };
}

/**
 * Create a wrapper with specific QueryClient and ToastProvider
 */
export function createAppWrapperWithClient(queryClient: QueryClient) {
  return function AppWrapper({ children }: { children: ReactNode }) {
    return (
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          {children}
          <ToastContainer />
        </ToastProvider>
      </QueryClientProvider>
    );
  };
}

/**
 * Mock fetch helpers for cleaner test setup
 */

/**
 * Create a mock fetch that returns successful JSON response
 */
export function mockFetchSuccess<T>(data: T) {
  return vi.fn().mockResolvedValue({
    ok: true,
    json: () => Promise.resolve(data),
  });
}

/**
 * Create a mock fetch that returns an error response
 */
export function mockFetchError(status = 500) {
  return vi.fn().mockResolvedValue({
    ok: false,
    status,
  });
}

/**
 * Create a mock fetch that never resolves (for loading state tests)
 */
export function mockFetchPending() {
  return vi.fn().mockImplementation(() => new Promise(() => {}));
}

/**
 * Create a mock fetch that handles multiple request types
 * @param handlers - Object mapping HTTP methods to response handlers
 * @param defaultData - Default data returned for unhandled GET requests
 */
export function mockFetchWithHandlers<T>(
  handlers: {
    GET?: () => Promise<Partial<Response>> | Partial<Response>;
    POST?: () => Promise<Partial<Response>> | Partial<Response>;
    PATCH?: () => Promise<Partial<Response>> | Partial<Response>;
    DELETE?: () => Promise<Partial<Response>> | Partial<Response>;
  },
  defaultData?: T
) {
  return vi.fn().mockImplementation((_url: string, options?: RequestInit) => {
    const method = (options?.method || 'GET') as keyof typeof handlers;

    if (handlers[method]) {
      return handlers[method]();
    }

    // Default: return success with data for GET
    if (defaultData !== undefined) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(defaultData),
      });
    }

    return Promise.resolve({ ok: true });
  });
}
