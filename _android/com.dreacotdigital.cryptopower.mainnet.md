---
wsId: 
title: Cryptopower Wallet
altTitle: 
authors: 
- danny
users: 10
appId: com.dreacotdigital.cryptopower.mainnet
appCountry: 
released: Jan 20, 2024
updated: 2024-01-31
version: 1.1.0
stars: 
ratings: 
reviews: 
website: https://cryptopower.dev/
repository: https://github.com/crypto-power/cryptopower/releases
issue: https://github.com/crypto-power/cryptopower/issues/448
icon: com.dreacotdigital.cryptopower.mainnet.png
bugbounty: 
meta: ok
verdict: fewusers
date: 2024-02-05
signer: 
reviewArchive: 
twitter: 
social: 
redirect_from: 
developerName: Dreacot Digital Limited
features: 

---

## App Description

> Cryptopower is a self-custodial multi-coin wallet application designed for both desktop and mobile platforms. It offers support for creating wallets not only for Decred but also for other cryptocurrencies such as Bitcoin and Litecoin. The app is built using Gio, a Golang library for the implementation of cross-platform user interfaces.

## The App

Crytopower allows you to choose between resoring an existing wallet or creating a new one. Upon creating one, you are given a 33-word seed phrase. Functions such as sending and receiving transactions require that the wallet must first sync with "block headers." This appears to be a self-custodial wallet.

The source code was available on GitHub. 

I was able to build the app via [instructions from GitHub](https://github.com/crypto-power/cryptopower/blob/master/how-to-build-mobile.md). 

I was able to successfully build an apk which was then extracted into built_apk directory, which was then compared with the extracted downloaded apk. 
These were the results:

```
Files base/AndroidManifest.xml and built_apk/AndroidManifest.xml differ
Files base/classes.dex and built_apk/classes.dex differ
Only in built_apk/: lib
Only in built_apk/: META-INF
Only in base/res: xml
Files base/resources.arsc and built_apk/resources.arsc differ
Only in base/: stamp-cert-sha256
```

With these results, if the app was not {% include verdictBadge.html verdict='fewusers' %} we would mark it {% include verdictBadge.html verdict='nonverifiable' %}.