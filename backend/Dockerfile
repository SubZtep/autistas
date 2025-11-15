FROM node:24.11.1-slim AS builder

ENV PNPM_HOME="/pnpm" \
  PATH="/pnpm:$PATH"

RUN corepack enable && corepack prepare pnpm@10.22.0 --activate
WORKDIR /workspace

# Copy workspace files
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
COPY tsconfig.base.json ./

# Copy packages
COPY packages/common ./packages/common
COPY backend ./backend

# Install all dependencies
RUN pnpm install --frozen-lockfile --filter @autistas/common --filter backend

# Build common package first
RUN pnpm --filter @autistas/common build

# Build backend
RUN pnpm --filter backend build

# Prune to production dependencies
RUN pnpm --filter backend --prod deploy --legacy /prod/backend
RUN pnpm --filter @autistas/common --prod deploy --legacy /prod/common

FROM node:24.11.1-slim

ENV NODE_ENV=production

WORKDIR /app

# Copy production dependencies
COPY --from=builder /prod/backend/node_modules ./node_modules

# Copy built common package into node_modules
COPY --from=builder /prod/common/dist ./node_modules/@autistas/common/dist
COPY --from=builder /prod/common/package.json ./node_modules/@autistas/common/package.json

# Copy built backend
COPY --from=builder /workspace/backend/dist ./dist
COPY --from=builder /workspace/backend/drizzle ./drizzle
COPY --from=builder /workspace/backend/package.json ./

EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["npm", "start"]
