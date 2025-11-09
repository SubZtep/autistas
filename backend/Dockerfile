FROM node:22.21.0-slim AS builder

ENV NODE_ENV=production \
  PNPM_HOME="/pnpm" \
  PATH="/pnpm:$PATH"

RUN apt-get update && apt-get install -y jq && rm -rf /var/lib/apt/lists/*

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
WORKDIR /app

COPY package*.json ./
COPY pnpm-*.yaml ./
RUN pnpm install --ignore-scripts --prefer-frozen-lockfile
COPY . .

# Point backend tsconfig to a local base file inside the image
RUN jq '.extends = "./tsconfig.base.json"' tsconfig.json > tsconfig.tmp.json && mv tsconfig.tmp.json tsconfig.json

# Create local tsconfig.base.json (mirrors repo root base)
RUN printf '%s\n' '{' \
  '  "compilerOptions": {' \
  '    "strict": true,' \
  '    "esModuleInterop": true,' \
  '    "skipLibCheck": true,' \
  '    "forceConsistentCasingInFileNames": true,' \
  '    "resolveJsonModule": true,' \
  '    "allowSyntheticDefaultImports": true' \
  '  }' \
  '}' > tsconfig.base.json

RUN pnpm build

FROM node:22.21.0-slim

ENV NODE_ENV=production \
  PNPM_HOME="/pnpm" \
  PATH="/pnpm:$PATH"

RUN corepack enable && corepack prepare pnpm@10.20.0 --activate
WORKDIR /app

COPY package*.json ./
COPY pnpm-*.yaml ./
RUN pnpm install --prod --ignore-scripts --prefer-frozen-lockfile
COPY --from=builder /app/dist ./dist
EXPOSE 3000

HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000/health', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

CMD ["node", "dist/index.js"]
