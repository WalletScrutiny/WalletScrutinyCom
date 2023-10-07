---
wsId: 
title: Samourai Wallet
altTitle: 
authors:
- leo
- emanuel
- Mohammad Rafigh
users: 100000
appId: com.samourai.wallet
appCountry: 
released: 
updated: 2023-08-04
version: VARY
stars: 
ratings: 
reviews: 
size: 
website: https://samouraiwallet.com
repository: https://code.samourai.io/wallet/samourai-wallet-android
issue: 
icon: com.samourai.wallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2023-10-06
signer: 6ab9471c21d2cddd628172975cff8ba23584da41c6962df074eb56e4ef08d990
reviewArchive:
- date: 2023-05-04
  version: "0.99.98g"
  appHash: 2e67af86400d69ae3ecb8b05e57e960d481800c15cd68bb204537a093fee99c8
  gitRevision: 59e67206e83af33d1b0a0d781c443e1702e2e59d
  verdict: reproducible
- date: 2022-11-02
  version: "0.99.98f"
  appHash: 0a5711195d96f13f41a71107f1b1035505b33afd3a299828e43e9d1b5101e9c0
  gitRevision: 8a474ddd867e50ed46404ed9d81f2a893bbf6619
  verdict: nonverifiable
twitter: SamouraiWallet
social: 
redirect_from:
- /samourai/
- /com.samourai.wallet/
developerName: Samourai
features: 

---

**Update 2023-10-06**: The latest version from Google Play - 0.99.98h - was not
tagged in the provider's public source repository. We tried with the last
version that had "0.99.98h" as its `versionName` and while it did compile fine,
we got tons of discrepancies.

```
BUILD SUCCESSFUL in 5m 25s
77 actionable tasks: 77 executed
+ result
+ fromPlayUnzipped=/tmp/fromPlay_com.samourai.wallet_197
+ fromBuildUnzipped=/tmp/fromBuild_com.samourai.wallet_197
+ rm -rf /tmp/fromBuild_com.samourai.wallet_197 /tmp/fromPlay_com.samourai.wallet_197
+ unzip -d /tmp/fromPlay_com.samourai.wallet_197 -qq '/home/leo/Documents/walletscrutiny/incoming/Samourai 0.99.98h (com.samourai.wallet).apk'
+ unzip -d /tmp/fromBuild_com.samourai.wallet_197 -qq /tmp/test_com.samourai.wallet/app/app/build/outputs/apk/production/release/app-production-release-unsigned.apk
++ diff --brief --recursive /tmp/fromPlay_com.samourai.wallet_197 /tmp/fromBuild_com.samourai.wallet_197
+ diffResult='Files /tmp/fromPlay_com.samourai.wallet_197/AndroidManifest.xml and /tmp/fromBuild_com.samourai.wallet_197/AndroidManifest.xml differ
Files /tmp/fromPlay_com.samourai.wallet_197/assets/dexopt/baseline.prof and /tmp/fromBuild_com.samourai.wallet_197/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_com.samourai.wallet_197/assets/dexopt/baseline.profm and /tmp/fromBuild_com.samourai.wallet_197/assets/dexopt/baseline.profm differ
Files /tmp/fromPlay_com.samourai.wallet_197/classes2.dex and /tmp/fromBuild_com.samourai.wallet_197/classes2.dex differ
Files /tmp/fromPlay_com.samourai.wallet_197/classes3.dex and /tmp/fromBuild_com.samourai.wallet_197/classes3.dex differ
Files /tmp/fromPlay_com.samourai.wallet_197/classes4.dex and /tmp/fromBuild_com.samourai.wallet_197/classes4.dex differ
Files /tmp/fromPlay_com.samourai.wallet_197/classes5.dex and /tmp/fromBuild_com.samourai.wallet_197/classes5.dex differ
Files /tmp/fromPlay_com.samourai.wallet_197/classes6.dex and /tmp/fromBuild_com.samourai.wallet_197/classes6.dex differ
Files /tmp/fromPlay_com.samourai.wallet_197/classes7.dex and /tmp/fromBuild_com.samourai.wallet_197/classes7.dex differ
Files /tmp/fromPlay_com.samourai.wallet_197/classes.dex and /tmp/fromBuild_com.samourai.wallet_197/classes.dex differ
Files /tmp/fromPlay_com.samourai.wallet_197/kotlin/internal/internal.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_197/kotlin/internal/internal.kotlin_builtins differ
Files /tmp/fromPlay_com.samourai.wallet_197/kotlin/kotlin.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_197/kotlin/kotlin.kotlin_builtins differ
Files /tmp/fromPlay_com.samourai.wallet_197/kotlin/ranges/ranges.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_197/kotlin/ranges/ranges.kotlin_builtins differ
Files /tmp/fromPlay_com.samourai.wallet_197/kotlin/reflect/reflect.kotlin_builtins and /tmp/fromBuild_com.samourai.wallet_197/kotlin/reflect/reflect.kotlin_builtins differ
Only in /tmp/fromBuild_com.samourai.wallet_197/lib/arm64-v8a: libimage_processing_util_jni.so
Only in /tmp/fromBuild_com.samourai.wallet_197/lib/armeabi-v7a: libimage_processing_util_jni.so
Only in /tmp/fromBuild_com.samourai.wallet_197/lib/x86: libimage_processing_util_jni.so
Only in /tmp/fromBuild_com.samourai.wallet_197/lib/x86_64: libimage_processing_util_jni.so
Only in /tmp/fromBuild_com.samourai.wallet_197/META-INF: androidx.camera_camera-camera2.version
Only in /tmp/fromBuild_com.samourai.wallet_197/META-INF: androidx.camera_camera-core.version
Only in /tmp/fromBuild_com.samourai.wallet_197/META-INF: androidx.camera_camera-lifecycle.version
Only in /tmp/fromBuild_com.samourai.wallet_197/META-INF: androidx.camera_camera-view.version
Files /tmp/fromPlay_com.samourai.wallet_197/META-INF/androidx.exifinterface_exifinterface.version and /tmp/fromBuild_com.samourai.wallet_197/META-INF/androidx.exifinterface_exifinterface.version differ
Only in /tmp/fromPlay_com.samourai.wallet_197/META-INF: CERT.RSA
Only in /tmp/fromPlay_com.samourai.wallet_197/META-INF: CERT.SF
Only in /tmp/fromPlay_com.samourai.wallet_197/META-INF: kotlinx_coroutines_core.version
Only in /tmp/fromPlay_com.samourai.wallet_197/META-INF: MANIFEST.MF
Files /tmp/fromPlay_com.samourai.wallet_197/res/0c.xml and /tmp/fromBuild_com.samourai.wallet_197/res/0c.xml differ
Files /tmp/fromPlay_com.samourai.wallet_197/res/0H.xml and /tmp/fromBuild_com.samourai.wallet_197/res/0H.xml differ
...
```

