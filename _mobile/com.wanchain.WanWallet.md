---
wsId: WanWallet
title: WanWallet
date: 2026-10-30
authors:
- danny
website: https://www.wanchain.org
twitter: wanchain_org
social:
- https://www.facebook.com/wanchainfoundation
- https://www.reddit.com/r/wanchain
- https://github.com/wanchain
appCountry: us
redirect_from:
- /android/com.wanchain.WanWallet/
- /iphone/org.wanchain.WanWallet/
android:
  appId: com.wanchain.WanWallet
  users: 10000
  released: 2019-08-18
  updated: 2021-04-25
  version: '5.0'
  reviews: 11
  icon: com.wanchain.WanWallet.webp
  meta: removed
  verdict: nosource
iphone:
  appId: org.wanchain.WanWallet
  idd: 1477039507
  appCountry: us
  released: 2019-08-22
  updated: 2022-07-27
  version: '6.0'
  reviews: 24
  icon: org.wanchain.WanWallet.webp
  meta: removed
  verdict: nosource
  developerName: Wanchain LTD

---

## Android

**Update 2026-10-30:** WanWallet mobile is still gone from Google Play, and Wanchain has dropped it. The [wallets page](https://www.wanchain.org/wanwallet) on wanchain.org now sends mobile users to {% include walletLink.html wallet='android/io.metamask' verdict='true' %}, and offers WanWallet only for desktop. Wanchain itself is still active. We found no source code for the mobile app in the [Wanchain GitHub organization](https://github.com/wanchain). The desktop wallet repository linked below now returns 404 ([archived copy](https://web.archive.org/web/20241222163811/https://github.com/wanchain/wan-wallet-desktop)); only a [binary release repository](https://github.com/wanchain/wan-desktop-wallet-release) remains. The verdict stays {% include verdictBadge.html verdict="nosource" type='short' %}.

**Update 2022-03-30**: This app is not available anymore.

**Update 2021-11-23**: There's no source code for the android app on
[their Github](https://github.com/wanchain), making the app **not verifiable.**

## App Description
WanWallet was developed by Wanchain Foundation. It says that it supports Wanchain Galaxy Consensus Staking, which they also call "PoS Staking."

> You can manage your Wanchain assets and stake your Wancoins to receive staking rewards using Wanchain Wallet.
>
> Wanchain Wallet is a non-custodial wallet, which means you own the keys and you are in control. Wanchain Foundation will never ask you for your HD seed phrase under any circumstances.

## The App
We tried the app. We are immediately greeted with the option to create a wallet or import one.

We chose to create a wallet and were asked to enter a password. Then, we are provided with a 12-word seed phrase, and told to record it in a safe place, preferably offline. The app noting that:

> the Wanchain team will never ask for your seed phrase.


Wanchain has a Github account with repositories for apps and SDKs. Their [**repository for the desktop wallet**](https://github.com/wanchain/wan-wallet-desktop) is publicly available source code with build instructions.

At the moment, we will [wait for the source-code to be tested](https://gitlab.com/walletscrutiny/walletScrutinyCom/-/issues/354) and proved reproducible before making a verdict.

---

## iPhone

**Update 2026-10-30:** The iPhone app is still missing from the App Store, and Wanchain's [wallets page](https://www.wanchain.org/wanwallet) points iPhone users to {% include walletLink.html wallet='iphone/io.metamask.MetaMask' verdict='true' %} instead. The verdict stays {% include verdictBadge.html verdict="nosource" type='short' %}.

{% include copyFromAndroid.html %}
