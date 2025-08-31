"use client"

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'
import { Loader2, Send, Mail } from 'lucide-react'
import { RateLimitFeedback } from '@/components/ui/rate-limit-feedback'

// Validation schemas
const publicContactSchema = z.object({
  fullName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
})

const authenticatedContactSchema = z.object({
  message: z.string().min(10, 'Message must be at least 10 characters').max(1000, 'Message must be less than 1000 characters'),
})

type PublicContactFormData = z.infer<typeof publicContactSchema>
type AuthenticatedContactFormData = z.infer<typeof authenticatedContactSchema>

interface ContactFormProps {
  isAuthenticated?: boolean
  userDisplayName?: string
  userEmail?: string
  onSuccess?: () => void
}

export function ContactForm({ 
  isAuthenticated = false, 
  userDisplayName,
  userEmail,
  onSuccess 
}: ContactFormProps) {
  const [loading, setLoading] = useState(false)
  
  // Rate limiting states
  const [publicRateLimit, setPublicRateLimit] = useState({ isLimited: false, remainingTime: 0 })
  const [authRateLimit, setAuthRateLimit] = useState({ isLimited: false, remainingTime: 0 })
  
  // Countdown timers for real-time rate limit display
  const [publicCountdownTime, setPublicCountdownTime] = useState(0)
  const [authCountdownTime, setAuthCountdownTime] = useState(0)
  
  // Form data states
  const [publicFormData, setPublicFormData] = useState<PublicContactFormData>({
    fullName: '',
    email: '',
    message: ''
  })
  
  const [authFormData, setAuthFormData] = useState<AuthenticatedContactFormData>({
    message: ''
  })
  
  // Error states
  const [publicErrors, setPublicErrors] = useState<Partial<Record<keyof PublicContactFormData, string>>>({})
  const [authErrors, setAuthErrors] = useState<Partial<Record<keyof AuthenticatedContactFormData, string>>>({})

  // Note: Countdown timer logic moved to RateLimitFeedback component 
  // with callback to sync parent state when countdown expires



  // Validation functions
  const validatePublicField = (fieldName: keyof PublicContactFormData, value: string) => {
    try {
      if (fieldName === 'fullName') {
        publicContactSchema.shape.fullName.parse(value)
      } else if (fieldName === 'email') {
        publicContactSchema.shape.email.parse(value)
      } else if (fieldName === 'message') {
        publicContactSchema.shape.message.parse(value)
      }
      
      setPublicErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setPublicErrors(prev => ({
          ...prev,
          [fieldName]: error.issues[0].message
        }))
      }
    }
  }

  const validateAuthField = (fieldName: keyof AuthenticatedContactFormData, value: string) => {
    try {
      if (fieldName === 'message') {
        authenticatedContactSchema.shape.message.parse(value)
      }
      
      setAuthErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[fieldName]
        return newErrors
      })
    } catch (error) {
      if (error instanceof z.ZodError) {
        setAuthErrors(prev => ({
          ...prev,
          [fieldName]: error.issues[0].message
        }))
      }
    }
  }

  // Submit handlers
  const handlePublicSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      console.log('[Contact Form] 🚀 === PUBLIC SUBMIT DEBUG START ===')
      console.log('[Contact Form] Form data:', publicFormData)
      
      const validatedData = publicContactSchema.parse(publicFormData)
      console.log('[Contact Form] Validation passed:', validatedData)
      
      setLoading(true)

      // Loading toast
      toast.loading('Sending your message...', { id: 'contact-submit' })

      console.log('[Contact Form] 📡 Making API request to /api/auth/contact')
      const response = await fetch('/api/auth/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      console.log('[Contact Form] 📨 Response received:', {
        status: response.status,
        statusText: response.statusText,
        ok: response.ok
      })

      const result = await response.json()
      console.log('[Contact Form] Response data:', result)

      if (response.ok) {
        toast.success('Message sent successfully!', {
          id: 'contact-submit',
          description: 'Thank you for your message. We\'ll get back to you soon!',
        })
        
        // Reset rate limit state on success
        setPublicRateLimit({ isLimited: false, remainingTime: 0 })
        setPublicCountdownTime(0)
        
        // Reset form
        setPublicFormData({ fullName: '', email: '', message: '' })
        setPublicErrors({})
        
        onSuccess?.()
      } else if (response.status === 429) {
        // Rate limit exceeded - use resetTime if available (milliseconds), otherwise retryAfter (seconds)
        // Handle negative values with fallback
        let retryAfterMs = result.resetTime || (result.retryAfter ? result.retryAfter * 1000 : 45 * 1000)
        if (retryAfterMs < 0) {
          console.log('[Contact Form] Negative retryAfter detected, using fallback:', retryAfterMs)
          retryAfterMs = 45 * 1000 // 45 second fallback for negative values
        }
        
        console.log('[Contact Form] 🚨 429 Rate limit triggered:', {
          retryAfterMs,
          resultResetTime: result.resetTime,
          resultRetryAfter: result.retryAfter
        })
        
        setPublicCountdownTime(retryAfterMs) // Start countdown timer FIRST
        setPublicRateLimit({ isLimited: true, remainingTime: retryAfterMs })
        
        console.log('[Contact Form] 🚨 Rate limit state set:', {
          countdownTime: retryAfterMs,
          isLimited: true
        })
        
        toast.error('Too many requests', {
          id: 'contact-submit',
          description: result.error || 'Please wait before sending another message.',
        })
      } else {
        toast.error('Failed to send message', {
          id: 'contact-submit',
          description: result.error || 'An error occurred while sending your message.',
        })
      }
    } catch (error) {
      console.error('[Contact Form] ❌ Error caught in PUBLIC SUBMIT:', error)
      console.error('[Contact Form] Error type:', typeof error)
      console.error('[Contact Form] Error constructor:', error?.constructor?.name)
      
      if (error instanceof Error) {
        console.error('[Contact Form] Error message:', error.message)
        console.error('[Contact Form] Error stack:', error.stack)
      }
      
      if (error instanceof z.ZodError) {
        // Set all validation errors
        const newErrors: Partial<Record<keyof PublicContactFormData, string>> = {}
        error.issues.forEach((issue) => {
          const field = issue.path[0] as keyof PublicContactFormData
          newErrors[field] = issue.message
        })
        setPublicErrors(newErrors)
        
        toast.error('Please check your inputs', {
          id: 'contact-submit',
          description: 'Please fix the validation errors and try again.',
        })
      } else {
        toast.error('Something went wrong', {
          id: 'contact-submit',
          description: 'Please try again or contact support if the problem persists.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      const validatedData = authenticatedContactSchema.parse(authFormData)
      setLoading(true)

      // Loading toast
      toast.loading('Sending your message...', { id: 'auth-contact-submit' })

      const response = await fetch('/api/profile/contact', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validatedData),
      })

      const result = await response.json()

      if (response.ok) {
        toast.success('Message sent successfully!', {
          id: 'auth-contact-submit',
          description: 'Thank you for your message. We\'ll get back to you soon!',
        })
        
        // Reset rate limit state on success
        setAuthRateLimit({ isLimited: false, remainingTime: 0 })
        setAuthCountdownTime(0)
        
        // Reset form
        setAuthFormData({ message: '' })
        setAuthErrors({})
        
        onSuccess?.()
      } else if (response.status === 429) {
        // Rate limit exceeded - use resetTime if available (milliseconds), otherwise retryAfter (seconds)
        // Handle negative values with fallback
        let retryAfterMs = result.resetTime || (result.retryAfter ? result.retryAfter * 1000 : 45 * 1000)
        if (retryAfterMs < 0) {
          console.log('[Contact Form] Negative retryAfter detected, using fallback:', retryAfterMs)
          retryAfterMs = 45 * 1000 // 45 second fallback for negative values
        }
        
        console.log('[Contact Form AUTH] 🚨 429 Rate limit triggered:', {
          retryAfterMs,
          resultResetTime: result.resetTime,
          resultRetryAfter: result.retryAfter
        })
        
        setAuthCountdownTime(retryAfterMs) // Start countdown timer FIRST
        setAuthRateLimit({ isLimited: true, remainingTime: retryAfterMs })
        
        console.log('[Contact Form AUTH] 🚨 Rate limit state set:', {
          countdownTime: retryAfterMs,
          isLimited: true
        })
        
        toast.error('Too many requests', {
          id: 'auth-contact-submit',
          description: result.error || 'Please wait before sending another message.',
        })
      } else {
        toast.error('Failed to send message', {
          id: 'auth-contact-submit',
          description: result.error || 'An error occurred while sending your message.',
        })
      }
    } catch (error) {
      if (error instanceof z.ZodError) {
        setAuthErrors({
          message: error.issues[0].message
        })
        
        toast.error('Please check your message', {
          id: 'auth-contact-submit',
          description: error.issues[0].message,
        })
      } else {
        toast.error('Something went wrong', {
          id: 'auth-contact-submit',
          description: 'Please try again or contact support if the problem persists.',
        })
      }
    } finally {
      setLoading(false)
    }
  }

  if (isAuthenticated) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-4"
      >
        <div className="text-center space-y-2 mb-6">
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
              <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
            </div>
          </div>
          {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Contact Support
          </h3> */}
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Sending as: <strong>{userDisplayName}</strong> ({userEmail})
          </p>
        </div>

        <form onSubmit={handleAuthSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="auth-message" className="text-foreground">
              Message <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="auth-message"
              placeholder="Tell us how we can help you..."
              value={authFormData.message}
              onChange={(e) => setAuthFormData({ message: e.target.value })}
              onBlur={(e) => validateAuthField('message', e.target.value)}
              className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-y"
              maxLength={1000}
              required
              disabled={loading}
            />
            <div className="flex justify-between items-center">
              {authErrors.message && (
                <p className="text-sm text-red-500">{authErrors.message}</p>
              )}
              <div className="ml-auto">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  {authFormData.message.length}/1000
                </p>
              </div>
            </div>
          </div>

          <RateLimitFeedback
            isRateLimited={authRateLimit.isLimited}
            remainingTime={authCountdownTime}
            type="contact"
            email={userEmail}
            contactEndpoint="authenticated"
            onRateLimitExpired={() => {
              setAuthRateLimit({ isLimited: false, remainingTime: 0 })
              setAuthCountdownTime(0)
            }}
          />

          <Button
            type="submit"
            disabled={loading || authRateLimit.isLimited}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 cursor-pointer"
          >
            {loading ? (
              <div className="flex items-center">
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Sending message...
              </div>
            ) : (
              <div className="flex items-center justify-center">
                <Send className="w-4 h-4 mr-2" />
                Send Message
              </div>
            )}
          </Button>
        </form>
      </motion.div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-4"
    >
      <div className="text-center space-y-2 mb-6">
        <div className="flex items-center justify-center mb-4">
          <div className="p-3 bg-orange-100 dark:bg-orange-900/20 rounded-full">
            <Mail className="w-6 h-6 text-orange-600 dark:text-orange-400" />
          </div>
        </div>
        {/* <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Contact Us
        </h3> */}
        <p className="text-sm text-gray-600 dark:text-gray-400">
          Have a question? We'd love to hear from you.
        </p>
      </div>

      <form onSubmit={handlePublicSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="contact-fullName" className="text-foreground">
            Full Name <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-fullName"
            type="text"
            placeholder="Enter your full name"
            value={publicFormData.fullName}
            onChange={(e) => setPublicFormData({ ...publicFormData, fullName: e.target.value })}
            onBlur={(e) => validatePublicField('fullName', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            required
            disabled={loading}
          />
          {publicErrors.fullName && (
            <p className="text-sm text-red-500">{publicErrors.fullName}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-email" className="text-foreground">
            Email <span className="text-red-500">*</span>
          </Label>
          <Input
            id="contact-email"
            type="email"
            placeholder="Enter your email address"
            value={publicFormData.email}
            onChange={(e) => setPublicFormData({ ...publicFormData, email: e.target.value })}
            onBlur={(e) => validatePublicField('email', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground"
            required
            disabled={loading}
          />
          {publicErrors.email && (
            <p className="text-sm text-red-500">{publicErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="contact-message" className="text-foreground">
            Message <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="contact-message"
            placeholder="Tell us how we can help you..."
            value={publicFormData.message}
            onChange={(e) => setPublicFormData({ ...publicFormData, message: e.target.value })}
            onBlur={(e) => validatePublicField('message', e.target.value)}
            className="bg-secondary border-border text-foreground placeholder:text-muted-foreground min-h-[120px] resize-y"
            maxLength={1000}
            required
            disabled={loading}
          />
          <div className="flex justify-between items-center">
            {publicErrors.message && (
              <p className="text-sm text-red-500">{publicErrors.message}</p>
            )}
            <div className="ml-auto">
              <p className="text-xs text-gray-500 dark:text-gray-400">
                {publicFormData.message.length}/1000
              </p>
            </div>
          </div>
        </div>

        <RateLimitFeedback
          isRateLimited={publicRateLimit.isLimited}
          remainingTime={publicCountdownTime}
          type="contact"
          email={publicFormData.email}
          contactEndpoint="public"
          onRateLimitExpired={() => {
            setPublicRateLimit({ isLimited: false, remainingTime: 0 })
            setPublicCountdownTime(0)
          }}
        />

        <Button
          type="submit"
          disabled={loading || publicRateLimit.isLimited}
          className="w-full bg-orange-600 hover:bg-orange-700 text-white transition-colors duration-200 cursor-pointer"
        >
          {loading ? (
            <div className="flex items-center">
              <Loader2 className="animate-spin h-4 w-4 mr-2" />
              Sending message...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <Send className="w-4 h-4 mr-2" />
              Send Message
            </div>
          )}
        </Button>
      </form>
    </motion.div>
  )
}