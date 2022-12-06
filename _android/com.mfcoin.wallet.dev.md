---
wsId: 
title: MFCoin wallet
altTitle: 
authors: 
users: 1000
appId: com.mfcoin.wallet.dev
appCountry: 
released: 2018-03-22
updated: 2020-10-04
version: v4.0.0
stars: 
ratings: 
reviews: 
size: 
website: http://mfcoin.net
repository: 
issue: 
icon: com.mfcoin.wallet.dev.png
bugbounty: 
meta: obsolete
verdict: obfuscated
date: 2022-11-02
signer: 
reviewArchive: 
twitter: MFC_tech
social:
- https://www.linkedin.com/company/groups/13539593
- https://www.facebook.com/groups/mfcoin
redirect_from: 

---

> * Native support for bitcoin and most major altcoins
> * Your private keys never leave your device. Strong wallet encryption and
    cryptography guarantee that your funds will remain safe under your ultimate control.

So it claims to be a self-custodial Bitcoin wallet.

On their website there is a link to [their GitHub](https://github.com/MFrcoin/android-wallet)
and the [Build Instructions](https://github.com/MFrcoin/android-wallet/blob/master/Build.md).
Those reveal that we are dealing here with a {% include walletLink.html wallet='android/com.coinomi.wallet' %}
clone.

Let's see ... they ask us to change the app name to "Coinomi" etc. That can't be
right. Let's see if the latest version is available. On Google Play we find
"v4.0.0" while the build instructions end at "1.6.2". The repository does have
a "v4.0.0" tag though. Let's see ...

```

$ git clone https://github.com/MFrcoin/android-wallet mfcoin
$ cd mfcoin/
$ git checkout v4.0.0 
$ docker run --rm -v$PWD:/mnt --workdir=/mnt -it walletscrutiny/android bash
root@4481bcaf30f3:/mnt# ./gradlew :wallet:assembleRelease
...
BUILD SUCCESSFUL in 1m 15s
27 actionable tasks: 27 executed
root@4481bcaf30f3:/mnt# exit
$ unzip 'MFCoin wallet v4.0.0 (com.mfcoin.wallet.dev).apk' -d fromGPlay
$ for f in $( ls wallet/build/outputs/apk/release/*.apk ); do k=$(basename $f); unzip $f -d $k; done
$ for f in $( ls wallet/build/outputs/apk/release/*.apk ); do k=$(basename $f);echo $k $(diff --brief --recursive $k fromGPlay/ | wc -l); done
wallet-arm64-v8a-release-unsigned.apk 124
wallet-armeabi-v7a-release-unsigned.apk 125
wallet-universal-release-unsigned.apk 125
wallet-x86_64-release-unsigned.apk 124
wallet-x86-release-unsigned.apk 125
```

so all the 5 built files contents differ in over 120 files from the apk on Google Play.

To make matters worse, the project also uses minification which is a form of
**obfuscation**:

```
$ cat wallet/build.gradle
...
android {
  ...
  buildTypes {
    release {
      minifyEnabled true
```

so this app is **not verifiable**.
