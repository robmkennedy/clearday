import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { TaskInput } from './components/TaskInput';
import { TodoList } from './components/TodoList';
import { ToastContainer } from './components/Toast';
import { ThemeToggle } from './components/ThemeToggle';
import { useAddTodo, useToast, useAnnouncer, ToastProvider } from './hooks';
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
  const { message: announcement, announce } = useAnnouncer();

  const mutation = useAddTodo({
    onError: (error) => {
      addToast(error.message || 'Failed to add task', 'error');
    },
  });

  const handleSubmit = async (text: string) => {
    await mutation.mutateAsync(text);
    announce(`Task added: ${text}`);
  };

  return (
    <>
      {/* A11Y-03: Screen reader announcements for task creation */}
      <div aria-live="polite" aria-atomic="true" className="visually-hidden">
        {announcement}
      </div>
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
          {/* A11Y-04: Skip link for keyboard navigation (WCAG 2.4.1) */}
          <a href="#task-input" className="skip-link">
            Skip to add task
          </a>
          <header>
            <div className="container header-content">
              <h1>ClearDay</h1>
              <ThemeToggle />
            </div>
          </header>
          <main>
            <div className="container">
              <TodoContent />
            </div>
          </main>
          <footer>
            <div className="container footer-content">
              <a
                href="https://github.com/robmkennedy/clearday#readme"
                target="_blank"
                rel="noopener noreferrer"
              >
                README
              </a>
            </div>
          </footer>
        </div>
        <ToastContainer />
      </ToastProvider>
    </QueryClientProvider>
  );
}

