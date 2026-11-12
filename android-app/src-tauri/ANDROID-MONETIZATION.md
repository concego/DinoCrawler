# Monetization implementation status

Target design: show one AdMob interstitial at the natural transition when the player leaves the end-of-game results screen for the main menu; never cover/interupt the result announcement. Continue to the menu if an ad is not ready or fails. A non-consumable Google Play Billing product removes all ads permanently and must be restorable. Suggested product ID: `remove_ads` (owner creates/confirms in Play Console). Target list price US$2, configured in Play Console, not hard-coded. Windows Name Your Price is out of scope.

**Not yet implemented:** this branch currently contains no AdMob SDK/native Kotlin plugin and no Play Billing integration. Do not imply monetization works until those are integrated and tested. Implement via a Tauri Android native plugin or a maintained compatible plugin; cover purchase acknowledgement, pending purchases, restore, offline/no-ad fallback. No live ad IDs or account secrets are included.

For development use only Google's official sample App ID `ca-app-pub-3940256099942544~3347511713` and interstitial test unit `ca-app-pub-3940256099942544/1033173712`; replace both before publication. AdMob account/product configuration, consent/privacy declarations, and app privacy policy remain owner tasks.
