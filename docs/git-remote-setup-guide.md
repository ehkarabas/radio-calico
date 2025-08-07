# Radio Calico - Git Remote Setup Guide

Step-by-step process to connect Radio Calico project to GitHub repository and establish dual-configuration branch structure.

## Repository Information
- **GitHub URL**: https://github.com/ehkarabas/radio-calico
- **Owner**: ehkarabas
- **Project**: radio-calico

## Phase 1: Initial Repository Setup

### Step 1: Connect Local Repository to Remote

```bash
# Navigate to project root directory
cd radio-calico

# Initialize git if not already done
git init
git branch -M main

# Add GitHub remote repository
git remote add origin https://github.com/ehkarabas/radio-calico.git

# Verify remote connection
git remote -v
# Expected output:
# origin  https://github.com/ehkarabas/radio-calico.git (fetch)
# origin  https://github.com/ehkarabas/radio-calico.git (push)
```

### Step 2: Create Initial Project Structure

```bash
# Create project directories
mkdir -p frontend backend docs
mkdir -p frontend/{app,components,hooks,lib,types}
mkdir -p backend/{src,drizzle,scripts}
mkdir -p backend/src/{routes,models,middleware,services}

# Create basic files to establish structure
touch frontend/README.md
touch backend/README.md
touch docs/deployment-guide.md

# Create .gitignore
cat > .gitignore << 'EOF'
# Dependencies
node_modules/
npm-debug.log*
yarn-debug.log*
yarn-error.log*

# Environment files
.env.local
.env.production
.env
!.env.example

# Next.js
.next/
out/
build/

# Database files
*.db
*.db-journal

# Logs
logs/
*.log

# Runtime data
pids/
*.pid
*.seed
*.pid.lock

# Directory for instrumented libs
lib-cov/

# Coverage directory used by tools like istanbul
coverage/

# IDEs
.vscode/
.idea/
*.swp
*.swo

# OS
.DS_Store
.DS_Store?
._*
.Spotlight-V100
.Trashes
ehthumbs.db
Thumbs.db

# Temporary files
*.tmp
*.temp

# Docker
docker-compose.override.yml

# Deployment environment marker (this will be committed in config branches)
# .deployment-env
EOF

# Create initial README
cat > README.md << 'EOF'
# Radio Calico 📻

Modern online radio station web application with real-time track information and interactive rating system.

## 🚀 Quick Start

```bash
# Clone repository
git clone https://github.com/ehkarabas/radio-calico.git
cd radio-calico

# Switch to local development
npm run switch:local

# Start local environment
docker-compose up -d
cd frontend && npm install && npm run dev
cd ../backend && npm install && npm run dev
```

## 🏗️ Architecture

- **Frontend**: Next.js 15 + ShadCN/UI + Tailwind CSS
- **Backend**: Express.js + Drizzle ORM
- **Database**: SQLite (dev) / Supabase PostgreSQL (prod)
- **Deployment**: Vercel + Render/Railway

## 📚 Documentation

- [Deployment Guide](./docs/deployment-guide.md)
- [API Documentation](./backend/README.md)
- [Frontend Guide](./frontend/README.md)

## 🌿 Environment Strategy

This project uses a dual-configuration Git workflow:

- `main` - Development workbench & deployment branch
- `config/local` - SQLite + Docker development setup
- `config/remote` - Supabase + production configuration

## 🎵 Features

- 🎵 HLS Audio Streaming
- 📊 Real-time Track Metadata
- 👍 Interactive Rating System
- 📱 Responsive Design
- 🔄 Optimistic Updates
- 📈 Track History

## 📄 License

MIT License - see LICENSE file for details.
EOF
```

### Step 3: Initial Commit and Push

```bash
# Stage all files
git add .

# Create initial commit
git commit -m "feat: Initial Radio Calico project structure

- Set up monorepo structure with frontend and backend
- Add comprehensive .gitignore for Next.js and Node.js
- Create README with project overview
- Establish directory structure for scalable development
- Prepare for dual-configuration Git workflow"

# Push to remote repository
git push -u origin main
```

## Phase 2: Dual-Configuration Branch Setup

### Step 4: Create Local Configuration Branch

