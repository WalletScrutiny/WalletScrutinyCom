---
wsId: OneKey
title: OneKey - Safe Crypto Wallet
altTitle: 
authors:
- danny
- leo
users: 5000
appId: com.bixin.wallet.mainnet
appCountry: us
released: 2020-09-16
updated: 2022-02-15
version: 2.12.3
stars: 4.7
ratings: 315
reviews: 10
website: https://onekey.so
repository: 
issue: https://github.com/OneKeyHQ/android_app/issues/1
icon: com.bixin.wallet.mainnet.png
bugbounty: 
meta: removed
verdict: nosource
appHashes: 
date: 2023-01-02
signer: 
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
redirect_from: 
developerName: 
features: 

---

This app is the companion app of {% include walletLink.html wallet='hardware/onekey' verdict='true' %}.

**Updated Review 2022-01-05**: Hunting for the firmware source code and Android source has resulted in the [request](https://github.com/OneKeyHQ/firmware/issues/17) for the following in OneKey's GitHub page:

> link to the correct firmware and bootloader repositories
> link to the signed binaries for every release
> document how the hardware wallet asks the user for approval, at least optionally showing the binary's hash, so the user can make sure he's installing what he wants to install

## App Description

> - Works with OneKey hardware wallet. Never access the Internet, safer offline storage of assets.
> - Seeds & recovery phrases are created, encrypted, and stored locally. So that only you can access them.
> - Open source, including code and hardware design.
> - **We do not store any of the user's private data.**
> - Multi-platform supports, including Android, iOS, MacOS, Windows, Linux

## The Site

[Article: What is the private key?](https://help.onekey.so/hc/en-us/articles/360001992896-What-is-the-private-key-)

[Article: What if OneKey goes out of business?](https://help.onekey.so/hc/en-us/articles/360002092496-What-if-OneKey-goes-out-of-business-)

> First and foremost, OneKey aspires to be a 100-year corporation!
>
> Second, even if OneKey goes bankrupt, your assets will be unaffected.
> 
> Your funds are stored on the blockchain, not on OneKey, and you can easily recover them by importing the mnemonic into a wallet that implements the BIP39 protocol.

## The App

We downloaded the app. 

The first options were to Create or Restore a wallet. If you select 'Create' you are then given the chance to choose different cryptocurrencies. You are then asked to backup the 12-word seed phrase. 

## Verdict

This app is evidently **self-custodial**. The repository only contains *one commit* from March 26, 2021 and the Google Play app has last been updated on June 29, 2021. Due to **missing sources,** we conclude that this app is **not verifiable.**

