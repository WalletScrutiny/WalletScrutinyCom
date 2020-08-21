---
title: "Phoenix | The Bitcoin wallet from the future"
altTitle: 

users: 5000
appId: fr.acinq.phoenix.mainnet
launchDate: 2019-12-10
latestUpdate: 2020-08-01
apkVersionName: "1.3.3"
stars: 4.6
ratings: 131
reviews: 61
size: 33M
website: https://phoenix.acinq.co
repository: https://github.com/ACINQ/phoenix
issue: https://github.com/ACINQ/phoenix/issues/20
icon: fr.acinq.phoenix.mainnet.png
bugbounty: 
verdict: reproducible # May be any of: wip, fewusers, nowallet, nobtc, custodial, nosource, nonverifiable, reproducible, bounty, defunct
date: 2020-08-14
reviewStale: true
signer: ed550bd5d607d342b61bbbbb94ffd4dde43f845171f63d3ae47573a95a132629
reviewArchive:
- date: 2020-01-13
  version: "1.3.1"
  apkHash: 0c91c5f118f88b9715d20323799d5002b722115d01c95d11f20f088521f76ada
  gitRevision: 9abba57f047955e9991baa269f2082e8f3374f95
  verdict: nonverifiable

providerTwitter: PhoenixWallet
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /fr.acinq.phoenix.mainnet/
  - /posts/fr.acinq.phoenix.mainnet/
---


After failing to reproduce the build on Google Play in the past, the provider
[invited us to try again](https://twitter.com/PhoenixWallet/status/1294324386418262016)
with their latest release and updated build instructions. So ... here we go:

The [updated build instructions](https://github.com/ACINQ/phoenix/blob/master/BUILD.md#build-the-apk)
are, as they should be, linked on their
[repository's landing page](https://github.com/ACINQ/phoenix). Let's see if we
can reproduce the build for version `1.3.3` which we got from Google Play:

```
$ git clone https://github.com/ACINQ/phoenix
$ cd phoenix/
$ git tag | grep "1\.3\.3"
v1.3.3
$ git checkout v1.3.3 
HEAD is now at fbbf261 Release v1.3.3 (code 14)
$ docker build -t phoenix_build .
...
Successfully built 39f2d4a51567
Successfully tagged phoenix_build:latest
$ docker run --rm -v $(pwd):/home/ubuntu/phoenix/app/build/outputs -w /home/ubuntu/phoenix phoenix_build ./gradlew assemble
...
BUILD SUCCESSFUL in 6m 38s
$ ll apk/release/
-rw-r--r-- 1 root root 1.7K Aug 14 17:23 output.json
-rw-r--r-- 1 root root  23M Aug 14 17:23 phoenix-14-1.3.3-mainnet-arm64-v8a-release.apk
-rw-r--r-- 1 root root  23M Aug 14 17:23 phoenix-14-1.3.3-mainnet-armeabi-v7a-release.apk
-rw-r--r-- 1 root root  33M Aug 14 17:23 phoenix-14-1.3.3-mainnet-universal-release.apk
-rw-r--r-- 1 root root  23M Aug 14 17:23 phoenix-14-1.3.3-mainnet-x86_64-release.apk
-rw-r--r-- 1 root root  23M Aug 14 17:23 phoenix-14-1.3.3-mainnet-x86-release.apk
```

Ok, cool. Compilation is now really convenient. But there is five apps, not one.
Let's see which one we have ...

```
$ apktool d -o fromGoogle fromGoogle.apk 
$ ls fromGoogle/lib/
arm64-v8a  armeabi-v7a  x86  x86_64
```

So with libs for all architectures, we probably have the "universal" which also
happens to be the biggest in above folder listing. So ...

```
$ apktool d -o fromBuild apk/release/phoenix-14-1.3.3-mainnet-universal-release.apk
$ diff --recursive --brief from{Build,Google}
Files fromBuild/apktool.yml and fromGoogle/apktool.yml differ
Only in fromGoogle/original/META-INF: MAINNET.RSA
Only in fromGoogle/original/META-INF: MAINNET.SF
Files fromBuild/original/META-INF/MANIFEST.MF and fromGoogle/original/META-INF/MANIFEST.MF differ
```

This looks good. Some more data for the record:

```
$ git log --show-signature -n 1
commit fbbf261eb1e3be75535de41833524ac73cf8e24e (HEAD, tag: v1.3.3, origin/mainnet)
gpg: Signature made Sat 01 Aug 2020 10:25:31 AM -04
gpg:                using RSA key 87537DE9B6EABCCFB6CCA3A6574C8C6A1673E987
gpg: Can't check signature: No public key
Author: dpad85 <5765435+dpad85@users.noreply.github.com>
Date:   Sat Aug 1 16:25:30 2020 +0200

    Release v1.3.3 (code 14)
$ sha256sum fromGoogle.apk 
29211695f12c794d0e5edc883315810cf29d22e7ad8fdcd1da7755abec6aff4d  fromGoogle.apk
```

This is exactly what we want to see for the verdict: **reproducible**
