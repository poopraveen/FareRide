# 0004. In-house authentication with rotating refresh tokens

- Status: Accepted
- Date: 2026-10-02

## Context

Login is phone + OTP for customers and drivers, email + password + TOTP for staff. Drivers keep long-lived socket connections. Hosted identity providers add cost and lock-in, and web-only libraries do not cover sockets or the worker well.

## Decision

Implement authentication in the `auth` module: Argon2id passwords, hashed OTPs with attempt and rate limits, 15-minute EdDSA-signed JWT access tokens, and 30-day opaque refresh tokens with rotation and family revocation on reuse. Tokens travel in HttpOnly cookies for the web apps.

## Consequences

- Full control over OTP flows, roles, sessions and socket auth.
- FareRide owns the security of this code, so it gets dedicated tests and is reviewed in the Phase 14 hardening pass.
