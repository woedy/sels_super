# Smart Election Ledger System (SELS) — Agent Playbook

This playbook orients agents around our shared goal: delivering a Ghana-focused, CNN-style election "magic wall" that is polished enough to demo to investors. SELS spans three production applications—Django backend, React web presenter/admin client, and Flutter correspondent app—plus supporting AI tooling that we will activate after the core experience is battle ready.

---

## Architecture Snapshot
- **Backend:** Django 5, DRF, Channels, Celery. Handles secure ingestion, hierarchical aggregation (polling station ➜ electoral area ➜ constituency ➜ region ➜ national), caching, and broadcast of standardized payloads to WebSocket groups.
- **Web Client:** React (CRA) dashboards for the public map, presenter control room, and data admin tools. Connects to REST + WS backends with authenticated, resilient clients.
- **Mobile Correspondent:** Flutter app for field reporters to submit authenticated results, media, and notes with offline support.
- **Operations:** Docker Compose (Redis, Postgres, Daphne, Celery, Frontend build). Target deployment pairs Django behind a reverse proxy with observability and security hardening.
- **AI Runway:** Streamlit/Gemini briefing tool and LlamaIndex/Ollama repo co-pilot live under `ghana_decides/sels/`. We defer further AI investment until the core ingestion-to-broadcast loop is production ready, but keep their integration points in mind.

---

## Delivery Principles
1. **Investor-ready polish:** Prioritize reliable data ingestion, live storytelling UI, and hardened infrastructure before layering advanced AI experiences.
2. **Real-time integrity:** Every data change should be idempotent, audited, cached, and broadcast deterministically to all subscribed clients.
3. **Security by default:** Tighten authentication, authorization, CORS/CSRF, and rate limits across REST and WebSockets prior to public demos.
4. **Operational confidence:** Maintain scripted QA journeys, smoke tests, and observability so we can run rehearsals and demo loops on demand.
5. **Future AI readiness:** Reserve integration seams (APIs, events, data stores) so the AI assistants can consume and augment trusted election data once the core system is stable.

---

## Active Workstreams
- **Ingestion & Aggregation Platform:** Finalize polling-station submission APIs, provenance tracking, aggregation jobs, Redis caching, and signal/Celery-triggered broadcasts.
- **Presenter & Public Experience:** Implement resilient REST/WS clients, drill-down filters, delta highlighting, loading/error states, and a scripted live demo sequence.
- **Field Correspondent Reliability:** Ship secure login, tasking, result submission with media, offline queueing, and sync acknowledgements in the Flutter app.
- **Operations & QA:** Lock down deployments, environment management, automated smoke/regression suites, load tests, and monitoring dashboards.
- **AI Foundations (Deferred):** Keep data contracts and events well documented so the Streamlit and LlamaIndex agents can plug in without rework once green-lit.

---

## Unified Delivery Backlog
The following backlog captures the core stories required to call SELS "investor-demo ready." Each story follows a user-focused narrative with measurable acceptance criteria. Mark them complete (`[x]`) as they are delivered.

- [x] **User Story (Data Admin):** "As a national data admin, I can submit polling-station results once and trust they roll up instantly to all geography levels."
  *Acceptance Criteria*  
  - REST endpoint validates tokens, station ownership, and idempotency (duplicate payloads do not double-count).  
  - Submissions capture provenance (who/when/source) and persist raw + structured tallies.  
  - Aggregation layer updates electoral area ➜ constituency ➜ region ➜ national totals within 10 seconds.  
  - Redis caches map/presenter payloads and invalidates relevant keys on update.  
  - Audit log API exposes last 20 submissions with status for QA.

