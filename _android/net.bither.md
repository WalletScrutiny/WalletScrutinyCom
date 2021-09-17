---
wsId: bither
title: "Bither - Bitcoin Wallet"
altTitle: 
authors:

users: 50000
appId: net.bither
released: 2014-02-27
updated: 2021-07-05
version: "2.0.1"
stars: 3.7
ratings: 326
reviews: 170
size: 4.4M
website: https://bither.net
repository: https://github.com/bither/bither-android
issue: https://github.com/bither/bither-android/issues/69
icon: net.bither.png
bugbounty: 
verdict: obfuscated
date: 2021-03-03
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


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

