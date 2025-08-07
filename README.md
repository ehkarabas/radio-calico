# Radio Calico 📻

![Build Status](https://img.shields.io/badge/build-passing-brightgreen) ![Code Coverage](https://img.shields.io/badge/coverage-85%25-blue) ![License](https://img.shields.io/badge/license-MIT-green) ![Version](https://img.shields.io/badge/version-1.0.0-lightgrey) ![Next.js](https://img.shields.io/badge/Next.js-15+-black) ![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)

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

Radio Calico is a modern, full-stack online radio station web application that delivers high-quality audio streaming with real-time track information and interactive rating features. Built with Next.js 15 and powered by Supabase, it provides a seamless listening experience with production-ready infrastructure and comprehensive database management.

The application features a dual-environment setup with local SQLite development and Supabase PostgreSQL production, ensuring smooth development workflows and reliable deployment processes.

## ✨ Key Features

- **🎵 HLS Audio Streaming**: High-quality audio playback with custom HLS implementation
- **📊 Real-time Track Metadata**: Live track information with React Query polling
- **👍 Interactive Rating System**: Thumbs up/down rating with real-time vote counts
- **📱 Responsive Design**: Beautiful UI built with ShadCN/UI and Tailwind CSS
- **🔄 Optimistic Updates**: Enhanced UX with React Query state management
- **🎛️ Audio Controls**: Volume control, play/pause with persistent state
- **📈 Track History**: View previously played tracks with metadata
- **🌐 Production Ready**: Supabase integration with Row Level Security
- **🐳 Docker Support**: Containerized local development environment
- **🔄 Dual Database Strategy**: SQLite for development, PostgreSQL for production
- **🧪 E2E Testing**: Comprehensive Playwright test suite
- **🚀 Modern Stack**: Next.js 15 App Router with TypeScript

## 🛠️ Built With

### Frontend
- **Framework**: Next.js 15+ (App Router)
- **UI Library**: ShadCN/UI + Radix UI primitives
- **Styling**: Tailwind CSS
- **State Management**: React Query v5 (TanStack Query)
- **Type Safety**: TypeScript
- **Audio Player**: Custom HLS implementation with hls.js
- **Icons**: Lucide React
- **Notifications**: Sonner toast library

### Backend
- **Framework**: Express.js
- **Database**: SQLite (development) / Supabase PostgreSQL (production)
- **ORM**: Drizzle ORM
- **API**: RESTful endpoints
- **Runtime**: Node.js 22+

### Production Infrastructure
- **Database**: Supabase PostgreSQL
- **Authentication**: Supabase Auth (optional)
- **Deployment**: Vercel (Frontend) + Railway/Render (Backend)
- **CDN**: Vercel Edge Network
- **Monitoring**: Supabase Analytics

### Development Tools
- **Package Manager**: npm/pnpm
- **Testing**: Playwright (E2E), Jest (Unit)
- **Version Control**: Git + GitHub
- **Containerization**: Docker (local development)
- **Database Studio**: Drizzle Studio

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
- **Docker & Docker Compose** (for local database)
  ```sh
  docker --version
  docker-compose --version
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

3. Install dependencies for both frontend and backend:
   ```sh
   # Install frontend dependencies
   cd frontend
   npm install

   # Install backend dependencies
   cd ../backend
   npm install
   ```

### Environment Configuration

#### Local Development Setup

1. Start the local database:
   ```sh
   docker-compose up -d
   ```

2. Create environment files:

   **Frontend (.env.local):**
   ```env
   DATABASE_URL="file:./local.db"
   NODE_ENV="development"
   DEPLOYMENT_ENV="local"
   STREAM_URL="http://localhost:8080/stream.m3u8"
   ```

   **Backend (.env):**
   ```env
   DATABASE_URL="file:./local.db"
   PORT=3001
   NODE_ENV="development"
   ```

3. Set up the database:
   ```sh
   cd backend
   npm run db:generate
   npm run db:migrate
   ```

#### Production Setup (Supabase)

1. Create a Supabase project at [supabase.com](https://supabase.com)

2. Create production environment files:

   **Frontend (.env.production):**
   ```env
   DATABASE_URL="postgresql://postgres.[ref]:[password]@[host].supabase.co:5432/postgres"
   NEXT_PUBLIC_SUPABASE_URL="https://[ref].supabase.co"
   NEXT_PUBLIC_SUPABASE_ANON_KEY="[anon-key]"
   NODE_ENV="production"
   DEPLOYMENT_ENV="remote"
   STREAM_URL="https://stream.example.com/radio.m3u8"
   ```

## 💻 Usage

### Development Server

Start both frontend and backend development servers:

```sh
# Terminal 1 - Frontend
cd frontend
npm run dev

# Terminal 2 - Backend
cd backend
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application in your browser.

### Key Components

#### Audio Player
The main audio player component supports:
- HLS stream playback
- Volume control
- Play/pause functionality
- Real-time metadata updates

#### Rating System
Interactive rating for tracks with:
- Thumbs up/down voting
- Real-time vote counts
- Optimistic UI updates

#### Track Information
Displays current track metadata:
- Track title and artist
- Album information
- Album artwork
- Stream quality indicator

## 📜 Project Scripts

### Frontend Scripts
- `npm run dev` - Start Next.js development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript checks

### Backend Scripts
- `npm run dev` - Start Express development server
- `npm run build` - Build TypeScript
- `npm run start` - Start production server

### Database Scripts
- `npm run db:generate` - Generate Drizzle migrations
- `npm run db:migrate` - Apply migrations
- `npm run db:studio` - Open Drizzle Studio
- `npm run db:push` - Push schema changes

### Git Workflow Scripts
- `npm run switch:local` - Switch to local configuration
- `npm run switch:remote` - Switch to remote configuration
- `npm run sync:configs` - Sync configuration branches

### Testing Scripts
- `npm run test:e2e` - Run Playwright E2E tests
- `npm run test:unit` - Run Jest unit tests

## 🐳 Docker Development

### Starting the Development Environment

```sh
# Start PostgreSQL container
docker-compose up -d

# Check container status
docker-compose ps

# View database logs
docker-compose logs postgres

# Stop the environment
docker-compose down
```

### Database Connection Details

- **Host**: `localhost`
- **Port**: `5433`
- **Database**: `radio_calico`
- **Username**: `postgres`
- **Password**: `postgres`

## 🗄️ Database Management

### Schema Overview

The application uses two main tables:

```sql
-- Tracks table
CREATE TABLE tracks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  artist TEXT NOT NULL,
  album TEXT,
  year INTEGER,
  album_art TEXT,
  stream_quality TEXT CHECK (stream_quality IN ('lossless', 'high', 'medium')),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Ratings table
CREATE TABLE ratings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  track_id UUID REFERENCES tracks(id),
  rating TEXT CHECK (rating IN ('up', 'down')) NOT NULL,
  user_id TEXT,
  ip_address TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Migration Workflow

1. **Development Changes**:
   ```sh
   npm run db:generate
   npm run db:migrate
   ```

2. **Production Deployment**:
   ```sh
   npm run switch:remote
   npm run db:migrate
   ```

## 🔄 Git Workflow

The project uses a dual-branch configuration strategy with main as the development workbench:

### Branch Structure
```
main                 # Development workbench & feature implementation
├── config/local     # Local development configuration
└── config/remote    # Supabase production configuration
```

### Development Workflow

```sh
# Work directly on main branch (development workbench)
git checkout main

# Implement features directly on main
# ... make changes

# Test with local configuration
npm run switch:local
npm run dev

# Test with remote configuration
npm run switch:remote
npm run dev

# Sync configurations to keep them updated
npm run sync:configs
```

### Configuration Management

```sh
# Switch to local development setup
npm run switch:local
# This merges config/local into main

# Switch to production setup  
npm run switch:remote
# This merges config/remote into main

# Keep configuration branches in sync with main
npm run sync:configs
# This updates both config branches with latest main changes
```

## 🚀 Deployment

### Vercel Deployment (Frontend)

1. Connect your GitHub repository to Vercel
2. Configure environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend Deployment (Railway/Render)

1. Connect repository to Railway or Render
2. Configure environment variables
3. Deploy backend API

### Environment Variables for Production

Ensure these are set in your deployment platform:
- `DATABASE_URL`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `STREAM_URL`

## 🧪 Testing

### E2E Tests with Playwright

```sh
# Run all tests
npm run test:e2e

# Run tests in headed mode
npx playwright test --headed

# Run specific test
npx playwright test radio-app.spec.ts
```

### Test Coverage

The test suite covers:
- Audio player functionality
- Rating system interactions
- Track metadata display
- Real-time updates
- Responsive design

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

### Development Workflow

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Make your changes and test thoroughly
4. Run tests and linting (`npm run lint`, `npm run test:e2e`)
5. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
6. Push to the Branch (`git push origin feature/AmazingFeature`)
7. Open a Pull Request

### Code Style Guidelines

- Use TypeScript for type safety
- Follow ESLint configuration
- Write comprehensive tests
- Document API changes
- Use conventional commit messages

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.

---

**🎵 Radio Calico** - Bringing you the best music streaming experience with modern web technologies.
