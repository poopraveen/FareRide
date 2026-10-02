# 0007. Redis GEO index and single-driver offers for dispatch

- Status: Accepted
- Date: 2026-10-02

## Context

Dispatch needs to find nearby available drivers in milliseconds and must never assign two drivers to one ride or one driver to two rides.

## Decision

Online drivers are kept in a Redis GEO set per city and service type, with a per-driver location key that expires after 30 seconds to mark staleness. Dispatch runs `GEOSEARCH`, filters stale or busy drivers, ranks by ETA, and offers to one driver at a time with a 15-second lock. Acceptance is a guarded database update.

## Consequences

- Fast lookups without loading MongoDB with high-frequency writes.
- One-at-a-time offers are simpler and fairer, but slower to match than broadcasting to many drivers; offering to the top few in parallel is a later tuning option.
- Redis becomes critical for dispatch, so it runs as a managed, persistent instance.
