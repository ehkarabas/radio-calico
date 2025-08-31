// User deletion cleanup utilities
// Handles cleanup of related data when user is soft/hard deleted

import prisma from '@/lib/prisma/prisma'
import { Prisma } from '@prisma/client'
import { AUTH_TIMING } from '@/lib/auth/rate-limit-config'

/**
 * Clean up all user-related data when user is soft deleted (deletedAt set)
 * This function should be called when a user's deletedAt field is set
 */
export async function cleanupSoftDeletedUser(userEmail: string) {
  try {
    // Start transaction to ensure atomicity
    await prisma.$transaction(async (tx: any) => {
      // 1. Hard delete AuthRateLimit records by email (identifier)
      await tx.authRateLimit.deleteMany({
        where: {
          identifier: userEmail
        }
      })

      // 2. Hard delete SignupActivation records by email
      await tx.signupActivation.deleteMany({
        where: {
          email: userEmail
        }
      })

      // 3. Hard delete VerificationToken records by email (identifier)
      await tx.verificationToken.deleteMany({
        where: {
          identifier: userEmail
        }
      })

      // 4. Hard delete EmailVerification records by email
      await tx.emailVerification.deleteMany({
        where: {
          email: userEmail
        }
      })

      // 5. Hard delete MagicLink records by email
      await tx.emailVerification.deleteMany({
        where: {
          email: userEmail
        }
      })

      // 6. Find user and hard delete their Account and Session records
      const user = await tx.user.findUnique({
        where: { email: userEmail },
        select: { id: true }
      })

      if (user) {
        // Delete Account records (even though they have onDelete: Cascade, we want explicit control)
        await tx.account.deleteMany({
          where: {
            userId: user.id
          }
        })

        // Delete Session records (even though they have onDelete: Cascade, we want explicit control)
        await tx.session.deleteMany({
          where: {
            userId: user.id
          }
        })

        // Delete PasswordReset records (even though they have onDelete: Cascade, we want explicit control)
        await tx.passwordReset.deleteMany({
          where: {
            userId: user.id
          }
        })

        // Delete Authenticator records (even though they have onDelete: Cascade, we want explicit control)
        await tx.authenticator.deleteMany({
          where: {
            userId: user.id
          }
        })
      }
    })

    console.log(`Successfully cleaned up soft deleted user data for: ${userEmail}`)
  } catch (error) {
    console.error('Failed to cleanup soft deleted user:', error)
    throw error
  }
}

/**
 * Clean up all user-related data when user is hard deleted
 * This function should be called when a user record is completely removed
 */
export async function cleanupHardDeletedUser(userEmail: string) {
  try {
    // For hard delete, we do the same cleanup as soft delete
    // The User record itself will be deleted by the calling function
    await cleanupSoftDeletedUser(userEmail)

    console.log(`Successfully cleaned up hard deleted user data for: ${userEmail}`)
  } catch (error) {
    console.error('Failed to cleanup hard deleted user:', error)
    throw error
  }
}

/**
 * Soft delete a user and clean up related data
 */
export async function softDeleteUser(userEmail: string) {
  try {
    await prisma.$transaction(async (tx: any) => {
      // 1. Set deletedAt for the user
      await tx.user.update({
        where: { email: userEmail },
        data: { deletedAt: new Date() }
      })

      // 2. Clean up related data
      await cleanupSoftDeletedUser(userEmail)
    })

    console.log(`Successfully soft deleted user: ${userEmail}`)
  } catch (error) {
    console.error('Failed to soft delete user:', error)
    throw error
  }
}

/**
 * Hard delete a user and clean up all related data
 */
export async function hardDeleteUser(userEmail: string) {
  try {
    await prisma.$transaction(async (tx: any) => {
      // 1. Clean up related data first
      await cleanupHardDeletedUser(userEmail)

      // 2. Hard delete the user record itself
      // Note: Account, Session, PasswordReset, Authenticator will be cascade deleted
      // but we already cleaned them up explicitly above
      await tx.user.delete({
        where: { email: userEmail }
      })
    })

    console.log(`Successfully hard deleted user: ${userEmail}`)
  } catch (error) {
    console.error('Failed to hard delete user:', error)
    throw error
  }
}

/**
 * Clean up expired or unused auth-related records
 * This can be called periodically to clean up old data
 */
export async function cleanupExpiredAuthData() {
  try {
    const now = new Date()

    await prisma.$transaction(async (tx: any) => {
      // Clean up expired VerificationTokens
      await tx.verificationToken.deleteMany({
        where: {
          expires: {
            lt: now
          }
        }
      })

      // Clean up expired EmailVerifications
      await tx.emailVerification.deleteMany({
        where: {
          expires: {
            lt: now
          }
        }
      })

      // Clean up expired SignupActivations
      await tx.signupActivation.deleteMany({
        where: {
          expires: {
            lt: now
          }
        }
      })

      // Clean up expired MagicLinks
      await tx.emailVerification.deleteMany({
        where: {
          expires: {
            lt: now
          }
        }
      })

      // Clean up used PasswordResets older than configured window
      await tx.passwordReset.deleteMany({
        where: {
          used: true,
          updatedAt: {
            lt: new Date(Date.now() - AUTH_TIMING.DATA_CLEANUP_WINDOW) // Configurable cleanup window
          }
        }
      })
    })

    console.log('Successfully cleaned up expired auth data')
  } catch (error) {
    console.error('Failed to cleanup expired auth data:', error)
    throw error
  }
}