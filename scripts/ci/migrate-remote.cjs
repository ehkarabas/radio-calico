#!/usr/bin/env node

const { spawn } = require('child_process')
const path = require('path')
const fs = require('fs')

function loadProdEnv() {
  const envPath = path.join(process.cwd(), '.env.production')
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env.production not found')
    process.exit(1)
  }
  require('dotenv').config({ path: envPath })
  if (!process.env.DATABASE_URL) {
    console.error('❌ DATABASE_URL missing')
    process.exit(1)
  }
}

function run(cmd, args) {
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, { stdio: 'inherit', shell: true })
    child.on('exit', code => code === 0 ? resolve() : reject(new Error(`${cmd} ${args.join(' ')} -> ${code}`)))
  })
}

async function main() {
  loadProdEnv()
  
  // Set environment variable for Prisma
  process.env.DATABASE_URL = process.env.DATABASE_URL
  
  console.log('🚀 Applying Prisma migrations to remote database...')
  await run('npx', ['prisma', 'migrate', 'deploy'])
  console.log('✅ Remote migrations executed successfully')
}

main().catch(err => { console.error('❌ migrate-remote failed:', err.message); process.exit(1) })


