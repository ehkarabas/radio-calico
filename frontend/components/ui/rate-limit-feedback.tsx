'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { AlertCircle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface RateLimitFeedbackProps {
  isRateLimited: boolean
  remainingTime: number // in milliseconds (fallback if server fetch fails)
  className?: string
  type?: 'signin' | 'password_reset' | 'magic_link' | 'signup' | 'email_verification' | 'contact' | 'email_change'
  email?: string // Required for fetching server-side remaining time
  contactEndpoint?: 'public' | 'authenticated' // For contact forms to specify which endpoint to use
  onRateLimitExpired?: () => void // Callback when rate limit expires
}

export function RateLimitFeedback({ 
  isRateLimited, 
  remainingTime, 
  className,
  type = 'signin',
  email,
  contactEndpoint,
  onRateLimitExpired
}: RateLimitFeedbackProps) {
  const [countdownTime, setCountdownTime] = useState(remainingTime)
  const [isLoading, setIsLoading] = useState(true)

  // Fetch real remaining time from server on mount
  useEffect(() => {
    const fetchServerRemainingTime = async () => {
      if (!isRateLimited || !email) {
        setIsLoading(false)
        return
      }

      // For contact type, check server rate limit and use real remaining time
      if (type === 'contact') {
        try {
          // Determine correct endpoint based on contact form type
          const endpoint = contactEndpoint === 'authenticated' 
            ? '/api/profile/contact/check-rate-limit'
            : '/api/auth/contact/check-rate-limit'
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email })
          })

          const data = await response.json()
          
          if (data.rateLimited && data.resetTime) {
            // Use server's real remaining time
            setCountdownTime(data.resetTime)
          } else if (!data.rateLimited) {
            // No longer rate limited on server
            setCountdownTime(0)
          } else {
            // Fallback to provided remainingTime if positive
            const safeRemainingTime = remainingTime > 0 ? remainingTime : 0
            setCountdownTime(safeRemainingTime)
          }
        } catch (error) {
          console.error('Failed to fetch contact rate limit from server:', error)
          // Fallback to provided remainingTime
          const safeRemainingTime = remainingTime > 0 ? remainingTime : 0
          setCountdownTime(safeRemainingTime)
        } finally {
          setIsLoading(false)
        }
        return
      }

      try {
        // Convert type to correct endpoint URL (password_reset -> password-reset)
        const endpointType = type.replace('_', '-')
        const response = await fetch(`/api/auth/${endpointType}/check-rate-limit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email })
        })

        const data = await response.json()
        
        if (data.rateLimited && data.resetTime) {
          // Use server's real remaining time
          setCountdownTime(data.resetTime)
        } else if (!data.rateLimited) {
          // No longer rate limited on server
          setCountdownTime(0)
        }
      } catch (error) {
        console.error('Failed to fetch server remaining time:', error)
        // Fallback to provided remainingTime
        setCountdownTime(remainingTime)
      } finally {
        setIsLoading(false)
      }
    }

    fetchServerRemainingTime()
  }, [isRateLimited, email, type, remainingTime])

  useEffect(() => {
    if (!isRateLimited || countdownTime <= 0 || isLoading) return

    const interval = setInterval(() => {
      setCountdownTime(prev => {
        const newTime = prev - 1000
        if (newTime <= 0) {
          // Rate limit expired - notify parent component
          onRateLimitExpired?.()
          return 0
        }
        return newTime
      })
    }, 1000)

    return () => clearInterval(interval)
  }, [isRateLimited, countdownTime, isLoading])

  // Special handling for contact type - use remainingTime if countdownTime is not set yet
  // Ensure both countdownTime and remainingTime are positive
  const shouldRender = type === 'contact' 
    ? (isRateLimited && (countdownTime > 0 || (remainingTime > 0 && remainingTime > 0)))
    : (isRateLimited && countdownTime > 0)

  if (!shouldRender) {
    if (type === 'contact') {
      console.log('[RateLimitFeedback] Contact type - NOT rendering:')
      console.log('  isRateLimited:', isRateLimited)
      console.log('  countdownTime:', countdownTime)
      console.log('  remainingTime:', remainingTime)
      console.log('  type:', type)
      console.log('  shouldRender:', shouldRender)
    }
    return null
  }

  if (type === 'contact') {
    console.log('[RateLimitFeedback] Contact type - RENDERING:', {
      isRateLimited,
      countdownTime,
      remainingTime,
      type
    })
  }

  const getTypeMessage = () => {
    switch (type) {
      case 'signin':
        return 'Too many signin attempts'
      case 'password_reset':
        return 'Too many password reset requests'
      case 'magic_link':
        return 'Too many magic link requests'
      case 'signup':
        return 'Too many signup attempts'
      case 'email_verification':
        return 'Too many email verification requests'
      case 'contact':
        return 'Too many contact form submissions'
      case 'email_change':
        return 'Too many email change requests'
      case 'email_change':
        return 'Too many email change requests'
      default:
        return 'Rate limit exceeded'
    }
  }

  const minutes = Math.floor(countdownTime / 60000)
  const seconds = Math.floor((countdownTime % 60000) / 1000)

  return (
    <motion.div 
      className={cn(
        "bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800/30 rounded-lg",
        "mt-2 ehlogo:mt-1.5 xs:mt-3 sm:mt-4",
        "p-2 ehlogo:p-1.5 xs:p-3 sm:p-4",
        className
      )}
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center space-x-1 ehlogo:space-x-0.5 xs:space-x-1.5 sm:space-x-2">
        <AlertCircle className="w-3 h-3 ehlogo:w-2.5 ehlogo:h-2.5 xs:w-4 xs:h-4 text-red-500" />
        <div className="flex-1">
          <p className="text-xs ehlogo:text-[10px] xs:text-sm font-medium text-red-800 dark:text-red-300 break-words">
            {getTypeMessage()}
          </p>
          <p className="text-[10px] ehlogo:text-[8px] xs:text-xs text-red-600 dark:text-red-400 break-words">
            Please wait {Math.ceil(countdownTime / 1000)} seconds before trying again
            {isLoading && ' (syncing...)'}
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm ehlogo:text-xs xs:text-base sm:text-lg font-mono font-bold text-red-600 dark:text-red-400">
            {minutes}:{String(seconds).padStart(2, '0')}
          </div>
          <div className="text-[10px] ehlogo:text-[8px] xs:text-xs text-red-500">
            mm:ss
          </div>
        </div>
      </div>
    </motion.div>
  )
}