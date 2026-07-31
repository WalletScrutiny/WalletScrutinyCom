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
  icon: com.gorunjinian.metrovault.png
  signer: 1245554ceb17cea21e9912af7bf60d38d716f5884d4b3664e5338462cc76fd03
  alternativeStores:
  - fdroid
  meta: ok
  verdict: sourceavailable
  developerName: Gorun Jinian
  repository: https://github.com/gorunjinian/MetroVault

---

{% include featureEvidence.html feature="airGapped" source="[APK manifest, v3.8.7](https://f-droid.org/packages/com.gorunjinian.metrovault/)" quote="The v3.8.7 APK declares three Android permissions — CAMERA, USE_BIOMETRIC and USE_FINGERPRINT — plus its own package-scoped com.gorunjinian.metrovault.DYNAMIC_RECEIVER_NOT_EXPORTED_PERMISSION. android.permission.INTERNET is absent, so the app cannot open a network connection." %}

{% include featureEvidence.html feature="multiSig" source="[README](https://github.com/gorunjinian/MetroVault#readme)" quote="Multi-Sig Support: Import and sign for collaborative custody wallets (2-of-3, 3-of-5, etc.)" %}

{% include featureEvidence.html feature="segwit" source="[README](https://github.com/gorunjinian/MetroVault#readme)" quote="Multi-Type Support: Native SegWit (bc1q...), Taproot (bc1p...), Nested SegWit (3...), Legacy (1...), Silent Payments (sp1q...)" %}

{% include featureEvidence.html feature="taproot" source="[README](https://github.com/gorunjinian/MetroVault#readme)" quote="Multi-Type Support: Native SegWit (bc1q...), Taproot (bc1p...), Nested SegWit (3...), Legacy (1...), Silent Payments (sp1q...)" %}

{% include featureEvidence.html feature="camera" source="[APK manifest, v3.8.7](https://f-droid.org/packages/com.gorunjinian.metrovault/)" quote="android.permission.CAMERA is declared. All transaction data enters and leaves the device by QR code, since the app has no network access." %}

{% include featureEvidence.html feature="fingerprint" source="[APK manifest, v3.8.7](https://f-droid.org/packages/com.gorunjinian.metrovault/)" quote="android.permission.USE_BIOMETRIC and android.permission.USE_FINGERPRINT are declared, backing the app's biometric unlock." %}

{% include featureEvidence.html feature="foss" source="[LICENSE.txt](https://github.com/gorunjinian/MetroVault/blob/main/LICENSE.txt)" quote="GNU General Public License v3.0 or later (GPL-3.0-or-later), as stated in the repository's LICENSE.txt and on the app's F-Droid listing." %}

## App Description

MetroVault is not distributed through Google Play. It is published on
[F-Droid](https://f-droid.org/packages/com.gorunjinian.metrovault/) and as a signed APK on
[GitHub Releases](https://github.com/gorunjinian/MetroVault/releases), so the fields this entry would
normally inherit from a Play listing were filled from the APK, the repository and the F-Droid index
instead.

MetroVault is a signing device rather than a wallet that transacts on its own, and understanding that
split is the key to reading everything below. The developer's own description is that it "turns your
Android phone into a cold storage hardware wallet" and "acts as a signer for your watch-only wallets
(like BlueWallet, Sparrow, or Electrum) running on online devices." Keys are generated and kept on
the offline phone: the app supports BIP-39 mnemonics with an optional passphrase that can be saved or
held in session memory only, includes a checksum calculator and validator, and offers BIP-85
derivation of 12- or 24-word child seeds from a master seed. What leaves the device is an XPUB, which
the user imports into a watch-only wallet on a separate online device; that companion sees balances
and pushes transactions but holds no key material and cannot move funds. Spending therefore runs as a
round trip: the online wallet builds a PSBT, the user carries it across by QR code, MetroVault signs
or finalises it on a screen the network cannot reach, and the online wallet broadcasts the result.
Receive addresses can be generated and confirmed on the trusted screen so they can be checked against
what the online device displays. Supported script types are Native SegWit, Taproot, Nested SegWit,
Legacy and Silent Payments (BIP-352), the PSBT workflow covers BIP-174 and BIP-370 v2, and multisig
signing is supported for collaborative custody.

MetroVault therefore holds the keys and authorises every spend, while the broadcasting half of the
job runs on a separate online device. Its own isolation is enforced rather than promised: the app
declares no `INTERNET` permission at all, so direct network access is blocked by the Android
permission model rather than left to user discipline — a claim any reader can check against the
published APK instead of taking on the developer's word. That is narrower than a full air
gap, which also depends on the device's radio state and on what reaches the phone by other routes. The
arrangement is the same one every hardware wallet uses: a Trezor, a BitBox02 or a Keystone 3 Pro is
also a signer that never broadcasts and depends on a companion application, and custody follows the
keys rather than the network connection. On that basis MetroVault is a self-custodial Bitcoin wallet
whose transacting half happens to run on a different device.

The source is public at the repository above under GPL-3.0-or-later, and F-Droid builds the app from
that source. Two independent distribution points agree on the artifact: the APK published on F-Droid
and the APK attached to the corresponding GitHub release are byte-identical, and both carry the
developer's own signing certificate rather than a re-signing key applied by the store. That is a
promising starting point for a reproducibility check but is not one in itself, so this entry records
the source as available and leaves the build verdict open until an independent rebuild has been
attempted.
