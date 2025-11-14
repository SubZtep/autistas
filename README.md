# Autistas

Mobile app to help parents and caregivers support kids with autism.

## Quick Start

```bash
pnpm install
docker compose up -d
pnpm run mobile
```

## Development

```bash
pnpm run mobile          # Start Expo (press 'i' for iOS, 'a' for Android, 'w' for web)
pnpm run backend         # Start backend dev server
pnpm run build           # Build common + backend
pnpm run lint            # Lint all packages
```

### Database Management

```bash
cd backend
pnpm db:generate         # Generate migrations from schema
pnpm db:migrate          # Run migrations
pnpm db:studio           # Open Drizzle Studio at https://local.drizzle.studio
```

## Structure

```
autistas/
├── mobile/              # Expo React Native app (iOS, Android, Web)
├── backend/             # Hono API server
├── packages/common/     # Shared types & schemas (Zod)
└── docker-compose.yml   # PostgreSQL + backend + web services
```

## Building

```bash
# Mobile
cd mobile && eas build --platform android

# Backend
docker compose build
```

## Docker Services

The docker-compose setup includes:

- **postgres** (port 5432): PostgreSQL database
- **backend** (port 3000): Hono API server
- **web** (port 8081): Expo web version

```bash
docker compose up -d         # Start all services
docker compose up postgres   # Start only database
docker compose logs -f web   # View web service logs
```

## License

Unlicense
