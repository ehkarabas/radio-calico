import prisma from '@/lib/prisma/prisma'

/**
 * Service for handling user deletion and AuthRateLimit cleanup
 * Tests the automatic cleanup functionality when users are soft/hard deleted
 */

export interface TestResult {
  success: boolean
  message: string
  details?: any
}

export class UserDeleteCleanupService {
  
  /**
   * Create test data - user and related AuthRateLimit entries
   */
  static async createTestData(email: string): Promise<{ userId: string, identifier: string }> {
    // Test user oluştur
    const user = await prisma.user.create({
      data: {
        name: 'Test User for Cleanup',
        email: email,
        activated: true,
      }
    })
    
    // Test AuthRateLimit entries oluştur
    const identifier = `email_${email}`
    
    await prisma.authRateLimit.createMany({
      data: [
        {
          identifier,
          type: 'email_verification',
          attempts: 3,
          blocked: false,
        },
        {
          identifier,
          type: 'password_reset', 
          attempts: 2,
          blocked: false,
        },
        {
          identifier,
          type: 'signup',
          attempts: 1,
          blocked: true,
          blockedUntil: new Date(Date.now() + 3600000), // 1 hour
        }
      ]
    })
    
    return { userId: user.id, identifier }
  }
  
  /**
   * Check how many AuthRateLimit entries exist for an identifier
   */
  static async checkAuthRateLimitCount(identifier: string): Promise<number> {
    const count = await prisma.authRateLimit.count({
      where: { identifier }
    })
    
    return count
  }
  
  /**
   * Test user soft delete - should trigger automatic AuthRateLimit cleanup
   */
  static async testUserSoftDelete(email: string): Promise<TestResult> {
    try {
      // 1. Setup test data
      const { userId, identifier } = await this.createTestData(email)
      
      // 2. Verify test data created
      const beforeCount = await this.checkAuthRateLimitCount(identifier)
      if (beforeCount !== 3) {
        throw new Error(`Expected 3 AuthRateLimit entries, found ${beforeCount}`)
      }
      
      // 3. Perform soft delete (this should trigger our extension automatically)
      await prisma.user.update({
        where: { id: userId },
        data: { deletedAt: new Date() }
      })
      
      // 4. Check if AuthRateLimit entries were automatically cleaned up
      const afterCount = await this.checkAuthRateLimitCount(identifier)
      
      // 5. Cleanup test user
      await prisma.user.delete({
        where: { id: userId }
      })
      
      return {
        success: afterCount === 0,
        message: afterCount === 0 
          ? 'Soft delete cleanup successful' 
          : `Soft delete cleanup failed - ${afterCount} entries remain`,
        details: { beforeCount, afterCount, identifier }
      }
      
    } catch (error) {
      return {
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      }
    }
  }
  
  /**
   * Test user hard delete - should trigger automatic AuthRateLimit cleanup
   */
  static async testUserHardDelete(email: string): Promise<TestResult> {
    try {
      // 1. Setup test data
      const { userId, identifier } = await this.createTestData(email)
      
      // 2. Verify test data created
      const beforeCount = await this.checkAuthRateLimitCount(identifier)
      if (beforeCount !== 3) {
        throw new Error(`Expected 3 AuthRateLimit entries, found ${beforeCount}`)
      }
      
      // 3. Perform hard delete (this should trigger our extension automatically)
      await prisma.user.delete({
        where: { id: userId }
      })
      
      // 4. Check if AuthRateLimit entries were automatically cleaned up
      const afterCount = await this.checkAuthRateLimitCount(identifier)
      
      return {
        success: afterCount === 0,
        message: afterCount === 0 
          ? 'Hard delete cleanup successful' 
          : `Hard delete cleanup failed - ${afterCount} entries remain`,
        details: { beforeCount, afterCount, identifier }
      }
      
    } catch (error) {
      return {
        success: false,
        message: `Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
        details: { error }
      }
    }
  }
  
  /**
   * Manual cleanup - remove test data that might be left behind
   */
  static async manualCleanup(email: string): Promise<void> {
    const identifier = `email_${email}`
    
    // Remove user if exists
    try {
      await prisma.user.deleteMany({
        where: { email }
      })
    } catch (error) {
      // Ignore if user doesn't exist
    }
    
    // Remove AuthRateLimit entries
    await prisma.authRateLimit.deleteMany({
      where: { identifier }
    })
  }
  
  /**
   * Run comprehensive test suite
   */
  static async runAllTests(): Promise<{
    softDeleteResult: TestResult
    hardDeleteResult: TestResult
    overallSuccess: boolean
  }> {
    const timestamp = Date.now()
    const softDeleteEmail = `test-soft-${timestamp}@cleanup-test.com`
    const hardDeleteEmail = `test-hard-${timestamp}@cleanup-test.com`
    
    try {
      // Test 1: Soft delete
      const softDeleteResult = await this.testUserSoftDelete(softDeleteEmail)
      
      // Test 2: Hard delete  
      const hardDeleteResult = await this.testUserHardDelete(hardDeleteEmail)
      
      // Cleanup any remaining test data
      await this.manualCleanup(softDeleteEmail)
      await this.manualCleanup(hardDeleteEmail)
      
      return {
        softDeleteResult,
        hardDeleteResult,
        overallSuccess: softDeleteResult.success && hardDeleteResult.success
      }
      
    } catch (error) {
      // Cleanup on error
      await this.manualCleanup(softDeleteEmail)
      await this.manualCleanup(hardDeleteEmail)
      
      throw error
    }
  }
}