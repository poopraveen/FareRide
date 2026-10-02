# API

REST over HTTPS, JSON only, versioned under `/v1`. The OpenAPI 3.1 document is generated from the same Zod schemas the API validates with, and is served at `/docs` outside production. Real-time events use Socket.IO on the same origin.

## Design rules

1. **Resources and actions.** State transitions are explicit action endpoints (`POST /v1/rides/:id/accept`), never `PATCH { status }`, so each transition has its own authorization, validation and audit entry.
2. **Thin controllers.** Validate with Zod, call a service, map to a response DTO. Services are transport-agnostic, so a GraphQL layer could later resolve against the same services.
3. **The server is authoritative.** Prices, fees, statuses and balances are computed by the API. Client-sent values for them are ignored.

## Request pipeline

`request-id` → security headers → rate limiter (Redis) → authentication (JWT) → role and ownership guards → Zod validation → controller → response envelope → exception filter.

## Envelopes

Success:

```json
{
  "success": true,
  "data": { "id": "0192f7c4-...", "status": "SEARCHING_DRIVER" },
  "meta": { "nextCursor": "eyJpZCI6...", "limit": 20 },
  "requestId": "01J9Z..."
}
```

Error:

```json
{
  "success": false,
  "error": {
    "code": "RIDE_NOT_FOUND",
    "message": "Ride was not found",
    "details": {}
  },
  "requestId": "01J9Z..."
}
```

- `code` is a member of a typed union exported from `packages/types`, so clients can handle errors exhaustively.
- Validation errors use `VALIDATION_FAILED` with `details.fields: [{ path, message }]`.
- Stack traces are logged with the request ID and never returned outside development.

## Conventions

| Concern | Convention |
| --- | --- |
| Versioning | URI prefix `/v1`. Breaking changes go to `/v2`; the old version stays for one release cycle |
| IDs | UUIDv7 strings |
| Time | ISO 8601 UTC strings |
| Money | `{ "amountMinor": 1250, "currency": "USD" }` |
| Pagination | Cursor: `?cursor=&limit=` (default 20, max 100) for feeds and history. Offset (`?page=&pageSize=`) only for admin tables |
| Filtering | Whitelisted per endpoint, e.g. `?status=COMPLETED&from=2026-10-01&to=2026-10-31` |
| Sorting | `?sort=-createdAt` (minus for descending), whitelisted fields only |
| Idempotency | `Idempotency-Key` header required on `POST /rides`, `/orders`, `/deliveries`, `/payments`, `/wallet/topups`. The first response is stored for 24 h and replayed for the same key; a different body with the same key returns `409 IDEMPOTENCY_KEY_REUSED` |
| Request ID | `X-Request-Id` accepted or generated; echoed in the response header and body |
| Rate limits | `429 RATE_LIMITED` with `Retry-After` |

## Status codes

| Code | Use |
| --- | --- |
| 200 | Read or action succeeded |
| 201 | Resource created |
| 202 | Accepted for asynchronous processing (OTP sent, refund queued) |
| 204 | Success with no body |
| 400 | `VALIDATION_FAILED` |
| 401 | `UNAUTHENTICATED`, `TOKEN_EXPIRED` |
| 403 | `FORBIDDEN` (role or ownership) |
| 404 | Not found, or not visible to this user |
| 409 | `INVALID_RIDE_TRANSITION`, `VERSION_CONFLICT`, `IDEMPOTENCY_KEY_REUSED` |
| 422 | Business rule: `QUOTE_EXPIRED`, `ACTIVE_RIDE_EXISTS`, `DRIVER_NOT_APPROVED`, `INSUFFICIENT_BALANCE` |
| 429 | `RATE_LIMITED` |
| 500 | `INTERNAL_ERROR` |
| 503 | `/ready` when a dependency is down |

## Endpoints (MVP)

All paths are prefixed with `/v1`. "Auth" lists who may call it; ownership checks apply on top.

