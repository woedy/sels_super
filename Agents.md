# Ghana Decides — Agents Overview

This document is a living, high‑level overview of the Ghana Decides project for agents and contributors. It explains the repositories, architecture, key modules, runtime services, and how pieces fit together so you can quickly get context and make safe changes.

## Quick Summary

- Purpose: End‑to‑end election results and insights platform for Ghana.
- Components: Django backend (APIs, WebSockets, tasks), React web frontend, Flutter mobile app, and AI assistants/tools.
- Real‑time: WebSockets via Django Channels for live dashboards and map updates; Celery for background jobs.
- Data: Regions, parties, candidates, elections, and votes at multiple aggregation levels.

---

## Repository Layout

- `ghana_decides/` — Django backend (APIs, Channels, Celery, Docker)
- `ghana_decides_frontend/` — React (Create React App) frontend
- `ghana_decides_correspondent/` — Flutter mobile app for correspondents

Supporting/utility:
- AI tools: `ghana_decides/sels/` (Streamlit + LangChain + Gemini) and `ghana_decides/sels/sels_ai.py` (LlamaIndex + Ollama)
- Docker & infra: `ghana_decides/Dockerfile`, `ghana_decides/docker-compose.yml`

---

## Backend (Django)

Key files:
- Settings: `ghana_decides/ghana_decides_proj/settings.py`
- URL routing: `ghana_decides/ghana_decides_proj/urls.py`
- ASGI/Channels: `ghana_decides/ghana_decides_proj/asgi.py`, `ghana_decides/ghana_decides_proj/routing.py`
- Celery tasks: `ghana_decides/ghana_decides_proj/tasks.py`
- Requirements: `ghana_decides/requirements.txt`
- Docker: `ghana_decides/Dockerfile`, `ghana_decides/docker-compose.yml`

Installed domain apps (selected):
- `accounts`, `user_profile`, `activities`
- `regions` (regions, constituencies, electoral areas, polling stations)
- `elections`, `candidates`, `parties`
- `video_call` (signaling data), `chat`, `search`, `homepage`, `settings`

### Authentication & Users
- Custom user model: `accounts.User` (see `AUTH_USER_MODEL` in settings).
- REST auth uses DRF TokenAuth today. Consider JWT for expiring tokens and mobile/web compatibility.
- Accounts API: registration flows for users, data admins, presenters; email verification; password reset; login.
  - Endpoints are mounted under `api/accounts/` (see `ghana_decides/accounts/api/urls.py`).

### REST API Mount Points
Mounting is in `ghana_decides/ghana_decides_proj/urls.py`:
- `api/accounts/`
- `api/regions/`
- `api/parties/`
- `api/candidates/`
- `api/elections/`
- `api/search/`
- `api/settings/`

Each app typically exposes `api/urls.py` and `api/views.py` with serializers.

### WebSockets (Channels)
- ASGI app: `ghana_decides/ghana_decides_proj/asgi.py`
- Routing: `ghana_decides/ghana_decides_proj/routing.py`
- Active endpoints:
  - `ws/presenter-dashboard/` → presenter dashboard live updates
  - `ws/live-map-consumer/` → live election map data
- Example consumer: `ghana_decides/elections/api/consumers/live_map_consumers.py`
- Chat example (in `chat/`) exists but is not wired in routing by default.

### Background Tasks (Celery)
- Celery app configured in settings (env‑driven). Broker/result via Redis.
- Example task: send email (`ghana_decides/ghana_decides_proj/tasks.py`).

### Data & Models (selected overview)
- Regions & maps: `regions` app manages regions and map geometry (e.g., `RegionLayerCoordinate`) used to build GeoJSON served via WebSockets for the live map.
- Elections: aggregates and per‑level votes (presidential/parliamentary) at polling station → electoral area → constituency → region → national.
- Parties & Candidates: party metadata, colors/logos, candidate affiliations.
- Accounts & Profiles: `accounts` + `user_profile` for roles (User, Data Admin, Presenter, Correspondent), profile data, activity feed (`activities`).
- Video call signaling: `video_call/models.py` includes `Room`, `Offer`, `Answer`, and ICE candidates for WebRTC signaling.

### Configuration & Env
- The project uses environment variables for all secrets and deployment toggles.
- Example env file: `ghana_decides/.env.example`
- Important variables:
  - `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`
  - Database: `DB_ENGINE`, `DB_NAME`, `DB_USER`, `DB_PASSWORD`, `DB_HOST`, `DB_PORT`
  - Redis & Celery: `REDIS_URL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`
  - Email: `DJANGO_EMAIL_*`, `DJANGO_DEFAULT_FROM_EMAIL`
  - CORS/CSRF: `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`
  - Push: `FCM_SERVER_KEY`

### Runtime
- ASGI server: Daphne (see compose) for HTTP + WebSockets.
- Channels configured with `channels_redis` and `CHANNEL_LAYERS`.
- Static/media: configured in settings; ideally served by a reverse proxy in production.

---

## Frontend (React — CRA)

Key files:
- Entry: `ghana_decides_frontend/src/index.js`
- Routes: `ghana_decides_frontend/src/App.js` (many routes for results, dashboards, admin flows)
- API/WS constants: `ghana_decides_frontend/src/Constants.js`
- Env example: `ghana_decides_frontend/.env` (project‑specific; not committed by default)

Highlights:
- Rich route set for elections views (latest results, maps, top 20, summaries), data admin tools, and presenter dashboard.
- Base URLs are env‑driven via `REACT_APP_BASE_URL`, `REACT_APP_BASE_URL_MEDIA`, `REACT_APP_BASE_URL_WS_URL` with fallbacks.

