# Architecture Decision Records

Each record captures one decision with real alternatives: the context, the choice, and its consequences. Records are immutable once accepted; a later change is a new record that supersedes the old one.

| #                                              | Decision                                              | Status   |
| ---------------------------------------------- | ----------------------------------------------------- | -------- |
| [0001](0001-record-architecture-decisions.md)  | Record architecture decisions                         | Accepted |
| [0002](0002-modular-monolith.md)               | Modular monolith instead of microservices             | Accepted |
| [0003](0003-monorepo-turborepo-pnpm.md)        | Turborepo and pnpm monorepo                           | Accepted |
| [0004](0004-in-house-authentication.md)        | In-house authentication with rotating refresh tokens  | Accepted |
| [0005](0005-provider-adapters.md)              | Provider adapters for maps, payments, SMS and storage | Accepted |
| [0006](0006-explicit-state-machines.md)        | Explicit state machines in a shared domain package    | Accepted |
| [0007](0007-redis-geo-dispatch.md)             | Redis GEO index and single-driver offers for dispatch | Accepted |
| [0008](0008-country-agnostic-configuration.md) | Country-specific behaviour as configuration           | Accepted |
| [0009](0009-mongodb-primary-database.md)       | MongoDB as the primary database                       | Accepted |
| [0010](0010-esm-and-typescript-6.md)           | ESM everywhere and TypeScript 6 for now               | Accepted |
| [0011](0011-owned-component-library.md)        | An owned component library on Radix primitives        | Accepted |

Template: copy `0001` and keep the headings Context, Decision, Consequences.
