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
pnpm run mobile          # Start Expo (press 'i' for iOS, 'a' for Android)
pnpm run backend         # Start backend dev server
pnpm run build           # Build common + backend
pnpm run lint            # Lint all packages
```

## Structure

```
autistas/
├── mobile/              # Expo React Native app
├── backend/             # Hono API + PostgreSQL
├── packages/common/     # Shared types & schemas (Zod)
└── docker-compose.yml
```

## Stack

Mobile: Expo, React Native, TypeScript
Backend: Hono, Node.js 22, PostgreSQL, Drizzle ORM
DevOps: Docker, GitHub Actions, EAS

## Building

```bash
# Mobile
cd mobile && eas build --platform android

# Backend
docker compose build
```

## Troubleshooting

**Port 3000 in use**: `lsof -i :3000`
**Mobile can't connect**: Use `http://10.0.2.2:3000` on Android emulator, or your local IP on device

## License

Unlicense
