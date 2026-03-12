# =============================================================================
# Frontend Dockerfile — ClearDay Todo UI
# Multi-stage build | Nginx Alpine | Non-root user | Health check
# Build context: project root (monorepo)
# =============================================================================

# ---------------------------------------------------------------------------
# Stage 1 — Install dependencies
# ---------------------------------------------------------------------------
FROM node:20-alpine AS deps

WORKDIR /app

# Copy workspace root + all workspace package.json files (npm ci needs them)
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY shared/package.json shared/
COPY backend/package.json backend/

RUN npm ci

# ---------------------------------------------------------------------------
# Stage 2 — Build shared types + Vite production bundle
# ---------------------------------------------------------------------------
FROM deps AS build

COPY tsconfig.base.json ./
COPY shared/ shared/
COPY frontend/ frontend/

RUN npm run build -w shared && npm run build -w frontend

# ---------------------------------------------------------------------------
# Stage 3 — Production runtime (nginx serving static assets)
# ---------------------------------------------------------------------------
FROM nginx:1.27-alpine AS production

# Metadata
LABEL maintainer="ClearDay Team" \
      description="ClearDay Todo UI — React SPA served by Nginx" \
      org.opencontainers.image.source="https://github.com/clearday/clearday"

# Create non-root user
RUN addgroup -g 1001 -S appgroup && \
    adduser  -S appuser -u 1001 -G appgroup

# Remove default nginx config
RUN rm /etc/nginx/conf.d/default.conf

# Copy custom nginx configuration
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf

# Copy built static assets from build stage
COPY --from=build /app/frontend/dist /usr/share/nginx/html

# Adjust permissions for non-root nginx operation
RUN chown -R appuser:appgroup /var/cache/nginx \
                               /var/log/nginx \
                               /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid

# Non-root port (unprivileged users cannot bind to ports < 1024)
EXPOSE 8080

# Drop to non-root
USER appuser

# Health check — lightweight /healthz endpoint (no SPA overhead)
# NOTE: use 127.0.0.1 not localhost — Alpine resolves localhost to ::1 (IPv6)
# but nginx listens on IPv4 only by default
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1

CMD ["nginx", "-g", "daemon off;"]

