/**
 * Radio Calico - Application Constants
 * Centralized configuration for project name, URLs, and other constants
 */

export const PROJECT_CONFIG = {
  NEXT_PUBLIC_PROJECT_NAME: process.env.NEXT_PUBLIC_PROJECT_NAME || 'project',
  NEXT_PUBLIC_PROJECT_URL: process.env.NEXT_PUBLIC_PROJECT_URL || 'http://localhost:3000',
  NEXT_PUBLIC_USER_EMAIL_CHANGE_TEMP_DISABLE_DURATION : process.env.NEXT_PUBLIC_USER_EMAIL_CHANGE_TEMP_DISABLE_DURATION || 3600000,
} as const

export const { NEXT_PUBLIC_PROJECT_NAME, NEXT_PUBLIC_PROJECT_URL, NEXT_PUBLIC_USER_EMAIL_CHANGE_TEMP_DISABLE_DURATION } = PROJECT_CONFIG

// Export for backward compatibility
export default PROJECT_CONFIG