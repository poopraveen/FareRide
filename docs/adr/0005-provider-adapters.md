# 0005. Provider adapters for maps, payments, SMS and storage

- Status: Accepted
- Date: 2026-10-02

## Context

The launch market is not yet decided, and the right map, payment and SMS providers differ by country and price.

## Decision

Business code depends only on interfaces: `MapProvider`, `PaymentProvider`, `SmsProvider`, `EmailProvider`, `StorageProvider`. Each has a fake or console implementation for development and tests, plus real adapters: MapLibre and a hosted routing API, Stripe, Twilio Verify and S3-compatible storage. The active adapter is chosen by configuration.

## Consequences

- Swapping or adding a provider touches one adapter.
- E2E tests run against deterministic fakes.
- Interfaces cover the common subset; a provider-specific feature needs an interface change.
