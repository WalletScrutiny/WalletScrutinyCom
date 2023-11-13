---
wsId: 
title: 'BitBanana: Bitcoin & Lightning'
altTitle: 
authors:
- danny 
users: 1000
appId: app.michaelwuensch.bitbanana
appCountry: 
released: 2023-03-26
updated: 2023-09-27
version: 0.6.7
stars: 
ratings: 
reviews: 
size: 
website: https://bitbanana.app/
repository: https://github.com/michaelWuensch/BitBanana
issue: https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/512
icon: app.michaelwuensch.bitbanana.png
bugbounty: 
meta: ok
verdict: reproducible
date: 2023-11-01
signer: 59034f46ae31a6989793d91cadc334425342c2724153126ed5f7e212cad6ba1f
reviewArchive: 
twitter: BitBananaApp
social:
- https://discord.gg/Xg85BuTc9A
- https://snort.social/p/npub1dwn7wphjhrlej6ks4sktgn77w82ayq6hn6lj37ll75tav55nd3vq07xzaj 
redirect_from: 
developerName: Michael Wünsch
features: 

---

## App Description from Google Play

This is a fork of {% include walletLink.html wallet='android/zapsolutions.zap' verdict='true' %}

> BitBanana is a native android app for node operators focused on user experience and ease of use. While it is not a wallet on its own, BitBanana works like a remote control allowing you to use your node as a wallet wherever you go. The app is designed with an educational approach, providing the user with guidance on every aspect of node operation.

## Analysis

The user initializes by connecting to a bitcoin lightning node. Once connected to a node, features such as backup, restore and other wallet features such as send and receive are made available. 


## Procedure 

To reproduce BitBanana, we follow the instructions in this [page.](https://github.com/michaelWuensch/BitBanana/blob/master/docs/REPRODUCE.md)  

Note: Some dependencies may need to be downloaded and installed.

```
── /usr/lib/android-sdk/build-tools/debian/apksigner verify --verbose --print-certs {}
│┄ error from `/usr/lib/android-sdk/build-tools/debian/apksigner verify --verbose --print-certs {}` (a):
│┄ DOES NOT VERIFY
│┄ ERROR: Missing META-INF/MANIFEST.MF
│ @@ -0,0 +1,16 @@
│ +Verifies
│ +Verified using v1 scheme (JAR signing): false
│ +Verified using v2 scheme (APK Signature Scheme v2): true
│ +Verified using v3 scheme (APK Signature Scheme v3): false
│ +Verified using v4 scheme (APK Signature Scheme v4): false
│ +Verified for SourceStamp: false
│ +Number of signers: 1
│ +Signer #1 certificate DN: C=DE, ST=Baden-Württemberg, L=Stuttgart, CN=Michael Wünsch
│ +Signer #1 certificate SHA-256 digest: 59034f46ae31a6989793d91cadc334425342c2724153126ed5f7e212cad6ba1f
│ +Signer #1 certificate SHA-1 digest: ecf374ea2620db48bff52f65358d34ff44a3fd06
│ +Signer #1 certificate MD5 digest: d76d2b2dc59bc5071ff910bbe1026328
│ +Signer #1 key algorithm: RSA
│ +Signer #1 key size (bits): 2048
│ +Signer #1 public key SHA-256 digest: 0eacb57084b170288e8e6290bc2153e74f8ab942b875f2d0b771ade92ab66120
│ +Signer #1 public key SHA-1 digest: 976ab41d2cac35119d0a654bb9e12729f61168c2
│ +Signer #1 public key MD5 digest: f2d5d855d79da92a383207963bdec1e9
├── zipinfo {}
│ @@ -1,8 +1,8 @@
│ -Zip file size: 30019749 bytes, number of entries: 2725
│ +Zip file size: 30032037 bytes, number of entries: 2725
│  -rw-r--r--  0.0 unx       56 b- defN 81-Jan-01 01:01 META-INF/com/android/build/gradle/app-metadata.properties
│  -rw-r--r--  0.0 unx     2048 b- stor 81-Jan-01 01:01 assets/dexopt/baseline.prof
│  -rw-r--r--  0.0 unx      210 b- stor 81-Jan-01 01:01 assets/dexopt/baseline.profm
│  -rw-r--r--  0.0 unx  7600304 b- defN 81-Jan-01 01:01 classes.dex
│  -rw-r--r--  0.0 unx  6526080 b- defN 81-Jan-01 01:01 classes2.dex
│  -rw-r--r--  0.0 unx  8900692 b- defN 81-Jan-01 01:01 classes3.dex
│  -rw-r--r--  0.0 unx  6665488 b- defN 81-Jan-01 01:01 lib/arm64-v8a/libTor.so
```

The apks that were compared were of the built apk and the apk provided in the GitHub release.

This is a [pastebin](https://pastebin.com/GJfwy9gi) of the entire diffoscope output.

Leo has this assessment:

> 1. APK signing block: one has a signature and the other does not - as expected
> 2. Apksigner provides further details. Official was signed using version 2 scheme. Built APK produced an error as it's not signed.
> 3. Zipinfo finds that the official is bigger than the built. No surprise as the former contains a signature.
>
> Absent further diffs, the app was reproduced successfully.