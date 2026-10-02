# Contributing

## Workflow

1. Branch from `main` with a short descriptive name (`phase-4-auth`, `fix-ready-timeout`).
2. Keep each pull request to one phase or one concern.
3. CI must be green before merging: format, lint, typecheck, migrations, tests and build.
4. A change to the architecture lands with an ADR in `docs/adr/` in the same pull request.

## Commits

Commits follow [Conventional Commits](https://www.conventionalcommits.org/), enforced by commitlint on `commit-msg`:

```text
feat(api): add OTP request endpoint
fix(customer-web): keep pickup pin visible on small screens
docs: describe dispatch timeouts
```

`pre-commit` runs Prettier on staged files through lint-staged.

## Code rules

- TypeScript strict mode everywhere; no `any`.
- Validate every external input with Zod (requests, socket payloads, environment).
- Business rules live in services or `packages/domain`, never in controllers or React components.
- No country-specific constants in code: use configuration (ADR 0008).
- Never put secrets in `NEXT_PUBLIC_` variables or commit `.env` files.
- A feature is done only when it meets the definition of done in `docs/REQUIREMENTS.md`.

## Database changes

```bash
pnpm --filter @fareride/api db:migrate --name <change>   # creates and applies a migration locally
```

Review the generated SQL before committing it. Breaking changes use expand-then-contract across two releases.

## Tests

| Level             | Tool                                     | Location                              |
| ----------------- | ---------------------------------------- | ------------------------------------- |
| Unit              | Vitest                                   | next to the code, `*.test.ts`         |
| HTTP (in-process) | Vitest + Fastify inject                  | `apps/api/test/*.e2e.test.ts`         |
| Integration       | Vitest against real PostgreSQL and Redis | `apps/api/test/*.integration.test.ts` |
| End to end        | Playwright                               | added in Phase 9                      |
