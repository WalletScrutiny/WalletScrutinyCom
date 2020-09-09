---
title: "BRD Bitcoin Wallet. Buy BTC Bitcoin Cash, Ethereum"
altTitle: 

users: 1000000
appId: com.breadwallet
launchDate: 2016-07-21
latestUpdate: 2020-08-28
apkVersionName: "4.4.4"
stars: 4.0
ratings: 13229
reviews: 5599
size: 23M
website: https://brd.com/
repository: https://github.com/breadwallet/breadwallet-android
issue: https://github.com/breadwallet/breadwallet-android/issues/117
icon: com.breadwallet.jpg
bugbounty: 
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2019-12-16
reviewStale: true
signer: 
reviewArchive:


providerTwitter: BRDHQ
providerLinkedIn: company/brdhq
providerFacebook: brdhq
providerReddit: brdapp

redirect_from:
  - /brd/
  - /com.breadwallet/
  - /posts/2019/11/brd/
  - /posts/com.breadwallet/
---


This wallet claims not to be custodial and we found its supposed
[source code](https://github.com/breadwallet/breadwallet-android)
but we found no claim of verifiability and so verification was difficult.

**Update:** The team reacted quickly to our reach-out after our first analysis via
[this issue](https://github.com/breadwallet/breadwallet-android/issues/117) on
their GitHub.

Now we find a tag `build-3.14.3.3` and can try to compile that:

```
$ git tag | grep 3.14.3
build-3.14.3.3
$ git checkout build-3.14.3.3
...
HEAD is now at a332b4d5 Merge branch 'pablobu/DROID-1497' into 'release/3.14.3'
$ git submodule update --init --recursive
$ docker run -v $PWD:/mnt -it beevelop/cordova bash
root@e34a31867b99:/tmp# cd /mnt/
root@e34a31867b99:/mnt# yes | $ANDROID_HOME/tools/bin/sdkmanager "platforms;android-28"
root@e34a31867b99:/mnt# ./gradlew :app:assemble
root@e34a31867b99:/mnt# ls app/build/outputs/apk/brd/release/*.apk
brd-release-3.14.2.1.apk  output.json
```

Now that doesn't look promising, given we need version `3.14.3` and indeed the
diff is huge and goes across many code files.

The content of AboutActivity for example confirms its the wrong version. Many of the
differences look harmless like this:

```
diff -r fromBuild/smali/com/breadwallet/presenter/activities/settings/AboutActivity.smali fromPlayStore/smali/com/breadwallet/presenter/activities/settings/AboutActivity.smali
157c157
<     const-string v4, "3.14.2"
---
>     const-string v4, "3.14.3"
```

But with these diffs we can't give it a pass:

```
Binary files fromBuild/lib/arm64-v8a/libcore.so and fromPlayStore/lib/arm64-v8a/libcore.so differ
Binary files fromBuild/lib/armeabi-v7a/libcore.so and fromPlayStore/lib/armeabi-v7a/libcore.so differ
Binary files fromBuild/lib/x86/libcore.so and fromPlayStore/lib/x86/libcore.so differ
Binary files fromBuild/lib/x86_64/libcore.so and fromPlayStore/lib/x86_64/libcore.so differ
```

Diffoscope yields user directories in its 397662 lines of diff:

```
│ ├── readelf --wide --decompress --hex-dump=.rodata {}
│ │ @@ -1,7610 +1,7450 @@
│ │  
│ │  Hex dump of section '.rodata':
│ │ -  0x001622e0 2f557365 72732f61 6a762f64 6576656c /Users/ajv/devel
│ │ -  0x001622f0 2f627265 61647761 6c6c6574 2d616e64 /breadwallet-and
│ │ -  0x00162300 726f6964 2f636f72 652f4a61 76612f43 roid/core/Java/C
│ │ -  0x00162310 6f72652f 7372632f 6d61696e 2f637070 ore/src/main/cpp
│ │ -  0x00162320 2f636f72 652f7375 70706f72 742f4252 /core/support/BR
```

This looks like NDK being the culprit for part of the diff, apart from it being
the wrong version. Hopefully with Docker this can be improved.

Our verdict
-----------

We conclude that we hope for a quick resolution of the issues but for now
this wallet remains **not verifiable**.