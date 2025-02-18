---
wsId: 
title: ABCore
altTitle: 
authors:
- leo
- emanuel
users: 1000
appId: com.greenaddress.abcore
appCountry: 
released: 
updated: 2019-10-16
version: VARY
stars: 
ratings: 
reviews: 
website: http://abco.re
repository: https://github.com/greenaddress/abcore
issue: 
icon: com.greenaddress.abcore.png
bugbounty: 
meta: removed
verdict: reproducible
appHashes: 
date: 2024-04-19
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from:
- /com.greenaddress.abcore/
- /posts/com.greenaddress.abcore/
developerName: GreenAddress IT Ltd
features: 

---

**Update 2023-09-10**: While Emanuel did find a newer version `v0.77` on
f-droid and found it to be reproducible, this version might not be on Google
Play. Another finding most relevant for users of this software: It loads further
executables when running so even if there is no backdoor in the product, a
backdoor might be possible through this additionally loaded executable. On
Android 10 and newer, loading executables is not allowed for that reason and
thus this product is
[struggling with modern versions of Android](https://github.com/greenaddress/abcore/issues/97).

This app is a full node for Android, so running it on your phone is probably
not recommended unless you have unlimited data and don't mind your phone
down- and uploading GBs of data at a time.

The provider recommends not to use it as a wallet but to run it to back a wallet
that allows setting custom full nodes.

On their [Git repository](https://github.com/greenaddress/abcore) there are no
build instructions. Lets see how far we get:

The current version on Google Play is `0.76`.

```
$ git clone https://github.com/greenaddress/abcore
$ cd abcore/
$ git checkout v0.76alphaPoC 
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm mycelium-wallet bash
root@455390a45b9d:/mnt# yes | /opt/android-sdk/tools/bin/sdkmanager "build-tools;29.0.2" # this might not be necessary
root@455390a45b9d:/mnt# ./gradlew -x test clean assembleRelease
root@455390a45b9d:/mnt# exit
$ mv app/build/outputs/apk/prod/release/app-prod-release-unsigned.apk .
$ sha256sum fromGPlay.apk # for future reference
c1ecc53c4d3ec880c57167b9e54cb81af3edf5c3088289a8d570f8c5f3717c44  fromGPlay.apk
$ apktool d -o fromBuild app-prod-release-unsigned.apk 
$ apktool d -o fromGoogle fromGPlay.apk 
$ diff --brief --recursive fromGoogle/ fromBuild/
Files fromGoogle/apktool.yml and fromBuild/apktool.yml differ
Only in fromGoogle/original/META-INF: ABCORE.RSA
Only in fromGoogle/original/META-INF: ABCORE.SF
Files fromGoogle/original/META-INF/MANIFEST.MF and fromBuild/original/META-INF/MANIFEST.MF differ
```

This looks good. This app is **reproducible**.

(As the provider doesn't recommend using this app as a wallet and as it uses
tons of resources, please investigate well if you want to use this as an actual
wallet on your phone or maybe better only as a bitcoin full node on your Android
TV.)
