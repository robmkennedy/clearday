import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskInput } from './components/TaskInput';
import { TodoList } from './components/TodoList';
import { ToastContainer } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { useAddTodo, useToast, ToastProvider } from './hooks';
import './styles/global.css';

/**
 * React Query client configuration
 */
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60, // 1 minute
      retry: 1,
    },
  },
});

/**
 * Todo list content component
 */
function TodoContent() {
  const { addToast } = useToast();

  const mutation = useAddTodo({
    onError: (error) => {
      addToast(error.message || 'Failed to add task', 'error');
    },
  });

  const handleSubmit = async (text: string) => {
    await mutation.mutateAsync(text);
  };

  return (
    <>
      <TaskInput onSubmit={handleSubmit} isLoading={mutation.isPending} />
      <TodoList />
    </>
  );
}

/**
 * Main App component
 *
 * This is the root component of the application.
 */
export function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <div className="app">
          <header>
            <div className="container header-content">
              <h1>BMad Todo</h1>
              <ThemeToggle />
            </div>
          </header>
          <main>
            <div className="container">
              <TodoContent />
            </div>
          </main>
        </div>
        <ToastContainer />
      </ToastProvider>
    </QueryClientProvider>
  );
}

