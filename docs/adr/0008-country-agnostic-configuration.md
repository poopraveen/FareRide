# 0008. Country-specific behaviour as configuration

- Status: Accepted
- Date: 2026-10-02

## Context

The launch country is not decided. Currency, phone number format, locale, time zone, taxes and providers all depend on it.

## Decision

Nothing country-specific is hard-coded. The `city` table carries time zone, currency and service area; fare rules are per city and service type; phone parsing uses a configured default region; provider adapters are selected by environment variables. Development defaults are `USD`, region `US`, locale `en`, fake payments and console SMS.

## Consequences

- Choosing a launch country is a configuration and adapter change, not a code rewrite.
- Money is always stored with its currency, which also prepares for multi-currency.
