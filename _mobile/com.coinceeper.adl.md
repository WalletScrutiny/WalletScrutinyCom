---
title: Coinceeper - Crypto wallet
date: 2026-07-21
website: https://coinceeper.com/
redirect_from:
- /android/com.coinceeper.adl/
android:
  appId: com.coinceeper.adl
  users: 1000
  appCountry: us
  released: 2025-08-19
  updated: 2026-07-12
  version: 1.0.56
  icon: com.coinceeper.adl.png
  meta: ok
  verdict: sourceavailable
  developerName: Taparam
iphone:
  appId: com.coinceeper.adl
  idd: '6749888477'
  appCountry: ph
  released: 2025-09-26
  updated: 2026-07-13
  version: 1.0.56
  reviews: 0
  icon: com.coinceeper.adl.jpg
  meta: ok
  verdict: sourceavailable
  developerName: TAPARAM ELIPTIK TEKNOLOJI VE YAZILIM ANONIM SIRKETI

---

## App Description

Coinceeper is a cryptocurrency wallet published by TAPARAM ELIPTIK TEKNOLOJI VE YAZILIM ANONIM SIRKETI for both Android and iOS, distributed under the identifier `com.coinceeper.adl` on each platform. The developer states that wallets are created or imported from a 12-word mnemonic and that private keys and the recovery phrase are held only on the user's device, describing the app as non-custodial. The store listings further advertise sending and receiving with a QR scanner, transaction history, portfolio tracking, biometric or PIN lock, and a built-in AI assistant.

## Testing

Our [testing](https://x.com/BitcoinWalletz/status/2079389612095803675) confirms that the app provides a Bitcoin wallet and that the seed phrase is shown to the user. We successfully exported that seed phrase and restored the wallet in a third-party app, which reproduced the same addresses. On this evidence the app is self-custodial, and the `custodial` verdict does not apply.

## Source Code

Source code for this app **is** published on GitHub, covering both platforms. The current codebase is [`coinceeper/Coincepper-wallet`](https://github.com/coinceeper/Coincepper-wallet) — a single MIT-licensed Flutter project holding `android/`, `ios/`, `macos/`, `linux/`, `windows/` and `web/` targets side by side. Its `android/app/build.gradle.kts` declares `applicationId = "com.coinceeper.adl"`, and `ios/Runner/Configs/AppInfo.xcconfig` carries the same identifier, matching the bundle ID published on both stores. This is why the Android and iOS listings share one identifier: they are built from one codebase.

A second, superseded repository, [`netcoincapital/coinceeper`](https://github.com/netcoincapital/coinceeper), holds an earlier native Kotlin/Jetpack Compose implementation under the same application ID in folders `V_1.0.0` and `V_1.0.1`. It is not the source of current releases, and the folder names are unreliable as version labels — the APK committed under `V_1.0.0` reports `versionName 1.3`.

The published source is **stale relative to both stores**. `pubspec.yaml` declares version `1.0.52+118` and the repository's sole tag is `v1.0.48`, against `1.0.57` on Google Play and `1.0.56` on the App Store. The repository also carries a single commit, dated 2026-06-22 and titled "open source: non-custodial cryptocurrency wallet", with no development history behind it — a squashed snapshot rather than a working repository, which leaves no way to trace when any given change was introduced.

We assign the verdict **sourceavailable**: source for the app is published, but it has not been shown to correspond to the distributed binaries. No build instructions or version-to-release mapping are provided, no release matching a shipped version is tagged, and we have not yet attempted a reproducible build.

## Analysis

Two findings from the published source require attention before any verdict is assigned.

**1. Undisclosed advertising-automation code.** The Flutter repository contains Android classes with no plausible role in a cryptocurrency wallet:

- `PopunderHandler.kt` — documented in-source as managing "Monetag popunder" advertising inside a WebView, intercepting `onCreateWindow` and simulating popunder navigation.
- `HumanBehaviorSimulator.kt` — synthesises touch, pointer and mouse events along Bézier paths, and includes an explicit "Anti-Detection" section that hides `navigator.webdriver`, spoofs `plugins`, `languages`, `hardwareConcurrency` and `deviceMemory`, and patches `Function.prototype.toString`.
- `WebViewProxyInterceptor.kt` — re-issues WebView requests through a configurable HTTP/SOCKS proxy, with in-source comments describing each device's "unique mobile carrier IP (Tier 1)".
- `TspAgentForegroundService.kt`, `TspAgentBootReceiver.kt` — a persistent foreground service that starts on boot and takes a wake lock.

The manifest matches this: `RECEIVE_BOOT_COMPLETED`, `WAKE_LOCK`, `REQUEST_IGNORE_BATTERY_OPTIMIZATIONS`, `FOREGROUND_SERVICE_DATA_SYNC` and `com.google.android.gms.permission.AD_ID`. Taken together this is the structure of an automated ad-interaction agent that runs unattended and is engineered to evade bot detection. None of this behaviour is disclosed in either store listing, both of which state "We don't collect personal data."

**2. Signing key material committed to a public repository.** The `netcoincapital/coinceeper` repository contains, in plain view, `V_1.0.0/Key store/finalkey.jks`, `V_1.0.0/Key store/keystore1.jks`, `V_1.0.1/Key store/keystore1.jks`, `upload_certificate.pem`, and a file named `key store pass`. We did not download or open the keystores. If any of these correspond to the signing identity in use, a third party could sign an APK that a user's device would accept as a legitimate update. This alone warrants a warning to users independent of the reproducibility question.

Both findings are drawn from published source that has **not** been confirmed to match the distributed binaries, and that sits five releases behind the current Play Store version. Confirming whether the shipped app actually contains the advertising agent requires decompiling the Play Store APK, which we have not yet done. The `sourceavailable` verdict reflects only that source is published; it is not a statement that the shipped app matches it, nor an endorsement given the findings above.
