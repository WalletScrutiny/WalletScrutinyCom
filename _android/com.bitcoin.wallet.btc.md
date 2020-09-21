---
title: "Bitcoin Wallet Blockchain"
altTitle: 

users: 50000
appId: com.bitcoin.wallet.btc
launchDate: 2019-05-01
latestUpdate: 2020-06-15
apkVersionName: "1.9.4"
stars: 4.3
ratings: 282
reviews: 101
size: 8.2M
website: https://bitcoin-wallet.flycricket.io/
repository: https://github.com/hoanghiephui/Bitcoin-Wallet
issue: https://github.com/hoanghiephui/Bitcoin-Wallet/issues/15
icon: com.bitcoin.wallet.btc.png
bugbounty: 
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2019-11-23
reviewStale: true
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /bitcoinblockchainwallet/
  - /com.bitcoin.wallet.btc/
  - /posts/2019/11/bitcoinblockchainwallet/
  - /posts/com.bitcoin.wallet.btc/
---


The first lines of their description on Google Play are promising:

> Bitcoin Wallet is the cold wallet, it is the safest, and open source, for send and receive Bitcoin.
Bitcoin Wallet is decentralized and peer-to-peer. There is no server that would hold any of your private data.

So ... let's have a look ...

```
$ git clone git@github.com:hoanghiephui/Bitcoin-Wallet.git
$ cd Bitcoin-Wallet/
$ git tag
v1.0
v1.0.0
v1.0.1
v1.0.2
```

We are looking for 1.8.1 ...

```
$ git blame mobile/build.gradle | grep versionName
c58c8ae1 (Hoang Hiep 2019-11-09 19:56:16 +0700  17)         versionName "1.8.1"
a8218de3 (Hoang Hiep 2019-07-04 17:26:48 +0700  84)             versionName = '1.0'
```

Ok, we will try revision `c58c8ae1`:

```
$ git checkout c58c8ae1
$ ./gradlew clean build
```

although the build fails, it does build two APKs, one of which seams to be the
correct one under `Bitcoin-Wallet/mobile/build/outputs/apk/orginal/release`.

Running diff doesn't look too well though:

