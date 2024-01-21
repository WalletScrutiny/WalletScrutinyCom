---
wsId: bluewallet
title: BlueWallet Bitcoin Wallet
altTitle: 
authors:
- emanuel
- Mohammad Rafigh
- leo
users: 100000
appId: io.bluewallet.bluewallet
appCountry: 
released: 2018-11-01
updated: 2024-01-18
version: 6.4.16
stars: 4
ratings: 1810
reviews: 297
size: 
website: https://bluewallet.io
repository: https://github.com/bluewallet/bluewallet
issue: https://github.com/BlueWallet/BlueWallet/issues/5700
icon: io.bluewallet.bluewallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-01-21
signer: 42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
reviewArchive:
- date: 2023-12-30
  version: "6.4.13"
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
apkVersionName: 6.4.16
apkVersionCode: 1705533207
verdict:        
appHash:        8fae7cd0dbc1f9703094cc27875753bacbda3d073a906e0ec269a631658b8794
commit:         3114dbb1856271c43b82dc96333b4f2b4a230f0b

Diff:
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/AndroidManifest.xml and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/AndroidManifest.xml differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/assets/dexopt/baseline.prof and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/assets/index.android.bundle and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/assets/index.android.bundle differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/classes3.dex and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/classes3.dex differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/lib/arm64-v8a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/lib/arm64-v8a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/lib/armeabi-v7a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/lib/armeabi-v7a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/lib/x86/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/lib/x86/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/lib/x86_64/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1705533207/lib/x86_64/libreanimated.so differ
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1705533207/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1705533207: stamp-cert-sha256

Revision, tag (and its signature):
object 3114dbb1856271c43b82dc96333b4f2b4a230f0b
type commit
tag v6.4.16
tagger Marcos Rodriguez Velez <marcospr@pm.me> 1705579149 -0400

v6.4.16
===== End Results =====
```

But the Play Store version differs widely from what we built from source.

Looking at the files using diffoscope, there is no clear picture as to what is
going on. This product is **not verifiable**.

A recording of the test:

{% include asciicast %}