---

## Mobile (Flutter — Correspondent)

Key files:
- App entry: `ghana_decides_correspondent/lib/main.dart`
- Config/constants: `ghana_decides_correspondent/lib/constants.dart`

Highlights:
- Oriented for portrait mobile use by correspondents (field data flow, registration, region selection).
- Standard Flutter project structure with Android/iOS scaffolding.

---

## AI & Assistant Tools

### Streamlit + LangChain (SELS Election AI)
- File: `ghana_decides/sels/sels_election_ai.py`
- Purpose: Q&A over uploaded PDFs using Gemini embeddings and FAISS vector store.
- Requires `GOOGLE_API_KEY` in environment. Saves `faiss_index` locally.

### LlamaIndex + Ollama (Local Agent)
- File: `ghana_decides/sels/sels_ai.py`
- Purpose: Local code/doc Q&A with a ReAct agent; loads docs from `./data`.
- Models: `Ollama` (e.g., `phi3`, `codellama`), embeddings `BAAI/bge-m3`.
- Useful during development for code navigation and API doc assistance.

---

## Docker & Services

Compose file: `ghana_decides/docker-compose.yml`
- `redis` — Redis for Channels/Celery
- `db` — Postgres (optional; SQLite supported when not configured)
- `ghana_decides_app` — Django via Daphne ASGI (`gh_decides_proj.asgi:application`)
  - Loads env from `ghana_decides/.env`
- `ghana_decides_frontend` — React static server (serve build on port 5000 mapped to host 3000)
- `celery`, `celery-beat` — background workers (env‑driven)

Production recommendation:
- Add Nginx reverse proxy (TLS, static/media, caching) in front of Daphne.
- Collapse legacy compose variants and keep a single base + prod override.

Dockerfiles:
- Backend: `ghana_decides/Dockerfile` (Python 3.8‑alpine)
- Frontend: `ghana_decides_frontend/Dockerfile` (Node 16, builds CRA, serves with `serve`)

---

## Security & Operations Notes

- Never commit secrets. Use env vars; rotate any values previously committed.
- Production toggles:
  - `DJANGO_DEBUG=False`
  - `DJANGO_ALLOWED_HOSTS` set to your domains
  - Lock down CORS/CSRF origins to required hosts only
- Use Daphne/Uvicorn behind Nginx or an ingress for HTTPS, static/media, and caching.
- Consider JWT for auth tokens and refresh/expiry semantics.
- Review permissions on admin endpoints; avoid empty permission classes for sensitive actions.

WebSockets security and groups
- Use token/JWT middleware to authorize WS connections and topic subscriptions.
- Standardize group names for targeting, e.g., `map:<year>:<level>:<scope[:name]>`, `presenter:<year>`.

---

## Local Development Quickstart

1) Backend
- Copy and edit envs: `cp ghana_decides/.env.example ghana_decides/.env`
- Run: `docker compose -f ghana_decides/docker-compose.yml up --build`
- Django (Daphne): `http://localhost:5050`

2) Frontend
- From `ghana_decides_frontend/`: `yarn install && yarn start`
- Configure `.env` with `REACT_APP_BASE_URL` etc., or rely on defaults.

3) Mobile
- Open `ghana_decides_correspondent/` in Android Studio or VS Code; run on device/emulator.

---

## Conventions & Tips

- API endpoints live under `api/<app>/` and are wired in `ghana_decides/ghana_decides_proj/urls.py`.
- WebSockets are mapped in `ghana_decides/ghana_decides_proj/routing.py`.
- For Channels scaling, ensure Redis is reachable and `CHANNEL_LAYERS` is configured via env.
- Place new background jobs in `ghana_decides_proj/tasks.py` or per‑app `tasks.py` and decorate with `@shared_task`.
- Keep secrets, domains, and ports env‑driven to support multiple deployments.

Real‑time “Magic Wall” plan
- Ingestion API: idempotent `POST` to accept polling station results; store provenance.
- Aggregation service: compute rollups (PS→EA→Constituency→Region→National) on write; cache payloads in Redis.
- Events: model signals trigger Celery task to recompute, cache, and broadcast to WS groups.
- Map payloads: serve precomputed GeoJSON + leaders/completeness/last_updated.
- Frontend WS: central client subscribes to `map` and `presenter` channels; MapView supports drill‑down filters; Presenter dashboard shows deltas.

---

## Notable Paths (for quick navigation)

- Backend settings: `ghana_decides/ghana_decides_proj/settings.py`
- Backend URLs: `ghana_decides/ghana_decides_proj/urls.py`
- Channels routing: `ghana_decides/ghana_decides_proj/routing.py`
- Live map consumer: `ghana_decides/elections/api/consumers/live_map_consumers.py`
- Accounts API URLs: `ghana_decides/accounts/api/urls.py`
- React constants: `ghana_decides_frontend/src/Constants.js`
- Flutter app entry: `ghana_decides_correspondent/lib/main.dart`
- Docker compose: `ghana_decides/docker-compose.yml`

---

## Roadmap Ideas

- Switch DRF tokens to JWT with refresh/rotation.
- Serve Django behind Nginx with TLS and static/media offload.
- Harden CORS/CSRF and add security headers (CSP, HSTS) for production.
- Consolidate and document data import/export flows for election results.
- Add tests for critical APIs and WebSocket consumers.

---

Keep this file updated when making structural changes so future agents and contributors have the right mental model.
