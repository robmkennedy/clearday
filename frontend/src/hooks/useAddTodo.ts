import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosQueryKey } from './useTodos';
import type { Todo } from '@shared/types';
import { apiCreateTodo } from '../api/todoApi';

/**
 * Extended Todo type with pending state for optimistic updates
 */
export interface OptimisticTodo extends Todo {
  isPending?: boolean;
}


/**
 * Context type for mutation rollback
 */
interface AddTodoContext {
  previousTodos: OptimisticTodo[] | undefined;
}

/**
 * Hook for adding todos with optimistic updates
 *
 * Features:
 * - Immediately adds todo to UI (optimistic update)
 * - Shows pending state on optimistic entry
 * - Rolls back on error
 * - Triggers onError callback for toast notifications
 *
 * @param options.onError - Callback when mutation fails (for showing toast)
 * @returns Mutation object with mutate/mutateAsync functions
 */
export function useAddTodo(options?: { onError?: (error: Error) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiCreateTodo,

    // Optimistic update: add temp todo to cache before API call
    onMutate: async (text: string): Promise<AddTodoContext> => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: todosQueryKey });

      // Snapshot previous value for rollback
      const previousTodos = queryClient.getQueryData<OptimisticTodo[]>(todosQueryKey);

      // Create optimistic todo with temp ID
      const optimisticTodo: OptimisticTodo = {
        id: `temp-${crypto.randomUUID()}`,
        text,
        completed: false,
        createdAt: new Date().toISOString(),
        isPending: true,
      };

      // Optimistically update cache - add to beginning (newest first)
      queryClient.setQueryData<OptimisticTodo[]>(todosQueryKey, (old) => {
        return [optimisticTodo, ...(old ?? [])];
      });

      // Return context with previous value for rollback
      return { previousTodos };
    },

    // Rollback on error
    onError: (error: Error, _text: string, context: AddTodoContext | undefined) => {
      // Restore previous cache state
      if (context?.previousTodos !== undefined) {
        queryClient.setQueryData(todosQueryKey, context.previousTodos);
      }

      // Call user-provided error handler (for toast)
      options?.onError?.(error);
    },

    // Always refetch after error or success to sync with server
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: todosQueryKey });
    },
  });
}

