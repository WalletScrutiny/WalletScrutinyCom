---
wsId: bither
title: Bither - Bitcoin Wallet
altTitle: 
authors:
- leo
- emanuel
- keraliss
users: 50000
appId: net.bither
appCountry: 
released: 2014-02-27
updated: 2024-11-21
version: 2.1.7
stars: 4.1
ratings: 335
reviews: 30
website: http://Bither.net
repository: https://github.com/bither/bither-android
issue: https://github.com/bither/bither-android/issues/69
icon: net.bither.png
bugbounty: 
meta: ok
verdict: obfuscated
appHashes: 
date: 2024-11-07
signer: 
twitter: 
social: 
redirect_from: 
developerName: getcai
features: 

---

**Update 2024-10-09**: We tried again to build and compare the results. Again we
found a huge diff.

And again, building was a pain as the build instructions are still not updated
and I went with a slight modification of Keraliss' dockerfile:

```
$ podman build --rm -t bither -f ./scripts/test/android/net.bither.dockerfile
$ podman run --rm --volume $PWD:/mnt -it localhost/bither:latest cp bither-android/build/outputs/apk/release/bither-android-release-unsigned.apk /mnt/
$ unzip -qqd fromBuild bither-android-release-unsigned.apk 
$ unzip -qqd fromGoogle Bither\ 2.1.5.apk 
$ diff --brief --recursive from*
Files fromBuild/lib/arm64-v8a/libbitherjni.so and fromGoogle/lib/arm64-v8a/libbitherjni.so differ
Files fromBuild/lib/arm64-v8a/libjpegbither.so and fromGoogle/lib/arm64-v8a/libjpegbither.so differ
Files fromBuild/lib/arm64-v8a/libscrypt.so and fromGoogle/lib/arm64-v8a/libscrypt.so differ
Only in fromGoogle/META-INF: CERT.RSA
Only in fromGoogle/META-INF: CERT.SF
Only in fromGoogle/META-INF: MANIFEST.MF
Files fromBuild/res/9w.png and fromGoogle/res/9w.png differ
Files fromBuild/res/cG.png and fromGoogle/res/cG.png differ
Files fromBuild/res/dC.png and fromGoogle/res/dC.png differ
Files fromBuild/res/e8.png and fromGoogle/res/e8.png differ
Files fromBuild/res/Ib.png and fromGoogle/res/Ib.png differ
Files fromBuild/res/IF.9.png and fromGoogle/res/IF.9.png differ
Files fromBuild/res/wg.png and fromGoogle/res/wg.png differ
Files fromBuild/res/xM.png and fromGoogle/res/xM.png differ
Files fromBuild/res/xT.png and fromGoogle/res/xT.png differ
Files fromBuild/res/Yl.png and fromGoogle/res/Yl.png differ
```

Especially the diff in the .so files is problematic and as minification is used,
we cannot say much about details. This product is **not verifiable**.

The years old issue was updated accordingly.

## Old Analysis

This app is an open source Bitcoin wallet with most of its information to be
found not on their website but in the App description and on GitHub.

There they clearly claim:

> Bither Cold Wallet<br>
  Features:<br>
  1. Cold wallet running on offline mode (Backup phone).

and with an offline wallet, the private key clearly has to live exclusively on
that Cold Wallet phone, making the product a non-custodial wallet.

But can we reproduce the build?
[There are build instructions](https://github.com/bither/bither-android/wiki/bulid-bither-android). Let's see how that goes. Those instructions are from 2015 ...

```
$ git clone git@github.com:bither/bither-android.git --recursive
$ cd bither-android/
```

...

> You must use gradle (v1.10)

... that's scary. `v1.10` is [from 2013](https://gradle.org/releases/). So as we
won't install gradle system-wide on version `1.10`, we hop into docker now:

```
$ docker run --rm -v$PWD:/mnt --workdir=/mnt -it walletscrutiny/android bash
root@72c683aa390c:/mnt# apt update
root@72c683aa390c:/mnt# apt install gradle          
root@72c683aa390c:/mnt# gradle wrapper
root@72c683aa390c:/mnt# sed -i 's/4.4.1/1.10/g' gradle/wrapper/gradle-wrapper.properties 
root@72c683aa390c:/mnt# ./gradlew assembleRelease
Downloading https://services.gradle.org/distributions/gradle-1.10-bin.zip
......................................
Unzipping /root/.gradle/wrapper/dists/gradle-1.10-bin/948peyqp7eyfqxj7mcl7th1vs/gradle-1.10-bin.zip to /root/.gradle/wrapper/dists/gradle-1.10-bin/948peyqp7eyfqxj7mcl7th1vs
Set executable permissions for: /root/.gradle/wrapper/dists/gradle-1.10-bin/948peyqp7eyfqxj7mcl7th1vs/gradle-1.10/bin/gradle
To honour the JVM settings for this build a new JVM will be forked. Please consider using the daemon: http://gradle.org/docs/1.10/userguide/gradle_daemon.html.

FAILURE: Build failed with an exception.

* Where:
Build file '/mnt/build.gradle' line: 1

* What went wrong:
A problem occurred evaluating root project 'mnt'.
> org/gradle/initialization/BuildCompletionListener

* Try:
Run with --stacktrace option to get the stack trace. Run with --info or --debug option to get more log output.

BUILD FAILED

Total time: 3 mins 46.707 secs
```

Poking around we see:

```
root@72c683aa390c:/mnt# cat build.gradle 
...
buildscript {
    ...
    dependencies {
        classpath 'com.android.tools.build:gradle:2.3.2'
```

and this gradle plugin
[requires gradle 3.3+](https://developer.android.com/studio/releases/gradle-plugin),
not 1.10. The build instructions are clearly lacking and this is where we give
up. This wallet is **not verifiable**.

To make matters worse, the app also uses proguard obfuscation:

```
root@72c683aa390c:/mnt# cat bither-android/build.gradle 
...
android {
    ...
    buildTypes {
        release {
            minifyEnabled true
            proguardFiles getDefaultProguardFile('proguard-android.txt'), 'proguard-rules.pro'
        }
```

