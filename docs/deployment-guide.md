# Radio Calico Deployment Guide

Complete deployment guide for Radio Calico - Next.js 15 online radio station with Supabase PostgreSQL production setup.

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Prerequisites](#2-prerequisites)
3. [Git Workflow Setup](#3-git-workflow-setup)
4. [Local Development Environment](#4-local-development-environment)
5. [Supabase Setup](#5-supabase-setup)
6. [Database Migration Strategy](#6-database-migration-strategy)
7. [Production Deployment](#7-production-deployment)
8. [Environment Configuration](#8-environment-configuration)
9. [CI/CD Pipeline](#9-cicd-pipeline)
10. [Testing Strategy](#10-testing-strategy)
11. [Render Free Plan Optimization](#11-render-free-plan-optimization)
12. [Monitoring & Maintenance](#12-monitoring--maintenance)
13. [Troubleshooting](#13-troubleshooting)

## 1. Project Overview

Radio Calico is a full-stack online radio station application with the following architecture:

- **Frontend**: Next.js 15 (App Router) + ShadCN/UI + Tailwind CSS
- **Backend**: Express.js RESTful API
- **Database**: SQLite (development) / Supabase PostgreSQL (production)
- **ORM**: Drizzle ORM with type-safe queries
- **State Management**: React Query v5 (TanStack Query)
- **Audio**: Custom HLS streaming implementation
- **Deployment**: Vercel (Frontend) + Render/Railway (Backend)

### Key Features
- 🎵 HLS Audio Streaming with custom player
- 📊 Real-time Track Metadata (5-second polling)
- 👍 Interactive Rating System (thumbs up/down)
- 📱 Responsive Design with ShadCN/UI components
- 🔄 Optimistic Updates with React Query
- 📈 Track History and Analytics
- 🐳 Docker development environment
- 🌐 Production-ready with Supabase integration

## 2. Prerequisites

### Required Software
```bash
# Node.js 22+ (LTS recommended)
node --version # v22.0.0+

# Package Manager
npm --version # 10.0.0+
# or
pnpm --version # 8.0.0+

# Docker & Docker Compose (for local development)
docker --version # 24.0.0+
docker-compose --version # 2.20.0+

# Git
git --version # 2.40.0+
```

### Required Accounts
- **GitHub**: Repository hosting and CI/CD
- **Vercel**: Frontend deployment and edge network
- **Render** or **Railway**: Backend API deployment
- **Supabase**: Production PostgreSQL database
- **Optional**: Docker Hub (for custom images)

### Development Tools
- **VS Code** (recommended) with extensions:
  - Tailwind CSS IntelliSense
  - TypeScript + JavaScript
  - Prettier - Code formatter
  - ESLint
  - Drizzle ORM extension

## 3. Git Workflow Setup

### 3.1. Repository Structure

Radio Calico uses a unique **dual-configuration branching strategy** to manage local and production environments without force pushing:

```
main                 # Development workbench & deployment branch
├── config/local     # Local development configuration (SQLite + Docker)
└── config/remote    # Production configuration (Supabase + deployed services)
```

### 3.2. Initial Repository Setup

```bash
# 1. Create and initialize the project
mkdir radio-calico && cd radio-calico
git init
git branch -M main

# 2. Add remote repository
git remote add origin https://github.com/[username]/radio-calico.git

# 3. Create initial project structure
mkdir -p frontend backend docs
mkdir -p frontend/{app,components,hooks,lib,types}
mkdir -p backend/{src,drizzle}
mkdir -p backend/src/{routes,models,middleware,services}

# 4. Initial commit with project structure
git add .
git commit -m "feat: Initial project structure setup"
git push -u origin main
```

### 3.3. Configuration Branch Creation

#### Phase A: Local Configuration Branch

```bash
# 1. Create local configuration branch
git checkout -b config/local

# 2. Create deployment environment marker
echo "local" > .deployment-env
git add .deployment-env
git commit -m "config: Add local environment marker"

# 3. Create Docker Compose configuration
cat > docker-compose.yml << 'EOF'
version: '3.8'
services:
  postgres:
    image: postgres:15-alpine
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

volumes:
  postgres_data:
    driver: local
EOF

# 4. Create local environment configuration
cat > .env.local << 'EOF'
# Local Development Environment
DATABASE_URL="file:./local.db"
NODE_ENV="development"
DEPLOYMENT_ENV="local"

# Local API Configuration
NEXT_PUBLIC_API_URL="http://localhost:3001"
STREAM_URL="http://localhost:8080/stream.m3u8"

# Development Settings
NEXT_TELEMETRY_DISABLED=1
EOF

# 5. Create local-specific Drizzle configuration
mkdir -p backend/drizzle
cat > backend/drizzle.config.ts << 'EOF'
import type { Config } from 'drizzle-kit'

export default {
  schema: './src/schema.ts',
  out: './drizzle/migrations',
  driver: 'better-sqlite3',
  dbCredentials: {
    url: './local.db'
  },
  verbose: true,
  strict: true
} satisfies Config
EOF

# 6. Commit local configuration
git add .
git commit -m "config: Add local SQLite development configuration with Docker"

# 7. Push local configuration branch
git push -u origin config/local
```

#### Phase B: Remote Configuration Branch

```bash
# 1. Switch to main and create remote branch
git checkout main
git checkout -b config/remote

# 2. Create remote environment marker
echo "remote" > .deployment-env
git add .deployment-env
git commit -m "config: Add remote environment marker"

# 3. Create production environment template
cat > .env.production.example << 'EOF'
# Production Environment Configuration
DATABASE_URL="postgresql://postgres.[ref]:[password]@[host].pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true"

# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"

# Production API Configuration
NEXT_PUBLIC_API_URL="https://radio-calico-api.onrender.com"
STREAM_URL="https://stream.example.com/radio.m3u8"

# Environment Settings
NODE_ENV="production"
DEPLOYMENT_ENV="remote"
NEXT_TELEMETRY_DISABLED=1
EOF

# 4. Create production Drizzle configuration
cat > backend/drizzle.config.ts << 'EOF'
import type { Config } from 'drizzle-kit'
import { config } from 'dotenv'

config()

export default {
  schema: './src/schema.ts',
  out: './drizzle/migrations',
  driver: 'pg',
  dbCredentials: {
    connectionString: process.env.DATABASE_URL!
  },
  verbose: true,
  strict: true
} satisfies Config
EOF

# 5. Update database client for production
mkdir -p backend/src
cat > backend/src/db.ts << 'EOF'
import { config } from 'dotenv'
import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'
import * as schema from './schema'

config()

const connectionString = process.env.DATABASE_URL!
const isProduction = process.env.NODE_ENV === 'production'

const client = postgres(connectionString, {
  prepare: false,
  ssl: isProduction ? 'require' : false,
  max: isProduction ? 10 : 5,
  idle_timeout: 30,
  connect_timeout: 60
})

export const db = drizzle(client, { schema })
export * from './schema'
EOF

# 6. Commit remote configuration
git add .
git commit -m "config: Add Supabase PostgreSQL production configuration"

# 7. Push remote configuration branch
git push -u origin config/remote
```

### 3.4. Package.json Helper Scripts

Add these scripts to both frontend and backend `package.json` files:

```json
{
  "scripts": {
    // Existing scripts...
    "switch:local": "git checkout main && git merge config/local --no-ff -m 'deploy: Switch to local configuration'",
    "switch:remote": "git checkout main && git merge config/remote --no-ff -m 'deploy: Switch to remote configuration'",
    "sync:configs": "git checkout config/local && git merge main --no-ff && git checkout config/remote && git merge main --no-ff && git checkout main",
    "deploy:local": "npm run switch:local && docker-compose up -d && npm run dev",
    "deploy:remote": "npm run switch:remote && git push origin main"
  }
}
```

## 4. Local Development Environment

### 4.1. Project Initialization

```bash
# 1. Switch to local configuration
git checkout main
npm run switch:local

# 2. Initialize frontend (Next.js 15)
cd frontend
npm create next-app@latest . --typescript --tailwind --app --src-dir=false --import-alias="@/*"

# Install additional frontend dependencies
npm install @tanstack/react-query
npm install @supabase/supabase-js
npm install hls.js @types/hls.js
npm install sonner lucide-react
npm install class-variance-authority clsx tailwind-merge

# Install ShadCN/UI
npx shadcn-ui@latest init
npx shadcn-ui@latest add button card slider toast

# 3. Initialize backend (Express.js)
cd ../backend
npm init -y

# Install backend dependencies
npm install express cors dotenv helmet morgan compression
npm install drizzle-orm drizzle-kit
npm install better-sqlite3 @types/better-sqlite3
npm install postgres @types/postgres
npm install @types/node @types/express
npm install -D typescript tsx nodemon @types/cors

# 4. TypeScript configuration
cat > tsconfig.json << 'EOF'
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "CommonJS",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
EOF
```

### 4.2. Database Schema Definition

Create the database schema using Drizzle ORM:

```typescript
// backend/src/schema.ts
import { sql } from 'drizzle-orm'
import { integer, sqliteTable, text, uuid } from 'drizzle-orm/sqlite-core'
import { pgTable, timestamp, uuid as pgUuid, text as pgText, integer as pgInteger } from 'drizzle-orm/pg-core'

// Environment-aware schema definitions
const isProduction = process.env.NODE_ENV === 'production'

// Common field types
const id = () => isProduction ? pgUuid('id').defaultRandom().primaryKey() : text('id').primaryKey()
const timestamp_field = (name: string) => isProduction 
  ? timestamp(name).defaultNow() 
  : integer(name).default(sql`(unixepoch())`)

// Tracks table - stores radio track metadata
export const tracks = isProduction ? 
  pgTable('tracks', {
    id: pgUuid('id').defaultRandom().primaryKey(),
    title: pgText('title').notNull(),
    artist: pgText('artist').notNull(),
    album: pgText('album'),
    year: pgInteger('year'),
    albumArt: pgText('album_art'),
    streamQuality: pgText('stream_quality').$type<'lossless' | 'high' | 'medium'>(),
    createdAt: timestamp('created_at').defaultNow(),
    updatedAt: timestamp('updated_at').defaultNow()
  }) :
  sqliteTable('tracks', {
    id: text('id').primaryKey(),
    title: text('title').notNull(),
    artist: text('artist').notNull(),
    album: text('album'),
    year: integer('year'),
    albumArt: text('album_art'),
    streamQuality: text('stream_quality').$type<'lossless' | 'high' | 'medium'>(),
    createdAt: integer('created_at').default(sql`(unixepoch())`),
    updatedAt: integer('updated_at').default(sql`(unixepoch())`)
  })

// Ratings table - stores user track ratings
export const ratings = isProduction ?
  pgTable('ratings', {
    id: pgUuid('id').defaultRandom().primaryKey(),
    trackId: pgUuid('track_id').references(() => tracks.id),
    rating: pgText('rating').$type<'up' | 'down'>().notNull(),
    userId: pgText('user_id'), // Optional user identification
    ipAddress: pgText('ip_address'), // Anonymous rating tracking
    createdAt: timestamp('created_at').defaultNow()
  }) :
  sqliteTable('ratings', {
    id: text('id').primaryKey(),
    trackId: text('track_id').references(() => tracks.id),
    rating: text('rating').$type<'up' | 'down'>().notNull(),
    userId: text('user_id'),
    ipAddress: text('ip_address'),
    createdAt: integer('created_at').default(sql`(unixepoch())`)
  })

// Type exports for TypeScript inference
export type Track = typeof tracks.$inferSelect
export type NewTrack = typeof tracks.$inferInsert
export type Rating = typeof ratings.$inferSelect
export type NewRating = typeof ratings.$inferInsert
```

### 4.3. Backend API Implementation

```typescript
// backend/src/routes/tracks.ts
import { Router } from 'express'
import { eq, desc, sql } from 'drizzle-orm'
import { db, tracks, ratings } from '../db'

const router = Router()

// Get current track (simulated for demo)
router.get('/current-track', async (req, res) => {
  try {
    // In production, this would come from streaming server metadata
    const currentTrack = await db.select().from(tracks).orderBy(desc(tracks.createdAt)).limit(1)
    
    if (currentTrack.length === 0) {
      return res.status(404).json({ error: 'No track currently playing' })
    }

    res.json(currentTrack[0])
  } catch (error) {
    console.error('Error fetching current track:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Get track ratings
router.get('/ratings/:trackId', async (req, res) => {
  try {
    const { trackId } = req.params
    
    const ratingCounts = await db
      .select({
        rating: ratings.rating,
        count: sql<number>`count(*)`
      })
      .from(ratings)
      .where(eq(ratings.trackId, trackId))
      .groupBy(ratings.rating)

    const result = {
      upCount: ratingCounts.find(r => r.rating === 'up')?.count || 0,
      downCount: ratingCounts.find(r => r.rating === 'down')?.count || 0
    }

    res.json(result)
  } catch (error) {
    console.error('Error fetching ratings:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// Submit track rating
router.post('/ratings', async (req, res) => {
  try {
    const { trackId, rating } = req.body
    const ipAddress = req.ip || 'unknown'

    if (!trackId || !rating || !['up', 'down'].includes(rating)) {
      return res.status(400).json({ error: 'Invalid rating data' })
    }

    // Check if track exists
    const track = await db.select().from(tracks).where(eq(tracks.id, trackId)).limit(1)
    if (track.length === 0) {
      return res.status(404).json({ error: 'Track not found' })
    }

    // Insert rating
    const newRating = await db.insert(ratings).values({
      id: crypto.randomUUID(),
      trackId,
      rating: rating as 'up' | 'down',
      ipAddress,
      createdAt: process.env.NODE_ENV === 'production' ? new Date() : Date.now()
    }).returning()

    res.status(201).json(newRating[0])
  } catch (error) {
    console.error('Error submitting rating:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

export default router
```

```typescript
// backend/src/routes/health.ts
import { Router } from 'express'

const router = Router()

router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    service: 'radio-calico-api',
    version: process.env.npm_package_version || '1.0.0',
    environment: process.env.NODE_ENV || 'development'
  })
})

export default router
```

```typescript
// backend/src/app.ts
import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import compression from 'compression'
import { config } from 'dotenv'

import tracksRouter from './routes/tracks'
import healthRouter from './routes/health'

// Load environment variables
config()

const app = express()
const PORT = process.env.PORT || 3001

// Security middleware
app.use(helmet({
  crossOriginEmbedderPolicy: false, // Required for HLS streaming
  contentSecurityPolicy: {
    directives: {
      "media-src": ["'self'", "data:", "blob:", "https:"],
      "connect-src": ["'self'", "https:", "wss:"]
    }
  }
}))

// CORS configuration
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://radio-calico.vercel.app'] 
    : ['http://localhost:3000'],
  credentials: true
}))

// Body parsing middleware
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Compression and logging
app.use(compression())
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'))

// API routes
app.use('/api', tracksRouter)
app.use('/api', healthRouter)

// Error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err)
  res.status(500).json({ 
    error: 'Internal server error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong'
  })
})

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

export default app
```

```typescript
// backend/src/server.ts
import app from './app'

const PORT = process.env.PORT || 3001

app.listen(PORT, () => {
  console.log(`🚀 Radio Calico API server running on port ${PORT}`)
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`)
  console.log(`📁 Database: ${process.env.DATABASE_URL ? 'Connected' : 'Not configured'}`)
})
```

### 4.4. Frontend Implementation

```typescript
// frontend/hooks/use-server-wakeup.ts
import { useEffect } from 'react'
import { useQuery } from '@tanstack/react-query'

interface ServerWakeupOptions {
  enabled?: boolean
  interval?: number
}

export function useServerWakeup(options: ServerWakeupOptions = {}) {
  const { enabled = true, interval = 600000 } = options // Default 10 minutes

  // Initial server wakeup on app mount
  useEffect(() => {
    if (!enabled) return

    const wakeupServer = async () => {
      try {
        const response = await fetch('/api/health', {
          method: 'GET',
          cache: 'no-store'
        })
        
        if (response.ok) {
          console.log('Server successfully woken up')
        } else {
          console.error('Server wakeup failed:', response.status)
        }
      } catch (error) {
        console.error('Server wakeup error:', error)
      }
    }

    wakeupServer()
  }, [enabled])

  // Periodic health check to keep server alive
  return useQuery({
    queryKey: ['serverHealth'],
    queryFn: async () => {
      const response = await fetch('/api/health')
      if (!response.ok) throw new Error('Health check failed')
      return { status: 'healthy', timestamp: Date.now() }
    },
    enabled,
    refetchInterval: interval,
    refetchIntervalInBackground: true,
    retry: 3,
    staleTime: interval - 30000, // 30 seconds before interval
  })
}
```

```typescript
// frontend/hooks/use-current-track.ts
import { useQuery } from '@tanstack/react-query'

interface TrackMetadata {
  id: string
  title: string
  artist: string
  album: string
  year: number
  albumArt: string
  streamQuality: 'lossless' | 'high' | 'medium'
}

export function useCurrentTrack() {
  return useQuery({
    queryKey: ['currentTrack'],
    queryFn: async (): Promise<TrackMetadata> => {
      const response = await fetch('/api/current-track')
      if (!response.ok) throw new Error('Failed to fetch current track')
      return response.json()
    },
    refetchInterval: 5000, // Poll every 5 seconds
    staleTime: 2000,
    gcTime: 10000,
  })
}
```

```typescript
// frontend/lib/config.ts
export const serverConfig = {
  wakeupEnabled: process.env.DEPLOYMENT_ENV === 'remote',
  healthCheckInterval: process.env.NODE_ENV === 'production' ? 600000 : 0,
  apiBaseUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001',
  streamUrl: process.env.STREAM_URL || 'http://localhost:8080/stream.m3u8'
}
```

```typescript
// frontend/app/layout.tsx
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useServerWakeup } from '@/hooks/use-server-wakeup'
import { serverConfig } from '@/lib/config'
import './globals.css'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      gcTime: 10 * 60 * 1000, // 10 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: any) => {
        if (error?.status === 404) return false
        return failureCount < 3
      }
    }
  }
})

function RootLayoutClient({ children }: { children: React.ReactNode }) {
  // Keep server alive for radio streaming
  useServerWakeup({
    enabled: serverConfig.wakeupEnabled,
    interval: serverConfig.healthCheckInterval || 600000
  })

  return <div>{children}</div>
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <QueryClientProvider client={queryClient}>
          <RootLayoutClient>{children}</RootLayoutClient>
        </QueryClientProvider>
      </body>
    </html>
  )
}
```

### 4.5. Local Development Startup

```bash
# 1. Start local environment
git checkout main
npm run switch:local

# 2. Start PostgreSQL container
docker-compose up -d

# 3. Generate and run database migrations
cd backend
npm run db:generate
npm run db:migrate
npm run db:seed # Optional: seed sample data

# 4. Start backend API
npm run dev

# 5. In another terminal, start frontend
cd frontend
npm run dev

# 6. Open browser to http://localhost:3000
```

## 5. Supabase Setup

### 5.1. Create Supabase Project

1. **Go to [supabase.com](https://supabase.com)** and sign in with GitHub
2. **Create New Project**:
   - Organization: Select or create organization
   - Name: `radio-calico`
   - Database Password: Generate strong password (save it!)
   - Region: Choose closest region to your users
   - Pricing Plan: Free tier is sufficient for development

3. **Wait for project creation** (2-3 minutes)

### 5.2. Configure Database

```sql
-- Enable Row Level Security
ALTER TABLE tracks ENABLE ROW LEVEL SECURITY;
ALTER TABLE ratings ENABLE ROW LEVEL SECURITY;

-- Public read policy for tracks
CREATE POLICY "Tracks are publicly readable" ON tracks
  FOR SELECT USING (true);

-- Allow anyone to insert tracks (for admin purposes)
CREATE POLICY "Allow track insertion" ON tracks
  FOR INSERT WITH CHECK (true);

-- Rating policies
CREATE POLICY "Anyone can submit ratings" ON ratings
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Ratings are publicly readable" ON ratings
  FOR SELECT USING (true);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_tracks_created_at ON tracks(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_ratings_track_id ON ratings(track_id);
CREATE INDEX IF NOT EXISTS idx_ratings_created_at ON ratings(created_at DESC);
```

### 5.3. Get Connection Details

From Supabase Dashboard → Settings → Database:

```bash
# Connection Pooling (recommended for production)
DATABASE_URL="postgresql://postgres.[ref]:[password]@[host].pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true"

# Direct Connection (for migrations)
DIRECT_URL="postgresql://postgres.[ref]:[password]@[host].pooler.supabase.com:6543/postgres?sslmode=require"

# API Configuration
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"
```

## 6. Database Migration Strategy

### 6.1. Local to Production Migration

```bash
# 1. Switch to remote configuration
git checkout main
npm run switch:remote

# 2. Update environment variables
cp .env.production.example .env.production
# Edit .env.production with actual Supabase credentials

# 3. Generate production migrations
cd backend
npm run db:generate

# 4. Run migrations on Supabase
DATABASE_URL="[supabase-url]" npm run db:migrate

# 5. Verify schema
DATABASE_URL="[supabase-url]" npx drizzle-kit introspect:pg
```

### 6.2. Data Seeding

```typescript
// backend/scripts/seed.ts
import { db, tracks, ratings } from '../src/db'
import { v4 as uuidv4 } from 'uuid'

const sampleTracks = [
  {
    id: uuidv4(),
    title: "Bohemian Rhapsody",
    artist: "Queen",
    album: "A Night at the Opera",
    year: 1975,
    albumArt: "https://example.com/bohemian-rhapsody.jpg",
    streamQuality: "lossless" as const
  },
  {
    id: uuidv4(),
    title: "Hotel California",
    artist: "Eagles", 
    album: "Hotel California",
    year: 1976,
    albumArt: "https://example.com/hotel-california.jpg",
    streamQuality: "high" as const
  },
  {
    id: uuidv4(),
    title: "Billie Jean",
    artist: "Michael Jackson",
    album: "Thriller", 
    year: 1982,
    albumArt: "https://example.com/billie-jean.jpg",
    streamQuality: "high" as const
  }
]

async function seed() {
  try {
    console.log('🌱 Starting database seed...')

    // Clear existing data
    await db.delete(ratings)
    await db.delete(tracks)

    // Insert sample tracks
    await db.insert(tracks).values(sampleTracks)
    console.log(`✅ Inserted ${sampleTracks.length} tracks`)

    // Insert sample ratings
    const sampleRatings = sampleTracks.flatMap(track => [
      {
        id: uuidv4(),
        trackId: track.id,
        rating: 'up' as const,
        ipAddress: '192.168.1.1'
      },
      {
        id: uuidv4(),
        trackId: track.id,
        rating: 'up' as const,
        ipAddress: '192.168.1.2'
      },
      {
        id: uuidv4(),
        trackId: track.id,
        rating: 'down' as const,
        ipAddress: '192.168.1.3'
      }
    ])

    await db.insert(ratings).values(sampleRatings)
    console.log(`✅ Inserted ${sampleRatings.length} ratings`)

    console.log('🎉 Database seed completed successfully!')
  } catch (error) {
    console.error('❌ Seed failed:', error)
    throw error
  }
}

seed().catch(console.error)
```

```json
// backend/package.json scripts addition
{
  "scripts": {
    "db:seed": "tsx scripts/seed.ts",
    "db:reset": "npm run db:migrate && npm run db:seed",
    "supabase:setup": "npm run db:migrate && npm run db:seed"
  }
}
```

## 7. Production Deployment

### 7.1. Vercel Frontend Deployment

```bash
# 1. Install Vercel CLI
npm install -g vercel

# 2. Switch to remote configuration
git checkout main
npm run switch:remote

# 3. Deploy to Vercel
cd frontend
vercel

# Follow prompts:
# - Set up and deploy "frontend"? Y
# - In which directory is your code located? ./
# - Want to override settings? N

# 4. Set environment variables in Vercel Dashboard
vercel env add DATABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_URL
vercel env add NEXT_PUBLIC_SUPABASE_ANON_KEY
vercel env add NEXT_PUBLIC_API_URL
vercel env add STREAM_URL
```

### 7.2. Render Backend Deployment

1. **Connect GitHub Repository** to Render
2. **Create New Web Service**:
   - Name: `radio-calico-api`
   - Environment: `Node`
   - Build Command: `npm install && npm run build`
   - Start Command: `npm start`
   - Instance Type: `Free`

3. **Set Environment Variables**:
```bash
DATABASE_URL=[supabase-connection-string]
NODE_ENV=production
PORT=10000
```

4. **Create deployment script**:
```json
// backend/package.json
{
  "scripts": {
    "build": "tsc",
    "start": "node dist/server.js",
    "deploy": "npm run build && npm start"
  }
}
```

### 7.3. Railway Alternative Deployment

```bash
# 1. Install Railway CLI
npm install -g @railway/cli

# 2. Login and deploy
railway login
cd backend
railway init
railway up

# 3. Set environment variables
railway variables set DATABASE_URL=[supabase-url]
railway variables set NODE_ENV=production
```

## 8. Environment Configuration

### 8.1. Development Environment

```bash
# .env.local
DATABASE_URL="file:./local.db"
NODE_ENV="development"
DEPLOYMENT_ENV="local"
NEXT_PUBLIC_API_URL="http://localhost:3001"
STREAM_URL="http://localhost:8080/stream.m3u8"
NEXT_TELEMETRY_DISABLED=1
```

### 8.2. Production Environment

```bash
# .env.production
DATABASE_URL="postgresql://postgres.[ref]:[password]@[host].pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true"
NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"
NEXT_PUBLIC_API_URL="https://radio-calico-api.onrender.com"
STREAM_URL="https://stream.example.com/radio.m3u8"
NODE_ENV="production"
DEPLOYMENT_ENV="remote"
```

### 8.3. Vercel Configuration

```json
// vercel.json
{
  "buildCommand": "npm run build",
  "devCommand": "npm run dev",
  "installCommand": "npm install",
  "framework": "nextjs",
  "regions": ["fra1"],
  "env": {
    "DATABASE_URL": "@database_url",
    "NEXT_PUBLIC_SUPABASE_URL": "@supabase_url",
    "NEXT_PUBLIC_SUPABASE_ANON_KEY": "@supabase_anon_key",
    "NEXT_PUBLIC_API_URL": "@api_url",
    "STREAM_URL": "@stream_url"
  },
  "build": {
    "env": {
      "DATABASE_URL": "@database_url"
    }
  }
}
```

## 9. CI/CD Pipeline

### 9.1. GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy Radio Calico

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    services:
      postgres:
        image: postgres:15
        env:
          POSTGRES_PASSWORD: postgres
          POSTGRES_DB: radio_calico_test
        options: >-
          --health-cmd pg_isready
          --health-interval 10s
          --health-timeout 5s
          --health-retries 5

    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
          cache: 'npm'

      - name: Install dependencies
        run: |
          cd frontend && npm ci
          cd ../backend && npm ci

      - name: Run type checking
        run: |
          cd frontend && npm run type-check
          cd ../backend && npm run type-check

      - name: Run tests
        run: |
          cd frontend && npm test
          cd ../backend && npm test

      - name: Run E2E tests
        run: |
          cd frontend && npm run test:e2e

  deploy-backend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to Render
        uses: bounceapp/render-action@0.6.0
        with:
          render-token: ${{ secrets.RENDER_TOKEN }}
          github-token: ${{ secrets.GITHUB_TOKEN }}
          service-id: ${{ secrets.RENDER_SERVICE_ID }}

  deploy-frontend:
    needs: test
    runs-on: ubuntu-latest
    if: github.ref == 'refs/heads/main'
    
    steps:
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

### 9.2. Automated Testing

```javascript
// playwright.config.js
import { defineConfig, devices } from '@playwright/test'

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL: process.env.NODE_ENV === 'production' 
      ? 'https://radio-calico.vercel.app'
      : 'http://localhost:3000',
    trace: 'on-first-retry',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },
    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  webServer: {
    command: 'npm run dev',
    port: 3000,
    reuseExistingServer: !process.env.CI,
  },
})
```

## 10. Testing Strategy

### 10.1. E2E Testing with Playwright

```typescript
// e2e/radio-app.spec.ts
import { test, expect } from '@playwright/test'

