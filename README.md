# Radio Calico 📻

![License](https://img.shields.io/badge/license-MIT-green) ![Version](https://img.shields.io/badge/version-1.0.0-lightgrey) ![Next.js](https://img.shields.io/badge/Next.js-15+-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## 🔗 Live Demo

Experience Radio Calico in action! The application is deployed and ready to explore:

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-RadioCalico-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://radio-calico-ehkarabas.vercel.app/)

**✨ Try it now:** [https://radio-calico-ehkarabas.vercel.app/](https://radio-calico-ehkarabas.vercel.app/)

> **🔐 Privacy Note:** Authentication routes are configured as private and require proper user credentials for access.

## 📋 Table of Contents

- [📖 About The Project](#-about-the-project)
- [✨ Key Features](#-key-features)
- [🛠️ Built With](#️-built-with)
- [🚀 Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Configuration](#environment-configuration)
- [💻 Usage](#-usage)
- [📜 Project Scripts](#-project-scripts)
- [🐳 Docker Development](#-docker-development)
- [🗄️ Database Management](#️-database-management)
- [🔄 Git Workflow](#-git-workflow)
- [🚀 Deployment](#-deployment)
- [🧪 Testing](#-testing)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 📖 About The Project

Radio Calico is a modern, full-stack online radio streaming web application delivering high-quality HLS audio with real-time metadata and social interaction features. Built with Next.js 15 and powered by Prisma + PostgreSQL, it provides an immersive music listening experience optimized for mobile-first responsive design.

### 🎯 Project Vision
Crafted as an MVP-focused development project, Radio Calico demonstrates modern web development practices including comprehensive authentication, real-time streaming, responsive UI patterns, and production-ready deployment strategies. The application emphasizes rapid prototyping with attention to user experience and technical excellence.

### 🏗️ Architecture Highlights
- **Full-Stack TypeScript**: End-to-end type safety
- **Mobile-First Responsive**: Ultra-responsive design from 280px to desktop
- **Complete Authentication**: Private auth system with OAuth, magic links, and password management
- **Modern State Management**: React Query v5 with optimistic updates
- **Production-Ready**: Dual-branch configuration system for streamlined development-to-production workflows

## ✨ Key Features

### 🎵 Radio & Audio Experience
- **🎵 HLS Audio Streaming**: High-definition lossless audio streaming via HTTP Live Streaming
- **📊 Real-time Track Metadata**: Currently playing song information (artist, title, album, year)
- **👍 Interactive Rating System**: Thumbs up/down rating with database persistence
- **🎛️ Audio Controls**: Volume control, play/pause with persistent state
- **📈 Previously Played Tracks**: Historical track listing from metadata service

### 🔐 Enterprise-Grade Authentication System (Closed Source)
> **🔒 Proprietary Security:** Authentication system is designed as a closed-source, enterprise-grade solution and is **not included in this public repository** for security reasons.

**🏢 Commercial Implementation Features:**
- **🌐 OAuth Integration**: Secure Google & GitHub providers with smart consent management
- **🔑 Password Management**: Advanced password setup flow for OAuth users  
- **⚡ Enterprise Rate Limiting**: Multi-layer protection with IP & email-based throttling
- **📧 Magic Link System**: Passwordless authentication with dedicated SMTP infrastructure
- **📝 Advanced Registration**: Multi-step signup with email activation and verification
- **🔓 Secure Recovery**: Encrypted password reset with time-limited tokens
- **🔑 Traditional Auth**: Enhanced email/password login with security hardening
- **👤 Profile Management Suite**: Enterprise user management with:
  - Secure profile modification workflows
  - OAuth account linking/unlinking without session disruption
  - GDPR-compliant soft delete with data retention policies
  - Secure session invalidation across all devices
- **🛡️ Advanced Security**: JWT encryption, CSRF tokens, rate limiting, audit logging

**📋 Documentation Access:**
- Authentication system documentation is available separately for licensed implementations
- Contact for enterprise licensing and implementation details
- Reference implementation patterns can be found in `/docs/local/tech/authentication-guideline.md`

### 🎨 Modern UI/UX & Development Excellence
- **📱 Ultra-Responsive Design**: Mobile-first architecture supporting devices from 280px to 4K (8 breakpoints)
- **🔄 Optimistic Updates**: Real-time user experience with React Query v5 state management
- **🌐 MVP-Focused Development**: Rapid prototyping with production-ready modern UI/UX patterns
- **🎨 Advanced Theme System**: Complete light/dark mode with next-themes + Tailwind v4 integration
- **🏗️ SEO-Optimized**: Next.js metadata API, structured data, and OpenGraph optimization
- **🔧 Dual Configuration**: Streamlined local/remote environment with automated CI/CD preparation
- **🚀 Modern Tech Stack**: Next.js 15 App Router + TypeScript + React Query v5 + Framer Motion + shadcn/ui
- **🎯 Accessibility First**: WCAG compliant with semantic HTML and keyboard navigation
- **⚡ Performance Optimized**: Image optimization, lazy loading, and Core Web Vitals focused

## 🛠️ Built With

### 🎨 Frontend Stack (Mobile-First Excellence)
- **⚡ Framework**: Next.js 15+ with App Router (SSR/SSG optimization)
- **🎨 UI Library**: shadcn/ui + Radix UI primitives (accessibility-first components)
- **📱 Styling**: Tailwind CSS v4 with custom breakpoints (280px → 4K responsive)
- **🔄 State Management**: React Query v5 (TanStack Query) with optimistic updates
- **✨ Animation**: Framer Motion (smooth + spring mixed animations)
- **🌙 Theme System**: next-themes with Tailwind v4 dark mode variants
- **📝 Form Handling**: React Hook Form + Zod validation (type-safe forms)
- **🔒 Type Safety**: TypeScript 5.0+ with strict configuration
- **🎵 Audio Player**: Custom HLS implementation with hls.js streaming
- **🎯 Icons**: Lucide React (tree-shakable icon library)
- **🔔 Notifications**: Sonner toast with theme-aware styling
- **🖼️ Image Optimization**: Next.js Image with responsive loading
- **🎯 SEO Tools**: Next.js Metadata API with OpenGraph support

### 🗄️ Backend & Database (Production-Ready)
- **💾 Database**: PostgreSQL (cloud-hosted production with local development)
- **🔗 ORM**: Prisma with full TypeScript integration and type-safe queries
- **🔐 Authentication**: Enterprise NextAuth.js system (closed source - not in public repo)
- **⚡ API Architecture**: Next.js API routes + Server Actions (RSC patterns)
- **📊 Schema Management**: Prisma migrations with version control
- **🛡️ Security Layer**: Rate limiting, CSRF protection, and SQL injection prevention
- **📧 Email Service**: SMTP integration for magic links and notifications
- **🔄 Real-time Features**: Server-sent events for metadata updates

### 🚀 MVP Development Stack (Rapid Prototyping)
- **🔧 Configuration**: Dual-branch setup (config/local ↔ config/remote) for streamlined workflows
- **⚡ Development Mode**: Vibe coding approach with rapid iteration and modern patterns
- **🎨 UI Excellence**: Mobile-first responsive design with 8 custom breakpoints (280px+)
- **✨ Animation System**: Framer Motion smooth transitions + spring physics effects
- **🛡️ Error Handling**: React Error Boundaries with graceful fallback components
- **🔄 Hot Reload**: Fast refresh with instant feedback during development
- **📊 Performance Monitoring**: Core Web Vitals tracking and optimization

### 🚀 Deployment & Production Tools
- **🌐 Frontend Deploy**: Vercel with Next.js optimization and automatic deployments
- **💾 Database**: PostgreSQL cloud hosting with connection pooling
- **📝 Version Control**: Git with simplified MVP dual-branch workflow
- **📦 Package Manager**: npm with optimized dependency management
- **⚡ Development Tools**: Hot reload + Fast Refresh with instant code updates
- **🔍 Monitoring**: Real-time error tracking and performance analytics
- **🛡️ Security**: Automated security scanning and vulnerability detection

## 🚀 Getting Started

To get a local copy up and running, follow these steps.

### Prerequisites

Make sure you have the following installed on your machine:

- **Node.js** (v22 or higher)
  ```sh
  node --version
  ```
- **npm** (latest version)
  ```sh
  npm install npm@latest -g
  ```
- **PostgreSQL** (for local database)
  ```sh
  psql --version
  ```

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ehkarabas/radio-calico.git
   ```

2. Navigate to the project directory:
   ```sh
   cd radio-calico
   ```

3. Install dependencies:
   ```sh
   # Install all dependencies (frontend)
   npm install
   ```

### Environment Configuration

#### Local Development Setup

1. Create local environment file:

   **Frontend (.env.local):**
   ```env
   # Database Configuration
   DATABASE_URL="postgresql://postgres:postgres@127.0.0.1:5432/radio_calico"
   
   # NextAuth Configuration (Closed Source Authentication)
   # Note: Full auth implementation is proprietary - these are reference configs
   NEXTAUTH_SECRET="your-nextauth-secret"
   NEXTAUTH_URL="http://localhost:3000"
   
   # OAuth Providers (Enterprise Auth System - Not in Public Repo)
   # Configure these for your licensed implementation
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_ID="your-github-client-id"
   GITHUB_SECRET="your-github-client-secret"
   
   # Email Provider (Magic Links & Notifications)
   EMAIL_SERVER="smtp://username:password@smtp.example.com:587"
   EMAIL_FROM="noreply@your-domain.com"
   
   # Environment Settings
   NODE_ENV="development"
   DEPLOYMENT_ENV="local"
   
   # Radio Stream Configuration
   STREAM_URL="http://localhost:8080/stream.m3u8"
   
   # Security & Rate Limiting
   RATE_LIMIT_MAX_ATTEMPTS="5"
   RATE_LIMIT_WINDOW_MS="900000"
   
   # Theme & UI Configuration
   DEFAULT_THEME="light"
   ENABLE_THEME_PERSISTENCE="true"
   ```

2. Setup local database:
   ```sh
   # Create database
   createdb radio_calico
   
   # Setup Prisma
   npx prisma migrate dev
   npx prisma generate
   ```

#### Production Setup (Cloud Database)

1. Create a PostgreSQL database on your preferred cloud provider

2. Create production environment file:

   **Frontend (.env.production):**
   ```env
   # Production Database Configuration
   DATABASE_URL="postgresql://username:password@host:5432/radio_calico"
   
   # NextAuth Configuration (Enterprise Closed Source)
   # Note: Production auth system is proprietary and not included in public repo
   NEXTAUTH_SECRET="your-secure-nextauth-secret-256bit"
   NEXTAUTH_URL="https://your-production-domain.com"
   
   # OAuth Providers (Licensed Enterprise Implementation)
   # Full implementation available through commercial licensing
   GOOGLE_CLIENT_ID="your-production-google-client-id"
   GOOGLE_CLIENT_SECRET="your-production-google-client-secret"
   GITHUB_ID="your-production-github-client-id"
   GITHUB_SECRET="your-production-github-client-secret"
   
   # Email Provider (Production SMTP)
   EMAIL_SERVER="smtp://username:password@your-smtp-server.com:587"
   EMAIL_FROM="noreply@your-production-domain.com"
   
   # Production Environment Settings
   NODE_ENV="production"
   DEPLOYMENT_ENV="remote"
   
   # Production Radio Stream
   STREAM_URL="https://stream.example.com/radio.m3u8"
   
   # Production Security Settings
   RATE_LIMIT_MAX_ATTEMPTS="3"
   RATE_LIMIT_WINDOW_MS="900000"
   
   # SEO & Analytics
   NEXT_PUBLIC_GA_ID="your-google-analytics-id"
   NEXT_PUBLIC_DOMAIN="your-production-domain.com"
   
   # Performance & Monitoring
   ENABLE_ANALYTICS="true"
   ENABLE_ERROR_REPORTING="true"
   ```

## 💻 Usage

### Development Server

Start the development server:

```sh
# Start Next.js development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Key Components

#### HLS Audio Player
Modern streaming audio player with:
- High-definition lossless audio streaming
- Custom HLS implementation with hls.js
- Volume control with persistent state
- Play/pause functionality
- Real-time stream quality monitoring

#### Track Rating System
Interactive rating system featuring:
- Thumbs up/down voting with database persistence
- Real-time vote counts and aggregation
- Optimistic UI updates with React Query
- User rating history tracking

#### Real-time Metadata Display
Dynamic track information showing:
- Currently playing song details (title, artist, album, year)
- Album artwork integration from metadata service
- Stream quality and source information
- Previously played tracks history

## 📜 Project Scripts

> **⚠️ Authentication Notice:** Some authentication-related scripts are not available in the public repository as the auth system is proprietary.

### Development Scripts
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production  
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Database Scripts  
- `npx prisma migrate dev` - Run database migrations
- `npx prisma generate` - Generate Prisma client
- `npx prisma studio` - Open Prisma Studio (database GUI)
- `npx prisma db push` - Push schema changes to database

### Git Workflow Scripts (MVP Configuration)
- `git checkout config/local` - Switch to local development
- `git checkout config/remote` - Switch to production config
- `npm run ci:prepare:local` - Prepare local environment
- `npm run ci:prepare:production` - Prepare production environment

## 🗄️ Local Development with PostgreSQL + Prisma

### Prisma Database Development

```sh
# Setup Prisma schema
npx prisma init

# Create and run migrations
npx prisma migrate dev --name init

# Generate Prisma client
npx prisma generate

# View database with Prisma Studio
npx prisma studio
```

### Local Database Connection Details

- **Host**: `127.0.0.1`
- **Port**: `5432`
- **Database**: `radio_calico`
- **Username**: `postgres`
- **Password**: `postgres`

## 🗄️ Database Management

### Schema Overview

Radio Calico uses PostgreSQL with Prisma ORM featuring comprehensive authentication and track management systems:

```prisma
// Authentication & User Management
model User {
  id             String           @id @default(cuid())
  name           String?
  email          String           @unique
  emailVerified  DateTime?
  image          String?
  deletedAt      DateTime?        // Soft delete support
  createdAt      DateTime         @default(now())
  updatedAt      DateTime         @updatedAt
  activated      Boolean          @default(false)
  password       String?
  accounts       Account[]
  authenticators Authenticator[]  // WebAuthn support
  passwordResets PasswordReset[]
  sessions       Session[]
  tracks         Track[]          // Track history
  preferences    UserPreferences?
  
  @@map("users")
}

model Account {
  id                String    @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String?
  access_token      String?
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String?
  session_state     String?
  createdAt         DateTime  @default(now())
  updatedAt         DateTime  @updatedAt
  disconnectedAt    DateTime? // OAuth disconnect tracking
  reconnectRequired Boolean   @default(false)
  user              User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
  @@map("accounts")
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  createdAt    DateTime @default(now())
  updatedAt    DateTime @updatedAt
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("sessions")
}

// Enhanced Authentication Features
model EmailVerification {
  id        String    @id @default(cuid())
  email     String
  token     String    @unique
  expires   DateTime
  verified  Boolean   @default(false)
  attempts  Int       @default(0)
  lastUsed  DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([email, expires])
  @@map("email_verifications")
}

model SignupActivation {
  id        String    @id @default(cuid())
  email     String
  name      String
  password  String
  token     String    @unique
  expires   DateTime
  activated Boolean   @default(false)
  attempts  Int       @default(0)
  ipAddress String?
  userAgent String?
  lastUsed  DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt

  @@index([email, expires])
  @@index([token, expires])
  @@map("signup_activations")
}

model PasswordReset {
  id        String    @id @default(cuid())
  userId    String
  token     String    @unique
  expires   DateTime
  used      Boolean   @default(false)
  attempts  Int       @default(0)
  ipAddress String?
  userAgent String?
  lastUsed  DateTime?
  createdAt DateTime  @default(now())
  updatedAt DateTime  @updatedAt
  user      User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, expires])
  @@map("password_resets")
}

model AuthRateLimit {
  id           String    @id @default(cuid())
  identifier   String
  type         String
  attempts     Int       @default(1)
  windowStart  DateTime  @default(now())
  lastAttempt  DateTime  @default(now())
  blocked      Boolean   @default(false)
  blockedUntil DateTime?
  createdAt    DateTime  @default(now())
  updatedAt    DateTime  @updatedAt
  expiresAt    DateTime  @default(dbgenerated("(now() + '01:00:00'::interval)"))

  @@unique([identifier, type])
  @@index([identifier, type, windowStart])
  @@index([expiresAt])
  @@map("auth_rate_limits")
}

// Track Management & Radio Features
model Track {
  id         String    @id @default(cuid())
  title      String
  artist     String
  album      String?
  coverArt   String?   // Album artwork URL
  duration   Int?      // Duration in seconds
  streamUrl  String?   // HLS stream URL
  isrc       String?   // International Standard Recording Code
  userId     String
  listenedAt DateTime  @default(now())
  isFavorite Boolean   @default(false)
  rating     Int?      // User rating (1-5 stars)
  deletedAt  DateTime? // Soft delete support
  createdAt  DateTime  @default(now())
  updatedAt  DateTime  @updatedAt
  user       User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@index([userId, listenedAt(sort: Desc)])  // Recent tracks
  @@index([userId, isFavorite])              // Favorites lookup
  @@index([userId, deletedAt])               // Active tracks
  @@map("tracks")
}

model UserPreferences {
  id                  String    @id @default(cuid())
  userId              String    @unique
  recentTracksVisible Boolean   @default(true)
  drawerAutoOpen      Boolean   @default(false)
  theme               String    @default("system")   // light/dark/system
  maxHistoryItems     Int       @default(100)
  showCoverArt        Boolean   @default(true)
  autoMarkFavorites   Boolean   @default(false)
  deletedAt           DateTime? // Soft delete support
  createdAt           DateTime  @default(now())
  updatedAt           DateTime  @updatedAt
  user                User      @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@map("user_preferences")
}

// NextAuth.js Required Models
model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
  @@map("verificationtokens")
}

model Authenticator {
  credentialID         String  @unique
  userId               String
  providerAccountId    String
  credentialPublicKey  String
  counter              Int
  credentialDeviceType String
  credentialBackedUp   Boolean
  transports           String?
  user                 User    @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@id([userId, credentialID])
  @@map("authenticators")
}
```

### Database Schema Management

> **🔒 Schema Notice:** Authentication-related models and tables are part of the closed-source implementation and may not be fully represented in the public schema.

- **Primary Reference**: Check `prisma/schema.prisma` (public models only)
- **Migrations**: Use `npx prisma migrate dev` (core features only)
- **Schema Location**: `prisma/schema.prisma` (excludes proprietary auth models)
- **Enterprise Models**: Full schema with auth models available through licensing

## 🔄 Git Workflow

The project uses a simplified dual-configuration strategy for MVP development:

### Branch Structure (MVP Mode)
```
main                 # Production deployment branch (NEVER commit directly)
├── config/local     # MVP development branch (ALL work here)  
└── config/remote    # Production-ready configuration (for deploy)
```

### MVP Development Workflow

```sh
# Phase 1: Development Start
git checkout config/local
npm run ci:prepare:local
git merge main --no-ff -m "sync: bring latest main changes to development"

# Phase 2: MVP Development Cycle (repeat frequently)
# All MVP features happen on config/local branch
# Frequent commits are important for rollback capability
git add .
git commit -m "feat: implement radio player component"
git push origin config/local

# Phase 3: Production Preparation (when explicitly requested)
git checkout config/remote
npm run ci:prepare:production
git merge config/local --no-ff -X theirs -m "merge: bring MVP features to production config"
npm run build
git push origin config/remote

# Phase 4: Deployment (when explicitly requested)
git checkout main
git merge config/remote --no-ff -X theirs -m "deploy: MVP release to production"
git push origin main
git checkout config/local  # ALWAYS return to local
```

### Key MVP Rules
- **Development**: Only work on `config/local` branch
- **Testing**: Test frequently with local Supabase setup  
- **Commits**: Small, frequent commits for easy rollback
- **Deploy**: Only when explicitly requested

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard:
   ```env
   DATABASE_URL=postgresql://username:password@host:5432/radio_calico
   NEXTAUTH_SECRET=your-secure-nextauth-secret
   NEXTAUTH_URL=https://your-domain.vercel.app
   STREAM_URL=https://stream.example.com/radio.m3u8
   NODE_ENV=production
   DEPLOYMENT_ENV=remote
   
   # OAuth Providers (configure for production)
   GOOGLE_CLIENT_ID=your-production-google-client-id
   GOOGLE_CLIENT_SECRET=your-production-google-client-secret
   GITHUB_ID=your-production-github-client-id
   GITHUB_SECRET=your-production-github-client-secret
   
   # Email Provider
   EMAIL_SERVER=smtp://username:password@your-smtp-server.com:587
   EMAIL_FROM=noreply@your-production-domain.com
   ```
3. Deploy automatically on push to main branch

### Manual Deployment Steps

```sh
# 1. Prepare production configuration
git checkout config/remote
npm run ci:prepare:production

# 2. Test production build locally
npm run build
npm run start

# 3. Deploy to main branch (triggers Vercel deploy)
git checkout main
git merge config/remote --no-ff -X theirs -m "deploy: MVP release"
git push origin main
```

## 🧪 Testing & Quality Assurance

### MVP Development Note
During MVP phase, comprehensive testing is temporarily minimal to focus on rapid iteration and modern UI/UX development.

### Manual Testing Focus
- **HLS Audio Streaming**: Test audio playback across devices
- **Rating System**: Verify thumbs up/down functionality
- **Responsive Design**: Test across mobile/desktop breakpoints  
- **Real-time Metadata**: Confirm track information updates
- **Theme System**: Validate light/dark mode transitions

### Future Testing Implementation
Post-MVP, comprehensive testing will include:
- Playwright E2E tests for user interactions
- Jest unit tests for utility functions
- React Testing Library for component testing
- Audio streaming integration tests

## 🤝 Contributing

Contributions are welcome! Please follow the MVP development approach:

### MVP Development Workflow

1. Fork the Project
2. Create your Feature Branch from `config/local`:
   ```sh
   git checkout config/local
   git checkout -b feature/radio-player-enhancement
   ```
3. Follow MVP guidelines:
   - Use shadcn/ui for all UI components
   - Implement responsive mobile-first design
   - Follow React Query v5 patterns
   - Use Framer Motion for animations
4. Test with local PostgreSQL setup
5. Run linting: `npm run lint`
6. Commit your Changes: `git commit -m 'feat: enhance radio player controls'`
7. Push to your Branch: `git push origin feature/radio-player-enhancement`
8. Open a Pull Request targeting `config/local`

### Code Style Guidelines

- **TypeScript**: Strict type safety for all components
- **shadcn/ui**: Use shadcn components instead of native HTML elements
- **Mobile-First**: Responsive design with Tailwind CSS
- **React Query v5**: State management and data fetching patterns
- **Framer Motion**: Smooth + spring animation combinations
- **NextAuth.js**: Use NextAuth.js with @auth/prisma-adapter for authentication
- **Conventional Commits**: Use conventional commit message format

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**🎵 Radio Calico** - Bringing you the best music streaming experience with modern web technologies.
