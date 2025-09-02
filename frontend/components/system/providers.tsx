"use client"

import { SessionProvider } from 'next-auth/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Toaster } from '@/components/ui/sonner'
import { ThemeProvider } from '@/components/theme-provider'
import { TrackProvider } from '@/contexts/track-context'
import { useState, useEffect } from 'react'
import { NEXT_PUBLIC_PROJECT_NAME as PROJECT_NAME } from '@/lib/constants'


export function Providers({ children }: { children: React.ReactNode }) {
  // Create QueryClient instance with proper configuration
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: false,
        retry: 1,
      },
      mutations: {
        retry: 0,
      },
    },
  }))



  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="dark"
      enableSystem
      storageKey={`${PROJECT_NAME.toLowerCase().replace(/\s+/g, '-') || "project"}-theme`}
    >
      <QueryClientProvider client={queryClient}>
        <SessionProvider>
          <TrackProvider>
            {/* Social OAuth password setup redirect now handled server-side via NextAuth callback */}
            {children}
          </TrackProvider>
          <Toaster
            position="top-right"
            expand={false}
            richColors
            closeButton
          />
          {/* {process.env.NODE_ENV === 'development' && (
            <ReactQueryDevtools initialIsOpen={false} />
          )} */}
        </SessionProvider>
      </QueryClientProvider>
    </ThemeProvider>
  )
}