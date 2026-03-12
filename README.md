# ☀️ ClearDay

A simple, reliable todo application built with the [BMAD method](https://github.com/bmadcode/BMAD-METHOD). Full-stack TypeScript monorepo featuring a React frontend, Express API backend, and SQLite persistence — all containerised with Docker.

---

## Table of Contents

- [Overview](#overview)
- [Requirements](#requirements)
- [Architecture](#architecture)
- [My Experience](#my-experience)
- [Planning Artifacts](#planning-artifacts)
- [Test & Quality Artifacts](#test--quality-artifacts)
- [AI Documentation](#ai-documentation)
- [Prerequisites](#prerequisites)
- [Getting Started (Local)](#getting-started-local)
- [Docker](#docker)
- [Testing](#testing)
- [Scripts Reference](#scripts-reference)

---

## Overview

ClearDay is a full-stack todo application designed as a reference implementation of the BMAD (Build Measure Analyze Deliver) development method. It provides:

- **Task management** — create, complete, and delete todos
- **Theme toggle** — light / dark mode with system preference detection
- **Accessible UI** — WCAG 2.1 AA compliant
- **Responsive design** — works on desktop and mobile devices
- **Production-ready Docker deployment** — multi-stage builds, non-root containers, health checks, and network isolation

## Requirements

For product goals, scope, and success metrics see the [Product Requirements Document](./_bmad-output/planning-artifacts/prd.md).

## Architecture

For the full tech stack, project structure, and system design see the [Architecture Document](./_bmad-output/planning-artifacts/architecture.md).

## My Experience

For my lessons learned, observations, and sprint-by-sprint notes — see [My Experience](./docs/my-experience.md).

## Planning Artifacts

Discovery, design, and planning documents produced during the BMAD workflow are available in [`_bmad-output/planning-artifacts/`](./_bmad-output/planning-artifacts/):

| Document | Description |
|---|---|
| [Epics](./_bmad-output/planning-artifacts/epics.md) | Epic breakdown and sprint plan |
| [User Personas](./_bmad-output/planning-artifacts/user-personas.md) | Target user profiles and characteristics |
| [Jobs to Be Done](./_bmad-output/planning-artifacts/jobs-to-be-done.md) | JTBD framework — user motivations and desired outcomes |
| [User Journey Maps](./_bmad-output/planning-artifacts/user-journey-maps.md) | End-to-end user flows and touchpoints |
| [User Interview Scripts](./_bmad-output/planning-artifacts/user-interview-scripts.md) | Interview guides for user research |
| [Wireframes](./_bmad-output/planning-artifacts/wireframes.md) | UI wireframes and layout specifications |
| [UX → Architecture Handoff](./_bmad-output/planning-artifacts/ux-architecture-handoff.md) | Design-to-engineering handoff document |
| [Accessibility Audit](./_bmad-output/planning-artifacts/accessibility-audit.md) | Accessibility requirements and audit criteria |

## Test & Quality Artifacts

Detailed reports generated during QA sprints are available in [`_bmad-output/test-artifacts/`](./_bmad-output/test-artifacts/):

| Report | Description |
|---|---|
| [Accessibility Report](./_bmad-output/test-artifacts/accessibility-report.md) | WCAG 2.1 AA compliance audit — axe-core results, keyboard navigation, screen reader, colour contrast |
| [Docker Containerization Report](./_bmad-output/test-artifacts/docker-containerization-report.md) | Container architecture review — multi-stage builds, networking, health checks, security hardening |
| [Security Review Report](./_bmad-output/test-artifacts/security-review-report.md) | Full-stack security audit — backend, frontend, dependencies, configuration, data handling |
| [Test Coverage Report](./_bmad-output/test-artifacts/test-coverage-report.md) | Coverage analysis across unit, component, integration, E2E, accessibility, performance, and security |
| [UI Performance Report](./_bmad-output/test-artifacts/ui-performance-report.md) | Performance metrics via Playwright CDP — LCP, CLS, TBT, DOM size, resource loading |

Sprint-level test reviews are also available:
[Sprint 1](./_bmad-output/test-artifacts/sprint-1-test-review.md) ·
[Sprint 2](./_bmad-output/test-artifacts/sprint-2-test-review.md) ·
[Sprint 3](./_bmad-output/test-artifacts/sprint-3-test-review.md) ·
[Sprint 4](./_bmad-output/test-artifacts/sprint-4-test-review.md) ·
[Sprint 5](./_bmad-output/test-artifacts/sprint-5-test-review.md)

## AI Documentation

This project was built entirely through human–AI collaboration using the BMAD method. The following documents capture that process:

| Document | Description |
|---|---|
| [AI Contributions](./docs/ai-contributions.md) | Which AI agents were involved and what they produced |
| [AI Interactions](./docs/ai-interactions.md) | Full timeline of every human–AI interaction across all project phases |

## Prerequisites

- **Node.js** ≥ 20
- **npm** ≥ 9 (ships with Node 20)
- **Docker** & **Docker Compose** (for containerised workflows)

## Getting Started (Local)

```bash
# 1. Clone the repository
git clone <repo-url> && cd clearday

# 2. Install all workspace dependencies
npm install

# 3. Build the shared types package
npm run build -w shared

# 4. Start backend + frontend in dev mode (hot reload)
npm run dev
```

The frontend will be available at **http://localhost:5173** and the API at **http://localhost:3000**.

## Docker

ClearDay ships with a multi-environment Docker Compose setup.

### Development

```bash
npm run docker:dev
# or: docker compose --env-file .env.development up --build
```

- Backend exposed on **http://localhost:3000**
- Frontend (Nginx) on **http://localhost:8080**
- SQLite browser (dev profile): `docker compose --profile dev up` → **http://localhost:8081**

### Production

```bash
npm run docker:prod
# or: docker compose --env-file .env.production up --build -d
```

Runs in detached mode with production-hardened defaults (read-only filesystems, resource limits, no-new-privileges).

### Test Environment

```bash
npm run docker:test
# or: docker compose --env-file .env.test up --build
```

Runs backend with `NODE_ENV=test` using an ephemeral tmpfs database — data is destroyed when the container stops.

## Testing

### Unit & Component Tests

```bash
# All workspaces
npm run test

# Individual workspaces
npm run test:backend
npm run test:frontend
npm run test:shared

# With coverage
npm run test:backend -- --coverage
npm run test:frontend -- --coverage
```

Coverage thresholds are set to **80%** across statements, branches, functions, and lines.

### End-to-End Tests (Playwright)

```bash
npm run test:e2e
```

Runs against Chromium, Firefox, WebKit, Mobile Chrome, and Mobile Safari. Tests cover:

- Critical user paths (create, complete, delete todos)
- Accessibility (axe-core automated scans)
- Theme toggle & persistence
- UI loading / empty / error states
- Performance metrics (LCP, CLS, TBT)


## Scripts Reference

| Script | Description |
|---|---|
| `npm run dev` | Start backend + frontend in dev mode (hot reload) |
| `npm run build` | Build shared → backend → frontend |
| `npm run test` | Run all unit/component tests |
| `npm run test:e2e` | Run Playwright E2E tests |
| `npm run typecheck` | Type-check all workspaces |
| `npm run docker:dev` | Docker Compose — development mode |
| `npm run docker:test` | Docker Compose — test mode |
| `npm run docker:prod` | Docker Compose — production mode (detached) |
| `npm run docker:down` | Stop containers |
| `npm run docker:down:v` | Stop containers + delete data volume |
| `npm run docker:logs` | Tail container logs |
| `npm run stop` | Kill local dev processes (ports 3000, 5173, 8080, 8081) and stop Docker containers |

---

Built with the [BMAD Method](https://github.com/bmadcode/BMAD-METHOD) ·
Node ≥ 20 · TypeScript · React · Express · SQLite · Docker