```bash
# Create and switch to local config branch
git checkout -b config/local

# Create deployment environment marker
echo "local" > .deployment-env

# Create Docker Compose for local PostgreSQL
cat > docker-compose.yml << 'EOF'
version: '3.8'

services:
  postgres:
    image: postgres:17.5-alpine3.22
    container_name: radio-calico-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: radio_calico
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: postgres
    ports:
      - "5433:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
      - ./backend/scripts/init.sql:/docker-entrypoint-initdb.d/init.sql
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 30s
      timeout: 10s
      retries: 5

  # Optional: PGAdmin for database management
  pgadmin:
    image: dpage/pgadmin4:latest
    container_name: radio-calico-pgadmin
    restart: unless-stopped
    environment:
      PGADMIN_DEFAULT_EMAIL: admin@radiocalico.local
      PGADMIN_DEFAULT_PASSWORD: admin
    ports:
      - "5050:80"
    depends_on:
      - postgres
    profiles:
      - tools

volumes:
  postgres_data:
    driver: local
    
networks:
  default:
    name: radio-calico-network
EOF

# Create local environment configuration
cat > .env.local.example << 'EOF'
# Local Development Environment Configuration

# Database Configuration
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/radio_calico"
NODE_ENV="development"
DEPLOYMENT_ENV="local"

# API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"
PORT=3001

# Audio Stream Configuration (for testing)
STREAM_URL="http://localhost:8080/stream.m3u8"
# Alternative: Use a test HLS stream
# STREAM_URL="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"

# Development Settings
NEXT_TELEMETRY_DISABLED=1
DEBUG=radio-calico:*

# Optional: Seed data configuration
SEED_SAMPLE_DATA=true
EOF

# Create local-specific package.json scripts
cat > package.json << 'EOF'
{
  "name": "radio-calico-local",
  "version": "1.0.0",
  "description": "Radio Calico - Local Development Configuration",
  "scripts": {
    "dev": "concurrently \"npm run dev:backend\" \"npm run dev:frontend\"",
    "dev:frontend": "cd frontend && npm run dev",
    "dev:backend": "cd backend && npm run dev",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:frontend": "cd frontend && npm run start",
    "start:backend": "cd backend && npm run start",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install",
    "docker:up": "docker-compose up -d",
    "docker:down": "docker-compose down",
    "docker:logs": "docker-compose logs -f",
    "db:setup": "cd backend && npm run db:generate && npm run db:migrate && npm run db:seed",
    "db:reset": "docker-compose down -v && docker-compose up -d && sleep 5 && npm run db:setup",
    "switch:local": "git checkout main && git merge config/local --no-ff -m 'deploy: Switch to local configuration'",
    "switch:remote": "git checkout main && git merge config/remote --no-ff -m 'deploy: Switch to remote configuration'",
    "sync:configs": "git checkout config/local && git merge main --no-ff && git checkout config/remote && git merge main --no-ff && git checkout main"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# Create database initialization script
mkdir -p backend/scripts
cat > backend/scripts/init.sql << 'EOF'
-- Radio Calico Database Initialization Script
-- This script runs when PostgreSQL container starts

-- Create database if not exists (already created by POSTGRES_DB)
-- CREATE DATABASE radio_calico;

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create initial user for development (optional)
-- CREATE USER radio_user WITH PASSWORD 'radio_pass';
-- GRANT ALL PRIVILEGES ON DATABASE radio_calico TO radio_user;

-- Set timezone
SET timezone = 'UTC';

-- Log initialization
SELECT 'Radio Calico database initialized successfully' as message;
EOF

# Stage and commit local configuration
git add .
git commit -m "config: Add local development configuration

- Docker Compose with PostgreSQL 15 and optional PGAdmin
- Local environment variables template
- Database initialization script with UUID extension
- Development-focused package.json with utility scripts
- Docker container health checks and networking"

# Push local configuration branch
git push -u origin config/local
```

### Step 5: Create Remote Configuration Branch

