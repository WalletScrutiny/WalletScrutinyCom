---
wsId: bitkeyBlock
title: Bitkey - Bitcoin Wallet
altTitle: 
authors:
- danny
users: 5000
appId: world.bitkey.app
appCountry: US
released: 2024-02-28
updated: 2025-02-26
version: 2025.1.1 (1)
stars: 4.1
ratings: 
reviews: 18
website: https://bitkey.world
repository: https://github.com/proto-at-block/bitkey
issue: 
icon: world.bitkey.app.png
bugbounty: 
meta: ok
verdict: wip
appHashes: []
date: 2024-12-16
signer: c0d0f9da7158cde788d0281e9ebd07034178165584d635f7ce17f77c037d961a
reviewArchive:
- date: 2024-12-16
  version: 2024.74.1 (1)
  appHashes:
  - b7d9b4829f6296a7c01ee789e10cf4fad4b1bf514f8f2fafd2844ca129d57c91
  - e81e73a66e18e53eb8be2eadfee9fb901c5554ed1ba5cc92466e04aeeed41d19
  - 221ddbe7796a123c565a002e2bf0356a4d2d4098a8a58f415d25e852d6300d1e
  - a6a40e592bafb2c58c92491a9fd27107a018cc1add4013754e54f7187a9eb404
  gitRevision: a06617f9acadfcfedb75effc3aafc544d5051eb2
  verdict: nonverifiable
- date: 2024-12-07
  version: 2024.73.1 (2)
  appHashes:
  - c450bc84fe154daa4cec5af3a87bf1646fd0fa2d340a99a608d25f737173ca52
  gitRevision: 5d7b9b51299533649649997ba132ef2bd73f49f5
  verdict: nonverifiable
- date: 2024-09-23
  version: 2024.69.0 (4)
  appHashes:
  - 67c4d8ec5beec9b6424a39700e0fc9673f713a98d965a6cdd3ef4a968fd000af
  gitRevision: 3cb9e16e08babae6e2f6ce682158ba2aa6c603c5
  verdict: reproducible
- date: 2024-08-30
  version: 2024.68.0 (1)
  appHashes:
  - 0979d68dc323e95dbb5ddb4be259d7d0fcd83eccab4d5af5dd18a4632d216fa1
  gitRevision: 65f0d9d3018e6f4e8a32f53de5263b6c2e132964
  verdict: reproducible
- date: 2024-08-30
  version: 2024.67.0 (1)
  appHashes:
  - a3699344ebea4262a7d5652a6ea0a9bf45ab1b3a73423fae3e289c05f3c9ee72
  gitRevision: 3e0dace0287b9ad1ad11631f05bb5f067db5db6d
  verdict: reproducible
- date: 2024-07-26
  version: 2024.63.0 (4)
  appHashes:
  - d1adb1725e83e115c169f3676cee3b67fb97e044f6e8ba5be4c7dd88fe746de9
  gitRevision: 6ae7c72d480ca51b583f6b18d05516226e30f5a4
  verdict: reproducible
- date: 2024-03-23
  version: 2024.63.0 (2)
  appHashes:
  - 110568d39beb8b0ccb6fc0f4ed710c2d129392137acc9e97202d5ac1ee192125
  gitRevision: 93c2de0de2ff3717c59dffa274b444490b4a45d6
  verdict: reproducible
twitter: Bitkeyofficial
social:
- https://www.linkedin.com/company/bitkey-official
- https://www.facebook.com/profile.php?id=100088526238789
- https://www.instagram.com/ownbitkey
redirect_from: 
developerName: Block, Inc.
features:
- multiSignature

---

**Disclaimer**: The WalletScrutiny project is sponsored by Spiral, a subsidiary of Block.

<iframe width="560" height="315" src="https://www.youtube.com/embed/pZ-Yi7A-o_A?si=cP6zKgW7r-JosAb-" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

## Analysis 

This is the **companion app** to the {% include walletLink.html wallet='hardware/blockhww' verdict='true' %}. It requires an NFC-capable phone, otherwise the app would not be installed.

<hr>

