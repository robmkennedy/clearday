# Docker Containerization Report — Clearday Todo Application

**Generated:** 2026-03-12
**Updated:** 2026-03-12
**Status:** Complete
**Scope:** Multi-stage Dockerfiles, Docker Compose orchestration, networking, security hardening, health check endpoints, structured logging, graceful shutdown, multi-environment support (dev/test/prod)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Architecture Diagram](#2-architecture-diagram)
3. [File Inventory](#3-file-inventory)
4. [Frontend Dockerfile](#4-frontend-dockerfile)
5. [Backend Dockerfile](#5-backend-dockerfile)
6. [Nginx Configuration](#6-nginx-configuration)
7. [Docker Compose Orchestration](#7-docker-compose-orchestration)
8. [Networking](#8-networking)
9. [Volume Mounts](#9-volume-mounts)
10. [Environment Configuration](#10-environment-configuration)
11. [Health Check Endpoints](#11-health-check-endpoints)
12. [Structured Logging & Log Access](#12-structured-logging--log-access)
13. [Graceful Shutdown](#13-graceful-shutdown)
14. [Security Hardening](#14-security-hardening)
15. [Resource Limits](#15-resource-limits)
16. [Environment Profiles (Dev / Test / Prod)](#16-environment-profiles-dev--test--prod)
17. [Build Context & .dockerignore](#17-build-context--dockerignore)
18. [Test Coverage](#18-test-coverage)
19. [Quick-Start Commands](#19-quick-start-commands)
20. [Risk Assessment](#20-risk-assessment)
21. [Bug Fixes (Runtime Validation)](#21-bug-fixes-runtime-validation)

---

## 1. Overview

The Clearday Todo application is containerized as a **two-service architecture** using Docker Compose. The monorepo workspace structure (`frontend/`, `backend/`, `shared/`) is respected during build, with each Dockerfile using the **project root as build context** to access cross-workspace dependencies.

| Property | Value |
|---|---|
| Base images | `node:20-alpine`, `nginx:1.27-alpine` |
| Build strategy | Multi-stage (3–4 stages per Dockerfile) |
| Database | SQLite via `better-sqlite3` (embedded, no separate DB container) |
| Compose version | Compose Specification (no legacy `version:` key) |
| Runtime users | Non-root in both containers |
| Environments | Development, Test, Production — via `--env-file` and compose overlays |

---

## 2. Architecture Diagram

```
┌─── Docker Host ────────────────────────────────────────────────┐
│                                                                 │
│   :8080 ──► ┌────────────────────┐                              │
│             │   frontend         │                              │
│             │   nginx:1.27-alpine│                              │
│             │   user: appuser    │                              │
│             │   read_only: true  │                              │
│             └────────┬───────────┘                              │
│                      │ proxy_pass /api/ ──► backend:3000        │
│              ┌───────┴──── frontend-net (bridge) ───────┐       │
│              │                                          │       │
│              │       ┌────────────────────┐              │       │
│              │       │   backend          │              │       │
│              │       │   node:20-alpine   │              │       │
│              │       │   user: nodejs     │              │       │
│              │       │   read_only: true  │              │       │
│              │       └────────┬───────────┘              │       │
│              └────────────────┼──────────────────────────┘       │
│                               │                                  │
│              ┌────────────────┼── backend-net (internal) ──┐     │
│              │                │                            │     │
│              │          ┌─────┴──────┐                     │     │
│              │          │ todo-data  │  Named volume        │     │
│              │          │ (SQLite)   │  /app/data           │     │
│              │          └────────────┘                     │     │
│              │                                            │     │
│   :8081 ──► │  ┌──────────────────┐  (--profile dev)     │     │
│             │  │   db-admin       │                       │     │
│             │  │   sqlite-web     │  read-only mount      │     │
│             │  └──────────────────┘                       │     │
│              └────────────────────────────────────────────┘     │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## 3. File Inventory

| File | Purpose | Status |
|---|---|---|
| `frontend/Dockerfile` | 3-stage build: deps → Vite build → nginx runtime | Created |
| `backend/Dockerfile` | 4-stage build: deps → TS build → prod-deps → Node.js runtime | Created |
| `frontend/nginx.conf` | Nginx server block: SPA fallback, `/healthz` health stub, API proxy, gzip, security headers | Created |
| `docker-compose.yml` | Base orchestration: services, networking, volumes, health checks, resource limits | Created |
| `docker-compose.override.yml` | Dev overlay (auto-loaded): debug logging, exposed ports, relaxed security | Created |
| `docker-compose.test.yml` | Test overlay: ephemeral DB, fast health checks, frontend disabled | Created |
| `.env.development` | Dev env defaults with `COMPOSE_PROFILES=dev` | Created |
| `.env.test` | Test env defaults with `COMPOSE_FILE` pointing to test overlay | Created |
| `.env.production` | Production env defaults with `COMPOSE_FILE` pointing to base only | Created |
| `.dockerignore` | Excludes `node_modules`, tests, BMAD tooling, IDE artifacts from build context | Created |
| `.env.example` | Full variable reference with multi-environment workflow docs | Updated |
| `package.json` | Added `docker:dev`, `docker:test`, `docker:prod`, `docker:down`, `docker:logs` scripts | Updated |
| `backend/src/app.ts` | Enhanced `/api/health` endpoint with diagnostics; health probe log filtering | Modified |
| `backend/src/index.ts` | Graceful shutdown handler (SIGTERM/SIGINT); structured startup log | Modified |
| `backend/src/__tests__/health.test.ts` | 18 tests covering enriched health response and unhealthy states | Modified |
| `backend/src/__tests__/middleware/logger.test.ts` | 10 tests including health probe log-filtering verification | Modified |
| `backend/src/middleware/logger.ts` | Resilient `pino-pretty` detection via `createRequire` probe | Modified |
| `backend/src/db/index.ts` | Auto-creates `todos` table on first run (`CREATE TABLE IF NOT EXISTS`) | Modified |

---

## 4. Frontend Dockerfile

**File:** `frontend/Dockerfile`
**Final image:** `nginx:1.27-alpine` (~45 MB estimated)
**Build context:** project root

### Stage Breakdown

| Stage | Base Image | Purpose | Artifacts Produced |
|---|---|---|---|
| `deps` | `node:20-alpine` | Install all npm workspace dependencies | `/app/node_modules` |
| `build` | (from `deps`) | Compile `shared` types + Vite production bundle | `/app/frontend/dist` |
| `production` | `nginx:1.27-alpine` | Serve static assets via nginx | Final image |

### Key Decisions

- **No build tools needed** — the frontend has no native modules, so Alpine works without `python3`/`make`/`g++`.
- **Non-root user** — `appuser:1001` created; nginx pid, cache, and log directories re-owned.
- **Port 8080** — unprivileged users cannot bind to ports < 1024.
- **Health check** — `wget --spider http://localhost:8080/healthz` hits a dedicated lightweight nginx stub (returns `200 ok\n` with `access_log off`), avoiding the overhead of serving the full SPA and eliminating probe noise from nginx access logs.

### Dockerfile Source

```dockerfile
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json ./
COPY frontend/package.json frontend/
COPY shared/package.json shared/
COPY backend/package.json backend/
RUN npm ci

FROM deps AS build
COPY tsconfig.base.json ./
COPY shared/ shared/
COPY frontend/ frontend/
RUN npm run build -w shared && npm run build -w frontend

FROM nginx:1.27-alpine AS production
LABEL maintainer="Clearday Team" \
      description="Clearday Todo UI — React SPA served by Nginx" \
      org.opencontainers.image.source="https://github.com/clearday/clearday"
RUN addgroup -g 1001 -S appgroup && \
    adduser  -S appuser -u 1001 -G appgroup
RUN rm /etc/nginx/conf.d/default.conf
COPY frontend/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/frontend/dist /usr/share/nginx/html
RUN chown -R appuser:appgroup /var/cache/nginx \
                               /var/log/nginx \
                               /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown appuser:appgroup /var/run/nginx.pid
EXPOSE 8080
USER appuser
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:8080/healthz || exit 1
CMD ["nginx", "-g", "daemon off;"]
```

---

## 5. Backend Dockerfile

**File:** `backend/Dockerfile`
**Final image:** `node:20-alpine` (~150 MB estimated, due to `better-sqlite3` native bindings)
**Build context:** project root

### Stage Breakdown

| Stage | Base Image | Purpose | Artifacts Produced |
|---|---|---|---|
| `deps` | `node:20-alpine` + build tools | Install ALL npm deps (dev + prod) with native compilation | `/app/node_modules` |
| `build` | (from `deps`) | Compile `shared` → `backend` TypeScript | `backend/dist`, `shared/dist` |
| `prod-deps` | `node:20-alpine` + build tools | Install production-only deps, then remove build toolchain | `/app/node_modules` (prod only) |
| `production` | `node:20-alpine` | Minimal runtime — no build tools, no dev deps | Final image |

### Key Decisions

- **Separate `prod-deps` stage** — `better-sqlite3` requires `python3`, `make`, `g++` to compile its native addon. A dedicated stage installs prod deps, compiles the native module, then strips the toolchain. The final stage copies only the resulting `node_modules`.
- **Workspace hoisting** — npm workspaces hoist all dependencies to root `/app/node_modules`. Only one `COPY --from=prod-deps` is needed.
- **SQLite data directory** — `/app/data` is created and owned by `nodejs:1001` at build time. Mounted as a Docker named volume at runtime.

### Dockerfile Source

```dockerfile
FROM node:20-alpine AS deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/
RUN npm ci

FROM deps AS build
COPY tsconfig.base.json ./
COPY shared/ shared/
COPY backend/ backend/
RUN npm run build -w shared && npm run build -w backend

FROM node:20-alpine AS prod-deps
RUN apk add --no-cache python3 make g++
WORKDIR /app
COPY package.json package-lock.json ./
COPY backend/package.json backend/
COPY shared/package.json shared/
COPY frontend/package.json frontend/
RUN npm ci --omit=dev && apk del python3 make g++

FROM node:20-alpine AS production
LABEL maintainer="Clearday Team" \
      description="Clearday Todo API — Express + SQLite"
RUN addgroup -g 1001 -S nodejs && \
    adduser  -S nodejs -u 1001 -G nodejs
WORKDIR /app
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=build /app/backend/dist  ./backend/dist
COPY --from=build /app/shared/dist   ./shared/dist
COPY --from=build /app/package.json        ./
COPY --from=build /app/backend/package.json ./backend/
COPY --from=build /app/shared/package.json  ./shared/
RUN mkdir -p /app/data && chown -R nodejs:nodejs /app/data
ENV NODE_ENV=production
ENV PORT=3000
ENV DATABASE_URL=./data/todos.db
ENV APP_VERSION=1.0.0
EXPOSE 3000
USER nodejs
STOPSIGNAL SIGTERM
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/api/health || exit 1
CMD ["node", "backend/dist/index.js"]
```

---

## 6. Nginx Configuration

**File:** `frontend/nginx.conf`

| Concern | Configuration |
|---|---|
| **Listen port** | `8080` (non-root compatible) |
| **API reverse proxy** | `location /api/` → `proxy_pass http://backend:3000` |
| **SPA fallback** | `try_files $uri $uri/ /index.html` for client-side routing |
| **Gzip** | Enabled for JS, CSS, JSON, SVG, fonts; level 6; min 256 bytes |
| **Static caching** | `/assets/` → `expires 1y` + `Cache-Control: public, immutable` (Vite content-hashed filenames) |
| **Security headers** | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection` |
| **Dotfile blocking** | `location ~ /\.` → `deny all` |
| **Proxy timeouts** | connect 5s, read 30s, send 30s |
| **Forwarded headers** | `X-Real-IP`, `X-Forwarded-For`, `X-Forwarded-Proto` passed to backend |

---

## 7. Docker Compose Orchestration

**Base file:** `docker-compose.yml`
**Dev overlay:** `docker-compose.override.yml` (auto-loaded in local dev)
**Test overlay:** `docker-compose.test.yml` (explicit via `--env-file .env.test`)

### Compose File Loading

| Command | Files loaded | Environment |
|---|---|---|
| `docker compose up` | base + override | **Development** (override auto-loaded) |
| `docker compose --env-file .env.production up` | base only | **Production** (COMPOSE_FILE set in .env.production) |
| `docker compose --env-file .env.test up` | base + test overlay | **Test** (COMPOSE_FILE set in .env.test) |

### Service Map

| Service | Image | Container Name | Ports | Networks | Profile |
|---|---|---|---|---|---|
| `backend` | `clearday-backend:latest` | `clearday-backend` | `expose: 3000` (internal) | `frontend-net`, `backend-net` | default |
| `frontend` | `clearday-frontend:latest` | `clearday-frontend` | `8080:8080` (published) | `frontend-net` | default |
| `db-admin` | `coleifer/sqlite-web:latest` | `clearday-db-admin` | `8081:8080` (published) | `backend-net` | `dev` |
| `test-backend` | `clearday-backend:latest` | `clearday-test-backend` | `3001:3000` (published) | `frontend-net`, `backend-net` | `test` |

### Startup Order

```
backend (starts first, has no dependencies)
   │
   ├── healthcheck passes (GET /api/health returns 200)
   │
   ▼
frontend (depends_on: backend, condition: service_healthy)
   │
   ▼
db-admin (depends_on: backend, condition: service_healthy) [dev profile only]
```

The `depends_on` directive with `condition: service_healthy` ensures nginx never starts until the backend API and database are confirmed ready.

---

## 8. Networking

### Network Topology

| Network | Driver | Internal | Purpose |
|---|---|---|---|
| `frontend-net` | `bridge` | No | Connects frontend ↔ backend; frontend publishes port to host |
| `backend-net` | `bridge` | **Yes** | Isolates backend + data tier; no direct host access |

### Traffic Flow

1. **Browser → `:8080`** — hits the nginx frontend container on `frontend-net`.
2. **Static assets** — served directly by nginx from `/usr/share/nginx/html`.
3. **API requests** (`/api/*`) — nginx `proxy_pass` → `http://backend:3000` over `frontend-net`.
4. **Backend → SQLite** — reads/writes `/app/data/todos.db` on the `todo-data` volume via `backend-net`.
5. **Backend port 3000 is NOT published to the host** — only accessible through nginx proxy.

### Security Implication

The `backend-net` is marked `internal: true`, meaning containers on that network **cannot reach the internet** and the **host cannot reach them directly**. The backend is reachable only through `frontend-net` (via the nginx reverse proxy). This follows the principle of least privilege for network access.

---

## 9. Volume Mounts

| Volume | Type | Mount Point | Mode | Service | Purpose |
|---|---|---|---|---|---|
| `todo-data` | Named volume | `/app/data` | read-write | `backend` | Persist SQLite database across restarts |
| `todo-data` | Named volume | `/data` | **read-only** | `db-admin` | Browse DB without write risk |

### Persistence Behavior

- `docker compose down` — containers removed, **volume preserved**.
- `docker compose down -v` — containers removed, **volume deleted** (data loss).
- Volume is labeled with `com.clearday.description` for identification in `docker volume ls`.

---

## 10. Environment Configuration

### Variable Reference

All variables have defaults — the app runs without a `.env` file for local development.

| Variable | Default | Service | Description |
|---|---|---|---|
| `COMPOSE_FILE` | *(auto)* | compose | Colon-separated compose files to load |
| `COMPOSE_PROFILES` | *(none)* | compose | Comma-separated profiles to activate (`dev`, `test`) |
| `NODE_ENV` | `production` | backend | Runtime environment |
| `TAG` | `latest` | both | Docker image tag |
| `TZ` | `UTC` | both | Container timezone |
| `APP_VERSION` | `1.0.0` | backend | Version reported in `/api/health` response |
| `BACKEND_PORT` | `3000` | backend | Express listen port |
| `BACKEND_HOST_PORT` | *(none)* | backend | Host port for direct API access (dev/test only) |
| `DATABASE_URL` | `./data/todos.db` | backend | SQLite file path (relative to `/app`) |
| `FRONTEND_URL` | `http://localhost:8080` | backend | CORS allowed origin (required in production) |
| `LOG_LEVEL` | `info` | backend | Pino log level: `trace\|debug\|info\|warn\|error\|fatal` |
| `FRONTEND_HOST_PORT` | `8080` | frontend | Host port mapped to nginx |
| `BACKEND_CPU_LIMIT` | `1.0` | backend | CPU core limit |
| `BACKEND_MEM_LIMIT` | `512M` | backend | Memory limit |
| `FRONTEND_CPU_LIMIT` | `0.5` | frontend | CPU core limit |
| `FRONTEND_MEM_LIMIT` | `128M` | frontend | Memory limit |
| `DB_ADMIN_PORT` | `8081` | db-admin | Host port for SQLite Web UI |
| `TEST_BACKEND_PORT` | `3001` | test-backend | Host port for isolated test instance |
| `TEST_LOG_LEVEL` | `silent` | test-backend | Log level for test backend |

### Per-Environment Files

Three pre-configured `.env` files are provided — pick one:

| File | `NODE_ENV` | Compose Files Loaded | Key Differences |
|---|---|---|---|
| `.env.development` | `production` ¹ | base + override | Debug logging, backend on `:3000`, db-admin on `:8081`, relaxed security |
| `.env.test` | `test` | base + test overlay | Ephemeral tmpfs DB, backend on `:3001`, frontend disabled, 5s health intervals |
| `.env.production` | `production` | base only | Read-only rootfs, internal-only backend, JSON logs at `info` level |

> ¹ Docker images are production builds (no devDependencies). Dev behaviour is controlled by `LOG_LEVEL`, `FRONTEND_URL`, exposed ports, and relaxed security — not `NODE_ENV`. See [Bug Fix #1](#1-pino-pretty-crash-on-node_envdevelopment).

### Environment Switching

```bash
# Option A: --env-file flag (recommended — no file copying)
docker compose --env-file .env.development up --build
docker compose --env-file .env.test up --build
docker compose --env-file .env.production up --build -d

# Option B: copy to .env (docker compose reads .env automatically)
cp .env.development .env && docker compose up --build

# Option C: npm shortcuts (defined in package.json)
npm run docker:dev       # → --env-file .env.development up --build
npm run docker:test      # → --env-file .env.test up --build
npm run docker:prod      # → --env-file .env.production up --build -d
```

### How `COMPOSE_FILE` Drives Environment Selection

The `COMPOSE_FILE` variable (a Docker Compose built-in) controls which files are loaded:

```
.env.development:  COMPOSE_FILE is unset → docker compose auto-loads override
.env.test:         COMPOSE_FILE=docker-compose.yml:docker-compose.test.yml
.env.production:   COMPOSE_FILE=docker-compose.yml  (base only, no override)
```

This means `--env-file` alone is sufficient to switch the entire environment — no `-f` flags needed.

---

## 11. Health Check Endpoints

### Endpoint Summary

| Service | Endpoint | Response | Interval | Timeout | Start Period | Retries |
|---|---|---|---|---|---|---|
| `backend` | `GET /api/health` | JSON diagnostic payload | 30s | 5s | 15s | 3 |
| `frontend` | `GET /healthz` | `200 ok\n` (plain text) | 30s | 5s | 5s | 3 |

### Backend — `GET /api/health`

The health endpoint was enhanced from a simple pass/fail to a structured diagnostic response. It reports version, uptime, per-check status with latency, and memory usage.

**Healthy response (200):**

```json
{
  "status": "healthy",
  "timestamp": "2026-03-12T18:30:00.000Z",
  "version": "1.0.0",
  "uptime": 3621,
  "checks": {
    "database": {
      "status": "pass",
      "latency": 1
    }
  },
  "memory": {
    "rss": 48,
    "heapUsed": 22,
    "heapTotal": 32
  }
}
```

**Unhealthy response (503):**

```json
{
  "status": "unhealthy",
  "timestamp": "2026-03-12T18:30:00.000Z",
  "version": "1.0.0",
  "uptime": 3621,
  "checks": {
    "database": {
      "status": "fail",
      "message": "SQLITE_CANTOPEN: unable to open database file"
    }
  },
  "memory": {
    "rss": 48,
    "heapUsed": 22,
    "heapTotal": 32
  }
}
```

**Implementation** (`backend/src/app.ts`):

```typescript
app.get('/api/health', async (_req, res) => {
  const checks: Record<string, { status: string; latency?: number; message?: string }> = {};

  try {
    const dbStart = Date.now();
    await db.select().from(schema.todos).limit(1);
    checks.database = { status: 'pass', latency: Date.now() - dbStart };
  } catch (err) {
    checks.database = {
      status: 'fail',
      message: err instanceof Error ? err.message : 'Unknown database error',
    };
  }

  const isHealthy = Object.values(checks).every((c) => c.status === 'pass');
  const mem = process.memoryUsage();

  res.status(isHealthy ? 200 : 503).json({
    status: isHealthy ? 'healthy' : 'unhealthy',
    timestamp: new Date().toISOString(),
    version: process.env.APP_VERSION || '1.0.0',
    uptime: Math.floor(process.uptime()),
    checks,
    memory: {
      rss: Math.round(mem.rss / 1024 / 1024),
      heapUsed: Math.round(mem.heapUsed / 1024 / 1024),
      heapTotal: Math.round(mem.heapTotal / 1024 / 1024),
    },
  });
});
```

This confirms the full stack (Node.js process → Drizzle ORM → SQLite file) is operational, not just that the process is alive. The `checks` object is extensible — future probes (e.g. disk space, external API) can be added without changing the response shape.

### Frontend — `GET /healthz`

A dedicated nginx stub that avoids the overhead of serving the full SPA and is excluded from access logs:

```nginx
location = /healthz {
    access_log off;
    add_header Content-Type text/plain;
    return 200 'ok\n';
}
```

### Docker Health Check Tool

`wget --spider` is used over `curl` because it is included in Alpine by default (via BusyBox), keeping the final image dependency-free. `wget` returns a non-zero exit code on 5xx responses, so the `HEALTHCHECK` correctly fails when the backend returns `503`.

### Compose Health-Gated Startup

```yaml
depends_on:
  backend:
    condition: service_healthy
    restart: true
```

The frontend container **will not start** until the backend health check passes. The `restart: true` option means if the backend health degrades later, Docker Compose will restart the frontend.

---

## 12. Structured Logging & Log Access

### Backend Logging (Pino)

| Concern | Implementation |
|---|---|
| **Library** | Pino (JSON in production, `pino-pretty` in development) |
| **Log level** | Configurable via `LOG_LEVEL` env var (default: `info`) |
| **Request logging** | Middleware logs `{method, path, status, duration}` for every request |
| **Health probe filtering** | `/api/health` requests are **excluded** from request logs to prevent 2,880 noise lines/day at 30s intervals |
| **Startup log** | Structured with `{port, nodeEnv, version, pid}` — confirms process identity on boot |

**Health probe filter** (`backend/src/app.ts`):

```typescript
app.use((req, res, next) => {
  if (req.path === '/api/health') {
    return next();    // skip logging for health probes
  }
  // ... normal request logging
});
```

### Frontend Logging (Nginx)

| Concern | Implementation |
|---|---|
| **Access log** | Default nginx combined format to stdout |
| **Health probe filtering** | `/healthz` has `access_log off` — probes do not pollute access logs |
| **Error log** | Default nginx error log to stderr |

### Compose Log Driver

Both services use `json-file` with rotation to prevent disk exhaustion:

```yaml
logging:
  driver: json-file
  options:
    max-size: "10m"    # backend: 10 MB, frontend: 5 MB
    max-file: "3"      # keep 3 rotated files
    tag: "clearday-backend"  # identifies source in centralized logging
```

### Accessing Logs via `docker compose logs`

```bash
# All services
docker compose logs

# Follow backend logs in real-time
docker compose logs -f backend

# Follow frontend (nginx) logs
docker compose logs -f frontend

# Last 100 lines from backend
docker compose logs --tail 100 backend

# Logs since a timestamp
docker compose logs --since 2026-03-12T18:00:00 backend

# Combined with grep for errors
docker compose logs backend 2>&1 | grep -i error

# JSON parsing with jq (backend production logs are JSON)
docker compose logs --no-log-prefix backend | jq 'select(.status >= 500)'
```

---

## 13. Graceful Shutdown

### Problem

Docker sends `SIGTERM` on `docker compose down`. Without a handler, Node.js terminates immediately, potentially corrupting in-flight SQLite writes or dropping active HTTP connections.

### Solution

**`backend/src/index.ts`** registers `SIGTERM` and `SIGINT` handlers:

```typescript
function shutdown(signal: string) {
  logger.info({ signal }, `Received ${signal}, starting graceful shutdown…`);
  server.close(() => {
    logger.info('HTTP server closed, exiting');
    process.exit(0);
  });

  // Force exit if graceful shutdown takes too long
  setTimeout(() => {
    logger.error('Graceful shutdown timed out after 10s, forcing exit');
    process.exit(1);
  }, 10_000).unref();
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
```

### Shutdown Sequence

```
docker compose down
   │
   ├── Docker sends SIGTERM to PID 1 in each container
   │
   ├── backend receives SIGTERM
   │   ├── stops accepting new connections
   │   ├── waits for in-flight requests to complete
   │   ├── logs "HTTP server closed, exiting"
   │   └── exits with code 0
   │
   ├── frontend (nginx) receives SIGTERM
   │   └── nginx handles SIGTERM natively (drains connections)
   │
   └── if not exited within stop_grace_period → Docker sends SIGKILL
```

### Compose Configuration

```yaml
backend:
  stop_grace_period: 15s     # wait up to 15s for graceful shutdown

frontend:
  stop_grace_period: 5s      # nginx drains faster
```

### Dockerfile

```dockerfile
STOPSIGNAL SIGTERM           # explicit — documents the expected signal
```

---

## 14. Security Hardening

| Measure | Backend | Frontend | Purpose |
|---|---|---|---|
| **Non-root user** | `nodejs:1001` | `appuser:1001` | Limits blast radius of container escape |
| **`read_only: true`** | ✅ *(prod only)* | ✅ *(prod only)* | Immutable root filesystem — relaxed in dev/test overlays |
| **`tmpfs` mounts** | `/tmp` (64M) | `/tmp` (32M), `/var/cache/nginx` (32M), `/var/run` (1M) | Writable scratch space that doesn't persist |
| **`no-new-privileges`** | ✅ *(prod only)* | ✅ *(prod only)* | Prevents `setuid`/`setgid` escalation — relaxed in dev/test |
| **Internal network** | `backend-net` | — | Backend has no direct host or internet access |
| **Port not published** | ✅ *(prod only)* | — | Dev/test expose backend port for direct API access |
| **Nginx security headers** | — | `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`, `X-XSS-Protection` | Browser-side protections |
| **Dotfile blocking** | — | `deny all` on `location ~ /\.` | Prevents serving `.env`, `.git`, etc. |
| **Helmet middleware** | ✅ | — | Additional HTTP security headers from Express |
| **CORS enforcement** | `FRONTEND_URL` required in prod | — | Fail-fast if origin not configured |
| **Rate limiting** | 100 req / 15 min per IP | — | Brute-force protection on API |

---

## 15. Resource Limits

| Service | CPU Limit | CPU Reservation | Memory Limit | Memory Reservation |
|---|---|---|---|---|
| `backend` | 1.0 core | 0.25 core | 512 MB | 128 MB |
| `frontend` | 0.5 core | 0.1 core | 128 MB | 32 MB |
| `db-admin` | 0.25 core | — | 64 MB | — |

All limits are configurable via `.env` variables. Reservations ensure minimum guaranteed resources when the host is under contention.

---

## 16. Environment Profiles (Dev / Test / Prod)

The Docker setup supports three environments, each with its own compose overlay, `.env` file, and npm shortcut.

### Comparison Matrix

| Property | Development | Test | Production |
|---|---|---|---|
| **Compose files** | base + override (auto) | base + test overlay | base only |
| **Env file** | `.env.development` | `.env.test` | `.env.production` |
| **npm script** | `npm run docker:dev` | `npm run docker:test` | `npm run docker:prod` |
| **`NODE_ENV`** | `production` ¹ | `test` | `production` |
| **`LOG_LEVEL`** | `debug` | `warn` / `silent` | `info` |
| **Backend port** | `:3000` published | `:3001` published | internal only |
| **Frontend** | `:8080` (nginx) | disabled | `:8080` (nginx) |
| **Database** | Persistent named volume | Ephemeral tmpfs | Persistent named volume |
| **`FRONTEND_URL`** | `http://localhost:5173` | `http://localhost:8080` | *(must configure)* |
| **`read_only`** | `false` | `false` | `true` |
| **`security_opt`** | relaxed | relaxed | `no-new-privileges` |
| **Health interval** | 30s | 5s (fast CI) | 30s |
| **db-admin** | ✅ auto-started | — | — |

### Development — `docker-compose.override.yml`

Auto-loaded by Docker Compose when present. Overrides the base with:

- `LOG_LEVEL=debug` for verbose output (¹ `NODE_ENV` stays `production` — see [Bug Fix #1](#1-pino-pretty-crash-on-node_envdevelopment))
- Backend port `:3000` published on host for direct API testing
- `FRONTEND_URL=http://localhost:5173` (allows running Vite natively alongside Docker backend)
- `read_only: false`, `security_opt: []` — relaxed for debugging
- `COMPOSE_PROFILES=dev` activates db-admin SQLite browser on `:8081`

```bash
npm run docker:dev
# or: docker compose --env-file .env.development up --build
# or: docker compose up  (override auto-loads)
```

### Test — `docker-compose.test.yml`

Explicit overlay for CI and integration testing:

- `NODE_ENV=test` with `LOG_LEVEL=warn` (or `silent` for test-backend)
- Ephemeral database on tmpfs — destroyed when container stops, no persistent state
- Backend published on `:3001` to avoid port conflicts with dev
- Frontend service disabled (moved to `test-with-frontend` profile)
- Health check intervals tightened to 5s for faster CI startup
- Isolated `test-backend` service available under the `test` profile

```bash
npm run docker:test
# or: docker compose --env-file .env.test up --build
```

### Production — base `docker-compose.yml`

The base compose file is production-ready without any overlays:

- `NODE_ENV=production` — enables Helmet, CORS enforcement, static serving
- Read-only filesystem with `no-new-privileges`
- Backend internal-only (not published to host)
- JSON structured logging at `info` level
- `COMPOSE_FILE=docker-compose.yml` skips the override

```bash
npm run docker:prod
# or: docker compose --env-file .env.production up --build -d
```

### Test-Backend Service (test profile)

An isolated backend instance for integration testing, available via `--profile test`:

| Property | Value |
|---|---|
| Image | Same as backend (`clearday-backend:latest`) |
| Container | `clearday-test-backend` |
| Port | `:3001` → Express API |
| Database | `/tmp/test-todos.db` on tmpfs (ephemeral) |
| Health interval | 5s (fast feedback) |
| `NODE_ENV` | `test` |
| `LOG_LEVEL` | `silent` |

### db-admin Service (dev profile)

| Property | Value |
|---|---|
| Image | `coleifer/sqlite-web:latest` |
| Port | `:8081` → SQLite Web UI |
| Volume | `todo-data:/data:ro` (read-only mount) |
| Network | `backend-net` only |
| Depends on | `backend` (healthy) |

Provides a browser-based SQLite inspector at `http://localhost:8081`.

---

## 17. Build Context & .dockerignore

**File:** `.dockerignore`

Both Dockerfiles use the **project root** as build context (required for monorepo workspace resolution). The `.dockerignore` aggressively excludes non-essential files to minimize context transfer time:

| Excluded | Reason |
|---|---|
| `node_modules`, `**/node_modules` | Reinstalled via `npm ci` in container |
| `**/dist`, `**/coverage`, `**/build` | Rebuilt during Docker build |
| `data/`, `backend/data/` | Development SQLite files; production uses a named volume |
| `.env`, `.env.*` | Secrets should use env vars or Docker secrets |
| `_bmad/`, `_bmad-output/`, `docs/` | BMAD tooling not needed at runtime |
| `e2e/`, `test-results/`, `**/__tests__/`, `**/*.spec.*`, `**/*.test.*` | Test artifacts |
| `**/Dockerfile`, `docker-compose*.yml` | Prevent recursive context inclusion |
| `.git`, `.vscode`, `.idea` | VCS and IDE metadata |

**Preserved:** `README.md` and `.env.example` are explicitly kept via negation rules.

---

## 18. Test Coverage

All health check and logging changes are covered by automated tests. **75/75 backend tests pass.**

### Health Endpoint Tests (`health.test.ts` — 18 tests)

| Test | Priority | What it verifies |
|---|---|---|
| Returns 200 with status healthy | P0 | Basic health endpoint is up |
| Valid ISO 8601 timestamp | P1 | Timestamp field is parseable |
| JSON content type | P1 | Response is `application/json` |
| Responds within <100ms | P2 | Performance gate |
| Includes version field | P1 | `version` is a string |
| Includes uptime as non-negative integer | P1 | `uptime` ≥ 0 |
| Includes checks.database with pass + latency | P1 | DB check is structured and timed |
| Includes memory usage metrics in MB | P2 | `rss`, `heapUsed`, `heapTotal` present |
| Returns 503 when DB fails (SQLITE_CANTOPEN) | P0 | Unhealthy response with `checks.database.status = fail` and error `message` |
| JSON content type even when unhealthy | P1 | Error response is still JSON |
| Security headers (5 tests) | P0–P1 | Helmet headers present on health endpoint |
| CORS headers (3 tests) | P0–P1 | Correct origin allowed, preflight handled |

### Logger Tests (`logger.test.ts` — 10 tests)

| Test | Priority | What it verifies |
|---|---|---|
| Logger exports configured Pino instance | P0 | Module loads correctly |
| Respects LOG_LEVEL env var | P0 | Level is `silent` in test env |
| Does not interfere with health/API/POST responses | P1 | Middleware doesn't break response cycle |
| Processes various HTTP methods | P1 | GET/POST/PATCH/DELETE all work |
| Logs method, path, status, duration for GET | P0 | Structured log fields correct for GET /api/todos |
| Logs method, path, status, duration for POST | P0 | Structured log fields correct for POST /api/todos |
| Log message includes method, path, status | P1 | Human-readable message string |
| **Does not log health check probe requests** | **P1** | **Confirms `/api/health` is filtered from logs** |

---

## 19. Quick-Start Commands

```bash
# ── Environment shortcuts (recommended) ──
npm run docker:dev                         # development: debug logs, ports exposed, db-admin
npm run docker:test                        # test: ephemeral DB, fast health checks
npm run docker:prod                        # production: detached, locked down
npm run docker:down                        # stop containers (data preserved)
npm run docker:down:v                      # stop + DELETE data volume ⚠️
npm run docker:logs                        # follow all service logs

# ── Equivalent docker compose commands ──
docker compose --env-file .env.development up --build     # dev
docker compose --env-file .env.test up --build            # test
docker compose --env-file .env.production up --build -d   # prod

# ── Access ──
open http://localhost:8080                 # app (via nginx)
curl http://localhost:3000/api/health      # backend direct (dev/test only)
curl http://localhost:8080/api/health      # backend via nginx (all envs)
open http://localhost:8081                 # SQLite Web admin (dev only)

# ── Logs ──
docker compose logs -f backend             # tail backend logs
docker compose logs -f frontend            # tail frontend logs
docker compose logs --tail 100 backend     # last 100 lines
docker compose logs backend | jq 'select(.status >= 500)'  # filter errors (prod JSON)

# ── Maintenance ──
docker compose ps                          # check status + health
docker compose exec backend sh             # shell into backend
docker compose build --no-cache            # full rebuild
docker images | grep clearday              # check image sizes

# ── Environment switching without npm ──
cp .env.development .env && docker compose up --build     # dev
cp .env.test .env && docker compose up --build            # test
cp .env.production .env && docker compose up --build -d   # prod
```

---

## 20. Risk Assessment

| Risk | Severity | Mitigation |
|---|---|---|
| SQLite single-writer bottleneck | Medium | WAL mode enabled; sufficient for single-instance todo app. If scaling needed, swap to PostgreSQL container. |
| `node:20-alpine` CVEs | Low | Pin to specific digest in CI; run `docker scout cves` regularly. |
| `better-sqlite3` build breaks on Alpine updates | Low | Lock Alpine version in base image; the `prod-deps` stage isolates native compilation. |
| Volume data loss on `docker compose down -v` | High | Documented in usage header; backups recommended for production. |
| `read_only` rootfs incompatibility | Low | All writable paths mapped to `tmpfs`; tested with the specific application. Dev/test overlays relax to `read_only: false`. |
| Rate limit bypass via proxy chaining | Low | `express-rate-limit` uses `X-Forwarded-For` header set by nginx; trust proxy config may need tuning for multi-proxy setups. |
| Override auto-loading confusion | Low | Documented that `docker compose up` = dev mode; production must use `--env-file .env.production` or explicit `-f`. |
| Test/dev port conflicts | Low | Test backend uses `:3001`, dev uses `:3000`. Documented in per-env files. |

---

## 21. Bug Fixes (Runtime Validation)

The following bugs were discovered and fixed during `docker compose up` runtime validation. All four were invisible at build time and only surfaced when the containers actually started.

### 1. `pino-pretty` crash on `NODE_ENV=development`

| Field | Detail |
|---|---|
| **Symptom** | Backend crash-loops: `Error: unable to determine transport target for "pino-pretty"` |
| **Root cause** | The dev overlay set `NODE_ENV=development`, which triggered the Pino logger to load `pino-pretty` as a transport. But `pino-pretty` is a devDependency — stripped from the production Docker image by `npm ci --omit=dev`. |
| **Fix (logger)** | Made the logger resilient: probe for `pino-pretty` via `createRequire().resolve()` before configuring the transport. Falls back to JSON output if the module is missing. |
| **Fix (overlay)** | Removed `NODE_ENV=development` from `docker-compose.override.yml` and `.env.development`. Docker images always run with `NODE_ENV=production`. Dev behavior is controlled by `LOG_LEVEL`, `FRONTEND_URL`, exposed ports, and relaxed security. |
| **Files changed** | `backend/src/middleware/logger.ts`, `docker-compose.override.yml`, `.env.development` |

**Logger fix** (`backend/src/middleware/logger.ts`):

```typescript
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

function hasPinoPretty(): boolean {
  try {
    require.resolve('pino-pretty');
    return true;
  } catch {
    return false;
  }
}

export const logger = pino({
  level: process.env.LOG_LEVEL || 'info',
  transport:
    process.env.NODE_ENV === 'development' && hasPinoPretty()
      ? { target: 'pino-pretty' }
      : undefined,
});
```

---

### 2. Missing `todos` table on fresh Docker volume

| Field | Detail |
|---|---|
| **Symptom** | Health check returns `503 unhealthy` with `"message": "no such table: todos"` |
| **Root cause** | The `todo-data` named volume starts empty. SQLite creates the `.db` file automatically, but Drizzle ORM doesn't auto-create tables — that requires `drizzle-kit push` (migration). No migration step was included in the Docker startup. |
| **Fix** | Added `CREATE TABLE IF NOT EXISTS` to `backend/src/db/index.ts` so the schema is bootstrapped on first connection. Idempotent — safe to run on existing databases. |
| **Files changed** | `backend/src/db/index.ts` |

**Migration fix** (`backend/src/db/index.ts`):

```typescript
// Auto-create tables if they don't exist (handles fresh Docker volumes)
sqlite.exec(`
  CREATE TABLE IF NOT EXISTS todos (
    id TEXT PRIMARY KEY,
    text TEXT NOT NULL,
    completed INTEGER NOT NULL DEFAULT false,
    created_at TEXT NOT NULL
  )
`);
```

---

### 3. Nginx `Permission denied` on `/var/cache/nginx/client_temp`

| Field | Detail |
|---|---|
| **Symptom** | Frontend crash-loops: `nginx: [emerg] mkdir() "/var/cache/nginx/client_temp" failed (13: Permission denied)` |
| **Root cause** | The Dockerfile runs `chown -R appuser:appgroup /var/cache/nginx` at build time. But the compose file mounts a `tmpfs` at `/var/cache/nginx` at runtime, which creates a fresh root-owned filesystem — overriding the build-time ownership. |
| **Fix** | Added `uid=1001,gid=1001` to the tmpfs mount options so the filesystem is created with the correct ownership. Same fix applied to `/var/run`. |
| **Files changed** | `docker-compose.yml` |

**tmpfs fix** (`docker-compose.yml`):

```yaml
tmpfs:
  - /tmp:size=32M
  - /var/cache/nginx:size=32M,uid=1001,gid=1001    # ← fixed
  - /var/run:size=1M,uid=1001,gid=1001              # ← fixed
```

---

### 4. Frontend health check `Connection refused` (IPv6 mismatch)

| Field | Detail |
|---|---|
| **Symptom** | Frontend container reports `unhealthy` despite nginx serving requests. Health check log: `wget: can't connect to remote host: Connection refused` |
| **Root cause** | Alpine's `wget` resolves `localhost` to `::1` (IPv6 loopback). But nginx's `listen 8080;` directive binds to `0.0.0.0:8080` (IPv4 only). The health check connected to IPv6 where nothing was listening. |
| **Fix** | Changed the health check URL from `http://localhost:8080/healthz` to `http://127.0.0.1:8080/healthz` in both the Dockerfile `HEALTHCHECK` and the compose `healthcheck`. |
| **Files changed** | `frontend/Dockerfile`, `docker-compose.yml` |

**Health check fix** (`frontend/Dockerfile`):

```dockerfile
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://127.0.0.1:8080/healthz || exit 1
```

---

### Verification

After all four fixes, `docker compose up --build` produces:

```
NAME                STATUS
clearday-backend    Up (healthy)    :3000 → Express API + SQLite
clearday-frontend   Up (healthy)    :8080 → Nginx SPA + API proxy
```

All endpoints confirmed working:

| Endpoint | Result |
|---|---|
| `curl localhost:3000/api/health` | `200` — `healthy`, `database: pass`, latency 1ms |
| `curl localhost:8080/healthz` | `200` — `ok` |
| `curl localhost:8080/` | `200` — SPA served |
| `curl localhost:8080/api/health` | `200` — nginx proxy → backend → `healthy` |
| `POST localhost:8080/api/todos` | `201` — todo created, persisted in SQLite |

**75/75 backend tests pass** after all fixes.

---

*Report generated for the Clearday Todo Application Docker containerization effort.*