<div class="language-plaintext highlighter-rouge">
<div class="highlight">
<pre class="highlight">$ diffoscope mobile-orginal-release.apk &quot;Bitcoin Wallet 1.8.1 (com.bitcoin.wallet.btc).apk&quot;
--- mobile-orginal-release.apk
+++ Bitcoin Wallet 1.8.1 (com.bitcoin.wallet.btc).apk
├── zipinfo /dev/stdin
│ <font color="#06989A">@@ -1,1434 +1,1077 @@</font>
│ <font color="#CC0000">-Zip file size: 7782052 bytes, number of entries: 1432</font>
│ <font color="#CC0000">--rw----     2.0 fat    23304 bx defN 80-000-00 00:00 AndroidManifest.xml</font>
│ <font color="#CC0000">--rw----     2.4 fat      784 b- defN 80-000-00 00:00 META-INF/CERT.RSA</font>
│ <font color="#CC0000">--rw----     2.4 fat   170670 b- defN 80-000-00 00:00 META-INF/CERT.SF</font>
│ <font color="#CC0000">--rw----     2.4 fat   170608 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF</font>
│ <font color="#CC0000">--rw----     2.0 fat     1070 bx defN 70-Jan-01 00:00 META-INF/core-ktx_release.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat      220 bx defN 70-Jan-01 00:00 META-INF/jvm.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       16 bx defN 70-Jan-01 00:00 META-INF/kotlin-android-extensions-runtime.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat      186 bx defN 70-Jan-01 00:00 META-INF/kotlin-stdlib-common-coroutines.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat     1339 bx defN 70-Jan-01 00:00 META-INF/kotlin-stdlib-common.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat      381 bx defN 70-Jan-01 00:00 META-INF/kotlin-stdlib-coroutines.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       59 bx defN 70-Jan-01 00:00 META-INF/kotlin-stdlib-jdk7.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat      260 bx defN 70-Jan-01 00:00 META-INF/kotlin-stdlib-jdk8.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat     3727 bx defN 70-Jan-01 00:00 META-INF/kotlin-stdlib.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       97 bx defN 70-Jan-01 00:00 META-INF/kotlinx-coroutines-android.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat      958 bx defN 70-Jan-01 00:00 META-INF/kotlinx-coroutines-core-common.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat     1445 bx defN 70-Jan-01 00:00 META-INF/kotlinx-coroutines-core.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat      291 bx defN 70-Jan-01 00:00 META-INF/mobile_orginalRelease.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat      166 bx defN 70-Jan-01 00:00 META-INF/okhttp.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       67 bx defN 70-Jan-01 00:00 META-INF/paging-common-ktx.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       52 bx defN 70-Jan-01 00:00 META-INF/paging-runtime-ktx_release.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       47 bx defN 70-Jan-01 00:00 META-INF/retrofit.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       53 bx defN 70-Jan-01 00:00 META-INF/services/kotlinx.coroutines.CoroutineExceptionHandler</font>
│ <font color="#CC0000">--rw----     2.0 fat       52 bx defN 70-Jan-01 00:00 META-INF/services/kotlinx.coroutines.internal.MainDispatcherFactory</font>
│ <font color="#CC0000">--rw----     2.0 fat      119 bx defN 70-Jan-01 00:00 META-INF/work-runtime-ktx_release.kotlin_module</font>
│ <font color="#CC0000">--rw----     2.0 fat       53 bx defN 70-Jan-01 00:00 androidsupportmultidexversion.txt</font>
│ <font color="#4E9A06">+Zip file size: 5932112 bytes, number of entries: 1075</font>
│ <font color="#4E9A06">+-rw----     0.0 fat    23968 b- defN 80-000-00 00:00 AndroidManifest.xml</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     2180 b- defN 80-000-00 00:00 META-INF/CERT.RSA</font>
│ <font color="#4E9A06">+-rw----     2.4 fat   124638 b- defN 80-000-00 00:00 META-INF/CERT.SF</font>
│ <font color="#4E9A06">+-rw----     2.4 fat   124560 b- defN 80-000-00 00:00 META-INF/MANIFEST.MF</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     1070 b- defN 80-000-00 00:00 META-INF/core-ktx_release.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      220 b- defN 80-000-00 00:00 META-INF/jvm.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       16 b- defN 80-000-00 00:00 META-INF/kotlin-android-extensions-runtime.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      186 b- defN 80-000-00 00:00 META-INF/kotlin-stdlib-common-coroutines.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     1339 b- defN 80-000-00 00:00 META-INF/kotlin-stdlib-common.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      381 b- defN 80-000-00 00:00 META-INF/kotlin-stdlib-coroutines.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       59 b- defN 80-000-00 00:00 META-INF/kotlin-stdlib-jdk7.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      260 b- defN 80-000-00 00:00 META-INF/kotlin-stdlib-jdk8.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     3727 b- defN 80-000-00 00:00 META-INF/kotlin-stdlib.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       97 b- defN 80-000-00 00:00 META-INF/kotlinx-coroutines-android.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      958 b- defN 80-000-00 00:00 META-INF/kotlinx-coroutines-core-common.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat     1445 b- defN 80-000-00 00:00 META-INF/kotlinx-coroutines-core.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      291 b- defN 80-000-00 00:00 META-INF/mobile_orginalRelease.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      166 b- defN 80-000-00 00:00 META-INF/okhttp.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       67 b- defN 80-000-00 00:00 META-INF/paging-common-ktx.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       52 b- defN 80-000-00 00:00 META-INF/paging-runtime-ktx_release.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       47 b- defN 80-000-00 00:00 META-INF/retrofit.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       53 b- defN 80-000-00 00:00 META-INF/services/kotlinx.coroutines.CoroutineExceptionHandler</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       52 b- defN 80-000-00 00:00 META-INF/services/kotlinx.coroutines.internal.MainDispatcherFactory</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      119 b- defN 80-000-00 00:00 META-INF/work-runtime-ktx_release.kotlin_module</font>
│ <font color="#4E9A06">+-rw----     2.4 fat       53 b- stor 80-000-00 00:00 androidsupportmultidexversion.txt</font>
│  -rw----     2.4 fat    13116 b- defN 80-000-00 00:00 assets/bip39.txt
│  -rw----     2.4 fat   101159 b- defN 80-000-00 00:00 assets/checkpoints-testnet.txt
│  -rw----     2.4 fat    38207 b- defN 80-000-00 00:00 assets/checkpoints.txt
│ <font color="#CC0000">--rw----     2.4 fat      351 b- defN 80-000-00 00:00 assets/crashlytics-build.properties</font>
│ <font color="#4E9A06">+-rw----     2.4 fat      350 b- defN 80-000-00 00:00 assets/crashlytics-build.properties</font>
│  -rw----     2.4 fat      324 b- defN 80-000-00 00:00 assets/electrum-servers.txt
│  -rw----     2.4 fat       41 b- defN 80-000-00 00:00 assets/fees-testnet.txt
│  -rw----     2.4 fat       94 b- defN 80-000-00 00:00 assets/fees.txt
│  -rw----     2.4 fat    24753 b- defN 80-000-00 00:00 assets/index.html
│  -rw----     2.4 fat  7216044 b- defN 80-000-00 00:00 classes.dex
│  -rw----     2.4 fat  3886844 b- defN 80-000-00 00:00 classes2.dex
│ <font color="#CC0000">--rw----     2.0 fat      100 bx defN 70-Jan-01 00:00 fabric/com.crashlytics.sdk.android.answers.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       98 bx defN 70-Jan-01 00:00 fabric/com.crashlytics.sdk.android.beta.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat      109 bx defN 70-Jan-01 00:00 fabric/com.crashlytics.sdk.android.crashlytics-core.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat      105 bx defN 70-Jan-01 00:00 fabric/com.crashlytics.sdk.android.crashlytics.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat      682 bx defN 70-Jan-01 00:00 fabric/io.fabric.sdk.android.fabric.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       74 bx defN 70-Jan-01 00:00 firebase-analytics.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       68 bx defN 70-Jan-01 00:00 firebase-common.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       64 bx defN 70-Jan-01 00:00 firebase-core.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       66 bx defN 70-Jan-01 00:00 firebase-crash.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       78 bx defN 70-Jan-01 00:00 firebase-iid-interop.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       62 bx defN 70-Jan-01 00:00 firebase-iid.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       98 bx defN 70-Jan-01 00:00 firebase-measurement-connector.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat      204 bx defN 70-Jan-01 00:00 kotlin/ArithmeticException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      135 bx defN 70-Jan-01 00:00 kotlin/AssertionError.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      443 bx defN 70-Jan-01 00:00 kotlin/BuilderInference.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      153 bx defN 70-Jan-01 00:00 kotlin/ClassCastException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      154 bx defN 70-Jan-01 00:00 kotlin/Comparator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      442 bx defN 70-Jan-01 00:00 kotlin/ConcurrentModificationException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      172 bx defN 70-Jan-01 00:00 kotlin/Error.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      176 bx defN 70-Jan-01 00:00 kotlin/Exception.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      467 bx defN 70-Jan-01 00:00 kotlin/Experimental.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      584 bx defN 70-Jan-01 00:00 kotlin/ExperimentalMultiplatform.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      663 bx defN 70-Jan-01 00:00 kotlin/ExperimentalStdlibApi.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      627 bx defN 70-Jan-01 00:00 kotlin/ExperimentalUnsignedTypes.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      188 bx defN 70-Jan-01 00:00 kotlin/HashCodeKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      217 bx defN 70-Jan-01 00:00 kotlin/IllegalArgumentException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      214 bx defN 70-Jan-01 00:00 kotlin/IllegalStateException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      160 bx defN 70-Jan-01 00:00 kotlin/IndexOutOfBoundsException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      262 bx defN 70-Jan-01 00:00 kotlin/InitializedLazyImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1146 bx defN 70-Jan-01 00:00 kotlin/KotlinHKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      610 bx defN 70-Jan-01 00:00 kotlin/KotlinVersion.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      224 bx defN 70-Jan-01 00:00 kotlin/LateinitKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      155 bx defN 70-Jan-01 00:00 kotlin/Lazy.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      262 bx defN 70-Jan-01 00:00 kotlin/LazyKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      155 bx defN 70-Jan-01 00:00 kotlin/LazyThreadSafetyMode.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      157 bx defN 70-Jan-01 00:00 kotlin/NoSuchElementException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      384 bx defN 70-Jan-01 00:00 kotlin/NoWhenBranchMatchedException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      134 bx defN 70-Jan-01 00:00 kotlin/NotImplementedError.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      155 bx defN 70-Jan-01 00:00 kotlin/NullPointerException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      164 bx defN 70-Jan-01 00:00 kotlin/NumberFormatException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1323 bx defN 70-Jan-01 00:00 kotlin/NumbersKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      354 bx defN 70-Jan-01 00:00 kotlin/OptionalExpectation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      402 bx defN 70-Jan-01 00:00 kotlin/Pair.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      613 bx defN 70-Jan-01 00:00 kotlin/PreconditionsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      803 bx defN 70-Jan-01 00:00 kotlin/Result.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1440 bx defN 70-Jan-01 00:00 kotlin/ResultKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      202 bx defN 70-Jan-01 00:00 kotlin/RuntimeException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      967 bx defN 70-Jan-01 00:00 kotlin/StandardKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      354 bx defN 70-Jan-01 00:00 kotlin/SuccessOrFailureKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      320 bx defN 70-Jan-01 00:00 kotlin/SuspendKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      471 bx defN 70-Jan-01 00:00 kotlin/Triple.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      247 bx defN 70-Jan-01 00:00 kotlin/TuplesKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1822 bx defN 70-Jan-01 00:00 kotlin/UByte.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      858 bx defN 70-Jan-01 00:00 kotlin/UByteArray.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      376 bx defN 70-Jan-01 00:00 kotlin/UByteArrayKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      410 bx defN 70-Jan-01 00:00 kotlin/UByteKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1888 bx defN 70-Jan-01 00:00 kotlin/UInt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      853 bx defN 70-Jan-01 00:00 kotlin/UIntArray.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      373 bx defN 70-Jan-01 00:00 kotlin/UIntArrayKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      526 bx defN 70-Jan-01 00:00 kotlin/UIntKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1890 bx defN 70-Jan-01 00:00 kotlin/ULong.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      858 bx defN 70-Jan-01 00:00 kotlin/ULongArray.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      376 bx defN 70-Jan-01 00:00 kotlin/ULongArrayKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      528 bx defN 70-Jan-01 00:00 kotlin/ULongKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      100 bx defN 70-Jan-01 00:00 kotlin/UNINITIALIZED_VALUE.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1690 bx defN 70-Jan-01 00:00 kotlin/UNumbersKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1822 bx defN 70-Jan-01 00:00 kotlin/UShort.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      863 bx defN 70-Jan-01 00:00 kotlin/UShortArray.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      379 bx defN 70-Jan-01 00:00 kotlin/UShortArrayKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      412 bx defN 70-Jan-01 00:00 kotlin/UShortKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      392 bx defN 70-Jan-01 00:00 kotlin/UninitializedPropertyAccessException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      382 bx defN 70-Jan-01 00:00 kotlin/UnsafeLazyImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      634 bx defN 70-Jan-01 00:00 kotlin/UnsignedUtilsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      222 bx defN 70-Jan-01 00:00 kotlin/UnsupportedOperationException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      652 bx defN 70-Jan-01 00:00 kotlin/UseExperimental.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      455 bx defN 70-Jan-01 00:00 kotlin/WasExperimental.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      926 bx defN 70-Jan-01 00:00 kotlin/annotation/annotation.kotlin_builtins</font>
│ <font color="#CC0000">--rw----     2.0 fat      579 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractCollection.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      364 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1403 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      945 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractMap.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      598 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractMutableCollection.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      739 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractMutableList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      692 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractMutableMap.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      584 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractMutableSet.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      478 bx defN 70-Jan-01 00:00 kotlin/collections/AbstractSet.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      452 bx defN 70-Jan-01 00:00 kotlin/collections/ArrayAsCollection.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      972 bx defN 70-Jan-01 00:00 kotlin/collections/ArrayList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1020 bx defN 70-Jan-01 00:00 kotlin/collections/ArraysKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1094 bx defN 70-Jan-01 00:00 kotlin/collections/CollectionsHKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     2014 bx defN 70-Jan-01 00:00 kotlin/collections/CollectionsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      300 bx defN 70-Jan-01 00:00 kotlin/collections/EmptyIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      800 bx defN 70-Jan-01 00:00 kotlin/collections/EmptyList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      673 bx defN 70-Jan-01 00:00 kotlin/collections/EmptyMap.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      578 bx defN 70-Jan-01 00:00 kotlin/collections/EmptySet.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      261 bx defN 70-Jan-01 00:00 kotlin/collections/Grouping.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1298 bx defN 70-Jan-01 00:00 kotlin/collections/GroupingKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      725 bx defN 70-Jan-01 00:00 kotlin/collections/HashMap.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      607 bx defN 70-Jan-01 00:00 kotlin/collections/HashSet.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      378 bx defN 70-Jan-01 00:00 kotlin/collections/IndexedValue.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      291 bx defN 70-Jan-01 00:00 kotlin/collections/IndexingIterable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      299 bx defN 70-Jan-01 00:00 kotlin/collections/IndexingIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      704 bx defN 70-Jan-01 00:00 kotlin/collections/IterablesKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      316 bx defN 70-Jan-01 00:00 kotlin/collections/IteratorsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      731 bx defN 70-Jan-01 00:00 kotlin/collections/LinkedHashMap.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      613 bx defN 70-Jan-01 00:00 kotlin/collections/LinkedHashSet.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      804 bx defN 70-Jan-01 00:00 kotlin/collections/MapAccessorsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      220 bx defN 70-Jan-01 00:00 kotlin/collections/MapWithDefault.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      768 bx defN 70-Jan-01 00:00 kotlin/collections/MapWithDefaultImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      482 bx defN 70-Jan-01 00:00 kotlin/collections/MapWithDefaultKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     4021 bx defN 70-Jan-01 00:00 kotlin/collections/MapsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      362 bx defN 70-Jan-01 00:00 kotlin/collections/MovingSubList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1707 bx defN 70-Jan-01 00:00 kotlin/collections/MutableCollectionsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      228 bx defN 70-Jan-01 00:00 kotlin/collections/MutableMapWithDefault.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      943 bx defN 70-Jan-01 00:00 kotlin/collections/MutableMapWithDefaultImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      108 bx defN 70-Jan-01 00:00 kotlin/collections/RandomAccess.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      380 bx defN 70-Jan-01 00:00 kotlin/collections/ReversedList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      257 bx defN 70-Jan-01 00:00 kotlin/collections/ReversedListReadOnly.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      335 bx defN 70-Jan-01 00:00 kotlin/collections/ReversedViewsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      574 bx defN 70-Jan-01 00:00 kotlin/collections/RingBuffer.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      629 bx defN 70-Jan-01 00:00 kotlin/collections/SetsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      443 bx defN 70-Jan-01 00:00 kotlin/collections/SlidingWindowKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      161 bx defN 70-Jan-01 00:00 kotlin/collections/State.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      647 bx defN 70-Jan-01 00:00 kotlin/collections/UArraySortingKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      278 bx defN 70-Jan-01 00:00 kotlin/collections/UByteIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      275 bx defN 70-Jan-01 00:00 kotlin/collections/UIntIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      278 bx defN 70-Jan-01 00:00 kotlin/collections/ULongIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      281 bx defN 70-Jan-01 00:00 kotlin/collections/UShortIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     3685 bx defN 70-Jan-01 00:00 kotlin/collections/collections.kotlin_builtins</font>
│ <font color="#CC0000">--rw----     2.0 fat     1372 bx defN 70-Jan-01 00:00 kotlin/comparisons/ComparisonsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      246 bx defN 70-Jan-01 00:00 kotlin/comparisons/NaturalOrderComparator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      246 bx defN 70-Jan-01 00:00 kotlin/comparisons/ReverseOrderComparator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      243 bx defN 70-Jan-01 00:00 kotlin/comparisons/ReversedComparator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      237 bx defN 70-Jan-01 00:00 kotlin/contracts/CallsInPlace.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      242 bx defN 70-Jan-01 00:00 kotlin/contracts/ConditionalEffect.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      519 bx defN 70-Jan-01 00:00 kotlin/contracts/ContractBuilder.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      360 bx defN 70-Jan-01 00:00 kotlin/contracts/ContractBuilderKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      228 bx defN 70-Jan-01 00:00 kotlin/contracts/Effect.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      331 bx defN 70-Jan-01 00:00 kotlin/contracts/ExperimentalContracts.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      339 bx defN 70-Jan-01 00:00 kotlin/contracts/InvocationKind.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      238 bx defN 70-Jan-01 00:00 kotlin/contracts/Returns.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      245 bx defN 70-Jan-01 00:00 kotlin/contracts/ReturnsNotNull.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      343 bx defN 70-Jan-01 00:00 kotlin/contracts/SimpleEffect.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      248 bx defN 70-Jan-01 00:00 kotlin/coroutines/AbstractCoroutineContextElement.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      933 bx defN 70-Jan-01 00:00 kotlin/coroutines/CombinedContext.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      306 bx defN 70-Jan-01 00:00 kotlin/coroutines/Continuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      511 bx defN 70-Jan-01 00:00 kotlin/coroutines/ContinuationInterceptor.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1040 bx defN 70-Jan-01 00:00 kotlin/coroutines/ContinuationKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      584 bx defN 70-Jan-01 00:00 kotlin/coroutines/CoroutineContext.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      630 bx defN 70-Jan-01 00:00 kotlin/coroutines/EmptyCoroutineContext.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      358 bx defN 70-Jan-01 00:00 kotlin/coroutines/RestrictsSuspension.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      469 bx defN 70-Jan-01 00:00 kotlin/coroutines/SafeContinuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      200 bx defN 70-Jan-01 00:00 kotlin/coroutines/coroutines.kotlin_builtins</font>
│ <font color="#CC0000">--rw----     2.0 fat      269 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/AbstractCoroutineContextElement.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      621 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/CombinedContext.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      356 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/Continuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      367 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/ContinuationInterceptor.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      604 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/CoroutineContext.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      847 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/CoroutinesLibraryKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      523 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/EmptyCoroutineContext.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      378 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/RestrictsSuspension.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      470 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/SafeContinuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      499 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/SequenceBuilder.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      739 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/SequenceBuilderIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      791 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/SequenceBuilderKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      612 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/intrinsics/CoroutinesIntrinsicsExperimentalHKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      534 bx defN 70-Jan-01 00:00 kotlin/coroutines/experimental/intrinsics/IntrinsicsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      276 bx defN 70-Jan-01 00:00 kotlin/coroutines/intrinsics/CoroutineSingletons.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      678 bx defN 70-Jan-01 00:00 kotlin/coroutines/intrinsics/CoroutinesIntrinsicsHKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      385 bx defN 70-Jan-01 00:00 kotlin/coroutines/intrinsics/IntrinsicsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      479 bx defN 70-Jan-01 00:00 kotlin/experimental/BitwiseOperationsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      476 bx defN 70-Jan-01 00:00 kotlin/experimental/ExperimentalTypeInference.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      380 bx defN 70-Jan-01 00:00 kotlin/internal/AccessibleLateinitPropertyLiteral.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      263 bx defN 70-Jan-01 00:00 kotlin/internal/ContractsDsl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      324 bx defN 70-Jan-01 00:00 kotlin/internal/DynamicExtension.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      291 bx defN 70-Jan-01 00:00 kotlin/internal/Exact.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      320 bx defN 70-Jan-01 00:00 kotlin/internal/HidesMembers.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      368 bx defN 70-Jan-01 00:00 kotlin/internal/InlineOnly.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      339 bx defN 70-Jan-01 00:00 kotlin/internal/LowPriorityInOverloadResolution.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      293 bx defN 70-Jan-01 00:00 kotlin/internal/NoInfer.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      310 bx defN 70-Jan-01 00:00 kotlin/internal/OnlyInputTypes.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      665 bx defN 70-Jan-01 00:00 kotlin/internal/RequireKotlin.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      241 bx defN 70-Jan-01 00:00 kotlin/internal/RequireKotlinVersionKind.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      422 bx defN 70-Jan-01 00:00 kotlin/internal/UProgressionUtilKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      758 bx defN 70-Jan-01 00:00 kotlin/internal/internal.kotlin_builtins</font>
│ <font color="#CC0000">--rw----     2.0 fat      154 bx defN 70-Jan-01 00:00 kotlin/io/IoHKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat       99 bx defN 70-Jan-01 00:00 kotlin/io/Serializable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      390 bx defN 70-Jan-01 00:00 kotlin/js/JsName.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      275 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmField.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      283 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmMultifileClass.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      383 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmName.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      303 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmOverloads.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      452 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmPackageName.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      347 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmStatic.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      386 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmSuppressWildcards.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      316 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmSynthetic.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      277 bx defN 70-Jan-01 00:00 kotlin/jvm/JvmWildcard.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      364 bx defN 70-Jan-01 00:00 kotlin/jvm/Strictfp.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      332 bx defN 70-Jan-01 00:00 kotlin/jvm/Synchronized.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      276 bx defN 70-Jan-01 00:00 kotlin/jvm/Transient.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      275 bx defN 70-Jan-01 00:00 kotlin/jvm/Volatile.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat    14707 bx defN 70-Jan-01 00:00 kotlin/kotlin.kotlin_builtins</font>
│ <font color="#CC0000">--rw----     2.0 fat     3399 bx defN 70-Jan-01 00:00 kotlin/math/MathHKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      415 bx defN 70-Jan-01 00:00 kotlin/math/UMathKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      355 bx defN 70-Jan-01 00:00 kotlin/native/concurrent/SharedImmutable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      366 bx defN 70-Jan-01 00:00 kotlin/native/concurrent/ThreadLocal.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      543 bx defN 70-Jan-01 00:00 kotlin/properties/Delegates.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      341 bx defN 70-Jan-01 00:00 kotlin/properties/NotNullVar.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      477 bx defN 70-Jan-01 00:00 kotlin/properties/ObservableProperty.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      232 bx defN 70-Jan-01 00:00 kotlin/properties/ReadOnlyProperty.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      293 bx defN 70-Jan-01 00:00 kotlin/properties/ReadWriteProperty.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1152 bx defN 70-Jan-01 00:00 kotlin/random/Random.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      720 bx defN 70-Jan-01 00:00 kotlin/random/RandomKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      942 bx defN 70-Jan-01 00:00 kotlin/random/URandomKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      321 bx defN 70-Jan-01 00:00 kotlin/random/XorWowRandom.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      488 bx defN 70-Jan-01 00:00 kotlin/ranges/ClosedDoubleRange.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      339 bx defN 70-Jan-01 00:00 kotlin/ranges/ClosedFloatingPointRange.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      362 bx defN 70-Jan-01 00:00 kotlin/ranges/ComparableRange.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      599 bx defN 70-Jan-01 00:00 kotlin/ranges/RangesKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      677 bx defN 70-Jan-01 00:00 kotlin/ranges/UIntProgression.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      442 bx defN 70-Jan-01 00:00 kotlin/ranges/UIntProgressionIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      584 bx defN 70-Jan-01 00:00 kotlin/ranges/UIntRange.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      698 bx defN 70-Jan-01 00:00 kotlin/ranges/ULongProgression.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      447 bx defN 70-Jan-01 00:00 kotlin/ranges/ULongProgressionIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      587 bx defN 70-Jan-01 00:00 kotlin/ranges/ULongRange.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     2301 bx defN 70-Jan-01 00:00 kotlin/ranges/ranges.kotlin_builtins</font>
│ <font color="#CC0000">--rw----     2.0 fat      148 bx defN 70-Jan-01 00:00 kotlin/reflect/KCallable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      154 bx defN 70-Jan-01 00:00 kotlin/reflect/KClass.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      131 bx defN 70-Jan-01 00:00 kotlin/reflect/KMutableProperty.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      218 bx defN 70-Jan-01 00:00 kotlin/reflect/KMutableProperty0.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      255 bx defN 70-Jan-01 00:00 kotlin/reflect/KMutableProperty1.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      294 bx defN 70-Jan-01 00:00 kotlin/reflect/KMutableProperty2.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      126 bx defN 70-Jan-01 00:00 kotlin/reflect/KProperty.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      174 bx defN 70-Jan-01 00:00 kotlin/reflect/KProperty0.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      211 bx defN 70-Jan-01 00:00 kotlin/reflect/KProperty1.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      250 bx defN 70-Jan-01 00:00 kotlin/reflect/KProperty2.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      188 bx defN 70-Jan-01 00:00 kotlin/reflect/TypeOfKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     5019 bx defN 70-Jan-01 00:00 kotlin/reflect/reflect.kotlin_builtins</font>
│ <font color="#CC0000">--rw----     2.0 fat      236 bx defN 70-Jan-01 00:00 kotlin/sequences/ConstrainedOnceSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      369 bx defN 70-Jan-01 00:00 kotlin/sequences/DistinctIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      304 bx defN 70-Jan-01 00:00 kotlin/sequences/DistinctSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      349 bx defN 70-Jan-01 00:00 kotlin/sequences/DropSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      203 bx defN 70-Jan-01 00:00 kotlin/sequences/DropTakeSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      313 bx defN 70-Jan-01 00:00 kotlin/sequences/DropWhileSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      304 bx defN 70-Jan-01 00:00 kotlin/sequences/EmptySequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      341 bx defN 70-Jan-01 00:00 kotlin/sequences/FilteringSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      349 bx defN 70-Jan-01 00:00 kotlin/sequences/FlatteningSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      348 bx defN 70-Jan-01 00:00 kotlin/sequences/GeneratorSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      272 bx defN 70-Jan-01 00:00 kotlin/sequences/IndexingSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      359 bx defN 70-Jan-01 00:00 kotlin/sequences/MergingSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      180 bx defN 70-Jan-01 00:00 kotlin/sequences/Sequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      731 bx defN 70-Jan-01 00:00 kotlin/sequences/SequenceBuilderIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1460 bx defN 70-Jan-01 00:00 kotlin/sequences/SequenceBuilderKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      477 bx defN 70-Jan-01 00:00 kotlin/sequences/SequenceScope.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1108 bx defN 70-Jan-01 00:00 kotlin/sequences/SequencesKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      396 bx defN 70-Jan-01 00:00 kotlin/sequences/SubSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      349 bx defN 70-Jan-01 00:00 kotlin/sequences/TakeSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      313 bx defN 70-Jan-01 00:00 kotlin/sequences/TakeWhileSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      339 bx defN 70-Jan-01 00:00 kotlin/sequences/TransformingIndexedSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      376 bx defN 70-Jan-01 00:00 kotlin/sequences/TransformingSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      254 bx defN 70-Jan-01 00:00 kotlin/text/Appendable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      245 bx defN 70-Jan-01 00:00 kotlin/text/CharKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      207 bx defN 70-Jan-01 00:00 kotlin/text/CharacterCodingException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      545 bx defN 70-Jan-01 00:00 kotlin/text/DelimitedRangesSequence.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      524 bx defN 70-Jan-01 00:00 kotlin/text/IndentKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      136 bx defN 70-Jan-01 00:00 kotlin/text/MatchGroup.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      208 bx defN 70-Jan-01 00:00 kotlin/text/MatchGroupCollection.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      252 bx defN 70-Jan-01 00:00 kotlin/text/MatchNamedGroupCollection.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      741 bx defN 70-Jan-01 00:00 kotlin/text/MatchResult.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      926 bx defN 70-Jan-01 00:00 kotlin/text/Regex.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      278 bx defN 70-Jan-01 00:00 kotlin/text/RegexExtensionsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      141 bx defN 70-Jan-01 00:00 kotlin/text/RegexOption.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      476 bx defN 70-Jan-01 00:00 kotlin/text/StringBuilder.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      655 bx defN 70-Jan-01 00:00 kotlin/text/StringBuilderKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      541 bx defN 70-Jan-01 00:00 kotlin/text/StringNumberConversionsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     4296 bx defN 70-Jan-01 00:00 kotlin/text/StringsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     2568 bx defN 70-Jan-01 00:00 kotlin/text/TextHKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1212 bx defN 70-Jan-01 00:00 kotlin/text/Typography.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1113 bx defN 70-Jan-01 00:00 kotlin/text/UStringsKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      538 bx defN 70-Jan-01 00:00 kotlin/time/AbstractDoubleClock.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      532 bx defN 70-Jan-01 00:00 kotlin/time/AbstractLongClock.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      278 bx defN 70-Jan-01 00:00 kotlin/time/AdjustedClockMark.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      214 bx defN 70-Jan-01 00:00 kotlin/time/Clock.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      753 bx defN 70-Jan-01 00:00 kotlin/time/ClockKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      360 bx defN 70-Jan-01 00:00 kotlin/time/ClockMark.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1864 bx defN 70-Jan-01 00:00 kotlin/time/Duration.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1514 bx defN 70-Jan-01 00:00 kotlin/time/DurationKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      292 bx defN 70-Jan-01 00:00 kotlin/time/DurationUnit.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      321 bx defN 70-Jan-01 00:00 kotlin/time/DurationUnitKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      634 bx defN 70-Jan-01 00:00 kotlin/time/ExperimentalTime.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      504 bx defN 70-Jan-01 00:00 kotlin/time/MeasureTimeKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      181 bx defN 70-Jan-01 00:00 kotlin/time/MonoClock.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      359 bx defN 70-Jan-01 00:00 kotlin/time/TestClock.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      492 bx defN 70-Jan-01 00:00 kotlin/time/TimedValue.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1220 bx defN 70-Jan-01 00:00 kotlinx/coroutines/AbstractCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      165 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Active.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      881 bx defN 70-Jan-01 00:00 kotlinx/coroutines/AwaitAll.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      375 bx defN 70-Jan-01 00:00 kotlinx/coroutines/AwaitKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      662 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Builders_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      151 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancelHandler.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      201 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancelHandlerBase.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1115 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancellableContinuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     2050 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancellableContinuationImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      167 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancellableContinuationImplKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      839 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancellableContinuationKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      186 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancellationException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      388 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CancelledContinuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      355 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ChildContinuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      414 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ChildHandle.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      421 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ChildHandleNode.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      400 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ChildJob.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      276 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletableDeferred.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      767 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletableDeferredImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      175 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletableDeferredKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      216 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletedExceptionally.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      156 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletedExceptionallyKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      288 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletedIdempotentResult.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      240 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletionHandlerBase.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      257 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletionHandlerException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      442 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CompletionHandler_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      538 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineContext_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      992 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineDispatcher.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      326 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineExceptionHandler.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      565 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineExceptionHandlerKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      449 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineName.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      184 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineScope.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      526 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineScopeKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      666 bx defN 70-Jan-01 00:00 kotlinx/coroutines/CoroutineStart.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      161 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Debug_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      351 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Deferred.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      661 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DeferredCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      432 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Delay.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      219 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DelayKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      211 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DispatchException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1011 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DispatchedContinuation.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      567 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DispatchedCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      976 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DispatchedKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      431 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DispatchedTask.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      289 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Dispatchers.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      158 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DisposableHandle.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      298 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DisposeOnCancel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      328 bx defN 70-Jan-01 00:00 kotlinx/coroutines/DisposeOnCompletion.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      246 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Empty.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      705 bx defN 70-Jan-01 00:00 kotlinx/coroutines/EventLoop.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      109 bx defN 70-Jan-01 00:00 kotlinx/coroutines/EventLoop_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      161 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Exceptions_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      342 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ExperimentalCoroutinesApi.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      199 bx defN 70-Jan-01 00:00 kotlinx/coroutines/GlobalScope.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      255 bx defN 70-Jan-01 00:00 kotlinx/coroutines/InactiveNodeList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      196 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Incomplete.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      175 bx defN 70-Jan-01 00:00 kotlinx/coroutines/IncompleteStateBox.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      305 bx defN 70-Jan-01 00:00 kotlinx/coroutines/InternalCoroutinesApi.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      382 bx defN 70-Jan-01 00:00 kotlinx/coroutines/InvokeOnCancel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      481 bx defN 70-Jan-01 00:00 kotlinx/coroutines/InvokeOnCancelling.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      412 bx defN 70-Jan-01 00:00 kotlinx/coroutines/InvokeOnCompletion.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1687 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Job.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      263 bx defN 70-Jan-01 00:00 kotlinx/coroutines/JobCancellationException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      172 bx defN 70-Jan-01 00:00 kotlinx/coroutines/JobCancellingNode.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      263 bx defN 70-Jan-01 00:00 kotlinx/coroutines/JobImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1106 bx defN 70-Jan-01 00:00 kotlinx/coroutines/JobKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      366 bx defN 70-Jan-01 00:00 kotlinx/coroutines/JobNode.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     4834 bx defN 70-Jan-01 00:00 kotlinx/coroutines/JobSupport.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      549 bx defN 70-Jan-01 00:00 kotlinx/coroutines/JobSupportKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      489 bx defN 70-Jan-01 00:00 kotlinx/coroutines/LazyDeferredCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      472 bx defN 70-Jan-01 00:00 kotlinx/coroutines/LazyStandaloneCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      202 bx defN 70-Jan-01 00:00 kotlinx/coroutines/MainCoroutineDispatcher.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      309 bx defN 70-Jan-01 00:00 kotlinx/coroutines/NodeList.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1003 bx defN 70-Jan-01 00:00 kotlinx/coroutines/NonCancellable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      361 bx defN 70-Jan-01 00:00 kotlinx/coroutines/NonDisposableHandle.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      119 bx defN 70-Jan-01 00:00 kotlinx/coroutines/NotCompleted.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      338 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ObsoleteCoroutinesApi.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      379 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ParentJob.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      317 bx defN 70-Jan-01 00:00 kotlinx/coroutines/RemoveOnCancel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      373 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ResumeAwaitOnCompletion.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      715 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ResumeModeKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      339 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ResumeOnCompletion.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      149 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Runnable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      163 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Runnable_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      116 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SchedulerTask.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      128 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SchedulerTaskContext.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      198 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SchedulerTask_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      530 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SelectAwaitOnCompletion.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      512 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SelectJoinOnCompletion.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      351 bx defN 70-Jan-01 00:00 kotlinx/coroutines/StandaloneCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      514 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SupervisorCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      332 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SupervisorJobImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      370 bx defN 70-Jan-01 00:00 kotlinx/coroutines/SupervisorKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      374 bx defN 70-Jan-01 00:00 kotlinx/coroutines/ThreadLocalEventLoop.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      247 bx defN 70-Jan-01 00:00 kotlinx/coroutines/TimeoutCancellationException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      687 bx defN 70-Jan-01 00:00 kotlinx/coroutines/TimeoutCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      591 bx defN 70-Jan-01 00:00 kotlinx/coroutines/TimeoutKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      352 bx defN 70-Jan-01 00:00 kotlinx/coroutines/Unconfined.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      322 bx defN 70-Jan-01 00:00 kotlinx/coroutines/UndispatchedCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      178 bx defN 70-Jan-01 00:00 kotlinx/coroutines/YieldKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     3507 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/AbstractChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      516 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/AbstractChannelKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     3189 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/AbstractSendChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1594 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ArrayBroadcastChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      793 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ArrayChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      344 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/BroadcastChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      215 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/BroadcastChannelKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1078 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/BroadcastCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      791 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/BroadcastKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      348 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/Channel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1178 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ChannelCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      220 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ChannelIterator.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      166 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ChannelKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     6565 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/Channels_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      714 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/Closed.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      208 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ClosedReceiveChannelException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      204 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ClosedSendChannelException.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     1955 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ConflatedBroadcastChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      574 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ConflatedChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      617 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/LazyBroadcastCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      463 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/LinkedListChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      807 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ProduceKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      475 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ProducerCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      250 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ProducerScope.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      343 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/Receive.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      985 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ReceiveChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      301 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/ReceiveOrClosed.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      307 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/RendezvousChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      319 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/Send.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      597 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/SendChannel.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      508 bx defN 70-Jan-01 00:00 kotlinx/coroutines/channels/SendElement.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      484 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/AbstractAtomicDesc.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      375 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/AddLastDesc.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      278 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ArrayCopy_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      402 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ArrayQueue.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      251 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/AtomicDesc.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      158 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/AtomicKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      448 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/AtomicOp.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      217 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/CommonThreadLocal.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      432 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/Concurrent_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      226 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ContextScope.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      237 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/CoroutineStackFrame.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      325 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/LockFreeLinkedListHead.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      677 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/LockFreeLinkedListNode.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      392 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/MainDispatcherFactory.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      184 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/NativeThreadLocal.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      146 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/NonRecoverableThrowable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      176 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/OpDescriptor.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      187 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ProbesSupport_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      215 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ReentrantLock.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      434 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/RemoveFirstDesc.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      583 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ScopeCoroutine.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      184 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ScopesKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      222 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/SharedImmutable.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      141 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/StackTraceElement.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      352 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/StackTraceRecovery_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      189 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/Symbol.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      144 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/SynchronizedObject.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      235 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/Synchronized_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      188 bx defN 70-Jan-01 00:00 kotlinx/coroutines/internal/ThreadContext_commonKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      476 bx defN 70-Jan-01 00:00 kotlinx/coroutines/intrinsics/CancellableKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      941 bx defN 70-Jan-01 00:00 kotlinx/coroutines/intrinsics/UndispatchedKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      676 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectBuilder.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     2119 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectBuilderImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      398 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectClause0.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      417 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectClause1.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      446 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectClause2.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      630 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectInstance.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      404 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      267 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/SelectUnbiasedKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      928 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/UnbiasedSelectBuilderImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      313 bx defN 70-Jan-01 00:00 kotlinx/coroutines/selects/WhileSelectKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      189 bx defN 70-Jan-01 00:00 kotlinx/coroutines/sync/Empty.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      375 bx defN 70-Jan-01 00:00 kotlinx/coroutines/sync/Mutex.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat     2181 bx defN 70-Jan-01 00:00 kotlinx/coroutines/sync/MutexImpl.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.0 fat      576 bx defN 70-Jan-01 00:00 kotlinx/coroutines/sync/MutexKt.kotlin_metadata</font>
│ <font color="#CC0000">--rw----     2.4 fat   936368 b- defN 80-000-00 00:00 lib/arm64-v8a/libc++_shared.so</font>
│ <font color="#CC0000">--rw----     2.4 fat    22424 b- defN 80-000-00 00:00 lib/arm64-v8a/libscrypt.so</font>
│ <font color="#CC0000">--rw----     2.4 fat   558988 b- defN 80-000-00 00:00 lib/armeabi-v7a/libc++_shared.so</font>
│ <font color="#CC0000">--rw----     2.4 fat    22192 b- defN 80-000-00 00:00 lib/armeabi-v7a/libscrypt.so</font>
│ <font color="#CC0000">--rw----     2.4 fat   939924 b- defN 80-000-00 00:00 lib/x86/libc++_shared.so</font>
│ <font color="#CC0000">--rw----     2.4 fat    22088 b- defN 80-000-00 00:00 lib/x86/libscrypt.so</font>
│ <font color="#CC0000">--rw----     2.4 fat  1002168 b- defN 80-000-00 00:00 lib/x86_64/libc++_shared.so</font>
│ <font color="#CC0000">--rw----     2.4 fat    26800 b- defN 80-000-00 00:00 lib/x86_64/libscrypt.so</font>
│ <font color="#CC0000">--rw----     2.0 fat      218 bx defN 70-Jan-01 00:00 okhttp3/internal/publicsuffix/NOTICE</font>
│ <font color="#CC0000">--rw----     2.0 fat       94 bx defN 70-Jan-01 00:00 play-services-ads-identifier.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       74 bx defN 70-Jan-01 00:00 play-services-base.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       82 bx defN 70-Jan-01 00:00 play-services-basement.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       76 bx defN 70-Jan-01 00:00 play-services-flags.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       96 bx defN 70-Jan-01 00:00 play-services-measurement-api.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       98 bx defN 70-Jan-01 00:00 play-services-measurement-base.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       98 bx defN 70-Jan-01 00:00 play-services-measurement-impl.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 bx defN 70-Jan-01 00:00 play-services-measurement-sdk-api.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       96 bx defN 70-Jan-01 00:00 play-services-measurement-sdk.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       88 bx defN 70-Jan-01 00:00 play-services-measurement.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       76 bx defN 70-Jan-01 00:00 play-services-stats.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat       76 bx defN 70-Jan-01 00:00 play-services-tasks.properties</font>
│ <font color="#CC0000">--rw----     2.0 fat      616 b- defN 80-000-00 00:00 res/anim-v21/design_bottom_sheet_slide_in.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      616 b- defN 80-000-00 00:00 res/anim-v21/design_bottom_sheet_slide_out.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/abc_fade_in.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/abc_fade_out.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      852 b- defN 80-000-00 00:00 res/anim/abc_grow_fade_in_from_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      508 b- defN 80-000-00 00:00 res/anim/abc_popup_enter.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      508 b- defN 80-000-00 00:00 res/anim/abc_popup_exit.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      852 b- defN 80-000-00 00:00 res/anim/abc_shrink_fade_out_from_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/abc_slide_in_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/abc_slide_in_top.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/abc_slide_out_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/abc_slide_out_top.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      388 b- defN 80-000-00 00:00 res/anim/abc_tooltip_enter.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      388 b- defN 80-000-00 00:00 res/anim/abc_tooltip_exit.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     2124 b- defN 80-000-00 00:00 res/anim/btn_checkbox_to_checked_box_inner_merged_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     2780 b- defN 80-000-00 00:00 res/anim/btn_checkbox_to_checked_box_outer_merged_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1196 b- defN 80-000-00 00:00 res/anim/btn_checkbox_to_checked_icon_null_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     2360 b- defN 80-000-00 00:00 res/anim/btn_checkbox_to_unchecked_box_inner_merged_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     2520 b- defN 80-000-00 00:00 res/anim/btn_checkbox_to_unchecked_check_path_merged_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1196 b- defN 80-000-00 00:00 res/anim/btn_checkbox_to_unchecked_icon_null_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1656 b- defN 80-000-00 00:00 res/anim/btn_radio_to_off_mtrl_dot_group_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1656 b- defN 80-000-00 00:00 res/anim/btn_radio_to_off_mtrl_ring_outer_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1028 b- defN 80-000-00 00:00 res/anim/btn_radio_to_off_mtrl_ring_outer_path_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1656 b- defN 80-000-00 00:00 res/anim/btn_radio_to_on_mtrl_dot_group_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1656 b- defN 80-000-00 00:00 res/anim/btn_radio_to_on_mtrl_ring_outer_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1028 b- defN 80-000-00 00:00 res/anim/btn_radio_to_on_mtrl_ring_outer_path_animation.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/design_snackbar_in.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      104 b- defN 80-000-00 00:00 res/anim/design_snackbar_out.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      636 b- defN 80-000-00 00:00 res/anim/slide_in_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      420 b- defN 80-000-00 00:00 res/anim/slide_in_left.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      420 b- defN 80-000-00 00:00 res/anim/slide_in_right.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      572 b- defN 80-000-00 00:00 res/anim/slide_out_bottom.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      420 b- defN 80-000-00 00:00 res/anim/slide_out_left.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      420 b- defN 80-000-00 00:00 res/anim/slide_out_right.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      280 b- defN 80-000-00 00:00 res/anim/transaction_layout_anim.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1216 b- defN 80-000-00 00:00 res/animator-v21/design_appbar_state_list_animator.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      796 b- defN 80-000-00 00:00 res/animator/design_fab_hide_motion_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      796 b- defN 80-000-00 00:00 res/animator/design_fab_show_motion_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     2664 b- defN 80-000-00 00:00 res/animator/mtrl_btn_state_list_anim.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      120 b- defN 80-000-00 00:00 res/animator/mtrl_btn_unelevated_state_list_anim.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1072 b- defN 80-000-00 00:00 res/animator/mtrl_chip_state_list_anim.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      796 b- defN 80-000-00 00:00 res/animator/mtrl_fab_hide_motion_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      796 b- defN 80-000-00 00:00 res/animator/mtrl_fab_show_motion_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1888 b- defN 80-000-00 00:00 res/animator/mtrl_fab_transformation_sheet_collapse_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1888 b- defN 80-000-00 00:00 res/animator/mtrl_fab_transformation_sheet_expand_spec.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color-v21/abc_btn_colored_borderless_text_material.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      500 b- defN 80-000-00 00:00 res/color-v23/abc_btn_colored_borderless_text_material.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      500 b- defN 80-000-00 00:00 res/color-v23/abc_btn_colored_text_material.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      544 b- defN 80-000-00 00:00 res/color-v23/abc_color_highlight_material.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      624 b- defN 80-000-00 00:00 res/color-v23/abc_tint_btn_checkable.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1120 b- defN 80-000-00 00:00 res/color-v23/abc_tint_default.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      668 b- defN 80-000-00 00:00 res/color-v23/abc_tint_edittext.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      500 b- defN 80-000-00 00:00 res/color-v23/abc_tint_seek_thumb.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      668 b- defN 80-000-00 00:00 res/color-v23/abc_tint_spinner.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      664 b- defN 80-000-00 00:00 res/color-v23/abc_tint_switch_track.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      376 b- defN 80-000-00 00:00 res/color-v23/design_tint_password_toggle.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      468 b- defN 80-000-00 00:00 res/color/abc_background_cache_hint_selector_material_dark.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      468 b- defN 80-000-00 00:00 res/color/abc_background_cache_hint_selector_material_light.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      604 b- defN 80-000-00 00:00 res/color/abc_btn_colored_text_material.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      564 b- defN 80-000-00 00:00 res/color/abc_hint_foreground_material_dark.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      564 b- defN 80-000-00 00:00 res/color/abc_hint_foreground_material_light.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/abc_primary_text_disable_only_material_dark.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/abc_primary_text_disable_only_material_light.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/abc_primary_text_material_dark.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/abc_primary_text_material_light.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      588 b- defN 80-000-00 00:00 res/color/abc_search_url_text.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/abc_secondary_text_material_dark.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/abc_secondary_text_material_light.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      728 b- defN 80-000-00 00:00 res/color/abc_tint_btn_checkable.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1224 b- defN 80-000-00 00:00 res/color/abc_tint_default.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      772 b- defN 80-000-00 00:00 res/color/abc_tint_edittext.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      604 b- defN 80-000-00 00:00 res/color/abc_tint_seek_thumb.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      772 b- defN 80-000-00 00:00 res/color/abc_tint_spinner.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      768 b- defN 80-000-00 00:00 res/color/abc_tint_switch_track.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      712 b- defN 80-000-00 00:00 res/color/common_google_signin_btn_text_dark.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      712 b- defN 80-000-00 00:00 res/color/common_google_signin_btn_text_light.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/common_google_signin_btn_tint.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/design_error.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      480 b- defN 80-000-00 00:00 res/color/design_tint_password_toggle.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      684 b- defN 80-000-00 00:00 res/color/mtrl_bottom_nav_colored_item_tint.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      684 b- defN 80-000-00 00:00 res/color/mtrl_bottom_nav_item_tint.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/mtrl_btn_bg_color_selector.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      948 b- defN 80-000-00 00:00 res/color/mtrl_btn_ripple_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      376 b- defN 80-000-00 00:00 res/color/mtrl_btn_stroke_color_selector.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      948 b- defN 80-000-00 00:00 res/color/mtrl_btn_text_btn_ripple_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/mtrl_btn_text_color_selector.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      608 b- defN 80-000-00 00:00 res/color/mtrl_chip_background_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1092 b- defN 80-000-00 00:00 res/color/mtrl_chip_close_icon_tint.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      948 b- defN 80-000-00 00:00 res/color/mtrl_chip_ripple_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/mtrl_chip_text_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      948 b- defN 80-000-00 00:00 res/color/mtrl_fab_ripple_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      948 b- defN 80-000-00 00:00 res/color/mtrl_tabs_colored_ripple_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/mtrl_tabs_icon_color_selector.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/mtrl_tabs_icon_color_selector_colored.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/mtrl_tabs_legacy_text_color_selector.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1672 b- defN 80-000-00 00:00 res/color/mtrl_tabs_ripple_color.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/mtrl_text_btn_text_color_selector.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      588 b- defN 80-000-00 00:00 res/color/nav_state_list.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/switch_thumb_material_dark.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      464 b- defN 80-000-00 00:00 res/color/switch_thumb_material_light.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat      540 b- defN 80-000-00 00:00 res/drawable-anydpi-v21/design_ic_visibility.xml</font>
│ <font color="#CC0000">--rw----     2.0 fat     1144 b- defN 80-000-00 00:00 res/drawable-anydpi-v21/design_ic_visibility_off.xml</font>
│ <font color="#CC0000">--rw----     2.4 fat      272 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ab_share_pack_mtrl_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      227 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_btn_check_to_on_mtrl_000.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      404 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_btn_check_to_on_mtrl_015.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      464 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_btn_radio_to_on_mtrl_000.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      563 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_btn_radio_to_on_mtrl_015.png</font>
│ <font color="#CC0000">--rw----     2.4 fat     1096 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_btn_switch_to_on_mtrl_00001.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat     1243 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_btn_switch_to_on_mtrl_00012.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      226 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_cab_background_top_mtrl_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      171 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_commit_search_api_mtrl_alpha.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      202 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_menu_copy_mtrl_am_alpha.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      404 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_menu_cut_mtrl_alpha.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      226 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_menu_paste_mtrl_am_alpha.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      215 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_menu_selectall_mtrl_alpha.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      389 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_menu_share_mtrl_alpha.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      263 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_star_black_16dp.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      522 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_star_black_36dp.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      668 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_star_black_48dp.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      197 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_star_half_black_16dp.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      328 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_star_half_black_36dp.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      431 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_ic_star_half_black_48dp.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      167 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_list_divider_mtrl_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      244 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_list_focused_holo.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      212 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_list_longpressed_holo.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      208 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_list_pressed_holo_dark.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      208 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_list_pressed_holo_light.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      228 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_list_selector_disabled_holo_dark.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      229 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_list_selector_disabled_holo_light.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      738 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_menu_hardkey_panel_mtrl_mult.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat     1098 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_popup_background_mtrl_mult.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      201 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_scrubber_control_off_mtrl_alpha.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      196 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_scrubber_control_to_pressed_mtrl_000.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      272 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_scrubber_control_to_pressed_mtrl_005.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      205 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_scrubber_primary_mtrl_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      196 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_scrubber_track_mtrl_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      345 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_spinner_mtrl_am_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      484 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_switch_track_mtrl_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      190 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_tab_indicator_mtrl_alpha.9.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      278 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_text_select_handle_left_mtrl_dark.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      278 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_text_select_handle_left_mtrl_light.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      398 b- stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_text_select_handle_middle_mtrl_dark.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      396 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_text_select_handle_middle_mtrl_light.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      263 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_text_select_handle_right_mtrl_dark.png</font>
│ <font color="#CC0000">--rw----     2.4 fat      262 bx stor 80-000-00 00:00 res/drawable-hdpi-v4/abc_text_select_handle_right_mtrl_light.png</font>
</pre>
</div>
</div>

This is only the first 600 lines of diff output which leaves us with the
verdict: **not verifiable**
