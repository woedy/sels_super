# Ghana Decides Correspondent App Checklist

Purpose: track feature readiness for the field correspondent mobile app.

Legend: [ ] Planned  [~] In progress  [x] Done

## 1. Authentication & Onboarding
- [ ] Sign up flow (email/phone/password) with validation
- [ ] Login screen with secure storage of token
- [ ] Email/OTP verification screens
- [~] Region selection during onboarding
- [ ] Profile completion (photo, id, contact)
- [ ] Session handling (refresh/reauth on 401)

## 2. Data Capture & Submission
- [ ] Submit incident/report with metadata (type, location, notes)
- [ ] Polling station result submission (form + media attachments)
- [ ] Camera/photo capture with size/format constraints
- [ ] Background upload with retries; progress indicators
- [ ] Drafts/offline queue when no connectivity; sync on regain
 - [ ] Idempotency key per submission to avoid double counting

## 3. In‑App Use
- [ ] Home dashboard with assigned tasks/stations
- [ ] Notifications inbox; deep link to tasks
- [ ] History of submissions with statuses
- [ ] Edit/resubmit on rejection with reviewer comments

## 4. Integration & Config
- [ ] API client with base URL config
- [ ] Auth headers with token; error normalization
- [ ] Push notifications (FCM) registration and token sync
- [ ] Feature flags/toggles via backend settings
 - [ ] Secure token storage (`flutter_secure_storage`)

## 5. UX & Quality
- [x] Portrait orientation lock
- [ ] Loading/empty/error states standardized
- [ ] Accessibility (font scaling, contrast)
- [ ] Localizations (en‑GH)

## 6. Release Readiness (Mobile)
- [ ] App icons/splash for Android/iOS
- [ ] Store build configs (prod/stage) and signing
- [ ] Crash reporting and analytics
- [ ] E2E smoke tests for critical flows

Notes
- Align API payloads with backend contracts; confirm media upload endpoints and size limits.