So far, 0.99.98h is **not verifiable**.


**Update 2023-05-04**: Emanuel from WalletScrutiny and Stephan Oeste were able
to reproduce the latest release under certain conditions and specific
environment configs, which are slightly different from our script that still
fails to reproduce the product. We will further investigate what is causing
different build results in
[this thread](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/468)
but have to assume version `0.99.98g` to match the published code. This product
is **reproducible** under certain circumstances.

**Update 2023-04-30**: The latest version of {{ page.title }}, `0.99.98g`, is still
{% include verdictBadge.html verdict='nonverifiable' type='short' %} with the same result as `0.99.98f`.


```
===== Begin Results =====
appId:          com.samourai.wallet
signer:         6ab9471c21d2cddd628172975cff8ba23584da41c6962df074eb56e4ef08d990
apkVersionName: 0.99.98g
apkVersionCode: 194
verdict:        nonverifiable
appHash:        2e67af86400d69ae3ecb8b05e57e960d481800c15cd68bb204537a093fee99c8
commit:         534b9ecde412d6ed3e5e33788371091f66f2cc3c

Diff:
Files /tmp/fromPlay_com.samourai.wallet_194/assets/dexopt/baseline.prof and /tmp/fromBuild_com.samourai.wallet_194/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_com.samourai.wallet_194/classes3.dex and /tmp/fromBuild_com.samourai.wallet_194/classes3.dex differ
Only in /tmp/fromPlay_com.samourai.wallet_194/META-INF: CERT.RSA
Only in /tmp/fromPlay_com.samourai.wallet_194/META-INF: CERT.SF
Only in /tmp/fromPlay_com.samourai.wallet_194/META-INF: MANIFEST.MF

Revision, tag (and its signature):

===== End Results =====
```

**Update 2022-11-02**: As of now, {{ page.title }} is the
{% include verdictBadge.html verdict='nonverifiable' type='short' %} product
with the most users so we gave it yet another spin for their version `0.99.98f`
with hash `0a5711195d96f13f41a71107f1b1035505b33afd3a299828e43e9d1b5101e9c0`
even though the related issue is closed without resolution. Compilation was easy:

```
$ git clone https://code.samourai.io/wallet/samourai-wallet-android.git
$ cd samourai-wallet-android/
$ git checkout 0.99.98f
$ podman run -it --rm -v$PWD:/mnt --workdir=/mnt walletscrutiny/android
root@374550c30c4e:/mnt# apt update; apt install openjdk-11-jdk; ./gradlew assembleRelease
```

As always, the binaries from Play Store and compilation do not match:

