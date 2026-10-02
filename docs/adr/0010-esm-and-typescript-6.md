# 0010. ESM everywhere and TypeScript 6 for now

- Status: Accepted
- Date: 2026-10-02

## Context

NestJS 12 ships as ES modules, as do Next.js and most current tooling. TypeScript 7 (the native compiler) is the latest release, but typescript-eslint 8 supports TypeScript only up to 6.0, and type-aware linting is a quality gate for this project.

## Decision

- Every workspace is `"type": "module"` and compiles with `module: NodeNext`. Relative imports use `.js` extensions.
- The repository pins TypeScript `~6.0`. The upgrade to TypeScript 7 happens once typescript-eslint supports it; it is a dependency bump, not a code change.
- Internal packages compile to `dist/` with type declarations, so the API, worker and web apps consume them the same way.

## Consequences

- One module system across server and browser code, with no CommonJS interop layer.
- Type checking runs on the JavaScript-based compiler until the upgrade, which is slower than TypeScript 7 but fully supported by the lint toolchain.
