---
wsId: 
title: 'BLW: Bitcoin and Lightning Wal'
altTitle: 
authors:
- leo
users: 10000
appId: com.lightning.walletapp
appCountry: 
released: 2018-05-01
updated: 2021-03-13
version: 0.4.8
stars: 4.2
ratings: 368
reviews: 61
website: http://lightning-wallet.com
repository: https://github.com/btcontract/lnwallet
issue: https://github.com/btcontract/lnwallet/issues/20
icon: com.lightning.walletapp.png
bugbounty: 
meta: removed
verdict: nosource
appHashes: []
date: 2024-04-19
signer: 
reviewArchive:
- date: 2021-08-21
  version: 0.4.4
  appHashes:
  - ffcffa9d3053590b98f845622ab5a4748023245fbacc48f6798ca9ff753f86c6
  gitRevision: 6b9f4e0124b3b4f7d4daa2425d704af536624d90
  verdict: ftbfs
- date: 2019-11-23
  version: '0.4'
  appHashes: []
  gitRevision: e511edf295583aebceb624641e41f26e73064022
  verdict: nonverifiable
twitter: 
social: 
redirect_from:
- /bictcoinlightningwallet/
- /com.lightning.walletapp/
- /posts/2019/11/bictcoinlightningwallet/
- /posts/com.lightning.walletapp/
developerName: anton kumaigorodski
features:
- ln

---

**Update 2023-09-22**: While this app is deprecated in favor of another app and
obsolete with no updates in years, its verdict is not accurate. As documented in
[this issue](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/166),
Emanuel managed to build the app in its current version `0.4.8` but the build
result differed significantly from what we could download from Google Play.

But ... is the version from Google Play the same as the version from f-droid? As
it turns out, it is not. We downloaded both and they have different hashes. The
first one is from Google Play:

```
$ sha256sum ~/wsTest/BLW\ 0.4.8\ \(com.lightning.walletapp\).apk ~/com.lightning.walletapp_159.apk 
541c8f22340b5b66b4d94cde5863e765e1029d3b99fb62fcf01e5d97cb90ffc5  /home/leo/wsTest/BLW 0.4.8 (com.lightning.walletapp).apk
676d073f8418277042d584dd184da1b0054148ba4ae30156f51772d819861009  /home/leo/com.lightning.walletapp_159.apk
```

and ... f-droid [claims](https://f-droid.org/en/packages/com.lightning.walletapp/):

> The source code is no longer available

Seriously? Well, indeed, the repository we had on file -
https://github.com/btcontract/lnwallet/issues/20 is no longer available, making
the product **not verifiable**.

**Update 2021-08-21**: The provider
[stated here](https://github.com/btcontract/lnwallet/issues/20#issuecomment-902663980)
that this product was discontinued and its successor is
{% include walletLink.html wallet='android/com.btcontract.wallet' verdict='true' %}

So the provider contacted us and 
[cleared many issues](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/106)
we had in our first review. Let's see how far we get this time ...

First thing we notice is that there are still no build instructions on the
[GitHub page](https://github.com/btcontract/lnwallet) but according to above
issue it's simple enough:

The version we got from Google Play is this:

```
$ sha256sum BLW.apk 
ffcffa9d3053590b98f845622ab5a4748023245fbacc48f6798ca9ff753f86c6  BLW.apk
$ apktool d -o BLW BLW.apk 
$ cat BLW/apktool.yml | grep "versionCode\|versionName"
  versionCode: '150'
  versionName: 0.4.4
```

So ...

```
$ git clone https://github.com/btcontract/lnwallet.git
$ cd lnwallet
$ git tag
0.4-146
0.4.1
0.4.1-147
0.4.2
0.4.3
0.4.4
$ git checkout 0.4.4 
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm mycelium-wallet bash 
# wget https://downloads.gradle-dn.com/distributions/gradle-3.3-bin.zip
# unzip gradle-3.3-bin.zip
# /opt/android-sdk/tools/bin/sdkmanager ndk-bundle
# ./gradle-3.3/bin/gradle assembleDebug
Parallel execution is an incubating feature.
Checking the license for package CMake 3.6.4111459 in /opt/android-sdk/licenses
License for package CMake 3.6.4111459 accepted.
Preparing "Install CMake 3.6.4111459 (revision: 3.6.4111459)".
"Install CMake 3.6.4111459 (revision: 3.6.4111459)" ready.
Finishing "Install CMake 3.6.4111459 (revision: 3.6.4111459)"
Installing CMake 3.6.4111459 in /opt/android-sdk/cmake/3.6.4111459
"Install CMake 3.6.4111459 (revision: 3.6.4111459)" complete.
"Install CMake 3.6.4111459 (revision: 3.6.4111459)" finished.
Incremental java compilation is an incubating feature.

FAILURE: Build failed with an exception.

* What went wrong:
A problem occurred configuring project ':app'.
> No toolchains found in the NDK toolchains folder for ABI with prefix: mips64el-linux-android

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.

BUILD FAILED
```

Which is again the [known issue](https://stackoverflow.com/a/52204135/969478)
from last time: The
gradle version is outdated. It should be 3.1 or above but is defined as

```
# cat build.gradle | grep "tools\.build"
        classpath 'com.android.tools.build:gradle:2.3.0'
```

So if there is a good reason for using an old gradle version (2.3 is from
[early 2015](https://gradle.org/releases/)), the team should explain that.

Sadly we again fail to compile due to lack of sufficiently clear build
instructions and come to the verdict **not verifiable**.
