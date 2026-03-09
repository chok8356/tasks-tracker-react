import type { QueryClient } from '@tanstack/react-query'

import { QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React from 'react'

import { createQueryClient } from './query-client'

export function QueryProvider({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState<QueryClient>(createQueryClient)

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}
