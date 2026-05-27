---
wsId: OneKey
title: OneKey - Safe Crypto Wallet
date: 2022-03-07
authors:
- danny
- leo
website: https://onekey.so
twitter: OneKeyHQ
social:
- https://www.reddit.com/r/OneKeyHQ
appCountry: us
redirect_from:
- /android/com.bixin.wallet.mainnet/
- /iphone/com.onekey.wallet/
android:
  appId: com.bixin.wallet.mainnet
  users: 5000
  released: 2020-09-16
  updated: 2022-02-15
  version: 2.12.3
  reviews: 10
  icon: com.bixin.wallet.mainnet.png
  meta: removed
  verdict: nosource
iphone:
  appId: com.onekey.wallet
  idd: 1568432215
  released: 2021-06-01
  updated: 2021-11-19
  version: 2.12.2
  reviews: 18
  icon: com.onekey.wallet.jpg
  meta: removed
  verdict: nosource

---

## Android

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

[Article: What is the private key?](https://help.onekey.so/hc/en-us/articles/360001992896-What-is-the-private-key-#deadLink)

[Article: What if OneKey goes out of business?](https://help.onekey.so/hc/en-us/articles/360002092496-What-if-OneKey-goes-out-of-business-#deadLink)

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

An issue has been opened at [https://github.com/OneKeyHQ/android_app/issues/1#deadLink](https://github.com/OneKeyHQ/android_app/issues/1#deadLink)

---

## iPhone

**Update 2022-02-26**: This app is not available anymore.

{% include copyFromAndroid.html %}