```
$ unzip -d fromDownload path/to/Samourai\ 0.99.98f\ \(com.samourai.wallet\).apk
$ unzip -d fromBuild app/build/outputs/apk/production/release/app-production-release-unsigned.apk
$ diff -r from*
Binary files fromBuild/assets/dexopt/baseline.prof and fromDownload/assets/dexopt/baseline.prof differ
Binary files fromBuild/classes2.dex and fromDownload/classes2.dex differ
Only in fromDownload/META-INF: CERT.RSA
Only in fromDownload/META-INF: CERT.SF
Only in fromDownload/META-INF: MANIFEST.MF
```

While the bottom three lines are expected due to the signature, the other two
are not ok. This product is **not verifiable**.

**Update 2021-10-07**: [Erik Nylund](https://twitter.com/Erik_Nylund) reached
out to let us know of his failed attempt to reproduce this app. He wrote he
also took a look at the Samourai Wallet v0.99.97a. It seems *"the number of files
is way smaller now but still quite a diff in classes2.dex"*. He also sent
[a link to a log of his attempt](https://gist.github.com/eriknylund/c2727d036152c901b0251c93e9c78ab4).

**Update 2021-08-02**: Samourai is currently certainly not reproducible as it's
even not possible to build it - due to an issue reported two months ago. We
tried to build it again, as the Samourai devs don't get tired to lie about the
project's reproducibility and we
[tried it again](https://twitter.com/LeoWandersleb/status/1422035180794089473).


**Update 2021-03-02**: Samourai [claims](https://twitter.com/SamouraiWallet/status/1366582280895004672)
to be on F-Droid, implying ... what exactly? FDroid.org has very strict rules
about code being open source but FDroid itself is also open source and allows to
add secondary repositories that might apply different rules and standards and
that's exactly what's happening here. FDroid.org does not list Samourai but
the Copperhead FDroid repository apparently does. As long as the binary on
Google Play is not the same as the one on Copperhead, the presence on Copperhead
has no relevance to the security of the 100k users that downloaded the app from
Google Play. Smoke and mirrors from Samourai as always.

**Update 2020-08-02**: Samourai [claims](https://twitter.com/SamouraiWallet/status/1289942465047396352)

![](/images/samouraiTweetLie.png)

which is a direct claim of falsehood of our findings. No other neutral party
supported this claim so far and neither did the provider explain how such
a verification should work or where our findings are wrong. This is so far the
clearest lie and thus red flag about this wallet.

**Update 2019-12-27**: The provider closed
[the issue we had opened on their repository](https://github.com/Samourai-Wallet/samourai-wallet-android/issues/376).

**Update 2019-12-16**: Samourai
[tweeted](https://twitter.com/SamouraiWallet/status/1206521035689996291) in
response to us:

> [@SamouraiWallet](https://twitter.com/SamouraiWallet) Replying to
  [@BashCo_](https://twitter.com/BashCo_) deterministic builds have not been a
  priority or goal at this stage of dev using the resources we have. The goals
  we have focused on (privacy, dojo, whirlpool, etc) we have continued to
  deliver on. There is limited value in this investment without expert audits
  for each release

**The original review**:

Samourai is still "early access" which means that there are no Google ratings or
comments.

Their website claims the wallet is non-custodial:

> Be your own Swiss Bank
> Fully non custodial software ensures you are always in control of your private
keys. No email address, no ID checks, and no hassle. Just install and go.

Given claims like:

> We are privacy activists who have dedicated our lives to creating the software
that Silicon Valley will never build, the regulators will never allow, and the
VC's will never invest in. We build the software that Bitcoin deserves.

we are not surprised to not find who is behind this wallet.

But the build instructions on their GitHub are fairly simple:

> Import as Android Studio project. Should build "as is".

so lets see what we get when we do this:


```
/tmp/$ git clone git@github.com:Samourai-Wallet/samourai-wallet-android.git
/tmp/$ cd samourai-wallet-android
/tmp/samourai-wallet-android$ git tag
0.81
0.99.27-gb
0.99.87
0.99.88
/tmp/samourai-wallet-android$ git checkout 0.99.88
```

We open the folder in
[Android Studio](https://developer.android.com/studio/index.html), set the
*Build Variants* as follows:

![Samourai Build Variants](/images/samouraiBuildVariants.png)

and build the APK.

The following is the full output of diffoscope. Red lines are what the playstore
version misses compared to the self compiled version and green lines are
additions. Right in the beginning we see the expected lines:
`META-INF/MANIFEST.MF` is different, `META-INF/CERT.RSA` and `META-INF/CERT.SF`
are exclusive to the playstore version as should be.

The rest of the diff is what makes the build **not verifiable**.

We left all the diff
[here](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/blob/6ab76372/_android/com.samourai.wallet.md)
(The diff was part of the review itself but that caused issues on some browsers.)
for the more curious to investigate but it's obviously
too much to consider acceptable like we might conclude if it was only the `.png`
files that were different.
