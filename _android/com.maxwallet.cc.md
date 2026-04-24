---
wsId: maxwallet
title: MaxWallet
altTitle: 
authors:
- danny 
users: 5000
appId: com.maxwallet.cc
appCountry: 
released: 
updated: 2026-03-26
version: 1.2.0
reviews: 
website: https://maxwallet.cc/contact-us
repository: 
icon: com.maxwallet.cc.png
bugbounty: 
meta: ok
verdict: nosource
appHashes: 
date: 2026-01-14
signer: 
twitter: MaxWalletEN
social:
- https://t.me/maxwalletapp 
redirect_from: 
developerName: MaxWallet
builds: 
features: 

---

## App Description

MaxWallet is a multi-platform cryptocurrency wallet offering Android, iOS, and desktop downloads (Windows, macOS, Linux) via its official site (https://maxwallet.cc/). The Google Play listing claims support for Bitcoin and multiple other assets, along with features such as swaps, staking, and integration with third-party services. The website distributes the Android APK directly (max_wallet.apk) and provides installers for desktop operating systems.

## Analysis

We installed and tested MaxWallet on Android. The app provides a seed phrase on wallet creation and supports sending and receiving Bitcoin — results are documented in this [video posted on X](https://x.com/BitcoinWalletz/status/2047611674589536568). However, no source code repository is linked on the website, and a search of GitHub yields no public repository attributable to MaxWallet or its parent platform MaxSwap. With no source code available, there is no way to independently verify how the wallet handles private keys, whether the seed phrase implementation is correct, or whether user funds are at risk. **Because the source code is not available, this wallet cannot be verified.**