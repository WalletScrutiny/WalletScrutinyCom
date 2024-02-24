---
wsId: bluewallet
title: BlueWallet Bitcoin Wallet
altTitle: 
authors:
- emanuel
- Mohammad Rafigh
- leo
- danny
users: 100000
appId: io.bluewallet.bluewallet
appCountry: 
released: 2018-11-01
updated: 2024-02-17
version: 6.5.4
stars: 3.9
ratings: 1810
reviews: 304
size: 
website: https://bluewallet.io
repository: https://github.com/bluewallet/bluewallet
issue: https://github.com/BlueWallet/BlueWallet/issues/758
icon: io.bluewallet.bluewallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-02-06
signer: 42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
reviewArchive:
- date: 2024-02-06
  version: 6.5.1
  appHash: ffc2ee373de218e4fa162ad8b65677f6eceb32b6b24d23af395e352cab085460
  gitRevision: c06b7234b0f88e2c38af59d8364a7218ea9c477c
  verdict: nonverifiable
- date: 2024-01-21
  version: 6.4.16
  appHash: 8fae7cd0dbc1f9703094cc27875753bacbda3d073a906e0ec269a631658b8794
  gitRevision: 53616e364b4822bfc14d8c4ec5223732e3fed962
  verdict: nonverifiable
- date: 2023-12-30
  version: 6.4.13
  appHash: 2ae917d3b7124dd4d3a5ea38749d999da0beb553eee251685852a99a6cb6db23
  gitRevision: 296bcdee928006170300cbdd85df642fb326c9e7
  verdict: nonverifiable
- date: 2023-11-09
  version: 6.4.10
  appHash: 
  gitRevision: 84f640d3d610bf8f9947f44b154cd51056520854
  verdict: ftbfs
- date: 2023-10-08
  version: 6.4.8
  appHash: 
  gitRevision: 55c2cb89d543d8196128e02299145e804744698c
  verdict: ftbfs
- date: 2023-06-24
  version: 6.4.5
  appHash: d6b8c5235b742ddcbde680eba9851d6c8b1477c86f5577a794dd9961fcf8a6df
  gitRevision: c0e1ed7e183c9ef5730cb8b77829e7a1640739b1
  verdict: reproducible
- date: 2023-05-21
  version: 6.4.4
  appHash: 566dfd2e6d98cac8fdc2124800947c1ae5f555bdb86396f928ab69c90c7a0e60
  gitRevision: f2b4536854aee3468ad1e8a25abb3959ff666bba
  verdict: reproducible
- date: 2020-07-14
  version: 6.3.2
  appHash: 
  gitRevision: 0f9bcb13a75554cb34a522e07aa2cfeb4048480c
  verdict: custodial
- date: 2020-01-08
  version: 4.9.1
  appHash: 
  gitRevision: 21cb412a4e74b14bd6124c3e3be855d6b96ef589
  verdict: nonverifiable
twitter: bluewalletio
social:
- https://www.reddit.com/r/bluewallet
redirect_from:
- /bluewallet/
- /io.bluewallet.bluewallet/
- /posts/2019/12/bluewallet/
- /posts/io.bluewallet.bluewallet/
developerName: BlueWallet Services S. R. L.
features:
- ln

---

Here we test if the latest version can be reproduced, following the known
procedure expressed in our {% include testScript.html %}:

```
===== Begin Results =====
appId:          io.bluewallet.bluewallet
signer:         42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
apkVersionName: 6.5.1
apkVersionCode: 1707001641
verdict:        
appHash:        ffc2ee373de218e4fa162ad8b65677f6eceb32b6b24d23af395e352cab085460
commit:         f6a759840344b0430e62d30f0a3faf22bcc6614b

Diff:
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/AndroidManifest.xml and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/AndroidManifest.xml differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/assets/dexopt/baseline.prof and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/assets/dexopt/baseline.profm and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/assets/dexopt/baseline.profm differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/assets/index.android.bundle and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/assets/index.android.bundle differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/classes3.dex and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/classes3.dex differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/lib/arm64-v8a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/lib/arm64-v8a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/lib/armeabi-v7a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/lib/armeabi-v7a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/lib/x86/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/lib/x86/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/lib/x86_64/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1707001641/lib/x86_64/libreanimated.so differ
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1707001641/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1707001641: stamp-cert-sha256

Revision, tag (and its signature):
object f6a759840344b0430e62d30f0a3faf22bcc6614b
type commit
tag v6.5.1
tagger Marcos Rodriguez Velez <marcospr@pm.me> 1707001751 -0400

v6.5.1
===== End Results =====
```

But the Play Store version differs widely from what we built from source. This
product is **not reproducible**.

A recording of the test:

{% include asciicast %}
