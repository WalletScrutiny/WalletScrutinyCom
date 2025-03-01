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
updated: 2025-02-28
version: 1.9.64
stars: 4.6
ratings: 26
reviews: 26
website: https://nunchuk.io
repository: https://github.com/nunchuk-io/nunchuk-android
issue: https://github.com/nunchuk-io/nunchuk-android/issues/23
icon: io.nunchuk.android.png
bugbounty: 
meta: ok
verdict: reproducible
appHashes:
- d2cdcf52e5534d91275f85abb465bfc076871812512256f8c9b51b1f4a8cb69b
- e2ae9e4b88963e7142c80c02a2c49b417fa34fb1809f296452efd828928b0b22
- 698dd56861707684165d0dc39c6df73284a9cbadf867fd3accf8c6bf5cfdaaff
date: 2025-02-17
signer: 
reviewArchive:
- date: 2025-01-27
  version: 1.9.59
  appHashes:
  - c0cc213b0e5f309d4bf83d8ff576f7e7c324c2273e202170a10704b0b5d9d535
  - 03a0faf7feae6ced736a0894049163dbfc81d8b616c0c549d1b9dc7c781bd0cc
  - 3f704527776c7696c85728790f8639ced4d38eaa1a43229d33c4c8b8aa0a1e0a
  gitRevision: 93f538c4a309c720acb3a344ddb614b5d546cefa
  verdict: nonverifiable
- date: 2025-01-15
  version: 1.9.58
  appHashes:
  - 8f53fa42fc072381ea228314fa421b52a77b33e9fe6029095fc1d13c68fd9b41
  - 9027651c5ed7dd4a31d6cd073023bb77f38b799d8a0aa0ff0f81a184b1795dd3
  - 02c32758930cf0d4d87a44a5985f7bf97550280e1539074276a277866489f022
  gitRevision: 8080d3a7f2c5ea5e5acf56295040b814accb6b11
  verdict: nonverifiable
- date: 2024-11-19
  version: 1.9.53
  appHashes: []
  gitRevision: 4458285efc54bd9bc76d74f88e696201a4af4a93
  verdict: nonverifiable
- date: 2024-11-19
  version: 1.9.53
  appHashes:
  - aaec6e500babbd1931db8485b99205468e426f6157df131f607aa69b6e821708
  gitRevision: b720beb1ee4f9de53638ab013f759690c8e787a4
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

## Update for v1.9.62

```
*** Summary of Differences ***
Contents of diff_armeabi_v7a.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/armeabi_v7a/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.62/fromBuild-unzipped/armeabi_v7a/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/armeabi_v7a: META-INF
Only in /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/armeabi_v7a: stamp-cert-sha256

Contents of diff_base.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/base/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.62/fromBuild-unzipped/base/AndroidManifest.xml differ
Binary files /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/base/resources.arsc and /tmp/test_io.nunchuk.android_1.9.62/fromBuild-unzipped/base/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/base: stamp-cert-sha256

Contents of diff_xhdpi.txt:
Binary files /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/xhdpi/AndroidManifest.xml and /tmp/test_io.nunchuk.android_1.9.62/fromBuild-unzipped/xhdpi/AndroidManifest.xml differ
Only in /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/xhdpi: META-INF
Binary files /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/xhdpi/resources.arsc and /tmp/test_io.nunchuk.android_1.9.62/fromBuild-unzipped/xhdpi/resources.arsc differ
Only in /tmp/test_io.nunchuk.android_1.9.62/fromPlay-unzipped/xhdpi: stamp-cert-sha256
```

{% include asciicast %}

### Diffoscope results on the split apks

