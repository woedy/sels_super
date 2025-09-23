# Ghana Decides Backend Checklist

Purpose: track backend feature readiness and API/WebSocket coverage.

Legend: [ ] Planned  [~] In progress  [x] Done

## 1. Authentication & Onboarding (API)
- [~] User registration endpoints (user, data admin, presenter, correspondent)
- [~] Email verification token + resend
- [~] Login (TokenAuth) + device/FCM token
- [ ] JWT-based auth with refresh/rotation (migration)
- [~] Forgot/reset password flow (OTP + new password)
- [ ] Rate limiting on auth endpoints

## 2. User Profile & Accounts
- [~] Create profile on registration (phone, country, photo, id_card)
- [ ] Edit profile endpoint + validations
- [ ] Active status tracking (login/logout)
- [ ] Delete/deactivate account
- [~] Activities audit trail entries for key events

## 3. Regions & Geo
- [~] CRUD: regions, constituencies, electoral areas, polling stations
- [~] RegionLayerCoordinate storage for map polygons
- [ ] Import/export tools for shape/coordinate data
- [ ] Indexing for geo queries/performance

## 4. Parties & Candidates
- [~] CRUD: parties (color, logo), candidates (parl/prez)
- [ ] Bulk import (CSV/JSON) for candidates
- [ ] Validation: unique constraints, referential integrity checks

## 5. Elections & Results
- [~] Election creation (year, level)
- [~] Vote recording models per level (PS → EA → Cons → Region → National)
- [~] Aggregations + serializers for summaries
- [ ] Ingestion jobs for results (Celery) + idempotency
- [ ] Data integrity checks and reconciliation tools
 - [ ] Idempotent results submission API (polling station) with provenance
 - [ ] Aggregation service module (PS→EA→Constituency→Region→National)
 - [ ] Redis caching for precomputed map/dashboard payloads

## 6. Realtime & Dashboards
- [x] Channels/ASGI setup (Daphne)
- [x] Live Map consumer (`ws/live-map-consumer/`)
- [~] Presenter dashboard consumer (`ws/presenter-dashboard/`)
- [ ] Auth/permissions for WS connections
- [ ] Broadcast on data changes (model signals or tasks)
 - [ ] Standardize WS group names (`map:<year>:<level>:<scope>`; `presenter:<year>`)
 - [ ] Normalize payload shape (leaders, totals, completeness, last_updated, geojson)

## 7. Search
- [~] Basic endpoints for searching entities
- [ ] Pagination, ranking, defensive query limits

## 8. Notifications & Communications
- [~] SMTP email support (env-driven)
- [ ] Email templates for key flows
- [ ] FCM push notifications helper using server key
- [ ] Background scheduling via Celery Beat

## 9. Video Call Signaling
- [~] Models: Room, Offer, Answer, Caller/CalleeCandidates
- [ ] REST endpoints for WebRTC signaling
- [ ] Expiration/cleanup of stale rooms/candidates

## 10. Admin & Settings
- [~] Admin site wired for main models
- [ ] Settings API for runtime configuration
- [ ] Role-based access control (RBAC) for admin endpoints

## 11. Security & Ops
- [x] Env-driven secrets and config
- [ ] CORS/CSRF locked down for prod
- [ ] Audit log for auth events
- [ ] Healthcheck endpoint (DB/Redis)
- [ ] Nginx + TLS reverse proxy in prod
 - [ ] WS auth middleware (token/JWT) and topic authorization
 - [ ] Rate limiting on auth and submission endpoints
 - [ ] Sentry/observability hooks (Django, Celery, Channels)

## 12. Testing & Tooling
- [ ] Unit tests for serializers/views/consumers
- [ ] Integration tests for WebSockets (Channels)
- [ ] Load testing for hot endpoints
- [ ] CI pipeline (lint, tests)

Notes
- Many endpoints exist but need production hardening (validations, permissions, rate limits, tests).
- Consider migration to JWT for mobile/web.
 - Remove legacy compose files; keep single compose with prod overlay.
 - Fix `live_map_consumers.py` filter branch and remove dead debug paths.
