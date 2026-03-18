import { useQuery } from '@tanstack/react-query';
import { apiFetchTodos } from '../api/todoApi';

/**
 * Query key for todos - exported for use in mutations
 */
export const todosQueryKey = ['todos'] as const;

/**
 * Hook for fetching todos using React Query
 *
 * @returns Query result with todos data, loading state, error state, and refetch function
 */
export function useTodos() {
  const query = useQuery({
    queryKey: todosQueryKey,
    queryFn: apiFetchTodos,
  });

  return {
    data: query.data,
    isLoading: query.isLoading,
    isError: query.isError,
    error: query.error,
    refetch: query.refetch,
  };
}

