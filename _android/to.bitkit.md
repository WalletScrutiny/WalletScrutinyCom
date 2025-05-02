---
wsId: 
title: 'Bitkit: Bitcoin & LN Wallet'
altTitle: 
authors:
- danny
- basantagoswami
- keraliss
users: 1000
appId: to.bitkit
appCountry: 
released: 2024-06-07
updated: 2025-04-02
version: 1.1.0
stars: 
ratings: 
reviews: 
website: https://bitkit.to/
repository: https://github.com/synonymdev/bitkit
issue: https://github.com/synonymdev/bitkit/issues/2414
icon: to.bitkit.png
bugbounty: 
meta: ok
verdict: sourceavailable
appHashes: []
date: 2024-12-25
signer: 422ae8e4c9b4f1288efb27df173e31cadfd7134d61fa5357eb5ed9eae83c75a7
reviewArchive:
- date: 2024-06-16
  version: 1.0.1
  appHashes:
  - 7b571191e0d74c1e9c748574d6c3bdde73851712646d73ae9f3ccf5cb4f06f5d
  gitRevision: 1d915d864d956ae13a1ea1939a7121444ceee3b2
  verdict: nonverifiable
twitter: bitkitwallet
social:
- https://discord.com/invite/DxTBJXvJxn
- https://t.me/bitkitchat
- https://medium.com/synonym-to
- https://www.youtube.com/channel/UCyNruUjynpzvQXNTxbJBLmg
redirect_from: 
developerName: Synonym
features:
- ln

---

## App Description from Google Play

> Bitkit hands you the keys to your money, profile, contacts,and web accounts.
>
> Pay anyone, anywhere, any timeand spend your Bitcoin on the things you value in life.
>
> Send Bitcoin faster than ever. Enjoy instant transactions with friends, family and merchants.
>
> Experience the web without limits: portable profiles & feeds, dynamic contacts, passwordless accounts.

## Analysis 

- The app has a Bech32 BTC address
- The private keys can be backed up in the settings.
- They have a link to their GitHub repository. 

## Update 2024-12-25: 

We tested if the app can be reproduced, by running {% include testScript.html %}.

The script succeeds with a huge diff:

```
===== Begin Results =====
appId:          to.bitkit
signer:         4f707d19ec04d61736f3ca095fd1c14bdae844e68f372ff9e8da74684d4e4f89
apkVersionName: 1.0.7
apkVersionCode: 142
verdict:        
appHash:        b1a2b6520d94bc0cf50af658b1fb433f515b46bc13130725f52f553737a234db
commit:         a8dc479b59cb4b37218336e37ba92847181341c5

Diff:
Files /tmp/fromPlay_to.bitkit_142/AndroidManifest.xml and /tmp/fromBuild_to.bitkit_142/AndroidManifest.xml differ
Files /tmp/fromPlay_to.bitkit_142/assets/dexopt/baseline.prof and /tmp/fromBuild_to.bitkit_142/assets/dexopt/baseline.prof differ
Files /tmp/fromPlay_to.bitkit_142/assets/index.android.bundle and /tmp/fromBuild_to.bitkit_142/assets/index.android.bundle differ
Files /tmp/fromPlay_to.bitkit_142/classes2.dex and /tmp/fromBuild_to.bitkit_142/classes2.dex differ
Files /tmp/fromPlay_to.bitkit_142/classes3.dex and /tmp/fromBuild_to.bitkit_142/classes3.dex differ
Files /tmp/fromPlay_to.bitkit_142/classes.dex and /tmp/fromBuild_to.bitkit_142/classes.dex differ
Only in /tmp/fromBuild_to.bitkit_142: lib
Only in /tmp/fromBuild_to.bitkit_142/res: 2X.ttf
Only in /tmp/fromPlay_to.bitkit_142/res: anim
Only in /tmp/fromPlay_to.bitkit_142/res: animator
Only in /tmp/fromPlay_to.bitkit_142/res: animator-v21
Only in /tmp/fromPlay_to.bitkit_142/res: anim-v21
Only in /tmp/fromPlay_to.bitkit_142/res: anim-v33
Only in /tmp/fromPlay_to.bitkit_142/res: drawable
Only in /tmp/fromPlay_to.bitkit_142/res: drawable-anydpi-v23
Only in /tmp/fromPlay_to.bitkit_142/res: drawable-mdpi-v4
Only in /tmp/fromPlay_to.bitkit_142/res: drawable-v21
Only in /tmp/fromPlay_to.bitkit_142/res: drawable-v23
Only in /tmp/fromPlay_to.bitkit_142/res: drawable-v29
Only in /tmp/fromPlay_to.bitkit_142/res: drawable-watch-v20
Only in /tmp/fromPlay_to.bitkit_142/res: interpolator
Only in /tmp/fromPlay_to.bitkit_142/res: interpolator-v21
Only in /tmp/fromPlay_to.bitkit_142/res: layout
...
Only in /tmp/fromPlay_to.bitkit_142/res: layout-land
Only in /tmp/fromPlay_to.bitkit_142/res: layout-ldrtl-v17
Only in /tmp/fromPlay_to.bitkit_142/res: layout-sw600dp-v13
Only in /tmp/fromPlay_to.bitkit_142/res: layout-v21
Only in /tmp/fromPlay_to.bitkit_142/res: layout-v26
Only in /tmp/fromPlay_to.bitkit_142/res: layout-watch-v20
Only in /tmp/fromPlay_to.bitkit_142/res: mipmap-anydpi-v26
Only in /tmp/fromPlay_to.bitkit_142/res: mipmap-hdpi-v4
Only in /tmp/fromPlay_to.bitkit_142/res: mipmap-mdpi-v4
Only in /tmp/fromPlay_to.bitkit_142/res: mipmap-xhdpi-v4
Only in /tmp/fromPlay_to.bitkit_142/res: mipmap-xxhdpi-v4
Only in /tmp/fromPlay_to.bitkit_142/res: mipmap-xxxhdpi-v4
Only in /tmp/fromPlay_to.bitkit_142/res: raw
Only in /tmp/fromPlay_to.bitkit_142/res: xml
Files /tmp/fromPlay_to.bitkit_142/resources.arsc and /tmp/fromBuild_to.bitkit_142/resources.arsc differ
Only in /tmp/fromPlay_to.bitkit_142: stamp-cert-sha256

Revision, tag (and its signature):

===== End Results =====
```

The diff also contained hundreds of lines of png, xml and webp diffs. 
The key differences between the Play Store and locally built versions:

1. Missing files in build version:
- Multiple resource directories (anim, drawable, layout, etc.)
- stamp-cert-sha256

2. Extra files in build version:
- lib directory
- index.android.jsbundle
- Some font/resource files (2X.ttf, 5c., Ot.)

3. Differing files:
- AndroidManifest.xml
- DEX files (classes.dex, classes2.dex, classes3.dex)
- Bundle files
- Resource archives

With all the diffs, this binary is **not verifiable**.

{% include asciicast %}