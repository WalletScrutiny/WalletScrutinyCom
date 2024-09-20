---
wsId: 
title: Komodo Mobile Crypto Wallet
altTitle: 
authors:
- danny
- leo
- keraliss
users: 10000
appId: com.komodoplatform.atomicdex
appCountry: 
released: 2022-12-15
updated: 2024-07-02  
version: 0.9.2
stars: 3.9
ratings: 
reviews: 9
size: 
website: https://atomicdex.io
repository: https://github.com/KomodoPlatform/komodo-wallet-mobile
issue: https://github.com/KomodoPlatform/komodo-wallet-mobile/issues/116
icon: com.komodoplatform.atomicdex.png
bugbounty: 
meta: ok
verdict: nosource
date: 2024-08-30
signer: cb9c6d9f6b0d981e24b771cbe946ae32af09e71de174a2d39756161b481d94b3
reviewArchive: 
- date: 2024-08-03
  version: 0.9.1
  appHash: 
  gitRevision: 6ae7c72d480ca51b583f6b18d05516226e30f5a4
  verdict: nonverifiable
twitter: KomodoPlatform
social:
- https://discord.com/invite/3rzDPAr
- https://www.reddit.com/r/komodoplatform
- https://t.me/KomodoPlatform_Official
redirect_from: 
developerName: Komodo Platform
features: 

---
**Update 2024-08-30:**

## Version Unavailable: 
We were testing the Komodo Wallet APK version 0.9.2, but the source code is currently not available. Please open an issue with the provider regarding this matter. We will close the merge request for now and revisit it once the source code is available.

**Review: Komodo Wallet 0.9.0 APK Build**

We attempted to build the Komodo Wallet APK using the instructions provided in the repository. The build process requires running a Dockerfile that utilizes the `fetch_coins.sh` script to fetch necessary coin data files. Unfortunately, we encountered an issue due to the absence of required files, such as `coins_config.json`, which the script depends on.

**Command Used:**
```bash
docker build -t komodo-wallet .
```

**Error Encountered:**
The build process encountered the following error when attempting to execute `fetch_coins.sh`:
```
Error: 'assets/coins_config.json' file not found.
```

This error occurs because the `fetch_coins.sh` script expects the `assets/coins_config.json` file to be present in the repository. Since this file is missing, the script cannot fetch or verify the required coin data, resulting in a build failure.

We also tried to run the build without using the `fetch_coins.sh` script, which led to another error:

```
FAILURE: Build failed with an exception.

* What went wrong:
Execution failed for task ':app:buildCMakeRelWithDebInfo[arm64-v8a]'.
> Build command failed.
  Error while executing process /usr/local/android-sdk/cmake/3.18.1/bin/ninja with arguments {-C /home/atomicdex_mobile/android/app/.cxx/RelWithDebInfo/2q2p4k6a/arm64-v8a mm2-lib}
  ninja: Entering directory '/home/atomicdex_mobile/android/app/.cxx/RelWithDebInfo/2q2p4k6a/arm64-v8a'
  
  ninja: error: '/home/atomicdex_mobile/android/app/src/main/cpp/libs/arm64-v8a/libmm2.a', needed by '/home/atomicdex_mobile/build/app/intermediates/cxx/RelWithDebInfo/2q2p4k6a/obj/arm64-v8a/libmm2-lib.so', missing and no known rule to make it

* Try:
> Run with --stacktrace option to get the stack trace.
> Run with --info or --debug option to get more log output.
> Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 4m 42s
```

The error indicates that the `libmm2.a` library file is missing from the path `/home/atomicdex_mobile/android/app/src/main/cpp/libs/arm64-v8a/`, and there are no rules to make it, causing the build to fail.

**Conclusion:**

The Komodo Wallet APK build was not successful, and since the source code for version 0.9.2 is not available, we conclude that there is no source code available for verification, making the wallet not verifiable.

