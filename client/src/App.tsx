/**
 * Routes
 */
import { AppRoutes } from '@/routes/AppRoutes';

/**
 * Providers
 */
import { QueryProvider } from './providers/QueryProvider';

export const App = () => {
  return (
    <QueryProvider>
      <AppRoutes />
    </QueryProvider>
  );
};
