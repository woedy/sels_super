Environment and Production Settings
===================================

This project is configured to read settings from environment variables for safe production use. Below is a concise guide for backend, frontend, and Docker.

Backend (Django)
----------------
- Copy `ghana_decides/.env.example` to `ghana_decides/.env` and fill values:
  - `DJANGO_SECRET_KEY`: required in prod.
  - `DJANGO_DEBUG`: set to `False` in prod.
  - `DJANGO_ALLOWED_HOSTS`: comma-separated hosts (e.g. `example.com,.example.com`).
  - Database: set `DB_ENGINE` (e.g. `django.db.backends.postgresql`) and `DB_*` vars to enable Postgres; otherwise SQLite is used.
  - Redis/Channels/Celery: `REDIS_URL`, `CELERY_BROKER_URL`, `CELERY_RESULT_BACKEND`.
  - Email: `DJANGO_EMAIL_*` and `DJANGO_DEFAULT_FROM_EMAIL`.
  - CORS/CSRF: `CORS_ALLOWED_ORIGINS`, `CSRF_TRUSTED_ORIGINS`.
  - `FCM_SERVER_KEY` if push is used.

- Channels (WebSockets) uses Redis via `CHANNEL_LAYERS` and Daphne ASGI server.

Frontend (React)
----------------
- Configure frontend API endpoints using a `.env` in `ghana_decides_frontend/`:
  - `REACT_APP_BASE_URL` (e.g. `https://example.com:5050`)
  - `REACT_APP_BASE_URL_MEDIA`
  - `REACT_APP_BASE_URL_WS_URL` (or leave blank to auto-derive from `REACT_APP_BASE_URL`).

Docker Compose
--------------
- `ghana_decides/docker-compose.yml` runs:
  - Postgres (`db`), Redis (`redis`), Django via Daphne (`ghana_decides_app`), Celery, Celery Beat, and the React static server.
- The Django and Celery services load environment from `ghana_decides/.env` via `env_file`.

Run Locally (example)
---------------------
1. Copy and edit envs:
   - `cp ghana_decides/.env.example ghana_decides/.env`
   - Optionally add `ghana_decides_frontend/.env` for the React app.
2. From `ghana_decides/`, run: `docker compose up --build`
3. Backend: `http://localhost:5050` (Daphne)
4. Frontend: `http://localhost:3000`

Notes
-----
- Do not commit real secrets. Rotate leaked values immediately.
- In production, serve static/media via a reverse proxy (e.g., Nginx) and enable HTTPS.
