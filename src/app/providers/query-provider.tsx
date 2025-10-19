import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const queryClient = React.useMemo(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 0,
            staleTime: 1000 * 60 * 5,
          },
        },
      }),
    [],
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
