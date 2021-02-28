---
wsId: zapwallet
title: "Zap: Bitcoin Lightning Wallet"
altTitle: 

users: 5000
appId: zapsolutions.zap
launchDate: 
latestUpdate: 2021-02-13
apkVersionName: "Varies with device"
stars: 
ratings: 
reviews: 
size: Varies with device
website: http://zap.jackmallers.com
repository: https://github.com/LN-Zap/zap-android
issue: https://github.com/LN-Zap/zap-android/issues/161
icon: zapsolutions.zap.png
bugbounty: 
verdict: reproducible # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2020-12-22
reviewStale: true
signer: 
reviewArchive:
- date: 2019-12-30
  version: "0.2.11"
  apkHash: 
  gitRevision: 9c088d356d066f33c3e3d8fa21bc7d74082c1118
  verdict: nonverifiable

providerTwitter: ln_zap
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /zapsolutions.zap/
  - /posts/zapsolutions.zap/
---


This app is a remote control for lnd, the lightning network daemon. As such it
is not exactly a wallet in the sense of many other wallets here as the lnd
connected to, also has control over the funds but in a setup where you connect
to your own lnd, Zap gets into the position of being able to steal your funds.
If you have strong objections with the classification as a wallet, please open
an issue on our GitLab.

This app was not reproducible but the provider recently
[let us know](https://github.com/LN-Zap/zap-android/issues/161#issuecomment-748204880)
that version `0.3.8` would be reproducible.

Today we got the `0.3.8` update from Google Play, too, so here is another
attempt at reproducing Zap:

```
$ cd /tmp
$ git clone https://github.com/LN-Zap/zap-android
$ cd zap-android/
$ git checkout v0.3.8-beta
$ docker run --rm -it --volume=$PWD:/mnt --workdir /mnt mreichelt/android:latest bash
root@20b0f7c2e660:/mnt# ./gradlew assembleRelease
...
BUILD SUCCESSFUL in 1m 35s
29 actionable tasks: 29 executed
root@20b0f7c2e660:/mnt# mv app/build/outputs/apk/release/zap-android-0.3.8-beta* .
root@20b0f7c2e660:/mnt# exit
$ cd ..
$ apktool d -o fromBuild zap-android/zap-android-0.3.8-beta\(26\)-release-unsigned.apk 
$ apktool d -o fromGoogle path/to/Zap\ 0.3.8-beta\ \(zapsolutions.zap\).apk 
$ diff --brief --recursive fromBuild/ fromGoogle/
Files fromBuild/apktool.yml and fromGoogle/apktool.yml differ
Only in fromGoogle/original/META-INF: CERT.RSA
Only in fromGoogle/original/META-INF: CERT.SF
Files fromBuild/original/META-INF/MANIFEST.MF and fromGoogle/original/META-INF/MANIFEST.MF differ
```

and that's what we want to see to give the app the verdict **reproducible**.
