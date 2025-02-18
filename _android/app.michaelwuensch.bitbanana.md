---
wsId: 
title: 'BitBanana: Bitcoin & Lightning'
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: app.michaelwuensch.bitbanana
appCountry: 
released: 2023-03-26
updated: 2025-01-06
version: 0.8.9
stars: 
ratings: 
reviews: 
website: https://bitbanana.app/
repository: https://github.com/michaelWuensch/BitBanana
issue: https://github.com/michaelWuensch/BitBanana/issues/95
icon: app.michaelwuensch.bitbanana.png
bugbounty: 
meta: ok
verdict: wip
appHashes: []
date: 2024-01-02
signer: 98d818b12efa005735dc3d6b6ed78a05d8f75629e0afaf001655ed6aacfd2884
reviewArchive:
- date: 2024-01-02
  version: 0.8.8
  appHashes:
  - 23f5f22e06e56604b75bfea649f3e0b0d0c2a1ebc8c487dc84224acd48a8993a
  gitRevision: 16370f5e0f023ab1aee882013b60db42bddd55eb
  verdict: nonverifiable
- date: 2024-10-21
  version: 0.8.7
  appHashes: []
  gitRevision: 8e88c9ff17f8903e91d21c64e95f6031b1f7dab2
  verdict: nonverifiable
- date: 2024-10-21
  version: 0.8.7
  appHashes: []
  gitRevision: 8e88c9ff17f8903e91d21c64e95f6031b1f7dab2
  verdict: ftbfs
twitter: BitBananaApp
social:
- https://discord.gg/Xg85BuTc9A
- >-
  https://snort.social/p/npub1dwn7wphjhrlej6ks4sktgn77w82ayq6hn6lj37ll75tav55nd3vq07xzaj
redirect_from: 
developerName: Michael Wünsch
features: 

---

## Updated on 2025-01-07

We endeavored to adapt the comparison process to comparing via the [testAAB.sh script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/testAAB.sh). 

### Process

**Step 1.** Download the apks from the phone

To make use of the testAAB.sh script, we need to download the latest version of the BitBanana app from the Play Store and extract the APKs that are included in the app by using the [apkextractor_sync.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/apkextractor_sync.sh). 

`$ apkextractor_sync.sh app.michaelwuensch.bitbanana`

There is usually 3 or 4 apks produced using this process placed in a folder.

**Step 2.** Download the device-spec.json file from your device

Use the device-spec_extractor.sh script to download the device-spec.json file from your device.

`$ ./device-spec_extractor.sh`

**Step 3.** Source the device-spec.json file

Modify this line in the scripts/test/android/app.michaelwuensch.bitbanana.sh

`deviceSpec="/var/shared/device-spec/a11/device-spec.json"`

Change the directory to the location of **your** device-spec.json file.

**Step 4.** Run testAAB.sh

When using testAAB.sh locally, take note of the folder location of the app.

Invoke:

`$ testAAB.sh -d /path/to/apk-directory`

This script has been tested on the latest version of BitBanana (0.8.9) and the test results are as follows:

```
armeabi_v7a.apk

Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256

base.apk 

Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/assets/dexopt/baseline.prof and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/assets/dexopt/baseline.prof differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/assets/dexopt/baseline.profm and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/assets/dexopt/baseline.profm differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/classes4.dex and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/classes4.dex differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/classes5.dex and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/classes5.dex differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/classes.dex and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/classes.dex differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/res/xml/splits0.xml and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/res/xml/splits0.xml differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base/resources.arsc and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/base: stamp-cert-sha256

xhdpi.apk

Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.8.9/fromPlay-unzipped/xhdpi: stamp-cert-sha256
```

## Excluding signing-related diffs:  

### In armeabi_v7a.apk only AndroidManifest.xml differs 

  {% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_armeabi_v7a_AndroidManifest.html' %}

### In base.apk, the following files differ:

  {% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_base_AndroidManifest.html' %}
  
  {% include diffoscope-modal.html label='classes.dex' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_base_classes.dex.html' %}
  
  {% include diffoscope-modal.html label='classes4.dex' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_base_classes4.dex.html' %}
  
  {% include diffoscope-modal.html label='classes5.dex' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_base_classes5.dex.html' %}
  
  {% include diffoscope-modal.html label='baseline.prof' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_base_baseline.prof.html' %}

  {% include diffoscope-modal.html label='baseline.profm' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_base_baseline.profm.html' %}
   

### In xhdpi.apk, the following files differ: 
  
  {% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.8.9/diffoscope_xhdpi_AndroidManifest.xml.html' %}
  

We are currently in the process of investigating the cause for the remaining diffs. While doing so, we can conclude that version 0.8.9 is **nonverifiable**.

## App Description from Google Play

> BitBanana is a native android app for node operators focused on user experience and ease of use. While it is not a wallet on its own, BitBanana works like a remote control allowing you to use your node as a wallet wherever you go. The app is designed with an educational approach, providing the user with guidance on every aspect of node operation.

## Analysis

While not explicitly a wallet, it does incorporate features that are akin to a wallet. The user initializes by connecting to a bitcoin lightning node. Once connected to a node, features such as backup, restore and other wallet features such as send and receive are made available. 

The provider has provided links to F-Droid and has self-described as reproducible. This app is [**for verification**](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/512)
