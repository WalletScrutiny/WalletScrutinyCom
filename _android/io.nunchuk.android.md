---
wsId: nunchuk
title: Nunchuk Bitcoin Wallet
altTitle: 
authors:
- leo
- emanuel
- mohammad
- danny
users: 10000
appId: io.nunchuk.android
appCountry: 
released: 2021-11-11
updated: 2025-01-16
version: 1.9.59
stars: 4.6
ratings: 26
reviews: 23
size: 
website: https://nunchuk.io
repository: https://github.com/nunchuk-io/nunchuk-android
issue: https://github.com/nunchuk-io/nunchuk-android/issues/23
icon: io.nunchuk.android.png
bugbounty: 
meta: ok
verdict: nonverifiable
appHashes: []
date: 2025-01-27
signer:
reviewArchive:
- date: 2025-01-15
  version: 1.9.58
  appHashes: [8f53fa42fc072381ea228314fa421b52a77b33e9fe6029095fc1d13c68fd9b41, 24e13fbf44b47b8dc46c6043fc0383ed59075f97da22489d34f38f02a36616a2, 9027651c5ed7dd4a31d6cd073023bb77f38b799d8a0aa0ff0f81a184b1795dd3, b85a00b1c6ac7b6b2ed068beb3fd134d5386e2f30885e9ab5202c0d5e0d90086, 02c32758930cf0d4d87a44a5985f7bf97550280e1539074276a277866489f022, 0daeee1e46edda5bc66c6878af256c43da2cb5378cdfc944addd8ff0498ac2f8]
  gitRevision: 8080d3a7f2c5ea5e5acf56295040b814accb6b11
  verdict: nonverifiable 
- date: 2024-11-19
  version: 1.9.53
  appHashes: []
  gitRevision: 4458285efc54bd9bc76d74f88e696201a4af4a93
  verdict: nonverifiable 
- date: 2024-11-19
  version: 1.9.53
  appHashes: []
  gitRevision: 4458285efc54bd9bc76d74f88e696201a4af4a93
  verdict: nonverifiable
- date: 2023-07-05
  version: 1.9.32
  appHashes: []
  gitRevision: 5e67b0f51e6c67a3e1140ba66a1b4222e8cfe2a4
  verdict: nonverifiable
- date: 2023-01-06
  version: 1.9.23
  appHashes: []
  gitRevision: 49d61c1c5807f24ea01ba185a2de6793f8df0d38
  verdict: nonverifiable
- date: 2021-12-15
  version: 1.9.21
  appHashes: []
  gitRevision: f9bb0384d334f1ab3cd67824f43ff0053e7e51e7
  verdict: nosource
twitter: nunchuk_io
social:
- https://nunchuk.medium.com/
- >-
  https://join.slack.com/t/nunchukio/shared_invite/zt-xqdlvl5g-xKKohQu_R7IUo7_np8rVaw
redirect_from: 
developerName: Nunchuk Inc
features: 

---

## App Description

Nunchuk is a Bitcoin wallet offering advanced multisignature (multisig) functionality, inheritance planning, and robust privacy features. It eliminates single points of failure with multisig setups and provides key recovery options through encrypted cloud backups. The wallet ensures non-custodial control, allowing users to retain full ownership of their Bitcoin. Privacy is emphasized with features like end-to-end encrypted communication and inheritance planning without identity verification.

Additional capabilities include advanced coin control for managing transaction inputs, tagging, and filtering coins, as well as a multi-user multisig wallet for shared Bitcoin management. Nunchuk supports secure collaboration for families or businesses, ensuring that assets can be managed collectively with ease.

### Provider's Own Process

