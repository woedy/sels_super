# Ghana Decides Backend Overview

Purpose: Central API, WebSockets, and background workers powering the Ghana Decides platform.

Stack
- Django 5, DRF, TokenAuth
- Channels (ASGI) + Redis; Daphne as ASGI server
- Celery + Redis for background tasks
- SQLite (dev) / Postgres (prod)
- Dockerized services

Domains & Apps
- accounts, user_profile, activities
- regions (regions, constituencies, electoral areas, polling stations, map geometry)
- parties, candidates
- elections (presidential/parliamentary, votes at multiple levels)
- chat, video_call (signaling models), search, homepage, settings

API Mounts (see `ghana_decides_proj/urls.py`)
- `api/accounts/`, `api/regions/`, `api/parties/`, `api/candidates/`, `api/elections/`, `api/search/`, `api/settings/`
- Example: accounts registration, login, email verification, password reset

WebSockets (see `ghana_decides_proj/routing.py`)
- `ws/presenter-dashboard/` — presenter live updates
- `ws/live-map-consumer/` — live election map GeoJSON/payloads
- Consumers under `elections/api/consumers/*`

Background Tasks
- `send_generic_email` (Celery task) in `ghana_decides_proj/tasks.py`
- Intended for async emails and other background jobs

Configuration
- Fully env-driven (see `ghana_decides/.env.example`)
- Key vars: `DJANGO_SECRET_KEY`, `DJANGO_DEBUG`, `DJANGO_ALLOWED_HOSTS`, DB_* for Postgres, `REDIS_URL`, Celery broker/result, `DJANGO_EMAIL_*`, `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`, `FCM_SERVER_KEY`

Runtime
- Daphne serves ASGI (HTTP + WebSockets)
- Channels with `channels_redis` configured via `CHANNEL_LAYERS`
- Static/media configured; proxy via Nginx recommended in prod

Local Run
- `docker compose up --build` from `ghana_decides/`
- Backend at `http://localhost:5050`

Security Notes
- Do not commit secrets
- Use `DEBUG=False` and restrict `ALLOWED_HOSTS` in prod
- Lock down CORS/CSRF to required origins
- Prefer JWT for longer-lived web/mobile sessions (future migration)

Current State (high level)
- Core auth flows, domain apps, and WebSocket endpoints present
- Celery wired; sample email task available
- Needs prod hardening (Nginx, JWT, permissions review, tests)

Planned Upgrades for Real‑time Results ("Magic Wall")
- Results ingestion API: Idempotent `POST /api/elections/results/polling-station` with provenance (submitter, idempotency key, media).
- Aggregation pipeline: Service to roll up PS→EA→Constituency→Region→National totals per party/candidate.
- Eventing: `post_save` signals enqueue Celery task to recompute aggregates, cache payloads, and broadcast via Channels.
- Caching: Redis keys for precomputed map/dashboard payloads keyed by year/level/scope.
- WebSocket groups: Standardize names like `map:<year>:<level>:<scope[:name]>`, `presenter:<year>`.
- Serializer normalization: Include `scope`, `completeness`, `leaders`, `totals`, `last_updated`, `geojson` for UI.
- WS auth: token/JWT validation for private channels (presenter/admin), public read for general map.
