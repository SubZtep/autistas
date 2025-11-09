# Autistas

A mobile app prototype to help parents, caregivers, and anyone interested in supporting kids with autism. Built with a calm, friendly interface designed for both adults and children.

## Project Structure

```
autistas/
├── mobile/          # Expo React Native mobile app
├── backend/         # Node.js + Hono API server
└── docker-compose.yml
```

## Features

- **Mobile App (Expo)**
  - Clean, calm UI with accessibility in mind
  - Automatic dark/light mode detection
  - Chat interface with AI assistant
  - Header with hamburger menu (placeholder)
  - Designed for both parents/caregivers and children

- **Backend API (Node.js + Hono)**
  - Health check endpoint
  - Chat API (ready for LLM integration)
  - PostgreSQL database with Drizzle ORM
  - Docker support for easy deployment

## Getting Started

### Prerequisites

- Node.js 22+ (Corepack enabled)
- pnpm 9+
- Docker & Docker Compose (for backend)
- Expo Go app (for mobile testing)

### Initial Setup

1. **Clone the repository**

   ```bash
   git clone git@github.com:SubZtep/autistas.git
   cd autistas
   ```

2. **Install dependencies**

```bash
# From the repo root, install all workspace deps
pnpm install -r
```

3. **Set up environment variables**

   ```bash
   # Backend
   cd backend
   cp .env.example .env
   # Edit .env with your configuration

   # Root (for Docker)
   cd ..
   cp .env.example .env
   # Set your LLM_API_URL if different
   ```

### Running the Mobile App

```bash
# From the mobile directory
cd mobile
pnpm start

# Or from root
pnpm run mobile

# Then:
# - Press 'i' for iOS simulator
# - Press 'a' for Android emulator
# - Scan QR code with Expo Go app on your phone
```

### Running the Backend

**Option 1: Docker Compose (Recommended)**

```bash
# From root directory
docker-compose up -d

# Check logs
docker-compose logs -f backend

# Stop
docker-compose down
```

**Option 2: Local Development**

```bash
# Make sure PostgreSQL is running locally
cd backend
pnpm run dev
```

### Health Check

Once the backend is running:

```bash
curl http://localhost:3000/health
```

Expected response:

```json
{
  "status": "ok",
  "timestamp": "2025-11-09T...",
  "service": "autistas-backend",
  "version": "0.1.0"
}
```

## Building for Production

### Mobile App (EAS Build)

1. **Install EAS CLI**

   ```bash
   pnpm add -g eas-cli
   ```

2. **Login to Expo**

   ```bash
   eas login
   ```

3. **Configure and build**

   ```bash
   cd mobile

   # Build for iOS (requires macOS for local builds)
   eas build --platform ios --profile preview

   # Build for Android
   eas build --platform android --profile preview
   ```

### Backend (Docker)

```bash
cd backend
docker build -t autistas-backend .
docker run -p 3000:3000 \
  -e DATABASE_URL=your_db_url \
  -e LLM_API_URL=your_llm_url \
  autistas-backend
```

## Deployment

### Backend on Hetzner

1. **Create a Hetzner Cloud server**
2. **Set up PostgreSQL database** (Hetzner Managed DB recommended)
3. **Deploy using Docker**
   - Push image to Docker Hub or Hetzner Container Registry
   - Pull and run on your server
4. **Set environment variables** (DATABASE_URL, LLM_API_URL, etc.)

### Mobile App Distribution

- **TestFlight (iOS)**: Build with EAS and submit to TestFlight
- **Google Play Internal Testing**: Build APK/AAB and upload to Play Console
- **Internal Distribution**: Use EAS builds with internal distribution

## Development Workflow

### Mobile Development

```bash
pnpm run mobile          # Start Expo dev server
pnpm run mobile:ios      # Run on iOS
pnpm run mobile:android  # Run on Android
```

### Backend Development

```bash
pnpm run backend:dev     # Start backend dev server with hot reload
```

### Database Management

```bash
cd backend
pnpm run db:generate     # Generate migrations from schema changes
pnpm run db:migrate      # Run migrations
pnpm run db:studio       # Open Drizzle Studio (database GUI)
```

## Connecting to Your LLM

The backend is configured to connect to a self-hosted LLM. Update these settings:

1. **In backend/.env**:

   ```
   LLM_API_URL=http://your-home-pc-ip:5001
   LLM_API_KEY=your_api_key_if_needed
   ```

2. **For Docker Compose** (root .env):
   ```
   LLM_API_URL=http://192.168.1.xxx:5001
   ```

The chat route (`backend/src/routes/chat.ts`) is ready for you to implement the LLM API call.

## Tech Stack

### Mobile

- **Framework**: Expo (React Native)
- **Language**: TypeScript
- **UI**: React Native components with custom theming
- **State**: React Context (Theme)

### Backend

- **Framework**: Hono
- **Runtime**: Node.js 22
- **Database**: PostgreSQL
- **ORM**: Drizzle
- **Language**: TypeScript

### DevOps

- **CI/CD**: GitHub Actions
- **Containerization**: Docker
- **Build System**: EAS (Expo Application Services)

## Contributing

This is a prototype project. Feel free to contribute or provide feedback!

## License

Unlicense
