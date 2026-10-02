# FareRide

FareRide is a multi-service mobility and delivery platform: ride-hailing first, then food and parcel delivery, with digital payments and real-time tracking. It has an original brand and design, and it is built as a production engineering project.

> **Status:** Phase 3 (design system). The API serves `/health` and `/ready` (MongoDB and Redis); the web apps share the `packages/ui` components, previewed at `/design-system` in the customer app. Features start in Phase 4.

## Documentation

| Document                                       | What it covers                                                           |
| ---------------------------------------------- | ------------------------------------------------------------------------ |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md)   | Product scope, MVP, user roles, non-functional requirements, assumptions |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md)   | System design, modules, real-time, payments, deployment, phases          |
| [docs/DATABASE.md](docs/DATABASE.md)           | Entities, ER diagram, constraints, indexes, cache keys                   |
| [docs/API.md](docs/API.md)                     | REST conventions, error format, endpoint contract, socket events         |
| [docs/SECURITY.md](docs/SECURITY.md)           | Threat model, authentication, authorization, controls                    |
| [docs/DESIGN_SYSTEM.md](docs/DESIGN_SYSTEM.md) | Tokens, themes, components and accessibility checks                      |
| [CONTRIBUTING.md](CONTRIBUTING.md)             | Workflow, commit conventions, quality gates                              |
| [docs/adr/](docs/adr/)                         | Architecture Decision Records                                            |

## Getting started

Requirements: Node.js 22 (see `.nvmrc`), pnpm 10 (`corepack enable`), Docker.

```bash
pnpm install
cp .env.example .env          # local defaults; every variable is documented there
pnpm db:up                    # MongoDB (single-node replica set) and Redis via Docker Compose
pnpm dev                      # all apps in watch mode
```

To use your Atlas cluster instead of the local container, put its `mongodb+srv://` string in `MONGODB_URI` in your local `.env`, never in committed files. FareRide always uses the `MONGODB_DB_NAME` database (default `fareride`), so its collections stay separate from other apps on the cluster.

| App          | URL                                                                |
| ------------ | ------------------------------------------------------------------ |
| API          | http://localhost:4000 (`/health`, `/ready`, Swagger UI at `/docs`) |
| Customer web | http://localhost:3000                                              |
| Driver web   | http://localhost:3001                                              |
| Admin web    | http://localhost:3002                                              |

## Scripts

| Command                       | What it does                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------- |
| `pnpm dev`                    | Run every app in watch mode                                                       |
| `pnpm build`                  | Build all packages and apps (Turborepo, cached)                                   |
| `pnpm lint`                   | ESLint with type-aware rules                                                      |
| `pnpm typecheck`              | TypeScript in strict mode, no emit                                                |
| `pnpm test`                   | Unit and integration tests (integration tests need `MONGODB_URI` and `REDIS_URL`) |
| `pnpm format`                 | Prettier                                                                          |
| `pnpm db:up` / `pnpm db:down` | Start or stop local MongoDB and Redis                                             |

## Stack

- **Web:** Next.js (App Router), React, TypeScript, Tailwind CSS, Radix primitives in shadcn style; TanStack Query, Zustand, React Hook Form + Zod and MapLibre GL arrive with their phases
- **API:** NestJS on Fastify, MongoDB with Mongoose, Redis, OpenAPI; Socket.IO and BullMQ arrive with their phases
- **Tooling:** Turborepo, pnpm, ESLint, Prettier, Vitest, Husky, commitlint, GitHub Actions, Docker

## Repository layout

```text
apps/
  api/            NestJS API (REST, later Socket.IO)
  customer-web/   Next.js PWA for customers
  driver-web/     Next.js PWA for drivers and delivery partners
  admin-web/      Next.js operations console
packages/
  config/         Validated environment schemas and regional defaults
  types/          API envelope, error codes and shared contracts
  ui/             Design system: tokens, themes and accessible components
  tsconfig/       Shared TypeScript configs
  eslint-config/  Shared ESLint flat configs
docs/             Architecture, API, database, security, ADRs
```

Packages for domain rules (`domain`), validation and the API client are added in the phases that first need them.

## License

Not chosen yet.
