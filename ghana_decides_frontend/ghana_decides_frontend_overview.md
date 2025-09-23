# Ghana Decides Frontend Overview

Purpose: Web client for elections results, dashboards, live maps, admin tooling, and presenter flows.

Stack
- React (Create React App)
- Routing via `react-router-dom`
- Env-driven API/WS base URLs (`REACT_APP_*`)
- Tailwind/utility CSS present

Structure
- Entry: `src/index.js`
- Routes: `src/App.js` (Welcome, Login, Register, Data Admin, Presenter, Results, Map, Top 20, Summary, Settings, Dashboards)
- API constants: `src/Constants.js` (now env-driven)
- Static content: `public/`

Key Routes (examples)
- `/` Welcome, `/login`, `/register`
- Data Admin: `/data-admin-dashboard`, lists for regions/constituencies/electoral areas/polling stations/parties/candidates/elections
- Presenter: `/login-presenter`, `/presenter-dashboard`
- Elections: `/latest-results`, `/latest-results-regional`, `/map-view`, `/election-summary`, `/final-result`

Configuration
- `.env` supports `REACT_APP_BASE_URL`, `REACT_APP_BASE_URL_MEDIA`, `REACT_APP_BASE_URL_WS_URL`
- `Constants.js` derives ws URL from base when not provided

Run Locally
- `yarn install && yarn start`
- Default connects to `http://localhost:5050` unless overridden by env

Current State (high level)
- Route scaffolding present for most flows
- Needs verification of API wiring, loading/error states, auth guards
- WebSocket integrations for live map/presenter dashboard expected via env WS URL

Planned Upgrades for Real‑time UI
- Central WS client utility to subscribe to `map:<year>:<level>:<scope>` and `presenter:<year>`.
- MapView: render precomputed GeoJSON, color by leader, drill‑down filters (year, level, scope), completeness and last_updated.
- Presenter Dashboard: leaders panel, swing regions, deltas since last update, timeline scrubber.
- Global UI states: consistent loading skeletons, empty and error components.
- Route guards and centralized API client with 401 handling.
