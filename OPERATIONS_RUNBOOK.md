# SELS Operations Runbook

This runbook outlines the core procedures operations engineers follow to keep the
Smart Election Ledger System (SELS) stable during rehearsal and investor demos.
It complements the roadmap in `Agents.md` and the QA journeys.

---

## 1. Daily readiness checklist
1. **Bootstrap staging** – `scripts/bootstrap_staging.sh`
   * Confirms Redis, Postgres, Django ASGI, Celery worker/beat, and the React build come online.
   * Seeds demo accounts (data admin, presenter, correspondent) and sample geography via `python manage.py seed_staging_data`.
2. **Smoke suite** – `python manage.py smoke_investor_demo`
   * Exercises polling-station ingest, presenter websocket fan-out, and public map updates.
3. **Metrics dashboard** – scrape `/monitoring/metrics/`
   * Verify `sels_ingestion_processed_total` and websocket connection gauges are emitting.
4. **Review logs** – `docker compose logs -f ghana_decides_app celery`
   * No unhandled exceptions or reconnect storms.

---

## 2. Incident response playbooks
### 2.1 Ingestion delays
1. Hit `/monitoring/metrics/` and check `sels_ingestion_processing_lag_seconds`.
2. If lag > 10s:
   * Inspect Celery worker logs for tracebacks.
   * Run `python manage.py smoke_investor_demo` locally to reproduce.
   * Re-run submissions via audit API (`/api/elections/submissions/audit/`).
3. Roll back to last known-good deploy:
   * Redeploy docker stack at previous image tag.
   * Restore database snapshot if raw payloads are corrupt.

### 2.2 Websocket disconnect spikes
1. Metrics `sels_ws_disconnect_total{channel=…}` highlight the affected channel.
2. Tail Daphne logs – `docker compose logs -f ghana_decides_app` for `4401/4403` codes.
3. Validate Redis availability; restart if connection errors surface.
4. If client bug suspected, disable websocket auto-connect flag in frontend env and fall back to manual polling.

### 2.3 Data reconciliation
1. Use audit endpoint to export last 20 submissions; cross-check with EC source forms.
2. For discrepancies, mark submission as failed in admin and re-upload using correspondent app offline queue.
3. Document the issue in incident tracker and update aggregated totals via rerun of `seed_staging_data` if necessary.

---

## 3. Deployment & rollback
1. **Prepare release** – merge tested changes, build container images, tag version.
2. **Deploy** – `docker compose pull && docker compose up -d` on target host.
3. **Post-deploy** – rerun smoke suite and capture metrics snapshot for investor reporting.
4. **Rollback** – `docker compose down` followed by redeploying previous tag; restore database snapshot if schema drift occurred.

---

## 4. Observability targets
* `sels_ingestion_processed_total` increments every accepted polling-station result.
* `sels_ingestion_failed_total` alerts on ingestion errors.
* `sels_ws_active_connections{channel}` stays stable (>1 for presenter during broadcast).
* Integrate Prometheus/Sentry in production to page ops when thresholds breach.

---

## 5. Contact points
* **Tech lead:** codex@sels-demo.local
* **Operations:** ops@sels-demo.local
* **Product demo:** demo@sels-demo.local

Keep this runbook updated as infrastructure evolves.
