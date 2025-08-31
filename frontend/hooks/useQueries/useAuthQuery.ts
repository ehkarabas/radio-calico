import { useMutation } from '@tanstack/react-query'
import { signOut } from 'next-auth/react'

/**
 * Sign out mutation hook
 * Uses NextAuth.js signOut function with redirect option
 */
export function useSignOutMutation() {
  return useMutation({
    mutationFn: async () => {
      // NextAuth.js signOut with redirect to /auth
      await signOut({ 
        redirect: false, // We handle redirect manually
        callbackUrl: '/auth'
      })
    },
    onError: (error) => {
      console.error('Sign out error:', error)
    }
  })
}