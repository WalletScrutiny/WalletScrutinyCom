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
updated: 2025-03-10
version: 0.9.2
stars: 
ratings: 
reviews: 
website: https://bitbanana.app/
repository: https://github.com/michaelWuensch/BitBanana
issue: https://github.com/michaelWuensch/BitBanana/issues/95
icon: app.michaelwuensch.bitbanana.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- 426154e8f2e8d35516cfeedbc6cbd46a0d858ce29113332150a5cb2ac4254bca
- 40dc6d9e97c40a9fe6e581d097c85df5b86336d56f3b60617670cc8ecef3d135
- c0185e90f5622ff0955394f91d748b42c1539a6390011cd65306b8d09c224908
date: 2025-03-07
signer: 98d818b12efa005735dc3d6b6ed78a05d8f75629e0afaf001655ed6aacfd2884
reviewArchive:
- date: 2024-01-02
  version: 0.8.9
  appHashes:
  - e7affe23ce103db8283001a023a4e03676a8fe49f167c42809762d8189ff657a
  - 053c9e37743b36ab574d444df64460e8fd55050604715713423fe47fd7e8deac
  - 42ee0b6f7b85e704b71357a0cb07678ca11cae38f56c9f4522c0bbfbe502c0bd
  gitRevision: c7352ffe4c17654cdfc05bc24ff60c5832de792d
  verdict: nonverifiable
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

## Updated on 2025-03-06 for version 0.9.0

