# 0009. MongoDB as the primary database

- Status: Accepted
- Date: 2026-10-02
- Decided by: product owner

## Context

The original design used PostgreSQL with PostGIS and Prisma. The product owner chose MongoDB instead and asked for FareRide's data to be kept separate on their existing Atlas cluster. Prisma 7 does not support MongoDB, and the stack otherwise targets current major versions.

## Decision

- MongoDB is the system of record, in a dedicated database (`MONGODB_DB_NAME`, default `fareride`) so FareRide never shares collections with other applications on the cluster.
- The connection string comes only from the `MONGODB_URI` environment variable, never from code or committed files.
- The API uses Mongoose through `@nestjs/mongoose`, with `strict` and `strictQuery` on.
- Money and state transitions use multi-document transactions, guarded conditional updates with a `version` field, and unique partial indexes for invariants such as one active ride per driver (see DATABASE.md).
- Geography uses GeoJSON with `2dsphere` indexes; live driver positions stay in Redis GEO (ADR 0007).
- Local development and CI run MongoDB as a single-node replica set, because transactions require a replica set.

## Consequences

- The schema is flexible and maps naturally to nested documents such as order items and profiles.
- Relational guarantees that PostgreSQL gave for free (foreign keys, check constraints, joins) become application responsibilities. They are covered by the patterns in DATABASE.md and by integration tests against a real replica set.
- Ledger and reporting queries use the aggregation pipeline instead of SQL; heavy analytics may later move to a warehouse fed by change streams.
- If MongoDB proves a poor fit for payments, the money collections can move to PostgreSQL behind the same service interfaces without touching the rest of the system.
