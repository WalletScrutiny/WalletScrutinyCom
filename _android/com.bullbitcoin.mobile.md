---
wsId: 
title: Bull Bitcoin (Beta)
altTitle: 
authors:
- danny
users: 1000
appId: com.bullbitcoin.mobile
appCountry: 
released: 2023-10-31
updated: 2024-09-14
version: 0.3.2
stars: 
ratings: 
reviews: 
size: 
website: http://bullbitcoin.com
repository: https://github.com/SatoshiPortal/bullbitcoin-mobile
issue: https://github.com/SatoshiPortal/bullbitcoin-mobile/issues/326
icon: com.bullbitcoin.mobile.png
bugbounty: 
meta: ok
date: 2024-09-24
signer:
reviewCurrent:
  date: 2024-09-24
  version: 0.3.2
  appHashes: []
  verdict: nonverifiable
reviewArchive: 
twitter: bullbitcoin_
social:
- https://www.facebook.com/bullbitcoindotcom
- https://t.me/bullbitcoinofficial
- https://www.linkedin.com/company/bull-bitcoin
redirect_from: 
developerName: Bull Bitcoin
features: 

---

# Verification 2024-09-24

1. We begin by looking for the build instructions. At the time of writing, the Bull Bitcoin team has indicated that they [would be providing](https://github.com/SatoshiPortal/bullbitcoin-mobile/issues/326#issuecomment-2363816854) a BUILD.md file in later releases.

2. [Dockerfile version 0.3.2](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/c1ec6e8920ce5af8d4cacb9d1eb40001fc84e49d/scripts/test/android/com.bullbitcoin.android.dockerfile) was crafted that would enable building the split apks. 

3. We use the [apkextractor_sync.sh](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/master/apkextractor_sync.sh?ref_type=heads) file to extract the split apks from our USB-connected phone.

4. After several tries, we successfully built and copied the split apks to our host machine.

## Diff results 

```
danny@lw10:~/work/compare/com.bullbitcoin.mobile/0.3.2$ diff -r -q fromOfficial/ fromBuild/
Files fromOfficial/armeabi_v7a/AndroidManifest.xml and fromBuild/armeabi_v7a/AndroidManifest.xml differ
Files fromOfficial/armeabi_v7a/lib/armeabi-v7a/libapp.so and fromBuild/armeabi_v7a/lib/armeabi-v7a/libapp.so differ
Files fromOfficial/armeabi_v7a/lib/armeabi-v7a/libboltz_dart.so and fromBuild/armeabi_v7a/lib/armeabi-v7a/libboltz_dart.so differ
Files fromOfficial/armeabi_v7a/lib/armeabi-v7a/libflutter.so and fromBuild/armeabi_v7a/lib/armeabi-v7a/libflutter.so differ
Files fromOfficial/armeabi_v7a/lib/armeabi-v7a/liblwk_dart.so and fromBuild/armeabi_v7a/lib/armeabi-v7a/liblwk_dart.so differ
Only in fromOfficial/armeabi_v7a: META-INF
Only in fromOfficial/armeabi_v7a: stamp-cert-sha256
Files fromOfficial/armeabi_v7a.apk and fromBuild/armeabi_v7a.apk differ
Files fromOfficial/base/AndroidManifest.xml and fromBuild/base/AndroidManifest.xml differ
Files fromOfficial/base/assets/flutter_assets/NOTICES.Z and fromBuild/base/assets/flutter_assets/NOTICES.Z differ
Only in fromOfficial/base/META-INF: BNDLTOOL.RSA
Only in fromOfficial/base/META-INF: BNDLTOOL.SF
Only in fromOfficial/base/META-INF: MANIFEST.MF
Files fromOfficial/base/res/xml/splits0.xml and fromBuild/base/res/xml/splits0.xml differ
Files fromOfficial/base/resources.arsc and fromBuild/base/resources.arsc differ
Only in fromOfficial/base: stamp-cert-sha256
Files fromOfficial/base.apk and fromBuild/base.apk differ
Files fromOfficial/en/AndroidManifest.xml and fromBuild/en/AndroidManifest.xml differ
Only in fromOfficial/en: META-INF
Files fromOfficial/en/resources.arsc and fromBuild/en/resources.arsc differ
Only in fromOfficial/en: stamp-cert-sha256
Files fromOfficial/en.apk and fromBuild/en.apk differ
Files fromOfficial/xhdpi/AndroidManifest.xml and fromBuild/xhdpi/AndroidManifest.xml differ
Only in fromOfficial/xhdpi: META-INF
Files fromOfficial/xhdpi/resources.arsc and fromBuild/xhdpi/resources.arsc differ
Only in fromOfficial/xhdpi: stamp-cert-sha256
Files fromOfficial/xhdpi.apk and fromBuild/xhdpi.apk differ
```

## Asciicast 

{% include asciicast %}

## Diffoscope results

We ran diffoscope on the apks, but the diffs reached more than 200,000 lines and more than 300 MB. This caused nosbin.com to error. Suffice to say, the diffs are large enough to merit this beta version 0.3.2, a verdict of **non-verifiable**

# Previous Review 2024-08-30

## App Description from Google Play

> Bull Bitcoin Mobile is a self-custodial Bitcoin and Liquid Network which offers non-custodial atomic swaps across Bitcoin, Lightning and Liquid.

### General features

> - Non-custodial: private keys are generated on the device, and never leave the device.
> - Multiple wallets can be created. Users can switch easily from one wallet to the other on the wallet homepage.
> - Walets with BIP39 passphrases can be created.
> - Amounts can be viewed as Bitcoin or Sats.
> - Users can enable RBF for each transaction.
> - Users can send the full wallet balance (sweep a wallet).

## Analysis

1. We were given the 12-word phrase during the wallet creation stage

2. The app has lightning, Bitcoin and liquid wallets.


