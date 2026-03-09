import { QueryClient } from '@tanstack/react-query'

export const createQueryClient = (): QueryClient =>
  new QueryClient({
    defaultOptions: {
      queries: {
        retry: 0,
        staleTime: 1000 * 60 * 5,
      },
    },
  })
