# 0002. Modular monolith instead of microservices

- Status: Accepted
- Date: 2026-10-02

## Context

The platform must eventually support millions of users, but it is built by one developer and has no users yet. Microservices bring independent scaling and deploys at the cost of distributed transactions, service discovery, cross-service auth and tracing.

## Decision

Build one NestJS API process and one worker process. Inside the API, modules own their tables, expose services, and communicate through service calls, an in-process event bus, and BullMQ for slow or external work. Third parties sit behind provider interfaces.

## Consequences

- One deploy, one database transaction boundary, simple local development.
- The whole API scales together, including hot paths such as location ingestion.
- Module boundaries are enforced by convention and lint rules (no cross-module table access), so the first extractions (real-time gateway, dispatch) stay possible.