## Reproducibility

 The source code for this wallet contained a [README with instructions](https://github.com/KomodoPlatform/komodo-wallet-mobile/wiki/Project-Setup#build-and-run) on how to verify and what dependencies were required, so using the information from these steps, we created a dockerfile for the use of our {% include testScript.html %}. 

 - [Dockerfile](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/81b1f718a4b07edc4c6e84c819eb72a12acf3e28/scripts/test/android/com.komodoplatform.atomicdex.dockerfile)
 - [Atomic Dex Build Script](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/81b1f718a4b07edc4c6e84c819eb72a12acf3e28/scripts/test/android/com.komodoplatform.atomicdex.sh)

 After the proper environment is set up, our script will generate an AAB (Android App Bundle) from which we can use *bundletool* to create APKs suitable for various device configurations and perform further verifications.

## App Description from Google Play

> AtomicDEX Mobile offers the widest permission-less cross-chain trading support of any mobile crypto app on the market.
>
> It’s a fast and secure multi-coin wallet with peer-to-peer (P2P) DEX support, designed for ease of use and perfect for storing digital assets.
>
> The app provides a secure and easy way to buy and store multiple cryptocurrencies. It supports dozens of blockchain protocols natively such as Bitcoin, BNB Chain, Ethereum, Polygon, Litecoin, Dogecoin, and many more.

## Analysis

- Once installed, we are informed that we are beta-testers.
- We created a wallet and were given a 12-word seed phrase. 
- There is a legacy BTC address with send and receive functions. 
- There in an option to back up the private keys.
- The developers [claim](https://atomicdex.io/en/blog/q1-2023-progress-report/#atomicdex-mobile-goes-100-open-source) they are 100% Open Source.
- We found the [repository](https://github.com/KomodoPlatform/komodo-wallet-mobile) for the mobile app.
- This app is **[for verification](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/490)**.

## Build Information

{% include asciicast %}

Running our initial tests using test.sh on `com.komodoplatform.atomicdex_v105.apk`, the dockerfile above, and the com.komodoplatform.atomicdex script, we get the following results:

```
===== Begin Results =====
appId:          com.komodoplatform.atomicdex
signer:         cb9c6d9f6b0d981e24b771cbe946ae32af09e71de174a2d39756161b481d94b3
apkVersionName: 0.9.1
apkVersionCode: 105
verdict:        
appHash:        e1a99f4bb5a80153a68e184d5bebdabd044c325478a182dcd938494ac3bac3ff
commit:         69d98b2a2856f0b8983b373e79ff829ffef0c0b2

Diff:
Files /tmp/fromPlay_com.komodoplatform.atomicdex_105/AndroidManifest.xml and /tmp/fromBuild_com.komodoplatform.atomicdex_105/AndroidManifest.xml differ
Files /tmp/fromPlay_com.komodoplatform.atomicdex_105/assets/flutter_assets/AssetManifest.json and /tmp/fromBuild_com.komodoplatform.atomicdex_105/assets/flutter_assets/AssetManifest.json differ
Only in /tmp/fromBuild_com.komodoplatform.atomicdex_105/assets/flutter_assets/assets: coins_config.json
Files /tmp/fromPlay_com.komodoplatform.atomicdex_105/assets/flutter_assets/assets/coins.json and /tmp/fromBuild_com.komodoplatform.atomicdex_105/assets/flutter_assets/assets/coins.json differ
Files /tmp/fromPlay_com.komodoplatform.atomicdex_105/assets/flutter_assets/NOTICES.Z and /tmp/fromBuild_com.komodoplatform.atomicdex_105/assets/flutter_assets/NOTICES.Z differ
Files /tmp/fromPlay_com.komodoplatform.atomicdex_105/classes2.dex and /tmp/fromBuild_com.komodoplatform.atomicdex_105/classes2.dex differ
Files /tmp/fromPlay_com.komodoplatform.atomicdex_105/classes.dex and /tmp/fromBuild_com.komodoplatform.atomicdex_105/classes.dex differ
Files /tmp/fromPlay_com.komodoplatform.atomicdex_105/resources.arsc and /tmp/fromBuild_com.komodoplatform.atomicdex_105/resources.arsc differ
Only in /tmp/fromPlay_com.komodoplatform.atomicdex_105: stamp-cert-sha256

Revision, tag (and its signature):
object 69d98b2a2856f0b8983b373e79ff829ffef0c0b2
type commit
tag v0.9.1
tagger CharlVS <77973576+CharlVS@users.noreply.github.com> 1715788130 +0200

v0.9.1 release
===== End Results =====
```

## Links to diffoscope results in the diffs

1. [AndroidManifest.xml](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-universal-apk/diffoscope.com.komodoplatform_105_AndroidManifest.xml.html)
2. [AssetManifest.json](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-universal-apk/diffoscope.com.komodoplatform_105_AssetManifest.json.html)
3. [classes.dex](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-universal-apk/diffoscope.com.komodoplatform_105_classes.dex.html)
4. [classes2.dex](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-universal-apk/diffoscope.com.komodoplatform_105_classes2.dex.html)
5. [coins.json](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-universal-apk/diffoscope.com.komodoplatform_105_coins.json.html)
6. [NOTICES.Z](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-universal-apk/diffoscope.com.komodoplatform_105_NOTICES.Z.html)
7. [resources.arsc](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-universal-apk/diffoscope.com.komodoplatform_105_resources.arsc.html)

## Links to diffoscope results on the split apks

1. [armeabi_v7a.apk](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-split-apks/armeabi_v7a.html) 
2. [base.apk](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-split-apks/base.html)
3. [en.apk](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-split-apks/en.html)
4. [xhdpi.apk](https://xrviv.github.io/walletScrutinyBuildCasts/www/diffoscope-results/android/com.komodoplatform.atomicdex/105/diffo-split-apks/xhdpi.html)

We could not consider the diffs of version 0.9.1 as benign as there are far too many differences. 
We [updated the relevant issue](https://github.com/KomodoPlatform/komodo-wallet-mobile/issues/116#issuecomment-2266635605) in the repository of komodoplatform.atomicdex, and eagerly await their collaboration to make the build reproducible.
Version 0.9.1 of this app is **not-verifiable** 