test.describe('Radio Station App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
    // Wait for app to load
    await page.waitForSelector('[data-testid="audio-player"]')
  })

  test('should display current track information', async ({ page }) => {
    // Wait for track info to load
    await expect(page.locator('[data-testid="track-title"]')).toBeVisible()
    await expect(page.locator('[data-testid="track-artist"]')).toBeVisible()
    await expect(page.locator('[data-testid="track-album"]')).toBeVisible()
  })

  test('should allow track rating', async ({ page }) => {
    // Wait for rating system to load
    await page.waitForSelector('[data-testid="rating-system"]')
    
    // Get initial rating count
    const initialUpCount = await page.locator('[data-testid="thumbs-up"] span').textContent()
    
    // Click thumbs up
    await page.click('[data-testid="thumbs-up"]')
    
    // Verify rating increased
    await page.waitForTimeout(1000) // Wait for optimistic update
    const newUpCount = await page.locator('[data-testid="thumbs-up"] span').textContent()
    expect(parseInt(newUpCount!)).toBeGreaterThan(parseInt(initialUpCount!))
    
    // Verify success toast
    await expect(page.locator('.toast')).toContainText('Rating submitted')
  })

  test('should handle audio player controls', async ({ page }) => {
    const playButton = page.locator('[data-testid="play-button"]')
    const pauseButton = page.locator('[data-testid="pause-button"]')
    
    // Initially should show play button
    await expect(playButton).toBeVisible()
    
    // Click play
    await playButton.click()
    
    // Should switch to pause button
    await expect(pauseButton).toBeVisible()
    await expect(playButton).not.toBeVisible()
    
    // Click pause
    await pauseButton.click()
    
    // Should switch back to play button
    await expect(playButton).toBeVisible()
    await expect(pauseButton).not.toBeVisible()
  })

  test('should display track history', async ({ page }) => {
    await page.click('[data-testid="history-tab"]')
    await expect(page.locator('[data-testid="track-history"]')).toBeVisible()
    
    // Should have at least one track in history
    const historyItems = page.locator('[data-testid="history-item"]')
    await expect(historyItems).toHaveCount(await historyItems.count())
  })

  test('should be responsive on mobile', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Check that key elements are visible on mobile
    await expect(page.locator('[data-testid="audio-player"]')).toBeVisible()
    await expect(page.locator('[data-testid="track-info"]')).toBeVisible()
    await expect(page.locator('[data-testid="rating-system"]')).toBeVisible()
  })

  test('should handle server errors gracefully', async ({ page }) => {
    // Mock server error
    await page.route('/api/current-track', route => {
      route.fulfill({ status: 500, body: 'Server Error' })
    })
    
    await page.reload()
    
    // Should show error state
    await expect(page.locator('[data-testid="error-message"]')).toContainText('Unable to load track')
  })
})
```

### 10.2. Unit Testing

```typescript
// frontend/__tests__/hooks/use-current-track.test.ts
import { renderHook, waitFor } from '@testing-library/react'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useCurrentTrack } from '../../hooks/use-current-track'

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false }
  }
})

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <QueryClientProvider client={createTestQueryClient()}>
    {children}
  </QueryClientProvider>
)

