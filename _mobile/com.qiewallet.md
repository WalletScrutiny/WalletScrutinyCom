---
wsId: qieWallet
title: QIE Wallet
date: 2026-05-20
authors:
- danny
website: https://qiewallet.qiblockchain.online/
redirect_from:
- /android/com.qiewallet/
- /iphone/org.reactjs.native.QIEWallet/
android:
  appId: com.qiewallet
  users: 1000
  appCountry: us
  released: 2023-06-20
  updated: 2026-07-31
  version: 0.3.72
  icon: com.qiewallet.png
  meta: ok
  verdict: nosource
  developerName: VortX Capital Pty Ltd
iphone:
  appId: org.reactjs.native.QIEWallet
  idd: '6445826746'
  appCountry: us
  released: 2024-05-31
  updated: 2026-07-11
  version: 2.7.5
  reviews: 1
  icon: org.reactjs.native.QIEWallet.jpg
  meta: ok
  verdict: nosource
  developerName: VORTEX PAY (PTY) LTD

---

## Android

## App Description

QIE Wallet is a multi-chain crypto wallet.
It claims support for Bitcoin, Solana, Tron, EVM chains, and other networks.
The website says users can send, receive, stake, and swap across multiple chains.
The App Store listing says the wallet supports Bitcoin.
It also says users control their private keys and recovery phrase.

## Analysis

The early wallet-function checks pass based on the public claims.
The app presents itself as a wallet.
It claims Bitcoin support.
It claims send and receive functionality.
It claims self-custody.

The QIE Wallet website says it is fully non-custodial.
It says users have private-key ownership.
It says users have recovery phrase protection.
The terms call the app an unhosted wallet.
The terms say users store digital assets locally on their own devices.
The terms also say the app can broadcast transactions.

We did not find current Android wallet source code.
The QIE Wallet website links to a GitHub organization.
That organization currently shows one public repository named `qi-chain`.
That repository is for the blockchain network.
It is not the Android wallet app source.

Without the source code for the reviewed Android wallet release, this app cannot be verified.
For WalletScrutiny purposes, the verdict is **nosource**.

Sources:

- [Google Play listing](https://play.google.com/store/apps/details?id=com.qiewallet)
- [QIE Wallet website](https://www.qiewallet.me/)
- [QIE Wallet App Store listing](https://apps.apple.com/us/app/qie-wallet/id6445826746)
- [QIE Wallet terms](https://www.qiewallet.me/terms-of-service)
- [QIE GitHub organization](https://github.com/qie-blockchain)

---

## iPhone

{% include copyFromAndroid.html %}