[**Release Notes**](https://bitkey.world/en-US/releases)

# Verified Builds

[Documentation](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md) 

## Version 2024.74.1 (1)

We used **Bitkey's own [verification script](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/verification/verify-android-apk)** to verify the build. This process requires a phone connected via USB to the build computer.

We see in the sub-script [**normalize-apk-content**](https://github.com/proto-at-block/bitkey/blob/2c0dd04b9b434ae1d36747128471b26622f182c6/app/verifiable-build/android/verification/steps/normalize-apk-content#L26) that Bitkey excludes these signing-related files from comparison:

```
incomparable_files=(
    "AndroidManifest.xml"
    "stamp-cert-sha256"
    "BNDLTOOL.RSA"
    "BNDLTOOL.SF"
    "MANIFEST.MF"
    "EMERGENC.RSA"
    "EMERGENC.SF"
)
```

Files matching `\*/res/xml/splits\*.xml` are also excluded as seen in line 32 of **[normalize-apk-content](https://github.com/proto-at-block/bitkey/blob/2c0dd04b9b434ae1d36747128471b26622f182c6/app/verifiable-build/android/verification/steps/normalize-apk-content#L32)**

## Successful Build

[View on asciinema](https://asciinema.org/a/694658)

## Diffs

`$ diff -r from-device/comparable/ locally-built/comparable/`

```
Binary files from-device/comparable/base/assets/dexopt/baseline.prof and locally-built/comparable/base/assets/dexopt/baseline.prof differ
Binary files from-device/comparable/base/classes2.dex and locally-built/comparable/base/classes2.dex differ
Binary files from-device/comparable/base/classes.dex and locally-built/comparable/base/classes.dex differ
Binary files from-device/comparable/base/resources.arsc and locally-built/comparable/base/resources.arsc differ
Binary files from-device/comparable/en/resources.arsc and locally-built/comparable/en/resources.arsc differ
Binary files from-device/comparable/xxhdpi/resources.arsc and locally-built/comparable/xxhdpi/resources.arsc differ
```

### base.apk

```
$ diff -r from-device/comparable/base loc ally-built/comparable/base
Binary files from-device/comparable/base/assets/dexopt/baseline.prof and locally-built/comparable/base/assets/dexopt/baseline.prof differ
Binary files from-device/comparable/base/classes2.dex and locally-built/comparable/base/classes2.dex differ
Binary files from-device/comparable/base/classes.dex and locally-built/comparable/base/classes.dex differ
Binary files from-device/comparable/base/resources.arsc and locally-built/comparable/base/resources.arsc differ 
```

Diffoscope results for {% include diffoscope-modal.html label='classes2.dex' url='/assets/diffoscope-results/android/world.bitkey.app/2024.74.1.1/base/classes2.dex.html' %}

Diffoscope results for {% include diffoscope-modal.html label='classes.dex' url='/assets/diffoscope-results/android/world.bitkey.app/2024.74.1.1/base/classes.dex.html' %}


`$ diff -r from-device/unpacked locally-built/unpacked`

```
Binary files from-device/unpacked/arm64_v8a/AndroidManifest.xml and locally-built/unpacked/arm64_v8a/AndroidManifest.xml differ
Only in from-device/unpacked/arm64_v8a: META-INF
Only in from-device/unpacked/arm64_v8a: stamp-cert-sha256
Binary files from-device/unpacked/base/AndroidManifest.xml and locally-built/unpacked/base/AndroidManifest.xml differ
Binary files from-device/unpacked/base/assets/dexopt/baseline.prof and locally-built/unpacked/base/assets/dexopt/baseline.prof differ
Binary files from-device/unpacked/base/classes2.dex and locally-built/unpacked/base/classes2.dex differ
Binary files from-device/unpacked/base/classes.dex and locally-built/unpacked/base/classes.dex differ
Binary files from-device/unpacked/base/res/xml/splits0.xml and locally-built/unpacked/base/res/xml/splits0.xml differ
Binary files from-device/unpacked/base/resources.arsc and locally-built/unpacked/base/resources.arsc differ
Only in from-device/unpacked/base: stamp-cert-sha256
Binary files from-device/unpacked/en/AndroidManifest.xml and locally-built/unpacked/en/AndroidManifest.xml differ
Only in from-device/unpacked/en: META-INF
Binary files from-device/unpacked/en/resources.arsc and locally-built/unpacked/en/resources.arsc differ
Only in from-device/unpacked/en: stamp-cert-sha256
Binary files from-device/unpacked/xxhdpi/AndroidManifest.xml and locally-built/unpacked/xxhdpi/AndroidManifest.xml differ
Only in from-device/unpacked/xxhdpi: META-INF
Binary files from-device/unpacked/xxhdpi/resources.arsc and locally-built/unpacked/xxhdpi/resources.arsc differ
Only in from-device/unpacked/xxhdpi: stamp-cert-sha256
```

`$ diff -r from-device/normalized-names locally-built/normalized-names`

## Verdict

Similar to the previous version, this version has a verdict of **not verifiable**.

```
Binary files from-device/normalized-names/arm64_v8a.apk and locally-built/normalized-names/arm64_v8a.apk differ
Binary files from-device/normalized-names/base.apk and locally-built/normalized-names/base.apk differ
Binary files from-device/normalized-names/en.apk and locally-built/normalized-names/en.apk differ
Binary files from-device/normalized-names/xxhdpi.apk and locally-built/normalized-names/xxhdpi.apk differ
```

## For archival purposes:

### From device APK checksums:

```
b7d9b4829f6296a7c01ee789e10cf4fad4b1bf514f8f2fafd2844ca129d57c91  base.apk
e81e73a66e18e53eb8be2eadfee9fb901c5554ed1ba5cc92466e04aeeed41d19  split_config.arm64_v8a.apk
221ddbe7796a123c565a002e2bf0356a4d2d4098a8a58f415d25e852d6300d1e  split_config.en.apk
a6a40e592bafb2c58c92491a9fd27107a018cc1add4013754e54f7187a9eb404  split_config.xxhdpi.apk
```

### Locally built APK checksums:

```
75231c06bae15ce51167b68b483b9ffde702c8a7ff0728e37fad8b84e2c32b5b  base-arm64_v8a.apk
6af1a20c2d7b9370f6409ced1a9b33fd441d03d4b47d7b3a901f645b297d9046  base-en.apk
b433801ca76ff773e839ca7a2c0473bc0a729c252c815f2bd4f5ec839331e412  base-master.apk
6f95117f4940e34eaa1dbc151e78b721d1691ccaa01f2b538a11712c37a316ee  base-xxhdpi.apk