There are new [reproducibility verification instructions](https://github.com/michaelWuensch/BitBanana/blob/master/docs/REPRODUCE_PLAYSTORE.md) from the developer. We incorporated our own methodology while also adhering to bitbanana's own verification instructions.

### Results via testAAB.sh

{% include diffoscope-modal.html label='Diffoscope armeabi_v7a.apk' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.9.0/diffo-armeabi.html' %}

```
Differences found between /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/armeabi_v7a and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/armeabi_v7a
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256
```

The diff in AndroidManifest.xml: 

```
<meta-data·android:name="com.android.vending.derived.apk.id"·android:value="3"/>
 	5	··</application>
```
<hr />

{% include diffoscope-modal.html label='Diffoscope base.apk' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.9.0/diffo-base.html' %}

```
Comparing base...
Differences found between /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/base and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/base
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/base/resources.arsc and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/base: stamp-cert-sha256
```

For base.apk, **AndroidManifest.xml** differs in 3 lines:

```
····<meta-data·android:name="com.android.stamp.source"·android:value="https://play.google.com/store"/>
 	149	····<meta-data·android:name="com.android.stamp.type"·android:value="STAMP_TYPE_DISTRIBUTION_APK"/>
<meta-data·android:name="com.android.vending.derived.apk.id"·android:value="3"/>
```  

resources.arsc differs at offset **00108b30**. Take note: *"no file-specific differences were detected; falling back to a binary diff."*

```
00108b30:·7330·0000·0202·1000·dc00·0000·0100·0000··s0..............

00108b30:·7330·0000·0202·1000·dc00·0000·0100·0100··s0..............
```

<hr />
{% include diffoscope-modal.html label='Diffoscope xhdpi.apk' url='/assets/diffoscope-results/android/app.michaelwuensch.bitbanana/0.9.0/diffo-xhdpi.html' %}

```
Comparing xhdpi...
Differences found between /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/xhdpi and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/xhdpi
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_app.michaelwuensch.bitbanana_0.9.0/fromPlay-unzipped/xhdpi: stamp-cert-sha256
```

2 lines differ in xhdpi's AndroidManifest.xml: 

```
····<meta-data·android:name="com.android.vending.derived.apk.id"·android:value="3"/>
 	5	··</application>
```

For resources.arsc, it was mentioned that *"...no file-specific differences were detected; falling back to a binary diff."* 

```
000014c0:·0000·0000·0202·1000·3005·0000·0800·0000··........0.......

000014c0:·0000·0000·0202·1000·3005·0000·0800·0300··........0.......
```

## Diff Results Using BitBanana's Own Script '[Diff.py](https://github.com/michaelWuensch/BitBanana/blob/master/reproducible-builds/Diff.py)':

```
BUILD SUCCESSFUL in 3m 45s
48 actionable tasks: 46 executed, 2 up-to-date
  % Total    % Received % Xferd  Average Speed   Time    Time     Time  Current
                                 Dload  Upload   Total   Spent    Left  Speed
  0     0    0     0    0     0      0      0 --:--:-- --:--:-- --:--:--     0
100 31.0M  100 31.0M    0     0  65.9M      0 --:--:-- --:--:-- --:--:--  189M
-rw-r--r-- 1 danny danny 32M Mar  6 10:41 bundletool.jar
deviceSpec variable not set or file not found
Creating a basic device-spec.json file...
Created device-spec.json with default values
device-spec.json contents:
{
  "supportedAbis": ["armeabi-v7a"],
  "supportedLocales": ["en"],
  "screenDensity": 280,
  "sdkVersion": 31
}
WARNING: The APKs won't be signed and thus not installable unless you also pass a keystore via the flag --ks. See the command help for more information.
Copying produced artifacts for testAAB.sh comparison
Copying Play Store APKs from /var/shared/apk/app.michaelwuensch.bitbanana/0.9.0/ to ./reproducible-builds/apks/playstore-apks/
========================================
Executing python script to format output
========================================
Successfully decoded: /tmp/test_app.michaelwuensch.bitbanana_0.9.0/bitbanana/reproducible-builds/extracted_apks/built-apks/split_config.xhdpi.apk
Output: I: Using Apktool 2.7.0-dirty on split_config.xhdpi.apk
I: Loading resource table...
I: Decoding AndroidManifest.xml with resources...
I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
I: Regular manifest package...
I: Decoding file-resources...
I: Decoding values */* XMLs...
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...

Successfully decoded: /tmp/test_app.michaelwuensch.bitbanana_0.9.0/bitbanana/reproducible-builds/extracted_apks/built-apks/base.apk
Output: I: Using Apktool 2.7.0-dirty on base.apk
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

Successfully decoded: /tmp/test_app.michaelwuensch.bitbanana_0.9.0/bitbanana/reproducible-builds/extracted_apks/built-apks/split_config.armeabi_v7a.apk
Output: I: Using Apktool 2.7.0-dirty on split_config.armeabi_v7a.apk
I: Decoding AndroidManifest.xml with only framework resources...
I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...

Successfully decoded: /tmp/test_app.michaelwuensch.bitbanana_0.9.0/bitbanana/reproducible-builds/extracted_apks/playstore-apks/split_config.xhdpi.apk
Output: I: Using Apktool 2.7.0-dirty on split_config.xhdpi.apk
I: Loading resource table...
I: Decoding AndroidManifest.xml with resources...
I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
I: Regular manifest package...
I: Decoding file-resources...
I: Decoding values */* XMLs...
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...

Successfully decoded: /tmp/test_app.michaelwuensch.bitbanana_0.9.0/bitbanana/reproducible-builds/extracted_apks/playstore-apks/base.apk
Output: I: Using Apktool 2.7.0-dirty on base.apk
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

Successfully decoded: /tmp/test_app.michaelwuensch.bitbanana_0.9.0/bitbanana/reproducible-builds/extracted_apks/playstore-apks/split_config.armeabi_v7a.apk
Output: I: Using Apktool 2.7.0-dirty on split_config.armeabi_v7a.apk
I: Decoding AndroidManifest.xml with only framework resources...
I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
I: Copying assets and libs...
I: Copying unknown files...
I: Copying original files...

==============================================
Running Bitbanana's Internal Comparison Script
==============================================
No differences found.
```
## Asciicast

{% include asciicast %}

## Analysis 

The diffs are expected and minimal. Our findings match the findings of Bitbanana's own script. Both lead to the conclusion that version 0.9.0 is **reproducible**.

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

## App Description from Google Play

> BitBanana is a native android app for node operators focused on user experience and ease of use. While it is not a wallet on its own, BitBanana works like a remote control allowing you to use your node as a wallet wherever you go. The app is designed with an educational approach, providing the user with guidance on every aspect of node operation.