### Auth

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/auth/otp/request` | public | Send OTP to a phone number (`202`) |
| POST | `/auth/otp/verify` | public | Verify OTP; creates the user if new; sets session cookies |
| POST | `/auth/register` | public | Email + password registration (customers, optional) |
| POST | `/auth/login` | public | Email + password login; TOTP required for staff roles |
| POST | `/auth/refresh` | refresh cookie | Rotate refresh token, issue new access token |
| POST | `/auth/logout` | any | Revoke current session |
| GET | `/auth/sessions` | any | List active sessions |
| DELETE | `/auth/sessions/:id` | any | Revoke one session |

### Users

| Method | Path | Auth |
| --- | --- | --- |
| GET, PATCH | `/users/me` | any |
| GET, POST | `/users/me/addresses` | customer |
| PATCH, DELETE | `/users/me/addresses/:id` | customer |

### Pricing and rides

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/fares/estimate` | customer | Route plus one signed quote per service type, valid 5 min |
| POST | `/rides` | customer | Book with a quote ID and payment method |
| GET | `/rides` | customer, driver | Own ride history (cursor) |
| GET | `/rides/:id` | customer, driver (own), staff | Ride detail with timeline |
| POST | `/rides/:id/cancel` | customer, assigned driver | Cancel with reason; fee computed server-side |
| POST | `/rides/:id/accept` | offered driver | Accept the current offer |
| POST | `/rides/:id/decline` | offered driver | Decline the current offer |
| POST | `/rides/:id/arrive` | assigned driver | Mark arrived (geofence checked) |
| POST | `/rides/:id/start` | assigned driver | Start trip |
| POST | `/rides/:id/complete` | assigned driver | End trip; final fare computed |
| POST | `/rides/:id/rating` | customer, driver | Rate the other party |

### Drivers

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/drivers/onboarding` | driver | Create driver profile |
| POST | `/drivers/me/documents/upload-url` | driver | Presigned upload URL for a KYC document |
| POST | `/drivers/me/documents` | driver | Register an uploaded document for review |
| GET, POST | `/drivers/me/vehicles` | driver | List or add vehicles |
| POST | `/drivers/me/availability` | approved driver | `ONLINE` or `OFFLINE` |
| GET | `/drivers/me/earnings` | driver | `?period=day`, `week` or `month` |
| GET | `/drivers/nearby` | customer | Jittered positions without IDs, for the home map |

### Payments and wallet

| Method | Path | Auth | Purpose |
| --- | --- | --- | --- |
| POST | `/payments` | customer | Create a payment intent for a subject |
| GET | `/payments/:id` | owner, staff | Server-verified status |
| POST | `/webhooks/payments/:provider` | provider signature | Provider events |
| GET | `/wallet` | any | Balance |
| GET | `/wallet/transactions` | any | Ledger (cursor) |
| POST | `/wallet/topups` | customer | Start a top-up |
| POST | `/promotions/validate` | customer | Check a code against a quote (post-MVP) |

### Admin

| Method | Path | Auth |
| --- | --- | --- |
| GET | `/admin/dashboard` | support, admin |
| GET | `/admin/customers`, `/admin/customers/:id` | support, admin |
| GET | `/admin/drivers`, `/admin/drivers/:id` | support, admin |
| POST | `/admin/drivers/:id/approve`, `/admin/drivers/:id/reject` | admin |
| GET | `/admin/rides`, `/admin/rides/:id` | support, admin |
| POST | `/admin/rides/:id/cancel` | admin |
| GET | `/admin/payments` | support, admin |
| POST | `/admin/payments/:id/refund` | admin |
| GET | `/admin/audit-logs` | admin |

### Operations

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Liveness: process is up (no dependency checks) |
| GET | `/ready` | Readiness: PostgreSQL and Redis reachable |

Food, parcel, restaurant, support and promotions-admin endpoints follow the same rules and are specified in their phases.

## Socket.IO events

Connection: `wss://<api-origin>/realtime`, authenticated with the access token in the handshake `auth` field. The socket is disconnected when the token expires unless the client re-authenticates.

| Direction | Event | Payload | Who |
| --- | --- | --- | --- |
| client → server | `location:update` | `{ lat, lng, heading, speedMps, recordedAt }` | Online driver |
| client → server | `ride:subscribe` | `{ rideId }` (ownership checked) | Customer, driver |
| server → client | `ride:offer` | `{ rideId, pickup, dropoff, fare, expiresAt }` | Offered driver |
| server → client | `ride:status` | `{ rideId, status, version, etaSeconds? }` | Ride room |
| server → client | `driver:location` | `{ rideId, lat, lng, heading, recordedAt }` | Ride room |
| server → client | `notification:new` | `{ id, type, title, body }` | User room |
| server → client | `connection:resync` | `{}` | Tells the client to refetch state |

Every payload is validated with the shared Zod schemas, and the event map is a typed interface in `packages/types`, so the server and clients share one definition.
