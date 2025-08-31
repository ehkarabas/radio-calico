// Example usage of user cleanup utilities
// Bu dosya sadece örnek kullanım içindir, production'da silinebilir

import { 
  softDeleteUser, 
  hardDeleteUser, 
  cleanupSoftDeletedUser, 
  cleanupHardDeletedUser,
  cleanupExpiredAuthData 
} from './user-cleanup'

// Example usage scenarios:

/**
 * Scenario 1: User requests account deletion (soft delete)
 * Used in profile settings page
 */
export async function handleUserAccountDeactivation(userEmail: string) {
  try {
    await softDeleteUser(userEmail)
    // Redirect user to auth page with deactivation message
    return { success: true, message: 'Account successfully deactivated' }
  } catch (error) {
    console.error('Failed to deactivate account:', error)
    return { success: false, message: 'Failed to deactivate account' }
  }
}

/**
 * Scenario 2: Admin hard deletes user (GDPR compliance)
 * Used in admin panel or GDPR data deletion requests
 */
export async function handleUserGDPRDeletion(userEmail: string) {
  try {
    await hardDeleteUser(userEmail)
    return { success: true, message: 'User data permanently deleted' }
  } catch (error) {
    console.error('Failed to delete user data:', error)
    return { success: false, message: 'Failed to delete user data' }
  }
}

/**
 * Scenario 3: Cleanup after user is already soft deleted
 * Used when you need to clean up data for already soft deleted users
 */
export async function handleExistingSoftDeletedUserCleanup(userEmail: string) {
  try {
    await cleanupSoftDeletedUser(userEmail)
    return { success: true, message: 'Cleanup completed for soft deleted user' }
  } catch (error) {
    console.error('Failed to cleanup soft deleted user:', error)
    return { success: false, message: 'Failed to cleanup user data' }
  }
}

/**
 * Scenario 4: Periodic cleanup job
 * Can be used in a cron job or scheduled task
 */
export async function runPeriodicCleanup() {
  try {
    await cleanupExpiredAuthData()
    console.log('Periodic cleanup completed successfully')
  } catch (error) {
    console.error('Periodic cleanup failed:', error)
  }
}

/**
 * API Route Example: /api/user/delete-account
 */
export async function deleteAccountApiHandler(request: Request) {
  try {
    const { email } = await request.json()
    
    if (!email) {
      return new Response('Email is required', { status: 400 })
    }

    await softDeleteUser(email)
    
    return new Response(JSON.stringify({ 
      success: true, 
      message: 'Account successfully deleted' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    })
  } catch (error) {
    console.error('Delete account API error:', error)
    return new Response(JSON.stringify({ 
      success: false, 
      message: 'Failed to delete account' 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * NextJS Server Action Example
 */
export async function deleteAccountServerAction(userEmail: string) {
  'use server'
  
  try {
    await softDeleteUser(userEmail)
    return { success: true, message: 'Account successfully deleted' }
  } catch (error) {
    console.error('Delete account server action error:', error)
    return { success: false, message: 'Failed to delete account' }
  }
}