---
title: MetroVault
date: 2026-07-28
authors:
- danny
website: https://metrovault.app
features:
- airGapped
- camera
- fingerprint
- foss
- multiSig
- segwit
- taproot
redirect_from:
- /android/com.gorunjinian.metrovault/
android:
  appId: com.gorunjinian.metrovault
  released: 2025-12-07
  updated: 2026-06-24
  version: 3.8.7
  signer: 1245554ceb17cea21e9912af7bf60d38d716f5884d4b3664e5338462cc76fd03
  alternativeStores:
  - fdroid
  meta: ok
  verdict: wip
  developerName: Gorun Jinian
  repository: https://github.com/gorunjinian/MetroVault

---

{% include featureEvidence.html feature="airGapped" source="[APK manifest, v3.8.7](https://f-droid.org/packages/com.gorunjinian.metrovault/)" quote="The v3.8.7 APK declares only CAMERA, USE_BIOMETRIC and USE_FINGERPRINT permissions. android.permission.INTERNET is absent, so the app cannot open a network connection." %}

{% include featureEvidence.html feature="multiSig" source="[README](https://github.com/gorunjinian/MetroVault#readme)" quote="Multi-Sig Support: Import and sign for collaborative custody wallets (2-of-3, 3-of-5, etc.)" %}

{% include featureEvidence.html feature="segwit" source="[README](https://github.com/gorunjinian/MetroVault#readme)" quote="Multi-Type Support: Native SegWit (bc1q...), Taproot (bc1p...), Nested SegWit (3...), Legacy (1...), Silent Payments (sp1q...)" %}

{% include featureEvidence.html feature="taproot" source="[README](https://github.com/gorunjinian/MetroVault#readme)" quote="Multi-Type Support: Native SegWit (bc1q...), Taproot (bc1p...), Nested SegWit (3...), Legacy (1...), Silent Payments (sp1q...)" %}

{% include featureEvidence.html feature="camera" source="[APK manifest, v3.8.7](https://f-droid.org/packages/com.gorunjinian.metrovault/)" quote="android.permission.CAMERA is declared. All transaction data enters and leaves the device by QR code, since the app has no network access." %}

{% include featureEvidence.html feature="fingerprint" source="[APK manifest, v3.8.7](https://f-droid.org/packages/com.gorunjinian.metrovault/)" quote="android.permission.USE_BIOMETRIC and android.permission.USE_FINGERPRINT are declared, backing the app's biometric unlock." %}

{% include featureEvidence.html feature="foss" source="[LICENSE](https://github.com/gorunjinian/MetroVault/blob/main/LICENSE)" quote="GNU General Public License v3.0. Confirmed as GPL-3.0 through the GitHub license endpoint for gorunjinian/MetroVault." %}

## App Description

MetroVault is not distributed through Google Play. It is published on
[F-Droid](https://f-droid.org/packages/com.gorunjinian.metrovault/) and as a signed APK on
[GitHub Releases](https://github.com/gorunjinian/MetroVault/releases), so the fields this entry would
normally inherit from a Play listing were filled from the APK, the repository and the F-Droid index
instead.

The developer describes it as an offline signing device rather than a wallet in the usual sense:

> MetroVault is a secure, offline Android signing device application designed to turn your Android
> phone into a cold storage hardware wallet. […] It acts as a signer for your watch-only wallets
> (like BlueWallet, Sparrow, or Electrum) running on online devices. By keeping your keys on a device
> that never connects to the internet (air-gapped), you significantly reduce the attack surface for
> theft and malware.

The app holds keys and signs; a companion watch-only wallet on a separate, online device handles
addresses, balances and broadcasting. Everything crosses between them as QR codes. Supported script
types are Native SegWit, Taproot, Nested SegWit, Legacy and Silent Payments (BIP-352), with a PSBT
workflow covering BIP-174 and BIP-370 v2, and multisig signing for collaborative custody.

Because the app declares no `INTERNET` permission, the air-gap is enforced by the Android permission
model rather than only by user discipline — a claim that can be checked against the published APK
rather than taken on the developer's word.