```bash
# Switch back to main and create remote branch
git checkout main
git checkout -b config/remote

# Create remote environment marker
echo "remote" > .deployment-env

# Create production environment template
cat > .env.production.example << 'EOF'
# Production Environment Configuration

# Supabase Database Configuration
DATABASE_URL="postgresql://postgres.[ref]:[password]@[host].pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true&connection_limit=1"

# Supabase API Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[your-anon-key]"
NEXT_PUBLIC_SUPABASE_SERVICE_ROLE_KEY="[your-service-role-key]"

# Production API Configuration
NEXT_PUBLIC_API_URL="https://radio-calico-api.onrender.com"
PORT=10000

# Audio Stream Configuration
STREAM_URL="https://stream.example.com/radio.m3u8"
# Example HLS streams for testing:
# STREAM_URL="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
# STREAM_URL="https://demo.unified-streaming.com/k8s/features/stable/video/tears-of-steel/tears-of-steel.ism/.m3u8"

# Environment Settings
NODE_ENV="production"
DEPLOYMENT_ENV="remote"
NEXT_TELEMETRY_DISABLED=1

# Security Settings
ALLOWED_ORIGINS="https://radio-calico.vercel.app,https://radiocalico.com"
JWT_SECRET="[your-jwt-secret-for-future-auth]"

# Monitoring & Analytics (optional)
ANALYTICS_ID="[your-analytics-id]"
SENTRY_DSN="[your-sentry-dsn]"
EOF

# Create production package.json
cat > package.json << 'EOF'
{
  "name": "radio-calico-production",
  "version": "1.0.0",
  "description": "Radio Calico - Production Configuration",
  "scripts": {
    "dev": "npm run switch:local && npm run dev:local",
    "dev:local": "concurrently \"cd backend && npm run dev\" \"cd frontend && npm run dev\"",
    "build": "npm run build:frontend && npm run build:backend",
    "build:frontend": "cd frontend && npm run build",
    "build:backend": "cd backend && npm run build",
    "start": "concurrently \"npm run start:backend\" \"npm run start:frontend\"",
    "start:frontend": "cd frontend && npm run start",
    "start:backend": "cd backend && npm run start",
    "install:all": "npm install && cd frontend && npm install && cd ../backend && npm install",
    "deploy:frontend": "cd frontend && vercel --prod",
    "deploy:backend": "cd backend && railway up",
    "db:migrate": "cd backend && npm run db:migrate",
    "db:seed": "cd backend && npm run db:seed",
    "supabase:setup": "npm run db:migrate && npm run db:seed",
    "supabase:test": "cd backend && npm run db:test",
    "switch:local": "git checkout main && git merge config/local --no-ff -m 'deploy: Switch to local configuration'",
    "switch:remote": "git checkout main && git merge config/remote --no-ff -m 'deploy: Switch to remote configuration'",
    "sync:configs": "git checkout config/local && git merge main --no-ff && git checkout config/remote && git merge main --no-ff && git checkout main",
    "deploy:full": "npm run switch:remote && npm run build && git push origin main"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  }
}
EOF

# Create Vercel configuration
cat > vercel.json << 'EOF'
{
  "version": 2,
  "name": "radio-calico",
  "builds": [
    {
      "src": "frontend/package.json",
      "use": "@vercel/next"
    }
  ],
  "routes": [
    {
      "src": "/(.*)",
      "dest": "frontend/$1"
    }
  ],
  "env": {
    "NODE_ENV": "production",
    "DEPLOYMENT_ENV": "remote"
  },
  "build": {
    "env": {
      "NODE_ENV": "production"
    }
  },
  "functions": {
    "frontend/app/**/*.tsx": {
      "runtime": "@vercel/next@canary"
    }
  },
  "regions": ["fra1", "iad1"],
  "framework": "nextjs"
}
EOF

# Create Render configuration for backend
cat > render.yaml << 'EOF'
services:
  - type: web
    name: radio-calico-api
    env: node
    plan: free
    buildCommand: npm install && npm run build
    startCommand: npm start
    healthCheckPath: /api/health
    envVars:
      - key: NODE_ENV
        value: production
      - key: PORT
        value: 10000
      - key: DATABASE_URL
        fromDatabase:
          name: radio-calico-db
          property: connectionString
    
databases:
  - name: radio-calico-db
    plan: free
    databaseName: radio_calico
    user: postgres
EOF

# Create Railway configuration (alternative)
cat > railway.json << 'EOF'
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm start",
    "healthcheckPath": "/api/health",
    "healthcheckTimeout": 100,
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
EOF

# Stage and commit remote configuration
git add .
git commit -m "config: Add production deployment configuration

- Supabase PostgreSQL connection configuration
- Production environment variables template
- Vercel deployment configuration with Next.js optimizations
- Render.com service configuration for Express.js backend
- Railway.app alternative deployment configuration
- Production-focused package.json with deployment scripts"

# Push remote configuration branch
git push -u origin config/remote
```

