---
wsId: sezameWallet
title: Sezame Wallet
verdict: nosource
date: 2026-05-04
authors:
- danny
twitter: SesameWallet
social:
- https://x.com/SesameWallet
- https://t.me/sesamewalletgroup
redirect_from:
- /android/org.maze2.sezamewallet/
- /iphone/com.maze2.sezamewallet/
android:
  appId: org.maze2.sezamewallet
  users: 500
  released: 2022-03-31
  updated: 2026-02-12
  version: 0.16.6
  icon: org.maze2.sezamewallet.png
  meta: fewusers
  website: https://sezame.app
  repository: https://github.com/maze2-org/sezame-wallet
  developerName: Maze 2 Techs
iphone:
  appId: com.maze2.sezamewallet
  idd: '1618252953'
  appCountry: us
  released: 2022-05-13
  updated: 2026-02-14
  version: 0.15.9
  reviews: 0
  icon: com.maze2.sezamewallet.jpg
  meta: ok
  website: https://sezame.app/
  developerName: Maze 2 SA

---

## Android

## App Description

Sezame Wallet is a mobile app listed on Google Play that claims multi-network support including Bitcoin, and exposes wallet creation/import, transfers, and WalletConnect-based dapp connectivity. The app’s terms page also describes external API dependencies for chain operations, including Trezor and Etherscan references for Ethereum/Bitcoin-related features.

## App Analysis

Homepage and policy/support references are available, including an app-specific terms page and privacy page. The wallet-specific [terms](https://sezame.app/terms-and-conditions), include clauses about locally hosted wallets, recovery phrase responsibility, and third-party API integrations. Play support also lists contact email and privacy policy, and the GitHub wiki exists with a minimal home page.  

The app is buggy, and closes during our testing. But if the source code is our basis for our verdict, the app supports Bitcoin and does provide the seed phrases.

Our testing was posted on [X.com](https://x.com/BitcoinWalletz/status/2047146975616020870)

> Sezame clearly supports seed phrases in its wallet flow (generation, backup, confirmation, import, and later reveal), in the Sezame source code, the wallet creation flow explicitly generates a seed phrase by calling `WalletGenerator.generateMnemonic()` and saving it via `setSeedPhrase(newMnemonic)`, which is direct repo proof that seed phrases are provided. The evidence is in [CreateWalletStep1](https://github.com/maze2-org/sezame-wallet/blob/main/src/screens/create-wallet/steps/create-wallet-step1.tsx).

Both the Android and iPhone versions of the app are **source available**.

The public repo includes [iOS source code](https://github.com/maze2-org/sezame-wallet/blob/main/ios)

## Changing of Verdict May 4, 2026

The verdict is changed from `sourceavailable` to `nosource`. A reproducibility attempt against the current Play Store release (versionName `0.16.6`, versionCode `43`) revealed that the source code for this specific release has never been pushed to the public GitHub repository. The public repo's HEAD commit (`2ec2d14`) contains versionCode `40` under the same versionName. All remote branches were inspected and none exceed versionCode `40`. The developer published at least three additional internal releases — versionCodes 41, 42, and 43 — without pushing the corresponding commits, meaning the source of the app currently installed by users is not publicly accessible.

Beyond the missing commits, the diff analysis exposed a fundamental architectural change introduced between versionCode 40 and the Play Store build: React Native's New Architecture (Fabric renderer and TurboModules) was enabled in the published version but is disabled in the last available public source. This is not a cosmetic difference. It rewrites the entire native-to-JS bridge layer, reorganises compiled `.so` libraries, and changes the DEX class graph substantially. A build compiled from the public source cannot be considered equivalent to what is distributed, even at the same versionName.

### Evidence

**1. versionCode in the public repo HEAD vs Play Store APK**

`android/app/build.gradle` at commit `2ec2d14` (the latest public commit):

```
versionCode 40
versionName "0.16.6"
```

`aapt dump badging` output from the APK extracted from a real device:

```
package: name='org.maze2.sezamewallet' versionCode='43' versionName='0.16.6'
```

Same versionName, different versionCode. No branch or tag in the public repository contains versionCode 41, 42, or 43.

**2. No git tag for the release**

```
$ git tag
0.9.12
0.9.4
0.9.6
0.9.7
0.9.8
```

The newest tag is `0.9.12` from June 2022. Version `0.16.6` (the current Play Store release) has never been tagged.

**3. React Native New Architecture flag — BuildConfig.smali comparison**

Decoded from the Play Store `base.apk` via apktool:

```smali
# official (versionCode 43) — BuildConfig.smali
.field public static final IS_NEW_ARCHITECTURE_ENABLED:Z = 0x1   # true
```

Decoded from the locally compiled APK (built from public HEAD, versionCode 40):

```smali
# local build (versionCode 40) — BuildConfig.smali
.field public static final IS_NEW_ARCHITECTURE_ENABLED:Z = 0x0   # false
```

**4. Native library inventory mismatch**

The architectural switch reorganises the compiled native libraries entirely:

| | Official (Play Store, versionCode 43) | Local build (versionCode 40) |
|---|---|---|
| `.so` count (arm64-v8a) | 26 (New Arch consolidated) | 70 (Old Arch fragmented) |
| Key library | `libappmodules.so`, `libreactnative.so` | `libfabricjni.so`, `libreact_render_*.so`, `libturbomodulejsijni.so` |

All 17 `.so` files shared by name between the two builds differ in both size and SHA-256.

**5. DEX class count**

| | Official | Local |
|---|---|---|
| smali classes | 18,251 | 16,870 |
| Classes only in official | 1,053 | — |
| Classes only in local | — | 665 |
| Files with content diffs | 5,169 | — |

The scale of divergence (914,043-line raw diff) is inconsistent with a three-versionCode patch increment. It reflects a major infrastructure migration whose source was never made public.

---

## iPhone

{% include copyFromAndroid.html %}
