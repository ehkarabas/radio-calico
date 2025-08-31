// Migration script for Prisma Accelerate database
import dotenv from 'dotenv'
import { exec } from 'child_process'

// Load environment variables
dotenv.config({ path: '.env.local' })

console.log('🔧 Environment loaded')
console.log('🔗 DATABASE_URL:', process.env.DATABASE_URL ? 'SET' : 'NOT SET')

// Set environment and run migration
process.env.DATABASE_URL = process.env.DATABASE_URL

const migrationCommand = 'npx prisma migrate dev --name "initial-nextauth-schema"'

console.log('🚀 Running migration:', migrationCommand)

exec(migrationCommand, { env: process.env }, (error, stdout, stderr) => {
  if (error) {
    console.error('❌ Migration failed:', error.message)
    return
  }
  if (stderr) {
    console.error('⚠️  Migration warnings:', stderr)
  }
  console.log('✅ Migration output:', stdout)
})