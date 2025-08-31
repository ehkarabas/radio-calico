// Test Prisma Accelerate with real NextAuth tables
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Load environment variables
dotenv.config({ path: '.env.local' })
console.log('🔧 Environment loaded, DATABASE_URL exists:', !!process.env.DATABASE_URL)

const prisma = new PrismaClient().$extends(withAccelerate())

async function testRealTables() {
  console.log('🚀 Testing Prisma Accelerate with real NextAuth tables...')
  
  try {
    // Test real table queries
    console.log('👤 Testing User table...')
    const userCount = await prisma.user.count()
    console.log('✅ Users count:', userCount)
    
    console.log('🔑 Testing Account table...')
    const accountCount = await prisma.account.count()
    console.log('✅ Accounts count:', accountCount)
    
    console.log('🎫 Testing Session table...')
    const sessionCount = await prisma.session.count()
    console.log('✅ Sessions count:', sessionCount)
    
    console.log('🔐 Testing VerificationToken table...')
    const verificationCount = await prisma.verificationToken.count()
    console.log('✅ VerificationTokens count:', verificationCount)
    
    // Test cache strategy if supported
    console.log('📊 Testing cache strategy...')
    const usersWithCache = await prisma.user.findMany({
      cacheStrategy: { ttl: 60 } // 60 second cache
    })
    console.log('✅ Cached query result:', usersWithCache.length, 'users')
    
    console.log('🎉 ALL TESTS PASSED! Accelerate is fully active!')
    
  } catch (error) {
    console.error('❌ Test failed:')
    console.error(error.message)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Connection closed')
  }
}

testRealTables()