# QA Visual User Journeys Checklist

Use this checklist to validate the full user journey across backend (Django), web (React), and mobile (Flutter) with real-time updates. Mark items as you verify them during development.

Legend: [ ] Planned  [~] In progress  [x] Done

## Setup & Smoke
- [ ] Backend up: `docker compose up` starts API, Redis, Celery, Daphne at `http://localhost:5050` without errors.
- [ ] Frontend up: `yarn start` serves at `http://localhost:3000` (env points to backend).
- [ ] Channels works: open WS `ws://localhost:5050/ws/live-map-consumer/` and `ws://localhost:5050/ws/presenter-dashboard/` (no errors on connect).
- [ ] Admin ready: `http://localhost:5050/admin` loads, static files served.
- [ ] DB seeded: minimum fixtures exist (regions, parties, candidates, election 2024).

## Public User Journeys (Web)
- [ ] Welcome Page: `GET /` renders, links to login/register and results.
- [ ] Latest Results: `GET /latest-results` shows national summary (leaders, totals) with loading and empty states.
- [ ] Regional Results: `GET /latest-results-regional` shows per‑region cards; click region opens `RegionDetails`.
- [ ] Live Map: `GET /map-view` displays Ghana map polygons colored by leading party; hover shows tooltips; legend visible.
- [ ] Drilldown: change filters (year/level/scope) updates charts/map; breadcrumb reflects scope.
- [ ] Election Summary: `GET /election-summary` and `GET /final-result` show aggregates with charts.

## Data Admin Journeys (Web)
- [ ] Register Data Admin: `GET /register-data-admin` → submit → email verification prompt → success page.
- [ ] Login Data Admin: `GET /login-data-admin` → redirect to `/data-admin-dashboard`.
- [ ] Dashboard: key KPIs (submissions, completeness, last update) render without errors.
- [ ] Entities Lists: regions, constituencies, EAs, polling stations, parties, candidates, elections load with pagination.
- [ ] Election 2024 Page: `GET /election-2024` shows overall, per‑region, and party breakdowns.
- [ ] Media & Static: logos and images load correctly from `REACT_APP_BASE_URL_MEDIA`.

## Presenter Journeys (Web)
- [ ] Login Presenter: `GET /login-presenter` → success → `/presenter-dashboard`.
- [ ] Presenter Dashboard: leaders panel, swing regions list, region ladder render; timestamps present.
- [ ] Live Updates: when results change (see Realtime Sync), presenter dashboard updates within 1–2s (visual delta highlight).
- [ ] Navigation: jump from dashboard to map and back retains filters (year/level).

## Correspondent Journeys (Mobile)
- [ ] Splash & Orientation: app boots portrait, splash transitions to onboarding.
- [ ] Region Selection: onboarding lets user select region successfully.
- [ ] Login: valid credentials log in; session persists on relaunch.
- [ ] Submit Result (stub until endpoint ready): form opens, allows data entry and image capture; validates required fields; shows confirmation.
- [ ] Offline Queue (stub): disable network → submit → queued; re‑enable → upload resumes; success toast.

## Realtime Sync Scenarios (Cross‑Repo)
- [ ] Map Live Update: open `/map-view`; trigger a backend result insert (admin action or API `POST`); the leading party color for the impacted region updates live (WS).
- [ ] Presenter Live Update: open `/presenter-dashboard`; submit a new result that flips a leader; dashboard highlights change (delta).
- [ ] Drilldown Sync: with map filtered to a specific region, submit a polling station result in that region; both region card and detail view increment without page reload.
- [ ] Multi‑client Fan‑out: watch map on two browsers; a single submission updates both sessions within seconds.

## API Validation (Backend)
- [ ] Accounts: register → email verify → login returns token (`POST api/accounts/login-user/`) and profile photo URL.
- [ ] Regions API: `GET api/regions/...` returns expected schema; pagination works.
- [ ] Elections Summary: `GET api/elections/...` endpoints return leaders, totals, and are performant (<300ms on local).
- [ ] WebSocket Messages: `ws/live-map-consumer` returns payload with `candidates`, `display_names_list`, and optional `geojson`/`completeness` fields.
- [ ] Celery/Redis: email task enqueues and runs; no broker errors in logs.

## Error & Edge Cases
- [ ] Auth Guards: visiting admin/presenter routes without auth redirects to login.
- [ ] 401 Handling: expired token triggers logout + toast; user returns to login.
- [ ] Empty Data: no results yet → UIs show friendly empty states (maps default to neutral).
- [ ] Slow Network: skeleton loaders display until data arrives.
- [ ] CORS/CSRF: frontend calls succeed on dev; no CORS errors in console.

## Deployment & Config Checks
- [ ] Env Files: backend `.env` and frontend `.env` set (no secrets in code).
- [ ] WS URL: `REACT_APP_BASE_URL_WS_URL` correct and reachable from browser.
- [ ] Static/Media: images resolve via `REACT_APP_BASE_URL_MEDIA` across pages.
- [ ] Allowed Hosts: `DJANGO_ALLOWED_HOSTS` correct for the environment; no 400 host errors.

## Data Integrity (When Ingestion API Is Ready)
- [ ] Idempotency: same submission (same idempotency key) is not double‑counted.
- [ ] Provenance: submission records capture `submitted_by`, timestamps, and attachments.
- [ ] Aggregation: PS → EA → Constituency → Region totals reconcile; totals match sum of children.

## Presenter UX Quality
- [ ] Readability: on large screens, dashboard uses high contrast and clear typography.
- [ ] Change Highlights: most recent change is distinctly visible (color or badge).
- [ ] Timeline Scrub (planned): moving scrubber updates metrics historically without errors.

## Mobile UX Quality
- [ ] Token Storage: secure storage persists session (no re‑login after restart).
- [ ] Retry Logic: failed upload resumes without duplicating entries.
- [ ] Camera Capture: photo size constrained; preview before submit.

---

Tips
- Keep multiple browser windows open (map + presenter) to verify fan‑out behavior.
- Use predictable test edits (e.g., adjust a single region’s votes) to see clear visual changes.
- Watch backend logs for Celery and Channels to confirm events and broadcasts.

