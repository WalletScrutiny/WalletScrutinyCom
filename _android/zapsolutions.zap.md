---
wsId: zapwallet
title: "Zap: Bitcoin Lightning Wallet"
altTitle: 
authors:
- leo
users: 10000
appId: zapsolutions.zap
released: 
updated: 2021-10-03
version: "Varies with device"
stars: 
ratings: 
reviews: 
size: Varies with device
website: http://zap.jackmallers.com
repository: https://github.com/LN-Zap/zap-android
issue: https://github.com/LN-Zap/zap-android/issues/161
icon: zapsolutions.zap.png
bugbounty: 
verdict: reproducible
date: 2021-10-19
signer: 
reviewArchive:
- date: 2021-09-17
  version: "0.5.1-beta"
  appHash: dbf21e0cfb7f0bc238e9f24e123777f12e497ad574ada282a82e5dd98fa98d47
  gitRevision: 9c3e5354adbf260f11e947f9231e2b24df32cbd6
  verdict: reproducible
- date: 2021-04-27
  version: "0.4.1-beta"
  appHash: b0d049c45d3ab8bac242779795f330d47f207f44050e1b386f9488ea371feda2
  gitRevision: 56e73c40348acc80b6d550a4f32a52b84fc3f3cb
  verdict: reproducible
- date: 2020-12-22
  version: "0.4.0-beta"
  appHash: cbf97dd8ecd9431c9ef7913eafa4f3473371d315fd18dc8d5218f44e99f72e65
  gitRevision: 701487613103f0ab3d9b7a2f2b8d0ff088a62356
  verdict: reproducible
- date: 2020-12-22
  version: "0.3.8-beta"
  appHash: 0902d86d218d385d627e943828fddc083689aa5998c4ae87e972e4b8625073d5
  gitRevision: 9b5efb649d21a3462d8abad571d0835976531aa5
  verdict: reproducible
- date: 2019-12-30
  version: "0.2.11"
  appHash: 
  gitRevision: 9c088d356d066f33c3e3d8fa21bc7d74082c1118
  verdict: nonverifiable

providerTwitter: ln_zap
providerLinkedIn: 
providerFacebook: 
providerReddit: 

redirect_from:
  - /posts/zapsolutions.zap/
---


Here is the output using our
[test script](https://gitlab.com/walletscrutiny/walletScrutinyCom/blob/master/test.sh)
on the binary from Google Play:

```
Results:
appId:          zapsolutions.zap
signer:         24a0e944a65d8cea692653e1a132a042c37be334f1b0b4200575fee6f46eca86
apkVersionName: 0.5.2-beta
apkVersionCode: 3032
verdict:        reproducible
appHash:        f248710d319b11e37bc805fc7dbd5c27043a9a212f4359847126797d7af25757
commit:         ddc7215f67776be17a7c6567556d39f7d6a9c921

Diff:
Only in /tmp/fromPlay_zapsolutions.zap_3032/META-INF: CERT.RSA
Only in /tmp/fromPlay_zapsolutions.zap_3032/META-INF: CERT.SF
Only in /tmp/fromPlay_zapsolutions.zap_3032/META-INF: MANIFEST.MF
```

That's how it should look like to give it the verdict: **reproducible**.

# About the app

This app is a remote control for lnd, the lightning network daemon. As such it
is not exactly a wallet in the sense of many other wallets here as the lnd
connected to, also has control over the funds but in a setup where you connect
to your own lnd, Zap gets into the position of being able to steal your funds.
If you have strong objections with the classification as a wallet, please open
an issue on our GitLab.