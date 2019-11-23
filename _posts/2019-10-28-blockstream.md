---
title: "Blockstream Green Wallet"

wallet: true
users: 50000
appId: com.greenaddress.greenbits_android_wallet
launchDate: 2015-01-01
latestUpdate: 2019-11-13
apkVersionName: 3.2.7
stars: 4.0
commentCount: 439
permissions:
website: https://blockstream.com/green
repository: https://github.com/Blockstream/green_android/
icon: "images/wallet_icons/greenwallet.png"
bugbounty:
verdict: nonverifiable # May be any of: wip, nowallet, custodial, nosource, nonverifiable, verifiable, bounty, cert1, cert2, cert3

date: 2019-11-23
permalink: /posts/2019/11/greenwallet/
redirect_from:
  - /greenwallet/
tags:
  - Android
  - FOSS
  - Security
---


**Is it custodial?**

From [google play](https://play.google.com/store/apps/details?id=com.greenaddress.greenbits_android_wallet) description we read:
>Blockstream Green is a non-custodial Bitcoin wallet

So they claim to be non-custodial.

**Is it verifiable?**

Nowhere (description on google play, github readme, https://blockstream.com/green/) I was able to found any mentions about verifiability or deterministic builds.

On their [github](https://github.com/Blockstream/green_android/) the latest release is 3.2.7 from November, 13. Same version on google play. So we can try to verify build.
In the [building instructions](https://github.com/Blockstream/green_android/blob/master/BUILD.md), it says there are two options on how to build:

- Use the released native libraries (recommended).
- Cross-compile the native libraries (advanced).

Ideally, it would be to build everything from scratch, but let's try without building gdk from scratch first.

The commands to build are:
```
git clone https://github.com/Blockstream/green_android.git
cd green_android
./gradlew build
```
After running them I got the following:
```
> Task :app:lint FAILED

FAILURE: Build failed with an exception.

* What went wrong:
A problem was found with the configuration of the task ':app:lint'.
> No value has been specified for property 'lintClassPath'.

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output. Run with --scan to get full insights.

* Get more help at https://help.gradle.org

BUILD FAILED in 39s
1 actionable task: 1 executed
```
In the instructions, right after build command the also suggest `./gradlew --tasks`: 
```
You can speed up builds by limiting the tasks which run. Use:

./gradlew --tasks

To see a list of available tasks.
```
so I tried it, hoping there is a possibility to somehow skip :app:lint task, and got the following:
```
./gradlew --tasks

Unknown command-line option '--tasks'.

USAGE: gradlew [option...] [task...]
...
```
I also tried to run `./gradlew tasks` after that and it gave me standard tasks, amongst which no one with "lint" in the name. So I gave up here and attempted to build with docker as they also have provided [the instructions](https://github.com/Blockstream/green_android/blob/master/BUILD.md#rebuilding-with-docker-optional) for.

I run 
```
cd contrib
docker build -t greenbits_docker .
```
which has produced an image without errors, seems like. Some latest rows of the output are
```
...
[=======================================] 100% Unzipping... platform-tools/systrSDK Platform-To
Warning: File /root/.android/repositories.cfg could not be loaded.              
[=======================================] 100% Unzipping... android-10/lib64/lib
Warning: File /root/.android/repositories.cfg could not be loaded.              
[=======================================] 100% Unzipping... android-10/skins/WXG
Warning: File /root/.android/repositories.cfg could not be loaded.              
[=======================================] 100% Unzipping... m2repository/com/goo
Removing intermediate container 9d326f6fe076
 ---> b2c6b9d6a081
Step 4/7 : VOLUME /ga
 ---> Running in a23065bdfee0
Removing intermediate container a23065bdfee0
 ---> 96b70d70a2fa
Step 5/7 : ENV JAVA_HOME=/usr/lib/jvm/adoptopenjdk-8-hotspot-amd64
 ---> Running in b1f72a46a164
Removing intermediate container b1f72a46a164
 ---> 359061eff468
Step 6/7 : ENV ANDROID_HOME=/opt
 ---> Running in 7f7311394475
Removing intermediate container 7f7311394475
 ---> b75b33681ffa
Step 7/7 : CMD cd /ga/app && ./prepare_fdroid.sh && cd /ga && ./gradlew --project-dir=bitcoinj/tools build && ./gradlew assembleRelease
 ---> Running in 2642e08fab7e
Removing intermediate container 2642e08fab7e
 ---> 2d7b9b40c385
Successfully built 2d7b9b40c385
Successfully tagged greenbits_docker:latest
```
And lastly, I run
`docker run -v $PATH_TO_GREENBITS_REPO:/gb greenbits_docker`
replacing $PATH_TO_GREENBITS_REPO with the according path and got the following
```
docker run -v /media/chris/DATA1/code/green_android:/gb greenbits_docker
/bin/sh: 1: cd: can't cd to /ga/app
```
It looks like Dokerfile is composed not correctly.

Given building instructions are not full and no mentions about deterministic builds or verifiability, we conclude that the Blockstream Green Wallet is **not easily verifiable**.