// Test script to initialize Prisma Accelerate connection
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client'
import { withAccelerate } from '@prisma/extension-accelerate'

// Load environment variables
dotenv.config({ path: '.env.local' })
console.log('🔧 Environment loaded, DATABASE_URL exists:', !!process.env.DATABASE_URL)

const prisma = new PrismaClient().$extends(withAccelerate())

async function testAccelerateConnection() {
  console.log('🚀 Testing Prisma Accelerate connection...')
  
  try {
    // Basit bir connection test query'si
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Accelerate connection successful!')
    console.log('📊 Test result:', result)
    
    // Eğer User table'ı varsa, onu da test edelim
    try {
      const userCount = await prisma.user.count()
      console.log('👥 User count:', userCount)
    } catch (userError) {
      console.log('⚠️  User table not found (normal for fresh setup)')
    }
    
  } catch (error) {
    console.error('❌ Accelerate connection failed:')
    console.error(error.message)
  } finally {
    await prisma.$disconnect()
    console.log('🔌 Connection closed')
  }
}

testAccelerateConnection()