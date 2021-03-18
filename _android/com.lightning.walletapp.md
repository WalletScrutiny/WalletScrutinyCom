---
wsId: 
title: "BLW: Bitcoin and Lightning Wallet"
altTitle: 
authors:
- leo
users: 10000
appId: com.lightning.walletapp
launchDate: 2018-05-01
latestUpdate: 2021-03-13
apkVersionName: "0.4.8"
stars: 3.8
ratings: 344
reviews: 223
size: 4.9M
website: http://lightning-wallet.com
repository: https://github.com/btcontract/lnwallet
issue: https://github.com/btcontract/lnwallet/issues/20
icon: com.lightning.walletapp.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-05-11
reviewStale: true
signer: 
reviewArchive:
- date: 2019-11-23
  version: "0.4"
  apkHash: 
  gitRevision: e511edf295583aebceb624641e41f26e73064022
  verdict: nonverifiable

providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /bictcoinlightningwallet/
  - /com.lightning.walletapp/
  - /posts/2019/11/bictcoinlightningwallet/
  - /posts/com.lightning.walletapp/
---


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
