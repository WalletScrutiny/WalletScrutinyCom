---
wsId: zapwallet
title: "Zap: Bitcoin Lightning Wallet"
altTitle: 
authors:
- leo
users: 10000
appId: zapsolutions.zap
released: 
latestUpdate: 2021-04-03
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
verdict: reproducible # wip fewusers nowallet nobtc obfuscated custodial nosource nonverifiable reproducible bounty defunct
date: 2021-04-27
signer: 
reviewArchive:
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
apkVersionName: 0.4.1-beta
apkVersionCode: 3028
appHash:        b0d049c45d3ab8bac242779795f330d47f207f44050e1b386f9488ea371feda2

Diff:
Files /tmp/fromPlay_zapsolutions.zap_3028/apktool.yml and /tmp/fromBuild_zapsolutions.zap_3028/apktool.yml differ
Only in /tmp/fromPlay_zapsolutions.zap_3028/original/META-INF: CERT.RSA
Only in /tmp/fromPlay_zapsolutions.zap_3028/original/META-INF: CERT.SF
Only in /tmp/fromPlay_zapsolutions.zap_3028/original/META-INF: MANIFEST.MF
```

That's how it should look like to give it the verdict: **reproducible**.

# About the app

This app is a remote control for lnd, the lightning network daemon. As such it
is not exactly a wallet in the sense of many other wallets here as the lnd
connected to, also has control over the funds but in a setup where you connect
to your own lnd, Zap gets into the position of being able to steal your funds.
If you have strong objections with the classification as a wallet, please open
an issue on our GitLab.