## Phase 3: Main Branch Configuration

### Step 6: Return to Main and Set Default Configuration

```bash
# Switch back to main branch
git checkout main

# Create root package.json for workspace management
cat > package.json << 'EOF'
{
  "name": "radio-calico-workspace",
  "version": "1.0.0",
  "description": "Radio Calico - Online Radio Station Application",
  "private": true,
  "workspaces": [
    "frontend",
    "backend"
  ],
  "scripts": {
    "install:all": "npm install && npm install --prefix frontend && npm install --prefix backend",
    "dev": "npm run switch:local && concurrently \"npm run dev --prefix backend\" \"npm run dev --prefix frontend\"",
    "build": "npm run build --prefix frontend && npm run build --prefix backend",
    "start": "concurrently \"npm run start --prefix backend\" \"npm run start --prefix frontend\"",
    "lint": "npm run lint --prefix frontend && npm run lint --prefix backend",
    "test": "npm run test --prefix frontend && npm run test --prefix backend",
    "test:e2e": "npm run test:e2e --prefix frontend",
    "switch:local": "git checkout main && git merge config/local --no-ff -m 'deploy: Switch to local configuration'",
    "switch:remote": "git checkout main && git merge config/remote --no-ff -m 'deploy: Switch to remote configuration'",
    "sync:configs": "git checkout config/local && git merge main --no-ff && git checkout config/remote && git merge main --no-ff && git checkout main",
    "deploy:local": "npm run switch:local && docker-compose up -d",
    "deploy:remote": "npm run switch:remote && git push origin main",
    "setup:local": "npm run switch:local && npm run install:all && npm run deploy:local",
    "setup:remote": "npm run switch:remote && npm run install:all"
  },
  "devDependencies": {
    "concurrently": "^8.2.2"
  },
  "engines": {
    "node": ">=18.0.0",
    "npm": ">=8.0.0"
  },
  "repository": {
    "type": "git",
    "url": "https://github.com/ehkarabas/radio-calico.git"
  },
  "author": "ehkarabas",
  "license": "MIT",
  "keywords": [
    "radio",
    "streaming",
    "nextjs",
    "express",
    "typescript",
    "supabase",
    "hls"
  ]
}
EOF

# Update main README with branch information
cat > README.md << 'EOF'
# Radio Calico 📻

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![License](https://img.shields.io/badge/license-MIT-green) ![Next.js](https://img.shields.io/badge/Next.js-15+-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

Modern online radio station web application with real-time track information and interactive rating system.

## 🚀 Quick Start

### Local Development (SQLite + Docker)
```bash
# Clone and setup
git clone https://github.com/ehkarabas/radio-calico.git
cd radio-calico

# Setup local environment
npm run setup:local

# Start development servers
npm run dev
```

### Production Deployment (Supabase)
```bash
# Switch to production configuration
npm run setup:remote

# Deploy to production
npm run deploy:remote
```

## 🏗️ Architecture

- **Frontend**: Next.js 15 (App Router) + ShadCN/UI + Tailwind CSS
- **Backend**: Express.js + Drizzle ORM + TypeScript
- **Database**: SQLite (development) / Supabase PostgreSQL (production)
- **State Management**: React Query v5 (TanStack Query)
- **Audio**: Custom HLS streaming implementation
- **Deployment**: Vercel (Frontend) + Render/Railway (Backend)

## 🌿 Git Workflow Strategy

This project uses a unique **dual-configuration branching strategy**:

```
main                 # Development workbench & deployment branch
├── config/local     # Local development (SQLite + Docker)
└── config/remote    # Production (Supabase + deployed services)
```

### Branch Management Commands
```bash
# Switch to local development
npm run switch:local

# Switch to production configuration  
npm run switch:remote

