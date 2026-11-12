# Dino Crawler Android preparation

Separate Tauri Android project based on approved mobile snapshot `v1.8.0-mobile` (commit `a7c1b243db549f878b2b78424a50f7307dff929e`). This branch does not alter Windows, Pages, or existing releases.

## Owner actions before a real build/submission

- `com.euconcegojogar.dinocrawler.androidpending` is a temporary build identifier only. Choose and confirm the permanent Android application ID before creating the Play Console app or the first release. Changing it after publication creates a different app.
- Create and safeguard your upload keystore. Never commit keystore/passwords to GitHub. The proposed GitHub workflow builds unsigned; you sign locally and upload manually. Google Play App Signing can manage the app-signing key while you keep the upload key.
- Create AdMob app/ad-unit IDs and the Play Console one-time non-consumable product (suggested ID `remove_ads`, target price US$2; Play Console sets regional prices).
- Finish and test native ads and Play Billing integration. This branch has no working ads or purchase code yet. See `src-tauri/ANDROID-MONETIZATION.md`.
- Complete privacy policy, consent, ads declaration and other Play content forms as applicable.

## Build outline

Install Node/npm, Rust, Android Studio/SDK and NDK 28+, Java 17. From this folder: `npm install`, set the permanent ID, run `npx tauri android init`, then `npm run android:dev`; after configuration `npm run android:aab`. Tauri-generated Android project/build outputs are not committed. The GitHub workflow is intended to produce an unsigned AAB artifact only and never uploads to Google Play.

## Snapshot adaptation

The approved mobile HTML is copied into `frontend/`; hosted absolute `/DinoCrawler/audio/` asset paths are rewritten to package-local `audio/` paths, PWA/service-worker references removed, and the referenced audio assets copied from the approved snapshot. Gameplay code is otherwise untouched in this preparation step.
