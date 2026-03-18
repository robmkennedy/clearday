import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosQueryKey } from './useTodos';
import type { OptimisticTodo } from './useAddTodo';
import { apiDeleteTodo } from '../api/todoApi';

/**
 * Context type for mutation rollback
 */
interface DeleteTodoContext {
  previousTodos: OptimisticTodo[] | undefined;
}

/**
 * Hook for deleting todos with optimistic updates
 *
 * Features:
 * - Immediately removes todo from UI
 * - Rolls back on error (restores todo)
 * - Triggers onError callback for toast notifications
 *
 * @param options.onError - Callback when mutation fails (for showing toast)
 * @returns Mutation object with mutate/mutateAsync functions
 */
export function useDeleteTodo(options?: { onError?: (error: Error) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: apiDeleteTodo,

    // Optimistic update: remove todo from cache before API call
    onMutate: async (id: string): Promise<DeleteTodoContext> => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: todosQueryKey });

      // Snapshot previous value for rollback
      const previousTodos = queryClient.getQueryData<OptimisticTodo[]>(todosQueryKey);

      // Optimistically remove todo from cache
      queryClient.setQueryData<OptimisticTodo[]>(todosQueryKey, (old) => {
        if (!old) return old;
        return old.filter((todo) => todo.id !== id);
      });

      // Return context with previous value for rollback
      return { previousTodos };
    },

    // Rollback on error
    onError: (error: Error, _id: string, context: DeleteTodoContext | undefined) => {
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

