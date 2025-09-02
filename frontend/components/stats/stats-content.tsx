'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { StatsTable } from './stats-table'
import { GlobalStats } from '@/types/stats'

// Main stats content component with data fetching and error handling
export function StatsContent() {
  const [stats, setStats] = useState<GlobalStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchStats() {
      try {
        setLoading(true)
        setError(null)

        const response = await fetch('/api/stats')
        
        if (!response.ok) {
          if (response.status === 401) {
            throw new Error('Authentication required')
          }
          throw new Error('Failed to fetch statistics')
        }

        const data = await response.json()
        setStats(data)
      } catch (err) {
        console.error('Stats fetch error:', err)
        setError(err instanceof Error ? err.message : 'Unknown error occurred')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <motion.div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-destructive/10 border border-destructive/20 rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-destructive mb-2">
            Error Loading Statistics
          </h2>
          <p className="text-sm text-muted-foreground">
            {error}
          </p>
        </div>
      </motion.div>
    )
  }

  // No data state
  if (!stats) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-12"
      >
        <div className="bg-muted/50 border border-border rounded-lg p-6 max-w-md mx-auto">
          <h2 className="text-lg font-semibold text-foreground mb-2">
            No Statistics Available
          </h2>
          <p className="text-sm text-muted-foreground">
            Check back later for updated statistics
          </p>
        </div>
      </motion.div>
    )
  }

  // Stats cards configuration
  const statsConfig = [
    {
      title: 'Most Played Tracks',
      description: 'Tracks with highest listen counts',
      data: stats.mostPlayed,
      icon: '🎵',
      valueKey: 'totalListens' as const,
      valueLabel: 'listens'
    },
    {
      title: 'Highest Rated Tracks', 
      description: 'Tracks with best community ratings',
      data: stats.highestRated,
      icon: '⭐',
      valueKey: 'rating' as const,
      valueLabel: 'rating'
    },
    {
      title: 'Lowest Rated Tracks',
      description: 'Tracks with community feedback',
      data: stats.lowestRated,
      icon: '📉',
      valueKey: 'rating' as const,
      valueLabel: 'rating'
    },
    {
      title: 'Most Favorited Tracks',
      description: 'Community favorite selections',
      data: stats.mostFavorited,
      icon: '❤️',
      valueKey: 'favoriteCount' as const,
      valueLabel: 'favorites'
    },
    {
      title: 'Top Listeners',
      description: 'Users with most tracked listens',
      data: stats.topListeners,
      icon: '👥',
      valueKey: 'totalTracks' as const,
      valueLabel: 'tracks'
    }
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 xxs:space-y-8 xs:space-y-12"
    >
      {statsConfig.map((config, index) => (
        <motion.div
          key={config.title}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <Card className="bg-card border-border shadow-sm hover:shadow-md transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <span className="text-2xl xxs:text-3xl xs:text-4xl" role="img" aria-label={config.title}>
                  {config.icon}
                </span>
                <div>
                  <CardTitle className="text-base xxs:text-lg xs:text-xl sm:text-2xl text-card-foreground">
                    {config.title}
                  </CardTitle>
                  <p className="text-xs xxs:text-sm xs:text-base text-muted-foreground mt-1">
                    {config.description}
                  </p>
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              <StatsTable
                data={config.data}
                valueKey={config.valueKey}
                valueLabel={config.valueLabel}
                isUserStats={config.title === 'Top Listeners'}
              />
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Generated timestamp */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center pt-8 border-t border-border"
      >
        <p className="text-xs xxs:text-sm text-muted-foreground">
          Statistics generated on {new Date(stats.generatedAt).toLocaleString()}
        </p>
      </motion.div>
    </motion.div>
  )
}