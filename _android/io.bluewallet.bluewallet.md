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
updated: 2024-05-09
version: 6.6.5
stars: 3.8
ratings: 1810
reviews: 314
size: 
website: https://bluewallet.io
repository: https://github.com/bluewallet/bluewallet
issue: https://github.com/BlueWallet/BlueWallet/issues/6409
icon: io.bluewallet.bluewallet.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-04-28
signer: 42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
reviewArchive:
- date: 2024-04-13
  version: 6.6.1
  appHash: 65840ba3a127285f3f76f6471dfe004c4ad9a213b17f56eb3a2d41a4eaf58831
  gitRevision: 586adcbba1184aefe8934a5deeea398a079e4521
  verdict: nonverifiable
- date: 2024-04-11
  version: 6.6.0
  appHash: 57032d9016e70c7e6b40bb12c1c836514c8ed88b707ded9f1bfcdfa7afc53354
  gitRevision: 751ed3179997adb455ae23b0a4d44e1d6c50f929
  verdict: nonverifiable
- date: 2024-03-21
  version: 6.5.9
  appHash: 7212a960b945a86b7ce7338130eaed24e4b1aac1eb0008e1cbd12c5502726766
  gitRevision: 540359a8e54b09cd2c779908dc00d772d77a7234
  verdict: nonverifiable
- date: 2024-02-06
  version: 6.5.1
  appHash: ffc2ee373de218e4fa162ad8b65677f6eceb32b6b24d23af395e352cab085460
  gitRevision: 80d0c8aa9368ff937978998edd03fe4ded1875fe
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
procedure expressed in our {% include testScript.html %}. 

The script succeeds with a huge diff:

```
===== Begin Results =====
appId:          io.bluewallet.bluewallet
signer:         42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
apkVersionName: 6.6.3
apkVersionCode: 1714323049
verdict:        
appHash:        e1aefc8b1e60110b6a4898b918e881067ec9ae1c51791250e4c280924b3a87d7
commit:         e4b0eac345e6c8174088439765180f254aaeafa0

Diff:
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/AndroidManifest.xml and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/AndroidManifest.xml differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/assets/dexopt/baseline.prof and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/assets/dexopt/baseline.profm and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/assets/dexopt/baseline.profm differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/assets/index.android.bundle and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/assets/index.android.bundle differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/classes3.dex and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/classes3.dex differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/arm64-v8a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/arm64-v8a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/arm64-v8a/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/arm64-v8a/librnscreens.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/armeabi-v7a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/armeabi-v7a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/armeabi-v7a/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/armeabi-v7a/librnscreens.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/x86/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/x86/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/x86/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/x86/librnscreens.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/x86_64/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/x86_64/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/lib/x86_64/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/lib/x86_64/librnscreens.so differ
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/META-INF: MANIFEST.MF
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/AB.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/AB.png differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/k5.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/k5.png differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/Lp.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/Lp.png differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/pV.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/pV.png differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/U4.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/U4.png differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/xL.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/xL.png differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/YG.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/YG.png differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1714323049/res/Yk.png and /tmp/fromBuild_io.bluewallet.bluewallet_1714323049/res/Yk.png differ
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1714323049: stamp-cert-sha256

Revision, tag (and its signature):
object e4b0eac345e6c8174088439765180f254aaeafa0
type commit
tag v6.6.3
tagger Marcos Rodriguez Velez <marcospr@pm.me> 1714320919 -0400

v6.6.3
===== End Results =====
```

This binary is **not verifiable**.
