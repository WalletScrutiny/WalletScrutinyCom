---
title: "Zap: Bitcoin Lightning Wallet"
altTitle: 

users: 5000
appId: zapsolutions.zap
launchDate: 
latestUpdate: 2020-10-03
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
verdict: nonverifiable # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2019-12-30
reviewStale: true
signer: 
reviewArchive:


providerTwitter: ln_zap
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /zapsolutions.zap/
  - /posts/zapsolutions.zap/
---


Their description

> Manage your private keys, multiple wallets, and open channels, to get
  connected with peers on the Lightning Network and start transacting today.

sounds non-custodial.

On their website we find [their GitHub repository](https://github.com/LN-Zap/zap-android)
and there a bit hidden, the [build instructions](https://github.com/LN-Zap/zap-android/blob/master/docs/INSTALL.md#build-apk-and-install-it-later-on-phone).

So let's try this without Android Studio, as we don't want to automate clicking
buttons in Android Studio ...

For my phone Google Play offers to download version `0.2.11-alpha`.

```
$ cd zap-android/
$ git tag | grep 0.2.11
v0.2.11-alpha
$ git checkout v0.2.11-alpha 
$ docker run --rm -it --volume=$PWD:/mnt --workdir /mnt mreichelt/android:latest bash
root@84c836f4577a:/mnt# ./gradlew bundleRelease
root@84c836f4577a:/mnt# mv app/build/outputs/apk/release/zap-android-0.2.11-alph* .
root@84c836f4577a:/mnt# exit
$ ls *.apk
'zap-android-0.2.11-alpha(17)-arm64-v8a-release-unsigned.apk'  'zap-android-0.2.11-alpha(17)-armeabi-v7a-release-unsigned.apk'
```

So ... this is a problem. The version "Varies with device" as we already noticed
on the Playstore description. App providers can publish a different app for you
than they publish for me, so me verifying a build gives you not much of
information. This is why we are also working on a
[tool to collect APKs](https://gitlab.com/walletscrutiny/walletscrutinyandroid)
that hopefully soon will detect which version you downloaded, check if it was
already verified to match the published code and upload it to us if not.

Should we be able to verify the one APK but naturally not the other, this should
be our top priority to work on.

```
$ apktool d -o fromBuild-arm64-v8a 'zap-android-0.2.11-alpha(17)-arm64-v8a-release-unsigned.apk'
$ apktool d -o fromBuild-armeabi-v7a 'zap-android-0.2.11-alpha(17)-armeabi-v7a-release-unsigned.apk'
$ apktool d -o fromPlay Zap\ 0.2.11-alpha\ \(zapsolutions.zap\).apk 
$ diff --brief --recursive fromPlay/ fromBuild-armeabi-v7a/
Files fromPlay/apktool.yml and fromBuild-armeabi-v7a/apktool.yml differ
Only in fromPlay/lib: arm64-v8a
Only in fromBuild-armeabi-v7a/lib: armeabi-v7a
```

... so my phone installed the `arm64` version but as

```
$ diff --brief --recursive fromPlay/ fromBuild-arm64-v8a/
Files fromPlay/apktool.yml and fromBuild-arm64-v8a/apktool.yml differ
Files fromPlay/lib/arm64-v8a/libiconv.so and fromBuild-arm64-v8a/lib/arm64-v8a/libiconv.so differ
Files fromPlay/lib/arm64-v8a/libzbarjni.so and fromBuild-arm64-v8a/lib/arm64-v8a/libzbarjni.so differ
Only in fromPlay/original/META-INF: CERT.RSA
Only in fromPlay/original/META-INF: CERT.SF
Files fromPlay/original/META-INF/MANIFEST.MF and fromBuild-arm64-v8a/original/META-INF/MANIFEST.MF differ
Files fromPlay/res/drawable-hdpi/ic_icon_modal_on_chain.png and fromBuild-arm64-v8a/res/drawable-hdpi/ic_icon_modal_on_chain.png differ
Files fromPlay/res/drawable-ldpi/ic_icon_modal_on_chain.png and fromBuild-arm64-v8a/res/drawable-ldpi/ic_icon_modal_on_chain.png differ
Files fromPlay/res/drawable-mdpi/ic_icon_modal_on_chain.png and fromBuild-arm64-v8a/res/drawable-mdpi/ic_icon_modal_on_chain.png differ
Files fromPlay/res/drawable-xhdpi/ic_icon_modal_on_chain.png and fromBuild-arm64-v8a/res/drawable-xhdpi/ic_icon_modal_on_chain.png differ
Files fromPlay/res/drawable-xxhdpi/ic_icon_modal_on_chain.png and fromBuild-arm64-v8a/res/drawable-xxhdpi/ic_icon_modal_on_chain.png differ
Files fromPlay/res/drawable-xxxhdpi/ic_icon_modal_on_chain.png and fromBuild-arm64-v8a/res/drawable-xxxhdpi/ic_icon_modal_on_chain.png differ
Files fromPlay/res/raw/country_list.json and fromBuild-arm64-v8a/res/raw/country_list.json differ
Files fromPlay/res/raw/currency_list.json and fromBuild-arm64-v8a/res/raw/currency_list.json differ
Files fromPlay/smali/com/squareup/okhttp/internal/DiskLruCache$2.smali and fromBuild-arm64-v8a/smali/com/squareup/okhttp/internal/DiskLruCache$2.smali differ
Files fromPlay/smali/com/squareup/okhttp/internal/framed/FramedStream$FramedDataSource.smali and fromBuild-arm64-v8a/smali/com/squareup/okhttp/internal/framed/FramedStream$FramedDataSource.smali differ
Files fromPlay/smali_classes2/io/grpc/internal/DelayedStream$DelayedStreamListener.smali and fromBuild-arm64-v8a/smali_classes2/io/grpc/internal/DelayedStream$DelayedStreamListener.smali differ
```

contains more than the expected two to three files about the signature, this is
not a clean reproducible build.

Our verdict: **not verifiable**.
