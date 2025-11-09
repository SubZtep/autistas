# Project Structure

Detailed breakdown of the Autistas project structure.

## Directory Tree

```
autistas/
├── .github/
│   └── workflows/
│       └── ci.yml                 # GitHub Actions CI/CD pipeline
├── mobile/                        # Expo React Native mobile app
│   ├── src/
│   │   ├── components/            # Reusable React components
│   │   │   ├── Header.tsx         # Top header with hamburger menu
│   │   │   ├── Feed.tsx           # Message feed/conversation display
│   │   │   └── ChatInput.tsx      # Chat input with send button
│   │   ├── screens/               # App screens
│   │   │   └── HomeScreen.tsx     # Main chat screen
│   │   ├── contexts/              # React contexts
│   │   │   └── ThemeContext.tsx   # Dark/light theme management
│   │   ├── theme/                 # Theme configuration
│   │   │   └── colors.ts          # Color palette (calm & friendly)
│   │   ├── config/                # App configuration
│   │   │   └── api.ts             # API endpoints & settings
│   │   └── types/                 # TypeScript type definitions
│   ├── assets/                    # Images, fonts, etc.
│   ├── App.tsx                    # Main app entry point
│   ├── app.json                   # Expo configuration
│   ├── eas.json                   # EAS Build configuration
│   ├── package.json
│   └── tsconfig.json
│
├── backend/                       # Node.js + Hono API server
│   ├── src/
│   │   ├── routes/                # API routes
│   │   │   ├── health.ts          # Health check endpoint
│   │   │   └── chat.ts            # Chat API (ready for LLM)
│   │   ├── db/                    # Database layer
│   │   │   ├── schema.ts          # Drizzle ORM schemas
│   │   │   └── index.ts           # Database connection
│   │   ├── config/                # Server configuration
│   │   │   └── env.ts             # Environment variables
│   │   └── index.ts               # Server entry point
│   ├── Dockerfile                 # Docker image definition
│   ├── .dockerignore
│   ├── drizzle.config.ts          # Drizzle ORM configuration
│   ├── package.json
│   ├── tsconfig.json
│   └── .env.example               # Example environment variables
│
├── docker-compose.yml             # Docker services definition
├── package.json                   # Root package.json (monorepo)
├── .gitignore
├── .env.example                   # Example root environment variables
├── README.md                      # Main documentation
├── QUICKSTART.md                  # Quick start guide
├── PROJECT_STRUCTURE.md           # This file
└── LICENSE
```

## Key Files Explained

### Mobile App

**`mobile/App.tsx`**
- Main entry point
- Wraps app with ThemeProvider and SafeAreaProvider
- Renders HomeScreen

**`mobile/src/screens/HomeScreen.tsx`**
- Main screen of the app
- Manages message state
- Integrates Header, Feed, and ChatInput components

**`mobile/src/contexts/ThemeContext.tsx`**
- Provides theme context (dark/light mode)
- Automatically detects system theme
- Allows manual theme switching

**`mobile/src/theme/colors.ts`**
- Defines color palette for both light and dark modes
- Designed with calm, accessible colors
- Considers users who may be sensitive to bright/harsh colors

**`mobile/src/components/`**
- `Header.tsx`: Top navigation bar with hamburger menu (placeholder)
- `Feed.tsx`: Displays conversation messages
- `ChatInput.tsx`: Text input with send button

**`mobile/src/config/api.ts`**
- API base URL and endpoints
- Environment-specific configuration
- Note: Change localhost to your local IP for physical device testing

### Backend

**`backend/src/index.ts`**
- Main server file
- Configures Hono app with middleware (CORS, logging)
- Defines routes and error handling

**`backend/src/routes/health.ts`**
- Simple health check endpoint
- Returns server status and version
- Used by Docker healthcheck and monitoring

**`backend/src/routes/chat.ts`**
- Chat API endpoint
- Ready for LLM integration
- Currently returns placeholder response

**`backend/src/db/schema.ts`**
- Database schema definitions using Drizzle ORM
- Tables: conversations, messages
- Prepared for future features

**`backend/src/config/env.ts`**
- Environment variable configuration
- Type-safe access to env vars
- Defaults for development

### DevOps

**`docker-compose.yml`**
- Defines PostgreSQL and backend services
- Sets up networking and volumes
- Easy local development setup

**`.github/workflows/ci.yml`**
- Automated testing and building
- Runs on push/PR to main/develop
- Tests backend build and Docker image

**`mobile/eas.json`**
- EAS Build configuration
- Profiles for development, preview, and production
- iOS and Android build settings

## Color Palette Philosophy

The app uses a carefully selected color palette:

- **Primary (Blue-Green)**: Calming, associated with stability and trust
- **Soft Backgrounds**: Not harsh white or pure black, easier on the eyes
- **High Contrast Text**: Ensures readability for all users
- **Warm Accent (Orange)**: Friendly, encouraging, not alarming
- **Functional Colors**: Soft versions of success/warning/error colors

Both light and dark modes are designed to:
- Reduce eye strain
- Create a calming atmosphere
- Maintain high readability
- Be friendly for children while professional for adults

## Architecture Overview

```
┌─────────────────┐
│   Mobile App    │
│   (Expo/RN)     │
└────────┬────────┘
         │ HTTP
         ▼
┌─────────────────┐
│  Backend API    │
│  (Hono/Node)    │
└────┬────────┬───┘
     │        │
     │        └──────► LLM API
     │                (Your home PC)
     ▼
┌─────────────────┐
│   PostgreSQL    │
│   (Database)    │
└─────────────────┘
```

## Database Schema

### `conversations` table
- `id`: UUID primary key
- `userId`: User identifier (for future auth)
- `createdAt`, `updatedAt`: Timestamps

### `messages` table
- `id`: UUID primary key
- `conversationId`: Foreign key to conversations
- `content`: Message text
- `role`: 'user' or 'assistant'
- `metadata`: JSON for additional context
- `createdAt`: Timestamp

## API Endpoints

- `GET /` - API info
- `GET /health` - Health check
- `POST /api/chat` - Send chat message

## Environment Variables

### Backend
- `PORT`: Server port (default: 3000)
- `NODE_ENV`: Environment (development/production)
- `DATABASE_URL`: PostgreSQL connection string
- `LLM_API_URL`: Your LLM server URL
- `LLM_API_KEY`: Optional API key for LLM
- `ALLOWED_ORIGINS`: CORS configuration

## Next Development Areas

1. **LLM Integration** (`backend/src/routes/chat.ts`)
   - Implement API call to your home LLM
   - Handle streaming responses
   - Add error handling and retries

2. **Mobile-Backend Connection** (`mobile/src/screens/HomeScreen.tsx`)
   - Replace placeholder with real API calls
   - Add loading states
   - Handle errors gracefully

3. **Authentication**
   - Add user registration/login
   - Secure API endpoints
   - Store user preferences

4. **Enhanced Features**
   - Voice input
   - Image sharing
   - Offline mode
   - Push notifications

## Development Tips

- Use `npm run mobile` from root to start mobile app
- Use `npm run backend:dev` from root to start backend with hot reload
- Use Docker Compose for full stack local development
- Check logs with `docker-compose logs -f backend`
- Use Drizzle Studio for database GUI: `npm run db:studio` in backend

## Testing Strategy

- **Mobile**: TypeScript compilation check in CI
- **Backend**: Build verification in CI
- **Docker**: Image build test in CI
- **Manual**: Use Expo Go for mobile testing
- **API**: Use curl or Postman for backend testing

---

For questions or issues, refer to the main [README.md](./README.md) or [QUICKSTART.md](./QUICKSTART.md).
