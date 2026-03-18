import { useMutation, useQueryClient } from '@tanstack/react-query';
import { todosQueryKey } from './useTodos';
import type { OptimisticTodo } from './useAddTodo';
import { apiToggleTodo } from '../api/todoApi';

/**
 * Context type for mutation rollback
 */
interface ToggleTodoContext {
  previousTodos: OptimisticTodo[] | undefined;
}

/**
 * Hook for toggling todo completion with optimistic updates
 *
 * Features:
 * - Immediately toggles completion state in UI
 * - Marks todo as pending during API call
 * - Rolls back on error
 * - Triggers onError callback for toast notifications
 *
 * @param options.onError - Callback when mutation fails (for showing toast)
 * @returns Mutation object with mutate/mutateAsync functions
 */
export function useToggleTodo(options?: { onError?: (error: Error) => void }) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, completed }: { id: string; completed: boolean }) =>
      apiToggleTodo(id, completed),

    // Optimistic update: toggle completion in cache before API call
    onMutate: async ({ id, completed }): Promise<ToggleTodoContext> => {
      // Cancel any outgoing refetches to avoid overwriting optimistic update
      await queryClient.cancelQueries({ queryKey: todosQueryKey });

      // Snapshot previous value for rollback
      const previousTodos = queryClient.getQueryData<OptimisticTodo[]>(todosQueryKey);

      // Optimistically update cache - toggle completion and mark as pending
      queryClient.setQueryData<OptimisticTodo[]>(todosQueryKey, (old) => {
        if (!old) return old;
        return old.map((todo) =>
          todo.id === id
            ? { ...todo, completed, isPending: true }
            : todo
        );
      });

      // Return context with previous value for rollback
      return { previousTodos };
    },

    // Rollback on error
    onError: (error: Error, _variables, context: ToggleTodoContext | undefined) => {
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

