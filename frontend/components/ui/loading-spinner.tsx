"use client"

import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function LoadingSpinner({ size = 'md', className }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-3 h-3 ehlogo:w-2 ehlogo:h-2 xs:w-4 xs:h-4',
    md: 'w-6 h-6 ehlogo:w-4 ehlogo:h-4 xs:w-7 xs:h-7 sm:w-8 sm:h-8',
    lg: 'w-10 h-10 ehlogo:w-8 ehlogo:h-8 xs:w-11 xs:h-11 sm:w-12 sm:h-12'
  }

  return (
    <div className={cn("flex items-center justify-center", className)}>
      <motion.div
        className={cn(
          "border-2 border-gray-300 border-t-blue-600 rounded-full",
          "dark:border-gray-600 dark:border-t-blue-400",
          "text-gray-800 dark:text-gray-300",
          sizeClasses[size]
        )}
        animate={{ rotate: 360 }}
        transition={{
          duration: 1,
          repeat: Infinity,
          ease: "linear"
        }}
      />
    </div>
  )
}

// Full screen loading wrapper
export function FullScreenLoader() {
  return (
    <div className="!h-screen !w-screen flex items-center justify-center bg-background">
      <div className="flex items-center justify-center gap-4 ehlogo:gap-2 xs:gap-6 sm:gap-8">
        <LoadingSpinner size="lg" />
        <motion.p
          className="text-xs ehlogo:text-[10px] xs:text-sm sm:text-base text-muted-foreground break-words"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Loading...
        </motion.p>
      </div>
    </div>
  )
}