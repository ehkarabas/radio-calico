# Radio Calico 📻

![License](https://img.shields.io/badge/license-MIT-green) ![Version](https://img.shields.io/badge/version-1.0.0-lightgrey) ![Next.js](https://img.shields.io/badge/Next.js-15+-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

## 🔗 Live Demo

Experience Radio Calico in action! The application is deployed and ready to explore:

[![Live Demo](https://img.shields.io/badge/🚀%20Live%20Demo-RadioCalico-blue?style=for-the-badge&logo=vercel&logoColor=white)](https://radio-calico-ehkarabas.vercel.app/)

**✨ Try it now:** [https://radio-calico-ehkarabas.vercel.app/](https://radio-calico-ehkarabas.vercel.app/)

> **🔐 Privacy Note:** Authentication routes are configured as private and require proper user credentials for access.

## 📋 Table of Contents

- [📖 About The Project](#-about-the-project)
- [🎯 MVP Domain Logic](#-mvp-domain-logic)
- [✨ Key Features](#-key-features)
- [🏗️ Architecture Overview](#️-architecture-overview)
- [🛠️ Built With](#️-built-with)
- [🚀 Getting Started](#-getting-started)
- [💻 Usage](#-usage)
- [🗄️ Database Management](#️-database-management)
- [🔄 Git Workflow](#-git-workflow)
- [🚀 Deployment](#-deployment)
- [🤝 Contributing](#-contributing)
- [📄 License](#-license)

## 📖 About The Project

Radio Calico is a modern, full-stack online radio streaming web application delivering high-quality radio streaming with real-time metadata, interactive track history, and social features. Built with Next.js 15 and powered by Prisma + PostgreSQL, it provides an immersive music listening experience optimized for mobile-first responsive design.

### 🎯 Project Vision
Crafted as an MVP-focused development project, Radio Calico demonstrates modern web development practices including comprehensive authentication, real-time streaming, responsive UI patterns, and production-ready deployment strategies. The application emphasizes rapid prototyping with attention to user experience and technical excellence.

## 🎯 MVP Domain Logic

Radio Calico MVP follows a modern **3-panel layout architecture** with drawer-based navigation and real-time streaming functionality:

### 🏗️ Core Layout Structure

#### **Main Application Architecture:**
- **Header Panel**: Drawer toggle, logo, settings dropdown with theme toggle & logout
- **Streaming Area**: Central radio player with real-time metadata, controls, and interaction buttons  
- **Footer Panel**: Recent 5 tracks with quick actions (responsive: popover on mobile)
- **Track History Drawer**: 280px sidebar with infinite scroll, search, and track management

#### **Track History System (MVP Core Feature):**
- **Infinite Scroll Loading**: Lazy-loaded pagination with smooth scroll performance
- **Active/Passive Context**: Click-to-activate track items with expanded action buttons
- **Search & Filter**: Real-time search through listening history
- **Delete from History**: Remove tracks from history (affects favorites & footer sync)
- **Cross-Component Sync**: Drawer ↔ Footer ↔ Favorites page synchronization

#### **Interactive Streaming Experience:**
- **Real-time Metadata**: Live track info (title, artist, album, year, cover art)
- **Rate & Favorite System**: Thumbs up/down + heart favorite with database persistence  
- **Audio Controls**: Volume, play/pause with modern shadcn/ui player interface
- **Track Context Management**: Active track state across all components

#### **Responsive Mobile-First Design:**
- **280px+ Support**: Ultra-responsive from smallest devices to desktop
- **Drawer Behavior**: Overlay drawer on mobile (< 1024px), persistent on desktop
- **Footer Adaptation**: Collapsible to popover or hidden on small screens
- **Animation System**: Framer Motion smooth + spring mixed animations

### 🔄 Data Flow & Synchronization

**Centralized State Management:**
```
Radio Stream → Track Metadata → Database Storage → UI Sync
     ↓              ↓              ↓           ↓
Stream Service → Track Service → API Routes → React Query
     ↓              ↓              ↓           ↓  
   Streaming     Track History   Favorites   Footer
     Area    →     Drawer     →   Page    →   Panel
```

**Cross-Component Synchronization:**
- **Favorite Toggle**: Updates drawer list + favorites page + footer icons simultaneously
- **History Deletion**: Removes from history + favorites (if favorited) + footer (if recent)
- **Rating System**: Thumbs up/down affects all component displays in real-time
- **Active Track State**: Single active track context shared across all components

### 🎨 Modern UI/UX Patterns

**Design System:**
- **shadcn/ui Components**: Button, Card, Drawer, Popover, Toggle, etc.
- **Framer Motion**: Smooth transitions with spring physics for interactions
- **Theme System**: next-themes + Tailwind v4 dark/light mode with persistence
- **Responsive Breakpoints**: 8 custom breakpoints (280px → 4K) for pixel-perfect layouts

**Interaction Patterns:**
- **Hover Effects**: Track items reveal action buttons on hover
- **Click Context**: Active/passive track states with expanded UI options  
- **Progressive Disclosure**: Footer collapses to popover, drawer overlays on mobile
- **Optimistic Updates**: React Query v5 with immediate UI feedback

## ✨ Key Features

### 🎵 Core Radio Experience
- **🎵 HLS Radio Streaming**: Continuous radio stream with high-quality audio
- **📊 Real-time Metadata**: Live track information (artist, title, album, year, cover art)
- **🎛️ Modern Audio Controls**: Volume control, play/pause with persistent state
- **📈 Track History Management**: Complete listening history with infinite scroll
- **👍 Interactive Rating System**: Thumbs up/down with real-time database sync
- **❤️ Favorites System**: Heart-based favorites with cross-component synchronization
- **🗑️ History Cleanup**: Delete tracks from history with cascading updates

### 🎨 Modern UI/UX Excellence
- **📱 Ultra-Responsive Design**: Mobile-first architecture (280px → 4K, 8 breakpoints)
- **🎨 Advanced Animation System**: Framer Motion smooth + spring mixed transitions
- **🌙 Complete Theme System**: Light/dark mode with next-themes + Tailwind v4
- **🔄 Optimistic Updates**: React Query v5 with instant UI feedback
- **♿ Accessibility First**: WCAG compliant with semantic HTML and keyboard navigation
- **🎯 Mobile-First Drawer**: 280px drawer with overlay/persistent behavior
- **📊 Smart Footer**: Recent tracks with responsive popover adaptation

### 🗄️ Track Management System
- **📜 Infinite History**: Lazy-loaded track history with search and filtering
- **🔍 Advanced Search**: Real-time search through listening history
- **🎯 Active Context**: Click-activated track items with expanded actions
- **🔗 Cross-Sync**: Drawer ↔ Footer ↔ Favorites automatic synchronization
- **🗑️ Smart Delete**: History deletion with cascading updates to all components
- **❤️ Favorites Integration**: Seamless favorite/unfavorite across all UI areas

### 📊 Global Statistics & Analytics
- **🏆 Most Played Tracks**: Platform-wide track rankings by total listen counts
- **⭐ Rating System Statistics**: Highest and lowest rated tracks with voting data
- **❤️ Community Favorites**: Most favorited tracks across all users
- **👥 Top Listeners**: Leaderboard of users with most tracked listening activity
- **📈 Real-time Analytics**: Live platform statistics with automatic data generation
- **🔄 Privacy-First Display**: Anonymized user display (initials only) for public stats

### 🔐 Enterprise Authentication (Closed Source)
> **🔒 Proprietary Security:** Authentication system is designed as a closed-source, enterprise-grade solution and is **not included in this public repository** for security reasons.

**🏢 Production-Ready Features:**
- **🌐 OAuth Integration**: Google & GitHub with smart consent management
- **📧 Magic Link System**: Passwordless authentication with SMTP infrastructure  
- **👤 Profile Management**: Secure user settings with data retention policies
- **🛡️ Advanced Security**: Rate limiting, CSRF protection, audit logging

### 🎵 Core Domain Logic (Closed Source)
> **🎯 Proprietary Business Logic:** Core radio streaming functionality and advanced features are proprietary and **not included in this public repository** for commercial reasons.

**📁 Protected Components & Services:**
- **🎧 Radio Streaming Engine**: HLS stream processing and metadata extraction (`frontend/app/api/stream/`)
- **🏗️ Layout Architecture**: Advanced responsive layout system (`frontend/components/layout/`)
- **⚙️ Core Services**: Business logic services and data processing (`frontend/lib/services/`)
- **🔧 Utility Functions**: Specialized helper functions and validation (`frontend/lib/utils/`)
- **🗄️ Database Schema**: Complete production database models and migrations (`prisma/`)

## 🏗️ Architecture Overview

### 🎨 Frontend Architecture (MVP-Focused)

**Component Hierarchy:**
```
HomePage (app/page.tsx)
├── Header (layout/header.tsx)
│   ├── Drawer Toggle
│   ├── Logo + Title
│   └── Settings Dropdown (theme + logout)
├── StreamingArea (radio/streaming-area.tsx)
│   ├── Cover Art Display
│   ├── Track Metadata
│   ├── Rating Controls (thumbs up/down)
│   ├── Favorite Toggle (heart)
│   └── Audio Player Controls
├── RecentTracksFooter (layout/recent-tracks-footer.tsx)
│   ├── Recent 5 Tracks List
│   ├── Quick Actions (rate/favorite/delete)
│   └── Responsive Popover (mobile)
└── TrackHistoryDrawer (layout/track-history-drawer.tsx)
    ├── Search Input
    ├── Infinite Scroll List
    ├── Active/Passive Track Items
    ├── Action Buttons (favorite/delete)
    └── Theme Toggle + User Dropdown
```

**API Route Structure:**
```
/api/tracks/
├── favorites/route.ts          # User favorites list
├── history/route.ts            # Track history with pagination
├── history/search/route.ts     # Search through history
├── [id]/route.ts               # Individual track operations
├── [id]/favorite/route.ts      # Toggle favorite status
├── [id]/rating/route.ts        # Submit thumbs up/down
└── [id]/user-data/route.ts     # User-specific track data

/api/stats/
└── route.ts                    # Global platform statistics
    ├── Most played tracks      # Ordered by totalListens
    ├── Highest/Lowest rated    # Ordered by community ratings
    ├── Most favorited tracks   # Ordered by favoriteCount
    └── Top listeners           # Users with most track listens
```

### 🗄️ Database Architecture

**Core Models:**
```prisma
model UserTrack {
  id          String    @id @default(cuid())
  userId      String
  trackId     String
  listenedAt  DateTime  @default(now())
  isFavorite  Boolean   @default(false)
  userRating  Int?      // 1 (thumbs down) or 5 (thumbs up)
  listenCount Int       @default(1)
  deletedAt   DateTime? // Soft delete support
  
  @@unique([userId, trackId])
  @@index([userId, listenedAt(sort: Desc)])
  @@index([userId, isFavorite])
}

model Track {
  id            String    @id @default(cuid())
  title         String
  artist        String
  album         String?
  coverArtUrl   String?
  year          String?
  totalListens  Int       @default(0)
  upvotes       Int       @default(0)
  downvotes     Int       @default(0)
  favoriteCount Int       @default(0)
  rating        Float     @default(0)
  usersListened String[]  // Array of user IDs
  lastListenedAt DateTime @default(now())
  
  @@unique([title, artist, album])
}
```

**Race Condition Protection:**
- **Database-Level ACID**: PostgreSQL atomic operations with unique constraints
- **Application-Level UPSERT**: Comprehensive race condition handling with retry logic  
- **Transaction Management**: Complex operations wrapped in Prisma transactions
- **Optimistic Locking**: Conflict resolution with exponential backoff

## 🛠️ Built With

### 🎨 Frontend Stack (Mobile-First Excellence)
- **⚡ Framework**: Next.js 15 with App Router + Server Components
- **🎨 UI Library**: shadcn/ui + Radix UI (accessibility-first components)
- **📱 Styling**: Tailwind CSS v4 with 8 custom breakpoints (280px+)
- **🔄 State Management**: React Query v5 (TanStack Query) with optimistic updates
- **✨ Animation**: Framer Motion (smooth + spring mixed animations)
- **🌙 Theme System**: next-themes with Tailwind v4 dark mode variants
- **📝 Form Handling**: React Hook Form + Zod validation
- **🎵 Audio Streaming**: Custom HLS implementation for radio streaming
- **🔒 Type Safety**: TypeScript 5.0+ with strict configuration

### 🗄️ Backend Stack (Production-Ready)
- **💾 Database**: PostgreSQL with Prisma ORM
- **🔐 Authentication**: NextAuth.js enterprise system (proprietary)
- **⚡ API Architecture**: Next.js API routes + Server Actions
- **🛡️ Security**: Rate limiting, CSRF protection, SQL injection prevention
- **📊 Real-time**: Server-sent events for metadata updates
- **🔄 Race Protection**: Comprehensive race condition handling

### 🚀 MVP Development Tools
- **🔧 Configuration**: Dual-branch setup (config/local ↔ config/remote)
- **⚡ Development**: Rapid prototyping with hot reload
- **🎨 Design System**: Mobile-first responsive with pixel-perfect layouts
- **🛡️ Error Handling**: React Error Boundaries with graceful fallbacks
- **📊 Performance**: Core Web Vitals optimization

## 🚀 Getting Started

### Prerequisites

- **Node.js** (v22 or higher)
- **npm** (latest version)  
- **PostgreSQL** (for database)

### Installation

1. Clone the repository:
   ```sh
   git clone https://github.com/ehkarabas/radio-calico.git
   cd radio-calico
   ```

2. Install dependencies:
   ```sh
   npm install
   ```

3. Setup environment:
   ```sh
   # Copy environment template
   cp .env.local.example .env.local
   
   # Setup database
   createdb radio_calico
   npx prisma migrate dev
   npx prisma generate
   ```

4. Start development:
   ```sh
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 💻 Usage

### Key Components

#### 🎵 Streaming Area (Central Player)
- **Real-time Metadata**: Live track information with cover art
- **Audio Controls**: Volume, play/pause with persistent state
- **Rating System**: Thumbs up/down with database persistence
- **Favorite Toggle**: Heart icon for adding/removing favorites

#### 📊 Global Statistics Dashboard (`/stats`)
- **Analytics Overview**: 5 comprehensive statistics categories
- **Responsive Design**: Mobile-first with sticky header and smooth animations
- **Real-time Updates**: Live data generation with timestamp display
- **Privacy Protection**: Anonymized user display for public statistics
- **Performance Optimized**: Parallel database queries with error boundaries

#### 📜 Track History Drawer (280px Sidebar)
- **Infinite Scroll**: Lazy-loaded track history with smooth performance
- **Search Functionality**: Real-time search through listening history
- **Active Context**: Click track to reveal action buttons
- **Management Actions**: Favorite toggle, delete from history

#### 📊 Recent Tracks Footer
- **Last 5 Tracks**: Quick access to recently played songs
- **Quick Actions**: Rate, favorite, delete without opening drawer
- **Responsive Design**: Collapses to popover on mobile screens

#### 📈 Global Statistics Page (`/stats`)
- **Platform Analytics**: Comprehensive statistics dashboard with 5 key metrics
- **Most Played Rankings**: Top tracks by community listen counts
- **Rating Leaderboards**: Highest and lowest rated tracks with vote breakdowns
- **Community Favorites**: Most hearted tracks across all users  
- **Top Listeners**: User leaderboard with anonymized display (initials only)
- **Real-time Data**: Live statistics generation with database timestamps

#### 🔄 Cross-Component Sync
All track interactions (favorite, delete, rate) automatically sync across:
- Streaming area display
- Track history drawer list
- Favorites page grid
- Recent tracks footer

### Mobile-First Responsive Behavior

**Desktop (≥1024px):**
- Drawer permanently visible as sidebar
- Footer shows full recent tracks list
- All hover effects and transitions active

**Mobile (<1024px):**  
- Drawer slides over content as overlay
- Footer adapts to popover or hides on small screens
- Touch-optimized interactions with larger tap targets

## 🗄️ Database Management

### Schema Management

Radio Calico uses **production-grade race condition protection** with:

**Database-Level Protection:**
```prisma
// Unique constraints prevent duplicates
@@unique([userId, trackId], name: "unique_user_track")
@@unique([title, artist, album], name: "unique_track_combination")

// Optimized indexes for performance
@@index([userId, listenedAt(sort: Desc)])  // Recent tracks
@@index([userId, isFavorite])              // Favorites lookup
```

**Application-Level UPSERT:**
```typescript
// Race-condition-safe track creation
await prisma.userTrack.upsert({
  where: { unique_user_track: { userId, trackId } },
  create: { /* create new */ },
  update: { 
    listenedAt: new Date(),
    listenCount: { increment: 1 }  // Atomic increment
  }
});
```

**Transaction Protection:**
```typescript
// Complex operations wrapped in transactions
await prisma.$transaction(async (tx) => {
  // Update user favorite status
  const userTrack = await tx.userTrack.update({...});
  
  // Update global favorite count atomically  
  const track = await tx.track.update({
    data: { favoriteCount: { increment: change } }
  });
});
```

### Key Database Operations

- **Track Creation**: UPSERT pattern with unique constraint handling
- **Listen Tracking**: Atomic increments with user deduplication
- **Favorite System**: Transaction-protected with global count updates
- **Rating System**: Atomic thumbs up/down with calculated averages
- **History Management**: Soft delete with cascading favorite cleanup

## 🔄 Git Workflow

**MVP Dual-Branch Strategy:**

```
main                 # Production deployment (auto-deploy)
├── config/local     # MVP development (ALL work here)  
└── config/remote    # Production config (deploy prep)
```

**Development Workflow:**
```sh
# Work on config/local branch
git checkout config/local

# Frequent commits for rollback capability
git add .
git commit -m "feat(streaming): add real-time metadata display"
git push origin config/local

# Production deployment (when requested)
git checkout config/remote
git merge config/local --no-ff
git checkout main
git merge config/remote --no-ff
git push origin main  # Triggers Vercel deployment
```

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Environment Setup:**
   ```env
   # Production Database
   DATABASE_URL="postgresql://..."
   
   # Radio Stream
   RADIO_STREAM_URL="https://stream.example.com/radio.m3u8"
   
   # NextAuth (Closed Source)
   NEXTAUTH_SECRET="your-secure-secret"
   NEXTAUTH_URL="https://your-domain.vercel.app"
   
   # OAuth Providers
   GOOGLE_CLIENT_ID="production-client-id"
   GOOGLE_CLIENT_SECRET="production-secret"
   GITHUB_ID="production-github-id"  
   GITHUB_SECRET="production-github-secret"
   ```

2. **Deploy Process:**
   ```sh
   git checkout main
   git push origin main  # Auto-deploys to Vercel
   ```

### Database Migration

```sh
# Production database setup
npx prisma db push --accept-data-loss
npx prisma generate
```

## 🤝 Contributing

**MVP Development Guidelines:**

1. **Mobile-First**: Always design for 280px+ screens first
2. **shadcn/ui**: Use shadcn components instead of native HTML
3. **Framer Motion**: Implement smooth + spring animation patterns
4. **React Query**: Follow optimistic update patterns
5. **TypeScript**: Maintain strict type safety

**Contribution Workflow:**
```sh
git checkout config/local
git checkout -b feature/track-search-enhancement
# Implement feature following MVP guidelines
git commit -m "feat(search): add real-time track search"
git push origin feature/track-search-enhancement
# Open PR targeting config/local
```

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**🎵 Radio Calico** - Modern radio streaming with interactive track history and social features, built with Next.js 15 and cutting-edge web technologies.

> **🔒 Authentication Notice:** The authentication system is proprietary and not included in this public repository. Full implementation available through commercial licensing.