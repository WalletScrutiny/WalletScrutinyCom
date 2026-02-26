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
users: 1000000
appId: io.bluewallet.bluewallet
appCountry: 
released: 2018-11-01
updated: 2026-02-23
version: 7.2.6
reviews: 372
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
builds: 
features:
- hd
- multiAccount
- companion
- batching
- foss
- ln
- multiSig
- ownLN
- segwit

---
{% include featureEvidence.html feature="hd" source="[Website](https://bluewallet.io)" quote="Recover on another wallet" %}
{% include featureEvidence.html feature="multiAccount" source="[Website](https://bluewallet.io)" quote="Plausible Deniability Create multiple storages or fake ones in case of a forced disclosure." %}
{% include featureEvidence.html feature="companion" source="[Website](https://bluewallet.io)" quote="Watch-only Wallets Easily connect to your hardware wallet and manage your cold storage." %}

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

{% include featureEvidence.html feature="segwit" quote="SegWit-first. Replace-By-Fee support" source="GitHub README" %}

{% include featureEvidence.html feature="foss" quote="## LICENSE MIT" source="GitHub README" %}

{% include featureEvidence.html feature="multiSig" quote="Multisig Vaults The best security available on the Bitcoin protocol. Create wallets with multiple keys." source="Website" %}

{% include featureEvidence.html feature="batching" quote="Transactions control Choose your fees when sending. Easily Bump, Cancel or Batch transactions." source="Website" %}

{% include featureEvidence.html feature="ownLN" quote="LNDhub LNDhub on VPS with Ubuntu LNDHub on Mac OSX LNDhub with raspibolt Recover lndhub account" source="Website" %}