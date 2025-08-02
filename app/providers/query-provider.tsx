import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import type { DefaultOptions } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { HttpError } from "@/shared/services/http-service";

const queryConfig: DefaultOptions = {
  queries: {
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
    refetchOnWindowFocus: false,
    refetchOnReconnect: true,
    retry: (failureCount, error) => {
      // Don't retry on 4xx errors except 408, 429
      if (error instanceof HttpError) {
        if (
          error.status >= 400 &&
          error.status < 500 &&
          ![408, 429].includes(error.status)
        ) {
          return false;
        }
      }
      return failureCount < 3;
    },
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  },
  mutations: {
    retry: (failureCount, error) => {
      if (error instanceof HttpError) {
        // Don't retry on client errors
        if (error.status >= 400 && error.status < 500) {
          return false;
        }
      }
      return failureCount < 2;
    },
  },
};

const queryClient = new QueryClient({
  defaultOptions: queryConfig,
});

interface QueryProviderProps {
  children: React.ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} buttonPosition="bottom-left" />
    </QueryClientProvider>
  );
}

export { queryClient };
