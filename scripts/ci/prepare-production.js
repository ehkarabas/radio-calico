#!/usr/bin/env node

/**
 * Production Environment Preparation Script
 * Prepares environment files for production deployment and testing
 * TDD COMPLIANCE: MUST FAIL when production environment is not properly configured
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function validateProductionEnvironment() {
  console.log("🔍 Validating production environment configuration...");

  try {
    // CRITICAL: Check if .env.production exists
    const envProdPath = path.join(process.cwd(), ".env.production");

    if (!fs.existsSync(envProdPath)) {
      console.error(
        "❌ CRITICAL ERROR: Missing .env.production file in root directory",
      );
      console.error("");
      console.error("🛠️  To fix this issue:");
      console.error(
        "   1. Copy the example file: cp .env.production.example .env.production",
      );
      console.error(
        "   2. Edit .env.production with your actual production values",
      );
      console.error(
        "   3. Ensure all production API keys and URLs are configured",
      );
      console.error("");
      console.error(
        "🚫 Production deployment cannot proceed without proper environment configuration.",
      );
      console.error(
        "   TDD ENFORCEMENT: Tests MUST fail when production environment is not configured.",
      );
      process.exit(1); // TDD ENFORCEMENT: Exit with error code 1
    }

    console.log("✅ Found .env.production file");

    // Check if frontend directory exists
    const frontendDir = path.join(process.cwd(), "frontend");
    if (!fs.existsSync(frontendDir)) {
      console.error("❌ CRITICAL ERROR: Frontend directory not found");
      console.error("🛠️  Ensure you are running this from the repository root");
      process.exit(1);
    }

    console.log("✅ Frontend directory found");

    // Read .env.production content
    const envContent = fs.readFileSync(envProdPath, "utf8");

    // Check for required environment variables
    const requiredVars = [
      "NEXT_PUBLIC_SUPABASE_URL",
      "NEXT_PUBLIC_SUPABASE_ANON_KEY",
	  "NEXT_PUBLIC_SITE_URL",
	  "DATABASE_URL",
    ];

    const missingVars = [];
    for (const envVar of requiredVars) {
      const match = envContent.match(new RegExp(`${envVar}=(.+)`));
      if (!match || !match[1] || match[1].trim() === "") {
        missingVars.push(envVar);
      }
    }

    if (missingVars.length > 0) {
      console.error(
        "❌ CRITICAL ERROR: Missing or empty production environment variables:",
      );
      missingVars.forEach((envVar) => console.error(`   - ${envVar}`));
      console.error("");
      console.error(
        "🛠️  Edit .env.production and add values for all required variables",
      );
      console.error(
        "🔒 Ensure production URLs and API keys are properly configured",
      );
      console.error("");
      console.error(
        "🚫 TDD ENFORCEMENT: Production tests cannot proceed with incomplete environment",
      );
      process.exit(1);
    }

    console.log("✅ All required production environment variables found");

    // Validate production URLs format
	// Validate Supabase URLs format
    const supabaseUrlMatch = envContent.match(/NEXT_PUBLIC_SUPABASE_URL=(.+)/);
    if (supabaseUrlMatch) {
      const supabaseUrl = supabaseUrlMatch[1].trim();
      if (
        !supabaseUrl.includes("supabase.co")
      ) {
        console.error(
          "❌ CRITICAL ERROR: Invalid Supabase URL format for production",
        );
        console.error(
          "🛠️  Ensure NEXT_PUBLIC_SUPABASE_URL points to a valid Supabase instance",
        );
        process.exit(1);
      }
      console.log("✅ Production Supabase URL format validated");
    }
	
	// Validate Database URLs format
	const databaseUrlMatch = envContent.match(/DATABASE_URL=(.+)/);
    if (databaseUrlMatch) {
      const databaseUrl = databaseUrlMatch[1].trim();
      if (
        !databaseUrl.includes("postgresql") &&
        !supabaseUrl.includes("supabase.com")
      ) {
        console.error(
          "❌ CRITICAL ERROR: Invalid Supabase Postgre Database URL format for production",
        );
        console.error(
          "🛠️  Ensure DATABASE_URL points to a valid Supabase Database url",
        );
        process.exit(1);
      }
      console.log("✅ Production Supabase Postgre Database URL format validated");
    }

    // Validate NextJS Live URL format
    const nextJSLiveUrlMatch = envContent.match(/NEXT_PUBLIC_SITE_URL=(.+)/);
    if (nextJSLiveUrlMatch) {
      const nextJSLiveUrl = nextJSLiveUrlMatch[1].trim();
      if (!nextJSLiveUrl.endsWith(".vercel.app")) {
        console.error("❌ CRITICAL ERROR: Invalid NextJS URL key format");
        console.error('🛠️  Ensure NEXT_PUBLIC_SITE_URL starts ends with ".vercel.app"');
        process.exit(1);
      }
      console.log("✅ Production NextJS URL key format validated");
    }

    // Copy .env.production to frontend/.env.production
    const frontendEnvProdPath = path.join(frontendDir, ".env.production");
    fs.copyFileSync(envProdPath, frontendEnvProdPath);
    console.log("✅ Copied .env.production -> frontend/.env.production");

    // Copy frontend/.env.production to frontend/.env for build process
    const frontendEnvPath = path.join(frontendDir, ".env");
    fs.copyFileSync(frontendEnvProdPath, frontendEnvPath);
    console.log("✅ Copied frontend/.env.production -> frontend/.env");

    // Validate copied files
    if (!fs.existsSync(frontendEnvProdPath)) {
      console.error(
        "❌ CRITICAL ERROR: Failed to create frontend/.env.production",
      );
      process.exit(1);
    }

    if (!fs.existsSync(frontendEnvPath)) {
      console.error("❌ CRITICAL ERROR: Failed to create frontend/.env");
      process.exit(1);
    }

    // Production-specific validations
    const prodEnvContent = fs.readFileSync(frontendEnvPath, "utf8");

    // Ensure NODE_ENV is set to production
    if (!prodEnvContent.includes("NODE_ENV=production")) {
      console.log("ℹ️  Adding NODE_ENV=production to frontend environment");
      fs.appendFileSync(frontendEnvPath, "\nNODE_ENV=production\n");
    }

    // Ensure DEPLOYMENT_ENV is set
    if (!prodEnvContent.includes("DEPLOYMENT_ENV=")) {
      console.log("ℹ️  Adding DEPLOYMENT_ENV=remote to frontend environment");
      fs.appendFileSync(frontendEnvPath, "\nDEPLOYMENT_ENV=remote\n");
    }

    console.log("✅ Production environment validation completed");
    console.log("🎉 Production environment prepared successfully!");

    return true;
  } catch (error) {
    console.error(
      "❌ Production environment preparation failed:",
      error.message,
    );
    console.error("");
    console.error(
      "🚫 TDD ENFORCEMENT: Production environment preparation MUST succeed before deployment",
    );
    process.exit(1);
  }
}

// Execute preparation
if (import.meta.url === `file://${process.argv[1]}`) {
  try {
    validateProductionEnvironment();
    console.log("✅ Production environment preparation completed successfully");
    process.exit(0);
  } catch (error) {
    console.error("❌ Production environment preparation failed:", error);
    process.exit(1);
  }
}

export { validateProductionEnvironment };
