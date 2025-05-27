---
wsId: bluewallet
title: BlueWallet Bitcoin Wallet
altTitle: 
authors:
- emanuel
- Mohammad Rafigh
- leo
- danny
- keraliss
users: 500000
appId: io.bluewallet.bluewallet
appCountry: 
released: 2018-11-01
updated: 2025-05-12
version: 7.1.8
stars: 4
ratings: 1810
reviews: 345
website: https://bluewallet.io
repository: https://github.com/bluewallet/bluewallet
issue: https://github.com/BlueWallet/BlueWallet/issues/6409
icon: io.bluewallet.bluewallet.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes:
- b804c755ffe38efd9cdef7352e71aa6d014243cd9d21cdee0e474fb54ff8c7c9
date: 2025-02-26
signer: 42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
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

The script succeeds. However it results in a huge diff. Many discrepancies were found between the built and downloaded apps' libraries:

```
===== Begin Results =====
appId:          io.bluewallet.bluewallet
signer:         42250147991337ed230fbd93c0be0e5f6183d02eed9e1d53e5aac94167cf3f2f
apkVersionName: 7.1.0
apkVersionCode: 1739117222
verdict:        
appHash:        b804c755ffe38efd9cdef7352e71aa6d014243cd9d21cdee0e474fb54ff8c7c9
commit:         8b531350af3b56cc1d39203c3dd1680ff2910d44

Diff:
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/AndroidManifest.xml and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/AndroidManifest.xml differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/assets/dexopt/baseline.prof and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/assets/index.android.bundle and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/assets/index.android.bundle differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/classes3.dex and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/classes3.dex differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/librealm.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/librealm.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/librnscreens.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/libworklets.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/arm64-v8a/libworklets.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/librealm.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/librealm.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/librnscreens.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/libworklets.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/armeabi-v7a/libworklets.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86/librealm.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86/librealm.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86/librnscreens.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86/libworklets.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86/libworklets.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86_64/librealm.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86_64/librealm.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86_64/libreanimated.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86_64/libreanimated.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86_64/librnscreens.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86_64/librnscreens.so differ
Files /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/lib/x86_64/libworklets.so and /tmp/fromBuild_io.bluewallet.bluewallet_1739117222/lib/x86_64/libworklets.so differ
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/META-INF: GOOGPLAY.RSA
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/META-INF: GOOGPLAY.SF
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1739117222/META-INF: MANIFEST.MF
Only in /tmp/fromPlay_io.bluewallet.bluewallet_1739117222: stamp-cert-sha256

===== End Results =====
```

This binary is **not verifiable**. 

{% include asciicast %}