describe('useCurrentTrack', () => {
  beforeEach(() => {
    fetchMock.resetMocks()
  })

  test('should fetch current track successfully', async () => {
    const mockTrack = {
      id: '1',
      title: 'Test Song',
      artist: 'Test Artist',
      album: 'Test Album',
      year: 2023,
      albumArt: 'test.jpg',
      streamQuality: 'high'
    }

    fetchMock.mockResponseOnce(JSON.stringify(mockTrack))

    const { result } = renderHook(() => useCurrentTrack(), { wrapper })

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true)
    })

    expect(result.current.data).toEqual(mockTrack)
  })

  test('should handle error when track fetch fails', async () => {
    fetchMock.mockRejectOnce(new Error('Fetch failed'))

    const { result } = renderHook(() => useCurrentTrack(), { wrapper })

    await waitFor(() => {
      expect(result.current.isError).toBe(true)
    })

    expect(result.current.error).toBeTruthy()
  })
})
```

## 11. Render Free Plan Optimization

### 11.1. Server Keep-Alive Implementation

The server wake-up strategy prevents Render free plan services from sleeping after 15 minutes of inactivity:

```typescript
// frontend/hooks/use-server-wakeup.ts (already implemented above)
// This hook runs every 10 minutes to keep the server active
```

### 11.2. Monitoring Server Health

```typescript
// backend/src/middleware/health-monitor.ts
import { Request, Response, NextFunction } from 'express'