# Sync configurations with latest changes
npm run sync:configs
```

## 🎵 Key Features

- 🎵 **HLS Audio Streaming** - High-quality audio with custom player
- 📊 **Real-time Metadata** - Live track info with 5-second polling
- 👍 **Interactive Ratings** - Thumbs up/down with optimistic updates
- 📱 **Responsive Design** - Beautiful UI with ShadCN/UI components
- 🔄 **Server Keep-Alive** - Render free plan optimization
- 📈 **Track History** - View previously played tracks
- 🧪 **E2E Testing** - Comprehensive Playwright test suite

## 📁 Project Structure

```
radio-calico/
├── frontend/          # Next.js 15 application
│   ├── app/          # App Router pages
│   ├── components/   # React components
│   ├── hooks/        # Custom hooks
│   └── lib/          # Utilities & configuration
├── backend/          # Express.js API server
│   ├── src/          # Source code
│   ├── drizzle/      # Database schema & migrations
│   └── scripts/      # Utility scripts
├── docs/             # Documentation
└── config branches   # Environment configurations
```

## 🚀 Deployment

### Frontend (Vercel)
- Automatic deployment from `main` branch
- Edge network optimization
- Environment variable injection

### Backend (Render/Railway)
- Docker-based deployment
- Automatic SSL certificates
- Health check monitoring

## 📚 Documentation

- [Deployment Guide](./docs/deployment-guide.md) - Complete deployment instructions
- [API Documentation](./backend/README.md) - Backend API reference
- [Frontend Guide](./frontend/README.md) - Component documentation

## 🛠️ Development Scripts

```bash
# Install all dependencies
npm run install:all

# Start development (automatically switches to local config)
npm run dev

# Build for production
npm run build

# Run tests
npm test
npm run test:e2e

# Environment management
npm run switch:local    # Switch to local development
npm run switch:remote   # Switch to production config
npm run sync:configs    # Sync all configurations
```

## 🔧 Environment Variables

### Local Development (.env.local)
```bash
DATABASE_URL="postgresql://postgres:postgres@localhost:5433/radio_calico"
NEXT_PUBLIC_API_URL="http://localhost:3001"
STREAM_URL="http://localhost:8080/stream.m3u8"
```

### Production (.env.production)
```bash
DATABASE_URL="postgresql://postgres.[ref]:[password]@[host].pooler.supabase.com:5432/postgres"
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_API_URL="https://radio-calico-api.onrender.com"
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'feat: Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🎵 About

Radio Calico brings you the best music streaming experience with modern web technologies, real-time interactivity, and production-ready architecture.

**Built with ❤️ using Next.js 15, Express.js, and Supabase.**
EOF

# Stage and commit main branch updates
git add .
git commit -m "feat: Configure main branch with workspace management

- Add workspace package.json with unified scripts
- Create comprehensive README with Git workflow documentation
- Document dual-configuration branching strategy
- Add quick start guides for local and production setup
- Include complete project structure and deployment information"

# Push updated main branch
git push origin main
```

## Phase 4: Verification and Setup

### Step 7: Verify Branch Structure

```bash
# Check all branches
git branch -a
# Expected output:
# * main
#   config/local
#   config/remote
#   remotes/origin/config/local
#   remotes/origin/config/remote
#   remotes/origin/main

# Check commit history
git log --oneline --graph --all -10

# Test branch switching
npm run switch:local
echo "Current config: $(cat .deployment-env 2>/dev/null || echo 'main')"

npm run switch:remote  
echo "Current config: $(cat .deployment-env 2>/dev/null || echo 'main')"

# Return to main
git checkout main
```

### Step 8: Install Root Dependencies

```bash
# Install workspace dependencies
npm install

# Install concurrently for parallel script execution
npm install --save-dev concurrently

# Verify installations
npm list --depth=0
```

## Summary

✅ **Repository successfully connected** to https://github.com/ehkarabas/radio-calico

✅ **Dual-configuration branches created**:
- `config/local` - Docker PostgreSQL + development tools
- `config/remote` - Supabase + production deployment configs

✅ **Workspace management** configured with unified scripts

✅ **Documentation** updated with complete workflow information

## Next Steps

1. **Initialize frontend**: `cd frontend && npm create next-app@latest . --typescript --tailwind --app`
2. **Initialize backend**: `cd backend && npm init -y && [install dependencies]`
3. **Start development**: `npm run setup:local`
4. **Create Supabase project** when ready for production

The repository is now ready for full-stack development with the dual-configuration Git workflow! 🚀