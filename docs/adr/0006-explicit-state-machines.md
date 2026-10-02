# 0006. Explicit state machines in a shared domain package

- Status: Accepted
- Date: 2026-10-02

## Context

Rides, food orders and deliveries move through many states driven by several actors. Boolean flags such as `isStarted` and `isCancelled` allow impossible combinations.

## Decision

Each lifecycle has one status enum and a transition table (from, to, allowed actors, guard) in `packages/domain`. The API applies transitions as guarded conditional updates (filtered on the current status and version), and writes an event document in the same transaction. Types are discriminated unions keyed on status.

## Consequences

- Invalid transitions are rejected with `409` and cannot be represented in types.
- The web apps can render status from the same definitions without duplicating rules.
- Every transition is unit-testable without a database.