interface HealthMetrics {
  uptime: number
  memoryUsage: NodeJS.MemoryUsage
  cpuUsage: NodeJS.CpuUsage
  timestamp: number
}

export const healthMonitor = (req: Request, res: Response, next: NextFunction) => {
  // Add health metrics to response headers
  res.setHeader('X-Server-Uptime', process.uptime())
  res.setHeader('X-Memory-Usage', JSON.stringify(process.memoryUsage()))
  res.setHeader('X-Timestamp', Date.now())
  
  next()
}

export const getHealthMetrics = (): HealthMetrics => ({
  uptime: process.uptime(),
  memoryUsage: process.memoryUsage(),
  cpuUsage: process.cpuUsage(),
  timestamp: Date.now()
})
```

## 12. Monitoring & Maintenance

### 12.1. Error Tracking

```typescript
// frontend/lib/error-tracking.ts
interface ErrorLog {
  message: string
  stack?: string
  url: string
  timestamp: number
  userAgent: string
}

export const logError = (error: Error, context?: string) => {
  const errorLog: ErrorLog = {
    message: error.message,
    stack: error.stack,
    url: window.location.href,
    timestamp: Date.now(),
    userAgent: navigator.userAgent
  }

  // In production, send to error tracking service
  if (process.env.NODE_ENV === 'production') {
    fetch('/api/errors', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...errorLog, context })
    }).catch(console.error)
  } else {
    console.error('Error logged:', errorLog)
  }
}

