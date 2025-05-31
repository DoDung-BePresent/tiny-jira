/**
 * Routes
 */
import { AppRoutes } from '@/routes/AppRoutes';

/**
 * Providers
 */
import { QueryProvider } from '@/providers/QueryProvider';
import { ToastProvider } from '@/providers/ToastProvider';

export const App = () => {
  return (
    <QueryProvider>
      <ToastProvider>
        <AppRoutes />
      </ToastProvider>
    </QueryProvider>
  );
};
