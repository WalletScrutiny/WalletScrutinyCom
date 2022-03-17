---
wsId: 
title: "Lunes Wallet  - Lunes, Bitcoin, Litecoin,  Buy BTC"
altTitle: 
authors:
- leo
users: 10000
appId: com.luneswallet
appCountry: 
released: 2018-01-31
updated: 2018-12-06
version: "2.1"
stars: 4.1
ratings: 272
reviews: 184
size: 7.3M
website: https://luneswallet.app
repository: https://github.com/Lunes-platform/Wallet-mobile
issue: https://github.com/Lunes-platform/Wallet-mobile/issues/9
icon: com.luneswallet.png
bugbounty: 
meta: defunct
verdict: nosource
date: 2021-12-29
signer: 
reviewArchive:
- date: 2020-08-29
  version: "2.1"
  appHash: 
  gitRevision: 477c4edc4f632895993602574ba383a08df9041f
  verdict: nonverifiable
twitter: 
social:
redirect_from:
  - /com.luneswallet/
  - /posts/com.luneswallet/
---

**Update 2021-07-15:** As [Emanuel](/authors/emanuel) already
[noticed in March '21](https://github.com/Lunes-platform/Wallet-mobile/issues/9),
this provider did not release the source of the latest version. Without source,
the app is **not verifiable**.

**Update 2020-08-30:** [Alan Gabriel](https://gitlab.com/alangabriel) offered a link to
[this repository](https://github.com/Lunes-platform/Wallet-mobile) in
[our issue tracker](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/68#note_404231902).

Indeed that looks like the wallet's source code but the Readme.md doesn't look
like a well maintained project. The first line `<<<<<<< HEAD` is the residue
from a merge gone bad.

Given the last change is more than 2 years old and it looks like an abandoned
project and there are no build instructions for a production release, we give up
after this error:

```
$ git clone https://github.com/Lunes-platform/Wallet-mobile
$ cd Wallet-mobile/
$ docker run -it --volume $PWD:/mnt --workdir /mnt --rm walletscrutiny/android:4 bash
# apt update && apt install nodejs npm -y
# npm install
# cd android/
# ./gradlew assembleRelease
...
FAILURE: Build failed with an exception.

* Where:
Build file '/mnt/node_modules/react-native-linear-gradient/android/build.gradle' line: 21

* What went wrong:
A problem occurred evaluating project ':react-native-linear-gradient'.
> Could not find method compileOnly() for arguments [com.facebook.react:react-native:+] on object of type org.gradle.api.internal.artifacts.dsl.dependencies.DefaultDependencyHandler.
```

and consider it **not verifiable**.
