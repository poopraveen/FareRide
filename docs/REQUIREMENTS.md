# Requirements

This document fixes what FareRide must do, for whom, and to what quality bar. The design that meets it is in [ARCHITECTURE.md](ARCHITECTURE.md).

## 1. Users and roles

| Role          | Who                                                                      | Primary app               |
| ------------- | ------------------------------------------------------------------------ | ------------------------- |
| `CUSTOMER`    | Books rides, orders food, sends parcels                                  | customer-web              |
| `DRIVER`      | Drives rides; also acts as delivery partner for food and parcels         | driver-web                |
| `RESTAURANT`  | Restaurant staff managing menus and incoming orders                      | restaurant-web (Phase 11) |
| `SUPPORT`     | Handles tickets, views rides and payments, cannot change configuration   | admin-web                 |
| `ADMIN`       | Operations: KYC, users, refunds, promotions, reports                     | admin-web                 |
| `SUPER_ADMIN` | Everything `ADMIN` can do, plus role management and system configuration | admin-web                 |

One person may hold several roles (for example, a driver who also books rides as a customer). Roles are enforced by the API; frontend route guards are a convenience only.

## 2. MVP scope

The MVP is complete when a customer can register, book a ride, track the driver, complete the trip, pay with server-verified payment and rate the driver, against a driver account approved by an admin, end to end in production over HTTPS.

### Customer (MVP)

- [ ] Phone + OTP login, profile, saved addresses
- [ ] Current location, map, pickup and destination search
- [ ] Fare estimate per service type (signed quote)
- [ ] Book ride, cancel ride (with server-computed cancellation fee when applicable)
- [ ] Live driver tracking with ETA
- [ ] Payment by card, wallet or cash; trip receipt
- [ ] Rate the driver; ride history
- [ ] In-app and web-push notifications

### Driver (MVP)

- [ ] Phone + OTP login, onboarding, KYC document upload, vehicle registration
- [ ] Online / offline
- [ ] Receive ride offers, accept or decline
- [ ] Navigation hand-off to the device's maps app
- [ ] Arrive, start trip, complete trip
- [ ] Earnings by day, week and month; trip history; ratings

### Admin (MVP)

- [ ] Email + password + TOTP login
- [ ] Dashboard: revenue, active, completed and cancelled rides, active drivers, customers
- [ ] Customers, drivers (with KYC approve / reject), rides, payments with refunds
- [ ] Audit log

### After the MVP

Food delivery, parcel delivery, promo codes, support tickets, restaurant management, promotions admin, reports and export, system configuration UI, scheduled rides, multi-stop rides, payouts automation, surge pricing, multi-city, multi-currency, additional languages.

## 3. Non-functional requirements

| Area          | Requirement                                                                                                                 |
| ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Performance   | LCP < 2.5 s, INP < 200 ms, CLS < 0.1 at p75 on mid-range mobile; only claimed once measured                                 |
| API latency   | p95 < 300 ms for reads, < 500 ms for writes, excluding third-party calls                                                    |
| Real-time     | Driver position visible to the customer within 3 s of the driver's device reporting it                                      |
| Availability  | Single region at MVP; target 99.5% monthly for the API                                                                      |
| Scalability   | Stateless app tiers scale horizontally; design targets millions of users without a rewrite (see ARCHITECTURE.md section 10) |
| Security      | OWASP ASVS level 2 as the target; see SECURITY.md                                                                           |
| Accessibility | WCAG 2.2 AA                                                                                                                 |
| Responsive    | Tested at 360, 390, 768, 1024, 1440 and 1920 px                                                                             |
| Browsers      | Last 2 versions of Chrome, Safari (iOS and macOS), Firefox, Edge                                                            |
| Data          | Point-in-time recovery for PostgreSQL; documented restore procedure                                                         |
| Observability | Structured logs with request IDs, metrics, traces, error tracking, `/health` and `/ready`                                   |

## 4. Definition of done (per feature)

A feature is done when the UI, API and database changes work together; validation, error handling, loading and empty states exist; authentication and authorization are enforced on the server; tests exist at the right levels; it works at all six widths; accessibility is checked; documentation is updated; and production configuration has been considered.

## 5. Assumptions

These are in force until changed:

1. **Launch market is not decided yet.** Everything country-specific is configuration, not code: default currency, phone number region, locale, time zone, payment provider and SMS provider. Development defaults are currency `USD`, phone region `US`, locale `en`, the fake payment provider and the console SMS provider.
2. One launch city and one currency at MVP. The schema carries `city_id` and `currency` columns so more can be added later.
3. English UI first, with all strings externalised for translation from the start.
4. Customer and driver apps are PWAs, not native apps. Background location on iOS is limited for PWAs, so drivers keep the app in the foreground during a trip.
5. Driver navigation hands off to the device's maps app at MVP.
6. Cash payments are allowed and settled against the driver's wallet.
7. Platform commission is one configurable percentage.
8. Restaurant staff get their own app in Phase 11.
9. One developer, so the design favours one deployable API over many services.

## 6. Decisions taken (approved 2026-10-02)

| Decision       | Choice                                                                                            |
| -------------- | ------------------------------------------------------------------------------------------------- |
| Product name   | FareRide                                                                                          |
| Repository     | github.com/poopraveen/FareRide                                                                    |
| Maps           | MapLibre GL for rendering + hosted routing/geocoding behind a `MapProvider` adapter               |
| Payments       | `PaymentProvider` interface; Stripe adapter first, plus a fake provider for development and tests |
| SMS / OTP      | `SmsProvider` interface; Twilio Verify adapter, console provider in development                   |
| Cloud          | Google Cloud (Cloud Run, Cloud SQL, Memorystore); images stay provider-agnostic                   |
| Auth           | In-house implementation (ADR 0004)                                                                |
| Launch country | Open; see assumption 1                                                                            |