- [x] **User Story (Presenter):** "As a studio presenter, I receive continuous, authenticated updates with contextual deltas to narrate the election live."
  *Acceptance Criteria*  
  - Presenter dashboard establishes an authenticated WebSocket session with auto-reconnect and heartbeats.  
  - Incoming payloads include leader, vote share delta, turnout change, and timestamp for the selected scope.  
  - UI highlights new updates (e.g., badge or animation) and archives last five events.  
  - Manual refresh is never required during a 60-minute run-through.  
  - Role-based access control prevents non-presenter accounts from joining presenter channels.

- [x] **User Story (Public Viewer):** "As a public viewer, I can explore the national map, drill into regions/constituencies, and see reliable status indicators."
  *Acceptance Criteria*  
  - GeoJSON layers load within 3 seconds with loading skeletons and graceful error states.  
  - Drill-down controls (region ➜ constituency) update both map shading and summary cards without page reload.  
  - Completion metrics (reporting %, last updated) reflect backend aggregation state.  
  - WebSocket updates repaint affected polygons and summary cards within 5 seconds.  
  - Accessibility checks (keyboard navigation, contrast) pass WCAG AA for key screens.

- [x] **User Story (Field Correspondent):** "As a correspondent in the field, I can capture results, photos, and notes even when offline and sync them securely once connected."
  *Acceptance Criteria*  
  - App enforces secure login (JWT/refresh) and stores tokens encrypted on device.  
  - Result submission form supports vote tallies, turnout, photos, and optional voice/text notes.  
  - Offline queue persists submissions locally and retries automatically when connectivity returns.  
  - Users receive confirmation (success/failure with reason) for each submission.  
  - API base URL is environment-driven; no hard-coded public IPs in release builds.

- [x] **User Story (Operations Lead):** "As the operations lead, I can rehearse and monitor the full stack so we enter election night with confidence."
  *Acceptance Criteria*  
  - Docker/infra scripts spin up staging with seeded data, background workers, and sample correspondents.  
  - Automated smoke suite covers REST ingest, WebSocket broadcast, presenter UI, public map, and correspondent submission.  
  - Observability stack (logs, metrics, alerting) surfaces ingestion lag, WS disconnects, and error rates.  
  - CORS/CSRF, rate limiting, and security headers enforced for all environments.  
  - Runbook documents incident response, rollback, and data reconciliation steps.

- [ ] **User Story (Product & Growth):** "As the product lead, I can deliver a compelling investor demo that showcases SELS’ differentiation."  
  *Acceptance Criteria*  
  - Scripted demo dataset highlights Ghana election scenarios (regional swings, turnout milestones).  
  - Demo mode toggles presenter cues and stage lighting overlays without exposing admin tools.  
  - Recording-ready walkthrough covers ingestion ➜ map swing ➜ presenter narrative in under 10 minutes.  
  - Pitch collateral links to metrics (latency, ingestion throughput, uptime) exported from observability tools.  
  - Roadmap slide reserves a lane for AI enhancements once core stories are complete.

- [ ] **User Story (AI Integration Lead — Deferred):** "As the future AI integration lead, I can plug intelligence services into trusted data without reworking the core system."  
  *Acceptance Criteria*  
  - Documented data contracts (schemas, topics, events) for ingestion, aggregation, and broadcast layers.  
  - API endpoints expose read-only snapshots for AI assistants with role-based scopes.  
  - Feature flags or service hooks exist to call AI enrichment without blocking core flows.  
  - Compliance review ensures AI services inherit audit trails and respect data governance.  
  - Activation is explicitly sequenced after the above core stories reach "Done".

---

## Ways of Working
- Keep this file current when roadmap or priorities shift so every contributor shares the same investor-demo target.
- Update corresponding checklists in repo directories when a story moves to "Done" to maintain alignment across docs.
- Prefer small, reviewable PRs mapped to individual acceptance criteria; include demo notes or links in PR descriptions for investor-facing features.
- Before shipping a new capability, rehearse it via the QA journeys in `QA_VISUAL_USER_JOURNEYS.md` and record outcomes.

With this alignment, SELS will evolve from scaffold to a Ghana-ready, CNN-caliber election experience worthy of investor attention.
