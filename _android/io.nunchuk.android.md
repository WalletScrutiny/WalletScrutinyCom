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
stars: 4.7
ratings: 26
reviews: 25
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
date: 2025-03-04
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

We updated both testAAB.sh and io.nunchuk.android.sh to better accommodate the generation of the device-spec.json file. We also decided to re-evaluate our results for v1.9.62.

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

{% include diffoscope-modal.html label='armeabi_v7a.apk' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.62/diffo-armeabi.html' %}

- In the decoded AndroidManifest.xml, we find these expected lines present in the Play armeabi_v7a.apk: 

  ```
  <meta-data·android:name="com.android.vending.derived.apk.id"·android:value="6"/>
 	5	··</application>
  ```
- stamp-cert-sha256:·'8' (Size is 32 bytes)

{% include diffoscope-modal.html label='base.apk' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.62/diffo-base.html' %}

- For base.apk, these 3 lines are only present in the Play base.apk:

  ```
  <meta-data·android:name="com.android.stamp.source"·android:value="https://play.google.com/store"/>
 	300	····<meta-data·android:name="com.android.stamp.type"·android:value="STAMP_TYPE_DISTRIBUTION_APK"/>
  <meta-data·android:name="com.android.vending.derived.apk.id"·android:value="6"/>
  ```
- In resources.arsc, the value of the crashlytics mapping file ID for the Play xhdpi.apk is `c28ba611dfb947f1b4495655ad679a3a` while it is `0f23b898e52c4f6eb37bccc57f292c5b` for the built apk.
- These values are reflected in the **strings.xml** file.

  ```
  <string·name="com.google.firebase.crashlytics.mapping_file_id">c28ba611dfb947f1b4495655ad679a3a</string>
  <string·name="com.google.firebase.crashlytics.mapping_file_id">0f23b898e52c4f6eb37bccc57f292c5b</string>
  ```
- stamp-cert-sha256:·'8' (Size is 32 bytes)

{% include diffoscope-modal.html label='xhdpi.apk' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.62/diffo-xhdpi.html' %}

- In xhdpi.apk, the Play originating AndroidManifest.xml contains the following:

  ```
  <meta-data·android:name="com.android.vending.derived.apk.id"·android:value="6"/>
 	5	··</application>
  ```
- stamp-cert-sha256:·'8' (Size is 32 bytes)
- resources.arsc:

  ```
  ├── resources.arsc
  │┄ Format-specific differences are supported for Android package resource table (ARSC) but no file-specific differences were detected; falling back to a binary diff. file(1) reports: Android package resource table (ARSC), 88 string(s), utf8
  │ @@ -548,15 +548,15 @@
  │  00002230: 6e6f 7469 6669 6361 7469 6f6e 5f62 675f  notification_bg_
  │  00002240: 6e6f 726d 616c 5f70 7265 7373 6564 0021  normal_pressed.!
  │  00002250: 216e 6f74 6966 795f 7061 6e65 6c5f 6e6f  !notify_panel_no
  │  00002260: 7469 6669 6361 7469 6f6e 5f69 636f 6e5f  tification_icon_
  │  00002270: 6267 0027 2742 6173 652e 5769 6467 6574  bg.''Base.Widget
  │  00002280: 2e41 7070 436f 6d70 6174 2e44 7261 7765  .AppCompat.Drawe
  │  00002290: 7241 7272 6f77 546f 6767 6c65 0000 0000  rArrowToggle....
  │ -000022a0: 0202 1000 480c 0000 0800 0000 0e03 0000  ....H...........
  │ +000022a0: 0202 1000 480c 0000 0800 0300 0e03 0000  ....H...........
  │  000022b0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  000022c0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  000022d0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  000022e0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  000022f0: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00002300: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00002310: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │ @@ -1435,15 +1435,15 @@
  │  000059a0: 4b00 0000 0800 0003 5000 0000 0800 0000  K.......P.......
  │  000059b0: 4c00 0000 0800 0003 5100 0000 0800 0000  L.......Q.......
  │  000059c0: 4d00 0000 0800 0003 5200 0000 0800 0000  M.......R.......
  │  000059d0: 4e00 0000 0800 0003 5300 0000 0800 0000  N.......S.......
  │  000059e0: 4f00 0000 0800 0003 5400 0000 0800 0000  O.......T.......
  │  000059f0: 5000 0000 0800 0003 5500 0000 0800 0000  P.......U.......
  │  00005a00: 5100 0000 0800 0003 5700 0000 0202 1000  Q.......W.......
  │ -00005a10: 3403 0000 1500 0000 c900 0000 0000 0000  4...............
  │ +00005a10: 3403 0000 1500 0100 c900 0000 0000 0000  4...............
  │  00005a20: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00005a30: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00005a40: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00005a50: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00005a60: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00005a70: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  │  00005a80: 0000 0000 0000 0000 0000 0000 0000 0000  ................
  ```

- We re-evaluated the diffs found in xhdpi's resources.arsc file. Using AAPT2, we found 0 differences.

  ```
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ aapt2 dump resources built-split_apks/split_config.xhdpi.apk > built_resources.txt
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ aapt2 dump resources /var/shared/apk/io.nunchuk.android/1.9.62/split_config.xhdpi.apk > play_resources.txt
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ diff -u built_resources.txt play_resources.txt
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$
  ```

- We also used apktool:

  ```
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ apktool d built-split_apks/split_config.xhdpi.apk -o decoded_xhdpi-built
  I: Using Apktool 2.7.0-dirty on split_config.xhdpi.apk
  I: Loading resource table...
  I: Decoding AndroidManifest.xml with resources...
  I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
  I: Regular manifest package...
  I: Decoding file-resources...
  I: Decoding values */* XMLs...
  I: Copying assets and libs...
  I: Copying unknown files...
  I: Copying original files...
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ apktool d /var/shared/apk/io.nunchuk.android/1.9.62/split_config.xhdpi.apk -o decoded_xhdpi-play
  I: Using Apktool 2.7.0-dirty on split_config.xhdpi.apk
  I: Loading resource table...
  I: Decoding AndroidManifest.xml with resources...
  I: Loading resource table from file: /home/danny/.local/share/apktool/framework/1.apk
  I: Regular manifest package...
  I: Decoding file-resources...
  I: Decoding values */* XMLs...
  I: Copying assets and libs...
  I: Copying unknown files...
  I: Copying original files...
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ diff -ur decoded_xhdpi-built/res/values/ decoded_xhdpi-play/res/values/
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ 
  ```

Since `diff -ur decoded_xhdpi-built/res/values/ decoded_xhdpi-play/res/values/` returned no output, it means that there are no textual differences in the decompiled resource XML files. This suggests that:

The resources.arsc differences are not due to content changes (i.e., no modified strings, colors, dimensions, or other resource values).

## Conclusion

After thoroughly testing the apks, and having not found any significant differences using several approaches, I conclude that the apks are identical and are therefore **reproducible**.

### Post-review notes

One of our working guesses is that the absence of several signing-related files in the built apk could be causing a re-ordering of the files. This could potentially explain why the order of files in an APK affects their byte offsets, this shifted where resources.arsc is stored inside the APK. As a result, even though the contents of resources.arsc are identical, its binary position changed, making cmp and diffoscope detect a difference.

The built vs the play xhdpi apks:

  ```
  Total File Count and Size Difference
  Built APK: 90 files, 87,816 bytes
  Google Play APK: 94 files, 109,600 bytes
  ```

Some further information: 

  ```
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ zipinfo -v built-split_apks/split_config.xhdpi.apk | grep -A 5 "resources.arsc"
  resources.arsc

  offset of local header from start of archive:   50282
                                                  (000000000000C46Ah) bytes
  file system or operating system of origin:      Unix
  version of encoding software:                   0.0
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ zipinfo -v /var/shared/apk/io.nunchuk.android/1.9.62/split_config.xhdpi.apk | grep -A 5 "resources.arsc"
    resources.arsc

    offset of local header from start of archive:   50378
                                                    (000000000000C4CAh) bytes
    file system or operating system of origin:      Unix
    version of encoding software:                   0.0
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ unzip -l built-split_apks/split_config.xhdpi.apk > built_filelist.txt
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ unzip -l /var/shared/apk/io.nunchuk.android/1.9.62/split_config.xhdpi.apk > play_filelist.txt
  danny@lw10:/tmp/test_io.nunchuk.android_1.9.62$ diff -u built_filelist.txt play_filelist.txt
  --- built_filelist.txt	2025-03-04 11:35:49.750759864 +0000
  +++ play_filelist.txt	2025-03-04 11:36:06.343277428 +0000
  @@ -1,7 +1,7 @@
  -Archive:  built-split_apks/split_config.xhdpi.apk
  +Archive:  /var/shared/apk/io.nunchuk.android/1.9.62/split_config.xhdpi.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
  -      788  1981-01-01 01:01   AndroidManifest.xml
  +     1032  1981-01-01 01:01   AndroidManifest.xml
        4112  1981-01-01 01:01   res/drawable-anydpi-v21/exo_edit_mode_logo.xml
        1120  1981-01-01 01:01   res/drawable-anydpi-v21/exo_ic_audiotrack.xml
        700  1981-01-01 01:01   res/drawable-anydpi-v21/exo_ic_check.xml
  @@ -91,5 +91,9 @@
        247  1981-01-01 01:01   res/drawable-xhdpi-v4/notification_bg_normal_pressed.9.png
        138  1981-01-01 01:01   res/drawable-xhdpi-v4/notify_panel_notification_icon_bg.png
      24812  1981-01-01 01:01   resources.arsc
  +       32  1981-01-01 01:01   stamp-cert-sha256
  +     9721  1981-01-01 01:01   META-INF/BNDLTOOL.SF
  +     2174  1981-01-01 01:01   META-INF/BNDLTOOL.RSA
  +     9613  1981-01-01 01:01   META-INF/MANIFEST.MF
  ---------                     -------
  -    87816                     90 files
  +   109600                     94 files
  ```
## App Description

Nunchuk is a Bitcoin wallet offering advanced multisignature (multisig) functionality, inheritance planning, and robust privacy features. It eliminates single points of failure with multisig setups and provides key recovery options through encrypted cloud backups. The wallet ensures non-custodial control, allowing users to retain full ownership of their Bitcoin. Privacy is emphasized with features like end-to-end encrypted communication and inheritance planning without identity verification.

Additional capabilities include advanced coin control for managing transaction inputs, tagging, and filtering coins, as well as a multi-user multisig wallet for shared Bitcoin management. Nunchuk supports secure collaboration for families or businesses, ensuring that assets can be managed collectively with ease.

### Provider's Own Process

The provider has their own **[script](https://github.com/nunchuk-io/nunchuk-android/blob/master/reproducible-builds/apkdiff.py)** and **[instructions](https://github.com/nunchuk-io/nunchuk-android/tree/master/reproducible-builds)** for testing the reproducibility of the app. 