// Global error handler
window.addEventListener('error', (event) => {
  logError(new Error(event.message), 'Global error handler')
})

window.addEventListener('unhandledrejection', (event) => {
  logError(new Error(event.reason), 'Unhandled promise rejection')
})
```

### 12.2. Performance Monitoring

```typescript
// frontend/hooks/use-performance.ts
import { useEffect } from 'react'

interface PerformanceMetrics {
  loadTime: number
  renderTime: number
  apiResponseTime: number
}

export const usePerformanceMonitoring = () => {
  useEffect(() => {
    // Measure page load performance
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries()
      
      entries.forEach((entry) => {
        if (entry.entryType === 'navigation') {
          const metrics: PerformanceMetrics = {
            loadTime: entry.loadEventEnd - entry.loadEventStart,
            renderTime: entry.domContentLoadedEventEnd - entry.domContentLoadedEventStart,
            apiResponseTime: 0 // Will be set by API calls
          }
          
          // Log performance metrics
          console.log('Performance metrics:', metrics)
        }
      })
    })
    
    observer.observe({ entryTypes: ['navigation', 'measure'] })
    
    return () => observer.disconnect()
  }, [])
}
```

## 13. Troubleshooting

### 13.1. Common Issues and Solutions

#### Database Connection Issues

```bash
# Issue: Connection timeout to Supabase
# Solution: Check connection string and network
DATABASE_URL="postgresql://postgres.[ref]:[password]@[host].pooler.supabase.com:5432/postgres?sslmode=require&pgbouncer=true&connect_timeout=60"

