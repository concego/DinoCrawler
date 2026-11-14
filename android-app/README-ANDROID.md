# Dino Crawler Android — Capacitor preparation

Separate Capacitor Android project in branch `android`, based on approved mobile snapshot `v1.8.0-mobile` (tag commit `a7c1b243db549f878b2b78424a50f7307dff929e`). Does not change Windows, GitHub Pages, or releases. Web source is in `web/`; Vite bundles the plugin bridge and copies game audio from `web/public/audio/` to package-root `www/audio/` before Capacitor sync. Generated `www/`, `android/`, and `node_modules/` are ignored by Git. Gameplay logic is preserved except local asset routes, removal of web-only PWA service worker links, and the accessible monetization UI/bridge.

## Native monetization wiring (implemented, not device-tested)

- `@capacitor-community/admob` supplies interstitial ads and consent API; MIT, pinned `8.3.0` for Capacitor 8. Uses Google's official sample test app ID and test interstitial unit. On the results screen, announcement remains uninterrupted; interstitial call occurs only after the user chooses to leave results for the menu. Failed/unavailable ads are skipped. AdMob community plugin `8.3.0` targets Capacitor 8 and includes AdMob consent handling; test the integrated native flow on a physical Android device before release.
- `@capgo/native-purchases` is pinned to `8.9.16` (MPL-2.0), compatible with Capacitor 8 and declaring Google Play Billing Library 9.1.0 in its Android Gradle dependency. The one-time product ID is tentatively `remove_ads`; product is queried from Play for localized price rather than hardcoded. Purchase confirmation checks completed/acknowledged ownership, and restore checks Play purchases.
- Monetization controls are keyboard/screen-reader labels in the menu, available only on native Android. Price is fetched from the store API; product needs to exist in Play Console before purchase is returned.

## Required before real build/publication

- The permanent app ID chosen by Anderson is `com.euconcegojogar.dinocrawler`; keep this exact ID in Capacitor and the Play Console listing. Before first release, verify it is not already assigned to another app under the intended Play developer account.
- AdMob demo IDs are the default. Before release, supply your own registered AdMob app ID and interstitial unit. Consent messages must be configured in AdMob and privacy policy/Data safety reviewed. The workflow deliberately uses Google demo IDs only.
- Create one-time non-consumable product `remove_ads` (or update code to exact chosen ID), set target list price $2 and configure local prices in Play Console.
- Test purchases require a signed upload in internal testing plus license tester account; app isn't uploaded by this workflow. Never commit keystore or passwords. You sign AAB locally and upload manually.
- Review the app end-to-end with TalkBack, particularly consent UI, Google purchase sheet, restore result, and ad-return focus. We cannot validate those here.

## Build outline (PowerShell)

Install Node 22.12+, JDK 21, Android SDK/command-line tools, platform-tools and Android SDK/build-tools 36. From this folder run `npm ci`, `npm run check`, then `npm run android:add`; run `npm run android:configure` (uses Google demo App ID unless `ADMOB_APP_ID` is supplied), and `npm run android:sync`. For local debug use `npm run android:open` or `npx cap run android`. On Windows, Gradle can be invoked from PowerShell without opening Android Studio: `cd android; .\gradlew.bat bundleRelease`. The npm `android:build:aab` script also builds web assets, syncs plugins, then invokes the wrapper. Release signing must be configured locally; CI uses no key and only stores an unsigned AAB artifact. No workflow uploads to Play Console.


The AdMob plugin is MIT licensed. The purchases plugin is MPL-2.0; retain required notices when distributing the app.

## CI dependency note

Direct Capacitor/plugin versions are pinned in `package.json`. `package-lock.json` pins the validated npm dependency graph; use `npm ci` for reproducible installation.


For a developer-machine release build, configure your AdMob manifest ID using `$env:ADMOB_APP_ID="your-app-id"; npm run android:configure`. When you are ready to use live ads, additionally set `$env:VITE_USE_TEST_ADS="false"` and `$env:VITE_ADMOB_INTERSTITIAL_ID="your-unit-id"` before running `npm run android:build:aab`. Do not commit the IDs as secrets if they are not intended to be public; test identifiers remain the default in source and CI. The Play Console product must be created with the exact `remove_ads` identifier and target price.
