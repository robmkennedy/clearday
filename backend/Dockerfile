# =============================================================================
# Backend Dockerfile — ClearDay Todo API
# Multi-stage build | Non-root user | Health check | SQLite + better-sqlite3
# Build context: project root (monorepo)
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1 — Install ALL dependencies (includes build tools for native modules)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS deps

# better-sqlite3 requires native compilation toolchain
RUN apk add --no-cache python3 make g++

WORKDIR /app

# Copy workspace root + all workspace package.json files (npm ci needs them)
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/

RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2 — Build TypeScript (shared first, then backend)
# ---------------------------------------------------------------------------
FROM deps AS build

COPY tsconfig.base.json ./
COPY shared/ shared/
COPY backend/ backend/

RUN npm run build -w shared && npm run build -w backend

# ---------------------------------------------------------------------------
# Stage 3 — Production-only dependencies (separate stage for clean layer cache)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS prod-deps

RUN apk add --no-cache python3 make g++

WORKDIR /app

COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/

RUN npm ci --omit=dev && \
    # Remove build toolchain from this layer's cache footprint
    apk del python3 make g++

# ---------------------------------------------------------------------------
# Stage 4 — Production runtime (minimal image, no build tools)
# ---------------------------------------------------------------------------
FROM node:20-alpine AS production

# Metadata
LABEL maintainer="ClearDay Team" \
      description="ClearDay Todo API — Express + SQLite" \
      org.opencontainers.image.source="https://github.com/clearday/clearday"

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nodejs -u 1001 -G nodejs

WORKDIR /app

# Copy production node_modules (hoisted by npm workspaces to root)
COPY --from=prod-deps /app/node_modules ./node_modules

# Copy compiled JavaScript
COPY --from=build /app/backend/dist  ./backend/dist
COPY --from=build /app/shared/dist   ./shared/dist

# Copy package manifests (required for ESM module resolution)
COPY --from=build /app/package.json        ./
COPY --from=build /app/backend/package.json ./backend/
COPY --from=build /app/shared/package.json  ./shared/

# Create persistent data directory for SQLite and set ownership
RUN mkdir -p /app/data && chown -R nodejs:nodejs /app/data

# Runtime configuration
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=./data/todos.db
ENV APP_VERSION=1.0.0

EXPOSE 3000

# Drop to non-root
USER nodejs

# Docker sends SIGTERM on stop — give graceful shutdown time to drain
STOPSIGNAL SIGTERM

# Health check against the existing /api/health endpoint
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1

CMD ["node", "backend/dist/index.js"]

