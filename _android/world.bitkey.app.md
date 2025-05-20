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
updated: 2025-05-09
version: 2025.9.0 (6)
stars: 4.2
ratings: 
reviews: 21
website: https://bitkey.world
repository: https://github.com/proto-at-block/bitkey
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/647
icon: world.bitkey.app.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- 3850818298d2c8f13eb42c38b2fac7f9c46a3047bb8c99c26a1f03901ac097b4
- 782c20f09f9ced07b5b933dc3f7cdc22c1de2e9723a52e8c62b480fa5c6e1438
- f5ecf995f916caef93300c55eedce4e3b9cb8a95a0b33cda35571ac6cd7dda28
- 54cc265679cd8925b9045b3bb8e6099f15f74d55f3f1d8255d4f8773e0cc9bdb
date: 2025-03-03
signer: c0d0f9da7158cde788d0281e9ebd07034178165584d635f7ce17f77c037d961a
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

## Analysis 

This is the **companion app** to the {% include walletLink.html wallet='hardware/blockhww' verdict='true' %}. It requires an NFC-capable phone, otherwise the app would not be installed.

<hr>

[**Release Notes**](https://bitkey.world/en-US/releases)

# Verified Builds

[Documentation](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md) 


## Version 2025.1.1 (1)

We endeavored to follow the instructions in the [README](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md) to build the app. 

However, we noticed some recurring problems. 

Git version not found.

  ```
  2.446 Package git is not available, but is referred to by another package.
  2.446 This may mean that the package is missing, has been obsoleted, or
  2.446 is only available from another source
  2.446 However the following packages replace it:
  2.446   git-svn
  2.446 
  2.451 E: Version '1:2.34.1-1ubuntu1.12' for 'git' was not found
  ```

This was remedied by replacing [this line](https://github.com/proto-at-block/bitkey/blob/7e17ee0bc103853c91a05079b8d4e49bbba42634/app/verifiable-build/android/Dockerfile#L8) in the Dockerfile, to a git version that is not pinned.

  ```dockerfile
  RUN apt update && apt upgrade -y
  RUN apt install -y git
  ```

Next, we then had problems with the segment of the script that looks for aapt2. Although we followed the instructions in the ['prep stage'](https://github.com/proto-at-block/bitkey/blob/main/app/verifiable-build/android/README.md), this did not work until we installed build-tools-34.0.0 and exported aapt2 to the correct path.

## Version 2025.1.1 (1) Build Results

  ```
  Comparing builds:

  + '[' 2 -ne 2 ']'
  + which diff
  + which /home/dannybuntu/Android/Sdk/build-tools/34.0.0/aapt2
  + lhs_comparable=verify-apk/from-device/comparable
  + lhs_apks=verify-apk/from-device/normalized-names
  + rhs_comparable=verify-apk/locally-built/comparable
  + rhs_apks=verify-apk/locally-built/normalized-names
  ++ find verify-apk/from-device/normalized-names -maxdepth 1 -mindepth 1 -type f -exec basename '{}' ';'
  + lhs_apk_files='base.apk
  en.apk
  xxhdpi.apk
  arm64_v8a.apk'
  ++ find verify-apk/locally-built/normalized-names -maxdepth 1 -mindepth 1 -type f -exec basename '{}' ';'
  + rhs_apk_files='base.apk
  en.apk
  xxhdpi.apk
  arm64_v8a.apk'
  +++ echo 'base.apk
  en.apk
  xxhdpi.apk
  arm64_v8a.apk'
  ++ sort -u /dev/fd/63 /dev/fd/62
  +++ echo 'base.apk
  en.apk
  xxhdpi.apk
  arm64_v8a.apk'
  + all_apk_files='arm64_v8a.apk
  base.apk
  en.apk
  xxhdpi.apk'
  ++ diff -x resources.arsc -r verify-apk/from-device/comparable verify-apk/locally-built/comparable
  + differences='Binary files verify-apk/from-device/comparable/base/classes2.dex and verify-apk/locally-built/comparable/base/classes2.dex differ
  Binary files verify-apk/from-device/comparable/base/classes.dex and verify-apk/locally-built/comparable/base/classes.dex differ'
  + diff_exit_status=1
  + diff_result=1
  + declare -a aapt_differences
  + for apk_file in $all_apk_files
  + '[' '!' -f verify-apk/from-device/normalized-names/arm64_v8a.apk ']'
  + '[' '!' -f verify-apk/locally-built/normalized-names/arm64_v8a.apk ']'
  + unzip -l verify-apk/from-device/normalized-names/arm64_v8a.apk resources.arsc
  Archive:  verify-apk/from-device/normalized-names/arm64_v8a.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
  ---------                     -------
          0                     0 files
  + lhs_contains_resources_exit_code=11
  + unzip -l verify-apk/locally-built/normalized-names/arm64_v8a.apk resources.arsc
  Archive:  verify-apk/locally-built/normalized-names/arm64_v8a.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
  ---------                     -------
          0                     0 files
  + rhs_contains_resources_exit_code=11
  + '[' 11 -ne 0 ']'
  + '[' 11 -eq 0 ']'
  + '[' 11 -eq 0 ']'
  + echo 'Skipping aapt2 diff of arm64_v8a.apk as it doesn'\''t contain resources.arsc file'
  Skipping aapt2 diff of arm64_v8a.apk as it doesn't contain resources.arsc file
  + for apk_file in $all_apk_files
  + '[' '!' -f verify-apk/from-device/normalized-names/base.apk ']'
  + '[' '!' -f verify-apk/locally-built/normalized-names/base.apk ']'
  + unzip -l verify-apk/from-device/normalized-names/base.apk resources.arsc
  Archive:  verify-apk/from-device/normalized-names/base.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
    124232  1981-01-01 01:01   resources.arsc
  ---------                     -------
    124232                     1 file
  + lhs_contains_resources_exit_code=0
  + unzip -l verify-apk/locally-built/normalized-names/base.apk resources.arsc
  Archive:  verify-apk/locally-built/normalized-names/base.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
    124232  1981-01-01 01:01   resources.arsc
  ---------                     -------
    124232                     1 file
  + rhs_contains_resources_exit_code=0
  + '[' 0 -ne 0 ']'
  + '[' 0 -ne 0 ']'
  ++ /home/dannybuntu/Android/Sdk/build-tools/34.0.0/aapt2 diff verify-apk/from-device/normalized-names/base.apk verify-apk/locally-built/normalized-names/base.apk
  + aapt_difference=
  + aapt_diff_exit_status=0
  + '[' '' '!=' '' ']'
  + diff_result=1
  + for apk_file in $all_apk_files
  + '[' '!' -f verify-apk/from-device/normalized-names/en.apk ']'
  + '[' '!' -f verify-apk/locally-built/normalized-names/en.apk ']'
  + unzip -l verify-apk/from-device/normalized-names/en.apk resources.arsc
  Archive:  verify-apk/from-device/normalized-names/en.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
      48692  1981-01-01 01:01   resources.arsc
  ---------                     -------
      48692                     1 file
  + lhs_contains_resources_exit_code=0
  + unzip -l verify-apk/locally-built/normalized-names/en.apk resources.arsc
  Archive:  verify-apk/locally-built/normalized-names/en.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
      48692  1981-01-01 01:01   resources.arsc
  ---------                     -------
      48692                     1 file
  + rhs_contains_resources_exit_code=0
  + '[' 0 -ne 0 ']'
  + '[' 0 -ne 0 ']'
  ++ /home/dannybuntu/Android/Sdk/build-tools/34.0.0/aapt2 diff verify-apk/from-device/normalized-names/en.apk verify-apk/locally-built/normalized-names/en.apk
  + aapt_difference=
  + aapt_diff_exit_status=0
  + '[' '' '!=' '' ']'
  + diff_result=1
  + for apk_file in $all_apk_files
  + '[' '!' -f verify-apk/from-device/normalized-names/xxhdpi.apk ']'
  + '[' '!' -f verify-apk/locally-built/normalized-names/xxhdpi.apk ']'
  + unzip -l verify-apk/from-device/normalized-names/xxhdpi.apk resources.arsc
  Archive:  verify-apk/from-device/normalized-names/xxhdpi.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
      9852  1981-01-01 01:01   resources.arsc
  ---------                     -------
      9852                     1 file
  + lhs_contains_resources_exit_code=0
  + unzip -l verify-apk/locally-built/normalized-names/xxhdpi.apk resources.arsc
  Archive:  verify-apk/locally-built/normalized-names/xxhdpi.apk
    Length      Date    Time    Name
  ---------  ---------- -----   ----
      9852  1981-01-01 01:01   resources.arsc
  ---------                     -------
      9852                     1 file
  + rhs_contains_resources_exit_code=0
  + '[' 0 -ne 0 ']'
  + '[' 0 -ne 0 ']'
  ++ /home/dannybuntu/Android/Sdk/build-tools/34.0.0/aapt2 diff verify-apk/from-device/normalized-names/xxhdpi.apk verify-apk/locally-built/normalized-names/xxhdpi.apk
  + aapt_difference=
  + aapt_diff_exit_status=0
  + '[' '' '!=' '' ']'
  + diff_result=1
  + '[' 1 -eq 0 ']'
  + printf 'The builds are NOT identical!\n\n'
  The builds are NOT identical!

  + printf 'Found differences:\n\n'
  Found differences:

  + echo 'Binary files verify-apk/from-device/comparable/base/classes2.dex and verify-apk/locally-built/comparable/base/classes2.dex differ
  Binary files verify-apk/from-device/comparable/base/classes.dex and verify-apk/locally-built/comparable/base/classes.dex differ'
  Binary files verify-apk/from-device/comparable/base/classes2.dex and verify-apk/locally-built/comparable/base/classes2.dex differ
  Binary files verify-apk/from-device/comparable/base/classes.dex and verify-apk/locally-built/comparable/base/classes.dex differ
  + echo

  + exit 1

  ```

## Asciicast

{% include asciicast %}

## Diffoscope Results

{% include diffoscope-modal.html label='arm64_v8a.apk' url='/assets/diffoscope-results/android/world.bitkey.app/2025.1.1/diffo-arm64.html' %}

{% include diffoscope-modal.html label='base.apk' url='/assets/diffoscope-results/android/world.bitkey.app/2025.1.1/diffo-base.html' %}

{% include diffoscope-modal.html label='xxhdpi.apk' url='/assets/diffoscope-results/android/world.bitkey.app/2025.1.1/diffo-xxhdpi.html' %}

{% include diffoscope-modal.html label='en.apk' url='/assets/diffoscope-results/android/world.bitkey.app/2025.1.1/diffo-en.html' %}

## Analysis 

### diffo-arm64.apk - reproducible

- When comparing the arm64_v8a.apk files, we observe the following: 
  - Signing-related diffs: (stamp-cert-sha256, BNDLTOOL.SF, BNDLTOOL.RSA, MANIFEST.MF)
  - The expected 1 to 2 line difference in AndroidManifest.xml: 
    
    ```
    <meta-data·android:name="com.android.vending.derived.apk.id"·android:value="3"/>	 
	  </application>
    ```

### diffo-base.apk - non-reproducible

- In base.apk, we note: 
  - We note the minor diff in AndroidManifest.xml:

    ```
    android:requiredSplitTypes="base__abi,base__density"·android:splitTypes=""·
    ```
  - We observe `stamp-cert-sha256:·'8'`
  - The most significant diffs we observed in base.apk include those in classes.dex and classes2.dex
    - Checksum Differences
      - The checksum field in classes.dex and classes2.dex files are different.
      - This suggests that the contents of the DEX files are not identical.
    - Signature Differences
      - The signature field is also different, which is expected since the checksum differs.
      - The signature is a cryptographic hash of the file’s contents, so any change in the code or structure will alter it.
    - File Size Differences
      - The file_size of classes.dex in both builds has slight variations (e.g., 9819452 bytes vs. 9819444 bytes).
    - We take a deeper look into the diffs in classes2.dex with:

      ```
      $ unzip -j base.apk classes2.dex -d play-classes2.dex/
      $ unzip -j base.apk classes2.dex -d built-classes2.dex/
      $ dexdump -d play-classes2.dex/classes2.dex > play_classes2.txt
      $ dexdump -d built-classes2.dex/classes2.dex > built_classes2.txt
      $ diffoscope --html diffo-classes2.dex.html built_classes2.txt ../../from-device/normalized-names/play_classes2.txt
      ```
      We come up with the diffoscope results in [diffo-classes2.dex.html](../../assets/diffoscope-results/android/world.bitkey.app/2025.1.1/diffo-classes2.dex.html)
    
    - We also note some differences in splits0.xml:
      - `<entry·key="he"·split="config.he"/>`
      - `<entry·key="in"·split="config.in"/>` in from-device but in locally-built, it is `<entry·key="id"·split="config.id"/>`

### diffo-en.apk - reproducible

- In en.apk, we note:
  - We note signing-related differences, including stamp-cert-sha256
  - We note the minor diff in AndroidManifest.xml, present in from-device but not in locally-built:
    
    ```
    <meta-data·android:name="com.android.vending.derived.apk.id"·android:value="3"/>	 
	  ··</application>
    ```

- Using a different approach with `apktool`, we note that no differences are observed between the from-device and locally-built en.apk.

    ```
    $ apktool d en.apk -o en_decoded
    I: Using Apktool 2.7.0-dirty on en.apk
    I: Loading resource table...
    I: Decoding AndroidManifest.xml with resources...
    I: Loading resource table from file: /home/dannybuntu/.local/share/apktool/framework/1.apk
    I: Regular manifest package...
    I: Decoding file-resources...
    I: Decoding values */* XMLs...
    I: Copying assets and libs...
    I: Copying unknown files...
    I: Copying original files...
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk/locally-built/normalized-names$ cd ../../from-device/normalized-names/
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk/from-device/normalized-names$ apktool d en.apk -o en_decoded
    I: Using Apktool 2.7.0-dirty on en.apk
    I: Loading resource table...
    I: Decoding AndroidManifest.xml with resources...
    I: Loading resource table from file: /home/dannybuntu/.local/share/apktool/framework/1.apk
    I: Regular manifest package...
    I: Decoding file-resources...
    I: Decoding values */* XMLs...
    I: Copying assets and libs...
    I: Copying unknown files...
    I: Copying original files...
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk/from-device/normalized-names$ cd ../..
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk$ diff -r from-device/normalized-names/en_decoded/res locally-built/normalized-names/en_decoded/res
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk$
    ```

### diffo-xxhdpi.apk - reproducible

- In xxhdpi.apk, we note:
  - In AndroidManifest.xml, we see the expected diff:

    ```
    <meta-data·android:name="com.android.vending.derived.apk.id"·android:value="3"/>	 
	  ··</application>
    ```
  - We also observe the expected 'stamp-cert-sha256' difference.
  - Resources.arsc: 

    ```
    000012d0:·676c·6500·0202·1000·4802·0000·0800·0400··gle.....H.......	000012d0:·676c·6500·0202·1000·4802·0000·0800·0000··gle.....H.......
    ```
- Using another method with `apktool`, we note that no differences are observed between the from-device and locally-built xxhdpi.apk not seen by using diffoscope.

    ```
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk$ apktool d from-device/normalized-names/xxhdpi.apk -o from-device/normalized-names/xxhdpi_decoded
    I: Using Apktool 2.7.0-dirty on xxhdpi.apk
    I: Loading resource table...
    I: Decoding AndroidManifest.xml with resources...
    I: Loading resource table from file: /home/dannybuntu/.local/share/apktool/framework/1.apk
    I: Regular manifest package...
    I: Decoding file-resources...
    I: Decoding values */* XMLs...
    I: Copying assets and libs...
    I: Copying unknown files...
    I: Copying original files...
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk$ apktool d locally-built/normalized-names/xxhdpi.apk -o locally-built/normalized-names/xxhdpi_decoded
    I: Using Apktool 2.7.0-dirty on xxhdpi.apk
    I: Loading resource table...
    I: Decoding AndroidManifest.xml with resources...
    I: Loading resource table from file: /home/dannybuntu/.local/share/apktool/framework/1.apk
    I: Regular manifest package...
    I: Decoding file-resources...
    I: Decoding values */* XMLs...
    I: Copying assets and libs...
    I: Copying unknown files...
    I: Copying original files...
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk$ diff -r from-device/normalized-names/xxhdpi_decoded/ locally-built/normalized-names/xxhdpi_decoded/
    diff -r from-device/normalized-names/xxhdpi_decoded/AndroidManifest.xml locally-built/normalized-names/xxhdpi_decoded/AndroidManifest.xml
    1,4c1,2
    < <?xml version="1.0" encoding="utf-8" standalone="no"?><manifest xmlns:android="http://schemas.android.com/apk/res/android" android:splitTypes="base__density" package="world.bitkey.app" split="config.xxhdpi">
    <     <application android:extractNativeLibs="false" android:hasCode="false">
    <         <meta-data android:name="com.android.vending.derived.apk.id" android:value="3"/>
    <     </application>
    ---
    > <?xml version="1.0" encoding="utf-8" standalone="no"?><manifest xmlns:android="http://schemas.android.com/apk/res/android" package="world.bitkey.app" split="config.xxhdpi">
    >     <application android:extractNativeLibs="false" android:hasCode="false"/>
    diff -r from-device/normalized-names/xxhdpi_decoded/apktool.yml locally-built/normalized-names/xxhdpi_decoded/apktool.yml
    14,15c14
    < unknownFiles:
    <   stamp-cert-sha256: '8'
    ---
    > unknownFiles: {}
    Binary files from-device/normalized-names/xxhdpi_decoded/original/AndroidManifest.xml and locally-built/normalized-names/xxhdpi_decoded/original/AndroidManifest.xml differ
    Only in from-device/normalized-names/xxhdpi_decoded/original: META-INF
    Only in from-device/normalized-names/xxhdpi_decoded/original: stamp-cert-sha256
    Only in from-device/normalized-names/xxhdpi_decoded/: unknown
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk$ diff -r from-device/normalized-names/xxhdpi_decoded/res locally-built/normalized-names/xxhdpi_decoded/res
    dannybuntu@MS-7978:~/work/builds/world.bitkey.app/2025.1.1/bitkey/verify-apk$
    ```

## Conclusion

- We combined two approaches to verify the build:
  - The approach based on bitkey's own script 
  - The approach based on `apktool` and `diffoscope`
  - We observe that bitkey's script's output indicated the main difference between classes.dex and classes2.dex.
  - Expected diffs are found in AndroidManifest.xml, stamp-cert-sha256, and resources.arsc. 
  - 3 of the split apks have minor diffs that qualify each to be reproducible: xxhdpi.apk, en.apk, and arm64_v8a.apk. 
  - However, the diffs in base.apk, which is the main apk, are more significant and thus not reproducible.

In summation, both the bitkey approach and ours come to an agreement that version 2025.1.1 is **not verifiable**

Standard procedure states that an issue must be filed with the provider in the relevant repository. However, Bitkey's repository has its 'Issues' tab hidden, and thus we cannot post it there. 

We are posting the [issue in our own repository](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/647) instead.
