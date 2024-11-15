---
wsId: 
title: 'BitBanana: Bitcoin & Lightning'
altTitle: 
authors:
- danny
- keraliss
users: 1000
appId: app.michaelwuensch.bitbanana
appCountry: 
released: 2023-03-26
updated: 2024-10-25
version: 0.8.7
stars: 
ratings: 
reviews: 
size: 
website: https://bitbanana.app/
repository: https://github.com/michaelWuensch/BitBanana
issue: https://github.com/michaelWuensch/BitBanana/issues/95
icon: app.michaelwuensch.bitbanana.png
bugbounty: 
meta: ok
verdict: nonverifiable
date: 2024-10-21
signer: 
reviewArchive: 
twitter: BitBananaApp
social:
- https://discord.gg/Xg85BuTc9A
- >-
  https://snort.social/p/npub1dwn7wphjhrlej6ks4sktgn77w82ayq6hn6lj37ll75tav55nd3vq07xzaj
redirect_from: 
developerName: Michael Wünsch
features: 

---

### Update on 2024-10-21

We followed the build instructions from the repository and successfully generated the APK. Additionally, we retrieved the official APK from the Play Store for comparison.

To compare the two APKs, we extracted the contents of both using these commands : 
`unzip -qqd fromOfficial *.apk`
`unzip -qqd fromBuild *.apk`

and ran the following command to identify any differences:

`diff --brief --recursive fromBuild/ fromOfficial/`

The comparison resulted in several differences between the two APKs:

```
Files fromBuild/classes2.dex and fromOfficial/classes2.dex differ
Files fromBuild/classes3.dex and fromOfficial/classes3.dex differ
Files fromBuild/classes5.dex and fromOfficial/classes5.dex differ
Only in fromOfficial/: lib
Only in fromBuild/res: anim
Only in fromBuild/res: animator
Only in fromBuild/res: animator-v21
Only in fromBuild/res: anim-v21
Only in fromBuild/res: drawable
Only in fromBuild/res: drawable-anydpi-v23
Only in fromBuild/res: drawable-v21
Only in fromBuild/res: drawable-v23
Only in fromBuild/res: drawable-watch-v20
Only in fromOfficial/res: E5.ogg
Only in fromBuild/res: interpolator
Only in fromBuild/res: interpolator-v21
Only in fromBuild/res: layout
Only in fromBuild/res: layout-land
Only in fromBuild/res: layout-sw600dp-v13
Only in fromBuild/res: layout-v21
Only in fromBuild/res: layout-v26
Only in fromBuild/res: layout-watch-v20
Only in fromBuild/res: menu
Only in fromBuild/res: mipmap-anydpi-v26
Only in fromBuild/res: mipmap-hdpi-v4
Only in fromBuild/res: mipmap-mdpi-v4
Only in fromBuild/res: mipmap-xhdpi-v4
Only in fromBuild/res: mipmap-xxhdpi-v4
Only in fromBuild/res: mipmap-xxxhdpi-v4
Only in fromBuild/res: raw
Only in fromOfficial/res: rM.txt
Only in fromBuild/res: xml
Files fromBuild/resources.arsc and fromOfficial/resources.arsc differ
Only in fromBuild/: stamp-cert-sha256
```

There were also 900+ lines of diff containing png, webp and xml changes. Given the extent of these differences, we conclude that the APK is **not verifiable** at this time. 

## App Description from Google Play

> BitBanana is a native android app for node operators focused on user experience and ease of use. While it is not a wallet on its own, BitBanana works like a remote control allowing you to use your node as a wallet wherever you go. The app is designed with an educational approach, providing the user with guidance on every aspect of node operation.

## Analysis

While not explicitly a wallet, it does incorporate features that are akin to a wallet. The user initializes by connecting to a bitcoin lightning node. Once connected to a node, features such as backup, restore and other wallet features such as send and receive are made available. 

The provider has provided links to F-Droid and has self-described as reproducible. This app is [**for verification**](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/512)

