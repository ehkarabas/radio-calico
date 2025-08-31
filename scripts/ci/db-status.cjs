#!/usr/bin/env node

/**
 * Database Status Check Script
 * Checks PostgreSQL database status and health metrics with Prisma
 */

const { PrismaClient } = require("@prisma/client");
require("dotenv").config({ path: ".env.production" });

async function checkDatabaseStatus() {
  console.log("🔍 Checking database status and health...");

  let prisma;
  
  try {
    // Validate environment
    if (!process.env.DATABASE_URL) {
      throw new Error("❌ Missing required DATABASE_URL environment variable");
    }

    // Initialize Prisma client
    prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    });

    console.log("📋 Database Status Check");
    console.log(`🔗 URL: ${process.env.DATABASE_URL.replace(/\/\/.*@/, "//***:***@")}`);

    // Test 1: Basic connectivity
    console.log("📋 Test 1: Connection status");
    const startTime = Date.now();

    await prisma.$connect();
    
    const responseTime = Date.now() - startTime;
    console.log(`✅ Database connected successfully (${responseTime}ms)`);

    // Test 2: Environment consistency
    console.log("📋 Test 2: Environment consistency");

    const isProduction =
      process.env.NODE_ENV === "production" ||
      process.env.DEPLOYMENT_ENV === "remote" ||
      process.env.NEXT_PUBLIC_ENV === "remote";

    if (isProduction) {
      console.log("✅ Production environment configuration confirmed");
    } else {
      console.log("ℹ️  Development environment configuration");
    }

    // Test 3: Database schema check
    console.log("📋 Test 3: Database schema health check");

    try {
      // Try to query a basic table existence check
      const result = await prisma.$queryRaw`
        SELECT count(*) as table_count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `;
      
      console.log(`✅ Database schema accessible (${result[0]?.table_count || 0} tables found)`);
    } catch (schemaError) {
      console.log(`⚠️  Schema check warning: ${schemaError.message}`);
    }

    console.log("✅ Database status check completed");
    console.log("🎉 Database health verification successful");

    return true;
  } catch (error) {
    console.error("❌ Database status check failed:", error.message);
    process.exit(1);
  } finally {
    if (prisma) {
      await prisma.$disconnect();
    }
  }
}

// Execute check
if (require.main === module) {
  checkDatabaseStatus()
    .then(() => {
      console.log("✅ Database status check completed successfully");
      process.exit(0);
    })
    .catch((error) => {
      console.error("❌ Database status check failed:", error);
      process.exit(1);
    });
}

module.exports = { checkDatabaseStatus };
