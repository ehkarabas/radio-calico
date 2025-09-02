'use client'

import { motion } from 'framer-motion'
import { Card, CardContent, CardHeader } from '@/components/ui/card'

// Loading skeleton for stats page
export function StatsLoadingSkeleton() {
  const skeletonCards = Array.from({ length: 5 }, (_, i) => i)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 xxs:space-y-8 xs:space-y-12"
    >
      {skeletonCards.map((index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.5, 
            delay: index * 0.1,
            ease: [0.25, 0.46, 0.45, 0.94]
          }}
        >
          <Card className="bg-card border-border shadow-sm">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                {/* Icon skeleton */}
                <div className="w-8 h-8 xxs:w-10 xxs:h-10 xs:w-12 xs:h-12 bg-muted rounded-lg animate-pulse" />
                
                <div className="space-y-2 flex-1">
                  {/* Title skeleton */}
                  <div className="h-4 xxs:h-5 xs:h-6 bg-muted rounded animate-pulse w-48 max-w-full" />
                  
                  {/* Description skeleton */}
                  <div className="h-3 xxs:h-4 bg-muted/60 rounded animate-pulse w-32 max-w-full" />
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-0">
              {/* Table skeleton */}
              <div className="w-full overflow-hidden rounded-lg border border-border bg-card">
                {/* Header skeleton */}
                <div className="bg-muted/50 px-3 xxs:px-4 xs:px-6 py-2 xxs:py-3 border-b border-border">
                  <div className="grid grid-cols-12 gap-2 xxs:gap-3 xs:gap-4">
                    <div className="col-span-1">
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse" />
                    </div>
                    <div className="col-span-7 xxs:col-span-8 xs:col-span-9">
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-20" />
                    </div>
                    <div className="col-span-4 xxs:col-span-3 xs:col-span-2">
                      <div className="h-3 bg-muted-foreground/20 rounded animate-pulse w-16 ml-auto" />
                    </div>
                  </div>
                </div>

                {/* Rows skeleton */}
                <div className="divide-y divide-border">
                  {Array.from({ length: 5 }, (_, rowIndex) => (
                    <motion.div
                      key={rowIndex}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{
                        duration: 0.3,
                        delay: (index * 0.1) + (rowIndex * 0.05),
                        ease: [0.25, 0.46, 0.45, 0.94]
                      }}
                      className="px-3 xxs:px-4 xs:px-6 py-2 xxs:py-3 xs:py-4"
                    >
                      <div className="grid grid-cols-12 gap-2 xxs:gap-3 xs:gap-4 items-center">
                        {/* Rank skeleton */}
                        <div className="col-span-1 text-center">
                          <div className="inline-flex items-center justify-center w-5 h-5 xxs:w-6 xxs:h-6 xs:w-7 xs:h-7 bg-muted rounded-full animate-pulse" />
                        </div>

                        {/* Content skeleton */}
                        <div className="col-span-7 xxs:col-span-8 xs:col-span-9 space-y-1">
                          <div className="h-3 xxs:h-4 bg-muted rounded animate-pulse w-3/4" />
                          <div className="h-2 xxs:h-3 bg-muted/60 rounded animate-pulse w-1/2" />
                        </div>

                        {/* Value skeleton */}
                        <div className="col-span-4 xxs:col-span-3 xs:col-span-2 text-right space-y-1">
                          <div className="h-3 xxs:h-4 bg-muted rounded animate-pulse w-12 ml-auto" />
                          <div className="h-2 bg-muted/60 rounded animate-pulse w-8 ml-auto" />
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}

      {/* Timestamp skeleton */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.8 }}
        className="text-center pt-8 border-t border-border"
      >
        <div className="h-3 bg-muted/60 rounded animate-pulse w-64 max-w-full mx-auto" />
      </motion.div>
    </motion.div>
  )
}