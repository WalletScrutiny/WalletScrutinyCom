---
wsId: 
title: "Bitcoin Wallet"
altTitle: "Bitcoin Wallet by Bitorzo.com"
authors:
- leo
- emanuel
users: 1000
appId: com.bitorzo.wallet
launchDate: 
latestUpdate: 2021-01-03
apkVersionName: "3.1.3"
stars: 4.0
ratings: 26
reviews: 21
size: 12M
website: https://www.bitorzo.io
repository: https://github.com/Bitorzo/Bitorzo
issue: https://github.com/Bitorzo/Bitorzo/issues/2
icon: com.bitorzo.wallet.png
bugbounty: 
verdict: nonverifiable # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-04-11
reviewStale: true
signer: 
reviewArchive:


providerTwitter: 
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:

---


This app is self-custodial:

> Main features:<br>
  - Private keys never leave your device, and strongly encrypted on it!

and a Bitcoin wallet (the app's name is "Bitcoin Wallet").

On their website there's also a link to the
[source code on GitHub](https://github.com/Bitorzo/Bitorzo) and there we can
find ... [build instructions](https://github.com/Bitorzo/Bitorzo#building):

> Android (armeabi-v7a): `flutter build apk`<br>
  Android (arm64-v8a): `flutter build apk --target=android-arm64`

So lets see:

```
$ git clone https://github.com/Bitorzo/Bitorzo
$ cd Bitorzo
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm beevelop/cordova bash
# apt update
# apt install xz-utils -y
# tar xf ./flutter_linux_2.0.1-stable.tar.xz 
# flutter/bin/flutter build apk
...
Because every version of manta_dart from git depends on decimal ^1.0.0 and bitorzo_wallet_flutter depends on decimal ^0.3.5, manta_dart from git is forbidden.
So, because bitorzo_wallet_flutter depends on manta_dart from git, version solving failed.
Running "flutter pub get" in mnt...                                     
pub get failed (1; So, because bitorzo_wallet_flutter depends on manta_dart from git, version solving failed.)
```

This message is slightly different to what
[Emanuel got](https://github.com/Bitorzo/Bitorzo/issues/2) but we both failed to
build the app from the source with the build instructions as provided.

The app is therefore **not verifiable**.
