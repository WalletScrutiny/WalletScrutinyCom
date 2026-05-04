---
wsId: 
title: 'Flowee Pay: BitcoinCash Wallet'
altTitle: 
authors:
- danny 
users: 1000
appId: org.flowee.pay
alternativeStores: 
appCountry: 
released: 2023-06-19
updated: 2026-03-16
version: 2026.03.2
reviews: 
website: http://flowee.org
repository: https://codeberg.org/Flowee/pay
icon: org.flowee.pay.png
bugbounty: 
meta: ok
verdict: nobtc
appHashes: 
date: 2026-05-02
signer: 
twitter: 
social: 
redirect_from: 
developerName: XULU.TECH LLC
builds: 
features: 

---

## App Description

Flowee Pay is described as a Bitcoin Cash wallet/payment app. The public source repository is published at `https://codeberg.org/Flowee/pay`.

## Testing and Analysis

The Google Play listing says Flowee Pay is for Bitcoin Cash, and the [Android manifest](https://codeberg.org/Flowee/pay/src/branch/master/android/AndroidManifest.xml) registers `bitcoincash` and `bch-wif` URI schemes. I found no verified source in the Play listing, README, or Android manifest showing BTC support for this app.

This app matches the `nobtc` verdict: it is a wallet, but **not a BTC wallet**.
