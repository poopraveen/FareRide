# FareRide

FareRide is a multi-service mobility and delivery platform: ride-hailing first, then food and parcel delivery, with digital payments and real-time tracking. It has an original brand and design, and it is built as a production engineering project.

> **Status:** Phase 1 (architecture and requirements). There is no application code yet. Phase 2 sets up the monorepo.

## Documentation

| Document                                     | What it covers                                                           |
| -------------------------------------------- | ------------------------------------------------------------------------ |
| [docs/REQUIREMENTS.md](docs/REQUIREMENTS.md) | Product scope, MVP, user roles, non-functional requirements, assumptions |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | System design, modules, real-time, payments, deployment, phases          |
| [docs/DATABASE.md](docs/DATABASE.md)         | Entities, ER diagram, constraints, indexes, cache keys                   |
| [docs/API.md](docs/API.md)                   | REST conventions, error format, endpoint contract, socket events         |
| [docs/SECURITY.md](docs/SECURITY.md)         | Threat model, authentication, authorization, controls                    |
| [docs/adr/](docs/adr/)                       | Architecture Decision Records                                            |

## Planned stack

- **Web:** Next.js (App Router), React, TypeScript, Tailwind CSS, shadcn/ui, TanStack Query, Zustand, React Hook Form + Zod, MapLibre GL, PWA
- **API:** NestJS on Fastify, Prisma, PostgreSQL + PostGIS, Redis, Socket.IO, BullMQ, OpenAPI
- **Tooling:** Turborepo, pnpm, ESLint, Prettier, Vitest, Playwright, Husky, GitHub Actions, Docker

## Repository layout (from Phase 2)

```text
apps/       customer-web, driver-web, admin-web, restaurant-web (later), api, worker
packages/   ui, domain, validation, types, api-client, config, testing, eslint-config, tsconfig
infrastructure/  docker, nginx, deployment
docs/       architecture, API, database, security, ADRs
```

## License

Not chosen yet.
