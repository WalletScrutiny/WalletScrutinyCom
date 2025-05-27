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
updated: 2025-04-04
version: 0.9.4
stars: 3.8
ratings: 
reviews: 
website: https://bitbanana.app/
repository: https://github.com/michaelWuensch/BitBanana
issue: https://github.com/michaelWuensch/BitBanana/issues/95
icon: app.michaelwuensch.bitbanana.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- fe57c48a52177a33ebc386322a1cfd36cb06d2351cb53df96bbc7b456ec3d503
- b0da32db5b75cf3ea94f6d3f9157c1d5f43a8f34f18c45376c6114f23f91f55d
- 3da406028595ae50141e13a3530e7702766577eb69551c18d5cfaecbf399fb31
date: 2025-03-19
signer: 98d818b12efa005735dc3d6b6ed78a05d8f75629e0afaf001655ed6aacfd2884
twitter: BitBananaApp
social:
- https://discord.gg/Xg85BuTc9A
- >-
  https://snort.social/p/npub1dwn7wphjhrlej6ks4sktgn77w82ayq6hn6lj37ll75tav55nd3vq07xzaj
redirect_from: 
developerName: Michael Wünsch
features: 

---

## Updated on 2025-03-19 for version 0.9.2

There are new [reproducibility verification instructions](https://github.com/michaelWuensch/BitBanana/blob/master/docs/REPRODUCE_PLAYSTORE.md) from the developer. We incorporated our own methodology while also adhering to bitbanana's own verification instructions. We also updated the testAAB.sh script as well as the app-specific script to adjust for the device-spec.json creation.

## Results via testAAB.sh

### armeabi_v7a.apk

{% include diffoscope-modal.html label='Diffoscope results for armeabi_v7a.apk' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.9.2/diffo-armeabi.html' %}

```
Comparing armeabi_v7a...
Differences found between /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/armeabi_v7a and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/armeabi_v7a
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256
```
- AndroidManifest.xml
- META-INF
- stamp-cert-sha256

### base.apk

{% include diffoscope-modal.html label='Diffoscope results for base.apk' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.9.2/diffo-base.html' %}

```
Comparing base...
Differences found between /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/base and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/base
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/base/resources.arsc and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/base: stamp-cert-sha256
```

- AndroidManifest.xml
- resources.arsc
- stamp-cert-sha256

### xhdpi.apk

{% include diffoscope-modal.html label='Diffoscope results for xhdpi.apk' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.9.2/diffo-xhdpi.html' %}

```
Comparing xhdpi...
Differences found between /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/xhdpi and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/xhdpi
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.2/fromPlay-unzipped/xhdpi: stamp-cert-sha256
```

- AndroidManifest.xml
- META-INF
- resource.arsc
- stamp-cert-sha256

```
## Asciicast

{% include asciicast %}

## Analysis 

The diffs are expected and minimal. Our findings match the findings of Bitbanana's own script which we ran manually. Both lead to the conclusion that version 0.9.2 is functionally **reproducible**.

### Process

**Step 1.** Download the apks from the phone

To make use of the testAAB.sh script, we need to download the latest version of the BitBanana app from the Play Store and extract the APKs that are included in the app by using the [apkextractor_sync.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/apkextractor_sync.sh). 

`$ apkextractor_sync.sh app.michaelwuensch.bitbanana`

There is usually 3 or 4 apks produced using this process placed in a folder.

**Step 2.** The device-spec.json file is now auto-generated

**Step 3.** Run testAAB.sh

When using testAAB.sh locally, take note of the folder location of the app.

Invoke:

`$ testAAB.sh -d /path/to/apk-directory`

## Comparing the diffs in resources.arsc in base.apk using apktool

```
$ apktool d base-master.apk 
I: Using Apktool 2.7.0-dirty on base-master.apk
I: Loading resource table...
I: Decoding AndroidManifest.xml with resources...
I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
I: Regular manifest package...
I: Decoding file-resources...
I: Decoding values */* XMLs...
I: Baksmaling classes.dex...
I: Baksmaling classes2.dex...
I: Baksmaling classes3.dex...
I: Baksmaling classes4.dex...
I: Baksmaling classes5.dex...
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...
I: Copying META-INF/services directory
danny@lw10:/tmp/test_app.michaelwuensch.bitbanana_0.9.2/built-split_apks$ ls
base-armeabi_v7a.apk  base-master  base-master.apk  base-xhdpi.apk
danny@lw10:/tmp/test_app.michaelwuensch.bitbanana_0.9.2/built-split_apks$ apktool d /var/shared/apk/app.michaelwuensch.bitbanana/0.9.2/base.apk -o base-play
I: Using Apktool 2.7.0-dirty on base.apk
I: Loading resource table...
I: Decoding AndroidManifest.xml with resources...
I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
I: Regular manifest package...
I: Decoding file-resources...
I: Decoding values */* XMLs...
I: Baksmaling classes.dex...
I: Baksmaling classes2.dex...
I: Baksmaling classes3.dex...
I: Baksmaling classes4.dex...
I: Baksmaling classes5.dex...
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...
I: Copying META-INF/services directory
```

Then we ran a diff.

```
danny@lw10:/tmp/test_app.michaelwuensch.bitbanana_0.9.2/built-split_apks$ diff -r base-master/res/ base-play/res/
danny@lw10:/tmp/test_app.michaelwuensch.bitbanana_0.9.2/built-split_apks$
```

No diffs in **resources.arsc** between *built-base.apk vs play-base.apk* were found using apktool

## Conclusion 

Similar to version 0.9.0, we find version 0.9.2 to be functionally **reproducible**.

## App Description from Google Play

> BitBanana is a native android app for node operators focused on user experience and ease of use. While it is not a wallet on its own, BitBanana works like a remote control allowing you to use your node as a wallet wherever you go. The app is designed with an educational approach, providing the user with guidance on every aspect of node operation.

