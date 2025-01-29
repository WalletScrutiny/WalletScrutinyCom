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
date: 2025-01-15
signer: 
reviewArchive:
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

## Update 2025-01-27 for version **1.9.58**

# Diffs: 

## armeabi_v7a.apk 

```
8f53fa42fc072381ea228314fa421b52a77b33e9fe6029095fc1d13c68fd9b41 - Official
```

{% include diffoscope-modal.html label='Diffoscope between built and play armeabi_v7a apks' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.58/diffo-io.nunchuk.android_1.9.58-built-armeabi-vs-play-armeabi.html' %}

### **Added Metadata** in AndroidManifest.xml

The Play APK includes a new `<meta-data>` element inside the `<application>` tag:

```
<meta-data android:name\="com.android.vending.derived.apk.id" android:value\="3"/>
```

-   **Purpose**:
    -   This metadata is added by the Play Store during the app signing and distribution process.
    -   The `com.android.vending.derived.apk.id` key is used to identify the APK as part of a split configuration. The `value="3"` indicates a specific identifier for this split APK (likely related to the `armeabi_v7a`


### Additional Files in the Play APK

The Play APK includes 4 additional files:

1.  **`stamp-cert-sha256`** (32 bytes):
    -   This file is likely related to Play Store's app signing or integrity verification.
2.  **`META-INF/BNDLTOOL.SF`** (1,140 bytes):
    -   A signature file generated during the signing process.
3.  **`META-INF/BNDLTOOL.RSA`** (2,174 bytes):
    -   The RSA signature file containing the digital signature of the APK.
4.  **`META-INF/MANIFEST.MF`** (1,032 bytes):
    -   The manifest file containing hashes of all files in the APK, used for verification during installation.

### The apk meta data diffs

-   The addition of `stamp-cert-sha256: '8'` indicates that the Play APK includes a new file `stamp-cert-sha256`

<hr>

## base.apk

```
9027651c5ed7dd4a31d6cd073023bb77f38b799d8a0aa0ff0f81a184b1795dd3 - Official
```

{% include diffoscope-modal.html label='Diffoscope between built and play base apks' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.58/diffo-io.nunchuk.android_1.9.58-built-base-vs-play-base.html' %}

- baseline.profm
- classes2.dex
- classes3.dex
- classes4.dex
- classes5.dex
- classes6.dex
- classes.dex

### **Added Metadata**

The Play APK includes three new `<meta-data>` elements:

1.  **`com.android.stamp.source`**:

    ```
    <meta-data android:name\="com.android.stamp.source" android:value\="https://play.google.com/store"/>
    ```
    
    -   Indicates that the APK was distributed via the Play Store.
    -   The `value` points to the Play Store URL, confirming the source of the APK.

2.  **`com.android.stamp.type`**:

    ```
    <meta-data android:name\="com.android.stamp.type" android:value\="STAMP\_TYPE\_DISTRIBUTION\_APK"/>
    ```
    
    -   Specifies the type of APK. In this case, it is a **distribution APK**, meaning it is intended for distribution through the Play Store.

3.  **`com.android.vending.derived.apk.id`**:

    ```
    <meta-data android:name\="com.android.vending.derived.apk.id" android:value\="3"/>
    ```

    -   Identifies the specific split APK. The `value="3"` corresponds to the `armeabi_v7a` split configuration.

### **Summary of Differences in resources.arsc**

| **Resource** | **Built APK** | **Play APK** |
| --- | --- | --- |
| `array/com.google.firebase.crashlytics.build_ids_arch` | Mix of `arm`, `aarch64`, `mips`, `x86`, and `x86_64` (original order) | Reordered with `aarch64` at the beginning, fewer `mips` entries |
| `array/com.google.firebase.crashlytics.build_ids_build_id` | Build IDs in original order | Build IDs reordered to match the updated `build_ids_arch` array |

### **Changes in `array/com.google.firebase.crashlytics.build_ids_arch`**

-   **Built APK**:
    -   The array contains a mix of architectures: `arm`, `aarch64`, `mips`, `x86`, and `x86_64`.
    -   The order and count of architectures are specific to the build process.
-   **Play APK**:
    -   The array has been reordered and modified.
    -   The `aarch64` entries are moved to the beginning of the array.
    -   The `mips` entries are reduced, and some `arm` entries are repeated.

<hr>

### xhdpi.apk

```
02c32758930cf0d4d87a44a5985f7bf97550280e1539074276a277866489f022 - Official
```

{% include diffoscope-modal.html label='Diffoscope between xhdpi built and play xhdpi apks' url='/assets/diffoscope-results/android/io.nunchuk.android/1.9.58/diffo-io.nunchuk.android_1.9.58-built-xhdpi-vs-play-xhdpi.html' %}

### **File Size and Number of Entries**

-   **Built APK**:
    -   Zip file size: 84,023 bytes
    -   Number of entries: 90
-   **Play APK**:
    -   Zip file size: 111,545 bytes (larger by ~27 KB)
    -   Number of entries: 94 (4 additional files)

The Play APK is larger and includes 4 additional files, which are related to signing and metadata.

### **Additional Files in the Play APK**

The Play APK includes 4 additional files:

1.  **`stamp-cert-sha256`** (32 bytes):
    -   This file is likely related to Play Store's app signing or integrity verification.
2.  **`META-INF/BNDLTOOL.SF`** (9,721 bytes):
    -   A signature file generated during the signing process.
3.  **`META-INF/BNDLTOOL.RSA`** (2,174 bytes):
    -   The RSA signature file containing the digital signature of the APK.
4.  **`META-INF/MANIFEST.MF`** (9,613 bytes):
    -   The manifest file containing hashes of all files in the APK, used for verification during installation.

### **Added Metadata in AndroidManifest.xml**

The Play APK includes a new `<meta-data>` element inside the `<application>` tag:

    ```
    <meta-data android:name\="com.android.vending.derived.apk.id" android:value\="3"/>
    ```

-   **Purpose**:
    -   This metadata is added by the Play Store during the app signing and distribution process.
    -   The `com.android.vending.derived.apk.id` key is used to identify the APK as part of a split configuration. The `value="3"` indicates a specific identifier for this split APK (likely related to the `xhdpi` density split).

We have updated the issue with this [note.](https://github.com/nunchuk-io/nunchuk-android/issues/23#issuecomment-2462243428)


# Conclusion

The differences are quite substantial, and we would have to conclude that {{ page.title }} version **1.9.58** is **nonverifiable**.