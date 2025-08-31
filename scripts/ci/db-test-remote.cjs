#!/usr/bin/env node

/**
 * Database Connection Test Script for Production Environment
 * Tests remote PostgreSQL database connectivity with Prisma
 */

const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: ".env.production" });

async function testRemoteDatabase() {
  console.log("🔍 Testing production database connectivity...");

  let prisma;

  try {
    // Validate required environment variables
    const requiredVars = ["DATABASE_URL"];
    for (const envVar of requiredVars) {
      if (!process.env[envVar]) {
        throw new Error(`❌ Missing required environment variable: ${envVar}`);
      }
    }

    // Initialize Prisma client
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    // Test 1: Basic connectivity
    console.log("📋 Test 1: Basic database connectivity");
    await prisma.$connect();
    console.log("✅ Database connection established");

    // Test 2: Database query test
    console.log("📋 Test 2: Database query test");
    const result = await prisma.$queryRaw`SELECT current_database(), version()`;
    console.log(`✅ Database query successful: ${result[0]?.current_database || 'unknown'}`);

    // Test 3: Schema access test
    console.log("📋 Test 3: Database schema access test");
    const tables = await prisma.$queryRaw`
      SELECT count(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `;
    console.log(`✅ Schema accessible (${tables[0]?.table_count || 0} tables found)`);

    // Test 4: Environment validation
    console.log("📋 Test 4: Environment configuration validation");
    
    const isProduction =
      process.env.NODE_ENV === "production" ||
      process.env.DEPLOYMENT_ENV === "remote" ||
      process.env.NEXT_PUBLIC_ENV === "remote";

    if (isProduction) {
      console.log("✅ Production environment configuration confirmed");
    } else {
      console.log("ℹ️  Development environment configuration");
    }

    // Validate DATABASE_URL format
    const urlPattern = /^postgresql:\/\/.*:\d+\/\w+/;
    if (!urlPattern.test(process.env.DATABASE_URL)) {
      throw new Error("❌ Invalid PostgreSQL DATABASE_URL format");
    }

    console.log("✅ Production database connectivity test passed");
    console.log("✅ Environment configuration validated");
    console.log("🎉 Remote database test completed successfully");

    return true;
  } catch (error) {
    console.error("❌ Remote database test failed:", error.message);
    process.exit(1);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Execute test
if (require.main === module) {
  testRemoteDatabase()
    .then(() => {
      console.log("✅ Database test completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database test failed:", error);
      process.exit(1);
    });
}

module.exports = { testRemoteDatabase };
