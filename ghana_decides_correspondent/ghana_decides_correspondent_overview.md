# Ghana Decides Correspondent App Overview

Purpose: Flutter mobile app for field correspondents to authenticate, onboard, and submit election-related data.

Stack
- Flutter (Dart); Android/iOS targets
- App entry: `lib/main.dart`
- Theming: `lib/theme.dart`
- Config/constants: `lib/constants.dart`

Structure (observed)
- `SplashScreen/`, `Auth/` and region selection components
- Oriented to portrait mode with system orientation locked

Integration
- Communicates with backend APIs (env/constant-driven base URL in `constants.dart`)
- Planned: push notifications via FCM; media capture (photos/video), offline queueing/sync

Run Locally
- Open in Android Studio or VS Code
- `flutter pub get` then run on emulator/device

Current State (high level)
- App skeleton and splash flow present
- Region selection and onboarding scaffolding present
- Needs API wiring, secure storage, submission flows, and offline/resume

Planned Upgrades for Field Use
- Result submission flow: polling station results form, image capture & compression, idempotency key.
- Offline queue: store submissions locally (e.g., Hive) with background upload & retry.
- Secure storage: tokens via `flutter_secure_storage`; centralized API client with auth headers and 401 handling.
- Push notifications: FCM registration and routing to assigned tasks/feedback.
