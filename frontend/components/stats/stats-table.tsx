'use client'

import { motion } from 'framer-motion'
import { MostPlayedTrack, RatedTrack, FavoritedTrack, TopListener } from '@/types/stats'

interface StatsTableProps {
  data: MostPlayedTrack[] | RatedTrack[] | FavoritedTrack[] | TopListener[]
  valueKey: 'totalListens' | 'rating' | 'favoriteCount' | 'totalTracks'
  valueLabel: string
  isUserStats?: boolean
}

// Generic stats table component with responsive design
export function StatsTable({ data, valueKey, valueLabel, isUserStats = false }: StatsTableProps) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <p className="text-sm xxs:text-base">No data available</p>
      </div>
    )
  }

  // Format value display
  const formatValue = (value: number | null, key: string) => {
    if (value === null || value === undefined) return 'N/A'
    
    if (key === 'rating') {
      return value.toFixed(1)
    }
    
    return value.toLocaleString()
  }

  return (
    <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
      {/* Table Header */}
      <div className="bg-muted/50 px-3 xxs:px-4 xs:px-6 py-2 xxs:py-3 border-b border-border">
        <div className="grid grid-cols-12 gap-2 xxs:gap-3 xs:gap-4 text-xs xxs:text-sm xs:text-base font-medium text-muted-foreground">
          <div className="col-span-1 text-center">#</div>
          <div className="col-span-7 xxs:col-span-8 xs:col-span-9">
            {isUserStats ? 'User' : 'Track'}
          </div>
          <div className="col-span-4 xxs:col-span-3 xs:col-span-2 text-right capitalize">
            {valueLabel}
          </div>
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-border">
        {data.map((item, index) => {
          const isTrack = !isUserStats
          const trackItem = isTrack ? item as (MostPlayedTrack | RatedTrack | FavoritedTrack) : null
          const userItem = !isTrack ? item as TopListener : null

          return (
            <motion.div
              key={isTrack ? trackItem?.id : userItem?.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                duration: 0.3,
                delay: index * 0.05,
                ease: [0.25, 0.46, 0.45, 0.94]
              }}
              className="px-3 xxs:px-4 xs:px-6 py-2 xxs:py-3 xs:py-4 hover:bg-muted/30 transition-colors duration-200"
            >
              <div className="grid grid-cols-12 gap-2 xxs:gap-3 xs:gap-4 items-center">
                {/* Rank */}
                <div className="col-span-1 text-center">
                  <span className="inline-flex items-center justify-center w-5 h-5 xxs:w-6 xxs:h-6 xs:w-7 xs:h-7 text-xs xxs:text-sm font-medium text-primary bg-primary/10 rounded-full">
                    {index + 1}
                  </span>
                </div>

                {/* Track/User Info */}
                <div className="col-span-7 xxs:col-span-8 xs:col-span-9 min-w-0">
                  {isTrack && trackItem ? (
                    <div className="space-y-0.5">
                      {/* Track Title */}
                      <h3 className="text-xs xxs:text-sm xs:text-base font-medium text-card-foreground truncate">
                        {trackItem.title}
                      </h3>
                      
                      {/* Artist & Album */}
                      <div className="flex flex-col xxxs:flex-row xxxs:items-center xxxs:gap-2 text-xs xxs:text-sm text-muted-foreground">
                        <span className="truncate">{trackItem.artist}</span>
                        {trackItem.album && (
                          <>
                            <span className="hidden xxxs:inline text-muted-foreground/60">•</span>
                            <span className="truncate text-muted-foreground/80">{trackItem.album}</span>
                          </>
                        )}
                      </div>
                    </div>
                  ) : userItem ? (
                    <div className="space-y-0.5">
                      {/* User Name */}
                      <h3 className="text-xs xxs:text-sm xs:text-base font-medium text-card-foreground">
                        {userItem.name}
                      </h3>
                      
                      {/* User Stats Label */}
                      <p className="text-xs text-muted-foreground">
                        Music Listener
                      </p>
                    </div>
                  ) : null}
                </div>

                {/* Value */}
                <div className="col-span-4 xxs:col-span-3 xs:col-span-2 text-right">
                  <div className="space-y-0.5">
                    <div className="text-xs xxs:text-sm xs:text-base font-semibold text-card-foreground">
                      {formatValue((item as any)[valueKey], valueKey)}
                    </div>
                    
                    {/* Additional info for rated tracks */}
                    {valueKey === 'rating' && (item as RatedTrack).upvotes !== undefined && (
                      <div className="text-xs text-muted-foreground">
                        <span className="text-green-500">+{(item as RatedTrack).upvotes}</span>
                        {' / '}
                        <span className="text-red-500">-{(item as RatedTrack).downvotes}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}