The provider has their own **[script](https://github.com/nunchuk-io/nunchuk-android/blob/master/reproducible-builds/apkdiff.py)** and **[instructions](https://github.com/nunchuk-io/nunchuk-android/tree/master/reproducible-builds)** for testing the reproducibility of the app. 

## Reproducibility Test for {{ page.title }} version 1.9.59

### Raw Results

```
===== Begin Results =====
*** Comparing Official and Built APKs Hashes ***
Official APKs:
========================================
**Official APKs Hashes**
c0cc213b0e5f309d4bf83d8ff576f7e7c324c2273e202170a10704b0b5d9d535 base.apk
03a0faf7feae6ced736a0894049163dbfc81d8b616c0c549d1b9dc7c781bd0cc split_config.armeabi_v7a.apk
3f704527776c7696c85728790f8639ced4d38eaa1a43229d33c4c8b8aa0a1e0a split_config.xhdpi.apk
========================================
Built APKs:
========================================
**Built APKs Hashes**
8b0cbc91db4f5764bd1cc2341564a9b219ef94b2f7bbecf360f177076fd46ebd base.apk
a92ea3ad793f34babd7db28bdc5365f8e5f9838e7dd41e739822121e36b629cc split_config.armeabi_v7a.apk
aca0de02986bb2860e30dfebf4dd04ef4f57bb4c285400fb94b643635e617d10 split_config.xhdpi.apk
========================================
Running diffs between official and built unzipped APKs...

Comparing armeabi_v7a...
Differences found between /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/armeabi_v7a and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/armeabi_v7a
Binary files /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256

Comparing base...
Differences found between /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/base and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/base
Binary files /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/base/resources.arsc and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/base: stamp-cert-sha256

Comparing xhdpi...
Differences found between /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/xhdpi and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/xhdpi
Binary files /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_io.nunchuk.android_1.9.59/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/xhdpi: stamp-cert-sha256
===== End Results =====
```
{% include asciicast %}

# Summary

## base.apk

c0cc213b0e5f309d4bf83d8ff576f7e7c324c2273e202170a10704b0b5d9d535 - Official
8b0cbc91db4f5764bd1cc2341564a9b219ef94b2f7bbecf360f177076fd46ebd - Built

{% include diffoscope-modal.html label='Diffoscope between the two apks on an upgraded Androguard Python venv' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.59/diffo-io.nunchuk.android_1.9.59-androguardvenv-base.html' %}

### Diffs:

{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.59/diffoscope-base-AndroidManifest.xml.html' %}

**resources.arsc** 

**When running a diff on the decompiled version of resources.arsc:**

We execute: `$ diff -r fromBuild-decoded-manual/res fromPlay-decoded-new/res`

```
diff -r fromBuild-decoded-manual/res/values/strings.xml fromPlay-decoded-new/res/values/strings.xml
56c56
<     <string name="com.google.firebase.crashlytics.mapping_file_id">9889cfdd0ee44e379f1255aa74a2fb79</string>
---
>     <string name="com.google.firebase.crashlytics.mapping_file_id">4066e4c56e2b4a88acb5b0d8e721a9dd</string>
```

**stamp-cert-sha256**

**Size of stamp-cert-sha256 in bytes**

```
$ stat --format="%s" /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/base/stamp-cert-sha256
32
```
<hr>

## armeabi_v7a.apk

03a0faf7feae6ced736a0894049163dbfc81d8b616c0c549d1b9dc7c781bd0cc - Official
a92ea3ad793f34babd7db28bdc5365f8e5f9838e7dd41e739822121e36b629cc - Built

{% include diffoscope-modal.html label='Diffoscope between the two matching armeabi_v7a apks' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.59/diffo-io.nunchuk.android_1.9.59-built-armeabi-vs-play-armeabi.html' %}

### Diffs:

{% include diffoscope-modal.html label='AndroidManifest.xml' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.59/diffo-decoded-armeabi-AndroidManifest.xml.html' %}

**stamp-cert-sha256**

**Size of stamp-cert-sha256 in bytes**
```
$ stat --format="%s" /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/armeabi_v7a/stamp-cert-sha256
32
```
<hr>

## xhdpi.apk

3f704527776c7696c85728790f8639ced4d38eaa1a43229d33c4c8b8aa0a1e0a - Official
aca0de02986bb2860e30dfebf4dd04ef4f57bb4c285400fb94b643635e617d10 - Built

{% include diffoscope-modal.html label='Diffoscope between the two matching xhdpi apks' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.59/diffo-io.nunchuk.android_1.9.59-built-xhdpi-vs-play-xhdpi.html' %}

### Diffs:

**AndroidManifest.xml**

We run: 

```
diffoscope --html diffoscope-decoded-xhdpi-AndroidManifest.xml.html fromBuild-decoded-xhdpi/AndroidManifest.xml fromPlay-decoded-xhdpi/AndroidManifest.xml 
danny@lw10:/tmp/test_io.nunchuk.android_1.9.59$ ls diffoscope-*
ls: cannot access 'diffoscope-*': No such file or directory
```

**META-INF**

**resources.arsc**

**stamp-cert-sha256**

**Size of stamp-cert-sha256 in bytes**
```
$ stat --format="%s" /tmp/test_io.nunchuk.android_1.9.59/fromPlay-unzipped/armeabi_v7a/stamp-cert-sha256
32
```

## Conclusion

While the app is **nonverifiable** due to the differences observed, these differences are largely explained by the signing process and metadata injection by the Play Store. The diffs in resources.arsc are likely due to variations in the build toolchain or resource optimization applied by the Play Store. It is highly probable that this [crashlytics diff on resources.arsc](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/merge_requests/965#note_2314802828) came from a bug that has yet to be addressed. 




