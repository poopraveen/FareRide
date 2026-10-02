# 0003. Turborepo and pnpm monorepo

- Status: Accepted
- Date: 2026-10-02

## Context

Four web apps, an API and a worker share types, validation schemas, domain rules and UI components.

## Decision

Use one repository with pnpm workspaces and Turborepo for task orchestration and caching. Shared code lives in `packages/*`; apps never import from other apps.

## Consequences

- Type-safe sharing without publishing packages.
- pnpm's strict dependency layout prevents phantom imports.
- Nx was rejected as heavier than needed; npm workspaces were rejected for weaker hoisting and slower installs.
