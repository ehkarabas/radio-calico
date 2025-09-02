import { Suspense } from 'react'
import { Metadata } from 'next'
import { StatsContent } from '@/components/stats/stats-content'
import { StatsLoadingSkeleton } from '@/components/stats/stats-loading-skeleton'
import { NEXT_PUBLIC_PROJECT_NAME } from '@/lib/constants'
import Image from 'next/image'
import { HomeButton } from '@/components/stats/home-button'

// SEO Metadata for stats page
export const metadata: Metadata = {
  title: `Global Stats | ${NEXT_PUBLIC_PROJECT_NAME}`,
  description: `Discover ${NEXT_PUBLIC_PROJECT_NAME} platform statistics - most played tracks, highest rated songs, top listeners, and favorite tracks. Explore global music trends and community insights.`,
  keywords: [
    'radio statistics',
    'music charts',
    'most played tracks',
    'top rated songs',
    'music analytics',
    'radio insights',
    `${NEXT_PUBLIC_PROJECT_NAME} stats`
  ],
  openGraph: {
    title: `Global Stats | ${NEXT_PUBLIC_PROJECT_NAME}`,
    description: `Explore ${NEXT_PUBLIC_PROJECT_NAME} platform statistics and music trends`,
    type: 'website',
    siteName: NEXT_PUBLIC_PROJECT_NAME,
  },
  twitter: {
    card: 'summary_large_image',
    title: `Global Stats | ${NEXT_PUBLIC_PROJECT_NAME}`,
    description: `Explore ${NEXT_PUBLIC_PROJECT_NAME} platform statistics and music trends`,
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: `/stats`,
  }
}

// Global Statistics Page
// Protected route - authentication required via middleware
export default function StatsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Sticky Header - Mobile First Responsive */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b border-border">
        <div className="w-full px-1 ehlogo:px-2 xxs:px-4 xs:px-6 sm:px-8 py-2 ehlogo:py-3 xxs:py-4">
          <div className="flex flex-row items-center justify-between w-full">
            {/* Home Button - Left Side */}
            <div className="flex-shrink-0">
              <HomeButton />
            </div>
            
            {/* Center Content - Logo & Title */}
            <div className="flex flex-row gap-1 ehlogo:gap-2 items-center flex-1 justify-center">
              {/* Logo - Mobile First Scaling */}
              <div className="relative h-5 w-5 ehlogo:h-6 ehlogo:w-6 xxs:h-7 xxs:w-7 xxxs:h-8 xxxs:w-8">
                <Image
                  src="/ehlogo.png"
                  alt="Radio Calico Logo"
                  fill
                  className="object-contain"
                  priority
                />
              </div>
              {/* Title - Mobile First Typography */}
              <h1 className="text-sm ehlogo:text-base xxs:text-lg xxxs:text-xl xs:text-2xl sm:text-3xl md:text-4xl font-bold text-foreground text-center leading-tight">
                <span className="hidden ehlogo:inline">{NEXT_PUBLIC_PROJECT_NAME} Global Stats</span>
                <span className="inline ehlogo:hidden">Stats</span>
              </h1>
            </div>
            
            {/* Right Side - Empty for Balance */}
            <div className="flex-shrink-0 w-8 xxs:w-10"></div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-full sm:container mx-auto px-2 xxs:px-4 xs:px-6 sm:px-8 py-6 xxs:py-8 xs:py-12">
        <Suspense fallback={<StatsLoadingSkeleton />}>
          <StatsContent />
        </Suspense>
      </main>
    </div>
  )
}