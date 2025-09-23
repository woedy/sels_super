# Ghana Decides Frontend Checklist

Purpose: track feature readiness for the web client (UI + API wiring).

Legend: [ ] Planned  [~] In progress  [x] Done

## 1. Authentication & Onboarding (UI)
- [~] Login view(s): general, data admin, presenter
- [~] Registration flows: general, data admin, presenter
- [ ] Forgot/Reset password screens
- [ ] Email verification UX (enter code, resend)
- [ ] Route guards (private routes) + token handling
- [ ] Global 401/403 handling (logout + redirect)

## 2. Core Elections UI
- [~] Latest results (national/regional)
- [~] Map view + details
- [~] Top 20 constituencies
- [~] Election summary + final results
- [ ] Loading skeletons + empty/error states across screens
 - [ ] Completeness and last_updated indicators
 - [ ] Drill‑down filters: year, level, scope (General/Region/Constituency/EA/PS)

## 3. Data Admin UI
- [~] Dashboard overview
- [~] Lists: regions, constituencies, electoral areas, polling stations
- [~] Lists: parties, presidential candidates, parliamentary candidates, elections
- [ ] CRUD modals/forms with validation and toasts
- [ ] Pagination, filters, debounced search

## 4. Presenter UI
- [~] Presenter dashboard view
- [ ] Realtime updates via WS; visible deltas
- [ ] On-air friendly theme (readability, contrast)
 - [ ] Swing regions list and change highlights
 - [ ] Timeline scrubber to review changes

## 5. API Wiring
- [ ] Axios client with base URL from `REACT_APP_BASE_URL`
- [ ] Error normalization + toasts
- [ ] Authentication headers with stored token
- [ ] WebSocket client using `REACT_APP_BASE_URL_WS_URL`
 - [ ] Subscribe to standardized WS groups (`map:<year>:<level>:<scope>`, `presenter:<year>`) and handle reconnections

## 6. Settings & Profile
- [ ] User settings page (password, notifications)
- [ ] Basic profile display + edit

## 7. Cross-cutting Quality
- [ ] Centralized loading/empty/error patterns
- [ ] Accessibility: labels, keyboard nav, contrast
- [ ] Performance: code split heavy routes (charts/maps)
- [ ] Telemetry hooks in prod (e.g., Sentry)

## 8. Release Readiness
- [x] Env-driven endpoints in `Constants.js`
- [ ] Dev/stage/prod env presets
- [ ] 404/500 pages styled and routed
- [ ] Smoke test scripts for main flows
 - [ ] Basic Lighthouse checks for key pages

Notes
- Verify WS endpoints: `ws/live-map-consumer/`, `ws/presenter-dashboard/`.
- Ensure CORS/CSRF align with backend configuration in production.
