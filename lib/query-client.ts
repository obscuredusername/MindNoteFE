import { QueryClient } from '@tanstack/react-query'

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            staleTime: 1000 * 60 * 2,   // Data is fresh for 2 minutes
            retry: 1,                    // Only retry once on failure
        },
    },
})
