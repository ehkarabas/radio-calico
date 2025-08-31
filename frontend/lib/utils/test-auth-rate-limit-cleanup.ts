import prisma from '@/lib/prisma/prisma'

/**
 * Test utility untuk AuthRateLimit cleanup functionality
 * User soft/hard delete olduğunda email_User.email identifier'ların temizlenmesini test eder
 */

// Test için örnek data oluştur
export async function setupTestData(email: string) {
  console.log(`Setting up test data for email: ${email}`)
  
  // Test user oluştur
  const user = await prisma.user.create({
    data: {
      name: 'Test User',
      email: email,
      activated: true,
    }
  })
  
  // Test AuthRateLimit entries oluştur
  const identifier = `email_${email}`
  
  // Çeşitli rate limit types ile test data
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
  
  console.log(`Created user with ID: ${user.id}`)
  console.log(`Created 3 AuthRateLimit entries with identifier: ${identifier}`)
  
  return { userId: user.id, identifier }
}

// AuthRateLimit entries'leri kontrol et
export async function checkAuthRateLimitEntries(identifier: string) {
  const entries = await prisma.authRateLimit.findMany({
    where: { identifier },
    select: {
      id: true,
      identifier: true,
      type: true,
      attempts: true,
      blocked: true,
    }
  })
  
  console.log(`Found ${entries.length} AuthRateLimit entries for identifier: ${identifier}`)
  entries.forEach((entry: any) => {
    console.log(`- ID: ${entry.id}, Type: ${entry.type}, Attempts: ${entry.attempts}, Blocked: ${entry.blocked}`)
  })
  
  return entries
}

// Test: User soft delete
export async function testUserSoftDelete(userId: string, identifier: string) {
  console.log('\n=== Testing User Soft Delete ===')
  
  // Soft delete öncesi kontrol
  console.log('Before soft delete:')
  await checkAuthRateLimitEntries(identifier)
  
  // User soft delete (deletedAt set et)
  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() }
  })
  
  console.log('User soft deleted successfully')
  
  // Soft delete sonrası kontrol
  console.log('After soft delete:')
  const remainingEntries = await checkAuthRateLimitEntries(identifier)
  
  return remainingEntries.length === 0
}

// Test: User hard delete 
export async function testUserHardDelete(userId: string, identifier: string) {
  console.log('\n=== Testing User Hard Delete ===')
  
  // Hard delete öncesi kontrol
  console.log('Before hard delete:')
  await checkAuthRateLimitEntries(identifier)
  
  // User hard delete
  await prisma.user.delete({
    where: { id: userId }
  })
  
  console.log('User hard deleted successfully')
  
  // Hard delete sonrası kontrol
  console.log('After hard delete:')
  const remainingEntries = await checkAuthRateLimitEntries(identifier)
  
  return remainingEntries.length === 0
}

// Cleanup test data
export async function cleanupTestData(email: string) {
  const identifier = `email_${email}`
  
  // User'ı bul ve sil (eğer varsa)
  const user = await prisma.user.findUnique({
    where: { email }
  })
  
  if (user) {
    await prisma.user.delete({
      where: { id: user.id }
    })
  }
  
  // AuthRateLimit entries'leri temizle (eğer varsa)
  await prisma.authRateLimit.deleteMany({
    where: { identifier }
  })
  
  console.log(`Cleanup completed for email: ${email}`)
}

// Full test suite
export async function runFullTest() {
  const testEmail = `test-${Date.now()}@example.com`
  
  try {
    console.log('🧪 Starting AuthRateLimit cleanup test...\n')
    
    // 1. Test data setup
    const { userId, identifier } = await setupTestData(testEmail)
    
    // 2. Test soft delete
    const softDeleteSuccess = await testUserSoftDelete(userId, identifier)
    console.log(`✅ Soft delete test: ${softDeleteSuccess ? 'PASSED' : 'FAILED'}`)
    
    // 3. Setup data again for hard delete test
    const { userId: userId2 } = await setupTestData(testEmail + '2')
    const identifier2 = `email_${testEmail}2`
    
    // 4. Test hard delete
    const hardDeleteSuccess = await testUserHardDelete(userId2, identifier2)
    console.log(`✅ Hard delete test: ${hardDeleteSuccess ? 'PASSED' : 'FAILED'}`)
    
    // 5. Cleanup
    await cleanupTestData(testEmail)
    await cleanupTestData(testEmail + '2')
    
    console.log('\n🎉 All tests completed!')
    return { softDeleteSuccess, hardDeleteSuccess }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    
    // Cleanup on error
    await cleanupTestData(testEmail)
    await cleanupTestData(testEmail + '2')
    
    throw error
  }
}