{% include diffoscope-modal.html label='base.apk' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.62/diffo-base.html' %}

- Only the crashlytics ID differs in resources.arsc
- The same ID diff is reflected in strings.xml
- The file-size of the stamp-cert-sha256 file is 32 bytes

{% include diffoscope-modal.html label='armeabi.apk' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.62/diffo-armeabi.html' %}

- As expected `<meta-data·android:name="com.android.vending.derived.apk.id"·android:value="6"/>` only exists in the Play armeabi_v7a.apk 
- The `stamp-cert-sha256` in the Play apk is only 32 bytes 	 

{% include diffoscope-modal.html label='base-xhdpi.apk' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.62/diffo-xhdpi.html' %}

- This `AndroidManifest.xml` line only exists in the Play xhdpi.apk:

```
<meta-data·android:name="com.android.vending.derived.apk.id"·android:value="6"/>	 
</application>
```

- The `stamp-cert-sha256` in the Google Play apk is only 32 bytes

Like in the previous review there was a problematic diffoscope result on xhdpi's **resources.arsc**

```
$ diffoscope fromBuild-unzipped/xhdpi/resources.arsc fromPlay-unzipped/xhdpi/resources.arsc 
--- fromBuild-unzipped/xhdpi/resources.arsc
+++ fromPlay-unzipped/xhdpi/resources.arsc
│┄ Format-specific differences are supported for Android package resource table (ARSC) but no file-specific differences were detected; falling back to a binary diff. file(1) reports: Android package resource table (ARSC), 88 string(s), utf8
@@ -548,15 +548,15 @@
 00002230: 6e6f 7469 6669 6361 7469 6f6e 5f62 675f  notification_bg_
 00002240: 6e6f 726d 616c 5f70 7265 7373 6564 0021  normal_pressed.!
 00002250: 216e 6f74 6966 795f 7061 6e65 6c5f 6e6f  !notify_panel_no
 00002260: 7469 6669 6361 7469 6f6e 5f69 636f 6e5f  tification_icon_
 00002270: 6267 0027 2742 6173 652e 5769 6467 6574  bg.''Base.Widget
 00002280: 2e41 7070 436f 6d70 6174 2e44 7261 7765  .AppCompat.Drawe
 00002290: 7241 7272 6f77 546f 6767 6c65 0000 0000  rArrowToggle....
-000022a0: 0202 1000 480c 0000 0800 0000 0e03 0000  ....H...........
+000022a0: 0202 1000 480c 0000 0800 0300 0e03 0000  ....H...........
 000022b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 000022c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 000022d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 000022e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 000022f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00002300: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00002310: 0000 0000 0000 0000 0000 0000 0000 0000  ................
@@ -1435,15 +1435,15 @@
 000059a0: 4b00 0000 0800 0003 5000 0000 0800 0000  K.......P.......
 000059b0: 4c00 0000 0800 0003 5100 0000 0800 0000  L.......Q.......
 000059c0: 4d00 0000 0800 0003 5200 0000 0800 0000  M.......R.......
 000059d0: 4e00 0000 0800 0003 5300 0000 0800 0000  N.......S.......
 000059e0: 4f00 0000 0800 0003 5400 0000 0800 0000  O.......T.......
 000059f0: 5000 0000 0800 0003 5500 0000 0800 0000  P.......U.......
 00005a00: 5100 0000 0800 0003 5700 0000 0202 1000  Q.......W.......
-00005a10: 3403 0000 1500 0000 c900 0000 0000 0000  4...............
+00005a10: 3403 0000 1500 0100 c900 0000 0000 0000  4...............
 00005a20: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00005a30: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00005a40: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00005a50: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00005a60: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00005a70: 0000 0000 0000 0000 0000 0000 0000 0000  ................
 00005a80: 0000 0000 0000 0000 0000 0000 0000 0000  ................

```

### Explanation 

The key difference here is `0000 0000` becoming `0000 0300`.

```
-000022a0: 0202 1000 480c 0000 0800 0000 0e03 0000  ....H...........
+000022a0: 0202 1000 480c 0000 0800 0300 0e03 0000  ....H...........
```

The second difference is `1500 0000` becoming `1500 0100`.

```
-00005a10: 3403 0000 1500 0000 c900 0000 0000 0000  4...............
+00005a10: 3403 0000 1500 0100 c900 0000 0000 0000  4...............
```

These are byte-level differences. So we attempted another approach to understand these diffs:

We ran: 

```
aapt2 dump resources built-split_apks/split_config.xhdpi.apk > fromBuild-xhdpi-resources.txt
aapt2 dump resources /var/shared/apk/io.nunchuk.android/1.9.62/split_config.xhdpi.apk  > fromPlay-xhdpi-resources.txt
```

We then ran diff and diffoscope, with no differing results:

```
danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ diff -r fromBuild-xhdpi-resources.txt fromPlay-xhdpi-resources.txt 
danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ diffoscope fromBuild-xhdpi-resources.txt fromPlay-xhdpi-resources.txt 
danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ 
```

A few observations: 

- When using `aapt2`, we found no diffs whatsoever. 
- Byte level differences exist when comparing unzipped xhdpi split apks. 

We take note of this in another app's (Bitkey) explanation for the [resources.arsc mismatch](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md)
 
> resources.arsc mismatch
>
> Until recently, once we normalized the APK names and contents, we could just run diff -r to check for identity. Unfortunately Google Play has changed how they build resources.arsc. From our testing, it seems like they are using a previously reserved byte. When built using bundletool, that byte is always 0, thus making direct comparison using diff impossible.
>
> Since resources are important part of the application, we're using aapt2 diff to check for differences between APKs from device and from bundletool.

Thus, `aapt2 dump resources` and `diff` on its output demonstrated that the actual resources are the same. 

While the app is **nonverifiable** due to the differences observed, these differences are largely benign. The diffs in **resources.arsc** when not using aapt2 are likely due to variations in the build toolchain.

Version 1.9.62 of {{ page.title }} is **nonverifiable**.


## App Description

Nunchuk is a Bitcoin wallet offering advanced multisignature (multisig) functionality, inheritance planning, and robust privacy features. It eliminates single points of failure with multisig setups and provides key recovery options through encrypted cloud backups. The wallet ensures non-custodial control, allowing users to retain full ownership of their Bitcoin. Privacy is emphasized with features like end-to-end encrypted communication and inheritance planning without identity verification.

Additional capabilities include advanced coin control for managing transaction inputs, tagging, and filtering coins, as well as a multi-user multisig wallet for shared Bitcoin management. Nunchuk supports secure collaboration for families or businesses, ensuring that assets can be managed collectively with ease.

### Provider's Own Process

The provider has their own **[script](https://github.com/nunchuk-io/nunchuk-android/blob/master/reproducible-builds/apkdiff.py)** and **[instructions](https://github.com/nunchuk-io/nunchuk-android/tree/master/reproducible-builds)** for testing the reproducibility of the app. 