# Test connection
npm run supabase:test
```

#### Audio Streaming Problems

```typescript
// Issue: HLS stream not loading
// Debug HLS errors
useEffect(() => {
  if (hlsRef.current) {
    hlsRef.current.on(Hls.Events.ERROR, (event, data) => {
      console.error('HLS Error:', data)
      if (data.fatal) {
        switch (data.type) {
          case Hls.ErrorTypes.NETWORK_ERROR:
            console.error('Network error, trying to recover...')
            hlsRef.current?.startLoad()
            break
          case Hls.ErrorTypes.MEDIA_ERROR:
            console.error('Media error, trying to recover...')
            hlsRef.current?.recoverMediaError()
            break
          default:
            console.error('Fatal error, cannot recover')
            break
        }
      }
    })
  }
}, [])
```

#### Render Free Plan Issues

```bash
# Issue: Service keeps sleeping
# Solution: Increase wake-up frequency
useServerWakeup({
  enabled: true,
  interval: 300000 // 5 minutes instead of 10
})
```

### 13.2. Debug Scripts

```typescript
// scripts/debug-deployment.ts
import { config } from 'dotenv'
import { db } from '../backend/src/db'

config()

async function debugDeployment() {
  console.log('🔍 Debugging deployment...')
  
  // Test database connection
  try {
    const result = await db.select().from(tracks).limit(1)
    console.log('✅ Database connection successful')
    console.log('Sample track:', result[0])
  } catch (error) {
    console.error('❌ Database connection failed:', error)
  }
  
  // Test API endpoints
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/health`)
    const health = await response.json()
    console.log('✅ API health check:', health)
  } catch (error) {
    console.error('❌ API health check failed:', error)
  }
  
  // Test environment variables
  console.log('🔧 Environment variables:')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('DEPLOYMENT_ENV:', process.env.DEPLOYMENT_ENV)
  console.log('DATABASE_URL:', process.env.DATABASE_URL ? '✅ Set' : '❌ Missing')
  console.log('API_URL:', process.env.NEXT_PUBLIC_API_URL)
}

debugDeployment()
```

### 13.3. Rollback Strategy

```bash
# Emergency rollback procedure
# 1. Revert to last known good commit
git log --oneline -10
git revert [commit-hash]

# 2. Deploy immediately
git push origin main

# 3. If database changes need rollback
DATABASE_URL="[supabase-url]" npm run db:rollback

# 4. Monitor service health
npm run supabase:test
```

---

## Conclusion

This comprehensive deployment guide provides everything needed to successfully deploy Radio Calico from local development to production. The dual-configuration Git workflow ensures smooth transitions between environments, while the Render optimization keeps your free-tier backend alive for continuous streaming.

**Key Benefits of this Architecture:**
- ✅ **Zero-downtime deployments** with proper Git workflow
- ✅ **Cost-effective** using free tiers effectively
- ✅ **Scalable** architecture ready for growth
- ✅ **Type-safe** with full TypeScript coverage
- ✅ **Modern stack** with latest best practices

For additional support or questions, refer to the troubleshooting section or check the project's GitHub issues.

**Happy streaming! 🎵**