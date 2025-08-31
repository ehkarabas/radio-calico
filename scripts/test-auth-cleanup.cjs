// Node.js script to test AuthRateLimit cleanup functionality
// Bu script frontend/lib/utils/test-auth-rate-limit-cleanup.ts'deki logic'i test eder

const { PrismaClient } = require('@prisma/client')

// Prisma client'ı frontend/lib/prisma/prisma.ts'deki middleware ile oluştur
const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL
    }
  },
  log: ['error', 'warn'],
  errorFormat: 'minimal',
})

// Middleware: User delete olduğunda AuthRateLimit'den email_User.email identifier'larını temizle
prisma.$use(async (params, next) => {
  // User soft delete (update ile deletedAt set ediliyor)
  if (params.model === 'User' && params.action === 'update') {
    const result = await next(params)
    
    // Eğer deletedAt field'ı set edildiyse (soft delete)
    if (params.args?.data?.deletedAt) {
      const userEmail = result.email
      if (userEmail) {
        // email_User.email pattern'ındaki identifier'ları hard delete et
        const identifier = `email_${userEmail}`
        await prisma.authRateLimit.deleteMany({
          where: {
            identifier: identifier
          }
        })
        console.log(`✅ AuthRateLimit cleanup: Removed entries for identifier: ${identifier}`)
      }
    }
    
    return result
  }
  
  // User hard delete (delete action)
  if (params.model === 'User' && params.action === 'delete') {
    // Önce user'ı getir (email için)
    const user = await prisma.user.findUnique({
      where: params.args.where,
      select: { email: true }
    })
    
    const result = await next(params)
    
    // User delete edildikten sonra AuthRateLimit cleanup
    if (user?.email) {
      const identifier = `email_${user.email}`
      await prisma.authRateLimit.deleteMany({
        where: {
          identifier: identifier
        }
      })
      console.log(`✅ AuthRateLimit cleanup: Removed entries for identifier: ${identifier}`)
    }
    
    return result
  }
  
  return next(params)
})

// Test functions
async function setupTestData(email) {
  console.log(`\n🔧 Setting up test data for email: ${email}`)
  
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
  
  console.log(`✅ Created user with ID: ${user.id}`)
  console.log(`✅ Created 3 AuthRateLimit entries with identifier: ${identifier}`)
  
  return { userId: user.id, identifier }
}

async function checkAuthRateLimitEntries(identifier) {
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
  
  console.log(`📊 Found ${entries.length} AuthRateLimit entries for identifier: ${identifier}`)
  entries.forEach(entry => {
    console.log(`   - ID: ${entry.id}, Type: ${entry.type}, Attempts: ${entry.attempts}, Blocked: ${entry.blocked}`)
  })
  
  return entries
}

async function testUserSoftDelete(userId, identifier) {
  console.log('\n🧪 === Testing User Soft Delete ===')
  
  console.log('📋 Before soft delete:')
  await checkAuthRateLimitEntries(identifier)
  
  // User soft delete (deletedAt set et)
  await prisma.user.update({
    where: { id: userId },
    data: { deletedAt: new Date() }
  })
  
  console.log('✅ User soft deleted successfully')
  
  console.log('📋 After soft delete:')
  const remainingEntries = await checkAuthRateLimitEntries(identifier)
  
  return remainingEntries.length === 0
}

async function testUserHardDelete(userId, identifier) {
  console.log('\n🧪 === Testing User Hard Delete ===')
  
  console.log('📋 Before hard delete:')
  await checkAuthRateLimitEntries(identifier)
  
  // User hard delete
  await prisma.user.delete({
    where: { id: userId }
  })
  
  console.log('✅ User hard deleted successfully')
  
  console.log('📋 After hard delete:')
  const remainingEntries = await checkAuthRateLimitEntries(identifier)
  
  return remainingEntries.length === 0
}

async function cleanupTestData(email) {
  const identifier = `email_${email}`
  
  try {
    const user = await prisma.user.findUnique({
      where: { email }
    })
    
    if (user) {
      await prisma.user.delete({
        where: { id: user.id }
      })
    }
  } catch (error) {
    // User already deleted, ignore
  }
  
  await prisma.authRateLimit.deleteMany({
    where: { identifier }
  })
  
  console.log(`🧹 Cleanup completed for email: ${email}`)
}

async function runFullTest() {
  const testEmail1 = `test-soft-${Date.now()}@example.com`
  const testEmail2 = `test-hard-${Date.now()}@example.com`
  
  try {
    console.log('🚀 Starting AuthRateLimit cleanup test...\n')
    
    // 1. Test soft delete
    const { userId: userId1, identifier: identifier1 } = await setupTestData(testEmail1)
    const softDeleteSuccess = await testUserSoftDelete(userId1, identifier1)
    console.log(`\n${softDeleteSuccess ? '✅' : '❌'} Soft delete test: ${softDeleteSuccess ? 'PASSED' : 'FAILED'}`)
    
    // 2. Test hard delete
    const { userId: userId2, identifier: identifier2 } = await setupTestData(testEmail2)
    const hardDeleteSuccess = await testUserHardDelete(userId2, identifier2)
    console.log(`\n${hardDeleteSuccess ? '✅' : '❌'} Hard delete test: ${hardDeleteSuccess ? 'PASSED' : 'FAILED'}`)
    
    // 3. Cleanup
    await cleanupTestData(testEmail1)
    await cleanupTestData(testEmail2)
    
    console.log('\n🎉 All tests completed!')
    console.log(`📊 Results: Soft Delete: ${softDeleteSuccess ? 'PASSED' : 'FAILED'}, Hard Delete: ${hardDeleteSuccess ? 'PASSED' : 'FAILED'}`)
    
    return { softDeleteSuccess, hardDeleteSuccess }
    
  } catch (error) {
    console.error('❌ Test failed:', error)
    
    await cleanupTestData(testEmail1)
    await cleanupTestData(testEmail2)
    
    throw error
  } finally {
    await prisma.$disconnect()
  }
}

// Run test
runFullTest()
  .then((results) => {
    console.log('\n🏁 Test completed successfully!')
    process.exit(results.softDeleteSuccess && results.hardDeleteSuccess ? 0 : 1)
  })
  .catch((error) => {
    console.error('💥 Test failed with error:', error)
    process.exit(1)
  })