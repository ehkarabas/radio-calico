'use server'

import { getRateLimitRemainingTime, formatRemainingTime, type RateLimitType } from '@/lib/auth/rate-limit-helpers'

export interface RateLimitStatus {
  hasActiveLimit: boolean
  remainingTime: number // milliseconds
  formattedTime: string
  message: string
}

/**
 * Server Action: Get remaining time for rate limit
 * Can be called from both server and client components
 */
export async function getRateLimitStatus(
  identifier: string,
  type: RateLimitType
): Promise<RateLimitStatus> {
  try {
    const remainingTime = await getRateLimitRemainingTime(identifier, type)
    const hasActiveLimit = remainingTime > 0
    const formattedTime = formatRemainingTime(remainingTime)
    
    let message = ''
    if (hasActiveLimit) {
      switch (type) {
        case 'magic_link':
          message = `Too many magic link requests. Please wait ${formattedTime}.`
          break
        case 'password_reset':
          message = `Too many password reset requests. Please wait ${formattedTime}.`
          break
        case 'email_verification':
          message = `Too many verification email requests. Please wait ${formattedTime}.`
          break
        case 'signup':
          message = `Too many signup attempts. Please wait ${formattedTime}.`
          break
        case 'signin':
          message = `Too many signin attempts. Please wait ${formattedTime}.`
          break
      }
    } else {
      message = 'No active rate limit.'
    }

    return {
      hasActiveLimit,
      remainingTime,
      formattedTime,
      message
    }
  } catch (error) {
    console.error('Error getting rate limit status:', error)
    return {
      hasActiveLimit: false,
      remainingTime: 0,
      formattedTime: '0 minutes',
      message: 'Unable to check rate limit status.'
    }
  }
}

/**
 * Enhanced Server Action: Get remaining time for rate limit with IP detection
 * Automatically detects IP and uses it for rate limiting if available
 */
export async function getRateLimitStatusEnhanced(
  email: string,
  type: RateLimitType,
  request: import('next/server').NextRequest | null = null
): Promise<RateLimitStatus> {
  try {
    const { checkRateLimitEnhanced } = await import('@/lib/auth/rate-limit-helpers')
    
    const result = await checkRateLimitEnhanced(email, type, {
      incrementOnCheck: false
    })
    
    const hasActiveLimit = !result.allowed
    const remainingTime = result.resetTime
    const formattedTime = formatRemainingTime(remainingTime)
    
    let message = ''
    if (hasActiveLimit) {
      switch (type) {
        case 'magic_link':
          message = `Too many magic link requests. Please wait ${formattedTime}.`
          break
        case 'password_reset':
          message = `Too many password reset requests. Please wait ${formattedTime}.`
          break
        case 'email_verification':
          message = `Too many verification email requests. Please wait ${formattedTime}.`
          break
        case 'signup':
          message = `Too many signup attempts. Please wait ${formattedTime}.`
          break
        case 'signin':
          message = `Too many signin attempts. Please wait ${formattedTime}.`
          break
      }
    } else {
      message = 'No active rate limit.'
    }

    return {
      hasActiveLimit,
      remainingTime,
      formattedTime,
      message
    }
  } catch (error) {
    console.error('Error getting enhanced rate limit status:', error)
    return {
      hasActiveLimit: false,
      remainingTime: 0,
      formattedTime: '0 minutes',
      message: 'Unable to check rate limit status.'
    }
  }
}

/**
 * Server Action: Get formatted remaining time only  
 * Lightweight version for quick checks
 */
export async function getFormattedRemainingTime(
  identifier: string,
  type: RateLimitType
): Promise<string> {
  try {
    const remainingTime = await getRateLimitRemainingTime(identifier, type)
    return formatRemainingTime(remainingTime)
  } catch (error) {
    console.error('Error getting formatted remaining time:', error)
    return '0 minutes'
  }
}

/**
 * Server Action: Check if rate limited (boolean only)
 * Most efficient for simple checks
 */
export async function isRateLimited(
  identifier: string,
  type: RateLimitType
): Promise<boolean> {
  try {
    const remainingTime = await getRateLimitRemainingTime(identifier, type)
    return remainingTime > 0
  } catch (error) {
    console.error('Error checking rate limit:', error)
    return false
  }
}

// NOTE: clearRateLimitForUser removed - rate limit system has automatic window management
// Manual clearing is unnecessary and creates security vulnerabilities

/**
 * Server Action: Increment rate limit attempt after failed operation
 * Should be called after failed email operations (magic link, password reset, etc.)
 */
export async function incrementRateLimitAttempt(
  identifier: string,
  type: RateLimitType
): Promise<{ success: boolean; message: string }> {
  try {
    const { checkRateLimit } = await import('@/lib/auth/rate-limit-helpers')
    
    await checkRateLimit({
      identifier,
      type,
      incrementOnCheck: true,
      requireUserExists: false
    })
    
    console.log(`[Rate Limit] 🔄 Incremented rate limit for ${identifier} (${type})`)
    
    return {
      success: true,
      message: `Rate limit attempt incremented for ${type}`
    }
  } catch (error) {
    console.error('Error incrementing rate limit attempt:', error)
    return {
      success: false,
      message: 'Failed to increment rate limit attempt'
    }
  }
}
